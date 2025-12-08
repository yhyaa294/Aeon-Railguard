'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrafficCone, 
  MessageCircle, 
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
  Phone,
  Menu,
  X,
  Shield,
  Radio
} from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-[#F6841F]/30 text-white overflow-x-hidden">
      
      {/* === NAVBAR: GLASSMORPHISM STICKY === */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-2xl' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                <Image 
                  src="/images/logo%20Aeon.png" 
                  alt="Aeon" 
                  width={32} 
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <Image 
                src="/images/logo%20kai.jpg" 
                alt="KAI" 
                width={48} 
                height={32}
                className="object-contain rounded"
              />
            </div>
            <span className="hidden sm:block text-lg font-bold tracking-tight">
              AEON <span className="text-slate-400">|</span> <span className="text-[#F6841F]">RAILGUARD</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#ecosystem" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Ekosistem
            </Link>
            <Link href="#technology" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Teknologi
            </Link>
            <Link href="#contact" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Kontak
            </Link>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="px-6 py-2.5 bg-gradient-to-r from-[#F6841F] to-[#ff6b00] hover:from-[#ff6b00] hover:to-[#F6841F] text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
            >
              Live Dashboard
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-6 py-6 space-y-4"
          >
            <Link href="#ecosystem" className="block text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Ekosistem</Link>
            <Link href="#technology" className="block text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Teknologi</Link>
            <Link href="#contact" className="block text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Kontak</Link>
          </motion.div>
        )}
      </nav>

      {/* === HERO SECTION: CINEMATIC PHOTO REALISM === */}
      <section id="hero" className="relative h-screen min-h-[800px] flex items-center overflow-hidden">
        
        {/* Layer 1: Background Photo (Station) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/stasiun.png"
            alt="Railway Station Background"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/80 to-slate-950" />
          {/* Cinematic Color Grade */}
          <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay" />
        </div>

        {/* Layer 2: Content (Text) */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6841F]/20 border border-[#F6841F]/40 text-[#F6841F] text-sm font-bold mb-8">
              <Radio size={14} className="animate-pulse" />
              SISTEM KESELAMATAN TERPADU
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              AEON<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F6841F] via-orange-400 to-yellow-400">
                RAILGUARD
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed mb-10 font-light">
              Palang pintu digital berbasis AI yang mengubah <span className="text-white font-medium">perlintasan ilegal</span> menjadi zona aman — tanpa infrastruktur fisik yang mahal.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link 
                href="/dashboard" 
                className="group px-8 py-4 bg-[#F6841F] hover:bg-[#ff6b00] text-white font-bold rounded-xl transition-all shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center justify-center gap-2"
              >
                Lihat Demo Live
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#technology" 
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 font-medium rounded-xl backdrop-blur-sm transition-all flex items-center justify-center gap-2"
              >
                <Shield size={18} />
                Cara Kerja
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 
                <span>KAI Standard</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 
                <span>Real-Time AI</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Layer 3: Foreground Train Image */}
        <motion.div 
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="absolute bottom-0 right-0 z-20 hidden lg:block"
        >
          <Image
            src="/images/kereta%20transparan%20ke%20kiri.png"
            alt="Train Foreground"
            width={900}
            height={500}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </motion.div>

        {/* Floating Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-32 left-6 z-30 hidden md:block"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-2xl">
            <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Detection Rate</div>
            <div className="text-3xl font-bold text-white">99.8%</div>
            <div className="text-xs text-emerald-400 mt-1">+2.3% dari bulan lalu</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-48 left-48 z-30 hidden lg:block"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-2xl">
            <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Response Time</div>
            <div className="text-3xl font-bold text-[#F6841F]">&lt;45ms</div>
          </div>
        </motion.div>

      </section>

      {/* === ECOSYSTEM SECTION: BENTO GRID === */}
      <section id="ecosystem" className="py-32 bg-slate-950 relative">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 text-center max-w-3xl mx-auto"
          >
            <span className="text-[#F6841F] font-bold tracking-widest text-sm uppercase mb-4 block">Smart City Integration</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Satu Platform, Terkoneksi ke <span className="text-[#F6841F]">Seluruh Kota</span>
            </h2>
            <p className="text-lg text-slate-400">
              Lebih dari sekadar kamera. Aeon menghubungkan infrastruktur fisik dengan kecerdasan digital.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Smart Traffic (Large) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                  <TrafficCone size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Integrasi Lampu Merah</h3>
                <p className="text-slate-400 max-w-lg leading-relaxed mb-6">
                  Terhubung langsung dengan API Dinas Perhubungan untuk mengontrol lampu lalu lintas. 
                  Jalur evakuasi otomatis hijau saat kereta akan melintas.
                </p>
                <div className="flex gap-3">
                  <span className="px-4 py-2 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full">API Ready</span>
                  <span className="px-4 py-2 bg-slate-700 text-slate-300 text-xs font-bold rounded-full">Low Latency</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: WhatsApp Blast (Tall) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:row-span-2 bg-gradient-to-b from-emerald-900/50 to-slate-900 rounded-3xl p-8 border border-emerald-500/20 hover:border-emerald-500/50 transition-all relative overflow-hidden"
            >
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400">
                <MessageCircle size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">WhatsApp Blast</h3>
              <p className="text-slate-400 leading-relaxed mb-8">
                Notifikasi massal ke perangkat warga dalam radius 1KM, 5 menit sebelum kereta tiba.
              </p>
              
              {/* Mockup Message */}
              <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">WA</div>
                  <div>
                    <div className="font-bold text-white text-sm">Aeon Alert</div>
                    <div className="text-xs text-slate-500">Baru saja</div>
                  </div>
                </div>
                <div className="text-sm bg-slate-700/50 p-3 rounded-lg text-slate-200 leading-relaxed">
                  ⚠️ <span className="font-bold text-yellow-400">PERINGATAN:</span> Kereta Argo Wilis akan melintas di JPL 204 dalam 3 menit.
                </div>
              </div>
            </motion.div>

            {/* Card 3: Solar Power */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-orange-900/30 to-slate-900 rounded-3xl p-8 border border-orange-500/20 hover:border-orange-500/50 transition-all"
            >
              <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 text-orange-400">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Solar Powered</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Panel surya + baterai industri. Operasional 24/7 tanpa listrik PLN.
              </p>
            </motion.div>

            {/* Card 4: Analytics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-900/30 to-slate-900 rounded-3xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all"
            >
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Predictive Analytics</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                AI menganalisis pola untuk memprediksi potensi kecelakaan secara proaktif.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* === TECHNOLOGY SECTION === */}
      <section id="technology" className="py-32 bg-slate-900 border-y border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-[#F6841F] font-bold tracking-widest text-sm uppercase mb-4 block">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Alur Kerja Sistem</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { step: '01', title: 'Deteksi Visual', desc: 'Kamera CCTV High-FPS menangkap visual perlintasan secara real-time.', icon: Camera, color: 'blue' },
              { step: '02', title: 'Analisis AI', desc: 'Edge Computing mendeteksi manusia/kendaraan di rel dalam milidetik.', icon: Cpu, color: 'orange' },
              { step: '03', title: 'Aktivasi Peringatan', desc: 'Sirine lokal berbunyi dan lampu strobo menyala otomatis.', icon: Volume2, color: 'blue' },
              { step: '04', title: 'Intervensi Lalu Lintas', desc: 'Sinyal dikirim ke lampu merah untuk menahan arus kendaraan.', icon: Activity, color: 'orange' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-all group"
              >
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                    item.color === 'orange' ? 'bg-[#F6841F]/20 text-[#F6841F]' : 'bg-blue-500/20 text-blue-400'
                  } group-hover:scale-110 transition-transform`}>
                    <item.icon size={28} />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 font-mono mb-1">STEP {item.step}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer id="contact" className="bg-slate-950 pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F6841F] to-orange-600 rounded-xl flex items-center justify-center">
                <Image src="/images/logo%20Aeon.png" alt="Aeon" width={32} height={32} className="object-contain" />
              </div>
              <span className="text-2xl font-bold text-white">AEON RAILGUARD</span>
            </div>
            <p className="text-slate-400 max-w-xs leading-relaxed">
              Membangun masa depan keselamatan transportasi Indonesia melalui inovasi teknologi.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-bold mb-6">Navigasi</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link href="#hero" className="hover:text-[#F6841F] transition-colors">Beranda</Link></li>
                <li><Link href="#ecosystem" className="hover:text-[#F6841F] transition-colors">Ekosistem</Link></li>
                <li><Link href="#technology" className="hover:text-[#F6841F] transition-colors">Teknologi</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-[#F6841F] transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-[#F6841F] transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Kontak</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#F6841F]" /> 
                partnership@aeon-railguard.id
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#F6841F] mt-1" /> 
                Jombang, Jawa Timur, Indonesia
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#F6841F]" /> 
                +62 812-3456-7890
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; 2025 Team GenZ AI. All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  );
}
