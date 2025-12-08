"use client";

import { motion } from "framer-motion";
import { 
  Train, 
  AlertTriangle, 
  ShieldCheck, 
  Gauge, 
  Timer, 
  Radio,
  Ambulance,
  Siren,
  TrafficCone
} from "lucide-react";

interface TelemetryProps {
  trainSpeed: number;
  distanceToCrossing: number;
  eta: number;
  status: string;
  isDanger: boolean;
  cityResponse: string;
}

export default function TelemetryPanel({ 
  trainSpeed, 
  distanceToCrossing, 
  eta, 
  status,
  isDanger,
  cityResponse
}: TelemetryProps) {
  
  const formatETA = (seconds: number) => {
    if (seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isWarning = status === "WARNING";
  const isCritical = status === "CRITICAL";

  const getCityCommands = () => {
    if (cityResponse === "EMERGENCY_DISPATCH") {
      return [
        { icon: <TrafficCone size={14} />, target: "INTERSECTION_A1", action: "FORCE RED", priority: "CRITICAL" },
        { icon: <Ambulance size={14} />, target: "AMBULANCE_UNIT_7", action: "DEPLOY", priority: "CRITICAL" },
        { icon: <Siren size={14} />, target: "POLICE_UNIT_12", action: "DEPLOY", priority: "HIGH" },
        { icon: <Train size={14} />, target: "TRAIN_KA-2045", action: "EMERGENCY BRAKE", priority: "CRITICAL" },
      ];
    }
    if (cityResponse === "TRAFFIC_CAUTION") {
      return [
        { icon: <TrafficCone size={14} />, target: "TRAFFIC_GRID", action: "SLOW DOWN", priority: "WARNING" },
      ];
    }
    return [];
  };

  const cityCommands = getCityCommands();

  return (
    <div className="flex flex-col h-full gap-4">
      
      {/* DISTANCE TO TRAIN - Hero Display */}
      <div className="glass-panel-kai p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-kai opacity-50" />
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          isCritical ? 'bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse' :
          isWarning ? 'bg-gradient-to-r from-transparent via-orange-500 to-transparent' :
          'bg-gradient-to-r from-transparent via-blue-600 to-transparent'
        }`} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="kai-header flex items-center gap-2">
              <Train size={14} className="text-blue-500" />
              DISTANCE TO TRAIN
            </span>
            <div className={`h-2 w-2 rounded-full ${
              isCritical ? 'bg-red-500 animate-ping' : 
              isWarning ? 'bg-orange-500 animate-pulse' : 
              'bg-emerald-500'
            }`} />
          </div>
          
          <div className="flex items-end gap-2">
            <motion.span 
              key={distanceToCrossing.toFixed(1)}
              initial={{ scale: 1.05, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`font-display text-7xl font-black leading-none ${
                isCritical ? 'text-red-500 text-glow-orange animate-pulse' :
                isWarning ? 'text-orange-500 text-glow-orange' :
                'text-orange-500 text-glow-orange'
              }`}
            >
              {distanceToCrossing.toFixed(1)}
            </motion.span>
            <span className="text-orange-400/60 font-mono text-2xl mb-2 font-bold">KM</span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${
                isCritical ? 'bg-gradient-to-r from-red-600 to-red-400' :
                isWarning ? 'bg-gradient-to-r from-orange-600 to-orange-400' :
                'bg-gradient-to-r from-emerald-600 to-emerald-400'
              }`}
              initial={{ width: "100%" }}
              animate={{ width: `${Math.max(0, (distanceToCrossing / 10) * 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>0 KM (CROSSING)</span>
            <span>10 KM</span>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <motion.div
        animate={{
          backgroundColor: isCritical ? "rgba(127, 29, 29, 0.6)" : 
                          isWarning ? "rgba(120, 53, 15, 0.5)" :
                          "rgba(6, 78, 59, 0.3)",
          borderColor: isCritical ? "#dc2626" : 
                       isWarning ? "#f97316" :
                       "#059669",
        }}
        className="p-4 rounded-lg border-2 flex items-center justify-center gap-3 relative overflow-hidden"
      >
        {isCritical && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-pulse" />
        )}
        <motion.div
          animate={{ scale: isCritical ? [1, 1.2, 1] : 1 }}
          transition={{ repeat: isCritical ? Infinity : 0, duration: 0.5 }}
        >
          {isCritical 
            ? <AlertTriangle size={28} className="text-red-500" /> 
            : isWarning
            ? <AlertTriangle size={28} className="text-orange-500" />
            : <ShieldCheck size={28} className="text-emerald-500" />
          }
        </motion.div>
        <div className="text-center">
          <div className={`text-lg font-black tracking-widest font-mono ${
            isCritical ? "text-red-500" : 
            isWarning ? "text-orange-500" :
            "text-emerald-400"
          }`}>
            {status}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            {isCritical ? "EMERGENCY PROTOCOL ACTIVE" : 
             isWarning ? "APPROACHING CROSSING" :
             "ALL SYSTEMS OPERATIONAL"}
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-panel p-4 border-blue-600/20">
          <div className="flex items-center gap-2 mb-2">
            <Gauge size={12} className="text-blue-500" />
            <span className="kai-header text-[10px]">SPEED</span>
          </div>
          <div className="font-mono text-2xl font-bold text-blue-400">
            {trainSpeed.toFixed(0)}
            <span className="text-sm text-blue-400/50 ml-1">km/h</span>
          </div>
        </div>
        
        <div className="glass-panel p-4 border-blue-600/20">
          <div className="flex items-center gap-2 mb-2">
            <Timer size={12} className="text-blue-500" />
            <span className="kai-header text-[10px]">ETA</span>
          </div>
          <div className={`font-mono text-2xl font-bold ${eta < 60 ? 'text-orange-400' : 'text-blue-400'}`}>
            {formatETA(eta)}
            <span className="text-sm opacity-50 ml-1">min</span>
          </div>
        </div>
      </div>

      {/* City Grid Commands */}
      <div className="glass-panel flex-1 overflow-hidden flex flex-col border-blue-600/20">
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
          <span className="kai-header text-[10px] flex items-center gap-2">
            <Radio size={12} className="text-blue-500" />
            CITY GRID COMMANDS
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
            isCritical ? 'bg-red-500/20 text-red-400' :
            isWarning ? 'bg-orange-500/20 text-orange-400' :
            'bg-slate-800 text-slate-400'
          }`}>
            {cityCommands.length} ACTIVE
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {cityCommands.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-600 text-xs font-mono">
              NO ACTIVE COMMANDS
            </div>
          ) : (
            cityCommands.map((cmd, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-center gap-3 p-2.5 rounded border-l-2 ${
                  cmd.priority === "CRITICAL" 
                    ? "bg-red-950/40 border-red-500 text-red-400" 
                    : cmd.priority === "HIGH"
                    ? "bg-orange-950/30 border-orange-500 text-orange-400"
                    : "bg-yellow-950/20 border-yellow-500 text-yellow-400"
                }`}
              >
                <div className="p-1.5 rounded bg-slate-900/50">
                  {cmd.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono font-bold truncate">{cmd.target}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{cmd.action}</div>
                </div>
                <div className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                  cmd.priority === "CRITICAL" ? "bg-red-500/20 text-red-400" : 
                  cmd.priority === "HIGH" ? "bg-orange-500/20 text-orange-400" :
                  "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {cmd.priority}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
