'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Scan, Lock, User, ChevronRight, Fingerprint, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  // States: 'initializing' | 'scanning' | 'form'
  const [state, setState] = useState<'initializing' | 'scanning' | 'form'>('initializing');
  const [router] = [useRouter()]; // Standard next/navigation router

  useEffect(() => {
    // Sequence timer
    const initTimer = setTimeout(() => {
      setState('scanning');
    }, 2000); // 2 seconds initialization

    const scanTimer = setTimeout(() => {
      setState('form');
    }, 5500); // 3.5 seconds scanning

    return () => {
      clearTimeout(initTimer);
      clearTimeout(scanTimer);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and push to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-cyan-900/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-blue-900/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">

          {/* STATE 1: INITIALIZING */}
          {state === 'initializing' && (
            <motion.div
              key="init"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-6"
            >
              <div className="relative w-24 h-24 mx-auto">
                <motion.div
                  className="absolute inset-0 border-4 border-t-cyan-500 border-r-transparent border-b-cyan-700 border-l-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-4 bg-slate-900 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-cyan-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-mono text-cyan-400 tracking-widest">SYSTEM BOOT</h2>
                <p className="text-xs text-slate-500 font-mono">INITIALIZING SECURITY PROTOCOLS...</p>
              </div>
            </motion.div>
          )}

          {/* STATE 2: BIOMETRIC SCAN */}
          {state === 'scanning' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              className="text-center bg-slate-900/50 p-8 rounded-2xl border border-cyan-500/30 backdrop-blur-md"
            >
              <div className="relative w-full h-48 bg-slate-950 rounded-xl mb-6 overflow-hidden border border-slate-800 flex items-center justify-center">
                <Fingerprint className="w-24 h-24 text-slate-800" />

                {/* Scanning Bar */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-1 bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.8)] z-10"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  className="absolute inset-0 bg-cyan-500/5 z-0"
                  animate={{ opacity: [0, 0.2, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>

              <h2 className="text-2xl font-bold mb-2 text-white">BIOMETRIC SCAN</h2>
              <p className="text-sm text-cyan-400 font-mono animate-pulse">VERIFYING IDENTITY...</p>
            </motion.div>
          )}

          {/* STATE 3: LOGIN FORM */}
          {state === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/10 mb-4">
                  <Scan className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Access Control</h2>
                <p className="text-slate-500 text-sm mt-1">Authorized personnel only</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Officer ID</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-700"
                      placeholder="AEON-8821"
                      defaultValue="ADM-001"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Passcode</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-700"
                      placeholder="••••••••"
                      defaultValue="password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
                >
                  AUTHENTICATE <ChevronRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">
                <AlertCircle className="w-3 h-3" />
                <span>Secure connection established via TLS 1.3</span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
