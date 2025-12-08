export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="w-full max-w-md p-1 relative z-10">
        {/* Card Container with border gradient look */}
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-lg shadow-2xl overflow-hidden">
           {/* Top Bar Decoration */}
           <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
           
           <div className="p-8">
             <div className="text-center mb-8">
               <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 border border-slate-700 mb-4 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                 <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
               </div>
               <h2 className="text-2xl font-bold text-white tracking-tight">Access Control</h2>
               <p className="text-slate-500 text-sm mt-2 font-mono uppercase tracking-wider">Restricted Area // Auth Required</p>
             </div>

             <form className="space-y-6">
               <div>
                 <label htmlFor="id" className="block text-xs font-mono text-cyan-400 mb-2 uppercase tracking-widest">Operative ID</label>
                 <input 
                   type="text" 
                   id="id"
                   className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
                   placeholder="USR-7734-X"
                 />
               </div>
               
               <div>
                 <label htmlFor="key" className="block text-xs font-mono text-cyan-400 mb-2 uppercase tracking-widest">Security Key</label>
                 <input 
                   type="password" 
                   id="key"
                   className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
                   placeholder="••••••••••••"
                 />
               </div>

               <div className="flex items-center justify-between text-xs">
                 <label className="flex items-center text-slate-400 hover:text-slate-300 cursor-pointer">
                   <input type="checkbox" className="mr-2 accent-cyan-500 bg-slate-900 border-slate-700" />
                   Stay Connected
                 </label>
                 <a href="#" className="text-cyan-500 hover:text-cyan-400 transition-colors">Recover Access?</a>
               </div>

               <button 
                 type="button"
                 className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded transition-all hover:shadow-[0_0_20px_rgba(8,145,178,0.4)] flex items-center justify-center gap-2 group"
               >
                 AUTHENTICATE
                 <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
               </button>
             </form>
           </div>
           
           {/* Bottom Bar Details */}
           <div className="bg-slate-950/50 p-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-600 font-mono uppercase">
             <span>Aeon RailGuard Sys</span>
             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Node Secure</span>
           </div>
        </div>
      </div>
    </main>
  );
}
