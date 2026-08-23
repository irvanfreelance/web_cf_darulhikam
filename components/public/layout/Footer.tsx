import React from 'react';
import Link from 'next/link';
import { Star, Mail, Globe, MessageCircle } from 'lucide-react';

const FALLBACK_PROGRAMS = [
  { title: 'Beasiswa Generasi Rabbani', slug: null },
  { title: 'Layanan Kesehatan', slug: null },
  { title: 'Tanggap Bencana', slug: null },
  { title: 'Modal Usaha Dhuafa', slug: null },
];

export default function Footer({ config, programs }: { config: any, programs?: any[] }) {
  const footerPrograms = programs && programs.length > 0 ? programs : FALLBACK_PROGRAMS;

  return (
    <footer className="bg-[#ffffff] border-t border-[#e2e8f0] pt-12 pb-8">
      <div className="max-w-[1060px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            {config?.logo_url ? (
              <img src={config.logo_url} alt="Logo" className="h-[38px] w-auto object-contain" />
            ) : (
              <>
                <div className="w-[34px] h-[34px] bg-[#83b64e] rounded-lg flex items-center justify-center">
                  <Star size={17} className="text-white fill-white" />
                </div>
                <div>
                  <div className="font-cabin font-bold text-sm text-[#83b64e]">{config?.ngo_name || 'LAZ Darul Hikam'}</div>
                  <div className="text-[10px] text-[#94a3b8]">SK Kemenag No. 52/2024</div>
                </div>
              </>
            )}
          </Link>
          <p className="text-[13px] text-[#475569] leading-relaxed mb-4">
            {config?.short_description || "Lembaga amil zakat terpercaya, menyalurkan kebaikan Anda dengan amanah, transparan, dan terukur."}
          </p>
          <div className="flex gap-3">
            <a href={config?.facebook_url || '#'} className="w-8 h-8 rounded-full bg-[#f4f6fb] border border-[#e2e8f0] flex items-center justify-center text-[#83b64e] hover:bg-[#e8f0fb] transition-colors"><Mail size={14} /></a>
            <a href={config?.instagram_url || '#'} className="w-8 h-8 rounded-full bg-[#f4f6fb] border border-[#e2e8f0] flex items-center justify-center text-[#83b64e] hover:bg-[#e8f0fb] transition-colors"><Globe size={14} /></a>
            <a href={config?.whatsapp_number ? `https://wa.me/${config.whatsapp_number}` : '#'} className="w-8 h-8 rounded-full bg-[#f4f6fb] border border-[#e2e8f0] flex items-center justify-center text-[#83b64e] hover:bg-[#e8f0fb] transition-colors"><MessageCircle size={14} /></a>
          </div>
        </div>
        
        <div>
          <h4 className="font-cabin font-bold text-[15px] text-[#0f1b35] mb-4">Tentang Kami</h4>
          <ul className="space-y-2 text-[13.5px] text-[#475569]">
            <li><Link href="/tentang-kami#profil" className="hover:text-[#83b64e]">Profil Lembaga</Link></li>
            <li><Link href="/tentang-kami#visi-misi" className="hover:text-[#83b64e]">Visi & Misi</Link></li>
            <li><Link href="/tentang-kami#pengurus" className="hover:text-[#83b64e]">Susunan Pengurus</Link></li>
            <li><Link href="/transparansi" className="hover:text-[#83b64e]">Laporan Keuangan</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-cabin font-bold text-[15px] text-[#0f1b35] mb-4">Program</h4>
          <ul className="space-y-2 text-[13.5px] text-[#475569]">
            {footerPrograms.map((p: any) => (
              <li key={p.slug || p.title}>
                <Link href={p.slug ? `/donasi/${p.slug}` : '/program'} className="hover:text-[#83b64e]">{p.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-cabin font-bold text-[15px] text-[#0f1b35] mb-4">Kontak</h4>
          <Link href="/kontak" className="block text-[13.5px] text-[#475569] space-y-3 group">
            <p className="group-hover:text-[#83b64e] transition-colors">{config?.address || "Jl. Kebaikan Bangsa No. 99, Gedung Amal Lt. 2, Jakarta Selatan"}</p>
            <p className="group-hover:text-[#83b64e] transition-colors">Telp: {config?.whatsapp_number || "0800-1-ZAKAT"}</p>
            <span className="inline-block mt-2 text-[#83b64e] font-bold group-hover:underline">Hubungi Kami &rarr;</span>
          </Link>
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
