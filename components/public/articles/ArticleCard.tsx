import React from 'react';
import Link from 'next/link';

export default function ArticleCard({ a }: { a: any }) {
  const dateStr = a.published_at ? new Date(a.published_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  }) : '';

  return (
    <Link href={`/kabar-kebaikan/${a.slug}`} className="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e2e8f0] transition-shadow hover:shadow-lg block">
      <div className="h-[160px] overflow-hidden">
        <img src={a.featured_image_url || '/placeholder.jpg'} alt={a.title} className="w-full h-full object-cover transition-transform hover:scale-105" />
      </div>
      <div className="p-4">
        <div className="text-[11px] font-bold text-[#3268C3] uppercase tracking-widest mb-1.5">
          {a.category_id ? `Kategori ${a.category_id}` : 'Berita'}
        </div>
        <h4 className="font-cabin text-[14.5px] font-bold text-[#0f1b35] leading-snug mb-2 line-clamp-2">
          {a.title}
        </h4>
        <div className="text-[12px] text-[#94a3b8]">
          {dateStr}
        </div>
      </div>
    </Link>
  );
}
