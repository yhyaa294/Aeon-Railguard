'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg shadow-black/5 transition-all duration-300">
      <div className="mx-auto px-6 h-14 flex items-center justify-between">
        
        {/* LOGO (LEFT) */}
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
            <span className="font-black text-base leading-none tracking-tight text-white drop-shadow-md">
              AEON RAILGUARD
            </span>
          </div>
        </Link>

        {/* LINKS (CENTER) */}
        <div className="hidden lg:flex items-center gap-8">
          <NavLink href="#problem" onClick={(e) => scrollToSection(e, 'problem')}>Masalah</NavLink>
          <NavLink href="#solution" onClick={(e) => scrollToSection(e, 'solution')}>Solusi</NavLink>
          <NavLink href="#technology" onClick={(e) => scrollToSection(e, 'technology')}>Teknologi</NavLink>
          <NavLink href="#roadmap" onClick={(e) => scrollToSection(e, 'roadmap')}>Roadmap</NavLink>
        </div>

        {/* BUTTON (RIGHT) */}
        <div className="hidden lg:flex items-center gap-4">
            <Link 
              href="/login"
              className="px-6 py-2.5 bg-gradient-to-r from-[#F6841F] to-[#ff9f4d] hover:from-[#e07010] hover:to-[#ff8c2b] text-white text-sm font-bold rounded-full shadow-lg hover:shadow-orange-500/25 transition-all flex items-center gap-2"
            >
              Akses Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          className="lg:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-100 shadow-xl p-6 flex flex-col gap-4">
          <MobileLink href="#problem" onClick={(e) => scrollToSection(e, 'problem')}>Masalah</MobileLink>
          <MobileLink href="#solution" onClick={(e) => scrollToSection(e, 'solution')}>Solusi</MobileLink>
          <MobileLink href="#technology" onClick={(e) => scrollToSection(e, 'technology')}>Teknologi</MobileLink>
          <MobileLink href="#roadmap" onClick={(e) => scrollToSection(e, 'roadmap')}>Roadmap</MobileLink>
          <hr className="border-slate-100" />
          <Link href="/login" className="w-full text-center py-3 bg-[#F6841F] text-white font-bold rounded-lg">
            Akses Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children, onClick }: { href: string, children: React.ReactNode, onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <a 
      href={href} 
      onClick={onClick}
      className="text-sm font-medium text-white/90 hover:text-[#F6841F] transition-colors drop-shadow-sm"
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
