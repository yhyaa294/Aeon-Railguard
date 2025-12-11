'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useDetectionStream } from '@/hooks/useDetectionStream';

// ========= TYPES =========
type TabType = 'ALL' | 'TITIK_A' | 'TITIK_B' | 'TITIK_C' | 'TITIK_D';
type ViewType = 'MONITORING' | 'ANALYTICS' | 'ARCHIVE' | 'COMMUNICATION' | 'TRAIN_COMMS' | 'SCHEDULE' | 'MAP' | 'SETTINGS';
type ChannelType = 'JPL_COORD' | 'STATION_REPORT';
type ScheduleStatus = 'PASSED' | 'INCOMING' | 'LATE';
type ScheduleFilter = 'ALL' | 'INCOMING' | 'LATE';

type MediaSource = {
  kind: 'stream' | 'file';
  src: string;
  poster?: string;
  label?: string;
};

interface CameraPoint { id: TabType; name: string; location: string; status: 'AMAN' | 'WASPADA' | 'BAHAYA'; media: MediaSource; confidence: number; violations: number; }
interface EvidenceItem { id: string; time: string; date: string; location: string; locationType: string; violationType: 'menerobos' | 'berhenti' | 'nekat'; thumbnail: string; duration: string; description: string; speed: string; platNomor: string; }
interface RadioMessage { id: string; sender: string; time: string; message: string; isOwn: boolean; isAudio: boolean; }
interface TrainScheduleItem { id: string; noKA: string; nama: string; relasi: string; tujuan: string; jadwal: string; realisasi: string; status: ScheduleStatus; delay?: number; }
interface MapMarker { id: string; name: string; location: string; top: string; left: string; type: 'POST' | 'CCTV'; status: 'ONLINE' | 'WARNING' | 'OFFLINE'; }

// ========= DATA =========
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const STREAM_URL = process.env.NEXT_PUBLIC_STREAM_URL || `${API_BASE}/stream/cam1`;
const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_URL || '/api/media';
const EVIDENCE_BASE = process.env.NEXT_PUBLIC_EVIDENCE_URL || `${API_BASE}/evidence`;
const DETECTION_API = `${API_BASE}/api/detections`;

const cameraPoints: CameraPoint[] = [
  {
    id: 'TITIK_A',
    name: 'TITIK A',
    location: 'Jalur Tikus Sawah',
    status: 'AMAN',
    media: { kind: 'stream', src: `${API_BASE}/stream/cam1`, label: 'WEBCAM LIVE' },
    confidence: 98,
    violations: 28
  },
  {
    id: 'TITIK_B',
    name: 'TITIK B',
    location: 'Gg. Masjid',
    status: 'WASPADA',
    media: { kind: 'file', src: `${MEDIA_BASE}?file=VID_20251207_142042915.mp4`, poster: '/images/feed-track.jpg', label: 'Dataset #1' },
    confidence: 87,
    violations: 67
  },
  {
    id: 'TITIK_C',
    name: 'TITIK C',
    location: 'Simpang Sekolah',
    status: 'AMAN',
    media: { kind: 'file', src: `${MEDIA_BASE}?file=VID_20251207_142443358.mp4`, poster: '/images/feed-street.jpg', label: 'Dataset #2' },
    confidence: 95,
    violations: 32
  },
  {
    id: 'TITIK_D',
    name: 'TITIK D',
    location: 'Pasar Kaget',
    status: 'AMAN',
    media: { kind: 'file', src: `${MEDIA_BASE}?file=VID_20251207_142949636.mp4`, poster: '/images/feed-track.jpg', label: 'Dataset #3' },
    confidence: 92,
    violations: 15
  },
];

// ========= REAL DATA - Loaded from Backend =========
// trainInfo, evidenceList, jplMessages, stationMessages
// are now loaded dynamically from WebSocket/API instead of hardcoded

// ========= REAL TRAIN SCHEDULE - JPL 305 NGEMBE =========
interface RealTrainItem { id: string; name: string; relation: string; time: string; }

const REAL_TRAIN_SCHEDULE: RealTrainItem[] = [
  { id: 'KA-01', name: 'Bima', relation: 'Surabaya Gubeng - Gambir', time: '20:12' },
  { id: 'KA-02', name: 'Turangga', relation: 'Surabaya Gubeng - Bandung', time: '20:52' },
  { id: 'KA-03', name: 'Jayakarta', relation: 'Sby Gubeng - Pasarsenen', time: '14:45' },
  { id: 'KA-04', name: 'Mutiara Selatan', relation: 'Sby Gubeng - Bandung', time: '19:08' },
  { id: 'KA-05', name: 'Pasundan', relation: 'Kiaracondong - Sby Gubeng', time: '23:34' },
  { id: 'KA-06', name: 'Bangunkarta', relation: 'Jombang - Pasarsenen', time: '06:55' },
  { id: 'KA-07', name: 'Gaya Baru Malam', relation: 'Pasarsenen - Sby Gubeng', time: '22:32' },
  { id: 'KA-08', name: 'Sancaka', relation: 'Yogyakarta - Sby Gubeng', time: '20:03' },
  { id: 'KA-09', name: 'Argo Wilis', relation: 'Bandung - Sby Gubeng', time: '16:21' },
  { id: 'KA-10', name: 'Argo Semeru', relation: 'Gambir - Sby Gubeng', time: '15:47' },
  { id: 'KA-11', name: 'Ranggajati', relation: 'Cirebon - Jember', time: '15:25' },
  { id: 'KA-12', name: 'Sri Tanjung', relation: 'Ketapang - Lempuyangan', time: '15:36' },
  { id: 'KA-13', name: 'Logawa', relation: 'Purwokerto - Jember', time: '13:49' },
  { id: 'KA-14', name: 'Wijayakusuma', relation: 'Cilacap - Ketapang', time: '22:11' },
  { id: 'KA-15', name: 'Logawa', relation: 'Dari Purwokerto', time: '11:43' },
  { id: 'KA-16', name: 'Wijayakusuma', relation: 'Dari Cilacap', time: '19:17' },
  { id: 'KA-17', name: 'Mutiara Timur', relation: 'Dari Yogyakarta', time: '01:19' },
  { id: 'KA-18', name: 'Ranggajati', relation: 'Dari Cirebon', time: '10:18' },
  { id: 'KA-19', name: 'Argo Wilis', relation: 'Dari Bandung', time: '07:53' },
  { id: 'KA-20', name: 'Bima', relation: 'Dari Gambir', time: '18:03' },
  { id: 'KA-21', name: 'Turangga', relation: 'Dari Bandung', time: '19:38' },
  { id: 'KA-22', name: 'Gaya Baru Malam', relation: 'Dari Pasarsenen', time: '13:08' },
  { id: 'KA-23', name: 'Mutiara Selatan', relation: 'Dari Bandung', time: '20:43' },
  { id: 'KA-24', name: 'Sancaka', relation: 'Dari Yogyakarta', time: '09:53' },
  { id: 'KA-25', name: 'Jayakarta', relation: 'Dari Pasarsenen', time: '15:27' },
  { id: 'KA-26', name: 'Pasundan', relation: 'Dari Kiaracondong', time: '07:05' },
];

