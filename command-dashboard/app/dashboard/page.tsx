"use client";

import { useWebSocket } from "@/hooks/useWebSocket";
import LiveMap from "@/components/LiveMap";
import TelemetryPanel from "@/components/TelemetryPanel";
import VideoFeed from "@/components/VideoFeed";
import { WifiOff, RefreshCw, Wifi } from "lucide-react";

export default function DashboardPage() {
  const { state, isConnected, reconnect } = useWebSocket();

  const isCritical = state.status === "CRITICAL";
  const isWarning = state.status === "WARNING";

  return (
    <div className="h-full flex flex-col gap-4">
      
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="bg-orange-950/50 border border-orange-500/50 rounded-lg px-4 py-3 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <WifiOff size={18} className="text-orange-500" />
            <div>
              <span className="text-orange-400 font-mono text-sm font-bold">BACKEND DISCONNECTED</span>
              <p className="text-orange-400/60 text-xs font-mono">Reconnecting to Central Brain...</p>
            </div>
          </div>
          <button 
            onClick={reconnect}
            className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 rounded text-orange-400 text-xs font-mono transition-colors"
          >
            <RefreshCw size={12} />
            RETRY
          </button>
        </div>
      )}

      {/* Main Grid - Map Centric Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        
        {/* Left Column: Video Feed */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <VideoFeed isDanger={isCritical} />
        </div>

        {/* Center Column: Live Map (Hero) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <LiveMap 
            trainDistance={state.distance}
            trainSpeed={state.speed}
            isDanger={isCritical}
            className="flex-1 min-h-[300px]"
          />
          
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-3 gap-3">
            <QuickStat 
              label="STATUS" 
              value={state.status} 
              color={isCritical ? "red" : isWarning ? "orange" : "emerald"}
            />
            <QuickStat 
              label="TRAIN" 
              value={state.train_id} 
              color="blue"
            />
            <QuickStat 
              label="TIME" 
              value={state.timestamp} 
              color="blue"
            />
          </div>
        </div>

        {/* Right Column: Telemetry */}
        <div className="lg:col-span-1">
          <TelemetryPanel 
            trainSpeed={state.speed}
            distanceToCrossing={state.distance}
            eta={(state.distance / state.speed) * 3600}
            status={state.status}
            isDanger={isCritical}
            cityResponse={state.city_action}
          />
        </div>
      </div>
    </div>
  );
}

function QuickStat({ label, value, color }: { label: string; value: string; color: string }) {
  const colorClasses: Record<string, string> = {
    emerald: "text-emerald-400 border-emerald-600/30",
    red: "text-red-400 border-red-600/30 bg-red-950/20",
    blue: "text-blue-400 border-blue-600/30",
    orange: "text-orange-400 border-orange-600/30 bg-orange-950/20",
  };

  return (
    <div className={`glass-panel px-3 py-2 border ${colorClasses[color] || colorClasses.blue}`}>
      <div className="text-[9px] font-mono text-slate-500 tracking-widest">{label}</div>
      <div className={`text-sm font-mono font-bold truncate ${colorClasses[color]?.split(" ")[0]}`}>
        {value}
      </div>
    </div>
  );
}
