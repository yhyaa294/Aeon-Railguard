"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import SystemStatus from "../components/SystemStatus";
import LiveFeed from "../components/LiveFeed";
import TelemetryPanel from "../components/TelemetryPanel";
import clsx from 'clsx';
import { Orbitron } from 'next/font/google';

const LiveMap = dynamic(() => import('../components/LiveMap'), { ssr: false });
const orbitron = Orbitron({ subsets: ['latin'], weight: ['400'] });

// Define State Interface centrally
interface SystemState {
  status: "SAFE" | "WARNING" | "CRITICAL";
  message: string;
  active_alerts: number;
  traffic_light: "GREEN" | "RED";
  train_signal: "PROCEED" | "STOP";
  emergency_units: "IDLE" | "DISPATCHED" | "RETURNING";
  estimated_impact: number;
}

export default function Home() {
  const [state, setState] = useState<SystemState | null>(null);
  const [connected, setConnected] = useState(false);

  // --- WebSocket Connection ---
  useEffect(() => {
    let ws: WebSocket;
    const connect = () => {
      ws = new WebSocket("ws://localhost:8080/ws");
      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        setTimeout(connect, 3000); // Auto Reconnect
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setState(data);
        } catch (e) { console.error("WS Parse Error", e); }
      };
    };
    connect();
    return () => ws?.close();
  }, []);

  const isCritical = state?.status === "CRITICAL";

  return (
    <main className={clsx(
      "flex min-h-screen flex-col bg-kai-slate-950 text-white p-4 gap-4 transition-all duration-300",
      isCritical && "ring-[20px] ring-inset ring-red-600/30 animate-[pulse_1s_infinite]"
    )}>

      {/* --- Header --- */}
      <header className="flex justify-between items-center border-b-2 border-kai-blue-600 pb-4 mb-2">
        <div className="flex items-center gap-4">
          <div className={clsx(
            "text-white font-black px-4 py-2 rounded-sm tracking-[0.2em] transition-colors",
            isCritical ? "bg-red-600 animate-pulse" : "bg-kai-blue-600"
          )}>
            COMMAND CENTER // DAOP 1
          </div>
          <h1 className={clsx("text-2xl font-bold tracking-tighter", orbitron.className)}>
            AEON RAILGUARD <span className="text-xs align-top opacity-50 font-sans">v2.0</span>
          </h1>
        </div>
        <div className="flex gap-4 font-mono text-sm opacity-70">
          <span className={connected ? "text-emerald-500" : "text-red-500"}>
            NET: {connected ? "SECURE" : "OFFLINE"}
          </span>
          <span>SYS_TIME: {new Date().toLocaleTimeString()}</span>
        </div>
      </header>

      {/* --- Main Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1">

        {/* Left Column: Visuals (Map + Camera + Status) */}
        <div className="col-span-1 md:col-span-8 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96">
            <LiveFeed />
            <LiveMap />
          </div>
          <SystemStatus state={state} />
        </div>

        {/* Right Column: Telemetry & Terminal */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-4">
          <TelemetryPanel
            status={state?.status || "SAFE"}
            estimated_impact={state?.estimated_impact || 0}
            emergency_units={state?.emergency_units || "IDLE"}
          />

          {/* Terminal Log */}
          <div className="flex-1 bg-black border border-slate-800 rounded p-4 font-mono text-xs text-green-400 overflow-y-auto font-bold opacity-80 min-h-[200px]">
            <p>&gt; SYSTEM INITIALIZED...</p>
            <p>&gt; CONNECTING TO SENSOR ARRAY (YOLOv8)... OK</p>
            <p>&gt; LISTENING ON PORT 8080...</p>
            {connected && <p className="text-emerald-500">&gt; WEBSOCKET CONNECTED_</p>}
            {state?.status === 'CRITICAL' && (
              <>
                <p className="text-red-500 blink">&gt; ALERT RECEIVED!</p>
                <p className="text-red-500">&gt; DANGER LEVEL: CRITICAL</p>
                <p className="text-amber-500">&gt; DISPATCHING {state.emergency_units}...</p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
