import React from 'react';
import { DollarSign, ShieldCheck, Search, CheckCircle2 } from 'lucide-react';
import ProgramCard from '@/components/public/programs/ProgramCard';
import { getAllCampaigns } from '@/lib/campaigns';

export const revalidate = 300; // ISR 5 minutes

export default async function ProgramPage() {
  const allCampaigns = await getAllCampaigns();

  const HOW = [
    { n: "01", t: "Donasi Masuk", d: "Muzakki menyalurkan ZISWAF melalui kanal resmi LAZ.", icon: <DollarSign size={22} className="text-[#3268C3]" /> },
    { n: "02", t: "Verifikasi & Audit", d: "Dana diverifikasi amil dan dicatat secara transparan.", icon: <ShieldCheck size={22} className="text-[#1a6b3c]" /> },
    { n: "03", t: "Seleksi Penerima", d: "Mustahiq diseleksi ketat berdasarkan kriteria 8 asnaf.", icon: <Search size={22} className="text-[#c9892a]" /> },
    { n: "04", t: "Penyaluran", d: "Dana disalurkan dan didokumentasikan dengan foto dan laporan.", icon: <CheckCircle2 size={22} className="text-[#1f4a9c]" /> },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="bg-[#1f4a9c] pt-24 pb-14 px-6 text-center">
        <div className="max-w-[640px] mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
            <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Program</span>
          </div>
          <h1 className="font-cabin text-[34px] font-bold text-white mb-3">Program Kami</h1>
          <p className="text-white/70 text-[16px] leading-relaxed">Setiap program dirancang untuk memberikan dampak berkelanjutan bagi mustahiq.</p>
        </div>
      </div>

      <section className="bg-[#f4f6fb] py-16 px-6">
        <div className="max-w-[1060px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allCampaigns.map((p: any) => <ProgramCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      <section className="bg-[#ffffff] py-16 px-6">
        <div className="max-w-[1060px] mx-auto">
          <div className="text-center mb-10 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
              <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Mekanisme Penyaluran</span>
            </div>
            <h2 className="font-cabin text-[28px] font-bold text-[#0f1b35] leading-tight">Bagaimana Dana Bekerja?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW.map(h => (
              <div key={h.n} className="bg-[#f8fafc] rounded-xl p-6 text-center border border-[#e2e8f0]">
                <div className="text-[11px] font-bold text-[#3268C3] tracking-[2px] mb-3 uppercase">LANGKAH {h.n}</div>
                <div className="w-[52px] h-[52px] bg-[#e8f0fb] rounded-xl flex items-center justify-center mx-auto mb-4">{h.icon}</div>
                <div className="font-cabin text-[14.5px] font-bold mb-1.5" dangerouslySetInnerHTML={{ __html: h.t }} />
                <div className="text-[13.5px] text-[#475569] leading-relaxed">{h.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
