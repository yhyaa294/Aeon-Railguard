'use client';

import { useState, useEffect, useRef } from 'react';
import StatusBadge from '@/components/dashboard/StatusBadge';
import LogList from '@/components/dashboard/LogList';

type StatusType = 'SAFE' | 'WARNING' | 'DANGER';

interface LogEntry {
  time: string;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success';
}

export default function DashboardPage() {
  const [status, setStatus] = useState<StatusType>('SAFE');
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: new Date().toLocaleTimeString('id-ID'), message: 'Sistem monitoring aktif', type: 'success' },
    { time: new Date().toLocaleTimeString('id-ID'), message: 'Semua kamera ONLINE', type: 'info' },
  ]);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = (message: string, type: 'info' | 'warning' | 'danger' | 'success') => {
    const now = new Date();
    const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: LogEntry = { time, message, type };
    setLogs((prevLogs) => [newLog, ...prevLogs].slice(0, 50));
  };

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket('ws://localhost:8080/ws');

      ws.onopen = () => {
        setWsConnected(true);
        addLog('Terhubung ke Central Brain', 'success');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.status) {
            const newStatus = data.status.toUpperCase();
            if (newStatus === 'CRITICAL' || newStatus === 'DANGER') {
              setStatus('DANGER');
            } else if (newStatus === 'WARNING') {
              setStatus('WARNING');
            } else {
              setStatus('SAFE');
            }
          }
          if (data.message) {
            const type = data.type || 'info';
            addLog(data.message, type);
          }
        } catch (err) {
          console.error('Parse error:', err);
        }
      };

      ws.onerror = () => {
        addLog('Koneksi error', 'warning');
      };

      ws.onclose = () => {
        setWsConnected(false);
        addLog('Koneksi terputus - reconnecting...', 'warning');
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
      };

      wsRef.current = ws;
    } catch (err) {
      addLog('Gagal koneksi ke backend', 'danger');
    }
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, []);

  return (
    <div className="h-full">
      {/* Connection Status Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#2D2A70]">🖥️ LIVE MONITORING</h1>
          <p className="text-sm text-slate-500">Pemantauan real-time Pos JPL 102</p>
        </div>
        <div className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 ${wsConnected
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-red-100 text-red-800'
          }`}>
          <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
          {wsConnected ? 'CONNECTED' : 'DISCONNECTED'}
        </div>
      </div>

      {/* Main Grid: Video (Left) + Intelligence (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-200px)]">

        {/* LEFT: Main Camera Feed (2 columns) */}
        <div className="xl:col-span-2 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative">
          {/* Video Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="text-8xl mb-4">📹</div>
              <p className="text-lg font-medium">Menunggu Stream...</p>
              <p className="text-sm text-white/40 mt-2">http://localhost:8080/stream/cam1</p>
            </div>
          </div>

          {/* Actual Video Stream (if available) */}
          <img
            src="http://localhost:8080/stream/cam1"
            alt="Live Feed"
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />

          {/* Top Overlay - Camera Label */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  LIVE
                </span>
                <span className="text-white font-bold text-lg">CAM-01 UTAMA</span>
              </div>
              <span className="text-white/70 text-sm bg-white/10 px-3 py-1 rounded-full">
                1080p • 30fps
              </span>
            </div>
          </div>

          {/* Bottom Overlay - Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <span>📍</span>
                  <span className="text-white/80">Pos Jombang 102 - Arah Timur</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-mono font-bold">
                  {new Date().toLocaleTimeString('id-ID')}
                </p>
                <p className="text-xs text-white/60">Waktu Lokal</p>
              </div>
            </div>
          </div>

          {/* AI Detection Overlay (Demo) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="border-2 border-green-400 rounded-lg px-4 py-1 bg-green-400/10">
              <span className="text-green-400 text-xs font-mono">AI: No Object Detected</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Intelligence Panel (1 column) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {/* Status Badge */}
          <StatusBadge status={status} />

          {/* AI Engine Info */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4">
            <h3 className="font-bold text-[#2D2A70] text-sm mb-3 flex items-center gap-2">
              <span>🤖</span> AI DETECTION ENGINE
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Model</span>
                <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">YOLOv8-Custom</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Inference</span>
                <span className="font-mono text-sm text-emerald-600 font-bold">&lt;50ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Objects</span>
                <span className="font-mono text-sm">person, vehicle</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">GPU</span>
                <span className="font-mono text-sm text-blue-600">CUDA Active</span>
              </div>
            </div>
          </div>

          {/* Log List */}
          <div className="flex-1 overflow-hidden">
            <LogList logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
}