// Helper: Determine train status based on current time
const getTrainStatus = (timeString: string): 'PASSED' | 'INCOMING' => {
  const now = new Date();
  const [hours, minutes] = timeString.split(':').map(Number);
  const trainTime = new Date();
  trainTime.setHours(hours, minutes, 0, 0);
  return trainTime < now ? 'PASSED' : 'INCOMING';
};

// Helper: Sort trains by time (ascending)
const getSortedTrainSchedule = () => {
  return [...REAL_TRAIN_SCHEDULE].sort((a, b) => {
    const [aH, aM] = a.time.split(':').map(Number);
    const [bH, bM] = b.time.split(':').map(Number);
    return (aH * 60 + aM) - (bH * 60 + bM);
  });
};

const violationBadge: Record<string, { bg: string; text: string; label: string }> = { menerobos: { bg: 'bg-red-500', text: 'text-white', label: 'MENEROBOS' }, berhenti: { bg: 'bg-amber-500', text: 'text-white', label: 'BERHENTI' }, nekat: { bg: 'bg-orange-500', text: 'text-white', label: 'NEKAT' } };
const mapMarkers: MapMarker[] = [
  { id: 'POST', name: 'Pos JPL 305', location: 'Pusat', top: '50%', left: '50%', type: 'POST', status: 'ONLINE' },
  { id: 'TITIK_A', name: 'TITIK A', location: 'Jalur Tikus', top: '30%', left: '40%', type: 'CCTV', status: 'ONLINE' },
  { id: 'TITIK_B', name: 'TITIK B', location: 'Gg. Masjid', top: '60%', left: '70%', type: 'CCTV', status: 'ONLINE' },
  { id: 'TITIK_C', name: 'TITIK C', location: 'Simpang', top: '45%', left: '20%', type: 'CCTV', status: 'WARNING' },
  { id: 'TITIK_D', name: 'TITIK D', location: 'Pasar', top: '80%', left: '55%', type: 'CCTV', status: 'ONLINE' },
];

