"use client";
import { TramFront, Clock, Wind, Activity } from "lucide-react";
import { Orbitron } from 'next/font/google';
import clsx from 'clsx';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'] });

interface TelemetryProps {
    status: "SAFE" | "WARNING" | "CRITICAL";
    estimated_impact: number;
    emergency_units: string;
}

export default function TelemetryPanel({ status, estimated_impact, emergency_units }: TelemetryProps) {
    // Calculate simulated distance based on constant speed 85 km/h
    // Distance (km) = (Speed (km/h) * Time (s)) / 3600
    const speed = 85;
    const distance = (speed * (estimated_impact || 0)) / 3600;

    // Color Logic
    let distanceColor = "text-kai-blue-400"; // Default > 5km
    if (distance < 3) distanceColor = "text-kai-orange-500";
    if (status === "CRITICAL") distanceColor = "text-red-500";

    return (
        <div className="bg-slate-900/80 border-2 border-kai-blue-600/50 p-6 rounded-lg backdrop-blur shadow-[0_0_15px_rgba(0,94,184,0.3)] flex flex-col gap-6">
            <h2 className="text-kai-blue-400 text-sm tracking-[0.3em] font-bold border-b border-slate-700 pb-2">
                TELEMETRY DATA
            </h2>

            <div className="space-y-6">

                {/* Distance to Train */}
                <div className="group">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-400 uppercase">Proximity Alert</span>
                        <TramFront className={clsx("w-4 h-4", distanceColor)} />
                    </div>
                    <div className={clsx("text-5xl font-black tracking-tighter drop-shadow-lg transition-colors duration-300", orbitron.className, distanceColor)}>
                        {distance.toFixed(1)} <span className="text-xl text-slate-500">KM</span>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full bg-slate-800 h-1 mt-2 overflow-hidden">
                        <div
                            className={clsx("h-full transition-all duration-1000", status === "CRITICAL" ? "bg-red-500 animate-pulse" : "bg-kai-blue-400")}
                            style={{ width: `${Math.max(0, Math.min(100, (300 - distance * 100)))}%` }} // Arbitrary scale visual
                        />
                    </div>
                </div>

                {/* Speed & ETA Grid */}
                <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-4">
                    <div>
                        <span className="text-xs text-slate-400 uppercase block mb-1">Velocity</span>
                        <div className="text-2xl font-mono text-white flex gap-2 items-baseline">
                            {speed} <span className="text-xs text-slate-500">KM/H</span>
                        </div>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 uppercase block mb-1">Impact In</span>
                        <div className={clsx("text-2xl font-mono flex gap-2 items-baseline", status === "CRITICAL" ? "text-red-500" : "text-white")}>
                            {estimated_impact.toFixed(0)} <span className="text-xs text-slate-500">SEC</span>
                        </div>
                    </div>
                </div>

                {/* Smart City Response Panel */}
                <div className={clsx("p-4 rounded border relative overflow-hidden transition-colors duration-500",
                    status === "CRITICAL" ? "bg-red-950/50 border-red-500" : "bg-slate-800/50 border-slate-700"
                )}>
                    <div className="absolute top-2 right-2 opacity-30"><Activity size={24} /></div>
                    <div className="text-[10px] uppercase tracking-widest mb-1 opacity-70">City Response Protocol</div>
                    <div className={clsx("text-lg font-bold font-mono", status === "CRITICAL" ? "text-red-400 animate-pulse" : "text-emerald-400")}>
                        {emergency_units}
                    </div>
                </div>

            </div>
        </div>
    );
}
