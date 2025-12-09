'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Activity,
  Car,
  User,
  Truck,
  Train,
  Radio,
  Siren,
  ChevronDown,
  Zap,
  AlertOctagon
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

type ScenarioType = 'NORMAL' | 'WARNING' | 'CRITICAL';

interface LogItem {
  id: string;
  time: string;
  message: string;
  level: 'INFO' | 'WARN' | 'DANGER';
}

// ============================================
// CAMERA CONFIGURATION
// ============================================

const CAMERA_FEEDS = [
  { id: 1, name: 'CAM-01 Arah Surabaya', src: '/videos/cam1.mp4' },
  { id: 2, name: 'CAM-02 Arah Madiun', src: '/videos/cam2.mp4' },
  { id: 3, name: 'CAM-03 Perlintasan', src: '/videos/cam3.mp4' },
  { id: 4, name: 'CAM-04 Area Warga', src: '/videos/cam4.mp4' },
];

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

export default function DashboardPage() {
  // === STATE ===
  const [scenario, setScenario] = useState<ScenarioType>('NORMAL');
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // === REAL-TIME CLOCK ===
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // === SCENARIO-BASED LOG GENERATION ===
  useEffect(() => {
    // Initial logs
    const initialLogs: LogItem[] = [
      { id: '1', time: '08:24:15', message: 'Sistem monitoring aktif', level: 'INFO' },
      { id: '2', time: '08:24:10', message: 'CAM-01: Kendaraan melintas normal', level: 'INFO' },
      { id: '3', time: '08:24:05', message: 'CAM-03: Area perlintasan bersih', level: 'INFO' },
    ];

    if (scenario === 'CRITICAL') {
      setLogs([
        { id: Date.now().toString(), time: currentTime || '08:25:00', message: '⚠️ BAHAYA: OBJEK DI REL TERDETEKSI!', level: 'DANGER' },
        { id: (Date.now() + 1).toString(), time: currentTime || '08:25:00', message: '🚨 CAM-03: TRUCK STALLED ON CROSSING!', level: 'DANGER' },
        { id: (Date.now() + 2).toString(), time: currentTime || '08:25:00', message: '📡 Sinyal darurat dikirim ke masinis', level: 'DANGER' },
        ...initialLogs
      ]);
    } else if (scenario === 'WARNING') {
      setLogs([
        { id: Date.now().toString(), time: currentTime || '08:25:00', message: '⚠️ CAM-04: Warga mendekati area steril', level: 'WARN' },
        { id: (Date.now() + 1).toString(), time: currentTime || '08:25:00', message: '🚆 Kereta terdeteksi < 3km', level: 'WARN' },
        ...initialLogs
      ]);
    } else {
      setLogs(initialLogs);
    }
  }, [scenario, currentTime]);

  // === SCENARIO-BASED VALUES ===
  const getSystemStatus = () => {
    switch (scenario) {
      case 'NORMAL': return { text: 'AMAN', color: 'bg-emerald-500', textColor: 'text-emerald-600', bgLight: 'bg-emerald-50', borderColor: 'border-emerald-200' };
      case 'WARNING': return { text: 'WASPADA', color: 'bg-amber-500', textColor: 'text-amber-600', bgLight: 'bg-amber-50', borderColor: 'border-amber-200' };
      case 'CRITICAL': return { text: 'BAHAYA', color: 'bg-red-600', textColor: 'text-red-600', bgLight: 'bg-red-50', borderColor: 'border-red-200' };
    }
  };

  const getTTC = () => {
    switch (scenario) {
      case 'NORMAL': return { value: '> 15 min', urgent: false };
      case 'WARNING': return { value: '< 3 min', urgent: false };
      case 'CRITICAL': return { value: 'CRITICAL < 30s', urgent: true };
    }
  };

  const status = getSystemStatus();
  const ttc = getTTC();

  return (
    <div className="h-full flex flex-col gap-6">

      {/* ========= HEADER ========= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D2A70]">Live Surveillance - JPL 01 Peterongan</h1>
          <p className="text-slate-500 text-sm">Sistem Pemantauan AI Perlintasan Kereta Api</p>
        </div>

        {/* Scenario Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 shadow-sm transition-all font-semibold ${status.bgLight} ${status.borderColor} ${status.textColor}`}
          >
            <span className={`w-3 h-3 rounded-full ${status.color} ${scenario === 'CRITICAL' ? 'animate-pulse' : ''}`}></span>
            <span>Demo Mode: {scenario}</span>
            <ChevronDown size={18} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
              >
                {(['NORMAL', 'WARNING', 'CRITICAL'] as ScenarioType[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setScenario(s); setDropdownOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-3 hover:bg-slate-50 transition-colors ${scenario === s ? 'bg-slate-100' : ''}`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${s === 'NORMAL' ? 'bg-emerald-500' : s === 'WARNING' ? 'bg-amber-500' : 'bg-red-600'
                      }`}></span>
                    {s === 'NORMAL' ? '🟢 Normal (Aman)' : s === 'WARNING' ? '🟡 Warning (Waspada)' : '🔴 Critical (Bahaya)'}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ========= STATS ROW (4 Cards) ========= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Card 1: Unit CCTV */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Video size={22} />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Unit CCTV</p>
            <p className="text-xl font-bold text-[#2D2A70]">4/4 <span className="text-sm font-medium text-emerald-600">Online</span></p>
          </div>
        </div>

        {/* Card 2: Status Sistem (Dynamic) */}
        <div className={`p-4 rounded-xl border-2 shadow-sm flex items-center gap-4 transition-all duration-300 ${status.bgLight} ${status.borderColor}`}>
          <div className={`w-11 h-11 rounded-xl ${status.color} text-white flex items-center justify-center ${scenario === 'CRITICAL' ? 'animate-pulse' : ''}`}>
            {scenario === 'CRITICAL' ? <Siren size={22} /> : scenario === 'WARNING' ? <AlertTriangle size={22} /> : <ShieldCheck size={22} />}
          </div>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${status.textColor} opacity-70`}>Status Sistem</p>
            <p className={`text-xl font-bold ${status.textColor}`}>{status.text}</p>
          </div>
        </div>

        {/* Card 3: Latency */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Zap size={22} />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">AI Latency</p>
            <p className="text-xl font-bold text-[#2D2A70]">48<span className="text-sm font-medium text-slate-500">ms</span></p>
          </div>
        </div>

        {/* Card 4: TTC (Dynamic) */}
        <div className={`p-4 rounded-xl border-2 shadow-sm flex items-center gap-4 transition-all duration-300 ${ttc.urgent ? 'bg-red-600 border-red-700' : 'bg-white border-slate-200'}`}>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${ttc.urgent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
            <Clock size={22} className={ttc.urgent ? 'animate-pulse' : ''} />
          </div>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${ttc.urgent ? 'text-white/80' : 'text-slate-400'}`}>Time to Collision</p>
            <p className={`text-lg font-bold ${ttc.urgent ? 'text-white' : 'text-[#2D2A70]'}`}>{ttc.value}</p>
          </div>
        </div>
      </div>

      {/* ========= MAIN CONTENT GRID ========= */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[450px]">

        {/* LEFT: VIDEO WALL (Span 3 = 75%) */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-4">
          {CAMERA_FEEDS.map((camera) => (
            <CameraFeed key={camera.id} camera={camera} scenario={scenario} currentTime={currentTime} />
          ))}
        </div>

        {/* RIGHT: INTELLIGENCE PANEL (Span 1 = 25%) */}
        <div className="flex flex-col gap-4">

          {/* THE EYE: Detection Logs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-[#2D2A70] flex items-center gap-2 text-sm">
                <Activity size={16} />
                The Eye - Detection Log
              </h3>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">LIVE</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {logs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`p-2.5 rounded-lg border text-xs ${log.level === 'DANGER' ? 'bg-red-50 border-red-100 text-red-700' :
                      log.level === 'WARN' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                        'bg-white border-slate-100 text-slate-600'
                    }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold">{log.level}</span>
                    <span className="text-[10px] opacity-70 font-mono">{log.time}</span>
                  </div>
                  <p className="leading-snug">{log.message}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* INTEGRATED SERVICES */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <h3 className="font-bold text-[#2D2A70] mb-3 flex items-center gap-2 text-sm">
              <Radio size={16} />
              Integrated Services
            </h3>
            <div className="space-y-2.5">
              <ServiceRow
                name="Polres Jombang"
                status={scenario === 'CRITICAL' ? 'DISPATCHED' : 'STANDBY'}
              />
              <ServiceRow
                name="Ambulans RSUD"
                status={scenario === 'CRITICAL' ? 'ALERT' : 'STANDBY'}
              />
              <ServiceRow
                name="Dishub Traffic"
                status={scenario === 'CRITICAL' ? 'RED LIGHT' : 'NORMAL'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CAMERA FEED COMPONENT (With AI Box Overlay)
// ============================================

function CameraFeed({ camera, scenario, currentTime }: { camera: typeof CAMERA_FEEDS[0]; scenario: ScenarioType; currentTime: string }) {
  // Box color based on scenario
  const boxStyle = scenario === 'CRITICAL'
    ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]'
    : scenario === 'WARNING'
      ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
      : 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]';

  const labelStyle = scenario === 'CRITICAL'
    ? 'bg-red-600 animate-pulse'
    : scenario === 'WARNING'
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  return (
    <div className="relative bg-slate-900 rounded-xl overflow-hidden shadow-lg group aspect-video">

      {/* Video Player */}
      <video
        src={camera.src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Top Overlay: Camera Name & REC */}
      <div className="absolute top-0 left-0 right-0 p-3 flex items-start justify-between bg-gradient-to-b from-black/60 to-transparent">
        <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded font-mono border border-white/10">
          {camera.name}
        </div>
        <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2 py-1 rounded border border-white/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[10px] text-red-400 font-bold">REC</span>
        </div>
      </div>

      {/* AI BOUNDING BOX OVERLAY (Changes with Scenario) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-2/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`w-full h-full border-2 rounded ${boxStyle} relative`}
        >
          {/* Detection Label */}
          <div className={`absolute -top-6 left-0 text-[10px] font-bold px-2 py-0.5 text-white rounded ${labelStyle}`}>
            {scenario === 'CRITICAL' ? '🚨 PERSON 98%' : scenario === 'WARNING' ? 'PERSON 85%' : 'CLEAR ✓'}
          </div>

          {/* Corner Brackets for AI Box effect */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-current opacity-70"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-current opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-current opacity-70"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-current opacity-70"></div>
        </motion.div>
      </div>

      {/* Bottom Overlay: Time & LIVE */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-white/70" />
          <span className="text-white/90 text-xs font-mono">{currentTime}</span>
        </div>
        <div className={`text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${scenario === 'CRITICAL' ? 'text-red-400' : 'text-emerald-400'
          }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${scenario === 'CRITICAL' ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`}></span>
          {scenario === 'CRITICAL' ? 'ALERT' : 'LIVE'}
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#DA5525]/50 transition-colors rounded-xl pointer-events-none" />
    </div>
  );
}

// ============================================
// SERVICE ROW COMPONENT
// ============================================

function ServiceRow({ name, status }: { name: string; status: string }) {
  const getStyle = () => {
    switch (status) {
      case 'DISPATCHED': return 'text-red-600 bg-red-50 border-red-100 animate-pulse';
      case 'ALERT': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'RED LIGHT': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    }
  };

  return (
    <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-slate-600 font-medium">{name}</span>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStyle()}`}>
        {status}
      </span>
    </div>
  );
}
