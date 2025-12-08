"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Video, 
  VideoOff, 
  Maximize2, 
  Camera,
  Crosshair,
  AlertTriangle
} from "lucide-react";

interface VideoFeedProps {
  isDanger?: boolean;
  streamUrl?: string;
}

export default function VideoFeed({ isDanger = false, streamUrl }: VideoFeedProps) {
  const [isStreaming, setIsStreaming] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { 
        hour12: false, 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit" 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`glass-panel-kai flex-1 flex flex-col overflow-hidden relative ${
      isDanger ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : ''
    }`}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-blue-600/20 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Camera size={14} className="text-blue-500" />
          <span className="kai-header text-[10px]">CCTV FEED</span>
          <span className="text-[10px] font-mono text-slate-500">CAM-01</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${isStreaming ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-[10px] font-mono text-slate-400">
              {isStreaming ? 'REC' : 'OFF'}
            </span>
          </div>
          <button 
            onClick={() => setIsStreaming(!isStreaming)}
            className="p-1.5 hover:bg-slate-800 rounded transition-colors"
          >
            {isStreaming ? <Video size={14} className="text-blue-400" /> : <VideoOff size={14} className="text-slate-500" />}
          </button>
          <button className="p-1.5 hover:bg-slate-800 rounded transition-colors">
            <Maximize2 size={14} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-slate-950 min-h-[200px]">
        
        {/* Placeholder Grid Pattern */}
        <div className="absolute inset-0 bg-grid-kai opacity-20" />
        
        {/* Simulated Video Feed */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isStreaming ? (
            <div className="relative w-full h-full">
              {/* Simulated Detection Zone */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="roiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isDanger ? "#ef4444" : "#22c55e"} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={isDanger ? "#ef4444" : "#22c55e"} stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                
                {/* ROI Trapezoid */}
                <polygon 
                  points="30%,30% 70%,30% 90%,95% 10%,95%" 
                  fill="url(#roiGradient)"
                  stroke={isDanger ? "#ef4444" : "#22c55e"}
                  strokeWidth="2"
                  strokeDasharray={isDanger ? "0" : "5,5"}
                />
                
                {/* Corner Markers */}
                <g stroke={isDanger ? "#ef4444" : "#3b82f6"} strokeWidth="2" fill="none">
                  <path d="M 20,20 L 20,40 M 20,20 L 40,20" />
                  <path d="M 280,20 L 280,40 M 280,20 L 260,20" transform="translate(-280, 0) scale(-1, 1)" className="origin-center" style={{transform: 'translateX(100%) scaleX(-1)'}} />
                </g>
              </svg>

              {/* Crosshair Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Crosshair size={40} className={`${isDanger ? 'text-red-500/50' : 'text-blue-500/30'}`} />
              </div>

              {/* Danger Alert Overlay */}
              {isDanger && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-red-500/10 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <AlertTriangle size={48} className="text-red-500" />
                    <span className="text-red-500 font-display font-bold text-xl tracking-widest">
                      OBSTACLE DETECTED
                    </span>
                  </motion.div>
                </motion.div>
              )}

              {/* Scan Line Effect */}
              <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-slate-600">
              <VideoOff size={48} />
              <span className="font-mono text-sm">FEED OFFLINE</span>
            </div>
          )}
        </div>

        {/* Bottom Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-3">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-4 text-slate-400">
              <span>CROSSING: <span className="text-blue-400">JKT-07</span></span>
              <span>RES: <span className="text-blue-400">1920x1080</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">{currentTime}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                isDanger 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
              }`}>
                {isDanger ? 'ALERT' : 'CLEAR'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
