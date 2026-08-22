'use client';

import React, { useState, useEffect } from 'react';
import {
  X, Heart, GraduationCap, HandCoins, Leaf, HeartPulse, Users, MoonStar,
  Home, Droplet, Utensils, BookOpen, Shield, Baby, Stethoscope, Wheat,
  Building2, HandHelping, Sun, TreePine, Ambulance, School, Landmark, PawPrint,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Keep in sync with the icon picker in the admin panel
// (web_cf_darulhikam_admin/app/(admin)/web-care-categories/page.tsx).
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  GraduationCap, HandCoins, Leaf, HeartPulse, Users, MoonStar, Heart,
  Home, Droplet, Utensils, BookOpen, Shield, Baby, Stethoscope, Wheat,
  Building2, HandHelping, Sun, TreePine, Ambulance, School, Landmark, PawPrint,
};

interface CareCategory {
  icon_name: string;
  label: string;
  quote_text: string | null;
  quote_source: string | null;
  description: string | null;
  photo_url: string | null;
}

// Renders **bold** segments as <strong>, everything else as plain text.
function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

export default function CareCategories({ categories }: { categories: CareCategory[] }) {
  const [selected, setSelected] = useState<CareCategory | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!categories || categories.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-5 md:gap-6">
        {categories.map((c) => {
          const Icon = ICON_MAP[c.icon_name] || Heart;
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => setSelected(c)}
              className="flex flex-col items-center gap-2.5 group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#83b64e] rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 group-active:scale-95">
                <Icon size={26} className="text-white" />
              </div>
              <span className="text-[12.5px] font-semibold text-[#334155] text-center leading-tight">{c.label}</span>
            </button>
          );
        })}
      </div>

      {isMounted && selected && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelected(null)}
          />

          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm text-gray-500 hover:text-gray-700 rounded-full shadow-md transition-colors"
            >
              <X size={20} />
            </button>

            {selected.photo_url && (
              <div className="w-full h-48 sm:h-56 overflow-hidden rounded-t-3xl sm:rounded-t-3xl">
                <img src={selected.photo_url} alt={selected.label} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 bg-[#83b64e] rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  {(() => {
                    const Icon = ICON_MAP[selected.icon_name] || Heart;
                    return <Icon size={20} className="text-white" />;
                  })()}
                </div>
                <h3 className="font-cabin text-xl font-bold text-[#0f1b35]">{selected.label}</h3>
              </div>

              {selected.quote_text && (
                <div className="border-l-4 border-[#83b64e] pl-4 mb-5">
                  <p className="text-[15px] font-semibold text-[#0f1b35] italic leading-snug">
                    &ldquo;{selected.quote_text}&rdquo;
                  </p>
                  {selected.quote_source && (
                    <p className="text-[12.5px] text-[#83b64e] font-bold mt-1.5">{selected.quote_source}</p>
                  )}
                </div>
              )}

              {selected.description && (
                <p className="text-[14px] text-[#475569] leading-relaxed">
                  <FormattedText text={selected.description} />
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
