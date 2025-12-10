'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Camera,
  Bell,
  CheckCircle,
  ChevronDown,
  MapPin,
  Play,
  Radio,
  Shield,
  Cpu,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';

// ========= TYPES =========
type PageStage = 'SPLASH' | 'INTRO' | 'CONTENT';

export default function LandingPage() {
  // ========= STATE =========
  const [stage, setStage] = useState<PageStage>('SPLASH');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const loadingVideoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  // ========= SPLASH -> INTRO =========
  const handleSplashClick = () => {
    setStage('INTRO');
  };

  // ========= INTRO VIDEO =========
  useEffect(() => {
    if (stage === 'INTRO' && introVideoRef.current) {
      introVideoRef.current.muted = false;
      introVideoRef.current.play().catch((e) => console.error('Intro video failed:', e));
    }
  }, [stage]);

  const handleIntroEnd = () => {
    setStage('CONTENT');
  };

  // ========= DASHBOARD TRANSITION =========
  const handleDashboardClick = () => {
    setIsTransitioning(true);
  };

  useEffect(() => {
    if (isTransitioning && loadingVideoRef.current) {
      loadingVideoRef.current.play().catch((e) => console.error('Loading video failed:', e));
    }
  }, [isTransitioning]);

  const handleLoadingVideoEnd = () => {
    router.push('/login');
  };

  // ========= SMOOTH SCROLL =========
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#2D2A70] font-sans overflow-x-hidden">

      {/* ========= STAGE: SPLASH ========= */}
      <AnimatePresence>
        {stage === 'SPLASH' && (
          <motion.div
            key="splash"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center cursor-pointer"
            onClick={handleSplashClick}
          >
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Image src="/images/logo Aeon.png" alt="Aeon" width={100} height={100} className="mb-6" />
            </motion.div>
            <h1 className="text-white text-2xl font-bold tracking-widest mb-6">AEON RAILGUARD</h1>
            <button className="px-8 py-3 bg-[#DA5525] hover:bg-[#c44a1f] text-white font-bold rounded-full shadow-lg transition-all hover:scale-105">
              KLIK UNTUK MASUK
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========= STAGE: INTRO VIDEO ========= */}
      <AnimatePresence>
        {stage === 'INTRO' && (
          <motion.div key="intro" exit={{ opacity: 0, transition: { duration: 1.5 } }} className="fixed inset-0 z-[55] bg-black">
            <video ref={introVideoRef} src="/videos/intro-train.mp4" onEnded={handleIntroEnd} playsInline className="w-full h-full object-cover" />
            <button onClick={handleIntroEnd} className="absolute bottom-8 right-8 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg backdrop-blur-sm transition-all border border-white/20">
              Skip Intro →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========= DASHBOARD LOADING ========= */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-4 border border-slate-200">
              <video ref={loadingVideoRef} src="/videos/logo-loading.mp4" onEnded={handleLoadingVideoEnd} playsInline muted className="w-80 max-w-md rounded-lg" />
            </div>
            <div className="mt-8 text-center w-80 max-w-md">
              <p className="text-[#2D2A70] font-semibold text-lg mb-3">Memuat Sistem...</p>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 3, ease: 'easeInOut' }} className="h-full bg-gradient-to-r from-[#DA5525] to-orange-400 rounded-full" />
              </div>
              <p className="text-slate-400 text-xs mt-3">Aeon RailGuard v2.0 | Command Center</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========= MAIN CONTENT ========= */}
      {stage === 'CONTENT' && (
        <>
          {/* NAVBAR */}
          <nav className="fixed top-0 left-0 right-0 z-40">
            <div className="w-[92%] max-w-6xl mx-auto mt-4 flex items-center justify-between p-3 bg-white/90 backdrop-blur-xl border border-slate-200 shadow-lg rounded-full">
              <Link href="/" className="flex items-center gap-2 pl-2">
                <Image src="/images/logo Aeon.png" alt="Aeon" width={36} height={36} />
                <span className="font-bold text-[#2D2A70] text-lg">AEON</span>
              </Link>
              <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
                <button onClick={() => scrollToSection('masalah')} className="hover:text-[#2D2A70] transition-colors">Masalah</button>
                <button onClick={() => scrollToSection('solusi')} className="hover:text-[#2D2A70] transition-colors">Solusi</button>
                <button onClick={() => scrollToSection('teknologi')} className="hover:text-[#2D2A70] transition-colors">Teknologi</button>
                <button onClick={() => scrollToSection('hardware')} className="hover:text-[#2D2A70] transition-colors">Hardware</button>
                <button onClick={() => scrollToSection('roadmap')} className="hover:text-[#2D2A70] transition-colors">Roadmap</button>
              </div>
              <button onClick={handleDashboardClick} className="flex items-center gap-2 text-sm text-white font-bold px-5 py-2.5 rounded-full bg-[#DA5525] hover:bg-[#c44a1f] shadow-lg transition-all">
                Akses Dashboard
              </button>
            </div>
          </nav>

          {/* HERO */}
          <section className="relative h-screen flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 z-0">
              <Image src="/images/gambar kereta landing page hal 1.png" alt="Hero" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="relative z-10 px-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none drop-shadow-2xl">AEON<br />RAILGUARD</h1>
              <div className="mt-6">
                <span className="inline-block bg-[#DA5525] text-white text-sm md:text-base font-semibold px-6 py-2.5 rounded-full uppercase tracking-wider shadow-xl">
                  Solusi Cerdas Perlintasan & Jalur Tikus
                </span>
              </div>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={handleDashboardClick} className="flex items-center gap-2 bg-[#DA5525] hover:bg-[#c44a1f] text-white font-bold px-8 py-3.5 rounded-full shadow-xl transition-all hover:scale-105">
                  <Play size={20} /> Akses Dashboard
                </button>
                <button onClick={() => scrollToSection('masalah')} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold px-8 py-3.5 rounded-full border-2 border-white/50 transition-all hover:scale-105">
                  <MapPin size={20} /> Pelajari Lebih Lanjut
                </button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 2 } }} className="absolute bottom-8 animate-bounce">
              <ChevronDown size={32} className="text-white/70" />
            </motion.div>
          </section>

          {/* MASALAH */}
          <section id="masalah" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <span className="text-sm uppercase tracking-widest text-[#DA5525] font-bold">Masalah</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-6 text-[#2D2A70] leading-tight">Realita di Jalur Tikus</h2>
                <p className="text-slate-600 leading-relaxed text-lg mb-4">Perlintasan liar dan kurangnya kesadaran menciptakan zona bahaya konstan. Di Indonesia, <strong className="text-[#DA5525]">ribuan kilometer jalur kereta terbuka tanpa pengawasan</strong>, menjadi titik buta yang mematikan.</p>
                <p className="text-slate-600 leading-relaxed text-lg mb-6">Sistem palang pintu manual tidak cukup untuk menutupi ribuan "jalur tikus" yang dibuat warga. Aeon RailGuard hadir sebagai <strong className="text-[#2D2A70]">mata dan telinga yang tidak pernah tidur</strong>.</p>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-3xl font-bold text-[#DA5525]">4,000+</p>
                    <p className="text-slate-500 text-sm">Perlintasan Tidak Resmi</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-3xl font-bold text-[#DA5525]">200+</p>
                    <p className="text-slate-500 text-sm">Kecelakaan/Tahun</p>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
                <Image src="/images/perlintasan ilegal.png" alt="Perlintasan Ilegal" width={700} height={500} className="rounded-2xl shadow-2xl object-cover" />
              </motion.div>
            </div>
          </section>

          {/* SOLUSI */}
          <section id="solusi" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <span className="text-sm uppercase tracking-widest text-[#DA5525] font-bold">Solusi</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-[#2D2A70]">Ekosistem Keselamatan</h2>
                <p className="text-slate-600 max-w-3xl mx-auto mb-16 text-lg">Tiga pilar teknologi yang bekerja bersama untuk menciptakan perlintasan yang lebih aman. Pendekatan kami menggabungkan <strong>AI, IoT, dan hardware tangguh</strong> untuk solusi end-to-end.</p>
              </motion.div>
              <div className="grid md:grid-cols-3 gap-8">
                <SolutionCard icon={<Eye size={36} />} title="Multimodal Vision" description="Gabungan kamera Thermal dan RGB untuk deteksi akurat di segala cuaca. Sistem mampu mendeteksi objek di malam hari dan cuaca ekstrem berkat dual-mode imaging." delay={0.1} />
                <SolutionCard icon={<Radio size={36} />} title="Smart Grid" description="Sistem terintegrasi dengan IoT dan palang pintu otomatis. Dashboard monitoring real-time memungkinkan operator melihat kondisi semua perlintasan dari satu tempat." delay={0.2} />
                <SolutionCard icon={<Shield size={36} />} title="Hardware Mandiri" description="Unit lapangan dirancang dengan panel surya dan konstruksi anti-vandal. Siap beroperasi di area terpencil tanpa infrastruktur listrik konvensional." delay={0.3} />
              </div>
            </div>
          </section>

          {/* TEKNOLOGI */}
          <section id="teknologi" className="py-28 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-16">
                <span className="text-sm uppercase tracking-widest text-[#DA5525] font-bold">Teknologi</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-[#2D2A70]">Cara Kerja Sistem</h2>
                <p className="text-slate-600 max-w-3xl mx-auto text-lg">Proses pengambilan keputusan cerdas dalam hitungan milidetik. Sistem kami menggunakan teknologi <strong>Computer Vision</strong> berbasis deep learning yang telah dioptimalkan untuk kondisi perlintasan di Indonesia.</p>
              </motion.div>
              <div className="grid lg:grid-cols-3 gap-8">
                <TechCard step="01" icon={<Camera size={32} />} title="Input: Kamera & Thermal" desc="Menangkap visual dan suhu objek secara real-time menggunakan kamera RGB 4K dan thermal imaging. Dual-mode detection memastikan akurasi di siang maupun malam hari." delay={0.1} />
                <TechCard step="02" icon={<Cpu size={32} />} title="Proses: YOLOv8 Edge AI" desc="Model AI YOLOv8 custom-trained memproses data video dalam <50ms. Edge computing di lapangan menghilangkan ketergantungan pada koneksi internet dan meminimalkan latensi." delay={0.2} />
                <TechCard step="03" icon={<Bell size={32} />} title="Output: Peringatan & ARSCP" desc="Sistem mengirim sinyal peringatan dini ke masinis melalui protokol ARSCP (Automatic Railway Signal Control Protocol), sekaligus mengaktifkan sirine lokal untuk memperingatkan warga." delay={0.3} />
              </div>
            </div>
          </section>

          {/* HARDWARE - RENCANA PENGEMBANGAN */}
          <section id="hardware" className="py-24 bg-gradient-to-b from-white to-slate-50">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <Image src="/images/rencana alat.png" alt="Aeon Sentinel Unit" width={550} height={550} className="rounded-2xl shadow-xl" />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
                {/* Badge - Rencana */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm uppercase tracking-widest text-[#DA5525] font-bold">Rencana Hardware</span>
                  <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold">⏳ Menunggu Pendanaan</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mt-1 mb-4 text-[#2D2A70]">Aeon Sentinel Unit</h2>
                <p className="text-slate-600 leading-relaxed text-lg mb-4">
                  Saat ini Aeon RailGuard fokus pada pengembangan <strong className="text-[#2D2A70]">software AI monitoring</strong>. Hardware Sentinel Unit merupakan rencana ekspansi setelah mendapatkan pendanaan yang memadai.
                </p>
                <p className="text-slate-500 leading-relaxed text-base mb-6">
                  Desain awal perangkat keras ini siap diproduksi dengan spesifikasi berikut untuk menghadapi kondisi lapangan di Indonesia:
                </p>
                <div className="space-y-3">
                  <SpecItem text="Tahan Cuaca IP67 & Anti-Korosi" />
                  <SpecItem text="Tenaga Surya Mandiri (72 Jam Backup)" />
                  <SpecItem text="Konektivitas Dual 4G/5G + Satelit" />
                  <SpecItem text="Sistem Self-Diagnostic AI" />
                  <SpecItem text="Speaker Sirine 120dB Terintegrasi" />
                  <SpecItem text="Instalasi Cepat < 2 Jam" />
                </div>
                <p className="text-slate-400 text-sm mt-6 italic">* Spesifikasi dapat berubah sesuai kebutuhan lapangan dan ketersediaan komponen lokal.</p>
              </motion.div>
            </div>
          </section>

          {/* ROADMAP */}
          <section id="roadmap" className="py-28 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
            <div className="max-w-5xl mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
                <span className="text-sm uppercase tracking-widest text-[#DA5525] font-bold">Roadmap</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-[#2D2A70]">Peta Jalan Pengembangan</h2>
                <p className="text-slate-600 max-w-3xl mx-auto text-lg">Kami menggunakan pendekatan <strong className="text-[#2D2A70]">iteratif</strong> untuk memastikan setiap tahap pengembangan tervalidasi di lapangan. Mulai dari software MVP, lalu hardware, dan terakhir ekspansi ke berbagai wilayah.</p>
              </motion.div>
              <div className="relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#DA5525] via-[#2D2A70] to-[#DA5525] transform -translate-x-1/2"></div>
                <div className="space-y-20">
                  <RoadmapItem year="2025 Q4" title="MVP Produk Software" desc="Pengembangan dan peluncuran dashboard monitoring berbasis AI. Validasi model deteksi objek di perlintasan wilayah Jombang dengan data nyata." side="left" />
                  <RoadmapItem year="2026 Q1" title="MVP Hardware & Ekosistem" desc="Produksi prototipe Aeon Sentinel Unit. Integrasi hardware dengan software monitoring untuk membentuk ekosistem lengkap." side="right" />
                  <RoadmapItem year="2026 Q2" title="Penerapan Multi-Wilayah" desc="Deployment di beberapa wilayah prioritas, dimulai dari DAOP 7 Madiun dan DAOP 8 Surabaya. Evaluasi dan penyempurnaan sistem." side="left" />
                </div>
              </div>
            </div>
          </section>

          {/* DEMO VIDEO */}
          <section id="demo" className="py-24 bg-white">
            <div className="max-w-5xl mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-12">
                <span className="text-sm uppercase tracking-widest text-[#DA5525] font-bold">Demo</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-[#2D2A70]">Lihat Sistem Beraksi</h2>
                <p className="text-slate-600 max-w-2xl mx-auto text-lg">Saksikan bagaimana AI kami mendeteksi objek di perlintasan secara real-time dengan akurasi tinggi</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#2D2A70]">
                  <video src="/videos/video demo.mp4" controls className="w-full" poster="/images/dashboard.png" />
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg border border-slate-200">
                  <p className="text-sm font-medium text-slate-600">🔴 Live AI Detection Demo</p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* METRIK TARGET */}
          <section className="py-20 bg-gradient-to-r from-[#2D2A70] to-[#1a1850]">
            <div className="max-w-6xl mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Target Dampak</h2>
                <p className="text-slate-300 max-w-xl mx-auto">Misi kami adalah menciptakan perkeretaapian Indonesia yang lebih aman</p>
              </motion.div>
              <div className="grid md:grid-cols-4 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <p className="text-4xl font-bold text-[#DA5525] mb-2">70%</p>
                  <p className="text-white font-medium">Pengurangan Kecelakaan</p>
                  <p className="text-slate-400 text-sm mt-1">di wilayah terpasang</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <p className="text-4xl font-bold text-[#DA5525] mb-2">&lt;50ms</p>
                  <p className="text-white font-medium">Waktu Deteksi</p>
                  <p className="text-slate-400 text-sm mt-1">response time AI</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <p className="text-4xl font-bold text-[#DA5525] mb-2">24/7</p>
                  <p className="text-white font-medium">Monitoring Aktif</p>
                  <p className="text-slate-400 text-sm mt-1">tanpa henti</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <p className="text-4xl font-bold text-[#DA5525] mb-2">95%+</p>
                  <p className="text-white font-medium">Akurasi Deteksi</p>
                  <p className="text-slate-400 text-sm mt-1">objek di perlintasan</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* CTA - CALL TO ACTION */}
          <section className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <h2 className="text-4xl md:text-5xl font-bold text-[#2D2A70] mb-6">Tertarik Berkolaborasi?</h2>
                <p className="text-slate-600 text-xl mb-10 max-w-2xl mx-auto">Kami terbuka untuk kemitraan dengan pemerintah, BUMN, dan pihak swasta yang ingin berkontribusi dalam keselamatan perkeretaapian Indonesia.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={handleDashboardClick} className="flex items-center gap-2 bg-[#DA5525] hover:bg-[#c44a1f] text-white font-bold px-8 py-4 rounded-full shadow-xl transition-all hover:scale-105 text-lg">
                    <Play size={22} /> Lihat Demo Dashboard
                  </button>
                  <a href="mailto:hello@aeonrailguard.id" className="flex items-center gap-2 bg-[#2D2A70] hover:bg-[#1a1850] text-white font-bold px-8 py-4 rounded-full shadow-xl transition-all hover:scale-105 text-lg">
                    <Mail size={22} /> Hubungi Kami
                  </a>
                </div>
                <p className="text-slate-400 text-sm mt-8">📍 Berbasis di Jombang, Jawa Timur | 📧 hello@aeonrailguard.id</p>
              </motion.div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="py-24 bg-slate-50">
            <div className="max-w-4xl mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
                <span className="text-sm uppercase tracking-widest text-[#DA5525] font-bold">FAQ</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-[#2D2A70]">Pertanyaan Umum</h2>
              </motion.div>
              <div className="space-y-4">
                <FAQItem
                  question="Apa itu Aeon RailGuard?"
                  answer="Aeon RailGuard adalah sistem monitoring perlintasan kereta berbasis AI yang menggunakan Computer Vision untuk mendeteksi objek dan potensi bahaya di perlintasan secara real-time. Sistem ini dirancang untuk meningkatkan keselamatan di jalur-jalur tikus (perlintasan ilegal) yang tidak terjangkau palang pintu."
                />
                <FAQItem
                  question="Apakah sistem ini membutuhkan koneksi internet?"
                  answer="Tidak wajib. Sistem kami menggunakan edge computing sehingga deteksi AI diproses langsung di perangkat lapangan tanpa ketergantungan pada koneksi internet. Koneksi hanya diperlukan untuk sinkronisasi data ke dashboard pusat."
                />
                <FAQItem
                  question="Bagaimana model bisnis/pricingnya?"
                  answer="Kami menawarkan model B2G (Business to Government) dengan skema sewa bulanan per unit atau pembelian outright. Untuk pilot project, kami terbuka untuk kerjasama dengan institusi pemerintah dan BUMN Perkeretaapian."
                />
                <FAQItem
                  question="Apakah bisa diintegrasikan dengan sistem KAI yang sudah ada?"
                  answer="Ya, sistem kami dirancang dengan protokol ARSCP (Automatic Railway Signal Control Protocol) yang kompatibel dengan infrastruktur sinyal kereta existing. Integrasi juga dimungkinkan melalui API untuk dashboard monitoring terpusat."
                />
              </div>
            </div>
          </section>

          {/* MAP */}
          <section id="map" className="py-24 bg-white">
            <div className="max-w-5xl mx-auto px-6 text-center">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <span className="text-sm uppercase tracking-widest text-[#DA5525] font-bold">Coverage</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-12 text-[#2D2A70]">Pemantauan Geospasial</h2>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="relative mx-auto">
                <div className="rounded-3xl overflow-hidden border-4 border-[#2D2A70] shadow-2xl">
                  <Image src="/images/feed-street.jpg" alt="Command Center Map" width={1200} height={600} className="w-full h-auto" />
                </div>
              </motion.div>
            </div>
          </section>

          {/* TRAIN ANIMATION WITH TAGLINE */}
          <section className="py-4 bg-white overflow-hidden">
            <div className="text-center mb-4 px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <h3 className="text-2xl md:text-3xl font-bold text-[#2D2A70] mb-2">🚂 Menjaga Setiap Perjalanan</h3>
                <p className="text-slate-500 text-base max-w-xl mx-auto">Kereta api Indonesia yang lebih aman dimulai dari kesadaran dan teknologi yang tepat</p>
              </motion.div>
            </div>
            <video src="/videos/animasi-kereta.mp4" loop autoPlay muted playsInline className="w-full" />
          </section>

          {/* FOOTER */}
          <footer className="py-16 bg-[#2D2A70] text-white">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid md:grid-cols-4 gap-12 mb-12">
                <div>
                  <Image src="/images/logo Aeon.png" alt="Aeon" width={50} height={50} className="mb-4" />
                  <p className="text-slate-300 text-sm leading-relaxed">Sistem pemantauan perlintasan berbasis AI untuk masa depan kereta api Indonesia yang lebih aman.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-4">Navigasi</h4>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li><a href="#masalah" className="hover:text-white transition-colors">Masalah</a></li>
                    <li><a href="#solusi" className="hover:text-white transition-colors">Solusi</a></li>
                    <li><a href="#teknologi" className="hover:text-white transition-colors">Teknologi</a></li>
                    <li><a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-4">Kontak</h4>
                  <ul className="space-y-3 text-slate-300 text-sm">
                    <li className="flex items-center gap-2"><MapPin size={16} className="text-[#DA5525]" /> Jombang, Jawa Timur</li>
                    <li className="flex items-center gap-2"><Mail size={16} className="text-[#DA5525]" /> hello@aeonrailguard.id</li>
                    <li className="flex items-center gap-2"><Phone size={16} className="text-[#DA5525]" /> +62 812 3456 7890</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-4">Sosial Media</h4>
                  <div className="flex gap-3">
                    <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"><Facebook size={18} /></a>
                    <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"><Twitter size={18} /></a>
                    <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"><Instagram size={18} /></a>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/10 pt-8 text-center text-slate-400 text-sm">
                <p>© 2024 AEON RailGuard. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

// ========= SUB-COMPONENTS =========

const SolutionCard = ({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) => (
  <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay }} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
    <div className="w-20 h-20 bg-[#DA5525]/10 text-[#DA5525] rounded-2xl flex items-center justify-center mx-auto mb-6">{icon}</div>
    <h3 className="font-bold text-[#2D2A70] text-xl mb-3">{title}</h3>
    <p className="text-slate-500">{description}</p>
  </motion.div>
);

const TechCard = ({ step, icon, title, desc, delay }: { step: string; icon: React.ReactNode; title: string; desc: string; delay: number }) => (
  <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay }} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
    <div className="w-12 h-12 bg-[#DA5525] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-6">{step}</div>
    <div className="w-14 h-14 bg-[#DA5525]/10 text-[#DA5525] rounded-xl flex items-center justify-center mx-auto mb-4">{icon}</div>
    <h3 className="font-bold text-[#2D2A70] text-lg mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

const SpecItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-6 h-6 rounded-full bg-[#DA5525]/10 flex items-center justify-center flex-shrink-0">
      <CheckCircle size={16} className="text-[#DA5525]" />
    </div>
    <span className="text-slate-700">{text}</span>
  </div>
);

const RoadmapItem = ({ year, title, desc, side }: { year: string; title: string; desc: string; side: 'left' | 'right' }) => (
  <motion.div initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className={`relative flex items-center ${side === 'right' ? 'flex-row-reverse' : ''}`}>
    <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
      <div className="w-5 h-5 rounded-full bg-[#DA5525] border-4 border-white shadow-lg"></div>
    </div>
    <div className={`w-[45%] ${side === 'left' ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
      <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-[#DA5525] text-white mb-3">{year}</span>
      <h3 className="text-xl font-bold text-[#2D2A70] mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
    <div className="w-[45%]"></div>
  </motion.div>
);

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors">
        <span className="font-semibold text-[#2D2A70]">{question}</span>
        <ChevronDown size={20} className={`text-[#DA5525] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="px-5 pb-5 text-slate-600 leading-relaxed">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
