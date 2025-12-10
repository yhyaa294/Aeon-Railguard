'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NotificationItem {
  id: string;
  time: string;
  message: string;
  type: 'critical' | 'warning' | 'info';
  read: boolean;
}

const mainMenuItems = [
  { href: '/dashboard', label: 'Monitor Utama', icon: '📊' },
  { href: '/dashboard/history', label: 'Riwayat Kejadian', icon: '📜' },
  { href: '/dashboard/settings', label: 'Pengaturan', icon: '⚙️' },
];

const locations = [
  { id: 'JPL-102', name: 'JPL 102 - Kebun Melati' },
  { id: 'JPL-201', name: 'JPL 201 - Sumbermulyo' },
  { id: 'JPL-305', name: 'JPL 305 - Ngembe' },
  { id: 'JPL-410', name: 'JPL 410 - Rejoso' },
];

const initialNotifications: NotificationItem[] = [
  { id: 'N1', time: '13:45', message: 'TERDETEKSI MANUSIA DI REL (JPL Ngembe)', type: 'critical', read: false },
  { id: 'N2', time: '10:20', message: 'Palang Pintu Terlambat Menutup (JPL Rejoso)', type: 'warning', read: false },
  { id: 'N3', time: '08:00', message: 'Sistem Online & Kalibrasi Selesai', type: 'info', read: false },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view');
  const notifRef = useRef<HTMLDivElement>(null);

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotifStyle = (type: string) => {
    switch (type) {
      case 'critical': return { icon: '🚨', bg: 'bg-red-900/20', border: 'border-l-red-500', text: 'text-red-400' };
      case 'warning': return { icon: '⚠️', bg: 'bg-amber-900/20', border: 'border-l-amber-500', text: 'text-amber-400' };
      default: return { icon: '✅', bg: 'bg-emerald-900/20', border: 'border-l-emerald-500', text: 'text-emerald-400' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-200">
      {/* SIDEBAR - Dark Glassy */}
      <aside className="w-64 bg-slate-900/90 backdrop-blur-xl border-r border-white/5 fixed h-full flex flex-col z-30 shadow-2xl">
        {/* Logo Area */}
        <div className="p-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-xl font-black text-white shadow-lg shadow-orange-500/20 ring-1 ring-white/10">A</div>
            <div>
              <h1 className="text-lg font-bold tracking-widest text-white">AEON</h1>
              <p className="text-[10px] text-orange-400 font-semibold uppercase tracking-widest">RailGuard Enterprise</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          {/* Main Menu */}
          <div className="mb-8">
            <p className="text-[10px] text-slate-500 uppercase mb-3 font-bold tracking-widest px-4">Menu Utama</p>
            <div className="space-y-1">
              {mainMenuItems.map((item) => {
                const isActive = pathname === item.href && !currentView;
                return (
                  <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${isActive ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-400' : 'text-slate-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}>
                    <span className="text-lg opacity-80">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Locations */}
          <div className="mb-8">
            <p className="text-[10px] text-slate-500 uppercase mb-3 font-bold tracking-widest px-4">Lokasi Pantauan</p>
            <div className="space-y-1">
              <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${!currentView && pathname === '/dashboard' ? 'bg-white/5 text-white border-l-2 border-slate-500' : 'text-slate-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}>
                <span className="text-lg">🌐</span>
                <span>Global Overview</span>
              </Link>
              {locations.map((loc) => {
                const isActive = currentView === loc.id;
                return (
                  <Link key={loc.id} href={`/dashboard?view=${loc.id}`} className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-300 ${isActive ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-400' : 'text-slate-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse' : 'bg-emerald-500'}`}></span>
                      <span className="text-sm">{loc.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Emergency Button */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase mb-3 font-bold tracking-widest px-4">Aksi Cepat</p>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all duration-300 bg-gradient-to-r from-red-600/10 to-red-900/10 text-red-500 hover:from-red-600/20 hover:to-red-900/20 border border-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] active:scale-95">
              <span className="text-lg animate-pulse">🚨</span>
              <span>DARURAT PUSAT</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2 uppercase tracking-wide">
            <span>System Status</span>
            <span className="text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">● ONLINE</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-full animate-progress-indeterminate shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          </div>
          <p className="text-[10px] text-slate-600 mt-3 text-center tracking-wider">© 2026 AEON RailGuard • ENT-V2.0</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen bg-slate-950 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03] pointer-events-none"></div>

        {/* HEADER - Glassmorphism */}
        <header className="bg-slate-900/70 backdrop-blur-xl border-b border-white/5 fixed top-0 right-0 left-64 z-20 h-16 flex items-center justify-between px-8 shadow-2xl">
          <div className="flex items-center gap-4">
            {/* AEON Logo */}
            <Image src="/images/logo Aeon.png" alt="AEON" width={120} height={40} className="object-contain" />
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-orange-500 rounded-full"></div>
              <h2 className="text-sm font-bold text-white tracking-widest uppercase">Command Center</h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Clock */}
            <div className="text-right hidden md:block">
              <p className="text-lg font-mono font-bold text-slate-200 tracking-wider shadow-orange-500/10 text-shadow">{currentTime}</p>
              <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 font-medium tracking-wide">
                <span>{currentDate}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-white/10 hidden md:block"></div>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors border border-transparent hover:border-white/10"
              >
                <span className="text-xl text-slate-400 group-hover:text-white">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 min-w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-lg shadow-red-500/50 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotif && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50 ring-1 ring-black/50">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                    <h3 className="font-bold text-white text-xs uppercase tracking-wider">Notifikasi ({unreadCount})</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-[10px] text-orange-400 font-bold hover:text-orange-300 transition-colors">
                        MARK READ
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 text-xs">Tidak ada notifikasi baru.</div>
                    ) : (
                      notifications.map((notif) => {
                        const style = getNotifStyle(notif.type);
                        return (
                          <div
                            key={notif.id}
                            onClick={() => setShowNotif(false)}
                            className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 border-l-2 ${style.border} ${!notif.read ? style.bg : 'bg-transparent'}`}
                          >
                            <span className="text-lg mt-0.5">{style.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-bold ${style.text}`}>{notif.message}</p>
                              <p className="text-[10px] text-slate-500 mt-1">{notif.time}</p>
                            </div>
                            {!notif.read && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 shadow-[0_0_5px_rgba(249,115,22,0.8)]"></span>}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2 bg-white/5 border-t border-white/5">
                    <button className="w-full text-center text-[10px] text-slate-400 font-bold hover:text-white py-1 uppercase tracking-wider">
                      Riwayat Lengkap →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white tracking-wide">Administrator</p>
                <p className="text-[10px] text-slate-500 uppercase">DAOP 7 MADIUN</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="mt-16 p-6 flex-1 overflow-x-hidden relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
