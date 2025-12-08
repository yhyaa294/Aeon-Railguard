'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8">
            <Image 
              src="/images/logo Aeon.png" 
              alt="Aeon Logo" 
              fill 
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className={`font-black text-lg leading-none tracking-tight ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
              AEON RAILGUARD
            </span>
            <span className="text-[10px] font-bold text-[#F6841F] tracking-[0.2em] uppercase">
              By Team GenZ
            </span>
          </div>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center gap-8">
          <NavLink href="#ecosystem" onClick={(e) => scrollToSection(e, 'ecosystem')} isScrolled={isScrolled}>Ekosistem</NavLink>
          <NavLink href="#technology" onClick={(e) => scrollToSection(e, 'technology')} isScrolled={isScrolled}>Teknologi</NavLink>
          <NavLink href="#roadmap" onClick={(e) => scrollToSection(e, 'roadmap')} isScrolled={isScrolled}>Peta Jalan</NavLink>
          <NavLink href="#contact" onClick={(e) => scrollToSection(e, 'contact')} isScrolled={isScrolled}>Kontak</NavLink>
        </div>

        {/* ACTION BUTTON */}
        <div className="hidden lg:flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="px-6 py-2.5 bg-gradient-to-r from-[#F6841F] to-[#ff9f4d] hover:from-[#e07010] hover:to-[#ff8c2b] text-white text-sm font-bold rounded-full shadow-lg hover:shadow-orange-500/25 transition-all flex items-center gap-2"
            >
              Live Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          className={`lg:hidden ${isScrolled ? 'text-slate-900' : 'text-white'}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-8 h-8" />
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl p-6 flex flex-col gap-4">
          <MobileLink href="#ecosystem" onClick={(e) => scrollToSection(e, 'ecosystem')}>Ekosistem</MobileLink>
          <MobileLink href="#technology" onClick={(e) => scrollToSection(e, 'technology')}>Teknologi</MobileLink>
          <MobileLink href="#roadmap" onClick={(e) => scrollToSection(e, 'roadmap')}>Peta Jalan</MobileLink>
          <MobileLink href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>Kontak</MobileLink>
          <hr className="border-slate-100" />
          <Link href="/dashboard" className="w-full text-center py-3 bg-[#F6841F] text-white font-bold rounded-lg">
            Live Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children, isScrolled, onClick }: { href: string, children: React.ReactNode, isScrolled: boolean, onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <a 
      href={href} 
      onClick={onClick}
      className={`text-sm font-medium transition-colors hover:text-[#F6841F] ${isScrolled ? 'text-slate-600' : 'text-white/90 hover:text-white'}`}
    >
      {children}
    </a>
  );
}

function MobileLink({ href, children, onClick }: { href: string, children: React.ReactNode, onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <a 
      href={href} 
      onClick={onClick}
      className="text-base font-bold text-slate-700 py-2 border-b border-slate-50 last:border-0"
    >
      {children}
    </a>
  );
}
