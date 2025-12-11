'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ChevronDown, Building2, MapPin, Shield, Train, Loader2, KeyRound } from 'lucide-react';

// ========= HARDCODED DATA =========
const daopOptions = [
  { id: 'DAOP7', name: 'DAOP 7 - Madiun' },
];

const stasiunOptions = [
  { id: 'PTRN', name: 'Stasiun Peterongan', daopId: 'DAOP7' },
];

const jplOptions = [
  { id: 'JPL-102', name: 'JPL 102 - Kebun Melati' },
  { id: 'JPL-201', name: 'JPL 201 - Sumbermulyo' },
  { id: 'JPL-305', name: 'JPL 305 - Ngembe' },
  { id: 'JPL-410', name: 'JPL 410 - Rejoso' },
];

type RoleType = 'admin' | 'operator' | null;

export default function HierarchyLoginPage() {
  const router = useRouter();

  // ========= FORM STATE =========
  const [selectedDaop, setSelectedDaop] = useState('');
  const [selectedStasiun, setSelectedStasiun] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleType>(null);
  const [selectedJpl, setSelectedJpl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // ========= AUTO SKIP INTRO =========
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // ========= FORM VALIDATION =========
  const isFormValid = 
    selectedDaop && 
    selectedStasiun && 
    selectedRole && 
    (selectedRole === 'admin' || (selectedRole === 'operator' && selectedJpl)) &&
    username && 
    password &&
    authCode;

  // ========= HANDLE LOGIN =========
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Store user session to localStorage
    const userSession = {
      daop: daopOptions.find(d => d.id === selectedDaop)?.name || selectedDaop,
      stasiun: stasiunOptions.find(s => s.id === selectedStasiun)?.name || selectedStasiun,
      role: selectedRole,
      jpl: selectedRole === 'operator' ? jplOptions.find(j => j.id === selectedJpl)?.name : null,
      jplId: selectedRole === 'operator' ? selectedJpl : null,
      username,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem('aeon_session', JSON.stringify(userSession));
    
    setIsLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#2D2A70] via-[#1a1850] to-[#0f0d30]" />

      {/* ========= INTRO OVERLAY ========= */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Image src="/images/logo Aeon.png" alt="Aeon" width={120} height={120} />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#2D2A70] mt-6">AEON RAILGUARD</h2>
            <p className="text-slate-500 text-sm mt-2">Sistem Keamanan Perlintasan Kereta Api</p>
            <div className="flex items-center gap-2 text-[#DA5525] mt-6">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Memuat...</span>
            </div>
            <button 
              onClick={() => setShowIntro(false)}
              className="mt-8 text-sm text-slate-400 hover:text-[#DA5525] transition"
            >
              Skip Intro →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========= MAIN CONTENT: SPLIT LAYOUT ========= */}
      <div className="relative z-10 min-h-screen flex">
        
        {/* LEFT SIDE: Info & Image */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12 relative">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image 
              src="/images/stasiun.png" 
              alt="Stasiun" 
              fill 
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2D2A70]/80 to-transparent" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 max-w-md text-white">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white rounded-2xl p-3 shadow-lg">
                <Image src="/images/logo Aeon.png" alt="Aeon" width={50} height={50} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">AEON</h1>
                <p className="text-[#DA5525] font-bold text-sm">RAILGUARD</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-black leading-tight mb-6">
              Sistem Pemantauan<br />
              <span className="text-[#DA5525]">Perlintasan Kereta Api</span>
            </h2>
            
            <p className="text-white/80 leading-relaxed mb-8">
              Platform monitoring berbasis AI untuk pengawasan perlintasan sebidang dan jalur ilegal. 
              Mendeteksi objek secara real-time dan mengirim sinyal darurat ke lokomotif dalam hitungan milidetik.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#DA5525]/20 rounded-lg flex items-center justify-center text-[#DA5525]">🎯</div>
                <div>
                  <p className="font-bold">Deteksi Real-Time</p>
                  <p className="text-sm text-white/60">YOLOv8 dengan inferensi &lt;50ms</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#DA5525]/20 rounded-lg flex items-center justify-center text-[#DA5525]">🚨</div>
                <div>
                  <p className="font-bold">Sinyal Darurat</p>
                  <p className="text-sm text-white/60">Kirim stop signal ke lokomotif</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#DA5525]/20 rounded-lg flex items-center justify-center text-[#DA5525]">📊</div>
                <div>
                  <p className="font-bold">Multi-Location</p>
                  <p className="text-sm text-white/60">Pantau banyak titik sekaligus</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-md"
          >
            {/* Card */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-[#2D2A70] to-[#1a1850] p-6 text-center lg:hidden">
                <div className="flex justify-center mb-3">
                  <div className="bg-white rounded-2xl p-2 shadow-lg">
                    <Image src="/images/logo Aeon.png" alt="Aeon" width={40} height={40} />
                  </div>
                </div>
                <h1 className="text-xl font-black text-white">MASUK SISTEM</h1>
              </div>
              
              <div className="hidden lg:block p-6 border-b">
                <h1 className="text-2xl font-black text-[#2D2A70]">Masuk Sistem</h1>
                <p className="text-slate-500 text-sm mt-1">Command Center - Aeon RailGuard</p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="p-6 space-y-4">
                
                {/* LEVEL 1: DAOP */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-[#2D2A70] mb-1.5 uppercase tracking-wider">
                    <Building2 size={14} />
                    Daerah Operasi
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDaop}
                      onChange={(e) => {
                        setSelectedDaop(e.target.value);
                        setSelectedStasiun('');
                        setSelectedRole(null);
                        setSelectedJpl('');
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#DA5525] text-sm"
                    >
                      <option value="">-- Pilih DAOP --</option>
                      {daopOptions.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  </div>
                </div>

                {/* LEVEL 2: STASIUN */}
                {selectedDaop && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="flex items-center gap-2 text-xs font-bold text-[#2D2A70] mb-1.5 uppercase tracking-wider">
                      <Train size={14} />
                      Stasiun Induk
                    </label>
                    <div className="relative">
                      <select
                        value={selectedStasiun}
                        onChange={(e) => {
                          setSelectedStasiun(e.target.value);
                          setSelectedRole(null);
                          setSelectedJpl('');
                        }}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#DA5525] text-sm"
                      >
                        <option value="">-- Pilih Stasiun --</option>
                        {stasiunOptions.filter(s => s.daopId === selectedDaop).map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    </div>
                  </motion.div>
                )}

                {/* LEVEL 3: ROLE */}
                {selectedStasiun && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="flex items-center gap-2 text-xs font-bold text-[#2D2A70] mb-2 uppercase tracking-wider">
                      <Shield size={14} />
                      Peran Anda
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => { setSelectedRole('admin'); setSelectedJpl(''); }}
                        className={`p-3 rounded-lg border-2 text-center transition-all text-sm ${
                          selectedRole === 'admin' 
                            ? 'border-[#DA5525] bg-[#DA5525]/10 text-[#DA5525]' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <div className="text-xl mb-1">🏢</div>
                        <div className="font-bold text-xs">Admin Stasiun</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole('operator')}
                        className={`p-3 rounded-lg border-2 text-center transition-all text-sm ${
                          selectedRole === 'operator' 
                            ? 'border-[#DA5525] bg-[#DA5525]/10 text-[#DA5525]' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <div className="text-xl mb-1">🚦</div>
                        <div className="font-bold text-xs">Operator JPL</div>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* LEVEL 4: JPL */}
                {selectedRole === 'operator' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="flex items-center gap-2 text-xs font-bold text-[#2D2A70] mb-1.5 uppercase tracking-wider">
                      <MapPin size={14} />
                      Pos Penjagaan
                    </label>
                    <div className="relative">
                      <select
                        value={selectedJpl}
                        onChange={(e) => setSelectedJpl(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#DA5525] text-sm"
                      >
                        <option value="">-- Pilih Pos JPL --</option>
                        {jplOptions.map((j) => (
                          <option key={j.id} value={j.id}>{j.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    </div>
                  </motion.div>
                )}

                {/* CREDENTIALS */}
                {(selectedRole === 'admin' || (selectedRole === 'operator' && selectedJpl)) && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 pt-3 border-t border-slate-200">
                    {/* Username */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-[#2D2A70] mb-1.5 uppercase tracking-wider">
                        <User size={14} />
                        Username / NIPP
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Masukkan username"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA5525] text-sm"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-[#2D2A70] mb-1.5 uppercase tracking-wider">
                        <Lock size={14} />
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA5525] text-sm"
                      />
                    </div>

                    {/* Auth Code */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-[#2D2A70] mb-1.5 uppercase tracking-wider">
                        <KeyRound size={14} />
                        Kode Autentifikasi
                      </label>
                      <input
                        type="text"
                        value={authCode}
                        onChange={(e) => setAuthCode(e.target.value.toUpperCase())}
                        placeholder="Masukkan 6-digit kode"
                        maxLength={6}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA5525] text-sm font-mono tracking-widest text-center"
                      />
                      <p className="text-xs text-slate-400 mt-1 text-center">Kode dikirim via WhatsApp ke nomor terdaftar</p>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!isFormValid || isLoading}
                      className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 mt-4 ${
                        isFormValid && !isLoading
                          ? 'bg-gradient-to-r from-[#DA5525] to-[#c44a1f] hover:shadow-lg hover:scale-[1.02]'
                          : 'bg-slate-300 cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> MEMVERIFIKASI...</>
                      ) : (
                        <>🚀 MASUK SISTEM</>
                      )}
                    </button>
                  </motion.div>
                )}

              </form>

              {/* Footer */}
              <div className="bg-slate-50 px-6 py-3 border-t text-center">
                <p className="text-xs text-slate-500">
                  © 2025 <span className="font-bold text-[#DA5525]">GenZ AI Berdampak</span> • Aeon RailGuard
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
