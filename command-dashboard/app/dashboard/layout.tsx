'use client';

import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR - Fixed Left */}
      <aside className="w-64 bg-[#2D2A70] text-white fixed h-full flex flex-col">
        <div className="p-6 border-b border-white/20">
          <h1 className="text-2xl font-bold">AEON</h1>
          <p className="text-sm text-gray-300">RailGuard Dashboard</p>
        </div>

        <nav className="flex-1 p-4">
          <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-[#DA5525] rounded-lg mb-2 font-medium">
            <span>📊</span> Monitoring
          </a>
          <a href="/dashboard/history" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg mb-2 text-gray-300 hover:text-white transition">
            <span>📜</span> Riwayat
          </a>
          <a href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition">
            <span>⚙️</span> Pengaturan
          </a>
        </nav>

        <div className="p-4 border-t border-white/20">
          <p className="text-xs text-gray-400">v2.1.0 | © 2025 Aeon RailGuard</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* HEADER - Fixed Top */}
        <header className="bg-white shadow-sm border-b fixed top-0 right-0 left-64 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-xl font-bold text-[#2D2A70]">Live Monitoring</h2>
              <p className="text-sm text-gray-500">Real-time surveillance system</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">Operator JPL</p>
                <p className="text-xs text-gray-500">Pos Jombang</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#2D2A70] flex items-center justify-center text-white font-bold">
                OP
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="mt-[72px] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
