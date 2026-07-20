'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Star, Heart, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { id: '/', label: 'Beranda' },
  { id: '/tentang-kami', label: 'Tentang Kami' },
  { id: '/program', label: 'Program' },
  { id: '/layanan-ziswaf', label: 'Layanan ZISWAF' },
  { id: '/transparansi', label: 'Transparansi' },
  { id: '/kabar-kebaikan', label: 'Kabar Kebaikan' },
  { id: '/kontak', label: 'Kontak' },
];

export default function Navbar({ config }: { config?: any }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#ffffff] border-b border-[#e2e8f0] px-6 h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
        {config?.logo_url ? (
          <img src={config.logo_url} alt="Logo" className="h-[42px] w-auto object-contain" />
        ) : (
          <>
            <div className="w-[34px] h-[34px] bg-[#3268C3] rounded-lg flex items-center justify-center">
              <Star size={17} className="text-white fill-white" />
            </div>
            <div>
              <div className="font-cabin font-bold text-sm text-[#1f4a9c]">LAZ Darul Hikam</div>
              <div className="text-[10px] text-[#94a3b8]">SK Kemenag No. 792/2020</div>
            </div>
          </>
        )}
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex gap-1 items-center">
        {NAV_LINKS.map(l => {
          const isActive = pathname === l.id;
          return (
            <Link key={l.id} href={l.id} className={`
              px-3 py-1.5 border-none font-cabin text-[13px] rounded-lg transition-all duration-150
              ${isActive ? 'bg-[#e8f0fb] text-[#3268C3] font-bold' : 'bg-transparent text-[#475569] font-medium hover:bg-slate-50'}
            `}>
              {l.label}
            </Link>
          );
        })}
        <Link href="/donasi" className="ml-2 px-4 py-2 text-[13px] rounded-lg inline-flex items-center gap-2 bg-[#3268C3] text-white font-cabin font-bold transition-opacity hover:opacity-85">
          <Heart size={14} className="fill-white" /> Donasi
        </Link>
      </div>

      {/* Mobile nav toggle */}
      <div className="md:hidden">
        <button onClick={() => setOpen(!open)} className="p-2 text-[#475569]">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav menu */}
      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-[#e2e8f0] shadow-lg py-4 px-6 flex flex-col gap-2 md:hidden">
          {NAV_LINKS.map(l => {
            const isActive = pathname === l.id;
            return (
              <Link key={l.id} href={l.id} onClick={() => setOpen(false)} className={`
                block px-4 py-3 rounded-lg font-cabin
                ${isActive ? 'bg-[#e8f0fb] text-[#3268C3] font-bold' : 'text-[#475569]'}
              `}>
                {l.label}
              </Link>
            );
          })}
          <Link href="/donasi" onClick={() => setOpen(false)} className="mt-2 w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 bg-[#3268C3] text-white font-cabin font-bold">
            <Heart size={16} className="fill-white" /> Donasi
          </Link>
        </div>
      )}
    </nav>
  );
}
