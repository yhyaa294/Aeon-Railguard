"use client";

import { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '@/contexts/DashboardContext';
import SidebarTree from './components/SidebarTree';
import {
  Activity,
  Video,
  AlertTriangle,
  RefreshCw,
  Maximize2,
  Radio,
  Camera,
  Clock,
  Shield,
  Siren,
  Lock,
  Power,
  Droplets,
  Brain,
  Phone,
  Mic,
  AlertCircle,
  Zap,
  MonitorSpeaker,
  ChevronRight,
  Home,
  Eye,
  Server,
  Gauge,
  Radar,
  History,
  FileText,
  HardDrive,
  LogOut,
  Volume2,
  Flashlight,
  RotateCcw,
  Target,
  Wifi,
  Thermometer,
  Bell,
  Settings,
  Crosshair,
  MapPin
} from "lucide-react";

const MapWidget = dynamic(() => import('@/components/MapWidget'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-800 animate-pulse rounded-lg" />
});

export default function DashboardPage() {
  const {
    selectedNode,
    dataTree,
    isLoading,
    isEmergency,
    cityStatus,
    getFilteredView,
    selectPost,
    selectUnit,
    selectNode,
    breadcrumbs
  } = useDashboard();

  const filteredData = useMemo(() => getFilteredView(), [getFilteredView]);
  const [systemTime, setSystemTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-950 font-sans text-white">

      {/* ====== LEFT: NAVIGATION SIDEBAR ====== */}
      <div className="w-72 flex-shrink-0 bg-gradient-to-b from-[#2D3588] via-[#232b6b] to-[#1a2057] border-r border-white/10 z-10 flex flex-col shadow-2xl shadow-blue-900/30">
        
        {/* Logo Header */}
        <div className="h-16 flex items-center px-4 border-b border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg shadow-lg shadow-white/10">
              <img src="/images/logo%20Aeon.png" alt="Aeon Logo" className="h-7 w-auto" />
            </div>
            <div>
              <div className="font-black tracking-wide text-white text-sm">AEON RAILGUARD</div>
              <div className="text-[9px] text-cyan-300 font-mono tracking-[0.2em] uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                WAR ROOM v2.0
              </div>
            </div>
          </div>
        </div>

        {/* Quick Nav Grid */}
        <div className="px-3 py-4 border-b border-white/10 bg-black/20">
          <div className="text-[9px] font-bold text-cyan-300/70 uppercase tracking-[0.15em] mb-3 px-1 flex items-center gap-2">
            <Radar size={10} />
            QUICK ACCESS
          </div>
          <div className="grid grid-cols-2 gap-2">
            <QuickNavButton icon={<Radar size={16} />} label="Live View" active />
            <QuickNavButton icon={<History size={16} />} label="History" />
            <QuickNavButton icon={<HardDrive size={16} />} label="Devices" />
            <QuickNavButton icon={<FileText size={16} />} label="Reports" />
          </div>
        </div>

        {/* Hierarchical Tree View */}
        <div className="flex-1 overflow-hidden">
          <SidebarTree />
        </div>

        {/* System Status */}
        <div className="p-3 border-t border-white/10 bg-black/30">
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>System OK</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Wifi size={12} />
              <span>Connected</span>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-3 border-t border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 border border-white/20 flex items-center justify-center text-sm font-bold text-white shadow-lg">
              BS
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-white truncate">Budi Santoso</div>
              <div className="text-[10px] text-cyan-300">Station Master</div>
            </div>
            <Link href="/" className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 transition-all">
              <LogOut size={14} className="text-red-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* ====== CENTER: MAIN COMMAND VIEW ====== */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 relative">
        
        {/* Cyberpunk Grid Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 via-transparent to-purple-900/5" />
        </div>

        {/* Emergency Banner */}
        <AnimatePresence>
          {isEmergency && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white rounded-xl shadow-2xl shadow-red-500/30 overflow-hidden mb-4 border border-red-500"
            >
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2.5 rounded-full animate-bounce">
                    <AlertTriangle size={22} />
                  </div>
                  <div>
                    <div className="font-black text-sm tracking-wider uppercase">EMERGENCY PROTOCOL ACTIVE</div>
                    <div className="text-red-100 text-xs font-mono">All units dispatched • Response team en route • ETA: 2 min</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-red-200">ELAPSED</div>
                    <div className="font-mono text-lg font-bold">00:02:34</div>
                  </div>
                  <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold text-sm transition-colors">
                    ACKNOWLEDGE
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP ROW: Stats Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4 relative z-10">
          <StatCard 
            icon={<AlertCircle className="w-5 h-5" />} 
            label="Total Events (24h)" 
            value="847" 
            trend="+12%"
            trendUp={true}
            color="orange" 
          />
          <StatCard 
            icon={<Camera className="w-5 h-5" />} 
            label="Active Cameras" 
            value="24/26" 
            trend="92%"
            trendUp={true}
            color="green" 
          />
          <StatCard 
            icon={<Clock className="w-5 h-5" />} 
            label="Avg Response" 
            value="2.4s" 
            trend="-0.3s"
            trendUp={true}
            color="blue" 
          />
          <StatCard 
            icon={<Server className="w-5 h-5" />} 
            label="System Health" 
            value="98.2%" 
            trend="Optimal"
            trendUp={true}
            color="cyan" 
          />
        </div>

        {/* MAIN VIDEO GRID */}
        <div className="grid grid-cols-12 gap-3 relative z-10">
          {/* Large Primary Feed - 2x2 */}
          <div className="col-span-8 row-span-2">
            <VideoFeed 
              title="CAM-01 Main Crossing" 
              location="JPL 102 Jombang"
              isPrimary
              status="recording"
              aiDetection={{ label: "PERSON", confidence: 98.2, bbox: true }}
            />
          </div>
          
          {/* Secondary Feed */}
          <div className="col-span-4">
            <VideoFeed 
              title="CAM-02 East Gate" 
              location="Entry Point A" 
              status="recording"
            />
          </div>
          <div className="col-span-4">
            <VideoFeed 
              title="CAM-03 Platform" 
              location="Platform 1" 
              status="recording"
            />
          </div>
          
          {/* Bottom Row */}
          <div className="col-span-4">
            <VideoFeed 
              title="CAM-04 West Gate" 
              location="Entry Point B" 
              status="recording"
            />
          </div>
          <div className="col-span-4">
            <VideoFeed 
              title="CAM-05 Parking" 
              location="Zone C" 
              status="idle"
            />
          </div>
          <div className="col-span-4">
            <VideoFeed 
              title="CAM-06 Reserve" 
              location="Backup Unit" 
              status="offline"
            />
          </div>
        </div>

        {/* BOTTOM: Mini Map */}
        <div className="mt-4 h-48 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden relative shadow-xl">
          <MapWidget status="SAFE" />
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-2 border border-white/10">
            <Eye className="w-3.5 h-3.5 text-green-400" />
            <span>LIVE TRACKING</span>
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-400 border border-cyan-500/20">
            LAT: -7.5456 | LNG: 112.2654
          </div>
        </div>
      </div>

      {/* ====== RIGHT: ACTION PANEL (GLASSMORPHISM) ====== */}
      <div className="w-80 flex-shrink-0 bg-slate-900/50 backdrop-blur-xl border-l border-white/10 flex flex-col overflow-hidden relative">
        
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/30 via-slate-900/50 to-slate-950/70 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Panel Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-black/30 backdrop-blur-sm relative z-10">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#F6841F] to-orange-600 shadow-lg shadow-orange-500/30">
            <MonitorSpeaker className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-black text-sm text-white tracking-wide">CONTROL PANEL</div>
            <div className="text-[10px] text-slate-400 font-mono">Manual Override Controls</div>
          </div>
        </div>

        {/* Scrollable Action Groups */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
          
          {/* EMERGENCY ACTIONS */}
          <ActionGroup title="Emergency Response" color="red" icon={<AlertTriangle size={14} />}>
            <ActionButton 
              icon={<Lock className="w-5 h-5" />} 
              label="LOCKDOWN AREA" 
              sublabel="Activate all barriers"
              variant="danger" 
            />
            <ActionButton 
              icon={<Siren className="w-5 h-5" />} 
              label="TRIGGER SIREN" 
              sublabel="120dB warning"
              variant="danger" 
            />
            <ActionButton 
              icon={<Volume2 className="w-5 h-5" />} 
              label="EMERGENCY HORN" 
              sublabel="3x long blast"
              variant="danger" 
            />
          </ActionGroup>

          {/* MAINTENANCE ACTIONS */}
          <ActionGroup title="Maintenance" color="blue" icon={<Settings size={14} />}>
            <ActionButton 
              icon={<RotateCcw className="w-5 h-5" />} 
              label="Reboot Unit" 
              sublabel="Restart selected camera"
              variant="secondary" 
            />
            <ActionButton 
              icon={<Droplets className="w-5 h-5" />} 
              label="Wiper On" 
              sublabel="Clean lens remotely"
              variant="secondary" 
            />
            <ActionButton 
              icon={<Flashlight className="w-5 h-5" />} 
              label="Toggle IR Light" 
              sublabel="Night vision assist"
              variant="secondary" 
            />
            <ActionButton 
              icon={<Brain className="w-5 h-5" />} 
              label="Reset AI Model" 
              sublabel="Recalibrate detection"
              variant="secondary" 
            />
          </ActionGroup>

          {/* COMMUNICATION ACTIONS */}
          <ActionGroup title="Communication" color="green" icon={<Radio size={14} />}>
            <ActionButton 
              icon={<Mic className="w-5 h-5" />} 
              label="Broadcast Voice" 
              sublabel="PA System active"
              variant="primary" 
            />
            <ActionButton 
              icon={<Phone className="w-5 h-5" />} 
              label="Call Station Master" 
              sublabel="Direct line"
              variant="primary" 
            />
          </ActionGroup>
        </div>

        {/* Bottom: Live Metrics Panel */}
        <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-sm relative z-10">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
            <Activity size={12} className="text-green-400" />
            LIVE SYSTEM METRICS
          </div>
          <div className="grid grid-cols-2 gap-2">
            <MetricBox label="Detection Rate" value="847" unit="/day" color="orange" />
            <MetricBox label="False Positive" value="2.1" unit="%" color="green" />
            <MetricBox label="Uptime" value="99.97" unit="%" color="blue" />
            <MetricBox label="Latency" value="24" unit="ms" color="cyan" />
          </div>
          
          {/* AI Model Info */}
          <div className="mt-3 p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain size={14} className="text-purple-400" />
                <span className="text-[10px] font-bold text-purple-300">AI MODEL</span>
              </div>
              <span className="text-[10px] font-mono text-purple-400">YOLOv8.2</span>
            </div>
            <div className="text-[9px] text-purple-400/70 mt-1 font-mono">Confidence: 98.2% | Objects: 4 classes</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== SUB-COMPONENTS ====================

function StatCard({ icon, label, value, trend, trendUp, color }: { 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  trend: string,
  trendUp: boolean,
  color: 'green' | 'orange' | 'blue' | 'red' | 'cyan'
}) {
  const colors = {
    green: { bg: 'from-green-500/20 to-green-600/5', border: 'border-green-500/30', text: 'text-green-400', shadow: 'shadow-green-500/10' },
    orange: { bg: 'from-orange-500/20 to-orange-600/5', border: 'border-orange-500/30', text: 'text-orange-400', shadow: 'shadow-orange-500/10' },
    blue: { bg: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/30', text: 'text-blue-400', shadow: 'shadow-blue-500/10' },
    red: { bg: 'from-red-500/20 to-red-600/5', border: 'border-red-500/30', text: 'text-red-400', shadow: 'shadow-red-500/10' },
    cyan: { bg: 'from-cyan-500/20 to-cyan-600/5', border: 'border-cyan-500/30', text: 'text-cyan-400', shadow: 'shadow-cyan-500/10' },
  };
  const c = colors[color];

  return (
    <div className={`bg-gradient-to-br ${c.bg} border ${c.border} rounded-xl p-3 backdrop-blur-sm shadow-lg ${c.shadow} relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      <div className="flex items-center justify-between mb-2 relative">
        <div className={c.text}>{icon}</div>
        <span className={`text-[10px] font-mono ${trendUp ? 'text-green-400' : 'text-red-400'}`}>{trend}</span>
      </div>
      <div className="text-2xl font-mono font-black text-white relative">{value}</div>
      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{label}</div>
    </div>
  );
}

function VideoFeed({ title, location, isPrimary = false, status, aiDetection }: { 
  title: string, 
  location: string, 
  isPrimary?: boolean,
  status: 'recording' | 'idle' | 'offline',
  aiDetection?: { label: string, confidence: number, bbox: boolean }
}) {
  const statusConfig = {
    recording: { color: 'bg-red-500', text: 'REC', animate: true },
    idle: { color: 'bg-yellow-500', text: 'IDLE', animate: false },
    offline: { color: 'bg-slate-500', text: 'OFFLINE', animate: false },
  };
  const s = statusConfig[status];

  return (
    <div className={`relative bg-slate-900 rounded-xl overflow-hidden border border-slate-700/50 group hover:border-slate-600 transition-all shadow-xl ${isPrimary ? 'h-[340px]' : 'h-40'}`}>
      {/* Video Placeholder */}
      <img 
        src="/images/perlintasan%20ilegal.png" 
        alt={title}
        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
      />
      
      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Scanline Effect */}
        <div className="absolute inset-0 bg-scanline opacity-10" />
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 via-black/60 to-transparent p-2 flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${s.color} ${s.animate ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] font-mono text-white/80 uppercase tracking-wider">{s.text}</span>
            {status === 'recording' && (
              <span className="text-[9px] font-mono text-red-400 animate-pulse">● LIVE</span>
            )}
          </div>
          <span className="text-[10px] font-mono text-white/60 tabular-nums">
            {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* AI Bounding Box */}
        {isPrimary && aiDetection?.bbox && status === 'recording' && (
          <div className="absolute top-1/3 left-1/4 w-32 h-24 border-2 border-green-400/80 rounded animate-pulse">
            <div className="absolute -top-6 left-0 bg-green-500 text-[9px] font-mono px-2 py-1 rounded-t text-white flex items-center gap-1 shadow-lg">
              <Crosshair size={10} />
              {aiDetection.label} {aiDetection.confidence.toFixed(1)}%
            </div>
            {/* Corner Markers */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-green-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-green-400" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-green-400" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-green-400" />
          </div>
        )}

        {/* Frame Brackets */}
        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-white/30" />
        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-white/30" />
        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-white/30" />
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-white/30" />

        {/* Bottom Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3">
          <div className="flex items-center gap-2">
            <Camera size={12} className="text-cyan-400" />
            <div className="text-xs font-bold text-white">{title}</div>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={10} className="text-slate-400" />
            <div className="text-[10px] text-slate-400 font-mono">{location}</div>
          </div>
        </div>
      </div>

      {/* Expand Button */}
      <button className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80 border border-white/10">
        <Maximize2 className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}

function ActionGroup({ title, color, icon, children }: { 
  title: string, 
  color: 'red' | 'blue' | 'green',
  icon?: React.ReactNode,
  children: React.ReactNode 
}) {
  const colors = {
    red: { bg: 'bg-red-500/5', border: 'border-red-500/30', text: 'text-red-400', glow: 'shadow-red-500/5' },
    blue: { bg: 'bg-blue-500/5', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/5' },
    green: { bg: 'bg-green-500/5', border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-green-500/5' },
  };
  const c = colors[color];

  return (
    <div className={`rounded-xl p-3 border ${c.border} ${c.bg} backdrop-blur-sm shadow-lg ${c.glow}`}>
      <div className={`text-[10px] font-bold uppercase tracking-[0.1em] mb-3 flex items-center gap-2 ${c.text}`}>
        {icon}
        {title}
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

function ActionButton({ icon, label, sublabel, variant }: { 
  icon: React.ReactNode, 
  label: string,
  sublabel?: string,
  variant: 'danger' | 'primary' | 'secondary' 
}) {
  const variants = {
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border-red-500/50 shadow-lg shadow-red-500/20',
    primary: 'bg-gradient-to-r from-[#2D3588] to-blue-700 hover:from-[#3a45a0] hover:to-blue-600 text-white border-blue-500/30 shadow-lg shadow-blue-500/10',
    secondary: 'bg-slate-800/80 hover:bg-slate-700 text-white border-slate-600/50',
  };

  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-bold transition-all active:scale-[0.98] ${variants[variant]}`}>
      <div className="p-1 bg-white/10 rounded">{icon}</div>
      <div className="flex-1 text-left">
        <div className="leading-tight">{label}</div>
        {sublabel && <div className="text-[9px] font-normal opacity-70">{sublabel}</div>}
      </div>
      <ChevronRight size={16} className="opacity-50" />
    </button>
  );
}

function QuickNavButton({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all text-xs font-bold ${
      active 
        ? 'bg-white text-[#2D3588] shadow-xl shadow-white/20' 
        : 'bg-white/10 text-blue-100 hover:bg-white/20 border border-white/10'
    }`}>
      {icon}
      <span className="text-[10px]">{label}</span>
    </button>
  );
}

function MetricBox({ label, value, unit, color }: { 
  label: string, 
  value: string, 
  unit: string,
  color: 'orange' | 'green' | 'blue' | 'cyan'
}) {
  const colors = {
    orange: 'text-orange-400',
    green: 'text-green-400',
    blue: 'text-blue-400',
    cyan: 'text-cyan-400',
  };

  return (
    <div className="bg-white/5 rounded-lg p-2.5 border border-white/10 backdrop-blur-sm">
      <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1 font-medium">{label}</div>
      <div className="flex items-baseline gap-0.5">
        <span className={`text-lg font-mono font-black ${colors[color]}`}>{value}</span>
        <span className="text-[10px] text-slate-500 font-mono">{unit}</span>
      </div>
    </div>
  );
}
