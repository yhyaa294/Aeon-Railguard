'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Activity,
  Eye,
  ArrowRight,
  Menu,
  Phone,
  FileText
} from 'lucide-react';

export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 100]); // Parallax effect for train

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-500/30">

      {/* 1. NAVBAR - Sticky, White, Shadow */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 bg-blue-900 rounded-md flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl text-blue-900 tracking-tight leading-none">AEON RAILGUARD</span>
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest leading-none mt-1">Safety First</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#">Technology</NavLink>
            <NavLink href="#">Daop Integration</NavLink>
            <NavLink href="#">Partners</NavLink>
            <Link
              href="/login"
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-md transition-colors shadow-lg shadow-orange-500/20 text-sm flex items-center gap-2"
            >
              Access Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu */}
          <button className="md:hidden text-blue-900">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION - Transparent Train Effect */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-100/50 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-900 text-xs font-bold rounded-full mb-6 border border-blue-200">
              OFFICIAL PARTNER OF SMART CITY INITIATIVE
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-blue-900 leading-[1.1] mb-6 tracking-tight">
              Transforming Railway Safety with <span className="text-orange-600">Artificial Intelligence.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
              Zero Latency. Zero Fatalities. Integrated with the National Smart Grid.
              We provide real-time hazard detection for Level Crossings (JPL).
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-blue-900 text-white font-bold rounded-md shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all transform hover:-translate-y-1">
                Explore Solution
              </button>
              <button className="px-8 py-4 bg-white text-blue-900 border border-slate-200 font-bold rounded-md hover:bg-slate-50 transition-all flex items-center gap-2">
                <FileText className="w-4 h-4" /> Download Whitepaper
              </button>
            </div>
          </motion.div>

          {/* Visual Trick: Transparent Train Parallax */}
          <div className="relative h-[400px] lg:h-[600px] w-full flex items-center justify-center">
            <motion.div
              style={{ y: heroY }}
              className="relative w-full h-full"
            >
              {/* Placeholder for the Train Image */}
              <div className="absolute right-[-50px] top-10 w-[120%] h-full z-10 pointer-events-none">
                {/* 
                         NOTE: This is where 'train-hero-transparent.png' would go. 
                         Using a placeholder styling if image is missing, but aiming for the <img> tag as requested.
                     */}
                <img
                  src="/images/train-hero-transparent.png"
                  alt="Modern Train"
                  className="w-full h-full object-contain object-right drop-shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML += `<div class="w-full h-full bg-gradient-to-r from-blue-200 to-blue-100 rounded-3xl flex items-center justify-center text-blue-900 font-bold opacity-50 border-4 border-white shadow-xl">Detailed Train Render Placeholder</div>`;
                  }}
                />
              </div>

              {/* Decorative Elements around image */}
              <div className="absolute top-1/2 right-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 right-20 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. STATS RIBBON - KAI Navy */}
      <section className="bg-blue-900 text-white py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-blue-800/50">
            <StatItem value="50ms" label="Response Time" />
            <StatItem value="99.9%" label="Detection Accuracy" />
            <StatItem value="Ready" label="For Daop 1-9 Integration" />
          </div>
        </div>
      </section>

      {/* 4. THE PROBLEM - Grid Layout */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Why Modernization is Critical</h2>
            <p className="text-slate-600 text-lg">
              Traditional level crossings rely on manual operation and limited visual range.
              Aeon RailGuard eliminates these vulnerabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProblemCard
              icon={<UserSlash />}
              title="Manual Error"
              desc="Human operators can fatigue or miss critical signals during high-traffic periods."
            />
            <ProblemCard
              icon={<EyeOff />}
              title="Blind Spots"
              desc="Physical obstructions and weather conditions limit visibility for traditional monitoring."
            />
            <ProblemCard
              icon={<ClockAlert />}
              title="Late Response"
              desc="Standard systems react after detection. We predict hazards before they reach the track."
            />
          </div>
        </div>
      </section>

      {/* 5. THE SOLUTION - Interactive Dashboard Mockup */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
                The Aeon Dashboard
              </h2>
              <div className="space-y-6">
                <SolutionPoint
                  title="Real-time Monitoring"
                  desc="Live video feed with bounding-box overlays for instant object recognition."
                />
                <SolutionPoint
                  title="Automatic Braking Signal"
                  desc="Direct integration with train signaling systems (ETCS Level 2 compatible)."
                />
                <SolutionPoint
                  title="Historical Analytics"
                  desc="Heatmaps and incident reporting for data-driven safety improvements."
                />
              </div>
              <button className="mt-8 text-orange-600 font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
                Learn about our architecture <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="lg:w-1/2 w-full">
              {/* Dashboard Mockup Placeholder */}
              <div className="relative rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden aspect-video group cursor-pointer">
                {/* Mockup Header */}
                <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                {/* Mockup Body */}
                <div className="p-6 h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 group-hover:bg-slate-100 transition-colors">
                  <Activity className="w-16 h-16 text-blue-900 mb-4 opacity-20" />
                  <p className="font-mono text-sm">INTERACTIVE DASHBOARD PREVIEW</p>
                </div>

                {/* Floating Elements */}
                <div className="absolute bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg border border-slate-100 animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-blue-900">SYSTEM NORMAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-blue-900 text-white py-16 border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="w-6 h-6 text-orange-500" />
                <span className="font-bold text-xl">AEON RAILGUARD</span>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed">
                Empowering national railways with cutting-edge AI surveillance technology.
                Built for safety, optimized for efficiency.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-orange-500">Platform</h4>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li><a href="#" className="hover:text-white">AI Engine</a></li>
                <li><a href="#" className="hover:text-white">Dashboard</a></li>
                <li><a href="#" className="hover:text-white">Mobile App</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-orange-500">Company</h4>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Government Relations</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-orange-500">Contact</h4>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +62 21 555 0199</li>
                <li>hq@aeonrailguard.id</li>
                <li>Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-blue-800 text-center text-blue-300 text-sm">
            &copy; 2025 AEON RAILGUARD. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Subcomponents for cleaner code
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-medium text-slate-600 hover:text-blue-900 transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
    </Link>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-6 flex flex-col items-center">
      <div className="text-4xl md:text-5xl font-black text-orange-500 mb-2">{value}</div>
      <div className="text-blue-200 font-medium text-sm md:text-base uppercase tracking-wider">{label}</div>
    </div>
  );
}

function ProblemCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 text-center group"
    >
      <div className="w-16 h-16 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-300">
        <div className="text-orange-600 group-hover:text-white transition-colors duration-300">
          {/* We clone the icon to add specific classes/sizes if needed, or just rely on parent styling */}
          <div className="w-8 h-8">{icon}</div>
        </div>
      </div>
      <h3 className="text-xl font-bold text-blue-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">
        {desc}
      </p>
    </motion.div>
  );
}

function SolutionPoint({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 min-w-[24px]">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-900">
          <ShieldCheck className="w-3 h-3" />
        </div>
      </div>
      <div>
        <h4 className="font-bold text-blue-900">{title}</h4>
        <p className="text-slate-600 text-sm">{desc}</p>
      </div>
    </div>
  );
}

// Icons needed for the problem section
function UserSlash(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /><line x1="17" y1="17" x2="22" y2="22" /><line x1="22" y1="17" x2="17" y2="22" /></svg>
}

function EyeOff(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.44 0 .87-.03 1.28-.09" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
}

function ClockAlert(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" /><path d="M16 16l2 2" /><path d="M16 20l2-2" /></svg>
}

