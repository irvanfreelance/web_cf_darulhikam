import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, ChevronRight, Target, Eye, TrendingUp } from 'lucide-react';
import CountUp from '@/components/public/shared/CountUp';
import ProgramCard from '@/components/public/programs/ProgramCard';
import ArticleCard from '@/components/public/articles/ArticleCard';
import {
  getWebHeroConfig,
  getWebImpactMetrics,
  getWebTestimonials,
  getWebPartners,
  getLatestArticles
} from '@/lib/web-queries';
import { getAllCampaigns } from '@/lib/campaigns';

export const revalidate = 300; // ISR 5 minutes

export default async function Beranda() {
  const [heroConfig, impactMetrics, testimonials, partners, articles, allCampaigns] = (await Promise.all([
    getWebHeroConfig(),
    getWebImpactMetrics(),
    getWebTestimonials(),
    getWebPartners(),
    getLatestArticles(3),
    getAllCampaigns()
  ])) as [any, any[], any[], any[], any[], any[]];

  const featuredPrograms = allCampaigns.filter((p: any) => p.is_urgent).slice(0, 3);
  if (featuredPrograms.length < 3) {
    const featuredIds = new Set(featuredPrograms.map((p: any) => p.id));
    const fillers = allCampaigns.filter((p: any) => !featuredIds.has(p.id));
    featuredPrograms.push(...fillers.slice(0, 3 - featuredPrograms.length));
  }

  return (
    <div className="animate-in fade-in duration-300">
      {/* Video Profile (Hero) */}
      {heroConfig?.video_url && (
        <section className="relative w-full min-h-[640px] md:min-h-[760px] flex items-center justify-center overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={heroConfig.video_url}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{
              background: heroConfig?.primary_color
                ? `linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.6)), linear-gradient(135deg, ${heroConfig.primary_color}55, transparent)`
                : 'linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.6))',
            }}
          />
          <div className="relative z-10 max-w-[720px] mx-auto text-center px-6 pt-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
              <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Saksikan Langsung</span>
            </div>
            <h2 className="font-cabin text-3xl md:text-[40px] font-bold text-white leading-tight mb-4">
              Menyaksikan Perubahan yang Nyata di Lapangan
            </h2>
            <p className="text-white/80 text-[15px] md:text-[16px] leading-relaxed mb-8">
              Setiap donasi yang Anda salurkan menjadi kisah nyata di tengah masyarakat. Simak bagaimana {heroConfig?.ngo_name || 'kami'} menghadirkan harapan melalui program zakat, infaq, dan sedekah di seluruh Indonesia.
            </p>
            <Link href="/program" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#3268C3] text-white rounded-xl font-cabin font-bold text-[15px] transition-opacity hover:opacity-85">
              <Heart size={16} className="fill-white" /> Lihat Program Kami
            </Link>
          </div>
        </section>
      )}

      {/* Hero */}
      <section className={`bg-[#1f4a9c] px-6 ${heroConfig?.video_url ? 'py-16' : 'pt-24 pb-16'}`}>
        <div className="max-w-[1060px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-3xl px-3.5 py-1.5 mb-5">
              <ShieldCheck size={13} className="text-[#c9892a]" />
              <span className="text-[12px] text-white/90 font-semibold">Resmi Kemenag RI - SK No. 792/2020</span>
            </div>
            <h2 className="font-cabin text-4xl lg:text-[40px] font-bold text-white leading-tight mb-3">
              Zakat & Sedekah Lebih Berdampak
            </h2>
            <p className="text-white/75 text-[16px] leading-relaxed mb-8">
              LAZ Darul Hikam menyalurkan zakat, infaq, sedekah, dan wakaf Anda secara transparan, akuntabel, dan tepat sasaran ke seluruh Indonesia.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/donasi" className="px-7 py-3.5 bg-[#3268C3] text-white rounded-xl font-cabin font-bold text-[15px] inline-flex items-center gap-2 transition-opacity hover:opacity-85">
                <Heart size={16} className="fill-white" /> Donasi Sekarang
              </Link>
              <Link href="/program" className="px-7 py-3.5 bg-white/10 border-2 border-white/40 text-white rounded-xl font-cabin font-bold text-[15px] inline-flex items-center transition-colors hover:bg-white/20">
                Lihat Program
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {impactMetrics.map((d: any, i: number) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <div className="font-cabin text-[28px] font-bold text-[#c9892a]">
                  <CountUp target={Number(d.value)} />{d.suffix}
                </div>
                <div className="text-[12.5px] text-white/65 mt-1">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="bg-[#f4f6fb] py-16 px-6">
        <div className="max-w-[1060px] mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
            <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Program Unggulan</span>
          </div>
          <div className="flex justify-between items-end mb-7">
            <h2 className="font-cabin text-[28px] font-bold text-[#0f1b35] leading-tight">Program Kami</h2>
            <Link href="/program" className="flex items-center gap-1 text-[#3268C3] font-bold text-[13.5px] hover:underline">
              Lihat Semua <ChevronRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredPrograms.map((p: any) => <ProgramCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-[#ffffff] py-16 px-6">
        <div className="max-w-[1060px] mx-auto">
          <div className="text-center mb-10 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
              <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Nilai Inti</span>
            </div>
            <h2 className="font-cabin text-[28px] font-bold text-[#0f1b35] leading-tight">Mengapa Pilih LAZ Darul Hikam?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <ShieldCheck size={24} className="text-[#3268C3]" />, bg: "bg-[#e8f0fb]", t: "Legalitas Resmi", d: "Berizin Kemenag RI SK No. 792/2020 dan anggota BAZNAS pusat." },
              { icon: <Eye size={24} className="text-[#1a6b3c]" />, bg: "bg-[#e8f5ee]", t: "Transparan 100%", d: "Laporan keuangan diaudit KAP independen dan dipublikasikan." },
              { icon: <Target size={24} className="text-[#c9892a]" />, bg: "bg-[#fdf3e3]", t: "Tepat Sasaran", d: "Penyaluran berdasarkan 8 asnaf dengan verifikasi ketat." },
              { icon: <TrendingUp size={24} className="text-[#5585d4]" />, bg: "bg-[#e8f0fb]", t: "Berdampak Nyata", d: "Ratusan ribu penerima manfaat di seluruh Indonesia." },
            ].map(v => (
              <div key={v.t} className="bg-[#f8fafc] rounded-xl p-6 border border-[#e2e8f0]">
                <div className={`w-12 h-12 ${v.bg} rounded-xl flex items-center justify-center mb-4`}>{v.icon}</div>
                <h4 className="font-cabin text-[15px] font-bold mb-1.5">{v.t}</h4>
                <p className="text-[13.5px] text-[#475569] leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dampak */}
      <section className="bg-[#1f4a9c] py-16 px-6">
        <div className="max-w-[1060px] mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
            <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Bukti Dampak</span>
          </div>
          <h2 className="font-cabin text-[30px] font-bold text-white mb-2">Angka yang Berbicara</h2>
          <p className="text-white/65 text-[15px] mb-10">Data penyaluran terverifikasi kami</p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {impactMetrics.map((d: any, i: number) => (
              <div key={i} className="bg-white/10 border border-white/10 rounded-xl py-8 px-6 text-center">
                <div className="font-cabin text-[36px] font-bold text-[#c9892a]">
                  <CountUp target={Number(d.value)} />{d.suffix}
                </div>
                <div className="text-[14px] text-white/70 mt-2">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#ffffff] py-16 px-6">
        <div className="max-w-[1060px] mx-auto">
          <div className="text-center mb-10 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
              <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Kisah Inspiratif</span>
            </div>
            <h2 className="font-cabin text-[28px] font-bold text-[#0f1b35] leading-tight">Suara Mereka yang Merasakan Dampaknya</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.slice(0, 3).map((t: any) => (
              <div key={t.person_name} className="bg-[#f8fafc] rounded-2xl p-7 border border-[#e2e8f0] relative">
                <div className="text-[48px] text-[#e8f0fb] font-cabin font-bold leading-none mb-2">"</div>
                <p className="text-[14.5px] text-[#475569] leading-relaxed italic mb-6 line-clamp-4">{t.quote}</p>
                <div className="flex items-center gap-3">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt={t.person_name} className="w-11 h-11 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#3268C3] flex items-center justify-center font-cabin font-bold text-[15px] text-white shrink-0">
                      {t.initials}
                    </div>
                  )}
                  <div>
                    <div className="font-cabin font-bold text-[14px]">{t.person_name}</div>
                    <div className="text-[12.5px] text-[#94a3b8]">{t.person_role}</div>
                    <div className={`text-[11px] px-2 py-0.5 rounded-full inline-block mt-1 font-bold ${t.person_type === 'muzakki' ? 'bg-[#e8f0fb] text-[#3268C3]' : 'bg-[#fdf3e3] text-[#c9892a]'}`}>
                      {t.person_type === 'muzakki' ? 'Muzakki' : 'Mustahiq'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mitra */}
      <section className="bg-[#f4f6fb] py-12 px-6">
        <div className="max-w-[1060px] mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
            <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Jaringan & Kemitraan</span>
          </div>
          <h2 className="font-cabin text-[28px] font-bold text-[#0f1b35] leading-tight mb-8">Dipercaya Lembaga Terkemuka</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {partners.map((m: any) => (
              <div key={m.name} className="bg-[#ffffff] border border-[#e2e8f0] rounded-xl px-5 py-2.5 text-[13.5px] font-semibold text-[#475569] shadow-sm">
                {m.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="bg-[#ffffff] py-16 px-6">
        <div className="max-w-[1060px] mx-auto">
          <div className="flex justify-between items-end mb-7">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
                <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Kabar Kebaikan</span>
              </div>
              <h2 className="font-cabin text-[28px] font-bold text-[#0f1b35] leading-tight">Berita & Laporan Terbaru</h2>
            </div>
            <Link href="/kabar-kebaikan" className="flex items-center gap-1 text-[#3268C3] font-bold text-[13.5px] hover:underline">
              Semua Berita <ChevronRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((a: any) => <ArticleCard key={a.slug} a={a} />)}
          </div>
        </div>
      </section>

      {/* Kontak CTA */}
      <section className="bg-[#1f4a9c] py-16 px-6">
        <div className="max-w-[600px] mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-[18px] h-0.5 bg-[#c9892a] rounded-full" />
            <span className="text-[12px] font-bold text-[#c9892a] tracking-[1.5px] uppercase">Hubungi Kami</span>
          </div>
          <h2 className="font-cabin text-[30px] font-bold text-white mb-4">Siap Berzakat Bersama Kami?</h2>
          <p className="text-white/70 mb-8 text-[15px] leading-relaxed">
            Konsultasikan kebutuhan zakat dan donasi Anda dengan amil kami. Gratis, amanah, dan profesional.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/donasi" className="px-7 py-3.5 bg-[#3268C3] text-white rounded-xl font-cabin font-bold text-[15px] inline-flex items-center gap-2 transition-opacity hover:opacity-85">
              <Heart size={15} className="fill-white" /> Donasi Sekarang
            </Link>
            <Link href="/kontak" className="px-7 py-3.5 bg-white/10 border-2 border-white/40 text-white rounded-xl font-cabin font-bold text-[15px] inline-flex items-center transition-colors hover:bg-white/20">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
