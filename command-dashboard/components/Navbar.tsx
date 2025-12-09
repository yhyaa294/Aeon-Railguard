'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO (LEFT) */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 bg-white rounded-xl shadow-md p-1.5 group-hover:shadow-lg transition-shadow">
            <Image 
              src="/images/logo Aeon.png" 
              alt="Aeon Logo" 
              fill 
              className="object-contain p-0.5"
            />
          </div>
          <div className="flex flex-col">
            <span className={`font-black text-base leading-none tracking-tight transition-colors ${
              isScrolled ? 'text-slate-900' : 'text-white'
            }`}>
              AEON RAILGUARD
            </span>
            <span className={`text-[10px] font-medium tracking-wider transition-colors ${
              isScrolled ? 'text-slate-500' : 'text-white/70'
            }`}>
              Railway Safety System
            </span>
          </div>
        </Link>

        {/* LINKS (CENTER) - Apple Style */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 backdrop-blur-sm rounded-full px-2 py-1.5">
          <NavPill href="#map" onClick={(e) => scrollToSection(e, 'map')} isScrolled={isScrolled}>
            <MapPin className="w-3.5 h-3.5" />
            Peta Live
          </NavPill>
          <NavPill href="#problem" onClick={(e) => scrollToSection(e, 'problem')} isScrolled={isScrolled}>
            Masalah
          </NavPill>
          <NavPill href="#solution" onClick={(e) => scrollToSection(e, 'solution')} isScrolled={isScrolled}>
            Solusi
          </NavPill>
          <NavPill href="#technology" onClick={(e) => scrollToSection(e, 'technology')} isScrolled={isScrolled}>
            Teknologi
          </NavPill>
          <NavPill href="#roadmap" onClick={(e) => scrollToSection(e, 'roadmap')} isScrolled={isScrolled}>
            Roadmap
          </NavPill>
        </div>

        {/* CTA BUTTON (RIGHT) */}
        <div className="hidden lg:flex items-center gap-3">
          <Link 
            href="/login"
            className="group px-5 py-2.5 bg-[#F6841F] hover:bg-[#e07010] text-white text-sm font-bold rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center gap-2"
          >
            Live Dashboard 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            isScrolled ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU - Slide Down */}
      <div className={`lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl transition-all duration-300 overflow-hidden ${
        isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-6 flex flex-col gap-2">
          <MobileLink href="#map" onClick={(e) => scrollToSection(e, 'map')}>
            <MapPin className="w-4 h-4" /> Peta Live
          </MobileLink>
          <MobileLink href="#problem" onClick={(e) => scrollToSection(e, 'problem')}>Masalah</MobileLink>
          <MobileLink href="#solution" onClick={(e) => scrollToSection(e, 'solution')}>Solusi</MobileLink>
          <MobileLink href="#technology" onClick={(e) => scrollToSection(e, 'technology')}>Teknologi</MobileLink>
          <MobileLink href="#roadmap" onClick={(e) => scrollToSection(e, 'roadmap')}>Roadmap</MobileLink>
          <hr className="border-slate-100 my-2" />
          <Link 
            href="/login" 
            className="w-full text-center py-3 bg-[#F6841F] text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            Live Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function NavPill({ href, children, onClick, isScrolled }: { 
  href: string, 
  children: React.ReactNode, 
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void,
  isScrolled: boolean 
}) {
  return (
    <a 
      href={href} 
      onClick={onClick}
      className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-[#F6841F] hover:bg-white rounded-full transition-all flex items-center gap-1.5"
    >
      {children}
    </a>
  );
}

function MobileLink({ href, children, onClick }: { 
  href: string, 
  children: React.ReactNode, 
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void 
}) {
  return (
    <a 
      href={href} 
      onClick={onClick}
      className="text-base font-semibold text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
    >
      {children}
    </a>
  );
}
