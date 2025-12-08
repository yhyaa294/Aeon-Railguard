'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  ShieldCheck,
  ArrowRight,
  Camera,
  Cpu,
  Cloud,
  Signal,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Building,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone
} from 'lucide-react';

// NOTE: Framer Motion temporarily removed to ensure stability.
// The visual design is fully restored.

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#F6841F]/30 overflow-x-hidden">

      {/* 1. NAVBAR */}
      <Navbar />

      {/* SECTION 1: HERO SECTION */}
      <section id="hero" className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/gambar%20kereta%20landing%20page%20hal%201.png')",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-950/90 via-slate-900/60 to-transparent h-[85%] pointer-events-none" />

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col items-center justify-start pt-40 md:pt-52 px-6 text-center">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-none mb-8 drop-shadow-2xl">
              AEON RAILGUARD
            </h1>

            <div className="relative mb-12 group cursor-default">
              <div className="absolute -inset-1 bg-[#F6841F]/20 blur-sm rounded-lg group-hover:bg-[#F6841F]/30 transition-all"></div>
              <h2 className="relative px-8 py-3 bg-black/40 backdrop-blur-md border-l-4 border-[#F6841F] text-xl md:text-3xl font-mono font-bold text-white tracking-widest uppercase drop-shadow-lg rounded-r-md">
                SOLUSI CERDAS PERLINTASAN & JALUR TIKUS
              </h2>
            </div>

            <p className="text-blue-50 text-lg md:text-2xl font-light tracking-wide mb-16 drop-shadow-md max-w-4xl italic leading-relaxed">
              &quot;Menjaga Nyawa Tanpa Menutup Akses Ekonomi Warga.&quot;
            </p>

            <div className="flex flex-col items-center gap-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-3 px-10 py-5 bg-[#F6841F] hover:bg-[#e07010] text-white text-lg font-bold rounded-full shadow-2xl shadow-orange-500/30 transition-all ring-1 ring-white/20"
              >
                Coba Sekarang <ArrowRight className="w-5 h-5" />
              </Link>

              {/* LOCAL PRIDE BADGE */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/30 backdrop-blur-sm rounded-full border border-white/10 text-xs font-semibold text-white/90">
                <span className="text-sm">🇮🇩</span> 100% Karya Anak Bangsa
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: STATISTICS BAR */}
      <section className="bg-[#2D3588] text-white py-16 border-t-4 border-[#F6841F] shadow-2xl relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 text-center md:text-left">
            <StatItem value="50ms" label="Waktu Respons AI" />
            <div className="hidden md:block w-px h-16 bg-white/20 mx-8"></div>
            <StatItem value="Kompatibel" label="dengan ETCS Level 2" />
            <div className="hidden md:block w-px h-16 bg-white/20 mx-8"></div>
            <StatItem value="Siap Integrasi" label="Daop 1-9 & Smart City" />
            <div className="hidden md:block w-px h-16 bg-white/20 mx-8"></div>
            <StatItem value="Zero-Latency" label="Protocol" />
          </div>
        </div>
      </section>

      {/* SECTION 3: REALITA DI LAPANGAN */}
      <section id="about" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            {/* Image Left */}
            <div className="w-full lg:w-1/2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-red-500/20 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-60"></div>
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="/images/perlintasan%20ilegal.png"
                    alt="Realita Perlintasan Ilegal"
                    className="w-full h-auto object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700"
                  />

                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80"></div>
                  <div className="absolute bottom-8 left-8 text-white max-w-sm">
                    <div className="bg-red-600 text-white text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded mb-3 inline-block shadow-lg">Zona Bahaya Tinggi</div>
                    <div className="flex items-center gap-2 mb-2 text-white/90 font-mono text-sm">
                      <MapPin className="w-4 h-4 text-[#F6841F]" /> JOMBANG, JAWA TIMUR
                    </div>
                    <p className="text-sm font-light opacity-90 leading-relaxed italic border-l-2 border-[#F6841F] pl-3">
                      &quot;Tanpa palang, tanpa sinyal, namun menjadi akses vital ribuan warga setiap hari.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Right */}
            <div className="w-full lg:w-1/2">
              <SectionTag>REALITA DI LAPANGAN</SectionTag>
              <h2 className="text-4xl md:text-6xl font-black text-[#2D3588] leading-tight mb-8">
                Realita di Jalur Tikus & <br />
                <span className="text-red-600 bg-red-50 underline decoration-red-200 decoration-4 underline-offset-4">Perlintasan Tanpa Palang</span>
              </h2>

              <div className="space-y-8">
                <p className="text-xl text-slate-600 leading-relaxed">
                  Ratusan perlintasan sebidang ilegal menjadi urat nadi ekonomi warga Jombang dan sekitarnya. Sekolah, pasar, dan lahan pertanian bergantung pada akses ini.
                </p>

                <div className="bg-orange-50/80 p-6 rounded-2xl border border-orange-100 flex gap-4">
                  <div className="bg-white p-3 rounded-full h-fit shadow-sm">
                    <ShieldCheck className="w-8 h-8 text-[#F6841F]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2D3588] text-lg mb-2">Dilema Klasik</h4>
                    <p className="text-slate-700 font-medium italic leading-relaxed">
                      &quot;Menutupnya berarti mematikan ekonomi, membiarkannya berarti mempertaruhkan nyawa. Aeon hadir sebagai jalan tengah yang manusiawi.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: THE SOLUTION */}
      <section id="technology" className="relative py-40 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/images/stasiun.png')" }}>
        <div className="absolute inset-0 bg-white/95 z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">

          <div className="text-center mb-20">
            <SectionTag>SOLUSI KAMI</SectionTag>
            <h2 className="text-4xl md:text-6xl font-black text-[#2D3588] mb-6">Mengubah &apos;Ilegal&apos; Menjadi <span className="text-[#F6841F]">&apos;Smart Crossing&apos;</span></h2>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto">Teknologi yang memungkinkan koeksistensi antara kecepatan kereta api dan mobilitas warga lokal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <SolutionCard
              title="Legalisasi Digital"
              desc="Memungkinkan perlintasan tetap dibuka dengan standar keselamatan setara JPL resmi KAI tanpa petugas manual 24 jam."
              icon={<CheckCircle2 className="w-10 h-10 text-white" />}
            />
            <SolutionCard
              title="Peringatan Dini 3KM"
              desc="Sistem deteksi dini yang memberikan peringatan kedatangan kereta 3-5 menit sebelum melintas, memberi waktu evakuasi yang cukup."
              icon={<Signal className="w-10 h-10 text-white" />}
            />
            <SolutionCard
              title="Biaya Infrastruktur Rendah"
              desc="Tanpa perlu membangun flyover atau underpass beton yang memakan biaya miliaran rupiah. Hemat APBD, hasil maksimal."
              icon={<Building className="w-10 h-10 text-white" />}
            />
          </div>

        </div>
      </section>

      {/* SECTION 5: CARA KERJA SISTEM */}
      <section id="smart-city" className="py-32 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <SectionTag>TEKNOLOGI & ALUR KERJA</SectionTag>
            <h2 className="text-4xl md:text-6xl font-black text-[#2D3588] mb-6">Cara Kerja Aeon RailGuard</h2>
            <div className="w-24 h-2 bg-[#2D3588] mx-auto opacity-20 rounded-full"></div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-12 px-4">
            {/* Connecting Line Container */}
            <div className="hidden md:block absolute top-[3rem] left-[10%] right-[10%] h-[3px] bg-slate-200 -z-10" />

            <ArchitectureStep
              step="01"
              title="Pemantauan Visual"
              desc="Kamera CCTV Resolusi Tinggi memantau perlintasan ilegal 24/7."
              icon={<Camera className="w-8 h-8 text-[#2D3588]" />}
              showArrow
            />
            <ArchitectureStep
              step="02"
              title="Deteksi AI Presisi"
              desc="Neural Network (YOLOv8) mendeteksi kendaraan mogok atau orang dalam <50ms."
              icon={<Cpu className="w-8 h-8 text-[#2D3588]" />}
              showArrow
            />
            <ArchitectureStep
              step="03"
              title="Kalkulasi Bahaya"
              desc="Sistem menghitung jarak kereta & kecepatan. Jika <2KM, status MERAH."
              icon={<Cloud className="w-8 h-8 text-[#2D3588]" />}
              showArrow
            />
            <ArchitectureStep
              step="04"
              title="Peringatan Dini"
              desc="Sirine lokal berbunyi keras & notifikasi dikirim ke masinis via Tablet."
              icon={<Signal className="w-8 h-8 text-[#2D3588]" />}
              isLast
            />
          </div>
        </div>
      </section>

      {/* MEGA FOOTER */}
      <footer className="bg-[#1a202c] text-white pt-24 pb-12 border-t-[8px] border-[#2D3588]">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

            {/* COL 1: IDENTITY */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-10 h-10 text-[#F6841F]" />
                <span className="font-black text-2xl tracking-tight leading-none">AEON <br />RAILGUARD</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Sistem keselamatan perlintasan kereta api berbasis Artificial Intelligence pertama di Indonesia yang berfokus pada analisis perilaku dan deteksi dini bahaya.
              </p>
              <div className="text-sm font-semibold text-white pt-4">
                <div className="flex items-center gap-2 mb-2"><MapPin className="w-4 h-4 text-[#F6841F]" /> Jombang, Jawa Timur</div>
                <div className="flex items-center gap-2 mb-2"><Mail className="w-4 h-4 text-[#F6841F]" /> hello@aeonrail.id</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#F6841F]" /> +62 812 3456 7890</div>
              </div>
            </div>

            {/* COL 2: PRODUK */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white border-b border-white/10 pb-2 inline-block">Produk & Layanan</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-[#F6841F] transition-colors">Aeon Hardware Box</Link></li>
                <li><Link href="#" className="hover:text-[#F6841F] transition-colors">Command Dashboard VMS</Link></li>
                <li><Link href="#" className="hover:text-[#F6841F] transition-colors">Masinis Tablet App</Link></li>
                <li><Link href="#" className="hover:text-[#F6841F] transition-colors">API Integrasi KAI</Link></li>
              </ul>
            </div>

            {/* COL 3: PERUSAHAAN */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white border-b border-white/10 pb-2 inline-block">Tentang Kami</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-[#F6841F] transition-colors">Profil Perusahaan</Link></li>
                <li><Link href="#" className="hover:text-[#F6841F] transition-colors">Tim GenZ AI</Link></li>
                <li><Link href="#" className="hover:text-[#F6841F] transition-colors">Karir / Internship</Link></li>
                <li><Link href="#" className="hover:text-[#F6841F] transition-colors">Program CSR</Link></li>
              </ul>
            </div>

            {/* COL 4: LEGAL & SOSMED */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white border-b border-white/10 pb-2 inline-block">Ikuti Kami</h4>
              <div className="flex gap-4 mb-8">
                <SocialIcon icon={<Instagram size={18} />} />
                <SocialIcon icon={<Linkedin size={18} />} />
                <SocialIcon icon={<Twitter size={18} />} />
                <SocialIcon icon={<Facebook size={18} />} />
              </div>
              <h4 className="font-bold text-lg mb-4 text-white border-b border-white/10 pb-2 inline-block">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li><Link href="#" className="hover:text-white">Kebijakan Privasi</Link></li>
                <li><Link href="#" className="hover:text-white">Syarat & Ketentuan</Link></li>
              </ul>
            </div>

          </div>

          {/* BOTTOM COPYRIGHT */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p className="mb-4 md:mb-0">&copy; 2025 Aeon RailGuard. All Rights Reserved.</p>
            <div className="flex items-center gap-2">
              <span>Dikembangkan dengan Bangga di</span>
              <span className="font-bold text-white">Jombang, Indonesia</span>
              <span className="text-red-500">❤️</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

// --- SUBCOMPONENTS ---

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2D3588] text-xs font-black tracking-[0.2em] mb-4">
      {children}
    </div>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col items-center md:items-start flex-1">
      <div className="text-3xl md:text-4xl font-black leading-none mb-2">{value}</div>
      <div className="text-blue-200 text-sm font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
}

function SolutionCard({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all group">
      <div className="w-16 h-16 bg-[#F6841F] rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-all">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-[#2D3588] mb-4 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-slate-600 group-hover:text-white/90 leading-relaxed transition-colors">
        {desc}
      </p>
    </div>
  );
}

function ArchitectureStep({ step, title, desc, icon, showArrow, isLast }: { step: string, title: string, desc: string, icon: React.ReactNode, showArrow?: boolean, isLast?: boolean }) {
  return (
    <div className="relative flex flex-col items-center text-center group z-10">
      <div className="relative z-10 w-24 h-24 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center mb-8 group-hover:border-[#2D3588] transition-all duration-300 shadow-xl">
        <div className="absolute inset-0 rounded-full bg-[#2D3588]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>

      {!isLast && (
        <div className="absolute top-[3rem] -right-8 hidden md:block z-0 text-slate-300">
          <ChevronRight className="w-10 h-10" />
        </div>
      )}
      {!isLast && (
        <div className="my-4 md:hidden text-slate-300">
          <ChevronDown className="w-8 h-8" />
        </div>
      )}

      <div className="text-xs font-black text-[#F6841F] mb-3 tracking-widest uppercase">{step}</div>
      <h3 className="text-xl font-bold text-[#2D3588] mb-3">{title}</h3>
      <p className="text-base text-slate-500 leading-relaxed px-2">{desc}</p>
    </div>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F6841F] cursor-pointer transition-all text-white">
      {icon}
    </div>
  );
}
