'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, MapPin, Lock, Shield, ArrowRight, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function CinematicLoginPage() {
  const router = useRouter();

  // Video intro state
  const [showIntro, setShowIntro] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Form state
  const [namaLengkap, setNamaLengkap] = useState('');
  const [email, setEmail] = useState('');
  const [idStasiun, setIdStasiun] = useState('');
  const [password, setPassword] = useState('');
  const [kodeOtoritas, setKodeOtoritas] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Detect DAOP from station ID
  const detectedDaop = idStasiun.toUpperCase().startsWith('JBG') ? 'DAOP 7 MADIUN' :
    idStasiun.toUpperCase().startsWith('SMT') ? 'DAOP 4 SEMARANG' :
      idStasiun.toUpperCase().startsWith('SBI') ? 'DAOP 8 SURABAYA' :
        idStasiun.toUpperCase().startsWith('BD') ? 'DAOP 2 BANDUNG' :
          idStasiun.toUpperCase().startsWith('YK') ? 'DAOP 6 YOGYAKARTA' :
            null;

  // Handle video end or error - skip intro
  const handleVideoEnd = () => {
    setShowIntro(false);
  };

  const handleVideoError = () => {
    setShowIntro(false);
  };

  // Fallback timeout: skip intro after 10 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (showIntro) {
        setShowIntro(false);
      }
    }, 10000);
    return () => clearTimeout(timeout);
  }, [showIntro]);

  // Handle form submission (Demo Mode - No real authentication)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    // Simulate loading for demo effect
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Demo mode: Accept any credentials
    console.log('Login attempt:', { namaLengkap, email, idStasiun, kodeOtoritas });

    // Store user info in localStorage for demo
    localStorage.setItem('aeon_user', JSON.stringify({
      nama: namaLengkap,
      email: email,
      stasiun: idStasiun,
      daop: detectedDaop || 'DAOP 7 MADIUN'
    }));

    setIsLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-900">

      {/* === VIDEO INTRO OVERLAY (WHITE BACKGROUND) === */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center"
          >
            {/* Video Container with Shadow Frame */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-4 border border-slate-200">
              <video
                ref={videoRef}
                src="/videos/video%20logo.mp4"
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
                onError={handleVideoError}
                className="w-80 h-auto object-contain rounded-lg"
              />
            </div>

            {/* Loading Text Below Video */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center w-80"
            >
              <h2 className="text-2xl font-bold text-[#2D2A70] mb-2">AEON RAILGUARD</h2>
              <p className="text-slate-500 text-sm mb-4">Sistem Keamanan Perlintasan Kereta Api</p>

              {/* Loading Progress */}
              <div className="flex items-center justify-center gap-3 text-[#DA5525] mb-4">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Memuat Sistem...</span>
              </div>

              {/* Loading Bar - Animated 0% to 100% */}
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-[#DA5525] to-orange-400 rounded-full"
                />
              </div>

              {/* Version */}
              <p className="text-slate-400 text-xs mt-4 font-mono">v2.0.0 | Command Center</p>
            </motion.div>

            {/* Skip Button */}
            <button
              onClick={handleVideoEnd}
              className="absolute bottom-8 right-8 px-4 py-2 bg-[#2D2A70] hover:bg-[#3d3a80] text-white text-sm font-medium rounded-lg transition-all shadow-lg"
            >
              Skip Intro →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === MAIN LOGIN INTERFACE === */}
      <AnimatePresence>
        {!showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex min-h-screen w-full"
          >

            {/* LEFT SIDE: Station Image */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden">
              {/* Background Image */}
              <img
                src="/images/feed-track.jpg"
                alt="Station Background"
                className="w-full h-full object-cover"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/40" />

              {/* Branding Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-10 h-10 text-[#F6841F]" />
                    <span className="text-white/60 text-sm font-medium tracking-wider">SISTEM KEAMANAN TERPADU</span>
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                    Keamanan &<br />Efisiensi Maksimal
                  </h2>
                  <p className="text-white/80 text-lg max-w-md">
                    Sistem pemantauan AI terpadu untuk keselamatan perlintasan kereta api Indonesia.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* RIGHT SIDE: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
              <div className="w-full max-w-md space-y-8">

                {/* Header: Logos */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col items-center justify-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src="/images/logo%20Aeon.png"
                      alt="Aeon Logo"
                      className="h-10 w-auto object-contain"
                    />
                    <div className="h-8 w-px bg-slate-300" />
                    <img
                      src="/images/logo%20kai.jpg"
                      alt="KAI Logo"
                      className="h-10 w-auto object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* ERROR MESSAGE */}
                  {errorMsg && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm font-bold border border-red-200">
                      <AlertCircle className="w-4 h-4" />
                      {errorMsg}
                    </div>
                  )}
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <h1 className="text-2xl font-bold text-slate-800">Portal Otentikasi</h1>
                  <p className="text-slate-500 text-sm mt-1">Masukkan kredensial untuk mengakses Command Dashboard</p>
                </motion.div>

                {/* Form */}
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onSubmit={handleLogin}
                  className="space-y-5"
                >
                  {/* Nama Lengkap */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      Nama Lengkap Petugas
                    </label>
                    <input
                      type="text"
                      required
                      className="block w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D3588] focus:border-transparent transition-all"
                      placeholder="Masukkan nama lengkap"
                      value={namaLengkap}
                      onChange={(e) => setNamaLengkap(e.target.value)}
                    />
                  </div>

                  {/* Email Kedinasan */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      Email Kedinasan
                    </label>
                    <input
                      type="email"
                      required
                      className="block w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D3588] focus:border-transparent transition-all"
                      placeholder="nama.petugas@kai.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* ID Stasiun with DAOP Detection */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      ID Stasiun
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        className="block w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D3588] focus:border-transparent transition-all uppercase"
                        placeholder="Cth: JBG-001"
                        value={idStasiun}
                        onChange={(e) => setIdStasiun(e.target.value)}
                      />
                      {/* DAOP Detection Badge */}
                      <AnimatePresence>
                        {detectedDaop && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                              ✓ {detectedDaop}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Kata Sandi */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-400" />
                      Kata Sandi
                    </label>
                    <input
                      type="password"
                      required
                      className="block w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D3588] focus:border-transparent transition-all"
                      placeholder="••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {/* Kode Otoritas */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-slate-400" />
                      Kode Otoritas
                    </label>
                    <input
                      type="text"
                      required
                      className="block w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D3588] focus:border-transparent transition-all font-mono tracking-wider"
                      placeholder="AUTH-XXXX-XXXX"
                      value={kodeOtoritas}
                      onChange={(e) => setKodeOtoritas(e.target.value)}
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-[#2D3588] to-[#1a2055] hover:from-[#3a45a0] hover:to-[#2D3588] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D3588] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Scanning Biometrics...
                      </>
                    ) : (
                      <>
                        Verifikasi & Masuk
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </motion.form>

                {/* Footer Security Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center pt-6 border-t border-slate-100"
                >
                  <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                    <Lock className="w-3 h-3" />
                    256-bit SSL Encrypted Connection
                  </div>
                  <div className="text-xs text-slate-300 mt-2">
                    &copy; 2025 AEON RailGuard × PT Kereta Api Indonesia
                  </div>
                </motion.div>

              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
