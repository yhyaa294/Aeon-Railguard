"use client";

import { AlertTriangle, CheckCircle, ShieldAlert, Activity, TramFront, Siren } from "lucide-react";
import { clsx } from "clsx";

interface SystemState {
    status: "SAFE" | "WARNING" | "CRITICAL";
    message: string;
    active_alerts: number;
    traffic_light: "GREEN" | "RED";
    train_signal: "PROCEED" | "STOP";
    emergency_units: "IDLE" | "DISPATCHED" | "RETURNING";
    estimated_impact: number;
}

interface Props {
    state: SystemState | null;
}

export default function SystemStatus({ state }: Props) {
    if (!state) return <div className="text-cyan-500 animate-pulse font-mono tracking-widest text-xs p-4 border border-cyan-900 rounded bg-cyan-950/30">CONNECTING TO CITY GRID...</div>;

    const isCritical = state.status === "CRITICAL";

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-slate-700 bg-slate-900/80 backdrop-blur-md rounded-lg shadow-2xl">
            {/* Main Status */}
            <div className={clsx("col-span-1 md:col-span-3 p-4 rounded border-l-4 flex items-center justify-between transition-colors duration-500",
                isCritical ? "bg-red-900/30 border-red-500 text-red-100" : "bg-emerald-900/30 border-emerald-500 text-emerald-100"
            )}>
                <div className="flex items-center gap-4">
                    {isCritical ? <ShieldAlert className="w-12 h-12 animate-pulse text-red-500" /> : <CheckCircle className="w-12 h-12 text-emerald-500" />}
                    <div>
                        <h2 className="text-2xl font-bold tracking-widest">{state.status}</h2>
                        <p className="text-sm font-mono opacity-80">{state.message}</p>
                    </div>
                </div>
            </div>

            {/* Traffic Light Control */}
            <div className="p-4 bg-slate-800 rounded border border-slate-700 relative overflow-hidden group">
                <div className="absolute top-2 right-2 opacity-20"><Siren size={40} /></div>
                <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-2">Traffic Grid A4</h3>
                <div className={clsx("text-xl font-mono font-bold transition-colors", state.traffic_light === "RED" ? "text-red-500" : "text-emerald-500")}>
                    LIGHTS: {state.traffic_light}
                </div>
            </div>

            {/* Train Signal */}
            <div className="p-4 bg-slate-800 rounded border border-slate-700 relative overflow-hidden group">
                <div className="absolute top-2 right-2 opacity-20"><TramFront size={40} /></div>
                <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-2">Rail Signal 99</h3>
                <div className={clsx("text-xl font-mono font-bold transition-colors", state.train_signal === "STOP" ? "text-red-500" : "text-emerald-500")}>
                    SIGNAL: {state.train_signal}
                </div>
            </div>

            {/* Emergency Response */}
            <div className="p-4 bg-slate-800 rounded border border-slate-700 relative overflow-hidden group">
                <div className="absolute top-2 right-2 opacity-20"><Activity size={40} /></div>
                <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-2">EMS Dispatch</h3>
                <div className={clsx("text-xl font-mono font-bold transition-colors", state.emergency_units !== "IDLE" ? "text-amber-500 animate-pulse" : "text-blue-500")}>
                    {state.emergency_units}
                </div>
            </div>
        </div>
    );
}
