"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Play, 
  Square, 
  Activity, 
  AlertTriangle, 
  Cpu, 
  Terminal,
  Scan,
  Video
} from "lucide-react";

// --- CONFIGURATION ---
const API_KEY = "SFxTwhygAqLcorHzIVXi"; // Provided by user
const MODEL_ENDPOINT = "find-people-2/1"; // Roboflow endpoint
const CONFIDENCE_THRESHOLD = 0.40;

interface Detection {
  x: number;
  y: number;
  width: number;
  height: number;
  class: string;
  confidence: number;
}

export default function AIPlayground() {
  // State
  const [mode, setMode] = useState<'webcam' | 'upload'>('webcam');
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Helper: Add Log
  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 50)]);
  };

  // Helper: Initialize Webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        addLog("Webcam stream initialized successfully.");
      }
    } catch (err) {
      addLog(`Error accessing webcam: ${err}`);
    }
  };

  // Helper: Handle File Upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = url;
      }
      addLog(`Loaded video file: ${file.name}`);
    }
  };

  // Helper: Draw Detections
  const drawDetections = (detections: Detection[]) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match canvas size to video display size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach(det => {
      // Color Logic
      let color = '#00FF00'; // Default Green
      if (det.class === 'person') color = '#F6E05E'; // Yellow
      if (det.class === 'train') color = '#EF4444'; // Red
      if (det.class === 'car' || det.class === 'truck') color = '#3B82F6'; // Blue

      // Draw Box
      const x = det.x - det.width / 2;
      const y = det.y - det.height / 2;

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, det.width, det.height);

      // Draw Label Background
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.8;
      const label = `${det.class.toUpperCase()} ${(det.confidence * 100).toFixed(0)}%`;
      const textWidth = ctx.measureText(label).width;
      ctx.fillRect(x, y - 25, textWidth + 10, 25);

      // Draw Text
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(label, x + 5, y - 8);
    });
  };

  // Helper: Run Inference
  const runInference = async () => {
    if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

    try {
      // Create a temporary canvas to capture frame
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = videoRef.current.videoWidth;
      tempCanvas.height = videoRef.current.videoHeight;
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(videoRef.current, 0, 0, tempCanvas.width, tempCanvas.height);
      
      // Convert to Base64
      const base64Image = tempCanvas.toDataURL('image/jpeg').split(',')[1];

      // Send to Roboflow
      const response = await fetch(`https://detect.roboflow.com/${MODEL_ENDPOINT}?api_key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: base64Image
      });

      const data = await response.json();

      if (data.predictions) {
        drawDetections(data.predictions);
        
        // Log high confidence detections
        const highConf = data.predictions.filter((p: Detection) => p.confidence > 0.7);
        if (highConf.length > 0) {
          const classes = highConf.map((p: Detection) => p.class).join(', ');
          addLog(`DETECTED: ${classes}`);
        }
      }

    } catch (err) {
      console.error(err);
      // Don't spam logs with network errors
    }
  };

  // Effect: Loop Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isScanning) {
      addLog("Starting Inference Loop...");
      interval = setInterval(() => {
        runInference();
      }, 150); // 150ms interval (~6-7 FPS) to respect API limits
    } else {
      // Clear canvas when stopped
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    return () => clearInterval(interval);
  }, [isScanning]);

  // Effect: Mode Switch
  useEffect(() => {
    setIsScanning(false);
    setVideoSrc(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = "";
    }

    if (mode === 'webcam') {
      startWebcam();
    }
  }, [mode]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
      
      {/* LEFT: VISUALIZER (2 Columns) */}
      <div className="xl:col-span-2 flex flex-col gap-4">
        
        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setMode('webcam')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
                mode === 'webcam' ? 'bg-white text-[#2D3588] shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Camera size={16} /> Webcam
            </button>
            <button
              onClick={() => setMode('upload')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
                mode === 'upload' ? 'bg-white text-[#2D3588] shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Upload size={16} /> Upload Video
            </button>
          </div>

          <div className="flex items-center gap-4">
            {mode === 'upload' && (
              <input 
                type="file" 
                accept="video/mp4,video/webm"
                onChange={handleFileUpload}
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
            )}
            
            <button
              onClick={() => setIsScanning(!isScanning)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white transition-all ${
                isScanning 
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
                  : 'bg-[#2D3588] hover:bg-blue-900 shadow-blue-200'
              } shadow-lg`}
            >
              {isScanning ? (
                <><Square size={16} /> STOP SCAN</>
              ) : (
                <><Play size={16} /> START AI</>
              )}
            </button>
          </div>
        </div>

        {/* Main Viewport */}
        <div 
          ref={containerRef}
          className="relative flex-1 bg-black rounded-xl overflow-hidden shadow-lg border border-slate-800 flex items-center justify-center group"
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="max-w-full max-h-full object-contain"
          />
          
          {/* Canvas Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />

          {/* Idle State */}
          {!videoRef.current?.srcObject && !videoRef.current?.src && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
              <Video size={48} className="mb-4 opacity-50" />
              <p className="text-sm font-mono">WAITING FOR VIDEO SOURCE...</p>
            </div>
          )}

          {/* Scanner Effect Overlay */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none bg-scanline opacity-10"></div>
          )}
          
          {/* HUD Info */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className={`px-3 py-1 rounded text-xs font-black font-mono flex items-center gap-2 ${
              isScanning ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
            }`}>
              <Activity size={12} />
              {isScanning ? 'LIVE INFERENCE' : 'STANDBY'}
            </div>
            <div className="px-3 py-1 rounded text-xs font-black font-mono bg-black/60 text-cyan-400 backdrop-blur-sm border border-cyan-900/30">
              MODEL: ROBOFLOW v2
            </div>
          </div>

          {isScanning && (
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-scan-vertical"></div>
          )}
        </div>
      </div>

      {/* RIGHT: LOGS (1 Column) */}
      <div className="xl:col-span-1 bg-[#0f172a] rounded-xl shadow-lg border border-slate-800 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 bg-[#1e293b] flex justify-between items-center">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold font-mono">
            <Terminal size={14} />
            SYSTEM LOGS
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            PORT: 443 SECURE
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {logs.length === 0 && (
            <div className="text-slate-600 italic text-center mt-10">
              System Ready. Initialize AI to view logs.
            </div>
          )}
          {logs.map((log, i) => (
            <div key={i} className="border-l-2 border-slate-700 pl-2 py-0.5">
              <span className="text-slate-500 mr-2">{log.split(']')[0]}]</span>
              <span className={`${
                log.includes('DETECTED') ? 'text-emerald-400 font-bold' : 
                log.includes('Error') ? 'text-red-400' : 'text-slate-300'
              }`}>
                {log.split(']')[1]}
              </span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>

        <div className="p-3 bg-[#1e293b] border-t border-slate-800 text-[10px] text-slate-500 font-mono flex justify-between">
          <span>CPU: 12%</span>
          <span>MEM: 408MB</span>
          <span>NET: 24kb/s</span>
        </div>
      </div>

    </div>
  );
}
