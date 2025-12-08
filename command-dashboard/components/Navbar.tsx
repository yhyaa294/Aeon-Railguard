'use client';

import Link from 'next/link';
import { Menu, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">

                {/* LEFT: LOGO */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-3">
                        <img
                            src="/images/logo%20Aeon.png"
                            alt="Aeon Railguard Logo"
                            className="h-10 w-auto object-contain"
                        />
                        <div className="hidden lg:block">
                            <div className="font-black text-xl tracking-tight text-[#2D3588] leading-none">AEON RAILGUARD</div>
                            <div className="text-[10px] font-bold text-[#F6841F] tracking-[0.2em] uppercase">Safety Intelligence</div>
                        </div>
                    </Link>
                </div>

                {/* CENTER: NAVIGATION LINKS (EXPANDED) */}
                <div className="hidden lg:flex items-center gap-8">
                    <NavLink href="#hero">Beranda</NavLink>
                    <NavLink href="#about">Tentang Kami</NavLink>
                    <NavLink href="#technology">Teknologi AI</NavLink>
                    <NavLink href="#smart-city">Integrasi Smart City</NavLink>
                    <NavLink href="#case-studies">Studi Kasus</NavLink>
                    <NavLink href="#news">Berita</NavLink>
                </div>

                {/* RIGHT: CTA & HELP */}
                <div className="hidden lg:flex items-center gap-6">
                    <Link href="/help" className="text-sm font-semibold text-slate-500 hover:text-[#2D3588] transition-colors">
                        Pusat Bantuan
                    </Link>
                    <Link
                        href="/login"
                        className="px-6 py-2.5 bg-[#2D3588] hover:bg-[#1a2055] text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20 text-sm flex items-center gap-2"
                    >
                        Akses Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* MOBILE TOGGLE */}
                <button
                    className="lg:hidden text-[#2D3588]"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Menu className="w-8 h-8" />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t border-slate-200 px-6 py-6 space-y-4 shadow-xl">
                    <MobileNavLink href="#hero">Beranda</MobileNavLink>
                    <MobileNavLink href="#about">Tentang Kami</MobileNavLink>
                    <MobileNavLink href="#technology">Teknologi AI</MobileNavLink>
                    <MobileNavLink href="#smart-city">Integrasi Smart City</MobileNavLink>
                    <MobileNavLink href="#case-studies">Studi Kasus</MobileNavLink>
                    <MobileNavLink href="#news">Berita</MobileNavLink>
                    <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
                        <Link href="/help" className="text-sm font-semibold text-slate-500 text-center">
                            Pusat Bantuan
                        </Link>
                        <Link href="/login" className="block w-full text-center py-3 bg-[#2D3588] text-white rounded-lg font-bold">
                            Akses Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="text-sm font-bold text-slate-600 hover:text-[#2D3588] transition-colors relative group">
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#F6841F] transition-all duration-300 group-hover:w-full"></span>
        </Link>
    );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="block text-base font-bold text-slate-600 hover:text-[#2D3588] py-2 border-b border-slate-100 last:border-0">
            {children}
        </Link>
    );
}
