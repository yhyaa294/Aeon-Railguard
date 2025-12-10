'use client';

import { useState } from 'react';
import StatusBadge from '@/components/dashboard/StatusBadge';
import LogList from '@/components/dashboard/LogList';

type StatusType = 'AMAN' | 'WASPADA' | 'BAHAYA';

interface LogEntry {
  time: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
}

export default function DashboardPage() {
  const [status, setStatus] = useState<StatusType>('AMAN');
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: '13:24:15', message: 'Sistem monitoring aktif', severity: 'info' },
    { time: '13:22:42', message: 'Semua kamera online', severity: 'info' },
  ]);

  const addLog = (message: string, severity: 'info' | 'warning' | 'danger') => {
    const now = new Date();
    const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: LogEntry = { time, message, severity };
    setLogs([newLog, ...logs].slice(0, 10)); // Keep only last 10 logs
  };

  const simulateAman = () => {
    setStatus('AMAN');
    addLog('Simulasi: Situasi aman, tidak ada deteksi', 'info');
  };

  const simulateWaspada = () => {
    setStatus('WASPADA');
    addLog('⚠️ Simulasi: Deteksi objek mendekati perlintasan', 'warning');
  };

  const simulateBahaya = () => {
    setStatus('BAHAYA');
    addLog('🚨 Simulasi: BAHAYA! Terdeteksi orang di rel kereta!', 'danger');
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* LEFT: Video Player (70%) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-4 h-full">
            <h3 className="text-lg font-bold text-[#2D2A70] mb-4">Live Feed - Kamera Utama</h3>
            <div className="relative bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
              {/* Placeholder sampai video stream ready */}
              <div className="text-center">
                <div className="text-6xl mb-4">📹</div>
                <p className="text-gray-600 font-medium">Video Stream</p>
                <p className="text-sm text-gray-500">Camera Feed akan tampil di sini</p>
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
          {/* Status Badge - Now Dynamic */}
          <StatusBadge status={status} />

          {/* Log List - Now Dynamic */}
          <LogList logs={logs} />
        </div>
      </div>

      {/* DEBUG PANEL - Simulation Buttons */}
      <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl p-4 border-2 border-gray-300">
        <p className="text-xs font-bold text-gray-600 mb-2 uppercase">🔧 Debug Panel</p>
        <div className="flex gap-2">
          <button
            onClick={simulateAman}
            className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition shadow"
          >
            ✓ AMAN
          </button>
          <button
            onClick={simulateWaspada}
            className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-medium transition shadow"
          >
            ⚠ WASPADA
          </button>
          <button
            onClick={simulateBahaya}
            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition shadow"
          >
            🚨 BAHAYA
          </button>
        </div>
      </div>
    </div>
  );
}
