import React from 'react';
import Link from 'next/link';
import { Star, Mail, Globe, MessageCircle } from 'lucide-react';

export default function Footer({ config }: { config: any }) {
  return (
    <footer className="bg-[#ffffff] border-t border-[#e2e8f0] pt-12 pb-8">
      <div className="max-w-[1060px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-[34px] h-[34px] bg-[#3268C3] rounded-lg flex items-center justify-center">
              <Star size={17} className="text-white fill-white" />
            </div>
            <div>
              <div className="font-cabin font-bold text-sm text-[#1f4a9c]">LAZ Darul Hikam</div>
              <div className="text-[10px] text-[#94a3b8]">SK Kemenag No. 792/2020</div>
            </div>
          </Link>
          <p className="text-[13px] text-[#475569] leading-relaxed mb-4">
            {config?.short_description || "Lembaga amil zakat terpercaya, menyalurkan kebaikan Anda dengan amanah, transparan, dan terukur."}
          </p>
          <div className="flex gap-3">
            <a href={config?.facebook_url || '#'} className="w-8 h-8 rounded-full bg-[#f4f6fb] border border-[#e2e8f0] flex items-center justify-center text-[#3268C3] hover:bg-[#e8f0fb] transition-colors"><Mail size={14} /></a>
            <a href={config?.instagram_url || '#'} className="w-8 h-8 rounded-full bg-[#f4f6fb] border border-[#e2e8f0] flex items-center justify-center text-[#3268C3] hover:bg-[#e8f0fb] transition-colors"><Globe size={14} /></a>
            <a href={config?.whatsapp_number ? `https://wa.me/${config.whatsapp_number}` : '#'} className="w-8 h-8 rounded-full bg-[#f4f6fb] border border-[#e2e8f0] flex items-center justify-center text-[#3268C3] hover:bg-[#e8f0fb] transition-colors"><MessageCircle size={14} /></a>
          </div>
        </div>
        
        <div>
          <h4 className="font-cabin font-bold text-[15px] text-[#0f1b35] mb-4">Tentang Kami</h4>
          <ul className="space-y-2 text-[13.5px] text-[#475569]">
            <li><Link href="/tentang-kami" className="hover:text-[#3268C3]">Profil Lembaga</Link></li>
            <li><Link href="/tentang-kami" className="hover:text-[#3268C3]">Visi & Misi</Link></li>
            <li><Link href="/tentang-kami" className="hover:text-[#3268C3]">Susunan Pengurus</Link></li>
            <li><Link href="/transparansi" className="hover:text-[#3268C3]">Laporan Keuangan</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-cabin font-bold text-[15px] text-[#0f1b35] mb-4">Program</h4>
          <ul className="space-y-2 text-[13.5px] text-[#475569]">
            <li><Link href="/program" className="hover:text-[#3268C3]">Beasiswa Generasi Rabbani</Link></li>
            <li><Link href="/program" className="hover:text-[#3268C3]">Layanan Kesehatan</Link></li>
            <li><Link href="/program" className="hover:text-[#3268C3]">Tanggap Bencana</Link></li>
            <li><Link href="/program" className="hover:text-[#3268C3]">Modal Usaha Dhuafa</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-cabin font-bold text-[15px] text-[#0f1b35] mb-4">Kontak</h4>
          <div className="text-[13.5px] text-[#475569] space-y-3">
            <p>{config?.address || "Jl. Kebaikan Bangsa No. 99, Gedung Amal Lt. 2, Jakarta Selatan"}</p>
            <p>Telp: {config?.whatsapp_number || "0800-1-ZAKAT"}</p>
            <Link href="/kontak" className="inline-block mt-2 text-[#3268C3] font-bold hover:underline">Hubungi Kami &rarr;</Link>
          </div>
        </div>
      </div>
      
      <div className="border-t border-[#e2e8f0] pt-6 mt-6">
        <div className="max-w-[1060px] mx-auto px-6 text-center text-[12px] text-[#94a3b8]">
          &copy; {new Date().getFullYear()} {config?.ngo_name || 'LAZ Darul Hikam'}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
