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

interface WebSocketMessage {
  status?: string;
  message?: string;
  severity?: 'info' | 'warning' | 'danger';
}

export default function DashboardPage() {
  const [status, setStatus] = useState<StatusType>('AMAN');
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: new Date().toLocaleTimeString('id-ID'), message: 'Sistem monitoring aktif', severity: 'info' },
  ]);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const addLog = (message: string, severity: 'info' | 'warning' | 'danger') => {
    const now = new Date();
    const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: LogEntry = { time, message, severity };
    setLogs((prevLogs) => [newLog, ...prevLogs].slice(0, 20)); // Keep last 20 logs
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
        console.log('✅ WebSocket connected');
        setWsConnected(true);
        addLog('WebSocket terhubung ke backend', 'info');
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);

          // Update status if provided
          if (data.status) {
            const newStatus = data.status.toUpperCase() as StatusType;

            // Map backend status to frontend status
            if (newStatus === 'CRITICAL' || newStatus === 'DANGER') {
              setStatus('BAHAYA');
              playAlarm();
            } else if (newStatus === 'WARNING' || newStatus === 'WASPADA') {
              setStatus('WASPADA');
            } else {
              setStatus('AMAN');
            }
          }

          // Add log if message provided
          if (data.message) {
            const severity = data.severity || (data.status === 'CRITICAL' ? 'danger' : data.status === 'WARNING' ? 'warning' : 'info');
            addLog(data.message, severity);
          }
        } catch (err) {
          console.error('WebSocket message parse error:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        addLog('WebSocket error - mencoba reconnect...', 'warning');
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setWsConnected(false);
        addLog('WebSocket terputus - reconnecting...', 'warning');

        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('WebSocket connection failed:', err);
      addLog('Gagal koneksi ke backend', 'danger');
    }
  };

  useEffect(() => {
    // Connect WebSocket on mount
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Hidden Audio Element for Alarm */}
      <audio ref={audioRef} src="/alarm.mp3" preload="auto" />

      {/* Connection Status Indicator */}
      <div className="fixed top-20 right-6 z-50">
        <div className={`px-4 py-2 rounded-full text-xs font-medium ${wsConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {wsConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* LEFT: Video Player (70%) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-4 h-full">
            <h3 className="text-lg font-bold text-[#2D2A70] mb-4">Live Feed - Kamera Utama</h3>
            <div className="relative bg-gray-900 rounded-lg aspect-video overflow-hidden">
              {/* Video Stream from Backend */}
              <img
                src="http://localhost:8080/stream/cam1"
                alt="Live Camera Feed"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback placeholder if stream fails
                  e.currentTarget.style.display = 'none';
                }}
              />

              {/* Fallback Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-6xl mb-4">📹</div>
                  <p className="text-white font-medium">Video Stream</p>
                  <p className="text-sm text-gray-400">Menunggu koneksi ke camera...</p>
                </div>
              </div>

              {/* Overlay Info */}
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                REC
              </div>
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {new Date().toLocaleTimeString('id-ID')}
              </div>
            </div>

            {/* Video Controls */}
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-[#2D2A70] text-white rounded-lg hover:bg-[#1a1850] transition text-sm font-medium">
                📷 Ambil Screenshot
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium">
                🔍 Zoom In
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium">
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Status + Logs (30%) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Badge - Real-time from WebSocket */}
          <StatusBadge status={status} />

          {/* Log List - Real-time from WebSocket */}
          <LogList logs={logs} />
        </div>
      </div>
    </div>
  );
}
