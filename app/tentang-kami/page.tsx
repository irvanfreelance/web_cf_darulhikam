import React from 'react';
import { getWebTeamMembers, getWebLegality } from '@/lib/web-queries';

export const revalidate = 86400; // ISR Daily for Team page

export default async function TentangKami() {
  const [teamMembers, legality] = await Promise.all([
    getWebTeamMembers(),
    getWebLegality()
  ]);

  const TIMELINE = [
    { year:"2012", ev:"Pendirian LAZ oleh alumni Pesantren Darul Hikam" },
    { year:"2014", ev:"Program Beasiswa Generasi Rabbani pertama kali diluncurkan" },
    { year:"2017", ev:"Ekspansi program ke 15 provinsi seluruh Indonesia" },
    { year:"2020", ev:"Mendapat izin resmi Kemenag RI - SK No. 792/2020" },
    { year:"2022", ev:"100.000 penerima manfaat kumulatif tercapai" },
    { year:"2025", ev:"Beroperasi di 28 provinsi dengan 1.200+ relawan aktif" },
  ];

  const LEGAL_DOCS = [
    { label:"SK Kemenag RI", value:"No. 792 Tahun 2020" },
    { label:"NPWP Lembaga", value:"31.284.XXX.X-441.000" },
    { label:"Akta Notaris", value:"AHU-0012XXX.AH.01.04.2012" },
    { label:"Reg. BAZNAS", value:"LAZ-BAZNAS-2020-044" },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="bg-[#1f4a9c] pt-24 pb-14 px-6 text-center">
        <div className="max-w-[640px] mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
            <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Tentang Kami</span>
          </div>
          <h1 className="font-cabin text-[34px] font-bold text-white mb-3">Lembaga Zakat Terpercaya Sejak 2012</h1>
          <p className="text-white/70 text-[16px] leading-relaxed">Menyalurkan kebaikan Anda dengan amanah, transparan, dan terukur.</p>
        </div>
      </div>

      <section className="bg-[#ffffff] py-16 px-6">
        <div className="max-w-[1060px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
              <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Sejarah Kami</span>
            </div>
            <h2 className="font-cabin text-[28px] font-bold text-[#0f1b35] leading-tight mb-4">Dari Pesantren, Untuk Umat</h2>
            <p className="text-[#475569] leading-relaxed mb-4 text-[15px]">
              LAZ Darul Hikam lahir pada 2012 dari kepedulian alumni Pesantren Darul Hikam Bandung terhadap kondisi sosial-ekonomi umat. Berawal dari program beasiswa kecil, kini kami menjangkau 28 provinsi dengan lima pilar program utama.
            </p>
            <p className="text-[#475569] leading-relaxed text-[15px]">
              Setiap rupiah yang diamanahkan kepada kami dikelola dengan standar akuntansi PSAK Syariah, diaudit KAP independen, dan dilaporkan secara berkala kepada publik.
            </p>
          </div>
          <div className="grid gap-4">
            {TIMELINE.map(t => (
              <div key={t.year} className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-[#e8f0fb] rounded-xl flex items-center justify-center font-cabin font-bold text-[13px] text-[#3268C3] shrink-0">
                  {t.year}
                </div>
                <div className="text-[14px] text-[#475569] leading-relaxed pt-1">{t.ev}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f6fb] py-16 px-6">
        <div className="max-w-[1060px] mx-auto">
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
              <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Visi & Misi</span>
            </div>
            <h2 className="font-cabin text-[28px] font-bold text-[#0f1b35] leading-tight">Fondasi Kerja Kami</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1f4a9c] rounded-2xl p-8">
              <div className="font-cabin text-[13px] font-bold text-[#c9892a] tracking-widest uppercase mb-3">Visi</div>
              <p className="text-white/85 text-[15.5px] leading-relaxed italic">
                "Menjadi lembaga amil zakat nasional terdepan dalam mewujudkan kemandirian umat melalui pengelolaan ZISWAF yang profesional dan berdampak nyata."
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-[#e2e8f0]">
              <div className="font-cabin text-[13px] font-bold text-[#3268C3] tracking-widest uppercase mb-3">Misi</div>
              <ul className="list-disc pl-5 text-[#475569] text-[14.5px] leading-relaxed space-y-1">
                <li>Menghimpun ZISWAF secara transparan dan akuntabel</li>
                <li>Menyalurkan dana tepat sasaran kepada 8 asnaf</li>
                <li>Memberdayakan mustahiq menuju kemandirian</li>
                <li>Memperkuat ekosistem filantropi Islam Indonesia</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#ffffff] py-16 px-6">
        <div className="max-w-[1060px] mx-auto">
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
              <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Pengurus</span>
            </div>
            <h2 className="font-cabin text-[28px] font-bold text-[#0f1b35] leading-tight">Tim Kepemimpinan</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {teamMembers.map((t: any) => (
              <div key={t.name} className="bg-[#f8fafc] rounded-xl p-6 text-center border border-[#e2e8f0]">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt={t.name} className="w-14 h-14 rounded-full mx-auto mb-4 object-cover" />
                ) : (
                  <div 
                    className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center font-cabin font-bold text-[18px] text-white" 
                    style={{ backgroundColor: t.accent_color || '#3268C3' }}
                  >
                    {t.initials}
                  </div>
                )}
                <div className="font-cabin font-bold text-[14.5px] mb-1">{t.name}</div>
                <div className="text-[13px] text-[#94a3b8]">{t.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f6fb] py-16 px-6">
        <div className="max-w-[1060px] mx-auto">
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
              <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Legalitas</span>
            </div>
            <h2 className="font-cabin text-[28px] font-bold text-[#0f1b35] leading-tight">Dokumen Resmi</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {LEGAL_DOCS.map(l => (
              <div key={l.label} className="bg-white rounded-xl p-5 border border-[#e2e8f0] border-l-4 border-l-[#3268C3]">
                <div className="text-[11.5px] font-bold text-[#94a3b8] uppercase tracking-wide mb-1.5">{l.label}</div>
                <div className="font-cabin text-[15px] font-bold text-[#1f4a9c]">{l.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
