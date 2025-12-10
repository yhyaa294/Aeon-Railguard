'use client';

import { useState, useEffect, useRef } from 'react';
import StatusBadge from '@/components/dashboard/StatusBadge';
import LogList from '@/components/dashboard/LogList';

type StatusType = 'AMAN' | 'WASPADA' | 'BAHAYA';

interface LogEntry {
  time: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
}

interface CameraSlot {
  id: number;
  name: string;
  label: string;
  status: 'ONLINE' | 'OFFLINE';
  isMain?: boolean;
}

const cameras: CameraSlot[] = [
  { id: 1, name: 'CAM-01', label: 'CAM 01 - UTAMA (LIVE)', status: 'ONLINE', isMain: true },
  { id: 2, name: 'CAM-02', label: 'CAM 02 - Arah Barat', status: 'ONLINE' },
  { id: 3, name: 'CAM-03', label: 'CAM 03 - Thermal Utara', status: 'ONLINE' },
  { id: 4, name: 'CAM-04', label: 'CAM 04 - Thermal Selatan', status: 'ONLINE' },
];

export default function DashboardPage() {
  const [status, setStatus] = useState<StatusType>('AMAN');
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: new Date().toLocaleTimeString('id-ID'), message: 'Command Center aktif', severity: 'info' },
    { time: new Date().toLocaleTimeString('id-ID'), message: 'Semua kamera ONLINE', severity: 'info' },
  ]);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = (message: string, severity: 'info' | 'warning' | 'danger') => {
    const now = new Date();
    const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: LogEntry = { time, message, severity };
    setLogs((prevLogs) => [newLog, ...prevLogs].slice(0, 20));
  };

  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.error('Audio play error:', err));
    }
  };

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket('ws://localhost:8080/ws');

      ws.onopen = () => {
        setWsConnected(true);
        addLog('✓ Terhubung ke Central Brain', 'info');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.status) {
            const newStatus = data.status.toUpperCase();
            if (newStatus === 'CRITICAL' || newStatus === 'DANGER') {
              setStatus('BAHAYA');
              playAlarm();
            } else if (newStatus === 'WARNING') {
              setStatus('WASPADA');
            } else {
              setStatus('AMAN');
            }
          }
          if (data.message) {
            const severity = data.severity || 'info';
            addLog(data.message, severity);
          }
        } catch (err) {
          console.error('Parse error:', err);
        }
      };

      ws.onerror = () => {
        addLog('⚠ Koneksi error', 'warning');
      };

      ws.onclose = () => {
        setWsConnected(false);
        addLog('⚠ Koneksi terputus - reconnecting...', 'warning');
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
      };

      wsRef.current = ws;
    } catch (err) {
      addLog('✗ Gagal koneksi ke backend', 'danger');
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
      {/* Hidden Audio */}
      <audio ref={audioRef} src="/alarm.mp3" preload="auto" />

      {/* Connection Status */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-[#2D2A70]">🖥️ COMMAND CENTER</h1>
        <div className={`px-4 py-2 rounded-full text-xs font-bold ${wsConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {wsConnected ? '🟢 LIVE' : '🔴 OFFLINE'}
        </div>
      </div>

      {/* Main Grid: Cameras (Left) + Intelligence Panel (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 h-[calc(100vh-180px)]">

        {/* LEFT: 2x2 Camera Grid (Takes 3 columns on XL) */}
        <div className="xl:col-span-3">
          <div className="grid grid-cols-2 gap-3 h-full">
            {cameras.map((cam) => (
              <div
                key={cam.id}
                className={`relative rounded-xl overflow-hidden ${cam.isMain
                  ? 'bg-gray-900 ring-2 ring-[#DA5525]'
                  : 'bg-gray-800'
                  }`}
              >
                {/* Camera Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <div className="text-5xl mb-2">📹</div>
                    <p className="text-sm">Stream {cam.name}</p>
                  </div>
                </div>

                {/* If Main Camera - Actual Stream */}
                {cam.isMain && (
                  <img
                    src="http://localhost:8080/stream/cam1"
                    alt="Live Feed"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}

                {/* Overlay: Label */}
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${cam.isMain ? 'text-[#DA5525]' : 'text-white'}`}>
                      {cam.label}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${cam.status === 'ONLINE'
                      ? 'bg-green-500/80 text-white'
                      : 'bg-red-500/80 text-white'
                      }`}>
                      {cam.status}
                    </span>
                  </div>
                </div>

                {/* Overlay: Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <div className="flex items-center justify-between text-white/80 text-xs">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      REC
                    </span>
                    <span>{new Date().toLocaleTimeString('id-ID')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Live Intelligence Panel (1 column on XL) */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          {/* Status Badge - Large */}
          <div className="flex-shrink-0">
            <StatusBadge status={status} />
          </div>

          {/* AI Detection Info */}
          <div className="bg-[#2D2A70] rounded-xl p-4 text-white">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <span>🤖</span> AI DETECTION ENGINE
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Model</span>
                <span className="font-mono">YOLOv8-Custom</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Inference</span>
                <span className="font-mono text-green-400">&lt;50ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Objects</span>
                <span className="font-mono">person, vehicle</span>
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
