'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
  AlertTriangle,
  Volume2,
  VolumeX,
  Play,
  CheckCircle,
  Activity,
  Ambulance,
  Train,
  Camera,
  Wifi,
  Clock,
  Layers,
  Cpu,
  Bell,
  Sun,
  ImageIcon,
  Mail,
  Phone,
  Users,
  MessageCircle,
  Instagram,
  Linkedin,
  Github,
  FileText
} from 'lucide-react';
import FeaturePill from '@/components/landing/FeaturePill';
import TeamCard from '@/components/landing/TeamCard';
import TimelineItemFull from '@/components/landing/TimelineItemFull';

// Custom hook for scroll-based fade-in animation
function useInView(options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}

// FadeInUp wrapper component
function FadeInUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [showVideo, setShowVideo] = useState(true);
  const [isFading, setIsFading] = useState(false); // Controls fade animation state
  const [showUI, setShowUI] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fallback timer - if video doesn't end within 8s, start transition
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (showVideo && !isFading && !videoError) {
        startTransition();
      }
    }, 8000);

    return () => clearTimeout(fallbackTimer);
  }, [showVideo, isFading, videoError]);

  // Start crossfade transition - trigger UI animations WHILE video fades
  const startTransition = () => {
    if (isFading) return; // Prevent multiple triggers
    setIsFading(true); // Start video fade-out animation
    setShowUI(true); // Start hero text animations simultaneously
  };

  // Called when fade animation completes - remove video from DOM
  const handleFadeComplete = () => {
    if (isFading) {
      setShowVideo(false); // Now safe to remove from DOM
    }
  };

  const handleVideoEnd = () => {
    startTransition();
  };

  const handleVideoError = () => {
    setVideoError(true);
    setShowVideo(false);
    setShowUI(true);
  };

  const skipIntro = () => {
    startTransition();
  };

  const handleImageError = (key: string) => {
    setImageError(prev => ({ ...prev, [key]: true }));
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#F6841F]/30 overflow-x-hidden text-slate-900">

      {/* ============================================
          CINEMATIC VIDEO INTRO OVERLAY (FULLSCREEN)
          - Uses AnimatePresence for smooth 1.5s crossfade
          - z-[100] to be above everything including navbar
          - Static hero renders BEHIND this, visible during fade
          - Animation controlled by isFading state for seamless transition
          ============================================ */}
      <AnimatePresence>
        {showVideo && !videoError && (
          <motion.div
            key="video-intro"
            initial={{ opacity: 1 }}
            animate={{ opacity: isFading ? 0 : 1 }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            onAnimationComplete={handleFadeComplete}
            className="fixed inset-0 z-[100]"
          >
            {/* Fullscreen Video - motion.video with object-cover to match hero image */}
            <motion.video
              ref={videoRef}
              autoPlay
              playsInline
              muted={isMuted}
              onEnded={handleVideoEnd}
              onError={handleVideoError}
              className="absolute inset-0 w-full h-full object-cover"
              poster="/images/gambar kereta landing page hal 1.png"
              style={{ objectFit: 'cover' }}
            >
              <source src="/videos/intro-train.mp4" type="video/mp4" />
            </motion.video>

            {/* Dark Vignette Overlay - matches hero gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50 pointer-events-none" />

            {/* Logo Watermark (Top Left) */}
            <motion.div
              className="absolute top-8 left-8 z-10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Image
                src="/images/logo Aeon.png"
                alt="Aeon Logo"
                width={48}
                height={48}
                className="opacity-80"
              />
            </motion.div>

            {/* Loading Indicator (Top Right) */}
            <motion.div
              className="absolute top-8 right-8 flex items-center gap-3 text-white/70 text-sm font-mono z-10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="hidden sm:inline">PLAYING INTRO</span>
            </motion.div>

            {/* Bottom Controls */}
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {/* Mute/Unmute Button */}
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.muted = !videoRef.current.muted;
                    setIsMuted(!isMuted);
                  }
                }}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors border border-white/20"
                title={isMuted ? "Nyalakan Suara" : "Matikan Suara"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>

              {/* Skip Button */}
              <button
                onClick={skipIntro}
                className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors border border-white/20 text-white font-bold text-sm flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Skip Intro
              </button>
            </motion.div>

            {/* Center Branding (visible while video plays) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="flex items-center justify-center gap-3 text-[#F6841F] mb-4">
                  <Activity className="w-6 h-6 animate-pulse" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">AEON RAILGUARD</h2>
                <p className="text-white/50 text-sm">Sistem Keamanan Perlintasan Kereta Api</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================
          NAVBAR (Hidden during video, appears after)
          ============================================ */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
          }`}
      >
        <Navbar />
      </div>

      {/* ============================================
          SECTION 1: HERO - CINEMATIC LAYERING
          Uses same image as video poster for seamless transition
          ============================================ */}
      <section className="relative min-h-screen w-full overflow-hidden">

        {/* LAYER 1: Background Image - SAME AS VIDEO POSTER for seamless transition */}
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

        {/* LAYER 2: Dark Gradient Overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-black/40 to-black/50" />

        {/* LAYER 4: Hero Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-32">
          <div className={`text-center max-w-5xl transition-all duration-1000 ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 transition-all duration-700 ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white/90">Sistem Aktif di Jombang</span>
            </div>

            {/* Main Headline */}
            <h1
              className={`text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.9] mb-6 transition-all duration-1000 ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                transitionDelay: '400ms'
              }}
            >
              AEON<br />
              <span className="text-[#F6841F]">RAILGUARD</span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '600ms' }}
            >
              Sistem Keselamatan Perkeretaapian Terpadu Berbasis
              <span className="text-[#F6841F] font-semibold"> AI & Geo-Spatial</span>.
              Memantau perlintasan ilegal secara real-time.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '800ms' }}
            >
              <a
                href="#map"
                className="group px-8 py-4 bg-[#F6841F] hover:bg-[#e07010] text-white text-lg font-bold rounded-full shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all flex items-center gap-3"
              >
                <MapPin className="w-5 h-5" />
                Lihat Peta Sebaran
                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </a>
              <Link
                href="/login"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-lg font-semibold rounded-full border border-white/30 transition-all flex items-center gap-2"
              >
                Akses Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-700 ${showUI ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col items-center gap-2 text-white/50">
            <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 2: LIVE MAP PREVIEW (ONE MAP POLICY)
          ============================================ */}
      <section id="map" className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold mb-6">
              <Layers className="w-4 h-4" />
              ONE MAP POLICY
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
              Pemantauan Terintegrasi<br />
              <span className="text-[#2D3588]">Satu Peta</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Memantau seluruh titik rawan, posisi kereta, dan status palang pintu dalam satu dashboard geospasial real-time.
            </p>
          </div>

          {/* Map Interface Mockup */}
          <div className="relative max-w-6xl mx-auto">
            {/* Browser Frame */}
            <div className="bg-slate-800 rounded-t-2xl p-3 flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-slate-700 rounded-lg px-4 py-2 text-sm text-slate-400 font-mono flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                https://map.aeonrailguard.id/live
              </div>
              <div className="text-xs text-slate-500 font-mono">LIVE</div>
            </div>

            {/* Map Container */}
            <div className="relative bg-slate-100 rounded-b-2xl overflow-hidden shadow-2xl aspect-[16/9] border-4 border-slate-800 border-t-0">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-slate-100">
                {/* Map Grid Pattern */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `
                    linear-gradient(rgba(100,116,139,0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(100,116,139,0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px'
                }} />

                {/* Railway Lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 10 80 Q 30 60 50 50 T 90 30" stroke="#2D3588" strokeWidth="0.8" fill="none" strokeDasharray="2,1" />
                  <path d="M 5 50 Q 40 45 60 55 T 95 60" stroke="#2D3588" strokeWidth="0.8" fill="none" strokeDasharray="2,1" />
                </svg>
              </div>

              {/* Map Status Bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-slate-200 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#2D3588]" />
                    <span className="text-sm font-bold text-slate-800">DAOP 7 Madiun</span>
                  </div>
                  <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-slate-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-mono text-slate-600">14:32:08 WIB</span>
                  </div>
                </div>
                <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-bold">
                  <Wifi className="w-4 h-4" />
                  CONNECTED
                </div>
              </div>

              {/* Floating Markers */}
              {/* Marker 1: Safe Location */}
              <div className="absolute top-[35%] left-[25%] z-10 animate-pulse">
                <div className="relative">
                  <div className="absolute -inset-4 bg-green-500/20 rounded-full animate-ping" />
                  <div className="bg-white rounded-xl shadow-xl p-3 border-l-4 border-green-500 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-xs font-bold text-green-600 uppercase tracking-wider">AMAN</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800">📍 JPL 102 Jombang</div>
                    <div className="text-xs text-slate-500 mt-1">Palang Aktif • 0 Kendaraan</div>
                  </div>
                  <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-l border-b border-slate-200 rotate-[-45deg]" />
                </div>
              </div>

              {/* Marker 2: Danger Location */}
              <div className="absolute top-[55%] right-[30%] z-10">
                <div className="relative">
                  <div className="absolute -inset-4 bg-red-500/20 rounded-full animate-ping" />
                  <div className="bg-white rounded-xl shadow-xl p-3 border-l-4 border-red-500 min-w-[220px]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-red-600 uppercase tracking-wider">BAHAYA</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800">📍 JPL 105 Peterongan</div>
                    <div className="text-xs text-slate-500 mt-1">3 Motor Terdeteksi • Kereta 2 min</div>
                  </div>
                  <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-l border-b border-slate-200 rotate-[-45deg]" />
                </div>
              </div>

              {/* Marker 3: Ambulance Standby */}
              <div className="absolute bottom-[25%] left-[45%] z-10">
                <div className="bg-white rounded-xl shadow-xl p-3 border-l-4 border-blue-500 min-w-[180px]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">SIAGA</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800">🚑 Unit Ambulans</div>
                  <div className="text-xs text-slate-500 mt-1">Standby di Pos Jaga</div>
                </div>
              </div>

              {/* Train Icon Moving */}
              <div className="absolute top-[40%] left-[60%] z-10">
                <div className="bg-[#2D3588] text-white p-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
                  <Train className="w-5 h-5" />
                  <div>
                    <div className="text-xs font-bold">KA Sancaka</div>
                    <div className="text-[10px] opacity-80">80 km/h → Timur</div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-slate-200">
                <div className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Legend</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-slate-600">Aman / Normal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span className="text-slate-600">Waspada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-slate-600">Bahaya / Alert</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-slate-600">Unit Darurat</span>
                  </div>
                </div>
              </div>

              {/* Stats Panel */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-slate-200">
                <div className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Live Stats</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-black text-[#2D3588]">24</div>
                    <div className="text-slate-500">CCTV Aktif</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-black text-green-600">18</div>
                    <div className="text-slate-500">Perlintasan</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-black text-[#F6841F]">3</div>
                    <div className="text-slate-500">Alert Hari Ini</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-black text-blue-600">2</div>
                    <div className="text-slate-500">Kereta Aktif</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            <FeaturePill icon={<Camera className="w-4 h-4" />} text="24 CCTV Terintegrasi" />
            <FeaturePill icon={<Brain className="w-4 h-4" />} text="AI Object Detection" />
            <FeaturePill icon={<Wifi className="w-4 h-4" />} text="Real-time Sync" />
            <FeaturePill icon={<Siren className="w-4 h-4" />} text="Auto Alert System" />
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 3: MASALAH (PROBLEM)
          ============================================ */}
      <section id="problem" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Photo */}
            <div className="relative">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                {!imageError['crossing'] ? (
                  <Image
                    src="/images/perlintasan ilegal.png"
                    alt="Perlintasan Ilegal"
                    fill
                    className="object-cover"
                    onError={() => handleImageError('crossing')}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-900 to-slate-900 flex items-center justify-center">
                    <AlertTriangle className="w-24 h-24 text-red-500/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Danger Badge */}
                <div className="absolute bottom-6 left-6 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg">
                  <AlertTriangle className="w-4 h-4" />
                  ZONA BAHAYA
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
                <div className="text-4xl font-black text-red-500 mb-1">324+</div>
                <div className="text-sm text-slate-600">Perlintasan Ilegal<br />di Jawa Timur</div>
              </div>
            </div>

            {/* Right: Text */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-bold mb-4">
                  <AlertTriangle className="w-4 h-4" />
                  LATAR BELAKANG
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                  Realita Pahit<br />
                  <span className="text-red-500">Jalur Tikus</span>
                </h2>
              </div>

              <p className="text-lg text-slate-600 leading-relaxed">
                Ratusan perlintasan sebidang ilegal menjadi urat nadi ekonomi warga. Sekolah, pasar, dan lahan pertanian bergantung pada akses ini.
              </p>

              <div className="bg-slate-50 rounded-2xl p-6 border-l-4 border-red-500">
                <p className="text-slate-800 font-semibold text-lg italic">
                  "Menutupnya berarti mematikan ekonomi, membiarkannya berarti mempertaruhkan nyawa."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-red-500 mb-2">127</div>
                  <div className="text-sm text-slate-600">Kecelakaan/tahun</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-slate-900 mb-2">0</div>
                  <div className="text-sm text-slate-600">Sistem Monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: SOLUSI - BENTO GRID
          ============================================ */}
      <section id="solution" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-bold mb-4">
              <CheckCircle className="w-4 h-4" />
              SOLUSI KAMI
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Ekosistem Keselamatan<br />
              <span className="text-[#2D3588]">Terpadu</span>
            </h2>
            <p className="text-lg text-slate-600">
              Tiga pilar teknologi yang bekerja bersama melindungi nyawa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: AI Vision */}
            <div className="relative h-[420px] rounded-3xl overflow-hidden group cursor-pointer bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl">
              {!imageError['hero-train'] && (
                <Image
                  src="/images/hero-train.jpg"
                  alt="AI Vision"
                  fill
                  className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                  onError={() => handleImageError('hero-train')}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F6841F] rounded-lg mb-4">
                  <Eye className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-sm">THE EYE</span>
                </div>
                <h3 className="text-3xl font-black text-white mb-3">AI Vision</h3>
                <p className="text-white/80">Deteksi objek dalam <span className="text-[#F6841F] font-bold font-mono">50ms</span> dengan akurasi 99.7%</p>
              </div>
            </div>

            {/* Card 2: Smart City */}
            <div className="relative h-[420px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#2D3588] to-[#1a2057] shadow-xl p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500 rounded-lg mb-4">
                  <Radio className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-sm">THE BRAIN</span>
                </div>
                <h3 className="text-3xl font-black text-white mb-3">Smart City Grid</h3>
                <p className="text-white/80">Integrasi dengan Lampu Merah, Ambulans & Pemadam</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <TrafficCone className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <span className="text-white/70 text-xs">Traffic</span>
                </div>
                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Siren className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <span className="text-white/70 text-xs">Emergency</span>
                </div>
                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Smartphone className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <span className="text-white/70 text-xs">Mobile</span>
                </div>
              </div>
            </div>

            {/* Card 3: Hardware */}
            <div className="relative h-[420px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#F6841F] to-orange-700 shadow-xl p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg mb-4">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-sm">THE SHIELD</span>
                </div>
                <h3 className="text-3xl font-black text-white mb-3">Hardware Tangguh</h3>
                <p className="text-white/90">Panel Surya, Anti-Vandal & Waterproof IP67</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Zap className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                  <span className="text-white text-xs font-medium">Solar Power</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Shield className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                  <span className="text-white text-xs font-medium">Anti-Vandal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 5: AI PIPELINE VISUALIZATION
          Based on User's AI Diagram (Dataset -> YOLOv8 -> Output)
          ============================================ */}
      <section id="technology" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #2D3588 1px, transparent 0)', backgroundSize: '48px 48px' }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-bold mb-4">
                <Brain className="w-4 h-4" />
                CARA KERJA AI
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                Pipeline Deep Learning<br />
                <span className="text-purple-600">&amp; Computer Vision</span>
              </h2>
              <p className="text-lg text-slate-600">
                Proses deteksi objek presisi tinggi dalam hitungan milidetik.
              </p>
            </div>
          </FadeInUp>

          {/* AI Pipeline - Horizontal Process Chain */}
          <div className="relative">
            {/* Connecting Arrows */}
            <div className="hidden md:flex absolute top-1/2 left-[18%] right-[18%] -translate-y-1/2 justify-between z-0">
              <div className="flex-1 flex items-center px-2">
                <div className="flex-1 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse opacity-50" />
                </div>
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[16px] border-l-purple-500 -ml-1" />
              </div>
              <div className="flex-1 flex items-center px-2">
                <div className="flex-1 h-1.5 bg-gradient-to-r from-purple-500 to-green-500 rounded-full relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-green-500 rounded-full animate-pulse opacity-50" />
                </div>
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[16px] border-l-green-500 -ml-1" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* Step 1: Input */}
              <FadeInUp delay={100}>
                <div className="bg-white p-8 rounded-3xl border-2 border-blue-200 hover:shadow-2xl hover:border-blue-400 transition-all group h-full">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                    <div className="relative">
                      <Database className="w-8 h-8 text-white" />
                      <ImageIcon className="w-5 h-5 text-blue-200 absolute -bottom-1 -right-1" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 font-bold text-xs uppercase tracking-wider rounded-full">Step 1</span>
                    <span className="text-blue-500 font-semibold text-sm">INPUT</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">Dataset &amp; Preprocessing</h3>
                  <p className="text-slate-600 leading-relaxed">Pengumpulan data visual &amp; labeling objek (Mobil, Kereta, Manusia).</p>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">Video Frames</span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">Annotations</span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">COCO Format</span>
                    </div>
                  </div>
                </div>
              </FadeInUp>

              {/* Step 2: The Brain */}
              <FadeInUp delay={200}>
                <div className="bg-white p-8 rounded-3xl border-2 border-purple-200 hover:shadow-2xl hover:border-purple-400 transition-all group h-full relative">
                  <div className="absolute top-4 right-4 px-2 py-1 bg-purple-100 text-purple-600 text-xs font-bold rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                    CORE
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                    <div className="relative">
                      <Cpu className="w-8 h-8 text-white" />
                      <Brain className="w-5 h-5 text-purple-200 absolute -bottom-1 -right-1" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 font-bold text-xs uppercase tracking-wider rounded-full">Step 2</span>
                    <span className="text-purple-500 font-semibold text-sm">THE BRAIN</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">YOLOv8 + CNN Architecture</h3>
                  <p className="text-slate-600 leading-relaxed">Neural Network memproses frame video secara real-time.</p>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-md font-mono">YOLOv8n</span>
                      <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-md font-mono">PyTorch</span>
                      <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-md font-mono">CUDA</span>
                    </div>
                  </div>
                </div>
              </FadeInUp>

              {/* Step 3: Output */}
              <FadeInUp delay={300}>
                <div className="bg-white p-8 rounded-3xl border-2 border-green-200 hover:shadow-2xl hover:border-green-400 transition-all group h-full">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
                    <div className="relative">
                      <Crosshair className="w-8 h-8 text-white" />
                      <Bell className="w-5 h-5 text-green-200 absolute -bottom-1 -right-1" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-green-100 text-green-600 font-bold text-xs uppercase tracking-wider rounded-full">Step 3</span>
                    <span className="text-green-500 font-semibold text-sm">OUTPUT</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">Cross-Validation &amp; Alert</h3>
                  <p className="text-slate-600 leading-relaxed">Verifikasi objek &gt;3 detik di zona bahaya = Peringatan.</p>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-md">Bounding Box</span>
                      <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-md">Confidence %</span>
                      <span className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-md">Alert System</span>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </div>

          {/* Stats Bar */}
          <FadeInUp delay={400}>
            <div className="mt-16 bg-gradient-to-r from-[#2D3588] to-[#1a2057] rounded-2xl p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-1">50<span className="text-[#F6841F]">ms</span></div>
                  <div className="text-slate-400 text-sm">Inference Time</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-1">99.7<span className="text-[#F6841F]">%</span></div>
                  <div className="text-slate-400 text-sm">Akurasi Deteksi</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-1">30<span className="text-[#F6841F]">fps</span></div>
                  <div className="text-slate-400 text-sm">Real-time Processing</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-1">4<span className="text-[#F6841F]">class</span></div>
                  <div className="text-slate-400 text-sm">Object Classes</div>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ============================================
          SECTION 6: THE AEON ECOSYSTEM (Feature Grid)
          ============================================ */}
      <section id="ecosystem" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-4">
                <Layers className="w-4 h-4" />
                EKOSISTEM TERINTEGRASI
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                The Aeon<br />
                <span className="text-[#2D3588]">Ecosystem</span>
              </h2>
              <p className="text-lg text-slate-600">
                Empat pilar teknologi yang bekerja harmonis untuk keselamatan maksimal.
              </p>
            </div>
          </FadeInUp>

          {/* Feature Grid - 2x2 on mobile, 4 columns on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: The Eye */}
            <FadeInUp delay={100}>
              <div className="group bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <div className="text-blue-500 font-bold text-xs uppercase tracking-wider mb-2">The Eye</div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Thermal &amp; RGB Vision</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Melihat dalam gelap &amp; kabut dengan kamera inframerah dan RGB dual-sensor.</p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    24/7 Active Monitoring
                  </div>
                </div>
              </div>
            </FadeInUp>

            {/* Card 2: The Energy */}
            <FadeInUp delay={200}>
              <div className="group bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200 hover:border-yellow-300 hover:shadow-xl transition-all h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-yellow-500/20">
                  <Sun className="w-7 h-7 text-white" />
                </div>
                <div className="text-yellow-600 font-bold text-xs uppercase tracking-wider mb-2">The Energy</div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Independent Solar Power</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Operasional 24/7 tanpa listrik PLN dengan panel surya &amp; baterai cadangan.</p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    Off-grid Capable
                  </div>
                </div>
              </div>
            </FadeInUp>

            {/* Card 3: The Guard */}
            <FadeInUp delay={300}>
              <div className="group bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200 hover:border-red-300 hover:shadow-xl transition-all h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-red-500/20">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="text-red-500 font-bold text-xs uppercase tracking-wider mb-2">The Guard</div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Smart Gate Integration</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Palang pintu otomatis berbasis sensor dengan response time &lt;500ms.</p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Instant Response
                  </div>
                </div>
              </div>
            </FadeInUp>

            {/* Card 4: The Network */}
            <FadeInUp delay={400}>
              <div className="group bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200 hover:border-green-300 hover:shadow-xl transition-all h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/20">
                  <Wifi className="w-7 h-7 text-white" />
                </div>
                <div className="text-green-500 font-bold text-xs uppercase tracking-wider mb-2">The Network</div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Smart City Connect</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Terhubung ke lampu merah &amp; ambulans via API Smart City integration.</p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Globe className="w-3 h-3 text-green-500" />
                    IoT Connected
                  </div>
                </div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 7: HARDWARE MASS PRODUCTION (2026 TARGET)
          ============================================ */}
      <section id="hardware" className="py-24 bg-white relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-50 to-transparent opacity-50" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Text Content */}
            <FadeInUp>
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-6">
                    <Target className="w-4 h-4" />
                    TARGET PENDANAAN 2026
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                    Produksi Massal<br />
                    <span className="text-[#F6841F]">Aeon Sentinel</span>
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Transisi dari perangkat pihak ketiga ke <strong>Hardware Mandiri (Proprietary Hardware)</strong> untuk efisiensi biaya dan ketahanan cuaca ekstrem.
                  </p>
                </div>

                {/* Key Specs */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-bold text-lg mb-1">🔋 Energy: 100% Solar Powered</h4>
                      <p className="text-slate-600 text-sm">Baterai LiFePO4 dengan kapasitas tahan <strong>3 hari tanpa matahari</strong>. Off-grid capable.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-bold text-lg mb-1">🌡️ Vision: Thermal Camera</h4>
                      <p className="text-slate-600 text-sm">Deteksi hewan & manusia di <strong>malam hari dan cuaca buruk</strong> dengan sensor inframerah.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-bold text-lg mb-1">🛡️ Durability: IP67 Certified</h4>
                      <p className="text-slate-600 text-sm"><strong>Anti-Vandalism & Weatherproof</strong>. Casing baja tahan perusakan dan hujan lebat.</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInUp>

            {/* Right: Hardware Image */}
            <FadeInUp delay={200}>
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200">
                  {!imageError['hardware'] ? (
                    <Image
                      src="/images/rencana alat.png"
                      alt="Aeon Sentinel Unit - Hardware Concept"
                      width={800}
                      height={600}
                      className="w-full h-auto"
                      onError={() => handleImageError('hardware')}
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                      <Server className="w-24 h-24 text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Badge */}
                <div className="absolute -bottom-4 -left-4 px-6 py-3 bg-[#2D3588] text-white font-bold rounded-2xl shadow-xl flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-[#F6841F]" />
                  Konsep Hardware 2026
                </div>

                {/* Floating Stats */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-slate-100">
                  <div className="text-3xl font-black text-[#F6841F] mb-1">Rp 2.5M</div>
                  <div className="text-xs text-slate-600">Target Harga/Unit</div>
                </div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 8: STRATEGIC ROADMAP (5-YEAR PLAN)
          ============================================ */}
      <section id="roadmap" className="py-24 bg-gradient-to-br from-[#2D3588] via-[#1a2057] to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }} />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative">
          {/* Section Header */}
          <FadeInUp>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-sm font-bold mb-6 backdrop-blur-sm border border-white/20">
                <Rocket className="w-4 h-4 text-[#F6841F]" />
                STRATEGIC ROADMAP
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Perjalanan <span className="text-[#F6841F]">2025 - 2029</span>
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Dari pilot project hingga ekosistem transportasi cerdas nasional.
              </p>
            </div>
          </FadeInUp>

          {/* Timeline - Vertical */}
          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-blue-500 via-purple-500 via-orange-500 to-red-500 rounded-full md:-translate-x-1/2" />

            {/* 2025 */}
            <FadeInUp delay={100}>
              <TimelineItemFull
                year="2025"
                status="ON TRACK"
                statusColor="green"
                title="Pilot Project & Validasi"
                description="Proof of Concept di Jombang. Integrasi data awal dengan sistem CCTV eksisting dan validasi model AI dengan data lapangan."
                isLeft={true}
                icon={<Rocket className="w-5 h-5" />}
                highlights={["PoC Jombang", "AI Training", "Data Collection"]}
              />
            </FadeInUp>

            {/* 2026 */}
            <FadeInUp delay={200}>
              <TimelineItemFull
                year="2026"
                status="KEY GOAL"
                statusColor="blue"
                title="Funding & Mass Production"
                description="Produksi massal Aeon Sentinel hardware. Penyempurnaan algoritma AI dan optimalisasi efisiensi energi untuk deployment skala besar."
                isLeft={false}
                icon={<Target className="w-5 h-5" />}
                highlights={["Hardware Production", "Algorithm v2.0", "Series A"]}
                isBig={true}
              />
            </FadeInUp>

            {/* 2027 */}
            <FadeInUp delay={300}>
              <TimelineItemFull
                year="2027"
                status="PLANNED"
                statusColor="purple"
                title="Ekspansi Lintas Tinggi"
                description="Kerjasama dengan provider telekomunikasi. Deployment di jalur padat DAOP 7 & 8 (Madiun-Surabaya)."
                isLeft={true}
                icon={<TrendingUp className="w-5 h-5" />}
                highlights={["Telco Partnership", "DAOP 7 & 8", "IoT Network"]}
              />
            </FadeInUp>

            {/* 2028 */}
            <FadeInUp delay={400}>
              <TimelineItemFull
                year="2028"
                status="PLANNED"
                statusColor="orange"
                title="Standarisasi Nasional"
                description="Adopsi oleh PT KAI di seluruh Pulau Jawa & Sumatera. Integrasi dengan sistem GAPEKA (Grafik Perjalanan Kereta Api)."
                isLeft={false}
                icon={<Building2 className="w-5 h-5" />}
                highlights={["PT KAI Adoption", "Java & Sumatera", "GAPEKA Sync"]}
              />
            </FadeInUp>

            {/* 2029 */}
            <FadeInUp delay={500}>
              <TimelineItemFull
                year="2029"
                status="VISION"
                statusColor="red"
                title="Global Market & Society 5.0"
                description="Ekspor teknologi ke negara berkembang (ASEAN, Afrika). Kontribusi pada ekosistem Smart Transportation Indonesia."
                isLeft={true}
                icon={<Globe className="w-5 h-5" />}
                highlights={["ASEAN Export", "Smart City", "Society 5.0"]}
              />
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 9: LIVE COMMAND CENTER (Geospatial Simulation)
          ============================================ */}
      <section id="command-center" className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(45,53,136,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(45,53,136,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-bold mb-6 border border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                LIVE MONITORING
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Pemantauan <span className="text-[#F6841F]">Geospasial</span> Real-time
              </h2>
              <p className="text-lg text-white/60">
                Command Center terintegrasi memantau seluruh titik perlintasan dalam satu dashboard.
              </p>
            </div>
          </FadeInUp>

          {/* Map Simulation Container */}
          <FadeInUp delay={200}>
            <div className="relative max-w-5xl mx-auto">
              {/* Map Frame */}
              <div className="relative bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
                {/* Map Header Bar */}
                <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-slate-400 text-sm font-mono ml-4">command.aeonrailguard.id/live</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400 text-sm font-mono">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    CONNECTED
                  </div>
                </div>

                {/* Map Area */}
                <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                  {/* Simulated Map Background with Railway Lines */}
                  <div className="absolute inset-0">
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                      backgroundSize: '40px 40px'
                    }} />

                    {/* Railway Lines SVG */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M 5 70 Q 25 50 45 45 T 95 25" stroke="#2D3588" strokeWidth="0.5" fill="none" strokeDasharray="2,1" opacity="0.6" />
                      <path d="M 10 85 Q 35 65 55 55 T 90 40" stroke="#2D3588" strokeWidth="0.5" fill="none" strokeDasharray="2,1" opacity="0.6" />
                      <path d="M 0 50 Q 30 45 50 50 T 100 55" stroke="#F6841F" strokeWidth="0.8" fill="none" opacity="0.4" />
                    </svg>
                  </div>

                  {/* Pulsing Sensor Dots */}
                  {/* Dot 1: Safe - Green */}
                  <motion.div
                    className="absolute top-[30%] left-[20%]"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="relative">
                      <div className="absolute -inset-4 bg-green-500/30 rounded-full animate-ping" />
                      <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg shadow-green-500/50" />
                    </div>
                  </motion.div>

                  {/* Dot 2: Safe - Green */}
                  <motion.div
                    className="absolute top-[45%] left-[40%]"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  >
                    <div className="relative">
                      <div className="absolute -inset-4 bg-green-500/30 rounded-full animate-ping" />
                      <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg shadow-green-500/50" />
                    </div>
                  </motion.div>

                  {/* Dot 3: Warning - Yellow */}
                  <motion.div
                    className="absolute top-[55%] left-[60%]"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="relative">
                      <div className="absolute -inset-4 bg-yellow-500/30 rounded-full animate-ping" />
                      <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50" />
                    </div>
                  </motion.div>

                  {/* Dot 4: Danger - Red (Pulsing Faster) */}
                  <motion.div
                    className="absolute top-[35%] right-[25%]"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="relative">
                      <div className="absolute -inset-6 bg-red-500/40 rounded-full animate-ping" />
                      <div className="absolute -inset-3 bg-red-500/30 rounded-full animate-pulse" />
                      <div className="w-5 h-5 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
                    </div>
                  </motion.div>

                  {/* Dot 5: Safe - Green */}
                  <motion.div
                    className="absolute bottom-[30%] left-[75%]"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <div className="relative">
                      <div className="absolute -inset-4 bg-green-500/30 rounded-full animate-ping" />
                      <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg shadow-green-500/50" />
                    </div>
                  </motion.div>

                  {/* Train Icon Moving */}
                  <motion.div
                    className="absolute top-[50%] left-[30%]"
                    animate={{ x: [0, 100, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="bg-[#2D3588] text-white px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
                      <Train className="w-4 h-4" />
                      <span className="text-xs font-bold">KA-72</span>
                    </div>
                  </motion.div>

                  {/* Floating Status Card */}
                  <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-md rounded-xl p-4 border border-slate-700 shadow-xl min-w-[200px]">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-bold">Status Sistem</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Unit Aktif</span>
                        <span className="text-lg font-black text-green-400">12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Waspada</span>
                        <span className="text-lg font-black text-yellow-400">1</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Bahaya</span>
                        <span className="text-lg font-black text-red-400">1</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span className="font-mono">Live • 14:32:08 WIB</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Legend */}
                  <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-md rounded-xl p-4 border border-slate-700">
                    <div className="flex items-center gap-6 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-slate-300">Aman</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span className="text-slate-300">Waspada</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-slate-300">Bahaya</span>
                      </div>
                    </div>
                  </div>

                  {/* Alert Popup (Danger Zone) */}
                  <motion.div
                    className="absolute top-[25%] right-[20%]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <div className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-xl border border-red-400">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-bold">JPL 105 - 2 Objek Terdeteksi!</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Bottom Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
                  <div className="text-2xl font-black text-white">24</div>
                  <div className="text-xs text-slate-400">CCTV Online</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
                  <div className="text-2xl font-black text-green-400">98.7%</div>
                  <div className="text-xs text-slate-400">Uptime</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
                  <div className="text-2xl font-black text-[#F6841F]">156</div>
                  <div className="text-xs text-slate-400">Deteksi Hari Ini</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
                  <div className="text-2xl font-black text-blue-400">3</div>
                  <div className="text-xs text-slate-400">Kereta Aktif</div>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ============================================
          SECTION 10: ABOUT THE PROJECT
          ============================================ */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-50 to-transparent opacity-50" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Text */}
            <FadeInUp>
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-6">
                    <Shield className="w-4 h-4" />
                    TENTANG PROYEK
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                    Apa itu<br /><span className="text-[#2D3588]">Aeon RailGuard?</span>
                  </h2>
                </div>

                <p className="text-lg text-slate-600 leading-relaxed">
                  <strong className="text-slate-900">Aeon RailGuard</strong> adalah sistem keselamatan berbasis <span className="text-[#F6841F] font-semibold">Optoelectronic Thermal Imaging</span> dan <span className="text-[#2D3588] font-semibold">Machine Learning</span> yang terintegrasi dengan Automatic Train Control (ATC).
                </p>

                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
                  <p className="text-slate-700 leading-relaxed">
                    Kami mendeteksi bahaya secara <strong>multimodal (optik & termal)</strong> untuk menginisiasi <strong>pengereman otomatis (stepwise braking)</strong> pada jarak <span className="text-[#F6841F] font-black text-xl">3 KM</span>.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Thermal + RGB</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">AI Detection</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Train className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">ATC Integration</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Siren className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Auto Brake</span>
                  </div>
                </div>
              </div>
            </FadeInUp>

            {/* Right: 3D Shield */}
            <FadeInUp delay={200}>
              <div className="relative flex items-center justify-center">
                <div className="relative w-72 h-72 md:w-80 md:h-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2D3588]/20 to-[#F6841F]/20 rounded-full blur-3xl" />
                  <div className="relative w-full h-full bg-gradient-to-br from-[#2D3588] to-[#1a2057] rounded-[4rem] flex items-center justify-center shadow-2xl">
                    <div className="absolute inset-4 bg-gradient-to-br from-white/10 to-transparent rounded-[3rem]" />
                    <div className="relative">
                      <Shield className="w-28 h-28 text-white/90" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Cpu className="w-10 h-10 text-[#F6841F]" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-bounce">
                    <Eye className="w-7 h-7 text-[#2D3588]" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-[#F6841F] rounded-2xl shadow-xl flex items-center justify-center animate-pulse">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 10: MEET THE TEAM
          ============================================ */}
      <section id="team" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-6">
                <Users className="w-4 h-4" />
                TIM KAMI
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                Di Balik <span className="text-[#2D3588]">Teknologi</span>
              </h2>
              <p className="text-lg text-slate-600">Tim muda berdedikasi untuk keselamatan transportasi Indonesia.</p>
            </div>
          </FadeInUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <FadeInUp delay={100}>
              <TeamCard name="Dedy Setiadi" role="Project Lead & System Architect" tagline="The Hustler" color="blue" />
            </FadeInUp>
            <FadeInUp delay={200}>
              <TeamCard name="Sarah Putri" role="UI/UX & Frontend Engineer" tagline="The Hipster" color="pink" />
            </FadeInUp>
            <FadeInUp delay={300}>
              <TeamCard name="Budi Santoso" role="AI & Computer Vision Specialist" tagline="The Hacker" color="purple" />
            </FadeInUp>
            <FadeInUp delay={400}>
              <TeamCard name="Rizky Fauzan" role="IoT & Embedded Systems" tagline="The Hardware" color="orange" />
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 11: CONTACT & CONNECT
          ============================================ */}
      <section id="contact-cta" className="py-24 bg-gradient-to-br from-[#2D3588] to-[#1a2057] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <FadeInUp>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-sm font-bold mb-8 backdrop-blur-sm border border-white/20">
              <MessageCircle className="w-4 h-4" />
              HUBUNGI KAMI
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Tertarik <span className="text-[#F6841F]">Mengadopsi?</span>
            </h2>

            <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
              Tertarik mengadopsi teknologi Aeon RailGuard untuk keselamatan transportasi Anda?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-full shadow-xl shadow-green-500/30 hover:shadow-green-500/50 transition-all">
                <MessageCircle className="w-6 h-6" />
                Hubungi via WhatsApp
              </a>
              <a href="/proposal-aeon-railguard.pdf" download
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-lg font-semibold rounded-full border border-white/30 transition-all">
                <FileText className="w-6 h-6" />
                Unduh Proposal
              </a>
            </div>

            <div className="flex items-center justify-center gap-4">
              <a href="https://instagram.com/aeon.railguard" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors border border-white/20">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors border border-white/20">
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors border border-white/20">
                <Github className="w-5 h-5 text-white" />
              </a>
              <a href="mailto:team@aeonrailguard.id" className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors border border-white/20">
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
            <div className="mt-6 text-sm text-white/50">@aeon.railguard • team@aeonrailguard.id</div>
          </FadeInUp>
        </div>
      </section>

      {/* ============================================
          SECTION 12: FOOTER
          ============================================ */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-12 h-12 bg-white rounded-xl p-2">
                  <Image src="/images/logo Aeon.png" alt="AEON Logo" fill className="object-contain p-1" />
                </div>
                <div>
                  <div className="font-black text-xl tracking-tight">AEON RAILGUARD</div>
                  <div className="text-xs text-slate-400">by Team GenZ Jombang</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                <strong className="text-white">"Menjaga Nyawa, Mengamankan Aset."</strong>
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Navigasi</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-[#F6841F] transition-colors text-sm flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Beranda</a></li>
                <li><a href="#map" className="text-slate-400 hover:text-[#F6841F] transition-colors text-sm flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Live Map</a></li>
                <li><a href="#technology" className="text-slate-400 hover:text-[#F6841F] transition-colors text-sm flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Teknologi</a></li>
                <li><a href="#roadmap" className="text-slate-400 hover:text-[#F6841F] transition-colors text-sm flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Roadmap</a></li>
                <li><Link href="/login" className="text-slate-400 hover:text-[#F6841F] transition-colors text-sm flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Dashboard</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Kontak</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#F6841F] mt-0.5 flex-shrink-0" />
                  <span>Jombang, Jawa Timur<br />Indonesia</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#F6841F]" />
                  <span>team@aeonrailguard.id</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#F6841F]" />
                  <span>+62 812 xxxx xxxx</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Partners */}
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Didukung Oleh</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                    <Image src="/images/logo kai.jpg" alt="KAI" width={32} height={32} className="object-contain" />
                  </div>
                  <span className="text-sm text-slate-300">PT Kereta Api Indonesia</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-slate-300">Ekraf Tech Summit</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-slate-300">Kemenhub RI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-slate-500 text-sm text-center md:text-left">
                © 2025 <span className="text-white font-semibold">Team GenZ AI Jombang</span>. Hak Cipta Dilindungi.
              </div>
              <div className="flex items-center gap-6 text-slate-400 text-xs">
                <span className="flex items-center gap-2">🇮🇩 Produk Anak Bangsa</span>
                <span className="text-slate-600">|</span>
                <span className="font-mono">v2.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

