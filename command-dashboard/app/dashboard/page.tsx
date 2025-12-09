"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Video,
  AlertTriangle,
  Camera,
  Clock,
  Shield,
  Siren,
  Lock,
  Brain,
  Phone,
  Mic,
  Home,
  Eye,
  Server,
  History,
  FileText,
  LogOut,
  Volume2,
  Settings,
  MapPin,
  Bell,
  ChevronDown,
  Radio,
  Zap,
  Users,
  BarChart3,
  Map
} from "lucide-react";

const MapWidget = dynamic(() => import('@/components/MapWidget'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-800 animate-pulse rounded-xl" />
});

type TabType = 'live' | 'map' | 'history' | 'settings';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('live');
  const [systemTime, setSystemTime] = useState(new Date());
  const [isEmergency, setIsEmergency] = useState(true);
  const [userName, setUserName] = useState('Guest');

  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('aeon_user');
    if (stored) {
      const user = JSON.parse(stored);
      setUserName(user.nama || 'Guest');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('aeon_user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* ====== TOP NAVBAR ====== */}
      <nav className="h-14 bg-gradient-to-r from-[#2D3588] to-[#1a2057] border-b border-white/10 flex items-center justify-between px-4 sticky top-0 z-50">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg">
            <img src="/images/logo%20Aeon.png" alt="Logo" className="h-6 w-auto" />
          </div>
          <div>
            <div className="font-bold text-sm">COMMAND CENTER</div>
            <div className="text-[10px] text-cyan-300 font-mono">DAOP 7 MADIUN</div>
          </div>
        </div>

        {/* Center: Tab Navigation */}
        <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl">
          <TabButton icon={<Video size={16} />} label="Live View" active={activeTab === 'live'} onClick={() => setActiveTab('live')} />
          <TabButton icon={<Map size={16} />} label="Peta" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
          <TabButton icon={<History size={16} />} label="Riwayat" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <TabButton icon={<Settings size={16} />} label="Pengaturan" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>

        {/* Right: Status & User */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <div className="font-mono text-lg font-bold">{systemTime.toLocaleTimeString('id-ID')}</div>
            <div className="text-[10px] text-slate-400">{systemTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">3</span>
            </button>
            
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{userName}</span>
              <button onClick={handleLogout} className="p-1 hover:bg-white/10 rounded">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ====== EMERGENCY BANNER ====== */}
      <AnimatePresence>
        {isEmergency && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-red-600 to-red-700 border-b border-red-500"
          >
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="animate-pulse" size={20} />
                <span className="font-bold text-sm">EMERGENCY ACTIVE</span>
                <span className="text-red-200 text-sm">• Objek terdeteksi di JPL 102</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm">00:02:34</span>
                <button 
                  onClick={() => setIsEmergency(false)}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm font-bold transition"
                >
                  DISMISS
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== MAIN CONTENT ====== */}
      <main className="max-w-7xl mx-auto p-4">
        
        {/* TAB: LIVE VIEW */}
        {activeTab === 'live' && (
          <div className="space-y-4">
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={<Activity />} label="Events (24h)" value="847" color="orange" />
              <StatCard icon={<Camera />} label="Kamera Aktif" value="24/26" color="green" />
              <StatCard icon={<Clock />} label="Response Time" value="2.4s" color="blue" />
              <StatCard icon={<Server />} label="System Health" value="98.2%" color="cyan" />
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* Main Feed */}
              <div className="lg:col-span-2">
                <VideoFeed 
                  title="CAM-01 Main Crossing" 
                  location="JPL 102 Jombang" 
                  isPrimary 
                  hasDetection
                />
              </div>

              {/* Side Feeds */}
              <div className="space-y-4">
                <VideoFeed title="CAM-02 East Gate" location="Entry Point A" />
                <VideoFeed title="CAM-03 Platform" location="Platform 1" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <Zap className="text-yellow-500" size={16} />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <QuickAction icon={<Siren />} label="Sirene" color="red" />
                <QuickAction icon={<Lock />} label="Lockdown" color="orange" />
                <QuickAction icon={<Mic />} label="Broadcast" color="blue" />
                <QuickAction icon={<Phone />} label="Call Stasiun" color="green" />
              </div>
            </div>
          </div>
        )}

        {/* TAB: MAP */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="h-[500px] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden relative">
              <MapWidget status="SAFE" />
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur px-3 py-2 rounded-lg">
                <div className="text-xs text-slate-400">Status Area</div>
                <div className="text-green-400 font-bold">AMAN</div>
              </div>
            </div>
            
            {/* JPL List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <JPLCard name="JPL 102 Jombang" status="safe" cameras={4} lastEvent="2 jam lalu" />
              <JPLCard name="JPL 105 Peterongan" status="warning" cameras={3} lastEvent="15 menit lalu" />
              <JPLCard name="JPL 108 Ngoro" status="safe" cameras={2} lastEvent="5 jam lalu" />
            </div>
          </div>
        )}

        {/* TAB: HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <h3 className="font-bold">Riwayat Event</h3>
              </div>
              <div className="divide-y divide-slate-800">
                <EventRow time="07:14:34" type="detection" message="Person detected at JPL 102" severity="high" />
                <EventRow time="07:12:21" type="system" message="AI Model recalibrated" severity="low" />
                <EventRow time="07:08:15" type="detection" message="Vehicle detected at JPL 105" severity="medium" />
                <EventRow time="06:55:02" type="system" message="Camera CAM-04 reconnected" severity="low" />
                <EventRow time="06:45:18" type="detection" message="Person cleared from zone" severity="low" />
              </div>
            </div>
          </div>
        )}

        {/* TAB: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h3 className="font-bold text-lg mb-4">Pengaturan Sistem</h3>
              
              <div className="space-y-4">
                <SettingItem label="Notifikasi Suara" description="Aktifkan alarm saat deteksi" defaultOn />
                <SettingItem label="Auto-Record" description="Rekam otomatis saat event" defaultOn />
                <SettingItem label="Night Mode" description="Aktifkan mode malam untuk kamera" />
                <SettingItem label="AI Sensitivity" description="Tingkat sensitivitas deteksi AI" defaultOn />
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h3 className="font-bold text-lg mb-4">Info Sistem</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-400">Versi:</span> v2.0.0</div>
                <div><span className="text-slate-400">AI Model:</span> YOLOv8.2</div>
                <div><span className="text-slate-400">Uptime:</span> 99.97%</div>
                <div><span className="text-slate-400">Last Update:</span> 2 jam lalu</div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// ============ COMPONENTS ============

function TabButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
        active ? 'bg-white text-slate-900' : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={colors[color].split(' ').pop()}>{icon}</span>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

function VideoFeed({ title, location, isPrimary = false, hasDetection = false }: { title: string; location: string; isPrimary?: boolean; hasDetection?: boolean }) {
  return (
    <div className={`relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 ${isPrimary ? 'aspect-video' : 'aspect-[4/3]'}`}>
      {/* Placeholder Video */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <img 
          src="/images/orang melintas jalur.jpg" 
          alt={title}
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Detection Box */}
      {hasDetection && (
        <div className="absolute top-1/3 left-1/3 w-24 h-32 border-2 border-red-500 rounded">
          <div className="absolute -top-5 left-0 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">
            PERSON 98.2%
          </div>
        </div>
      )}

      {/* Overlay Info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      
      {/* Top Badge */}
      <div className="absolute top-2 left-2 flex items-center gap-2">
        <span className="flex items-center gap-1 bg-red-500 text-white text-[10px] px-2 py-1 rounded font-bold">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          REC
        </span>
        <span className="bg-green-500/80 text-white text-[10px] px-2 py-1 rounded font-bold">LIVE</span>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-2 left-2 right-2">
        <div className="text-white font-bold text-sm">{title}</div>
        <div className="text-slate-300 text-xs flex items-center gap-1">
          <MapPin size={10} />
          {location}
        </div>
      </div>

      {/* Timestamp */}
      <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded font-mono">
        {new Date().toLocaleTimeString('id-ID')}
      </div>
    </div>
  );
}

function QuickAction({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  const colors: Record<string, string> = {
    red: 'bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-400',
    orange: 'bg-orange-500/20 hover:bg-orange-500/30 border-orange-500/30 text-orange-400',
    blue: 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30 text-blue-400',
    green: 'bg-green-500/20 hover:bg-green-500/30 border-green-500/30 text-green-400',
  };

  return (
    <button className={`${colors[color]} border rounded-xl p-3 flex flex-col items-center gap-2 transition`}>
      {icon}
      <span className="text-xs font-medium text-white">{label}</span>
    </button>
  );
}

function JPLCard({ name, status, cameras, lastEvent }: { name: string; status: 'safe' | 'warning' | 'danger'; cameras: number; lastEvent: string }) {
  const statusColors = {
    safe: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  };
  const statusLabels = {
    safe: 'AMAN',
    warning: 'WASPADA',
    danger: 'BAHAYA'
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-sm">{name}</h4>
        <span className={`${statusColors[status]} text-white text-[10px] px-2 py-1 rounded font-bold`}>
          {statusLabels[status]}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
        <div><Camera size={12} className="inline mr-1" /> {cameras} Kamera</div>
        <div><Clock size={12} className="inline mr-1" /> {lastEvent}</div>
      </div>
    </div>
  );
}

function EventRow({ time, type, message, severity }: { time: string; type: string; message: string; severity: 'low' | 'medium' | 'high' }) {
  const severityColors = {
    low: 'text-slate-400',
    medium: 'text-yellow-400',
    high: 'text-red-400'
  };

  return (
    <div className="p-4 flex items-center gap-4 hover:bg-slate-800/50 transition">
      <div className="font-mono text-xs text-slate-500 w-16">{time}</div>
      <div className={`w-2 h-2 rounded-full ${severity === 'high' ? 'bg-red-500' : severity === 'medium' ? 'bg-yellow-500' : 'bg-slate-500'}`} />
      <div className="flex-1 text-sm">{message}</div>
      <div className={`text-xs ${severityColors[severity]}`}>{severity.toUpperCase()}</div>
    </div>
  );
}

function SettingItem({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  const [enabled, setEnabled] = useState(defaultOn);

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-slate-400">{description}</div>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-12 h-6 rounded-full transition ${enabled ? 'bg-green-500' : 'bg-slate-700'}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full transition transform ${enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}
