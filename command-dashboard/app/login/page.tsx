'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Key, ShieldAlert, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validation and API call would go here
    console.log('Logging in with:', { email, password, accessCode });
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      
      {/* LEFT SIDE: Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-slate-900/10 z-10" />
        <img 
          src="/images/stasiun.png" 
          alt="Station Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-10 left-10 z-20 text-white max-w-lg">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-md">Keamanan & Efisiensi</h2>
          <p className="text-lg opacity-90 drop-shadow-sm">
            Sistem pemantauan terpadu untuk keselamatan perlintasan kereta api.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header Logos & Warning */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-6 mb-8">
              <img
                src="/images/logo%20Aeon.png"
                alt="Aeon Railguard Logo"
                className="h-12 w-auto object-contain"
              />
              <div className="h-8 w-px bg-slate-300" />
              <img
                src="/images/logo%20kai.jpg"
                alt="PT KAI Logo"
                className="h-12 w-auto object-contain mix-blend-multiply"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full text-red-600 text-sm font-bold tracking-wide">
              <ShieldAlert className="w-4 h-4" />
              AKSES TERBATAS
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-800">Selamat Datang</h2>
              <p className="text-slate-500 mt-2">Silakan masuk untuk mengakses Command Dashboard.</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6 mt-8">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Email Institusi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D3588] focus:border-transparent transition-all"
                  placeholder="nama@kai.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D3588] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Access Code Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Kode Akses Otoritas</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D3588] focus:border-transparent transition-all"
                  placeholder="Cth: AUTH-8821-X"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#2D3588] hover:bg-[#1a2055] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D3588] transition-all"
            >
              Masuk Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 mt-8">
            &copy; 2025 Aeon RailGuard. Sistem Terenkripsi End-to-End.
          </div>

        </div>
      </div>
    </div>
  );
}
