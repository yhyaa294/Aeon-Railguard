'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { 
  ArrowRight, 
  MapPin, 
  TrafficCone, 
  Zap, 
  Smartphone,
  Server,
  Siren,
  MonitorPlay,
  Target,
  TrendingUp,
  Shield,
  Eye,
  Radio,
  Database,
  Brain,
  Crosshair,
  Globe,
  Rocket,
  Building2,
  ChevronRight,
  AlertTriangle,
  Volume2,
  VolumeX,
  Play
} from 'lucide-react';

export default function LandingPage() {
  const [introPhase, setIntroPhase] = useState<'video' | 'transition' | 'content'>('video');
  const [showUI, setShowUI] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video end or timeout
  useEffect(() => {
    const handleTransition = () => {
      setIntroPhase('transition');
      setTimeout(() => {
        setIntroPhase('content');
        setShowUI(true);
      }, 500);
    };

    // Fallback timer in case video doesn't load (6 seconds)
    const fallbackTimer = setTimeout(() => {
      if (introPhase === 'video') {
        handleTransition();
      }
    }, 6000);

    return () => clearTimeout(fallbackTimer);
  }, [introPhase]);

  const handleVideoEnd = () => {
    setIntroPhase('transition');
    setTimeout(() => {
      setIntroPhase('content');
      setShowUI(true);
    }, 500);
  };

  const handleVideoError = () => {
    setVideoError(true);
    setIntroPhase('content');
    setShowUI(true);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const skipIntro = () => {
    setIntroPhase('transition');
    setTimeout(() => {
      setIntroPhase('content');
      setShowUI(true);
    }, 300);
  };

  const handleImageError = (key: string) => {
    setImageError(prev => ({ ...prev, [key]: true }));
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#F6841F]/30 overflow-x-hidden text-slate-900">
      
      {/* ============================================
          CINEMATIC VIDEO INTRO OVERLAY
          - Fullscreen video that plays on entry
          - With sound (user can toggle mute)
          - Fades out after video ends
          ============================================ */}
      {introPhase !== 'content' && !videoError && (
        <div 
          className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-1000 ${
            introPhase === 'transition' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Video Player */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isMuted}
            onEnded={handleVideoEnd}
            onError={handleVideoError}
            className="absolute inset-0 w-full h-full object-cover"
            poster="/images/gambar kereta landing page hal 1.png"
          >
            <source src="/videos/intro-train.mp4" type="video/mp4" />
          </video>

          {/* Video Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
            {/* Mute/Unmute Button */}
            <button
              onClick={toggleMute}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors border border-white/30"
              title={isMuted ? "Nyalakan Suara" : "Matikan Suara"}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-white" />
              ) : (
                <Volume2 className="w-6 h-6 text-white" />
              )}
            </button>

            {/* Skip Button */}
            <button
              onClick={skipIntro}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors border border-white/30 text-white font-bold text-sm flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Skip Intro
            </button>
          </div>

          {/* Loading Indicator */}
          <div className="absolute top-8 right-8 flex items-center gap-3 text-white/70 text-sm font-mono">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            PLAYING INTRO
          </div>

          {/* Aeon Logo Watermark */}
          <div className="absolute top-8 left-8">
            <img 
              src="/images/logo Aeon.png" 
              alt="Aeon Logo" 
              className="h-10 w-auto opacity-70"
            />
          </div>
        </div>
      )}

      {/* ============================================
          SECTION 1: HERO
          - Shows after video intro ends
          - Staggered animations for all elements
          ============================================ */}
      <section className="relative h-screen w-full overflow-hidden">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {!imageError['hero'] ? (
            <Image
              src="/images/gambar kereta landing page hal 1.png"
              alt="Kereta Api Indonesia"
              fill
              className="object-cover"
              priority
              onError={() => handleImageError('hero')}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
          )}
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60 z-10" />

        {/* Navbar - Slides down */}
        <div 
          className={`absolute top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
            showUI ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
          }`}
          style={{ transitionDelay: showUI ? '100ms' : '0ms' }}
        >
          <Navbar />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 z-40 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center px-4 mt-[80px] w-full max-w-5xl">
              
              {/* Main Title - Scale up + fade */}
              <h1 
                className={`text-5xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter leading-none mb-8 transition-all duration-1000 ease-out ${
                  showUI ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-90'
                }`}
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  textShadow: '0 4px 30px rgba(0,0,0,0.7), 0 2px 10px rgba(0,0,0,0.9)',
                  transitionDelay: showUI ? '300ms' : '0ms'
                }}
              >
                AEON RAILGUARD
              </h1>

              {/* Subtitle Badge - Slide up */}
              <div 
                className={`mb-10 transition-all duration-700 ease-out ${
                  showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: showUI ? '600ms' : '0ms' }}
              >
                <span className="inline-block px-6 py-2 bg-orange-700/80 backdrop-blur-sm text-white text-base md:text-xl font-bold tracking-widest uppercase rounded-md shadow-xl border border-orange-500/30">
                  SOLUSI CERDAS PERLINTASAN &amp; JALUR TIKUS
                </span>
              </div>

              {/* Quote - Fade in */}
              <p 
                className={`text-slate-100 text-xl md:text-3xl font-light italic tracking-wide mb-12 max-w-4xl leading-relaxed transition-all duration-700 ease-out ${
                  showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  textShadow: '0 2px 15px rgba(0,0,0,0.8)',
                  transitionDelay: showUI ? '900ms' : '0ms'
                }}
              >
                &quot;Menjaga Nyawa Tanpa Menutup Akses Ekonomi Warga.&quot;
              </p>

              {/* CTA Button - Pop in */}
              <Link
                href="/login"
                className={`inline-flex items-center gap-3 px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-full shadow-2xl transition-all duration-500 ease-out hover:scale-105 hover:shadow-orange-500/30 ${
                  showUI ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-75'
                }`}
                style={{ transitionDelay: showUI ? '1200ms' : '0ms' }}
              >
                Coba Sekarang <ArrowRight className="w-5 h-5" />
              </Link>

          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 2: MASALAH (PROBLEM)
          ============================================ */}
      <section id="problem" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left: Photo */}
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white group">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                {!imageError['crossing'] ? (
                  <Image
                    src="/images/illegal-crossing.jpg"
                    alt="Realita Perlintasan Ilegal"
                    fill
                    className="object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700"
                    onError={() => handleImageError('crossing')}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-900 to-slate-900 flex items-center justify-center">
                    <AlertTriangle className="w-24 h-24 text-red-500/50" />
                  </div>
                )}
                
                {/* Location Badge */}
                <div className="absolute bottom-6 left-6 z-20 bg-black/70 backdrop-blur-md px-4 py-2 rounded-lg border-l-4 border-red-500 text-white">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1 text-red-400">
                    <MapPin size={12} /> Zona Bahaya
                  </div>
                  <div className="text-sm font-semibold">Perlintasan Tanpa Palang</div>
                </div>
            </div>

            {/* Right: Text Content */}
            <div className="space-y-8">
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

      {/* ============================================
          SECTION 3: SOLUSI - BENTO GRID
          ============================================ */}
      <section id="solution" className="py-24 bg-gradient-to-b from-white to-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#F6841F] font-bold tracking-widest text-sm uppercase mb-2 block">SOLUSI KAMI</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#2D3588] mb-6">
              Ekosistem Keselamatan Terpadu
            </h2>
            <p className="text-lg text-slate-500">
              Tiga pilar teknologi yang bekerja bersama untuk melindungi nyawa.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: AI Vision */}
            <div className="relative h-[400px] rounded-3xl overflow-hidden group cursor-pointer bg-gradient-to-br from-slate-800 to-slate-900">
              {!imageError['train'] && (
                <Image
                  src="/images/hero-train.jpg"
                  alt="AI Vision System"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={() => handleImageError('train')}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-[#F6841F] rounded-xl">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-[#F6841F] font-bold text-sm uppercase tracking-wider">The Eye</span>
                </div>
                <h3 className="text-3xl font-black text-white mb-2">AI Vision</h3>
                <p className="text-slate-300 text-lg">Mendeteksi objek dalam <span className="text-[#F6841F] font-bold font-mono">50ms</span> dengan akurasi 99.7%</p>
              </div>
            </div>

            {/* Card 2: Smart City Grid */}
            <div className="relative h-[400px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#2D3588] to-[#1a2057] group cursor-pointer">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px'}} />
              </div>
              <div className="relative h-full p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-green-500 rounded-xl">
                      <Radio className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-green-400 font-bold text-sm uppercase tracking-wider">The Brain</span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2">Smart City Grid</h3>
                  <p className="text-slate-300 text-lg">Integrasi dengan Lampu Merah, Ambulans & Pemadam</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <TrafficCone className="w-10 h-10 text-red-400 mb-2" />
                    <span className="text-xs text-slate-300">Traffic</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Siren className="w-10 h-10 text-blue-400 mb-2" />
                    <span className="text-xs text-slate-300">Emergency</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Smartphone className="w-10 h-10 text-green-400 mb-2" />
                    <span className="text-xs text-slate-300">Mobile</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Hardware Tahan Banting */}
            <div className="relative h-[400px] rounded-3xl overflow-hidden bg-gradient-to-br from-orange-500 to-orange-700 group cursor-pointer">
              <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl" />
              <div className="relative h-full p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-yellow-200 font-bold text-sm uppercase tracking-wider">The Shield</span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2">Hardware Tahan Banting</h3>
                  <p className="text-orange-100 text-lg">Panel Surya, Anti-Vandalism & Waterproof IP67</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <Zap className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                    <span className="text-white text-sm font-bold">Solar Powered</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <Shield className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                    <span className="text-white text-sm font-bold">Anti-Vandal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: HOW IT WORKS - AI WORKFLOW
          ============================================ */}
      <section id="technology" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #2D3588 1px, transparent 0)', backgroundSize: '48px 48px'}} />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#F6841F] font-bold tracking-widest text-sm uppercase mb-2 block">CARA KERJA AI</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#2D3588] mb-6">
              Pipeline Deep Learning
            </h2>
            <p className="text-lg text-slate-500">
              Dari input visual hingga deteksi objek dalam hitungan milidetik.
            </p>
          </div>

          {/* AI Pipeline */}
          <div className="relative">
            {/* Connecting Arrows */}
            <div className="hidden md:flex absolute top-1/2 left-[20%] right-[20%] -translate-y-1/2 justify-between z-0">
              <div className="flex-1 flex items-center px-4">
                <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                <ChevronRight className="w-8 h-8 text-purple-500 -ml-1" />
              </div>
              <div className="flex-1 flex items-center px-4">
                <div className="flex-1 h-1 bg-gradient-to-r from-purple-500 to-green-500 rounded-full" />
                <ChevronRight className="w-8 h-8 text-green-500 -ml-1" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl border-2 border-blue-200 hover:shadow-xl transition-all group">
                <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <div className="text-blue-500 font-bold text-sm uppercase tracking-wider mb-2">Step 1: Input</div>
                <h3 className="text-2xl font-black text-[#2D3588] mb-3">Dataset & Preprocessing</h3>
                <p className="text-slate-600">Frame video dari CCTV dikonversi menjadi tensor untuk diproses oleh neural network.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-3xl border-2 border-purple-200 hover:shadow-xl transition-all group">
                <div className="w-20 h-20 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div className="text-purple-500 font-bold text-sm uppercase tracking-wider mb-2">Step 2: Processing</div>
                <h3 className="text-2xl font-black text-[#2D3588] mb-3">YOLOv8 + CNN</h3>
                <p className="text-slate-600">Deep Learning memproses visual frame demi frame dengan arsitektur Convolutional Neural Network.</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-3xl border-2 border-green-200 hover:shadow-xl transition-all group">
                <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
                  <Crosshair className="w-10 h-10 text-white" />
                </div>
                <div className="text-green-500 font-bold text-sm uppercase tracking-wider mb-2">Step 3: Output</div>
                <h3 className="text-2xl font-black text-[#2D3588] mb-3">Object Detection</h3>
                <p className="text-slate-600">Membedakan Kereta, Mobil, Motor, dan Manusia dengan akurasi 99.7% dalam 50ms.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 5: LIVE DASHBOARD SHOWCASE
          ============================================ */}
      <section id="demo" className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-green-400 font-bold tracking-widest text-sm uppercase mb-2 block flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              SUDAH BERJALAN
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Sistem Sudah Berjalan (Live)
            </h2>
            <p className="text-lg text-slate-400">
              Bukan sekadar konsep. Dashboard monitoring real-time sudah aktif di Jombang.
            </p>
          </div>

          {/* Laptop Frame */}
          <div className="relative mx-auto max-w-5xl">
            <div className="bg-slate-700 rounded-t-2xl p-3 border-b border-slate-600">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-slate-800 rounded-lg px-4 py-2 text-sm text-slate-400 font-mono">
                  https://dashboard.aeonrailguard.id/live
                </div>
              </div>
            </div>
            <div className="relative bg-slate-800 rounded-b-2xl overflow-hidden shadow-2xl">
              {!imageError['dashboard'] ? (
                <Image
                  src="/images/dashboard.png"
                  alt="AEON RailGuard Live Dashboard"
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                  onError={() => handleImageError('dashboard')}
                />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <MonitorPlay className="w-24 h-24 text-slate-600" />
                </div>
              )}
              <div className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full flex items-center gap-2 shadow-lg animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full" />
                LIVE
              </div>
            </div>
            <div className="bg-slate-600 h-3 rounded-b-lg mx-auto w-2/3 shadow-xl" />
          </div>

          <p className="text-center text-slate-400 text-sm mt-8 italic">
            Pantauan Real-time Pos Jaga Peterongan - Jombang
          </p>

          <div className="text-center mt-10">
            <Link
              href="/login"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#F6841F] hover:bg-orange-600 text-white text-lg font-bold rounded-full shadow-2xl shadow-orange-500/20 transition-all hover:scale-105"
            >
              <MonitorPlay className="w-5 h-5" />
              Akses Dashboard Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 6: HARDWARE 2026
          ============================================ */}
      <section id="hardware" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <span className="text-[#F6841F] font-bold tracking-widest text-sm uppercase mb-4 block">TARGET PENDANAAN 2026</span>
                <h2 className="text-4xl md:text-5xl font-black text-[#2D3588] leading-tight mb-6">
                  Produksi Massal Sentinel Unit
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Saat ini kami menggunakan CCTV konvensional. Dengan pendanaan <span className="text-[#F6841F] font-bold">Seri-A di 2026</span>, kami akan memproduksi <strong>Aeon Sentinel</strong>: Hardware mandiri berbasis Solar Power & Thermal Cam.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="text-3xl">🔋</div>
                  <div>
                    <h4 className="text-[#2D3588] font-bold text-lg">Energi Mandiri</h4>
                    <p className="text-slate-600 text-sm">Panel surya + baterai industri. Tidak butuh listrik PLN.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-3xl">🌡️</div>
                  <div>
                    <h4 className="text-[#2D3588] font-bold text-lg">Anti-Kabut (Thermal)</h4>
                    <p className="text-slate-600 text-sm">Kamera infrared untuk deteksi malam hari & cuaca buruk.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="text-3xl">🛡️</div>
                  <div>
                    <h4 className="text-[#2D3588] font-bold text-lg">Vandal Proof</h4>
                    <p className="text-slate-600 text-sm">Casing baja anti-perusakan dengan rating IP67.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200">
                {!imageError['hardware'] ? (
                  <Image
                    src="/images/rencana alat.png"
                    alt="Aeon Sentinel Unit"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    onError={() => handleImageError('hardware')}
                  />
                ) : (
                  <div className="w-full aspect-[4/3] flex items-center justify-center">
                    <Server className="w-24 h-24 text-slate-400" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-4 -right-4 px-6 py-3 bg-[#2D3588] text-white font-bold rounded-2xl shadow-xl">
                Konsep Hardware 2026
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 7: ROADMAP 2025-2029
          ============================================ */}
      <section id="roadmap" className="py-24 bg-gradient-to-br from-[#2D3588] to-[#1a2057] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{backgroundImage: 'linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)', backgroundSize: '100px 100px'}} />
        </div>
        <div className="max-w-5xl mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#F6841F] font-bold tracking-widest text-sm uppercase mb-2 block">ROADMAP STRATEGIS</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Perjalanan 2025 - 2029
            </h2>
            <p className="text-lg text-slate-300">
              Dari pilot project hingga ekspansi pasar global.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-blue-500 via-purple-500 to-orange-500 rounded-full transform md:-translate-x-1/2" />

            <TimelineItem year="2025" status="ON PROGRESS" statusColor="green" title="Pilot Project & Validasi" description="Integrasi awal panel surya & Proof of Concept di Jombang. Validasi AI dengan data real." icon={<Rocket className="w-5 h-5" />} isLeft={true} />
            <TimelineItem year="2026" status="KEY MILESTONE" statusColor="blue" title="Funding & Mass Production" description="Penyempurnaan algoritma & produksi massal perangkat keras. Optimalisasi efisiensi energi." icon={<Target className="w-5 h-5" />} isLeft={false} />
            <TimelineItem year="2027" status="PLANNED" statusColor="purple" title="Ekspansi Lintas Tinggi" description="Kolaborasi dengan industri telekomunikasi & energi. Deployment di DAOP 7 & 8." icon={<TrendingUp className="w-5 h-5" />} isLeft={true} />
            <TimelineItem year="2028" status="PLANNED" statusColor="orange" title="Standarisasi Nasional" description="Penerapan di jaringan PT KAI seluruh Indonesia. Integrasi dengan sistem GAPEKA." icon={<Building2 className="w-5 h-5" />} isLeft={false} />
            <TimelineItem year="2029" status="VISION" statusColor="red" title="Global Market" description="Ekspor teknologi ke negara berkembang lainnya. Partnership dengan railway internasional." icon={<Globe className="w-5 h-5" />} isLeft={true} />
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 8: FOOTER
          ============================================ */}
      <footer id="contact" className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-12 h-12">
                  <Image src="/images/logo Aeon.png" alt="AEON Logo" width={48} height={48} className="rounded-xl" />
                </div>
                <div>
                  <div className="font-black text-xl tracking-tight">AEON RAILGUARD</div>
                  <div className="text-xs text-slate-400">by Team GenZ Jombang</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Inovasi Keselamatan Perkeretaapian Indonesia. Menjaga nyawa tanpa menutup akses ekonomi warga.
              </p>
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7">
                  <Image src="/images/logo kai.jpg" alt="KAI" width={28} height={28} className="rounded opacity-70" />
                </div>
                <span className="text-xs text-slate-500">Technology Partner</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Peta Situs</h4>
              <ul className="space-y-3">
                <li><Link href="#problem" className="text-slate-400 hover:text-[#F6841F] transition-colors text-sm">Masalah</Link></li>
                <li><Link href="#solution" className="text-slate-400 hover:text-[#F6841F] transition-colors text-sm">Solusi</Link></li>
                <li><Link href="#technology" className="text-slate-400 hover:text-[#F6841F] transition-colors text-sm">Teknologi AI</Link></li>
                <li><Link href="#demo" className="text-slate-400 hover:text-[#F6841F] transition-colors text-sm">Live Dashboard</Link></li>
                <li><Link href="#roadmap" className="text-slate-400 hover:text-[#F6841F] transition-colors text-sm">Roadmap</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Investor Relations</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-400 hover:text-[#F6841F] transition-colors text-sm flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Hubungi Tim Funding</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-[#F6841F] transition-colors text-sm flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Dokumen Teknis</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-[#F6841F] transition-colors text-sm flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Pitch Deck</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Legal</h4>
              <ul className="space-y-3">
                <li><span className="text-slate-400 text-sm">Kebijakan Privasi</span></li>
                <li><span className="text-slate-400 text-sm">Syarat & Ketentuan</span></li>
              </ul>
              <div className="mt-6 pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-500 mb-2">Didukung oleh:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">Ekraf Tech Summit</span>
                  <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">Kemenhub RI</span>
                  <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">PT KAI</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-slate-500 text-sm text-center md:text-left">
                &copy; 2025 <span className="text-white font-semibold">Team GenZ AI Jombang</span>. Built for Ekraf Tech Summit.
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-xs">
                <span className="flex items-center gap-1">🇮🇩 Produk Anak Bangsa</span>
                <span className="text-slate-600">|</span>
                <span>v1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Timeline Item Component
function TimelineItem({ year, status, statusColor, title, description, icon, isLeft }: { 
  year: string, status: string, statusColor: string, title: string, description: string, icon: React.ReactNode, isLeft: boolean 
}) {
  const statusColors: Record<string, string> = { green: "bg-green-500", blue: "bg-blue-500", purple: "bg-purple-500", orange: "bg-orange-500", red: "bg-red-500" };
  const badgeColors: Record<string, string> = { green: "bg-green-100 text-green-700", blue: "bg-blue-100 text-blue-700", purple: "bg-purple-100 text-purple-700", orange: "bg-orange-100 text-orange-700", red: "bg-red-100 text-red-700" };
  const dotColor = statusColors[statusColor] || statusColors.blue;
  const badgeColor = badgeColors[statusColor] || badgeColors.blue;

  return (
    <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
      {isLeft ? (
        <>
          <div className="md:w-1/2 md:text-right md:pr-12 pl-20 md:pl-0">
            <div className={`inline-block px-3 py-1 ${badgeColor} text-xs font-bold rounded-full mb-2`}>{status}</div>
            <div className="text-4xl font-black text-white/30 mb-2 font-mono">{year}</div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm">{description}</p>
          </div>
          <div className={`absolute left-8 md:left-1/2 w-10 h-10 ${dotColor} rounded-full border-4 border-slate-800 shadow-lg transform md:-translate-x-1/2 flex items-center justify-center text-white`}>{icon}</div>
          <div className="md:w-1/2 md:pl-12" />
        </>
      ) : (
        <>
          <div className="md:w-1/2 md:pr-12 md:order-1 order-2" />
          <div className={`absolute left-8 md:left-1/2 w-10 h-10 ${dotColor} rounded-full border-4 border-slate-800 shadow-lg transform md:-translate-x-1/2 flex items-center justify-center text-white`}>{icon}</div>
          <div className="md:w-1/2 md:pl-12 md:order-2 order-1 pl-20 md:pl-12">
            <div className={`inline-block px-3 py-1 ${badgeColor} text-xs font-bold rounded-full mb-2`}>{status}</div>
            <div className="text-4xl font-black text-white/30 mb-2 font-mono">{year}</div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm">{description}</p>
          </div>
        </>
      )}
    </div>
  );
}
