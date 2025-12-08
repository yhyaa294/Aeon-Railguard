"use client";

import { useEffect, useRef } from "react";
import { Train, MapPin, AlertTriangle } from "lucide-react";

interface LiveMapProps {
  trainDistance: number;
  trainSpeed: number;
  isDanger: boolean;
  className?: string;
}

export default function LiveMap({ trainDistance, trainSpeed, isDanger, className = "" }: LiveMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, w, h);
      
      ctx.strokeStyle = "rgba(37, 99, 235, 0.15)";
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      
      const trackY = h * 0.5;
      const trackStartX = 50;
      const trackEndX = w - 50;
      
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(trackStartX, trackY);
      ctx.lineTo(trackEndX, trackY);
      ctx.stroke();
      
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      const tieSpacing = 20;
      for (let x = trackStartX; x < trackEndX; x += tieSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, trackY - 10);
        ctx.lineTo(x, trackY + 10);
        ctx.stroke();
      }
      
      const crossingX = trackEndX - 60;
      ctx.fillStyle = isDanger ? "rgba(239, 68, 68, 0.3)" : "rgba(34, 197, 94, 0.2)";
      ctx.fillRect(crossingX - 30, trackY - 40, 60, 80);
      
      ctx.strokeStyle = isDanger ? "#ef4444" : "#22c55e";
      ctx.lineWidth = 2;
      ctx.strokeRect(crossingX - 30, trackY - 40, 60, 80);
      
      ctx.fillStyle = isDanger ? "#ef4444" : "#22c55e";
      ctx.font = "bold 10px JetBrains Mono";
      ctx.textAlign = "center";
      ctx.fillText("CROSSING", crossingX, trackY + 60);
      
      const maxDistance = 10;
      const normalizedDist = Math.max(0, Math.min(trainDistance / maxDistance, 1));
      const trainX = trackStartX + (trackEndX - trackStartX - 80) * (1 - normalizedDist);
      
      ctx.fillStyle = "#1e40af";
      ctx.beginPath();
      ctx.roundRect(trainX, trackY - 15, 50, 30, 4);
      ctx.fill();
      
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.roundRect(trainX + 5, trackY - 10, 40, 20, 2);
      ctx.fill();
      
      ctx.fillStyle = "#60a5fa";
      ctx.beginPath();
      ctx.arc(trainX + 50, trackY, 8, 0, Math.PI * 2);
      ctx.fill();
      
      if (isDanger) {
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(trainX + 50, trackY);
        ctx.lineTo(crossingX, trackY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
      ctx.fillRect(10, 10, 150, 70);
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, 150, 70);
      
      ctx.fillStyle = "#3b82f6";
      ctx.font = "bold 10px JetBrains Mono";
      ctx.textAlign = "left";
      ctx.fillText("TRAIN KA-2045", 20, 30);
      
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px JetBrains Mono";
      ctx.fillText(`SPEED: ${trainSpeed.toFixed(0)} km/h`, 20, 48);
      ctx.fillText(`DIST: ${trainDistance.toFixed(2)} km`, 20, 65);
    };
    
    draw();
  }, [trainDistance, trainSpeed, isDanger]);
  
  return (
    <div className={`glass-panel-kai overflow-hidden relative ${className}`}>
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="kai-header text-[10px]">LIVE TRACK VIEW</span>
      </div>
      
      {isDanger && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-red-950/80 px-3 py-1.5 rounded border border-red-500 animate-pulse">
          <AlertTriangle size={14} className="text-red-500" />
          <span className="text-red-400 text-xs font-mono font-bold">OBSTACLE DETECTED</span>
        </div>
      )}
      
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={300}
        className="w-full h-full"
      />
      
      <div className="absolute bottom-3 left-3 flex gap-4 text-[10px] font-mono text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-600" />
          <span>TRAIN</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-600/50 border border-green-500" />
          <span>SAFE ZONE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-600/50 border border-red-500" />
          <span>DANGER ZONE</span>
        </div>
      </div>
    </div>
  );
}
