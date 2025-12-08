"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Train, 
  LayoutDashboard, 
  Settings, 
  Radio, 
  LogOut, 
  Activity,
  Shield,
  Radar
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 flex overflow-hidden">
      
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid-kai opacity-30 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-radial from-blue-950/20 via-transparent to-transparent pointer-events-none" />

      {/* SIDEBAR - Train Cockpit Style */}
      <aside className="w-20 lg:w-64 border-r-2 border-blue-900/50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between fixed h-full z-30 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
        
        {/* Logo Header */}
        <div>
          <div className="h-20 flex items-center px-4 lg:px-5 border-b-2 border-blue-900/50 bg-gradient-to-r from-blue-950/50 to-transparent">
            <div className="p-2.5 bg-blue-950/50 rounded-lg border border-blue-600/30 mr-3 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              <Train className="text-blue-400 w-5 h-5" />
            </div>
            <div className="hidden lg:block">
              <span className="font-display font-bold tracking-wider text-lg text-white">
                AEON<span className="text-blue-400">RAIL</span>
              </span>
              <div className="text-[9px] font-mono text-blue-500/60 tracking-widest">COMMAND CENTER</div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="px-3 py-6">
            <div className="text-[10px] font-mono text-blue-500/50 uppercase tracking-[0.2em] mb-4 px-2 hidden lg:block">
              SYSTEM MODULES
            </div>
            <nav className="space-y-1">
              <NavItem 
                href="/dashboard" 
                icon={<Radar size={18} />} 
                label="Live Monitor" 
                active={pathname === "/dashboard"} 
              />
              <NavItem 
                href="/dashboard/config" 
                icon={<Settings size={18} />} 
                label="Sensor Config" 
                active={pathname === "/dashboard/config"} 
              />
              <NavItem 
                href="#" 
                icon={<Activity size={18} />} 
                label="Analytics" 
              />
              <NavItem 
                href="#" 
                icon={<Shield size={18} />} 
                label="Security" 
              />
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t-2 border-blue-900/50 bg-gradient-to-t from-blue-950/30 to-transparent">
          <Link href="/">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-all border border-transparent hover:border-red-500/30 group">
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="hidden lg:block text-sm font-medium tracking-wide">Disconnect</span>
            </button>
          </Link>
          
          {/* System Status */}
          <div className="mt-3 flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-blue-600/20">
            <div className="relative">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping opacity-50" />
            </div>
            <div className="hidden lg:block">
              <div className="text-[10px] font-bold text-emerald-400 font-mono tracking-wider">SYSTEM ONLINE</div>
              <div className="text-[9px] text-slate-600 font-mono">v2.0.4 // KAI-NEXUS</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-20 lg:ml-64 relative flex flex-col h-screen overflow-hidden">
        
        {/* Top Bar - Cockpit Header */}
        <header className="h-14 border-b-2 border-blue-900/50 flex items-center justify-between px-6 bg-slate-950/90 backdrop-blur-md sticky top-0 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          
          {/* Left: Breadcrumb */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center text-xs font-mono tracking-widest text-slate-500">
              <span className="text-blue-500">KAI NEXUS</span>
              <span className="mx-2 text-slate-700">//</span>
              <span className="text-orange-400 uppercase font-bold">
                {pathname === "/dashboard" ? "LIVE MONITOR" : pathname.split("/").pop()?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Center: Live Indicator */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/80 px-4 py-1.5 rounded-full border border-blue-600/30">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-red-400 tracking-widest">LIVE</span>
          </div>

          {/* Right: Operator Info */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] font-mono text-blue-500/60 uppercase tracking-widest">OPERATOR</span>
              <span className="text-sm font-bold text-white tracking-wide font-mono">STATION MASTER</span>
            </div>
            <div className="h-9 w-9 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-200 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              SM
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-hidden relative">
          <div className="relative h-full z-10">
            {children}
          </div>
        </main>

        {/* Bottom Status Bar */}
        <footer className="h-8 border-t border-blue-900/30 bg-slate-950/90 flex items-center justify-between px-6 text-[10px] font-mono text-slate-600">
          <div className="flex items-center gap-6">
            <span>BACKEND: <span className="text-emerald-500">CONNECTED</span></span>
            <span>LATENCY: <span className="text-blue-400">12ms</span></span>
            <span>AI ENGINE: <span className="text-emerald-500">ACTIVE</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Radio size={10} className="text-blue-500" />
            <span>AEON RAILGUARD // PT KAI SMART CITY NEXUS</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href={href}>
      <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden ${
        active 
        ? 'bg-blue-950/50 text-blue-400 border border-blue-600/30 shadow-[0_0_20px_rgba(37,99,235,0.15)]' 
        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent hover:border-blue-600/20'
      }`}>
        {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_#3b82f6]" />}
        <span className={active ? "text-blue-400" : "group-hover:text-blue-400 transition-colors"}>{icon}</span>
        <span className="hidden lg:block text-sm font-medium tracking-wide">{label}</span>
      </button>
    </Link>
  );
}
