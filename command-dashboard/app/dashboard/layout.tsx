"use client";

import { DashboardProvider } from "@/contexts/DashboardContext";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col overflow-hidden">
        {/* AI Command Bar */}
        <DashboardNavbar />
        
        {/* Full Content Area - page.tsx handles 3-column layout */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </DashboardProvider>
  );
}
