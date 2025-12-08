import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-slate-950 selection:bg-cyan-500/30">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-radial from-slate-900/0 via-slate-950/80 to-slate-950 pointer-events-none"></div>
      
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse-fast"></div>
      <div className="absolute top-1/2 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-spin-slow origin-center"></div>

      <div className="z-10 text-center max-w-5xl px-6">
        <div className="mb-8 inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-lg shadow-black/50">
          <span className="relative flex h-2 w-2 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">System Online // v2.0.4</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-8 leading-tight">
          Rail Safety <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 text-glow">
            Revolutionized with AI
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed border-l-2 border-slate-800 pl-6 text-left md:text-center md:border-l-0 md:pl-0">
          Aeon RailGuard transforms standard CCTV into an intelligent, thermal-vision safety shield.
          Detect hazards instantly. Scale infinitely.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            href="/dashboard"
            className="group relative px-10 py-5 bg-cyan-500 text-slate-950 font-bold text-lg rounded-sm overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] clip-path-button"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
            <span className="relative flex items-center gap-3">
              INITIALIZE DASHBOARD
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </span>
          </Link>

          <Link 
            href="/login"
            className="px-10 py-5 rounded-sm border border-slate-700 text-slate-300 hover:bg-slate-800/80 hover:text-white hover:border-slate-500 transition-all backdrop-blur-sm"
          >
            SECURE LOGIN
          </Link>
        </div>
      </div>

      {/* Footer Stats Strip */}
      <div className="absolute bottom-0 w-full border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800/50">
          <div>
            <div className="text-3xl font-mono font-bold text-white">99.9%</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-mono font-bold text-cyan-400 text-glow">
              &lt; 50ms
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Latency</div>
          </div>
          <div>
            <div className="text-3xl font-mono font-bold text-white">3,000+</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Nodes Active</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-sm font-bold text-green-400 tracking-widest">SECURE</span>
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Network Status</div>
          </div>
        </div>
      </div>
    </main>
  );
}
