'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { 
  TrafficCone, 
  BellRing, 
  Zap, 
  BarChart3, 
  ArrowRight, 
  Camera, 
  Cpu, 
  Volume2, 
  Activity,
  CheckCircle2,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#F6841F]/30 text-slate-900 overflow-x-hidden">
      
      <Navbar />

      {/* --- HERO SECTION: MODERN & SLEEK --- */}
      <section id="hero" className="relative h-screen min-h-[700px] flex items-center">
        
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/stasiun.png"
            alt="Smart Station"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/90" />
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center w-full">
          
          {/* Left: Typography */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-mono tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              AEON INTELLIGENCE V2.0
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              Menyelamatkan Nyawa dengan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#F6841F]">
                Kecerdasan Buatan.
              </span>
            </h1>
            
            <p className="text-lg text-slate-300 max-w-xl leading-relaxed font-light">
              Sistem palang pintu digital terintegrasi Smart City yang mengubah perlintasan ilegal menjadi zona aman tanpa infrastruktur fisik yang mahal.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/dashboard" 
                className="px-8 py-4 bg-[#F6841F] hover:bg-[#d66e12] text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-orange-500/20 text-center"
              >
                Lihat Demo Live
              </Link>
              <Link 
                href="#technology" 
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium rounded-lg backdrop-blur-sm transition-all text-center"
              >
                Pelajari Cara Kerja
              </Link>
            </div>
            
            <div className="pt-8 flex items-center gap-6 text-sm text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> KAI Standard
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 99.9% Uptime
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> ISO 27001
              </div>
            </div>
          </div>

          {/* Right: Visual (Abstract/Sensor Representation) */}
          <div className="hidden md:block relative h-[500px] w-full">
            {/* Abstract Tech Representation using CSS & composition */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-orange-500/20 rounded-full blur-3xl opacity-30 animate-pulse-fast"></div>
            
            {/* Central "Sensor" Graphic (Simulated with composition if no asset) */}
             <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-80 h-80">
                  <div className="absolute inset-0 border border-blue-500/30 rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-4 border border-orange-500/20 rounded-full animate-reverse-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-48 h-48 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl flex flex-col items-center justify-center gap-4 relative overflow-hidden group hover:scale-105 transition-transform duration-500">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Activity className="w-16 h-16 text-[#F6841F]" />
                        <div className="text-center">
                          <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Status</div>
                          <div className="text-white font-bold text-xl">ACTIVE</div>
                        </div>
                     </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-0 right-10 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/10 animate-float-delay-1">
                    <div className="text-xs text-blue-300 mb-1">Detection Rate</div>
                    <div className="text-xl font-mono font-bold text-white">99.8%</div>
                  </div>
                  
                  <div className="absolute bottom-10 left-0 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/10 animate-float-delay-2">
                    <div className="text-xs text-orange-300 mb-1">Latency</div>
                    <div className="text-xl font-mono font-bold text-white">45ms</div>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* --- SECTION: THE AEON ECOSYSTEM (BENTO GRID) --- */}
      <section id="ecosystem" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Ekosistem Keselamatan Terpadu
            </h2>
            <p className="text-lg text-slate-500">
              Lebih dari sekadar kamera. Aeon menghubungkan infrastruktur fisik dengan kecerdasan digital untuk menciptakan lapisan perlindungan berlapis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
            
            {/* Card 1: Large Feature */}
            <div className="md:col-span-2 bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-blue-100 transition-all hover:shadow-xl group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <TrafficCone size={200} />
               </div>
               <div className="relative z-10 h-full flex flex-col justify-between">
                 <div>
                   <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                     <TrafficCone size={24} />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-900 mb-3">Smart City Integration</h3>
                   <p className="text-slate-600 max-w-md">
                     Terhubung langsung dengan API Dinas Perhubungan untuk mengontrol lampu lalu lintas di persimpangan terdekat. Jalur evakuasi otomatis hijau saat kereta akan melintas.
                   </p>
                 </div>
                 <div className="mt-8 flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">API Ready</span>
                    <span className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-full">Low Latency</span>
                 </div>
               </div>
            </div>

            {/* Card 2: Vertical Feature */}
            <div className="md:row-span-2 bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent"></div>
                <div className="relative z-10">
                   <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6 text-[#F6841F]">
                     <BellRing size={24} />
                   </div>
                   <h3 className="text-2xl font-bold mb-3">Public Early Warning</h3>
                   <p className="text-slate-400 mb-8 leading-relaxed">
                     Sistem notifikasi massal yang mengirimkan peringatan ke perangkat mobile warga dalam radius 1KM dari perlintasan, 5 menit sebelum kereta tiba.
                   </p>
                   
                   {/* Mockup Notification */}
                   <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">WA</div>
                        <div className="text-xs">
                          <div className="font-bold">Aeon Alert System</div>
                          <div className="text-slate-400">Baru saja</div>
                        </div>
                      </div>
                      <div className="text-sm bg-white/5 p-3 rounded text-slate-200">
                        ⚠️ <span className="font-bold text-yellow-400">PERINGATAN:</span> Kereta Argo Wilis akan melintas di JPL 204 dalam 3 menit. Harap menjauh dari rel.
                      </div>
                   </div>
                </div>
            </div>

            {/* Card 3: Standard */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 hover:border-orange-100 transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6 text-orange-600">
                   <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Independent Power</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                   Dilengkapi panel surya dan baterai cadangan industri. Sistem tetap beroperasi normal 24/7 bahkan saat pemadaman listrik total.
                </p>
            </div>

            {/* Card 4: Standard */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 hover:border-blue-100 transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                   <BarChart3 size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Predictive Analytics</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                   AI menganalisis pola pergerakan harian untuk memprediksi potensi kecelakaan dan memberikan rekomendasi keselamatan proaktif.
                </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- SECTION: HOW IT WORKS (VERTICAL TIMELINE) --- */}
      <section id="technology" className="py-32 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
             <span className="text-[#F6841F] font-bold tracking-widest text-sm uppercase mb-2 block">Workflow</span>
             <h2 className="text-4xl font-bold text-slate-900">Alur Kerja Sistem</h2>
          </div>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            
            <TimelineItem 
               step="01"
               title="Deteksi Visual"
               desc="Kamera CCTV High-FPS menangkap visual perlintasan secara real-time, siang dan malam."
               icon={<Camera className="w-6 h-6 text-white" />}
            />
            
            <TimelineItem 
               step="02"
               title="Analisis Kecerdasan Buatan"
               desc="Unit pemroses lokal (Edge Computing) mendeteksi keberadaan manusia, kendaraan, atau halangan di rel dalam hitungan milidetik."
               icon={<Cpu className="w-6 h-6 text-white" />}
               isRight
            />
            
            <TimelineItem 
               step="03"
               title="Aktivasi Peringatan"
               desc="Jika bahaya terdeteksi saat kereta mendekat (<2KM), sirine lokal berbunyi keras dan lampu strobo menyala."
               icon={<Volume2 className="w-6 h-6 text-white" />}
            />

            <TimelineItem 
               step="04"
               title="Intervensi Lalu Lintas"
               desc="Sistem mengirim sinyal ke lampu lalu lintas terdekat untuk menahan arus kendaraan menuju perlintasan."
               icon={<Activity className="w-6 h-6 text-white" />}
               isRight
            />

          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer id="contact" className="bg-slate-900 pt-20 pb-10 text-slate-400">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
           
           {/* Brand */}
           <div className="space-y-6">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-slate-800 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                 A
               </div>
               <span className="text-2xl font-bold text-white tracking-tight">AEON RAILGUARD</span>
             </div>
             <p className="max-w-xs leading-relaxed">
               Membangun masa depan keselamatan transportasi Indonesia melalui inovasi teknologi yang inklusif dan berkelanjutan.
             </p>
           </div>

           {/* Links */}
           <div className="grid grid-cols-2 gap-8">
             <div>
               <h4 className="text-white font-bold mb-6">Navigasi</h4>
               <ul className="space-y-4 text-sm">
                 <li><Link href="#" className="hover:text-[#F6841F] transition-colors">Beranda</Link></li>
                 <li><Link href="#" className="hover:text-[#F6841F] transition-colors">Tentang Kami</Link></li>
                 <li><Link href="#" className="hover:text-[#F6841F] transition-colors">Produk</Link></li>
               </ul>
             </div>
             <div>
               <h4 className="text-white font-bold mb-6">Legal</h4>
               <ul className="space-y-4 text-sm">
                 <li><Link href="#" className="hover:text-[#F6841F] transition-colors">Privacy Policy</Link></li>
                 <li><Link href="#" className="hover:text-[#F6841F] transition-colors">Terms of Service</Link></li>
               </ul>
             </div>
           </div>

           {/* Contact */}
           <div>
             <h4 className="text-white font-bold mb-6">Hubungi Kami</h4>
             <ul className="space-y-4 text-sm">
               <li className="flex items-center gap-3">
                 <Mail size={16} className="text-[#F6841F]" /> 
                 <span>partnership@aeon-railguard.id</span>
               </li>
               <li className="flex items-start gap-3">
                 <MapPin size={16} className="text-[#F6841F] mt-1" /> 
                 <span>Jombang, Jawa Timur, Indonesia</span>
               </li>
               <li className="flex items-center gap-3">
                 <Phone size={16} className="text-[#F6841F]" /> 
                 <span>+62 812-3456-7890</span>
               </li>
             </ul>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-center text-sm">
          <p>&copy; 2025 Team GenZ AI. All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  );
}

// --- SUBCOMPONENTS ---

function TimelineItem({ step, title, desc, icon, isRight }: { step: string, title: string, desc: string, icon: React.ReactNode, isRight?: boolean }) {
  return (
    <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${isRight ? 'md:flex-row-reverse' : ''}`}>
      
      {/* Icon Circle (Center) */}
      <div className="absolute left-0 md:left-1/2 w-10 h-10 -ml-5 bg-[#2D3588] rounded-full border-4 border-slate-100 flex items-center justify-center shadow-lg z-10 group-hover:scale-110 transition-transform duration-300">
        <div className="w-5 h-5">
           {/* Simple dot or icon if needed inside small circle, keeping clean for now */}
           <div className="w-full h-full bg-white/20 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Content Card */}
      <div className="w-full md:w-5/12 pl-16 md:pl-0 md:px-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group-hover:-translate-y-1 duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${isRight ? 'bg-[#F6841F]' : 'bg-[#2D3588]'}`}>
              {icon}
            </div>
            <span className="text-4xl font-black text-slate-100">{step}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
        </div>
      </div>
      
      {/* Spacer for opposite side */}
      <div className="hidden md:block w-5/12"></div>
    </div>
  );
}
