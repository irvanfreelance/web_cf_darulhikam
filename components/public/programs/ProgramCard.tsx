import React from 'react';
import Link from 'next/link';

export default function ProgramCard({ p }: { p: any }) {
  const target = Number(p.target_amount) || 1;
  const collected = Number(p.collected) || 0;
  const prog = target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0;
  const fmt = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");

  let catLabel = "Program";
  if (p.category_name) {
    catLabel = p.category_name;
  }

  return (
    <div className="bg-[#ffffff] rounded-2xl overflow-hidden border border-[#e2e8f0] flex flex-col transition-shadow hover:shadow-lg">
      <div className="h-[180px] overflow-hidden relative shrink-0">
        <img src={p.image_url || '/placeholder.jpg'} alt={p.title} className="w-full h-full object-cover" />
        <div className="absolute top-2.5 left-2.5 bg-[#1f4a9c] text-white text-[11px] font-bold py-1 px-3 rounded-full">
          {catLabel}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-cabin text-[16px] font-bold text-[#0f1b35] mb-2 leading-snug line-clamp-2">
          {p.title}
        </h3>
        <p className="text-[13.5px] text-[#475569] leading-relaxed flex-1 mb-4 line-clamp-3">
          {p.description}
        </p>
        {!p.has_no_target && (
          <div className="mb-3">
            <div className="flex justify-between text-[12.5px] mb-1.5">
              <span className="text-[#94a3b8]">Terkumpul</span>
              <span className="text-[#3268C3] font-bold">{prog}%</span>
            </div>
            <div className="h-[7px] bg-[#e8f0fb] rounded-full overflow-hidden">
              <div className="h-full bg-[#3268C3] rounded-full" style={{ width: `${prog}%` }} />
            </div>
            <div className="flex justify-between text-[12px] text-[#94a3b8] mt-1">
              <span>{fmt(collected)}</span>
              <span>Target: {fmt(target)}</span>
            </div>
          </div>
        )}
        <Link href={`/donasi/${p.slug}`} className="w-full py-2.5 bg-[#3268C3] text-white text-center rounded-xl font-cabin font-bold text-[13.5px] transition-opacity hover:opacity-90">
          Donasi Sekarang
        </Link>
      </div>
    </div>
  );
}
