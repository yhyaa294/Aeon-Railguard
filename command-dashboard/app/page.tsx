'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { 
  ArrowRight, 
  MapPin, 
  TrafficCone, 
  BellRing, 
  Zap, 
  BarChart3,
  Smartphone,
  Server
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#F6841F]/30 overflow-x-hidden text-slate-900">
      
      <Navbar />

      {/* =========================================
          SECTION 1: HERO (PHOTO-REALISTIC + 3D) 
          Matches "Good Screenshot": Station BG + Train FG
         ========================================= */}
      <section className="relative h-screen w-full overflow-hidden">
        
        {/* Layer 0: Background Station (Real Photo) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gambar%20kereta%20landing%20page%20hal%201.png"
            alt="Background Stasiun"
            fill
            className="object-cover"
            priority
          />
          {/* Heavy Dark Gradient for Text Readability */}
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900/80" />
        </div>

        {/* Layer 1: Content (Centered & Top-Heavy) */}
        <div className="relative z-20 h-full flex flex-col items-center justify-start pt-32 md:pt-44 px-4 text-center">
          <div className="flex flex-col items-center max-w-5xl mx-auto animate-fade-in-up">
            
            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter leading-none mb-8 drop-shadow-2xl">
              AEON RAILGUARD
            </h1>

            {/* Subtitle Box (The specific requirement) */}
            <div className="relative mb-10 group cursor-default inline-block">
              <div className="absolute -inset-1 bg-[#F6841F]/40 blur-sm rounded-lg"></div>
              <h2 className="relative px-6 py-3 bg-[#A04000] bg-opacity-90 backdrop-blur-md border border-[#F6841F] text-white text-lg md:text-2xl font-mono font-bold tracking-widest uppercase rounded shadow-2xl">
                SOLUSI CERDAS PERLINTASAN & JALUR TIKUS
              </h2>
            </div>

            {/* Quote */}
            <p className="text-slate-200 text-xl md:text-3xl font-light italic tracking-wide mb-12 drop-shadow-md max-w-4xl leading-relaxed">
              &quot;Menjaga Nyawa Tanpa Menutup Akses Ekonomi Warga.&quot;
            </p>

            {/* CTA Button */}
            <Link
              href="/login"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#F6841F] hover:bg-[#e07010] text-white text-lg font-bold rounded-full shadow-2xl shadow-orange-500/40 transition-all hover:scale-105 hover:ring-4 ring-orange-500/30"
            >
              Coba Sekarang <ArrowRight className="w-5 h-5" />
            </Link>

          </div>
        </div>

        {/* Layer 2: Foreground Train (REMOVED: The background image already contains the train) */}
        {/* <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">...</div> */}
      </section>

      {/* =========================================
          SECTION 2: REALITA DI LAPANGAN (SPLIT 50/50)
         ========================================= */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left: Real Photo (No Cartoons) */}
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white rotate-1 hover:rotate-0 transition-transform duration-500 group h-[400px]">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <Image
                  src="/images/perlintasan ilegal.png"
                  alt="Realita Perlintasan Ilegal"
                  fill
                  className="object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Location Badge */}
                <div className="absolute bottom-6 left-6 z-20 bg-black/70 backdrop-blur-md px-4 py-2 rounded-lg border-l-4 border-red-500 text-white">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1 text-red-400">
                    <MapPin size={12} /> Zona Bahaya
                  </div>
                  <div className="text-sm font-semibold">Perlintasan Tanpa Palang</div>
                </div>
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="w-full lg:w-1/2 space-y-8">
              <div>
                <span className="text-[#F6841F] font-black tracking-widest text-sm uppercase mb-2 block">LATAR BELAKANG</span>
                <h2 className="text-4xl md:text-5xl font-black text-[#2D3588] leading-tight mb-6">
                  Realita di Jalur Tikus
                </h2>
                <div className="w-20 h-2 bg-[#F6841F] rounded-full"></div>
              </div>
              
              <p className="text-xl text-slate-600 leading-relaxed font-light">
                Ratusan perlintasan sebidang ilegal menjadi urat nadi ekonomi warga. Sekolah, pasar, dan lahan pertanian bergantung pada akses ini. 
                <strong className="text-slate-900 font-semibold block mt-4">
                Menutupnya berarti mematikan ekonomi, membiarkannya berarti mempertaruhkan nyawa.
                </strong>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg text-red-600"><TrafficCone size={20} /></div>
                  <span className="font-bold text-slate-700">Rawan Kecelakaan</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><TrafficCone size={20} /></div>
                  <span className="font-bold text-slate-700">Minim Pengawasan</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 3: AEON ECOSYSTEM (CLEAN WHITE CARDS)
         ========================================= */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-2 block">EKOSISTEM TEKNOLOGI</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#2D3588] mb-6">
              Fitur Keselamatan Terpadu
            </h2>
            <p className="text-lg text-slate-500">
              Menggabungkan infrastruktur fisik dengan kecerdasan digital untuk perlindungan maksimal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <FeatureCard 
              icon={<TrafficCone size={32} />}
              title="Smart Traffic Integration"
              desc="Terhubung dengan API Dinas Perhubungan untuk mengontrol lampu lalu lintas. Jalur evakuasi otomatis hijau saat darurat."
              color="blue"
            />

            {/* Feature 2 */}
            <FeatureCard 
              icon={<BellRing size={32} />}
              title="WhatsApp Public Alert"
              desc="Sistem notifikasi massal yang mengirimkan peringatan ke warga radius 1KM, 5 menit sebelum kereta tiba."
              color="green"
            />

            {/* Feature 3 */}
            <FeatureCard 
              icon={<Zap size={32} />}
              title="Solar Power Backup"
              desc="Panel surya dan baterai industri memastikan sistem tetap hidup 24/7 meskipun terjadi pemadaman listrik total."
              color="orange"
            />

            {/* Feature 4 */}
            <FeatureCard 
              icon={<BarChart3 size={32} />}
              title="Predictive AI"
              desc="Menganalisis pola pergerakan harian untuk memprediksi potensi kecelakaan sebelum benar-benar terjadi."
              color="purple"
            />

            {/* Feature 5 */}
            <FeatureCard 
              icon={<Smartphone size={32} />}
              title="Masinis Tablet App"
              desc="Notifikasi visual dan audio langsung ke tablet di kabin masinis saat ada objek menghalangi rel."
              color="indigo"
            />

            {/* Feature 6 */}
            <FeatureCard 
              icon={<Server size={32} />}
              title="Local Edge Computing"
              desc="Pemrosesan data dilakukan di lokasi (Edge), memastikan latensi mendekati nol tanpa ganguan sinyal internet."
              color="slate"
            />

          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 4: FOOTER
         ========================================= */}
      <footer className="bg-[#1e293b] text-white py-12 border-t-8 border-[#F6841F]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-black tracking-tight mb-2">AEON RAILGUARD</h3>
            <p className="text-slate-400 text-sm">Sistem Keselamatan Perkeretaapian Berbasis AI</p>
          </div>
          <div className="flex justify-center gap-8 text-sm text-slate-400 font-medium">
             <Link href="#" className="hover:text-[#F6841F]">Tentang Kami</Link>
             <Link href="#" className="hover:text-[#F6841F]">Hubungi Tim</Link>
             <Link href="#" className="hover:text-[#F6841F]">Dokumentasi API</Link>
             <Link href="#" className="hover:text-[#F6841F]">Kebijakan Privasi</Link>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-700 text-slate-500 text-xs">
            &copy; 2025 Team GenZ AI Jombang. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- SUBCOMPONENT: FEATURE CARD ---
function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
  
  const colorClasses:Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 group-hover:border-blue-300",
    green: "bg-green-50 text-green-600 border-green-100 group-hover:border-green-300",
    orange: "bg-orange-50 text-orange-600 border-orange-100 group-hover:border-orange-300",
    purple: "bg-purple-50 text-purple-600 border-purple-100 group-hover:border-purple-300",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:border-indigo-300",
    slate: "bg-slate-50 text-slate-600 border-slate-100 group-hover:border-slate-300",
  };

  const currentClass = colorClasses[color] || colorClasses.blue;

  return (
    <div className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${currentClass.split(' ').slice(0,2).join(' ')}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#2D3588] mb-3 group-hover:text-[#F6841F] transition-colors">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
