"use client";

import React from 'react';
import AIPlayground from '@/components/AIPlayground';
import { Cpu, ShieldCheck } from "lucide-react";

export default function AITestPage() {
  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <Cpu size={14} className="text-orange-500" />
            <span>System Diagnostics</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            AI Model Playground
          </h1>
        </div>
        
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm text-slate-600">
           <ShieldCheck size={16} className="text-[#2D3588]" />
           <span className="font-bold">Secure Environment</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <AIPlayground />
      </div>
    </div>
  );
}
