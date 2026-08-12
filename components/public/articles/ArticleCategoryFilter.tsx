'use client';

import React, { useState } from 'react';
import ArticleCard from './ArticleCard';

interface Category {
  id: string | number;
  label: string;
}

interface ArticleCategoryFilterProps {
  initialArticles: any[];
  categories?: any[];
}

export default function ArticleCategoryFilter({
  initialArticles,
  categories = []
}: ArticleCategoryFilterProps) {
  const [activeTab, setActiveTab] = useState<string | number>('all');

  // Build category options
  const defaultTabs: Category[] = [
    { id: 'all', label: 'Semua' },
    ...categories.map((c: any) => ({
      id: c.id,
      label: c.name
    }))
  ];

  // Fallback if db categories empty
  const tabs = defaultTabs.length > 1 ? defaultTabs : [
    { id: 'all', label: 'Semua' },
    { id: 'laporan', label: 'Laporan' },
    { id: 'update', label: 'Update Program' },
    { id: 'kisah', label: 'Kisah' },
  ];

  const filteredArticles = initialArticles.filter((a: any) => {
    if (activeTab === 'all') return true;
    if (typeof activeTab === 'number') {
      return Number(a.category_id) === activeTab;
    }
    const catSlug = (a.category_slug || a.category_name || '').toLowerCase();
    const catTitle = (a.title || '').toLowerCase();
    const tabKey = String(activeTab).toLowerCase();
    return catSlug.includes(tabKey) || catTitle.includes(tabKey);
  });

  return (
    <div>
      {/* Category Badge Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-8">
        {tabs.map((c) => {
          const isActive = activeTab === c.id;
          return (
            <button
              key={String(c.id)}
              onClick={() => setActiveTab(c.id)}
              className={`
                px-4 py-2 rounded-full text-[13.5px] font-semibold transition-all duration-200 cursor-pointer border
                ${isActive
                  ? 'bg-[#83b64e] text-white border-[#83b64e] shadow-sm scale-[1.02]'
                  : 'bg-white text-[#475569] border-[#e2e8f0] hover:bg-slate-50 hover:border-slate-300'
                }
              `}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full text-center text-[#475569] py-12 bg-white rounded-2xl border border-[#e2e8f0]">
            <p className="font-semibold text-[15px] mb-1">Belum ada artikel dipublikasikan.</p>
            <p className="text-[13px] text-[#94a3b8]">Silakan pilih kategori lain untuk melihat berita terbaru.</p>
          </div>
        ) : (
          filteredArticles.map((a: any) => <ArticleCard key={a.slug} a={a} />)
        )}
      </div>
    </div>
  );
}
