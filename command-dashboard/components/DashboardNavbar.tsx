'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Cpu, 
  Brain, 
  Wifi, 
  Shield,
  Radio,
  Zap,
  LogOut,
  Bell,
  Activity,
  Satellite,
  AlertTriangle,
  Signal
} from 'lucide-react';

const TICKER_MESSAGES = [
  { text: "Scanning Region 7 Perimeter...", type: "scan" },
  { text: "AI Model YOLOv8.2 Active", type: "ai" },
  { text: "Weather: Clear 32°C | Visibility: Excellent", type: "weather" },
  { text: "All Sensors Operational [24/24]", type: "sensor" },
  { text: "Network Latency: 24ms | Packet Loss: 0%", type: "network" },
  { text: "Last Incident: 4h 23m ago | Severity: LOW", type: "incident" },
  { text: "Central Brain: CONNECTED | Uptime: 99.97%", type: "system" },
  { text: "TRAIN ETA: 12 min | Direction: EAST", type: "train" },
];

export default function DashboardNavbar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tickerIndex, setTickerIndex] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(34);
  const [aiConfidence, setAiConfidence] = useState(98.2);
  const [networkLatency, setNetworkLatency] = useState(24);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ticker = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_MESSAGES.length);
    }, 4000);
    return () => clearInterval(ticker);
  }, []);

  useEffect(() => {
    const dataInterval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 20) + 30);
      setAiConfidence(97 + Math.random() * 2.5);
      setNetworkLatency(Math.floor(Math.random() * 15) + 18);
    }, 3000);
    return () => clearInterval(dataInterval);
  }, []);

  return (
    <header className="h-14 bg-gradient-to-r from-slate-900 via-[#1a2057] to-[#2D3588] border-b border-white/10 flex items-center justify-between px-4 sticky top-0 z-50 shadow-2xl shadow-black/50">
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </div>
      
      {/* LEFT: Logo + Version */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-[#F6841F] to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30 border border-orange-400/30">
            <img src="/images/logo%20Aeon.png" alt="Logo" className="w-7 h-7 object-contain" />
          </div>
          {/* Live Pulse */}
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
          </div>
        </div>
        <div>
          <div className="text-white font-black text-sm tracking-wide flex items-center gap-2">
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">COMMAND CENTER</span>
            <span className="text-[9px] font-mono bg-gradient-to-r from-[#F6841F] to-orange-500 text-white px-1.5 py-0.5 rounded shadow-lg">v2.0</span>
          </div>
          <div className="text-[10px] text-blue-300/80 font-mono tracking-widest">DAOP-7 JOMBANG | AEON RAILGUARD</div>
        </div>
      </div>

      {/* CENTER: System Ticker (THE BRAIN) */}
      <div className="flex-1 max-w-2xl mx-6 relative z-10">
        <div className="bg-black/50 border border-cyan-500/20 rounded-lg px-4 py-2 backdrop-blur-sm relative overflow-hidden shadow-lg shadow-cyan-900/20">
          {/* Scanning Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-blue-500 to-cyan-500 animate-pulse" />
          
          <div className="flex items-center gap-3 relative">
            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Satellite className="w-4 h-4 text-cyan-400" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-cyan-400/80 uppercase tracking-widest leading-none">SYS.STATUS</span>
                <span className="text-[9px] font-mono text-green-400 leading-none">NOMINAL</span>
              </div>
            </div>
            
            <div className="w-px h-6 bg-white/10" />
            
            {/* Ticker Content */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tickerIndex}
                  initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex items-center gap-2"
                >
                  <Radio className="w-3 h-3 text-green-400 animate-pulse" />
                  <span className="text-xs font-mono text-green-400 tracking-wide">
                    {TICKER_MESSAGES[tickerIndex].text}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="w-px h-6 bg-white/10" />
            
            {/* Time Display */}
            <div className="flex flex-col items-end">
              <div className="text-sm font-mono font-bold text-white tabular-nums tracking-wider">
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-[8px] font-mono text-slate-500 uppercase">
                {currentTime.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Live Indicators + Controls */}
      <div className="flex items-center gap-2 relative z-10">
        {/* Live Metrics Group */}
        <div className="flex items-center gap-1.5 bg-black/40 rounded-lg p-1 border border-white/10">
          <LiveIndicator 
            icon={<Cpu className="w-3 h-3" />} 
            label="CPU" 
            value={`${cpuUsage}%`} 
            color={cpuUsage > 70 ? 'red' : cpuUsage > 50 ? 'yellow' : 'cyan'}
          />
          <div className="w-px h-6 bg-white/10" />
          <LiveIndicator 
            icon={<Brain className="w-3 h-3" />} 
            label="AI" 
            value={`${aiConfidence.toFixed(1)}%`} 
            color="green"
            highlight
          />
          <div className="w-px h-6 bg-white/10" />
          <LiveIndicator 
            icon={<Signal className="w-3 h-3" />} 
            label="NET" 
            value={`${networkLatency}ms`} 
            color={networkLatency > 50 ? 'yellow' : 'blue'}
          />
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-1.5 bg-green-500/20 px-3 py-1.5 rounded-lg border border-green-500/40 shadow-lg shadow-green-500/10">
          <div className="relative">
            <Activity className="w-4 h-4 text-green-400" />
            <div className="absolute inset-0 animate-ping opacity-50">
              <Activity className="w-4 h-4 text-green-400" />
            </div>
          </div>
          <span className="text-[10px] font-black text-green-400 uppercase tracking-wider">ONLINE</span>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:border-white/20 group">
          <Bell className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
            3
          </div>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10 mx-1" />

        {/* User Menu */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2D3588] to-blue-700 border border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-lg">
            BS
          </div>
          <Link 
            href="/"
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/30 border border-red-500/20 hover:border-red-500/40 transition-all group"
            title="Keluar Sistem"
          >
            <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function LiveIndicator({ 
  icon, 
  label, 
  value, 
  color,
  highlight = false
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  color: 'cyan' | 'purple' | 'blue' | 'green' | 'yellow' | 'red',
  highlight?: boolean
}) {
  const colors = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
  };

  return (
    <div className="flex items-center gap-1.5 px-2 py-1">
      <div className={`${colors[color]} relative`}>
        {icon}
        {highlight && (
          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
        )}
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[8px] text-slate-500 font-bold leading-none uppercase">{label}</span>
        <span className={`text-[11px] font-mono font-bold leading-none ${highlight ? 'text-green-400' : 'text-white'}`}>
          {value}
        </span>
      </div>
    </div>
  );
}
