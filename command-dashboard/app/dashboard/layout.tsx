'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR - Fixed Left */}
      <aside className="w-64 bg-[#2D2A70] text-white fixed h-full flex flex-col z-20">
        {/* Logo */}
        <div className="p-6 border-b border-white/20">
          <h1 className="text-2xl font-bold tracking-tight">AEON</h1>
          <p className="text-sm text-gray-300">RailGuard Command Center</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <p className="text-xs text-gray-400 uppercase mb-3 font-semibold">Main Menu</p>

          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 bg-[#DA5525] rounded-lg mb-2 font-medium"
          >
            <span>📊</span> Monitoring
          </Link>

          <Link
            href="/dashboard/history"
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg mb-2 text-gray-300 hover:text-white transition"
          >
            <span>📜</span> Riwayat
          </Link>

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition"
          >
            <span>⚙️</span> Pengaturan
          </Link>

          <div className="mt-6">
            <p className="text-xs text-gray-400 uppercase mb-3 font-semibold">Quick Actions</p>

            <button className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition">
              <span>🚨</span> Trigger Alert
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20">
          <div className="text-xs text-gray-400 space-y-1">
            <p>Central Brain: <span className="text-green-400">Online</span></p>
            <p>v2.1.0 | © 2025 Aeon</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* HEADER - Fixed Top */}
        <header className="bg-white shadow-sm border-b fixed top-0 right-0 left-64 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-xl font-bold text-[#2D2A70]">Live Monitoring</h2>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <span className="text-xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">Operator JPL</p>
                  <p className="text-xs text-gray-500">Pos Jombang 102</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#2D2A70] flex items-center justify-center text-white font-bold">
                  OP
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="mt-[73px] p-4 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
