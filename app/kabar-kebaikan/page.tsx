import React from 'react';
import ArticleCard from '@/components/public/articles/ArticleCard';
import { getLatestArticles } from '@/lib/web-queries';

export const revalidate = 120; // ISR 2 minutes

export default async function KabarKebaikanPage() {
  // Fetch up to 12 articles for the initial view
  const articles = await getLatestArticles(12);

  // Ideally, CategoryFilter component would be used here as a Client Component,
  // but keeping it simple for SSR first.
  const CATS = [
    { id:"all", label:"Semua" },
    { id:"field_report", label:"Laporan" },
    { id:"program_update", label:"Update Program" },
    { id:"beneficiary_story", label:"Kisah" },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="bg-[#1f4a9c] pt-24 pb-14 px-6 text-center">
        <div className="max-w-[640px] mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
            <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Kabar Kebaikan</span>
          </div>
          <h1 className="font-cabin text-[34px] font-bold text-white mb-3">Berita, Laporan & Kisah Penerima Manfaat</h1>
        </div>
      </div>

      <section className="bg-[#f4f6fb] py-16 px-6">
        <div className="max-w-[1060px] mx-auto">
          
          <div className="flex flex-wrap gap-2 mb-7">
            {CATS.map((c, i) => (
              <div key={c.id} className={`
                px-4 py-1.5 rounded-full text-[13.5px] font-semibold
                ${i === 0 ? 'bg-[#3268C3] text-white border-1.5 border-[#3268C3]' : 'bg-white text-[#475569] border-1.5 border-[#e2e8f0]'}
              `}>
                {c.label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.length === 0 ? (
              <div className="col-span-full text-center text-[#475569] py-10">Belum ada artikel dipublikasikan.</div>
            ) : (
              articles.map((a: any) => <ArticleCard key={a.slug} a={a} />)
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
