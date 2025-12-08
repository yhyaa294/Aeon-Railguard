"use client";

import { useState, useEffect } from "react";
import { Train, Gauge, MapPin, Clock, Radio, AlertTriangle, CheckCircle2, Wifi, WifiOff } from "lucide-react";

interface SystemState {
  train_id: string;
  speed: number;
  distance: number;
  status: string;
  city_action: string;
  timestamp: string;
}

export default function StatsPanel() {
  const [state, setState] = useState<SystemState>({
    train_id: "KA-2045",
    speed: 120,
    distance: 10.0,
    status: "SAFE",
    city_action: "MONITORING",
    timestamp: "00:00:00",
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let ws: WebSocket | null = null;
    
    const connect = () => {
      try {
        ws = new WebSocket("ws://localhost:8080/ws");
        
        ws.onopen = () => setIsConnected(true);
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setState(data);
          } catch (e) {
            console.error("Parse error:", e);
          }
        };
        
        ws.onclose = () => {
          setIsConnected(false);
          setTimeout(connect, 3000);
        };
        
        ws.onerror = () => setIsConnected(false);
      } catch (e) {
        setIsConnected(false);
        setTimeout(connect, 3000);
      }
    };
    
    connect();
    return () => { if (ws) ws.close(); };
  }, []);

  const isCritical = state.status === "CRITICAL";
  const isWarning = state.status === "WARNING";

  // Calculate ETA in seconds
  const eta = state.speed > 0 ? (state.distance / state.speed) * 3600 : 0;
  const formatETA = (seconds: number) => {
    if (seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section className="py-20 bg-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-full mb-4">
            <Radio className="w-4 h-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Live Dashboard Preview</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Real-Time System Telemetry
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Data langsung dari Central Brain - menampilkan status kereta, jarak ke perlintasan, dan respons kota.
          </p>
        </div>

        {/* Connection Status */}
        <div className="flex justify-center mb-8">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            isConnected 
              ? "bg-green-100 text-green-700 border border-green-200" 
              : "bg-orange-100 text-orange-700 border border-orange-200 animate-pulse"
          }`}>
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4" />
                Backend Connected • {state.timestamp}
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                Connecting to Backend...
              </>
            )}
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          
          {/* Distance Card - Hero */}
          <div className={`md:col-span-2 bg-white rounded-2xl p-8 shadow-sm border-2 transition-all ${
            isCritical ? "border-red-500 bg-red-50" : 
            isWarning ? "border-orange-500 bg-orange-50" : 
            "border-slate-200"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isCritical ? "bg-red-500" : isWarning ? "bg-orange-500" : "bg-blue-900"
                }`}>
                  <Train className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Distance to Crossing
                  </div>
                  <div className="text-xs text-slate-400">Train {state.train_id}</div>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                isCritical ? "bg-red-500 text-white animate-pulse" : 
                isWarning ? "bg-orange-500 text-white" : 
                "bg-green-500 text-white"
              }`}>
                {state.status}
              </div>
            </div>
            
            <div className="flex items-end gap-3 mb-6">
              <span className={`font-display text-7xl font-black leading-none tracking-tight ${
                isCritical ? "text-red-600" : isWarning ? "text-orange-600" : "text-blue-900"
              }`}>
                {state.distance.toFixed(1)}
              </span>
              <span className="text-3xl font-bold text-slate-400 mb-2">KM</span>
            </div>

            {/* Progress Bar */}
            <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isCritical ? "bg-red-500" : isWarning ? "bg-orange-500" : "bg-blue-900"
                }`}
                style={{ width: `${Math.max(0, (state.distance / 10) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
              <span>0 KM (CROSSING)</span>
              <span>10 KM</span>
            </div>
          </div>

          {/* Speed Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Gauge className="w-5 h-5 text-blue-900" />
              </div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Speed
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="font-display text-5xl font-black text-blue-900">
                {state.speed.toFixed(0)}
              </span>
              <span className="text-lg font-bold text-slate-400 mb-1">km/h</span>
            </div>
          </div>

          {/* ETA Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                ETA
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className={`font-display text-5xl font-black ${
                eta < 60 ? "text-orange-600" : "text-blue-900"
              }`}>
                {formatETA(eta)}
              </span>
            </div>
          </div>
        </div>

        {/* City Action Panel */}
        <div className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all ${
          isCritical ? "border-red-500 bg-red-50" : "border-slate-200"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isCritical ? "bg-red-500" : "bg-blue-900"
              }`}>
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  City Grid Response
                </div>
                <div className="text-xs text-slate-400">Smart City Infrastructure Control</div>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg font-bold text-sm ${
              isCritical 
                ? "bg-red-500 text-white animate-pulse" 
                : isWarning
                ? "bg-orange-500 text-white"
                : "bg-green-100 text-green-700"
            }`}>
              {state.city_action}
            </div>
          </div>

          {/* City Commands when CRITICAL */}
          {isCritical && (
            <div className="grid md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-red-200">
              <CityCommand label="Traffic Lights" value="ALL RED" critical />
              <CityCommand label="Ambulance" value="DISPATCHED" critical />
              <CityCommand label="Police Unit" value="EN ROUTE" critical />
              <CityCommand label="Train Signal" value="EMERGENCY STOP" critical />
            </div>
          )}
          
          {/* City Status when SAFE */}
          {state.status === "SAFE" && (
            <div className="grid md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100">
              <CityCommand label="Traffic Flow" value="NORMAL" />
              <CityCommand label="Emergency Units" value="STANDBY" />
              <CityCommand label="Rail Signal" value="GREEN" />
              <CityCommand label="Next Station" value="GAMBIR" />
            </div>
          )}

          {/* City Status when WARNING */}
          {isWarning && (
            <div className="grid md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-orange-200">
              <CityCommand label="Traffic Flow" value="CAUTION" warning />
              <CityCommand label="Emergency Units" value="ALERT" warning />
              <CityCommand label="Rail Signal" value="YELLOW" warning />
              <CityCommand label="Crossing Gate" value="CLOSING" warning />
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

function CityCommand({ label, value, critical = false, warning = false }: { 
  label: string; 
  value: string; 
  critical?: boolean;
  warning?: boolean;
}) {
  return (
    <div className={`p-3 rounded-lg ${
      critical ? "bg-red-100" : warning ? "bg-orange-100" : "bg-slate-50"
    }`}>
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className={`font-bold ${
        critical ? "text-red-700" : warning ? "text-orange-700" : "text-blue-900"
      }`}>
        {value}
      </div>
    </div>
  );
}
