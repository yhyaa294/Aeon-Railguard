'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { href: '/dashboard', label: 'Monitoring', icon: '📊', active: true },
  { href: '/dashboard/history', label: 'Riwayat', icon: '📜', active: false },
  { href: '/dashboard/settings', label: 'Pengaturan', icon: '⚙️', active: false },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
      setCurrentDate(now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR - Fixed Left */}
      <aside className="w-64 bg-[#2D2A70] text-white fixed h-full flex flex-col z-30 shadow-2xl">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#DA5525] rounded-xl flex items-center justify-center text-xl font-black">
              A
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">AEON</h1>
              <p className="text-xs text-slate-400">RailGuard v2.0</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <p className="text-xs text-slate-400 uppercase mb-4 font-semibold tracking-wider">
            Menu Utama
          </p>

          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                    ${isActive
                      ? 'bg-[#DA5525] text-white shadow-lg shadow-[#DA5525]/30'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <p className="text-xs text-slate-400 uppercase mb-4 font-semibold tracking-wider">
              Aksi Cepat
            </p>

            <button className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold transition-all shadow-lg shadow-red-600/30 hover:scale-[1.02]">
              <span className="text-lg">🚨</span>
              <span>DARURAT</span>
            </button>
          </div>
        </nav>

        {/* Footer - System Status */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Central Brain: <span className="text-green-400">Online</span></span>
          </div>
          <p className="text-xs text-slate-500 mt-1">© 2026 GenZ AI</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* HEADER - Fixed Top */}
        <header className="bg-white shadow-sm border-b border-slate-200 fixed top-0 right-0 left-64 z-20 h-16">
          <div className="flex items-center justify-between px-6 h-full">
            {/* Left - Page Title */}
            <div>
              <h2 className="text-lg font-bold text-[#2D2A70]">Command Center</h2>
              <p className="text-xs text-slate-500">{currentDate}</p>
            </div>

            {/* Right - Clock & Profile */}
            <div className="flex items-center gap-6">
              {/* Digital Clock */}
              <div className="text-right">
                <p className="text-2xl font-mono font-bold text-[#2D2A70]">
                  {currentTime}
                </p>
                <p className="text-xs text-slate-500">Waktu Server</p>
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-slate-200"></div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-slate-100 rounded-xl transition">
                <span className="text-xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">Operator JPL</p>
                  <p className="text-xs text-slate-500">Pos Jombang 102</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D2A70] to-[#DA5525] flex items-center justify-center text-white font-bold shadow-lg">
                  OP
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="mt-16 p-6 flex-1 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
