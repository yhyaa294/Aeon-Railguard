'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { ArrowRight, Brain, Cpu, Cloud } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#F6841F]/30 overflow-x-hidden">
      
      <Navbar />

      {/* --- HERO SECTION (CINEMATIC 3D LAYERED) --- */}
      <section className="relative h-screen w-full overflow-hidden">
        
        {/* Layer 0: Background Station */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/stasiun.png"
            alt="Station Background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900/30" />
        </div>

        {/* Layer 1: Content (Sky/Middle) */}
        <div className="relative z-10 flex flex-col items-center justify-start pt-32 md:pt-48 px-4 text-center h-full">
          <div className="animate-fade-in-up space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter drop-shadow-2xl">
              AEON RAILGUARD
            </h1>
            
            <div className="inline-block">
              <span className="bg-[#F6841F] text-white px-4 py-1 rounded-full font-bold tracking-widest text-sm md:text-base uppercase shadow-lg">
                Sistem Keselamatan Perkeretaapian Terpadu
              </span>
            </div>

            <div className="pt-4">
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 bg-[#F6841F] hover:bg-[#d66e12] text-white px-8 py-3 rounded-full font-bold transition-all shadow-xl hover:shadow-orange-500/20 hover:scale-105"
              >
                Jelajahi Sistem <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Layer 2: Foreground Train (Anchored Bottom) */}
        <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
          <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
            <Image
              src="/images/kereta transparan ke kanan.png"
              alt="Train Foreground"
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>
      </section>

      {/* --- SECTION 1: THE PROBLEM --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/images/perlintasan ilegal.png"
                alt="Jalur Tikus"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-[#2D3588]">Realita di Jalur Tikus</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Ribuan perlintasan sebidang ilegal menjadi ancaman mematikan setiap hari. Tanpa palang pintu dan petugas, keselamatan warga dan perjalanan kereta api dipertaruhkan demi mobilitas ekonomi lokal.
              </p>
              <div className="p-4 bg-orange-50 border-l-4 border-[#F6841F] text-slate-700 italic">
                "Bahaya mengintai di setiap persimpangan tak resmi."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: THE SOLUTION --- */}
      <section className="py-24 bg-[#2D3588] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Mengubah Ilegal Menjadi <span className="text-[#F6841F]">Smart Crossing</span></h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
            Solusi berbasis teknologi yang memantau, mendeteksi, dan memberikan peringatan dini secara otomatis tanpa perlu infrastruktur fisik yang mahal.
          </p>
        </div>
      </section>

      {/* --- SECTION 3: TECH STACK --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Core Technology</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TechCard 
              icon={<Brain className="w-10 h-10 text-[#F6841F]" />}
              title="AI Vision"
              desc="Computer Vision mendeteksi objek berbahaya secara real-time."
            />
            <TechCard 
              icon={<Cpu className="w-10 h-10 text-[#F6841F]" />}
              title="IoT Sensor"
              desc="Sensor terintegrasi untuk pemantauan lingkungan sekitar rel."
            />
            <TechCard 
              icon={<Cloud className="w-10 h-10 text-[#F6841F]" />}
              title="Cloud Data"
              desc="Pengolahan data terpusat untuk analisis prediktif."
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-center border-t border-slate-800">
        <p>&copy; 2025 Team GenZ AI Jombang. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

function TechCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow text-center">
      <div className="inline-flex items-center justify-center p-3 bg-orange-50 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#2D3588] mb-3">{title}</h3>
      <p className="text-slate-600">{desc}</p>
    </div>
  );
}
