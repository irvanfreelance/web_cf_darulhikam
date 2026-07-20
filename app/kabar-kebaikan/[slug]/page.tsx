import React from 'react';
import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/lib/web-queries';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const revalidate = 120;

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: 'Artikel Tidak Ditemukan' };

  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt,
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt,
      images: [{ url: article.featured_image_url || '/placeholder.jpg' }],
    }
  };
}

export default async function ArticleDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const dateStr = article.published_at ? new Date(article.published_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  }) : '';

  return (
    <div className="animate-in fade-in duration-300 bg-[#ffffff] min-h-screen pb-16">
      <div className="max-w-[800px] mx-auto px-6 pt-10">
        <Link href="/kabar-kebaikan" className="inline-flex items-center gap-1 text-[#3268C3] font-bold text-[13.5px] hover:underline mb-8">
          <ChevronLeft size={16} /> Kembali ke Kabar Kebaikan
        </Link>
        
        <div className="mb-8">
          <div className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase mb-3">
            {article.category_id ? `Kategori ${article.category_id}` : 'Berita'}
          </div>
          <h1 className="font-cabin text-[32px] md:text-[40px] font-bold text-[#0f1b35] leading-tight mb-4">
            {article.title}
          </h1>
          <div className="text-[14px] text-[#94a3b8] flex items-center gap-2">
            <span>Dipublikasikan: {dateStr}</span>
          </div>
        </div>

        {article.featured_image_url && (
          <div className="w-full h-[250px] md:h-[400px] rounded-2xl overflow-hidden mb-10 border border-[#e2e8f0]">
            <img src={article.featured_image_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Using news-content utility class from globals.css for proper styling */}
        <div 
          className="news-content text-[15.5px] leading-[1.8] text-[#475569]"
          dangerouslySetInnerHTML={{ __html: article.content || '' }}
        />
      </div>
    </div>
  );
}
