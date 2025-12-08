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
  Radar,
  FileText,
  History,
  HardDrive
} from "lucide-react";
import { DashboardProvider } from "@/contexts/DashboardContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <DashboardProvider>
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex overflow-hidden">
      
      {/* SIDEBAR - KAI Corporate Style */}
      <aside className="w-64 bg-[#2D3588] text-white flex flex-col justify-between fixed h-full z-30 shadow-lg">
        
        {/* Logo Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/10 bg-black/10">
          <div className="flex items-center gap-3">
             <div className="bg-white p-1.5 rounded-lg">
                <img 
                  src="/images/logo%20Aeon.png" 
                  alt="Aeon Logo" 
                  className="h-6 w-auto"
                />
             </div>
             <div>
               <div className="font-bold tracking-wide text-lg">AEON RAIL</div>
               <div className="text-[10px] text-blue-200 font-mono tracking-widest uppercase">Command Center</div>
             </div>
          </div>
        </div>
          
        {/* Navigation */}
        <div className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
            <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-4 px-3">
              Monitoring
            </div>
            <NavItem 
              href="/dashboard" 
              icon={<Radar size={18} />} 
              label="Live Monitor" 
              active={pathname === "/dashboard"} 
            />
            <NavItem 
              href="/dashboard/history" 
              icon={<History size={18} />} 
              label="Riwayat Insiden" 
              active={pathname === "/dashboard/history"}
            />
            
            <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-4 px-3 mt-8">
              Management
            </div>
            <NavItem 
              href="/dashboard/devices" 
              icon={<HardDrive size={18} />} 
              label="Manajemen Perangkat" 
              active={pathname === "/dashboard/devices"}
            />
            <NavItem 
              href="/dashboard/reports" 
              icon={<FileText size={18} />} 
              label="Laporan" 
              active={pathname === "/dashboard/reports"}
            />
        </div>

        {/* User Profile (Bottom) */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 mb-4">
             <div className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm font-bold">
               SM
             </div>
             <div>
               <div className="font-bold text-sm">Budi Santoso</div>
               <div className="text-xs text-blue-200">Station Master - Jombang</div>
             </div>
          </div>
          <Link href="/">
            <button className="w-full flex items-center justify-center gap-2 p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-200 hover:text-white transition-all text-xs font-bold border border-red-500/20">
              <LogOut size={14} />
              KELUAR SISTEM
            </button>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64 relative flex flex-col h-screen overflow-hidden bg-slate-50">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
           
           {/* Breadcrumbs */}
           <div className="flex items-center text-sm font-medium text-slate-500">
             <span className="hover:text-[#2D3588] cursor-pointer">Dashboard</span>
             <span className="mx-2">/</span>
             <span className="hover:text-[#2D3588] cursor-pointer">Live Monitoring</span>
             <span className="mx-2">/</span>
             <span className="text-[#2D3588] font-bold bg-blue-50 px-2 py-0.5 rounded">JPL 102 Jombang</span>
           </div>

           {/* System Status */}
           <div className="flex items-center gap-6 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                 <span>Sunny 32°C</span>
              </div>
              <div className="h-4 w-px bg-slate-300"></div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 <span>Latency: 42ms</span>
              </div>
              <div className="h-4 w-px bg-slate-300"></div>
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                 <Activity size={12} />
                 <span className="font-bold">SYSTEM STABLE</span>
              </div>
           </div>

        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
            {children}
        </main>

      </div>
    </div>
    </DashboardProvider>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href={href}>
      <button className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${
        active 
        ? 'bg-white text-[#2D3588] font-bold shadow-sm' 
        : 'text-blue-100 hover:bg-white/10 hover:text-white'
      }`}>
        <span className={active ? "text-[#2D3588]" : "opacity-70"}>{icon}</span>
        <span>{label}</span>
      </button>
    </Link>
  );
}