// ========= COMPONENT =========
export default function DashboardPage() {
  const { latest, history, isConnected: wsConnected } = useDetectionStream(50);
  const [detections, setDetections] = useState<any[]>([]);
  const isDanger = useMemo(() => {
    if (!latest) return false;
    // Treat any person/vehicle in ROI as danger
    return latest.in_roi && ['person', 'car', 'motorcycle', 'truck'].includes(latest.object_class);
  }, [latest]);
  const dangerCameraId = latest?.camera_id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const menuParam = searchParams.get('menu');

  const [activeView, setActiveView] = useState<ViewType>(
    menuParam === 'analytics' ? 'ANALYTICS' : menuParam === 'archive' ? 'ARCHIVE' : menuParam === 'communication' ? 'COMMUNICATION' : menuParam === 'train' ? 'TRAIN_COMMS' : menuParam === 'schedule' ? 'SCHEDULE' : menuParam === 'map' ? 'MAP' : menuParam === 'settings' ? 'SETTINGS' : 'MONITORING'
  );
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [activeChannel, setActiveChannel] = useState<ChannelType>('JPL_COORD');
  const [isTalking, setIsTalking] = useState(false);
  const [textMessage, setTextMessage] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showTrainStopModal, setShowTrainStopModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [aiTypingText, setAiTypingText] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [trainDistance, setTrainDistance] = useState(2500);
  const [scheduleSearch, setScheduleSearch] = useState('');
  const [scheduleFilter, setScheduleFilter] = useState<ScheduleFilter>('ALL');
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [isStreamActive, setIsStreamActive] = useState(true);

  // Settings State
  const [aiThreshold, setAiThreshold] = useState(75);
  const [alarmVolume, setAlarmVolume] = useState(80);
  const [autoRecord, setAutoRecord] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);
  const [detectMotor, setDetectMotor] = useState(true);
  const [detectMobil, setDetectMobil] = useState(true);
  const [detectManusia, setDetectManusia] = useState(true);
  const [detectHewan, setDetectHewan] = useState(true);
  const [waNumber, setWaNumber] = useState('081234567890');
  const [loadingConfig, setLoadingConfig] = useState(false);

  const aiInsightFull = "Analisis: Lonjakan aktivitas di Titik B pada 07:00-08:00.";

  useEffect(() => { const t = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('id-ID')), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { if (activeView === 'ANALYTICS') { let i = 0; setAiTypingText(''); const t = setInterval(() => { if (i < aiInsightFull.length) { setAiTypingText(aiInsightFull.substring(0, i + 1)); i++; } else clearInterval(t); }, 30); return () => clearInterval(t); } }, [activeView]);
  useEffect(() => { if (menuParam === 'analytics') setActiveView('ANALYTICS'); else if (menuParam === 'archive') setActiveView('ARCHIVE'); else if (menuParam === 'communication') setActiveView('COMMUNICATION'); else if (menuParam === 'train') setActiveView('TRAIN_COMMS'); else if (menuParam === 'schedule') setActiveView('SCHEDULE'); else if (menuParam === 'map') setActiveView('MAP'); else if (menuParam === 'settings') setActiveView('SETTINGS'); else if (menuParam === 'monitoring') setActiveView('MONITORING'); }, [menuParam]);
  useEffect(() => { if (activeView === 'TRAIN_COMMS' && trainDistance > 100) { const t = setInterval(() => setTrainDistance(prev => Math.max(100, prev - 15)), 200); return () => clearInterval(t); } }, [activeView, trainDistance]);
  useEffect(() => {
    // Fetch persisted detections from backend
    const fetchDetections = async () => {
      try {
        const res = await fetch(DETECTION_API);
        if (!res.ok) return;
        const data = await res.json();
        setDetections(data.detections || []);
      } catch (e) {
        console.warn('Failed to fetch detections', e);
      }
    };
    fetchDetections();
    const interval = setInterval(fetchDetections, 5000);
    return () => clearInterval(interval);
  }, []);

  const showCustomToast = (msg: string) => { setToastMessage(msg); setShowToast(true); setTimeout(() => setShowToast(false), 4000); };
  const triggerEmergency = () => { setShowEmergencyModal(false); setIsEmergency(true); showCustomToast('🚨 SINYAL BAHAYA TERKIRIM!'); setTimeout(() => setIsEmergency(false), 10000); };
  const triggerTrainStop = () => { setShowTrainStopModal(false); showCustomToast('⚠️ REM DARURAT TERKIRIM!'); };
  const handleSaveSettings = async () => {
    setLoadingConfig(true);
    try {
      await fetch(`${API_BASE}/api/config/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threshold: aiThreshold,
          detect_motor: detectMotor,
          detect_mobil: detectMobil,
          detect_manusia: detectManusia,
          detect_hewan: detectHewan,
        }),
      });
      showCustomToast('✅ Konfigurasi berhasil disimpan ke Central Brain.');
    } catch (e) {
      showCustomToast('⚠️ Gagal simpan konfigurasi.');
    } finally {
      setLoadingConfig(false);
    }
  };
  const handleResetSettings = () => { setAiThreshold(75); setAlarmVolume(80); setAutoRecord(true); setDarkTheme(false); showCustomToast('🔄 Pengaturan direset ke default.'); };
  // Load config from backend
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/config/ai`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.config) {
          if (data.config.threshold !== undefined) setAiThreshold(Number(data.config.threshold));
          if (data.config.detect_motor !== undefined) setDetectMotor(!!data.config.detect_motor);
          if (data.config.detect_mobil !== undefined) setDetectMobil(!!data.config.detect_mobil);
          if (data.config.detect_manusia !== undefined) setDetectManusia(!!data.config.detect_manusia);
          if (data.config.detect_hewan !== undefined) setDetectHewan(!!data.config.detect_hewan);
        }
      } catch (e) {
        console.warn('Config fetch failed', e);
      }
    };
    loadConfig();
  }, []);
  const handleLogout = () => { router.push('/login'); };

  const selectedCamera = cameraPoints.find(c => c.id === activeTab);
  const isLatestForSelected = latest && (latest.camera_id ? latest.camera_id === selectedCamera?.id : true);
  const latestConfidencePct = latest ? (latest.confidence * 100).toFixed(1) : null;
  const latestStatusLabel = latest && latest.in_roi ? 'BAHAYA' : 'AMAN';
  const totalViolations = cameraPoints.reduce((sum, c) => sum + c.violations, 0);
  const mostDangerous = cameraPoints.reduce((max, c) => c.violations > max.violations ? c : max, cameraPoints[0]);

  // Empty arrays for messages - will be loaded from backend/WebSocket
  const jplMessages: RadioMessage[] = [];
  const stationMessages: RadioMessage[] = [];
  const currentMessages = activeChannel === 'JPL_COORD' ? jplMessages : stationMessages;

  const trainDistanceKm = (trainDistance / 1000).toFixed(2);
  const trainPosition = Math.max(5, Math.min(90, 90 - (trainDistance / 2500) * 85));

  // Use real train schedule with dynamic status calculation
  const sortedSchedule = getSortedTrainSchedule();
  const filteredSchedule = sortedSchedule
    .filter(t => t.name.toLowerCase().includes(scheduleSearch.toLowerCase()) || t.relation.toLowerCase().includes(scheduleSearch.toLowerCase()))
    .map(t => ({ ...t, status: getTrainStatus(t.time) }));

  // Calculate next train info
  const trainInfo = useMemo(() => {
    const now = new Date();
    const incomingTrains = sortedSchedule
      .map(t => ({ ...t, status: getTrainStatus(t.time) }))
      .filter(t => t.status === 'INCOMING');
    
    if (incomingTrains.length === 0) {
      return { name: 'No upcoming trains', eta: '--:--' };
    }
    
    const nextTrain = incomingTrains[0];
    const [hours, minutes] = nextTrain.time.split(':').map(Number);
    const trainTime = new Date();
    trainTime.setHours(hours, minutes, 0, 0);
    
    // Calculate ETA in minutes
    const diffMs = trainTime.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    
    const eta = diffHours > 0 
      ? `${diffHours}h ${remainingMins}m`
      : `${remainingMins}m`;
    
    return {
      name: `${nextTrain.name} - ${nextTrain.relation}`,
      eta: eta
    };
  }, [sortedSchedule]);

  const onlineCCTV = mapMarkers.filter(m => m.type === 'CCTV' && m.status !== 'OFFLINE').length;
  const totalCCTV = mapMarkers.filter(m => m.type === 'CCTV').length;

  return (
    <div className={`min-h-[calc(100vh-100px)] ${isEmergency ? 'animate-pulse' : ''}`}>
      {/* Modals & Toasts */}
      <AnimatePresence>{isEmergency && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 border-8 border-red-600 z-40 pointer-events-none" />}</AnimatePresence>
      <AnimatePresence>{showToast && <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-8 py-4 rounded-xl shadow-2xl border border-emerald-500"><p className="font-bold">{toastMessage}</p></motion.div>}</AnimatePresence>
      <AnimatePresence>{showEmergencyModal && (<><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEmergencyModal(false)} className="fixed inset-0 bg-black/80 z-50" /><motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl w-full max-w-md"><div className="bg-red-600 p-6 text-center text-white"><div className="text-5xl mb-3">🚨</div><h2 className="text-2xl font-black">KONFIRMASI</h2></div><div className="flex gap-3 p-6"><button onClick={() => setShowEmergencyModal(false)} className="flex-1 py-3 bg-slate-100 font-bold rounded-xl">BATAL</button><button onClick={triggerEmergency} className="flex-1 py-3 bg-red-600 text-white font-black rounded-xl">YA</button></div></div></motion.div></>)}</AnimatePresence>
      <AnimatePresence>{showTrainStopModal && (<><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTrainStopModal(false)} className="fixed inset-0 bg-black/80 z-50" /><motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="bg-slate-900 rounded-2xl w-full max-w-md border border-red-500"><div className="bg-red-600 p-6 text-center text-white"><div className="text-5xl mb-3">⚠️</div><h2 className="text-xl font-black">REM DARURAT?</h2></div><div className="flex gap-3 p-6"><button onClick={() => setShowTrainStopModal(false)} className="flex-1 py-3 bg-slate-700 text-white font-bold rounded-xl">BATAL</button><button onClick={triggerTrainStop} className="flex-1 py-3 bg-red-600 text-white font-black rounded-xl">KIRIM</button></div></div></motion.div></>)}</AnimatePresence>
      <AnimatePresence>{selectedEvidence && (<><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedEvidence(null)} className="fixed inset-0 bg-black/90 z-50" /><motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-4 z-50 flex items-center justify-center"><div className="bg-slate-900 rounded-2xl w-full max-w-4xl flex flex-col lg:flex-row"><div className="lg:w-2/3 bg-black relative aspect-video"><Image src={selectedEvidence.thumbnail} alt="Ev" fill className="object-cover opacity-80" /><button onClick={() => setSelectedEvidence(null)} className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">✕</button></div><div className="lg:w-1/3 bg-white p-6"><h2 className="text-xl font-black text-[#2D2A70] mb-4">Detail</h2><button className="w-full mt-4 py-3 bg-[#DA5525] text-white font-bold rounded-xl">⬇️ DOWNLOAD</button></div></div></motion.div></>)}</AnimatePresence>



      {/* MONITORING */}
      {activeView === 'MONITORING' && (<>
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-[#2D2A70]">🖥️ JPL 305 - NGEMBE</h1>
            {/* FEED TOGGLE SWITCH */}
            <button
              onClick={() => setIsStreamActive(!isStreamActive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 ${isStreamActive
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600'
                : 'bg-slate-400 text-white hover:bg-slate-500'
                }`}
            >
              <span className={`w-2 h-2 rounded-full ${isStreamActive ? 'bg-white animate-pulse' : 'bg-slate-300'}`}></span>
              {isStreamActive ? '● LIVE FEED ON' : '○ FEED OFF'}
            </button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${wsConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
              WS {wsConnected ? 'TERHUBUNG' : 'PUTUS'}
            </span>
            {latest && (
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700">
                TERBARU: {latest.object_class} {(latest.confidence * 100).toFixed(1)}% @ {new Date(latest.timestamp).toLocaleTimeString('id-ID')}
              </span>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-2 mb-4 flex gap-2 overflow-x-auto">
          <button onClick={() => setActiveTab('ALL')} className={`px-3 py-2 rounded-lg font-bold text-sm ${activeTab === 'ALL' ? 'bg-[#2D2A70] text-white' : 'text-slate-600'}`}>👁️ ALL</button>
          {cameraPoints.map((c) => <button key={c.id} onClick={() => setActiveTab(c.id)} className={`px-3 py-2 rounded-lg font-bold text-sm ${activeTab === c.id ? 'bg-[#DA5525] text-white' : 'text-slate-600'}`}>📍 {c.name}</button>)}
        </div>
        {activeTab === 'ALL' ? (
          <div className="grid grid-cols-2 gap-4">
            {cameraPoints.map((c) => (
              <div key={c.id} onClick={() => setActiveTab(c.id)} className="bg-slate-900 rounded-xl overflow-hidden cursor-pointer relative aspect-video border border-white/10">
                <MediaPlayer media={c.media} danger={isDanger && (!dangerCameraId || dangerCameraId === c.id)} disabled={!isStreamActive} />
                <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/70 flex justify-between">
                  <span className="text-white font-bold text-sm">{c.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${c.status === 'AMAN' ? 'bg-emerald-500' : 'bg-amber-500'} text-white`}>{c.status}</span>
                </div>
                {c.media.label && (
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-md border border-white/10">
                    {c.media.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {/* VIDEO WITH TACTICAL CONTROL DECK */}
            <div className="col-span-2 bg-slate-950 rounded-xl overflow-hidden relative aspect-video border border-white/10">
              <MediaPlayer media={selectedCamera?.media} danger={isDanger && (!dangerCameraId || dangerCameraId === selectedCamera?.id)} disabled={!isStreamActive} />

              {/* AEON Watermark */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
                <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-md flex items-center justify-center text-white text-xs font-black">A</div>
                <span className="text-white text-xs font-bold tracking-wider">AEON</span>
              </div>

              {/* TACTICAL CONTROL DECK - Bottom Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/10 px-4 py-3 flex items-center justify-between">
                {/* LEFT: Camera Info */}
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    <span className="text-emerald-400 font-bold">📡 LIVE</span>
                  </div>
                  <div className="text-slate-400">🔍 ZOOM 1.0x</div>
                  <div className="text-slate-500">|</div>
                  <div className="text-slate-400">{selectedCamera?.name} • {selectedCamera?.confidence}%</div>
                </div>

                {/* CENTER: Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showCustomToast('📸 Snapshot captured!')}
                    className="group relative w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-300 active:scale-95"
                    title="Ambil Bukti Foto"
                  >
                    <span className="text-lg">📸</span>
                  </button>

                  <button
                    onClick={() => showCustomToast('🔴 Recording started')}
                    className="group relative w-10 h-10 rounded-full bg-white/10 hover:bg-red-600/20 border border-white/20 hover:border-red-500/50 flex items-center justify-center transition-all duration-300 active:scale-95"
                    title="Start Recording"
                  >
                    <span className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
                  </button>

                  <button
                    className="group relative w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-300 active:scale-95"
                    title="Push-to-Talk"
                  >
                    <span className="text-lg">🎤</span>
                  </button>
                </div>

                {/* RIGHT: Danger Zone - Emergency */}
                <button
                  onClick={() => setShowEmergencyModal(true)}
                  className="px-5 py-2 rounded-md bg-gradient-to-r from-red-700 to-red-600 border border-red-500/50 text-white text-xs font-black tracking-wider hover:shadow-[0_0_20px_rgba(220,38,38,0.8)] transition-all duration-300 active:scale-95 flex items-center gap-2"
                >
                  <span className="animate-pulse">🚨</span>
                  <span>TRIGGER ALARM</span>
                </button>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="col-span-1 space-y-3">
              <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <h3 className="font-bold text-white text-sm mb-3">🚆 Next Train</h3>
                <p className="text-slate-300 text-xs">{trainInfo.name}</p>
                <p className="text-emerald-400 text-xs font-mono mt-1">ETA: {trainInfo.eta}</p>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <h3 className="font-bold text-white text-sm mb-2">📊 Detection</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Confidence</span>
                    <span className={`${latest && latest.in_roi ? 'text-red-400' : 'text-emerald-400'} font-bold`}>
                      {isLatestForSelected && latestConfidencePct ? `${latestConfidencePct}%` : `${selectedCamera?.confidence}%`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Violations</span>
                    <span className="text-orange-400 font-bold">
                      {isLatestForSelected ? `${(selectedCamera?.violations || 0) + 1}` : selectedCamera?.violations}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className={`font-bold ${isLatestForSelected && latest?.in_roi ? 'text-red-400' : 'text-emerald-400'}`}>
                      {isLatestForSelected ? latestStatusLabel : selectedCamera?.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>)}

      {/* ANALYTICS - VERTICAL SIDEBAR LAYOUT */}
      {activeView === 'ANALYTICS' && (
        <div className="flex gap-4 h-[calc(100vh-12rem)]">
          {/* VERTICAL SUB-SIDEBAR (WHITE THEME AS REQUESTED) */}
          <div className="w-64 bg-white/95 backdrop-blur-xl rounded-xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-left-4 duration-500">
            <div className="p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                <span>📊</span> DATA CENTER
              </h3>
              <p className="text-slate-800 text-sm font-bold">Analisis Wilayah</p>
            </div>

            <div className="p-3 flex-1 space-y-1 overflow-y-auto custom-scrollbar">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`w-full text-left px-4 py-3.5 rounded-lg font-bold text-sm transition-all duration-300 flex items-center gap-3 ${activeTab === 'ALL' ? 'bg-[#2D2A70] text-white shadow-lg shadow-blue-900/20 translate-x-1' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <span>📈</span>
                <span>Ringkasan Utama</span>
              </button>

              <div className="px-4 pt-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Titik Pantau</div>

              {cameraPoints.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveTab(c.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-300 flex items-center gap-3 ${activeTab === c.id ? 'bg-[#DA5525] text-white font-bold shadow-lg shadow-orange-900/20 translate-x-1' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <span className="text-lg">📍</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{c.name}</div>
                    <div className={`text-[10px] truncate ${activeTab === c.id ? 'text-white/80' : 'text-slate-400'}`}>{c.location}</div>
                  </div>
                  {c.status !== 'AMAN' && (
                    <span className={`w-2 h-2 rounded-full ${c.status === 'BAHAYA' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
              <p className="text-[10px] text-slate-400 font-medium">Synced: {currentTime}</p>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 bg-slate-900/80 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden relative shadow-2xl flex flex-col">
            {/* AEON Logo Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] grayscale invert">
              <Image src="/images/logo Aeon.png" alt="AEON" width={500} height={500} className="object-contain" />
            </div>

            <div className="relative z-10 flex-1 overflow-hidden flex flex-col">
              {/* Content Header */}
              <div className="p-6 border-b border-white/10 bg-white/5 backdrop-blur-sm flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg ring-1 ring-white/10 ${activeTab === 'ALL' ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-orange-500 to-red-600'}`}>
                    {activeTab === 'ALL' ? '📊' : '📍'}
                  </div>
                  <div>
                    <h2 className="font-black text-white text-2xl tracking-tight mb-1">{activeTab === 'ALL' ? 'Executive Summary' : `Detail: ${cameraPoints.find(c => c.id === activeTab)?.name}`}</h2>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-white/10 border border-white/5">LIVE DATA</span>
                      <span>•</span>
                      <span>Updated: {currentTime}</span>
                    </p>
                  </div>
                </div>

                {activeTab !== 'ALL' && (
                  <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-white/10 text-xs font-bold transition flex items-center gap-2">
                    🎥 LIHAT LIVE CCTV
                  </button>
                )}
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {activeTab === 'ALL' ? (
                  <div className="space-y-6">
                    {/* TOP STATS ROW */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900/50 p-5 rounded-2xl border border-indigo-500/20 relative group overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                        <p className="text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">Total Pelanggaran</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black text-white">{cameraPoints.reduce((acc, c) => acc + c.violations, 0)}</span>
                          <span className="text-xs text-emerald-400 font-bold">▲ 12%</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-900/50 to-slate-900/50 p-5 rounded-2xl border border-emerald-500/20 relative group overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                        <p className="text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">Sistem Akurasi</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black text-white">98.5</span>
                          <span className="text-lg text-emerald-400/70">%</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-amber-900/50 to-slate-900/50 p-5 rounded-2xl border border-amber-500/20 relative group overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                        <p className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">Titik Rawan</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-white truncate max-w-full">Titik B (Pasar)</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-900/50 to-slate-900/50 p-5 rounded-2xl border border-blue-500/20 relative group overflow-hidden flex flex-col justify-center">
                        <button className="w-full h-full border-2 border-dashed border-blue-500/30 rounded-xl flex flex-col items-center justify-center text-blue-400 hover:bg-blue-500/10 transition">
                          <span className="text-2xl mb-1">📥</span>
                          <span className="text-xs font-bold">UNDUH LAPORAN</span>
                        </button>
                      </div>
                    </div>

                    {/* AI INSIGHT */}
                    <div className="p-1 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600">
                      <div className="bg-slate-900 rounded-xl p-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                          <span className="text-xl animate-pulse">🤖</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm mb-1">AI Smart Analysis</h4>
                          <p className="text-slate-300 text-sm font-mono leading-relaxed">
                            {aiTypingText}
                            <span className="ml-1 w-2 h-4 bg-blue-500 inline-block animate-pulse align-middle"></span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CHART PLACEHOLDER (Use CSS Grid for visual chart) */}
                    <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6">
                      <h3 className="font-bold text-white mb-6">Tren Pelanggaran Mingguan</h3>
                      <div className="h-48 flex items-end justify-between gap-2 px-4">
                        {[45, 60, 35, 80, 50, 75, 40].map((h, i) => (
                          <div key={i} className="w-full bg-blue-600/20 rounded-t-lg relative group transition-all hover:bg-blue-500/40">
                            <div style={{ height: `${h}%` }} className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg absolute bottom-0 transition-all duration-500 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition">{h}</div>
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500 font-mono">H-{7 - i}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    {/* DETAIL VIEW CONTENT */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-1 bg-black/40 rounded-2xl overflow-hidden border border-white/10 aspect-video relative group">
                        <MediaPlayer media={cameraPoints.find(c => c.id === activeTab)?.media} danger={isDanger && (!dangerCameraId || dangerCameraId === activeTab)} />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                          <span className={`px-2 py-1 rounded text-xs font-black mb-2 inline-block ${cameraPoints.find(c => c.id === activeTab)?.status === 'AMAN' ? 'bg-emerald-500 text-slate-900' : 'bg-red-500 text-white animate-pulse'}`}>
                            STATUS: {cameraPoints.find(c => c.id === activeTab)?.status}
                          </span>
                          <h3 className="text-white font-bold">{cameraPoints.find(c => c.id === activeTab)?.name}</h3>
                        </div>
                      </div>

                      <div className="col-span-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Confidence</p>
                            <p className="text-3xl font-black text-emerald-400">
                              {isLatestForSelected && latestConfidencePct ? `${latestConfidencePct}%` : `${cameraPoints.find(c => c.id === activeTab)?.confidence}%`}
                            </p>
                          </div>
                          <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Total Pelanggaran</p>
                            <p className="text-3xl font-black text-orange-400">
                              {isLatestForSelected ? `${(cameraPoints.find(c => c.id === activeTab)?.violations || 0) + 1}` : cameraPoints.find(c => c.id === activeTab)?.violations}
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 h-40 overflow-y-auto custom-scrollbar">
                          <h4 className="text-slate-300 font-bold mb-2 text-sm">Riwayat Aktivitas</h4>
                          <ul className="space-y-2">
                            {evidenceList.filter(e => e.location === cameraPoints.find(c => c.id === activeTab)?.name).map((e, idx) => (
                              <li key={idx} className="flex items-center justify-between text-xs p-2 hover:bg-white/5 rounded transition">
                                <span className="text-slate-400">{e.time}</span>
                                <span className="text-white">{e.description}</span>
                              </li>
                            ))}
                            {evidenceList.length === 0 && <p className="text-slate-500 text-xs italic">Belum ada aktivitas hari ini.</p>}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ARCHIVE */}
      {
        activeView === 'ARCHIVE' && (<>
          <div className="mb-4"><h1 className="text-xl font-black text-[#2D2A70]">🗂️ ARSIP BUKTI</h1></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {detections.length === 0 && <p className="text-slate-500 col-span-full">Belum ada bukti dari AI.</p>}
            {detections.map((det, idx) => {
              const vType = det.object_class === 'person' ? 'menerobos' : det.object_class === 'car' ? 'berhenti' : 'nekat';
              const badge = violationBadge[vType as keyof typeof violationBadge] || violationBadge['nekat'];
              return (
                <div key={`${det.timestamp}-${idx}`} className="bg-white rounded-xl shadow-lg overflow-hidden border">
                  <div className="relative aspect-video bg-slate-900">
                    {det.image_url ? (
                      <Image src={det.image_url} alt="evidence" fill className="object-cover opacity-90" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">No image</div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${badge.bg} ${badge.text}`}>{badge.label}</span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] text-white drop-shadow">
                      <span>{det.camera_id || '-'}</span>
                      <span>{new Date(det.timestamp).toLocaleTimeString('id-ID')}</span>
                    </div>
                  </div>
                  <div className="p-3 space-y-1 text-xs text-slate-600">
                    <div className="font-bold text-[#2D2A70] uppercase">{det.object_class}</div>
                    <div>Conf: {(det.confidence * 100).toFixed(1)}%</div>
                    <div>Durasi: {det.duration_seconds?.toFixed(1)}s</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>)
      }

      {/* COMMUNICATION */}
      {
        activeView === 'COMMUNICATION' && (<>
          <div className="mb-4"><h1 className="text-xl font-black text-[#2D2A70]">📻 KOMUNIKASI RADIO</h1></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-220px)]">
            <div className="lg:col-span-1 bg-slate-900 rounded-xl p-4"><h3 className="text-white font-bold mb-4">📡 Saluran</h3><div className="space-y-3"><div onClick={() => setActiveChannel('JPL_COORD')} className={`p-4 rounded-xl cursor-pointer ${activeChannel === 'JPL_COORD' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}><span className="font-bold">JALUR 1</span></div><div onClick={() => setActiveChannel('STATION_REPORT')} className={`p-4 rounded-xl cursor-pointer ${activeChannel === 'STATION_REPORT' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'}`}><span className="font-bold">JALUR 2</span></div></div></div>
            <div className="lg:col-span-2 bg-slate-800 rounded-xl flex flex-col overflow-hidden"><div className="bg-slate-900 px-4 py-3"><h3 className="text-white font-bold">{activeChannel === 'JPL_COORD' ? '📻 Koordinasi JPL' : '📻 Stasiun'}</h3></div><div className="flex-1 overflow-y-auto p-4 space-y-3">{currentMessages.map((msg) => <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[75%] rounded-xl p-3 ${msg.isOwn ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-100'}`}><span className="text-xs font-bold">{msg.sender}</span><p className="text-sm">{msg.message}</p></div></div>)}</div><div className="bg-slate-900 p-4 flex items-center gap-4"><input type="text" value={textMessage} onChange={(e) => setTextMessage(e.target.value)} placeholder="Ketik..." className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-xl text-sm" /><button onMouseDown={() => setIsTalking(true)} onMouseUp={() => setIsTalking(false)} className={`w-16 h-16 rounded-full flex items-center justify-center ${isTalking ? 'bg-red-600 scale-110' : 'bg-emerald-600'} text-white text-xl`}>{isTalking ? '📡' : '🎙️'}</button></div></div>
          </div>
        </>)
      }

      {/* TRAIN COMMS */}
      {
        activeView === 'TRAIN_COMMS' && (
          <div className="space-y-4">
            <div className="mb-2"><h1 className="text-xl font-black text-[#2D2A70]">🚆 KOMUNIKASI MASINIS</h1></div>
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 grid grid-cols-3 gap-4 items-center"><div><p className="text-emerald-400 font-mono text-sm">🟢 CONNECTED</p></div><div className="text-center"><p className="text-white font-black">KA 102 - ARGO WILIS</p></div><div className="text-right"><p className="text-emerald-400 font-mono text-xs">98%</p></div></div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 relative h-20"><div className="absolute top-1/2 left-0 right-0 h-2 bg-slate-600 rounded-full -translate-y-1/2"></div><motion.div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${trainPosition}%` }}><div className="bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded mb-1 font-mono">{trainDistanceKm} KM</div><div className="text-2xl">🚆</div></motion.div></div>
            <div className="grid grid-cols-3 gap-4"><button onClick={() => showCustomToast('📡 Reply: 24ms')} className="bg-blue-600 text-white p-6 rounded-xl text-center"><div className="text-3xl mb-2">📡</div><p className="font-black">PING</p></button><button onClick={() => showCustomToast('✅ AMAN dikirim')} className="bg-emerald-600 text-white p-6 rounded-xl text-center"><div className="text-3xl mb-2">✅</div><p className="font-black">AMAN</p></button><button onClick={() => setShowTrainStopModal(true)} className="bg-red-600 text-white p-6 rounded-xl text-center animate-pulse"><div className="text-3xl mb-2">⚠️</div><p className="font-black">DARURAT</p></button></div>
          </div>
        )
      }

      {/* SCHEDULE */}
      {
        activeView === 'SCHEDULE' && (
          <div className="space-y-4">
            <div className="mb-2"><h1 className="text-xl font-black text-[#2D2A70]">📅 JADWAL KERETA</h1></div>
            <div className="flex items-center gap-4 bg-white rounded-xl p-3 border"><input type="text" placeholder="🔍 Cari..." value={scheduleSearch} onChange={(e) => setScheduleSearch(e.target.value)} className="flex-1 px-4 py-2 bg-slate-100 rounded-lg text-sm" /><div className="flex gap-2"><button onClick={() => setScheduleFilter('ALL')} className={`px-4 py-2 rounded-lg font-bold text-sm ${scheduleFilter === 'ALL' ? 'bg-[#2D2A70] text-white' : 'bg-slate-100'}`}>Semua</button><button onClick={() => setScheduleFilter('INCOMING')} className={`px-4 py-2 rounded-lg font-bold text-sm ${scheduleFilter === 'INCOMING' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>Datang</button><button onClick={() => setScheduleFilter('LATE')} className={`px-4 py-2 rounded-lg font-bold text-sm ${scheduleFilter === 'LATE' ? 'bg-red-600 text-white' : 'bg-slate-100'}`}>Telat</button></div></div>
            <div className="bg-white rounded-xl border overflow-hidden"><table className="w-full text-sm"><thead className="bg-[#2D2A70] text-white"><tr><th className="p-4 text-left">KA</th><th className="p-4 text-left">Tujuan</th><th className="p-4 text-left">Jadwal</th><th className="p-4 text-left">Status</th></tr></thead><tbody>{filteredSchedule.map((t, i) => <tr key={t.id} className={i % 2 === 0 ? '' : 'bg-slate-50'}><td className="p-4 font-bold text-[#2D2A70]">{t.noKA} - {t.nama}</td><td className="p-4">{t.tujuan}</td><td className="p-4 font-mono">{t.jadwal}</td><td className="p-4">{t.status === 'PASSED' ? <span className="px-2 py-1 rounded bg-slate-200 text-slate-600 text-xs">✓</span> : t.status === 'INCOMING' ? <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs animate-pulse">🔵</span> : <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">🔴</span>}</td></tr>)}</tbody></table></div>
          </div>
        )
      }

      {/* MAP */}
      {
        activeView === 'MAP' && (
          <div className="space-y-4">
            <div className="mb-2"><h1 className="text-xl font-black text-[#2D2A70]">🗺️ PETA SEBARAN CCTV</h1></div>
            <div className="relative w-full h-[calc(100vh-220px)] bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
              <Image src="/images/icon-map.jpg" alt="Peta" fill className="object-cover opacity-70" />
              {mapMarkers.map((m) => <div key={m.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10" style={{ top: m.top, left: m.left }} onMouseEnter={() => setHoveredMarker(m.id)} onMouseLeave={() => setHoveredMarker(null)}>{m.type === 'POST' ? <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-blue-400/50"><span className="text-2xl">🏢</span></div> : <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${m.status === 'WARNING' ? 'bg-red-600 animate-ping' : 'bg-emerald-600'}`}><span className="text-sm">📷</span></div>}{m.status === 'WARNING' && m.type === 'CCTV' && <div className="absolute inset-0 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center"><span className="text-sm">📷</span></div>}{hoveredMarker === m.id && <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap shadow-xl z-20"><p className="font-bold">{m.name}</p><p className="text-slate-400">{m.location}</p></motion.div>}</div>)}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white text-xs z-10"><p className="font-bold mb-2">KETERANGAN</p><div className="space-y-2"><div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-600 rounded-full"></div><span>Pos JPL</span></div><div className="flex items-center gap-2"><div className="w-4 h-4 bg-emerald-600 rounded-full"></div><span>CCTV Online</span></div><div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></div><span>Warning</span></div></div></div>
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl z-10 w-48"><h3 className="font-bold text-[#2D2A70] mb-3">📊 Status</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-slate-600">Wilayah</span><span className="font-bold text-emerald-600">AMAN</span></div><div className="flex justify-between"><span className="text-slate-600">CCTV</span><span className="font-bold">{onlineCCTV}/{totalCCTV}</span></div></div></div>
            </div>
          </div>
        )
      }

      {/* SETTINGS */}
      {
        activeView === 'SETTINGS' && (
          <div className="space-y-6">
            <div className="mb-2"><h1 className="text-xl font-black text-[#2D2A70]">⚙️ PENGATURAN SISTEM</h1><p className="text-slate-500 text-sm">Konfigurasi AI Engine, Alarm, dan Profil Operator</p></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* SECTION 1: AI ENGINE */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="font-bold text-[#2D2A70] text-lg mb-4 flex items-center gap-2">🤖 Kalibrasi AI Engine</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Confidence Threshold: {aiThreshold}%</label>
                    <input type="range" min="0" max="100" value={aiThreshold} onChange={(e) => setAiThreshold(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#DA5525]" />
                    <p className="text-xs text-slate-500 mt-1">AI hanya membunyikan alarm jika keyakinan di atas nilai ini.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Objek Deteksi</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={detectMotor} onChange={(e) => setDetectMotor(e.target.checked)} className="w-4 h-4 accent-[#DA5525]" /><span className="text-sm">🏍️ Motor</span></label>
                      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={detectMobil} onChange={(e) => setDetectMobil(e.target.checked)} className="w-4 h-4 accent-[#DA5525]" /><span className="text-sm">🚗 Mobil</span></label>
                      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={detectManusia} onChange={(e) => setDetectManusia(e.target.checked)} className="w-4 h-4 accent-[#DA5525]" /><span className="text-sm">🚶 Manusia</span></label>
                      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={detectHewan} onChange={(e) => setDetectHewan(e.target.checked)} className="w-4 h-4 accent-[#DA5525]" /><span className="text-sm">🐄 Hewan</span></label>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">
                    🎯 Atur ROI (Zona Merah)
                  </button>
                </div>
              </div>

              {/* SECTION 2: SYSTEM & ALARM */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="font-bold text-[#2D2A70] text-lg mb-4 flex items-center gap-2">🔔 Sistem & Alarm</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Volume Sirine: {alarmVolume}%</label>
                    <input type="range" min="0" max="100" value={alarmVolume} onChange={(e) => setAlarmVolume(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#DA5525]" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-bold text-sm text-[#2D2A70]">Auto-Recording</p>
                      <p className="text-xs text-slate-500">Rekam otomatis saat bahaya</p>
                    </div>
                    <button onClick={() => setAutoRecord(!autoRecord)} className={`w-14 h-7 rounded-full transition-colors duration-200 ${autoRecord ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${autoRecord ? 'translate-x-8' : 'translate-x-1'}`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-bold text-sm text-[#2D2A70]">Dark Theme</p>
                      <p className="text-xs text-slate-500">Mode gelap untuk malam hari</p>
                    </div>
                    <button onClick={() => setDarkTheme(!darkTheme)} className={`w-14 h-7 rounded-full transition-colors duration-200 ${darkTheme ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${darkTheme ? 'translate-x-8' : 'translate-x-1'}`}></div>
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nomor WA Admin Stasiun</label>
                    <input type="text" value={waNumber} onChange={(e) => setWaNumber(e.target.value)} className="w-full px-4 py-3 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#DA5525]" placeholder="08xxxxxxxxxx" />
                  </div>
                </div>
              </div>

              {/* SECTION 3: PROFILE */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="font-bold text-[#2D2A70] text-lg mb-4 flex items-center gap-2">👤 Profil Operator</h2>

                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2D2A70] to-[#1a1850] flex items-center justify-center text-white text-2xl font-black">AD</div>
                    <div>
                      <p className="font-bold text-[#2D2A70]">Ahmad Darmawan</p>
                      <p className="text-sm text-slate-500">Operator JPL 305 - Ngembe</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-slate-600">NIPP</span><span className="font-mono font-bold">1234567890</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-600">Shift</span><span className="font-bold text-emerald-600">Pagi (07:00 - 15:00)</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-600">DAOP</span><span className="font-bold">DAOP 7 - Madiun</span></div>
                  </div>

                  <button onClick={handleLogout} className="w-full py-3 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-xl transition flex items-center justify-center gap-2">
                    🚪 LOGOUT
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION BAR */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button onClick={handleResetSettings} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">
                🔄 Reset Default
              </button>
              <button onClick={handleSaveSettings} className="px-8 py-3 bg-[#DA5525] hover:bg-[#c44a1f] text-white font-black rounded-xl transition shadow-lg">
                💾 SIMPAN PERUBAHAN
              </button>
            </div>
          </div>
        )
      }
    </div >
  );
}

const MediaPlayer = ({ media, autoPlay = true, muted = true, danger = false, disabled = false }: { media?: MediaSource; autoPlay?: boolean; muted?: boolean; danger?: boolean; disabled?: boolean }) => {
  if (disabled) {
    return (
      <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          animation: 'scanline 8s linear infinite'
        }}></div>
        {/* Static Noise Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")'
        }}></div>
        {/* Icon & Text */}
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-4 opacity-30">📵</div>
          <p className="text-slate-400 font-bold text-sm tracking-widest">SYSTEM STANDBY</p>
          <p className="text-slate-600 text-xs mt-1">FEED DISABLED</p>
        </div>
      </div>
    );
  }
  if (!media) {
    return <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-slate-500 text-xs">Media tidak tersedia</div>;
  }

  if (media.kind === 'stream') {
    // Use polling to fetch latest frame (browser compatible)
    return <StreamPlayer src={media.src} danger={danger} />;
  }

  return (
    <div className="absolute inset-0">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={media.src}
        autoPlay={autoPlay}
        muted={muted}
        loop
        playsInline
        controls={false}
        poster={media.poster}
      />
      {danger && <DangerOverlay />}
    </div>
  );
};

const StreamPlayer = ({ src, danger = false }: { src: string; danger?: boolean }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Convert stream URL to latest frame endpoint
    // Handle all cameras (cam1, cam2, cam3, cam4)
    let latestUrl = src;
    if (src.includes('/stream/cam')) {
      // Replace /stream/camX with /stream/camX/latest
      latestUrl = src.replace(/\/stream\/(cam\d+)$/, '/stream/$1/latest');
    } else if (src.match(/cam\d+$/)) {
      latestUrl = src + '/latest';
    }
    
    const updateFrame = () => {
      if (imgRef.current) {
        // Add timestamp to prevent caching
        const urlWithTimestamp = `${latestUrl}?t=${Date.now()}`;
        imgRef.current.src = urlWithTimestamp;
      }
    };

    // Function to save screenshot
    const saveScreenshot = () => {
      if (!imgRef.current || !imgRef.current.complete || imgRef.current.naturalWidth === 0) {
        return;
      }

      try {
        // Create canvas to capture image
        if (!canvasRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = imgRef.current.naturalWidth || imgRef.current.width;
          canvas.height = imgRef.current.naturalHeight || imgRef.current.height;
          canvasRef.current = canvas;
        }

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(imgRef.current, 0, 0);
        
        // Convert to blob and download
        canvasRef.current.toBlob((blob) => {
          if (!blob) return;
          
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
          const filename = `snapshot_${timestamp}.jpg`;
          
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          console.log(`[AUTO-SAVE] Screenshot saved: ${filename}`);
        }, 'image/jpeg', 0.95);
      } catch (err) {
        console.error('[AUTO-SAVE] Error saving screenshot:', err);
      }
    };

    // Initial load
    updateFrame();
    setIsLoading(false);

    // Poll every 50ms (~20 FPS) - balanced for performance with multiple streams
    const frameInterval = setInterval(updateFrame, 50);

    // Auto-save screenshot every 15 minutes (900000ms)
    const screenshotInterval = setInterval(saveScreenshot, 15 * 60 * 1000);

    return () => {
      clearInterval(frameInterval);
      clearInterval(screenshotInterval);
    };
  }, [src]);

  if (error) {
    return (
      <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-slate-400">
        <div className="text-4xl mb-3">📷</div>
        <p className="text-sm font-bold mb-1">Stream Tidak Tersedia</p>
        <p className="text-xs text-center px-4">Pastikan AI Engine berjalan dan mengirim frame ke backend</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-slate-400">
          <div className="text-4xl mb-3 animate-pulse">📷</div>
        </div>
      )}
      <img
        ref={imgRef}
        alt="Live Stream"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ imageRendering: 'auto', display: isLoading ? 'none' : 'block' }}
        onError={(e) => {
          // Don't show error immediately, might be temporary
          console.warn(`[StreamPlayer] Frame load error for ${src}`);
          // Retry after delay
          setTimeout(() => {
            if (imgRef.current && !imgRef.current.complete) {
              setError(true);
              setIsLoading(false);
            }
          }, 3000);
        }}
        onLoad={() => {
          setError(false);
          setIsLoading(false);
        }}
      />
      {/* Hidden canvas for screenshot capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {danger && <DangerOverlay />}
    </div>
  );
};

const DangerOverlay = () => (
  <div className="absolute inset-0 bg-red-600/15 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
    <div className="flex items-center gap-3 px-4 py-2 bg-black/60 rounded-full border border-red-500/60 shadow-[0_0_20px_rgba(220,38,38,0.35)]">
      <span className="animate-pulse text-red-400">🚨</span>
      <span className="text-xs font-black text-red-100 tracking-wider">AI DETEKSI OBSTACLE</span>
    </div>
  </div>
);
