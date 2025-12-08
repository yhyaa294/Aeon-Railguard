"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Info } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full bg-white overflow-hidden py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

        {/* Left: Text Content */}
        <div className="space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
            <Info className="w-4 h-4 text-blue-900" />
            <span className="text-xs font-semibold text-blue-900 tracking-wide uppercase">
              Ekraf Tech Summit 2025 Pivot
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-blue-900 tracking-tight leading-[1.1]">
            Integrated
            <span className="block text-orange-500">Smart City</span>
            Railway Safety.
          </h1>

          <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
            Transitioning from hardware-dependent barriers to a scalable, camera-driven IVA platform.
            We connect railway vision with city emergency headers for zero-latency response.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/dashboard">
              <button className="group flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                View Live Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* Right: High Quality Visual */}
        <div className="relative h-[400px] lg:h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
          <Image
            src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80"
            alt="KAI Fast Train"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />

          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur px-6 py-4 rounded-xl shadow-lg border-l-4 border-orange-500">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Active Monitoring</p>
            <p className="text-xl font-bold text-blue-900">Jalur Selatan - KM 145</p>
          </div>
        </div>

      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -z-10 skew-x-[-12deg] translate-x-32" />
    </section>
  );
}
