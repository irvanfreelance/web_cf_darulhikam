import React from 'react';
import { FileText, Download } from 'lucide-react';
import CountUp from '@/components/public/shared/CountUp';
import { getWebFinancialReports, getWebImpactMetrics, getWebFundAllocations } from '@/lib/web-queries';

export const revalidate = 3600; // ISR 1 hour

export default async function TransparansiPage() {
  const currentYear = new Date().getFullYear();
  
  const [financialReports, impactMetrics, fundAllocations] = await Promise.all([
    getWebFinancialReports(),
    getWebImpactMetrics(),
    getWebFundAllocations(currentYear)
  ]);

  // Transform fund allocations to simple percentages for the chart if data exists
  // Otherwise fallback to PRD dummy data for visual representation if DB is empty for this year
  let ALLOC = [
    { program:"Beasiswa Generasi Rabbani", pct:32, color:"bg-[#3268C3]" },
    { program:"Tanggap Bencana Nasional", pct:28, color:"bg-[#dc2626]" },
    { program:"Layanan Kesehatan Gratis", pct:18, color:"bg-[#1a6b3c]" },
    { program:"Dakwah & Pembinaan Umat", pct:13, color:"bg-[#c9892a]" },
    { program:"Modal Usaha Dhuafa", pct:9, color:"bg-[#5585d4]" },
  ];

  if (fundAllocations.length > 0) {
    // Process real allocations
    const totalsByProgram: Record<string, { total: number, color: string }> = {};
    let grandTotal = 0;
    
    fundAllocations.forEach((fa: any) => {
      const amt = Number(fa.allocated_amount);
      if (!totalsByProgram[fa.program_name]) {
        totalsByProgram[fa.program_name] = { total: 0, color: fa.color_theme || 'bg-[#3268C3]' };
      }
      totalsByProgram[fa.program_name].total += amt;
      grandTotal += amt;
    });

    if (grandTotal > 0) {
      ALLOC = Object.keys(totalsByProgram).map(program => ({
        program,
        pct: Math.round((totalsByProgram[program].total / grandTotal) * 100),
        color: totalsByProgram[program].color.startsWith('#') ? `bg-[${totalsByProgram[program].color}]` : `bg-[#3268C3]`
      })).sort((a, b) => b.pct - a.pct);
    }
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="bg-[#1f4a9c] pt-24 pb-14 px-6 text-center">
        <div className="max-w-[640px] mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
            <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Transparansi</span>
          </div>
          <h1 className="font-cabin text-[34px] font-bold text-white mb-3">Keterbukaan adalah Kewajiban Kami</h1>
          <p className="text-white/70 text-[16px] leading-relaxed">Laporan keuangan dipublikasikan secara berkala dan diaudit oleh KAP independen.</p>
        </div>
      </div>

      <section className="bg-[#f4f6fb] py-16 px-6">
        <div className="max-w-[1060px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
              <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Alokasi Dana</span>
            </div>
            <h2 className="font-cabin text-[28px] font-bold text-[#0f1b35] leading-tight mb-6">Distribusi Penyaluran {currentYear}</h2>
            <div className="grid gap-3.5">
              {ALLOC.map((a: any) => (
                <div key={a.program}>
                  <div className="flex justify-between text-[13.5px] mb-1.5">
                    <span className="font-semibold text-[#0f1b35]" dangerouslySetInnerHTML={{__html: a.program}} />
                    <span className="font-bold">{a.pct}%</span>
                  </div>
                  <div className="h-2.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                    <div className={`h-full ${a.color.includes('bg-') ? a.color : 'bg-[#3268C3]'} rounded-full`} style={{ width: `${a.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
              <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Dampak Terukur</span>
            </div>
            <h2 className="font-cabin text-[28px] font-bold text-[#0f1b35] leading-tight mb-6">Angka Kumulatif {currentYear}</h2>
            <div className="grid grid-cols-2 gap-4">
              {impactMetrics.map((d: any, i: number) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-[#e2e8f0] text-center">
                  <div className="font-cabin text-[28px] font-bold text-[#3268C3]">
                    <CountUp target={Number(d.value)} />{d.suffix}
                  </div>
                  <div className="text-[12.5px] text-[#475569] mt-1">{d.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reports */}
      <section className="bg-[#ffffff] py-16 px-6">
        <div className="max-w-[1060px] mx-auto">
          <div className="text-center mb-10 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
              <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Laporan Keuangan</span>
            </div>
            <h2 className="font-cabin text-[28px] font-bold text-[#0f1b35] leading-tight">Unduh Laporan Audit</h2>
          </div>
          <div className="grid gap-4 max-w-[720px] mx-auto">
            {financialReports.length === 0 ? (
              <div className="text-center text-[#475569] py-6">Belum ada laporan yang dipublikasikan.</div>
            ) : (
              financialReports.map((r: any) => (
                <div key={r.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#f8fafc] rounded-xl p-4 sm:p-5 border border-[#e2e8f0]">
                  <div className="w-11 h-11 bg-[#e8f0fb] rounded-xl flex items-center justify-center shrink-0">
                    <FileText size={20} className="text-[#3268C3]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-cabin font-bold text-[14.5px] text-[#0f1b35]">{r.title}</div>
                    <div className="text-[12.5px] text-[#94a3b8] mt-0.5">
                      {r.report_type} | {r.audit_status.replace('_', ' ')} | {r.file_size_kb ? `${(r.file_size_kb / 1024).toFixed(2)} MB` : '-'}
                    </div>
                  </div>
                  <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3.5 py-2 bg-[#e8f0fb] text-[#3268C3] border-none rounded-lg font-bold text-[13px] shrink-0 hover:bg-[#3268C3] hover:text-white transition-colors">
                    <Download size={14} /> Unduh
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
