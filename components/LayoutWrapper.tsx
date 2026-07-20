'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import BottomNav from './layout/BottomNav';
import Navbar from './public/layout/Navbar';
import Footer from './public/layout/Footer';

export default function LayoutWrapper({ children, configs }: { children: React.ReactNode, configs: any }) {
  const pathname = usePathname();
  
  // Routes for the Corporate Website
  const isPublic = 
    pathname === '/' || 
    pathname === '/tentang-kami' || 
    pathname === '/layanan-ziswaf' || 
    pathname === '/transparansi' || 
    pathname === '/kontak' || 
    (pathname.startsWith('/program') && !pathname.startsWith('/program-crowdfunding')) || // assume public /program, but CF doesn't have /program it has /kampanye
    pathname.startsWith('/kabar-kebaikan');

  if (isPublic) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f4f6fb]">
        <Navbar config={configs} />
        <main className="flex-1 w-full pt-16">
          {children}
        </main>
        <Footer config={configs} />
      </div>
    );
  }

  // Mobile App Layout for Crowdfunding Flow
  return (
    <main className="flex-1 w-full max-w-md mx-auto relative overflow-hidden bg-white shadow-xl flex flex-col h-full">
      <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
        {children}
      </div>
      <BottomNav />
    </main>
  );
}
