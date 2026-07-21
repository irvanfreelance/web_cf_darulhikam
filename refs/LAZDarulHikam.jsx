import { useState, useRef, useEffect } from "react";
import {
  Star, ShieldCheck, Eye, Users, BookOpen, Heart, Briefcase,
  Clock, Package, Mail, Menu, X, ChevronRight,
  Droplets, Building, GraduationCap, Search, CheckCircle2,
  DollarSign, Globe, MapPin, Phone, Share2, Target,
  AlertTriangle, BarChart2, Download, FileText, ChevronDown,
  ChevronUp, Send, TrendingUp, Lightbulb, Users2
} from "lucide-react";

// -- Design Tokens (FLAT ONLY - zero gradients) -----------------------------
const C = {
  biru: "#3268C3",
  biruDk: "#1f4a9c",
  biruLt: "#e8f0fb",
  biruMd: "#5585d4",
  hijau: "#1a6b3c",
  hijauLt: "#e8f5ee",
  emas: "#c9892a",
  emasLt: "#fdf3e3",
  bg: "#f4f6fb",
  cream: "#f8fafc",
  white: "#ffffff",
  border: "#e2e8f0",
  teks: "#0f1b35",
  teksMd: "#475569",
  teksMt: "#94a3b8",
  red: "#dc2626",
  redLt: "#fef2f2",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cabin:wght@400;600;700&family=Albert+Sans:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Albert Sans',sans-serif;background:${C.bg};color:${C.teks};font-size:15px;line-height:1.6}
  h1,h2,h3,h4,h5,h6{font-family:'Cabin',sans-serif}
  button{cursor:pointer;font-family:'Albert Sans',sans-serif}
  a{text-decoration:none;color:inherit}
  .panim{animation:panim .25s ease}
  @keyframes panim{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
`;

// -- Helpers ----------------------------------------------------------------
const fmt = n => "Rp " + Math.round(n).toLocaleString("id-ID");
const pct = (c, t) => t > 0 ? Math.round((c / t) * 100) : 0;

// -- Shared UI --------------------------------------------------------------
const Eyebrow = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: ".5rem" }}>
    <div style={{ width: 18, height: 2, background: C.emas, borderRadius: 2 }} />
    <span style={{ fontSize: 12, fontWeight: 700, color: C.emas, letterSpacing: "1.5px", textTransform: "uppercase" }}>
      {children}
    </span>
  </div>
);

const Title = ({ children, size = 28, color = C.teks }) => (
  <h2 style={{ fontFamily: "'Cabin',sans-serif", fontSize: size, fontWeight: 700, color, lineHeight: 1.25, marginBottom: ".75rem" }}>
    {children}
  </h2>
);

const Btn = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "12px 24px", background: C.biru, color: "#fff",
    border: "none", borderRadius: 10, fontFamily: "'Cabin',sans-serif",
    fontWeight: 700, fontSize: 15, transition: "opacity .15s",
    ...style
  }}
    onMouseOver={e => e.currentTarget.style.opacity = ".85"}
    onMouseOut={e => e.currentTarget.style.opacity = "1"}
  >
    {children}
  </button>
);

const BtnOut = ({ children, onClick, dk, style = {} }) => (
  <button onClick={onClick} style={{
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "12px 24px",
    background: dk ? "rgba(255,255,255,.12)" : "transparent",
    color: dk ? "#fff" : C.biru,
    border: `2px solid ${dk ? "rgba(255,255,255,.4)" : C.biru}`,
    borderRadius: 10, fontFamily: "'Cabin',sans-serif",
    fontWeight: 700, fontSize: 15, transition: "all .15s",
    ...style
  }}
    onMouseOver={e => { e.currentTarget.style.background = dk ? "rgba(255,255,255,.2)" : C.biruLt; }}
    onMouseOut={e => { e.currentTarget.style.background = dk ? "rgba(255,255,255,.12)" : "transparent"; }}
  >
    {children}
  </button>
);

// -- Navbar -----------------------------------------------------------------
const NAV_LINKS = [
  { id: "beranda", label: "Beranda" },
  { id: "tentang", label: "Tentang Kami" },
  { id: "program", label: "Program" },
  { id: "ziswaf", label: "Layanan ZISWAF" },
  { id: "transparansi", label: "Transparansi" },
  { id: "kabar", label: "Kabar Kebaikan" },
  { id: "kontak", label: "Kontak" },
];

function Navbar({ page, go }) {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: C.white, borderBottom: `1px solid ${C.border}`,
      padding: "0 1.5rem", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => go("beranda")}>
        <div style={{ width: 34, height: 34, background: C.biru, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Star size={17} color="#fff" fill="#fff" />
        </div>
        <div>
          <div style={{ fontFamily: "'Cabin',sans-serif", fontWeight: 700, fontSize: 14, color: C.biruDk }}>LAZ Darul Hikam</div>
          <div style={{ fontSize: 10, color: C.teksMt }}>SK Kemenag No. 792/2020</div>
        </div>
      </div>

      {/* Desktop nav */}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {NAV_LINKS.map(l => (
          <button key={l.id} onClick={() => go(l.id)} style={{
            padding: "6px 11px", border: "none",
            background: page === l.id ? C.biruLt : "transparent",
            color: page === l.id ? C.biru : C.teksMd,
            fontFamily: "'Cabin',sans-serif", fontWeight: page === l.id ? 700 : 500,
            fontSize: 13, borderRadius: 8, transition: "all .15s",
          }}>
            {l.label}
          </button>
        ))}
        <Btn onClick={() => go("ziswaf")} style={{ padding: "8px 16px", fontSize: 13, borderRadius: 8, marginLeft: 8 }}>
          <Heart size={14} fill={C.white} /> Donasi
        </Btn>
      </div>
    </nav>
  );
}

// -- Page Header ------------------------------------------------------------
function PageHd({ eyebrow, title, sub }) {
  return (
    <div style={{ background: C.biruDk, padding: "6rem 1.5rem 3.5rem", textAlign: "center" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Title size={34} color="#fff">{title}</Title>
        {sub && <p style={{ color: "rgba(255,255,255,.7)", fontSize: 16, lineHeight: 1.75 }}>{sub}</p>}
      </div>
    </div>
  );
}

// -- Section wrapper --------------------------------------------------------
const Sec = ({ children, bg = C.white, id, style = {} }) => (
  <section id={id} style={{ padding: "4rem 1.5rem", background: bg, ...style }}>
    <div style={{ maxWidth: 1060, margin: "0 auto" }}>{children}</div>
  </section>
);

// -- SEED DATA --------------------------------------------------------------
const PROGRAMS = [
  { id: 1, slug: "beasiswa-generasi-rabbani", title: "Beasiswa Generasi Rabbani", cat: "education", desc: "Mendukung pendidikan siswa dhuafa berprestasi dari SD hingga perguruan tinggi dengan beasiswa penuh.", target: 500000000, collected: 347000000, img: "https://images.pexels.com/photos/7092613/pexels-photo-7092613.jpeg?auto=compress&cs=tinysrgb&w=600", icon: <GraduationCap size={20} color={C.biru} />, featured: true },
  { id: 2, slug: "layanan-kesehatan-gratis", title: "Layanan Kesehatan Gratis", cat: "health", desc: "Klinik keliling dan pengobatan gratis bagi dhuafa di daerah terpencil dan 3T.", target: 300000000, collected: 189000000, img: "https://images.pexels.com/photos/3259624/pexels-photo-3259624.jpeg?auto=compress&cs=tinysrgb&w=600", icon: <Heart size={20} color={C.hijau} />, featured: true },
  { id: 3, slug: "tanggap-bencana-nasional", title: "Tanggap Bencana Nasional", cat: "disaster", desc: "Respon cepat kemanusiaan dan pemulihan jangka panjang bagi korban bencana alam.", target: 600000000, collected: 521000000, img: "https://images.pexels.com/photos/2962405/pexels-photo-2962405.jpeg?auto=compress&cs=tinysrgb&w=600", icon: <Droplets size={20} color={C.red} />, featured: true },
  { id: 4, slug: "modal-usaha-dhuafa", title: "Modal Usaha Dhuafa", cat: "economy", desc: "Pemberdayaan ekonomi melalui modal bergulir, pelatihan, dan pendampingan UMKM.", target: 250000000, collected: 92000000, img: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600", icon: <Briefcase size={20} color={C.emas} />, featured: false },
  { id: 5, slug: "dakwah-pembinaan-umat", title: "Dakwah dan Pembinaan Umat", cat: "dakwah", desc: "Penguatan iman melalui majelis ilmu, rumah tahfidz, dan dai pelosok.", target: 400000000, collected: 214000000, img: "https://images.pexels.com/photos/7249337/pexels-photo-7249337.jpeg?auto=compress&cs=tinysrgb&w=600", icon: <BookOpen size={20} color={C.biruDk} />, featured: false },
];

const ARTICLES = [
  { id: 1, slug: "distribusi-air-bersih-ntt-2025", title: "Distribusi Air Bersih untuk 1.200 Warga di NTT", cat: "field_report", date: "12 Jul 2025", img: "https://images.pexels.com/photos/2962405/pexels-photo-2962405.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 2, slug: "beasiswa-2025-penerima", title: "48 Siswa Dhuafa Terima Beasiswa Penuh 2025/2026", cat: "program_update", date: "29 Jun 2025", img: "https://images.pexels.com/photos/7092613/pexels-photo-7092613.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 3, slug: "rumah-tahfidz-hafidz-baru", title: "Rumah Tahfidz LAZ Cetak 12 Hafidz Quran Baru", cat: "beneficiary_story", date: "2 Jun 2025", img: "https://images.pexels.com/photos/7249337/pexels-photo-7249337.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 4, slug: "klinik-papua-2025", title: "Klinik Keliling LAZ Layani 2.300 Warga di Papua", cat: "field_report", date: "10 Jun 2025", img: "https://images.pexels.com/photos/3259624/pexels-photo-3259624.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 5, slug: "modal-bergulir-surabaya", title: "87 Pedagang Kecil Surabaya Terima Modal Bergulir", cat: "field_report", date: "20 Jun 2025", img: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 6, slug: "masjid-kalteng-progress", title: "Pembangunan Masjid At-Taqwa Kalimantan Tengah Capai 70%", cat: "program_update", date: "5 Jul 2025", img: "https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg?auto=compress&cs=tinysrgb&w=600" },
];

const TESTIMONIALS = [
  { name: "Ahmad Rizaldi", role: "Pengusaha, Jakarta", type: "muzakki", initials: "AR", color: C.biru, quote: "Sudah 3 tahun berzakat di LAZ Darul Hikam. Laporannya detail dan ada foto penyalurannya. Zakat saya sampai ke tangan yang tepat." },
  { name: "Suwardi", role: "Petani, Banyumas", type: "mustahiq", initials: "SW", color: C.hijau, quote: "Berkat beasiswa dari LAZ, anak saya bisa melanjutkan sekolah. Tadinya hampir putus asa. Sekarang dia kelas 11 dan bercita-cita jadi dokter." },
  { name: "Fatimah Hasan", role: "HR Manager, Bandung", type: "muzakki", initials: "FH", color: C.emas, quote: "Kantor kami rutin berkolaborasi untuk CSR. Tim LAZ sangat responsif dan laporannya lengkap untuk ditunjukkan ke manajemen pusat." },
];

const DAMPAK = [
  { value: 47, suffix: "M+", label: "Dana Tersalurkan (Rp)" },
  { value: 127, suffix: "rb+", label: "Penerima Manfaat" },
  { value: 28, suffix: "", label: "Provinsi Terjangkau" },
  { value: 1200, suffix: "+", label: "Relawan Aktif" },
];

const REPORTS = [
  { id: 1, title: "Laporan Keuangan Tahunan 2024", type: "Tahunan", audit: "Diaudit KAP", size: "2.84 MB" },
  { id: 2, title: "Laporan Triwulan Q2 2025", type: "Triwulan", audit: "Review Internal", size: "1.12 MB" },
  { id: 3, title: "Laporan Triwulan Q1 2025", type: "Triwulan", audit: "Diaudit KAP", size: "1.08 MB" },
  { id: 4, title: "Laporan Keuangan Tahunan 2023", type: "Tahunan", audit: "Diaudit KAP", size: "2.65 MB" },
];

const CAT_LABELS = { field_report: "Laporan Lapangan", program_update: "Update Program", beneficiary_story: "Kisah Penerima", announcement: "Pengumuman", education: "Edukasi" };

// -- Program Card -----------------------------------------------------------
function ProgramCard({ p, go }) {
  const prog = pct(p.collected, p.target);
  return (
    <div style={{ background: C.white, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}`, display: "flex", flexDirection: "column" }}>
      <div style={{ height: 180, overflow: "hidden", position: "relative", flexShrink: 0 }}>
        <img src={p.img} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 10, left: 10, background: C.biruDk, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
          {p.cat === "education" ? "Pendidikan" : p.cat === "health" ? "Kesehatan" : p.cat === "disaster" ? "Darurat" : p.cat === "economy" ? "Ekonomi" : "Dakwah"}
        </div>
      </div>
      <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontFamily: "'Cabin',sans-serif", fontSize: 16, fontWeight: 700, color: C.teks, marginBottom: ".5rem", lineHeight: 1.3 }}>{p.title}</h3>
        <p style={{ fontSize: 13.5, color: C.teksMd, lineHeight: 1.65, flex: 1, marginBottom: "1rem" }}>{p.desc}</p>
        <div style={{ marginBottom: ".75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
            <span style={{ color: C.teksMt }}>Terkumpul</span>
            <span style={{ color: C.biru, fontWeight: 700 }}>{prog}%</span>
          </div>
          <div style={{ height: 7, background: C.biruLt, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${prog}%`, background: C.biru, borderRadius: 4 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.teksMt, marginTop: 4 }}>
            <span>{fmt(p.collected)}</span>
            <span>Target: {fmt(p.target)}</span>
          </div>
        </div>
        <button onClick={() => go("ziswaf")} style={{ width: "100%", padding: "10px", background: C.biru, color: "#fff", border: "none", borderRadius: 9, fontFamily: "'Cabin',sans-serif", fontWeight: 700, fontSize: 13.5 }}>
          Donasi Sekarang
        </button>
      </div>
    </div>
  );
}

// -- Article Card -----------------------------------------------------------
function ArticleCard({ a, go }) {
  return (
    <div onClick={() => go("kabar")} style={{ background: C.white, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, cursor: "pointer", transition: "box-shadow .2s" }}
      onMouseOver={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(50,104,195,.12)"}
      onMouseOut={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ height: 160, overflow: "hidden" }}>
        <img src={a.img} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ padding: "1rem" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.biru, textTransform: "uppercase", letterSpacing: "1px", marginBottom: ".4rem" }}>
          {CAT_LABELS[a.cat] || a.cat}
        </div>
        <h4 style={{ fontFamily: "'Cabin',sans-serif", fontSize: 14.5, fontWeight: 700, color: C.teks, lineHeight: 1.4, marginBottom: ".5rem" }}>{a.title}</h4>
        <div style={{ fontSize: 12, color: C.teksMt }}>{a.date}</div>
      </div>
    </div>
  );
}

// -- Count-Up Number --------------------------------------------------------
function CountUp({ target }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        let start = 0;
        const step = target / 60;
        const t = setInterval(() => {
          start += step;
          if (start >= target) { setN(target); clearInterval(t); }
          else setN(Math.floor(start));
        }, 25);
        obs.disconnect();
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{n.toLocaleString("id-ID")}</span>;
}

// -- BERANDA ----------------------------------------------------------------
function PgBeranda({ go }) {
  return (
    <div className="panim">
      {/* Hero */}
      <section style={{ background: C.biruDk, paddingTop: 100, paddingBottom: 56, paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 24, padding: "5px 14px", marginBottom: "1.25rem" }}>
              <ShieldCheck size={13} color={C.emas} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.9)", fontWeight: 600 }}>Resmi Kemenag RI - SK No. 792/2020</span>
            </div>
            <Title size={40} color="#fff">Zakat &amp; Sedekah Lebih Berdampak</Title>
            <p style={{ color: "rgba(255,255,255,.75)", fontSize: 16, lineHeight: 1.8, marginBottom: "2rem" }}>
              LAZ Darul Hikam menyalurkan zakat, infaq, sedekah, dan wakaf Anda secara transparan, akuntabel, dan tepat sasaran ke seluruh Indonesia.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Btn onClick={() => go("ziswaf")} style={{ padding: "14px 28px", fontSize: 15 }}>
                <Heart size={16} fill="#fff" /> Donasi Sekarang
              </Btn>
              <BtnOut dk onClick={() => go("program")} style={{ padding: "14px 28px", fontSize: 15 }}>
                Lihat Program
              </BtnOut>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {DAMPAK.map((d, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 12, padding: "1.25rem", textAlign: "center" }}>
                <div style={{ fontFamily: "'Cabin',sans-serif", fontSize: 28, fontWeight: 700, color: C.emas }}>
                  <CountUp target={d.value} />{d.suffix}
                </div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.65)", marginTop: 4 }}>{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <Sec bg={C.bg}>
        <Eyebrow>Program Unggulan</Eyebrow>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.75rem" }}>
          <Title>Program Kami</Title>
          <button onClick={() => go("program")} style={{ display: "flex", alignItems: "center", gap: 5, color: C.biru, background: "none", border: "none", fontWeight: 700, fontSize: 13.5 }}>
            Lihat Semua <ChevronRight size={15} />
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.25rem" }}>
          {PROGRAMS.filter(p => p.featured).map(p => <ProgramCard key={p.id} p={p} go={go} />)}
        </div>
      </Sec>

      {/* Core Values */}
      <Sec bg={C.white}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Eyebrow>Nilai Inti</Eyebrow>
          <Title>Mengapa Pilih LAZ Darul Hikam?</Title>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1.25rem" }}>
          {[
            { icon: <ShieldCheck size={24} color={C.biru} />, bg: C.biruLt, t: "Legalitas Resmi", d: "Berizin Kemenag RI SK No. 792/2020 dan anggota BAZNAS pusat." },
            { icon: <Eye size={24} color={C.hijau} />, bg: C.hijauLt, t: "Transparan 100%", d: "Laporan keuangan diaudit KAP independen dan dipublikasikan." },
            { icon: <Target size={24} color={C.emas} />, bg: C.emasLt, t: "Tepat Sasaran", d: "Penyaluran berdasarkan 8 asnaf dengan verifikasi ketat." },
            { icon: <TrendingUp size={24} color={C.biruMd} />, bg: C.biruLt, t: "Berdampak Nyata", d: "127.000+ penerima manfaat di 28 provinsi seluruh Indonesia." },
          ].map(v => (
            <div key={v.t} style={{ background: C.cream, borderRadius: 12, padding: "1.5rem", border: `1px solid ${C.border}` }}>
              <div style={{ width: 48, height: 48, background: v.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>{v.icon}</div>
              <h4 style={{ fontFamily: "'Cabin',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: ".4rem" }}>{v.t}</h4>
              <p style={{ fontSize: 13.5, color: C.teksMd, lineHeight: 1.65 }}>{v.d}</p>
            </div>
          ))}
        </div>
      </Sec>

      {/* Dampak */}
      <Sec bg={C.biruDk}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Eyebrow>Bukti Dampak</Eyebrow>
          <Title size={30} color="#fff">Angka yang Berbicara</Title>
          <p style={{ color: "rgba(255,255,255,.65)", fontSize: 15 }}>Data penyaluran terverifikasi hingga Juni 2025</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem" }}>
          {DAMPAK.map((d, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 12, padding: "2rem 1.5rem", textAlign: "center" }}>
              <div style={{ fontFamily: "'Cabin',sans-serif", fontSize: 36, fontWeight: 700, color: C.emas }}>
                <CountUp target={d.value} />{d.suffix}
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,.7)", marginTop: 6 }}>{d.label}</div>
            </div>
          ))}
        </div>
      </Sec>

      {/* Testimonials */}
      <Sec bg={C.white}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Eyebrow>Kisah Inspiratif</Eyebrow>
          <Title>Suara Mereka yang Merasakan Dampaknya</Title>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.25rem" }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{ background: C.cream, borderRadius: 14, padding: "1.75rem", border: `1px solid ${C.border}`, position: "relative" }}>
              <div style={{ fontSize: 48, color: C.biruLt, fontFamily: "'Cabin',sans-serif", fontWeight: 700, lineHeight: 1, marginBottom: ".5rem" }}>"</div>
              <p style={{ fontSize: 14.5, color: C.teksMd, lineHeight: 1.75, fontStyle: "italic", marginBottom: "1.5rem" }}>{t.quote}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cabin',sans-serif", fontWeight: 700, fontSize: 15, color: "#fff", flexShrink: 0 }}>{t.initials}</div>
                <div>
                  <div style={{ fontFamily: "'Cabin',sans-serif", fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 12.5, color: C.teksMt }}>{t.role}</div>
                  <div style={{ fontSize: 11, background: t.type === "muzakki" ? C.biruLt : C.emasLt, color: t.type === "muzakki" ? C.biru : C.emas, padding: "2px 8px", borderRadius: 20, display: "inline-block", marginTop: 3, fontWeight: 700 }}>
                    {t.type === "muzakki" ? "Muzakki" : "Mustahiq"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Sec>

      {/* Mitra */}
      <Sec bg={C.bg}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Eyebrow>Jaringan &amp; Kemitraan</Eyebrow>
          <Title>Dipercaya Lembaga Terkemuka</Title>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
          {["Bank Syariah Indonesia", "BAZNAS Pusat", "Kemensos RI", "Forum Zakat (FOZ)", "MUI Pusat", "Univ. Al-Azhar Indonesia", "PT Pertamina (Persero)", "RS Islam Jakarta"].map(m => (
            <div key={m} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 20px", fontSize: 13.5, fontWeight: 600, color: C.teksMd }}>
              {m}
            </div>
          ))}
        </div>
      </Sec>

      {/* Latest News */}
      <Sec bg={C.white}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.75rem" }}>
          <div>
            <Eyebrow>Kabar Kebaikan</Eyebrow>
            <Title>Berita &amp; Laporan Terbaru</Title>
          </div>
          <button onClick={() => go("kabar")} style={{ display: "flex", alignItems: "center", gap: 5, color: C.biru, background: "none", border: "none", fontWeight: 700, fontSize: 13.5 }}>
            Semua Berita <ChevronRight size={15} />
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.25rem" }}>
          {ARTICLES.slice(0, 3).map(a => <ArticleCard key={a.id} a={a} go={go} />)}
        </div>
      </Sec>

      {/* Kontak CTA */}
      <Sec bg={C.biruDk}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
          <Eyebrow>Hubungi Kami</Eyebrow>
          <Title size={30} color="#fff">Siap Berzakat Bersama Kami?</Title>
          <p style={{ color: "rgba(255,255,255,.7)", marginBottom: "2rem", fontSize: 15, lineHeight: 1.75 }}>
            Konsultasikan kebutuhan zakat dan donasi Anda dengan amil kami. Gratis, amanah, dan profesional.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={() => go("ziswaf")} style={{ padding: "13px 28px" }}>
              <Heart size={15} fill="#fff" /> Donasi Sekarang
            </Btn>
            <BtnOut dk onClick={() => go("kontak")} style={{ padding: "13px 28px" }}>
              Hubungi Kami
            </BtnOut>
          </div>
        </div>
      </Sec>
    </div>
  );
}

// -- TENTANG KAMI -----------------------------------------------------------
function PgTentang({ go }) {
  const TEAM = [
    { name: "Ust. Ahmad Habib, Lc.", title: "Direktur Utama", initials: "AH", color: C.biru },
    { name: "Sari Ramadhani, S.E.", title: "Direktur Keuangan", initials: "SR", color: C.hijau },
    { name: "M. Fauzi, S.Kom.", title: "Direktur Program", initials: "MF", color: C.emas },
    { name: "Rini Nurhayati, S.H.", title: "Direktur Legal", initials: "RN", color: C.biruMd },
  ];
  const LEGALITY = [
    { label: "SK Kemenag RI", value: "No. 792 Tahun 2020" },
    { label: "NPWP Lembaga", value: "31.284.XXX.X-441.000" },
    { label: "Akta Notaris", value: "AHU-0012XXX.AH.01.04.2012" },
    { label: "Reg. BAZNAS", value: "LAZ-BAZNAS-2020-044" },
  ];
  const TIMELINE = [
    { year: "2012", ev: "Pendirian LAZ oleh alumni Pesantren Darul Hikam" },
    { year: "2014", ev: "Program Beasiswa Generasi Rabbani pertama kali diluncurkan" },
    { year: "2017", ev: "Ekspansi program ke 15 provinsi seluruh Indonesia" },
    { year: "2020", ev: "Mendapat izin resmi Kemenag RI - SK No. 792/2020" },
    { year: "2022", ev: "100.000 penerima manfaat kumulatif tercapai" },
    { year: "2025", ev: "Beroperasi di 28 provinsi dengan 1.200+ relawan aktif" },
  ];
  return (
    <div className="panim">
      <PageHd eyebrow="Tentang Kami" title="Lembaga Zakat Terpercaya Sejak 2012" sub="Menyalurkan kebaikan Anda dengan amanah, transparan, dan terukur." />
      <Sec bg={C.white}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div>
            <Eyebrow>Sejarah Kami</Eyebrow>
            <Title>Dari Pesantren, Untuk Umat</Title>
            <p style={{ color: C.teksMd, lineHeight: 1.8, marginBottom: "1rem", fontSize: 15 }}>
              LAZ Darul Hikam lahir pada 2012 dari kepedulian alumni Pesantren Darul Hikam Bandung terhadap kondisi sosial-ekonomi umat. Berawal dari program beasiswa kecil, kini kami menjangkau 28 provinsi dengan lima pilar program utama.
            </p>
            <p style={{ color: C.teksMd, lineHeight: 1.8, fontSize: 15 }}>
              Setiap rupiah yang diamanahkan kepada kami dikelola dengan standar akuntansi PSAK Syariah, diaudit KAP independen, dan dilaporkan secara berkala kepada publik.
            </p>
          </div>
          <div style={{ display: "grid", gap: "1rem" }}>
            {TIMELINE.map(t => (
              <div key={t.year} style={{ display: "flex", gap: "1rem", alignItems: "start" }}>
                <div style={{ width: 52, height: 52, background: C.biruLt, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cabin',sans-serif", fontWeight: 700, fontSize: 13, color: C.biru, flexShrink: 0 }}>{t.year}</div>
                <div style={{ fontSize: 14, color: C.teksMd, lineHeight: 1.6, paddingTop: 4 }}>{t.ev}</div>
              </div>
            ))}
          </div>
        </div>
      </Sec>

      {/* Visi Misi */}
      <Sec bg={C.bg}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Eyebrow>Visi &amp; Misi</Eyebrow>
          <Title>Fondasi Kerja Kami</Title>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div style={{ background: C.biruDk, borderRadius: 14, padding: "2rem" }}>
            <div style={{ fontFamily: "'Cabin',sans-serif", fontSize: 13, fontWeight: 700, color: C.emas, letterSpacing: "2px", textTransform: "uppercase", marginBottom: ".75rem" }}>VISI</div>
            <p style={{ color: "rgba(255,255,255,.85)", fontSize: 15.5, lineHeight: 1.75, fontStyle: "italic" }}>
              "Menjadi lembaga amil zakat nasional terdepan dalam mewujudkan kemandirian umat melalui pengelolaan ZISWAF yang profesional dan berdampak nyata."
            </p>
          </div>
          <div style={{ background: C.white, borderRadius: 14, padding: "2rem", border: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: "'Cabin',sans-serif", fontSize: 13, fontWeight: 700, color: C.biru, letterSpacing: "2px", textTransform: "uppercase", marginBottom: ".75rem" }}>MISI</div>
            <ul style={{ paddingLeft: "1.1rem", color: C.teksMd, fontSize: 14.5, lineHeight: 1.8 }}>
              <li>Menghimpun ZISWAF secara transparan dan akuntabel</li>
              <li>Menyalurkan dana tepat sasaran kepada 8 asnaf</li>
              <li>Memberdayakan mustahiq menuju kemandirian</li>
              <li>Memperkuat ekosistem filantropi Islam Indonesia</li>
            </ul>
          </div>
        </div>
      </Sec>

      {/* Tim */}
      <Sec bg={C.white}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Eyebrow>Pengurus</Eyebrow>
          <Title>Tim Kepemimpinan</Title>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1.25rem" }}>
          {TEAM.map(t => (
            <div key={t.name} style={{ background: C.cream, borderRadius: 12, padding: "1.75rem", textAlign: "center", border: `1px solid ${C.border}` }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontFamily: "'Cabin',sans-serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>{t.initials}</div>
              <div style={{ fontFamily: "'Cabin',sans-serif", fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>{t.name}</div>
              <div style={{ fontSize: 13, color: C.teksMt }}>{t.title}</div>
            </div>
          ))}
        </div>
      </Sec>

      {/* Legalitas */}
      <Sec bg={C.bg}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Eyebrow>Legalitas</Eyebrow>
          <Title>Dokumen Resmi</Title>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem" }}>
          {LEGALITY.map(l => (
            <div key={l.label} style={{ background: C.white, borderRadius: 10, padding: "1.25rem", border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.biru}` }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: C.teksMt, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 }}>{l.label}</div>
              <div style={{ fontFamily: "'Cabin',sans-serif", fontSize: 15, fontWeight: 700, color: C.biruDk }}>{l.value}</div>
            </div>
          ))}
        </div>
      </Sec>
    </div>
  );
}

// -- PROGRAM ----------------------------------------------------------------
function PgProgram({ go }) {
  const HOW = [
    { n: "01", t: "Donasi Masuk", d: "Muzakki menyalurkan ZISWAF melalui kanal resmi LAZ.", icon: <DollarSign size={22} color={C.biru} /> },
    { n: "02", t: "Verifikasi &amp; Audit", d: "Dana diverifikasi amil dan dicatat secara transparan.", icon: <ShieldCheck size={22} color={C.hijau} /> },
    { n: "03", t: "Seleksi Penerima", d: "Mustahiq diseleksi ketat berdasarkan kriteria 8 asnaf.", icon: <Search size={22} color={C.emas} /> },
    { n: "04", t: "Penyaluran", d: "Dana disalurkan dan didokumentasikan dengan foto dan laporan.", icon: <CheckCircle2 size={22} color={C.biruDk} /> },
  ];
  return (
    <div className="panim">
      <PageHd eyebrow="Program" title="Lima Pilar Program Penyaluran" sub="Setiap program dirancang untuk memberikan dampak berkelanjutan bagi mustahiq." />
      <Sec bg={C.bg}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.25rem" }}>
          {PROGRAMS.map(p => <ProgramCard key={p.id} p={p} go={go} />)}
        </div>
      </Sec>
      <Sec bg={C.white}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Eyebrow>Mekanisme Penyaluran</Eyebrow>
          <Title>Bagaimana Dana Bekerja?</Title>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1.25rem" }}>
          {HOW.map(h => (
            <div key={h.n} style={{ background: C.cream, borderRadius: 12, padding: "1.5rem", textAlign: "center", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.biru, letterSpacing: "2px", marginBottom: ".75rem" }}>LANGKAH {h.n}</div>
              <div style={{ width: 52, height: 52, background: C.biruLt, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>{h.icon}</div>
              <div style={{ fontFamily: "'Cabin',sans-serif", fontSize: 14.5, fontWeight: 700, marginBottom: ".4rem" }} dangerouslySetInnerHTML={{ __html: h.t }} />
              <div style={{ fontSize: 13.5, color: C.teksMd, lineHeight: 1.6 }}>{h.d}</div>
            </div>
          ))}
        </div>
      </Sec>
    </div>
  );
}

// -- ZISWAF -----------------------------------------------------------------
function PgZiswaf() {
  const BANKS = [
    { bank: "Bank Syariah Indonesia (BSI)", no: "711 - 9XXX - XXXX", logo: "BSI" },
    { bank: "BCA Syariah", no: "090 - XXXX - XXX", logo: "BCA" },
    { bank: "Mandiri Syariah", no: "700 - XXXX - XXX", logo: "BSM" },
  ];
  const TYPES = [
    { t: "Zakat Penghasilan", d: "2,5% dari penghasilan bersih per bulan jika telah mencapai nisab setara 85gr emas.", c: C.biru },
    { t: "Zakat Maal", d: "2,5% dari total harta yang telah tersimpan selama setahun dan mencapai nisab.", c: C.biru },
    { t: "Zakat Fitrah", d: "Wajib ditunaikan di bulan Ramadan sebelum shalat Idul Fitri untuk setiap jiwa.", c: C.biru },
    { t: "Infaq &amp; Sedekah", d: "Pemberian sukarela di luar kewajiban zakat. Tidak ada batas minimal.", c: C.hijau },
    { t: "Wakaf Tunai", d: "Aset wakaf berupa uang tunai yang dikelola produktif untuk umat secara permanen.", c: C.emas },
    { t: "Fidyah", d: "Penggantian puasa yang tidak dapat dilakukan dengan memberi makan fakir miskin.", c: C.hijau },
  ];
  return (
    <div className="panim">
      <PageHd eyebrow="Layanan ZISWAF" title="Salurkan Zakat, Infaq, Sedekah &amp; Wakaf" sub="Tunaikan kewajiban dan raih keberkahan melalui kanal resmi LAZ Darul Hikam." />
      <Sec bg={C.bg}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "start" }}>
          {/* Guide */}
          <div>
            <Eyebrow>Panduan Donasi</Eyebrow>
            <Title>Cara Mudah Berzakat</Title>
            <p style={{ color: C.teksMd, lineHeight: 1.75, fontSize: 15, marginBottom: "1.5rem" }}>
              Salurkan ZISWAF Anda melalui tiga cara yang mudah, aman, dan terverifikasi oleh tim amil kami.
            </p>
            <div style={{ display: "grid", gap: "1rem", marginBottom: "1.75rem" }}>
              {[
                { n: "01", icon: <DollarSign size={20} color={C.biru} />, t: "Transfer Bank", d: "Transfer ke rekening resmi LAZ Darul Hikam, lalu konfirmasi via WhatsApp ke 0800-1-ZAKAT." },
                { n: "02", icon: <Globe size={20} color={C.hijau} />, t: "Portal Donasi Online", d: "Gunakan platform crowdfunding LAZ untuk donasi online dengan berbagai metode pembayaran digital." },
                { n: "03", icon: <MapPin size={20} color={C.emas} />, t: "Datang Langsung", d: "Kunjungi kantor kami di Jl. Darul Hikam No.1, Bandung pada hari kerja pukul 08.00-17.00 WIB." },
              ].map(s => (
                <div key={s.n} style={{ display: "flex", gap: "1rem", alignItems: "start", padding: "1rem", background: C.white, borderRadius: 10, border: `1px solid ${C.border}` }}>
                  <div style={{ width: 40, height: 40, background: C.biruLt, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.biru, letterSpacing: "1px", marginBottom: 2 }}>LANGKAH {s.n}</div>
                    <div style={{ fontFamily: "'Cabin',sans-serif", fontSize: 14.5, fontWeight: 700, color: C.teks, marginBottom: 3 }}>{s.t}</div>
                    <div style={{ fontSize: 13.5, color: C.teksMt, lineHeight: 1.65 }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* CTA */}
            <div style={{ background: C.biruDk, borderRadius: 12, padding: "1.5rem", textAlign: "center" }}>
              <div style={{ fontFamily: "'Cabin',sans-serif", fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: ".5rem" }}>Donasi Online Lebih Mudah</div>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.7)", marginBottom: "1rem", lineHeight: 1.6 }}>
                Akses portal donasi untuk memilih program, nominal, dan metode pembayaran favorit Anda.
              </p>
              <button style={{ background: C.emas, color: "#fff", border: "none", padding: "11px 24px", borderRadius: 9, fontFamily: "'Cabin',sans-serif", fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 7 }}>
                <Heart size={15} fill="#fff" /> Buka Portal Donasi
              </button>
            </div>
          </div>

          {/* Jenis ZISWAF */}
          <div>
            <Eyebrow>Jenis Layanan</Eyebrow>
            <Title>Pilih Jenis Ibadah Anda</Title>
            <div style={{ display: "grid", gap: ".7rem" }}>
              {TYPES.map(x => (
                <div key={x.t} style={{ display: "flex", gap: ".75rem", alignItems: "start", padding: ".9rem 1rem", background: C.white, borderRadius: 9, border: `1px solid ${C.border}` }}>
                  <CheckCircle2 size={16} color={x.c} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontFamily: "'Cabin',sans-serif", fontSize: 14, fontWeight: 700, color: C.teks, marginBottom: 2 }} dangerouslySetInnerHTML={{ __html: x.t }} />
                    <div style={{ fontSize: 13, color: C.teksMt, lineHeight: 1.6 }}>{x.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Sec>

      {/* Bank Accounts */}
      <Sec bg={C.white}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Eyebrow>Rekening Resmi</Eyebrow>
          <Title>Rekening Donasi Terpercaya</Title>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem", maxWidth: 760, margin: "0 auto" }}>
          {BANKS.map(r => (
            <div key={r.bank} style={{ background: C.cream, border: `1px solid ${C.border}`, borderRadius: 12, padding: "1.25rem" }}>
              <div style={{ display: "inline-block", background: C.biru, color: "#fff", fontFamily: "'Cabin',sans-serif", fontWeight: 700, fontSize: 11, padding: "3px 10px", borderRadius: 6, marginBottom: ".75rem" }}>{r.logo}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.teksMt, textTransform: "uppercase", letterSpacing: ".5px" }}>{r.bank}</div>
              <div style={{ fontFamily: "'Cabin',sans-serif", fontSize: 18, fontWeight: 700, color: C.biru, letterSpacing: 1, margin: ".25rem 0" }}>{r.no}</div>
              <div style={{ fontSize: 12, color: C.teksMt }}>a.n. LAZ Darul Hikam</div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 760, margin: "1.25rem auto 0", background: C.biruLt, borderRadius: 10, padding: ".9rem 1.25rem", display: "flex", alignItems: "center", gap: 10 }}>
          <AlertTriangle size={15} color={C.biru} />
          <span style={{ fontSize: 13.5, color: C.biruDk }}>LAZ Darul Hikam <strong>tidak memiliki rekening selain di atas</strong>. Harap waspada terhadap penipuan yang mengatasnamakan LAZ.</span>
        </div>
      </Sec>
    </div>
  );
}

// -- TRANSPARANSI -----------------------------------------------------------
function PgTransparansi() {
  const ALLOC = [
    { program: "Beasiswa Generasi Rabbani", pct: 32, color: C.biru },
    { program: "Tanggap Bencana Nasional", pct: 28, color: C.red },
    { program: "Layanan Kesehatan Gratis", pct: 18, color: C.hijau },
    { program: "Dakwah &amp; Pembinaan Umat", pct: 13, color: C.emas },
    { program: "Modal Usaha Dhuafa", pct: 9, color: C.biruMd },
  ];
  return (
    <div className="panim">
      <PageHd eyebrow="Transparansi" title="Keterbukaan adalah Kewajiban Kami" sub="Laporan keuangan dipublikasikan secara berkala dan diaudit oleh KAP independen." />
      <Sec bg={C.bg}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
          <div>
            <Eyebrow>Alokasi Dana</Eyebrow>
            <Title>Distribusi Penyaluran 2025</Title>
            <div style={{ display: "grid", gap: ".85rem" }}>
              {ALLOC.map(a => (
                <div key={a.program}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 5 }}>
                    <span style={{ fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: a.program }} />
                    <span style={{ color: a.color, fontWeight: 700 }}>{a.pct}%</span>
                  </div>
                  <div style={{ height: 10, background: C.border, borderRadius: 5, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${a.pct}%`, background: a.color, borderRadius: 5 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Eyebrow>Dampak Terukur</Eyebrow>
            <Title>Angka Kumulatif 2025</Title>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {DAMPAK.map((d, i) => (
                <div key={i} style={{ background: C.white, borderRadius: 10, padding: "1.25rem", border: `1px solid ${C.border}`, textAlign: "center" }}>
                  <div style={{ fontFamily: "'Cabin',sans-serif", fontSize: 28, fontWeight: 700, color: C.biru }}>{d.value}{d.suffix}</div>
                  <div style={{ fontSize: 12.5, color: C.teksMd, marginTop: 4 }}>{d.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Sec>

      {/* Reports */}
      <Sec bg={C.white}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Eyebrow>Laporan Keuangan</Eyebrow>
          <Title>Unduh Laporan Audit</Title>
        </div>
        <div style={{ display: "grid", gap: "1rem", maxWidth: 720, margin: "0 auto" }}>
          {REPORTS.map(r => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "1rem", background: C.cream, borderRadius: 10, padding: "1rem 1.25rem", border: `1px solid ${C.border}` }}>
              <div style={{ width: 44, height: 44, background: C.biruLt, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={20} color={C.biru} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Cabin',sans-serif", fontWeight: 700, fontSize: 14.5 }}>{r.title}</div>
                <div style={{ fontSize: 12.5, color: C.teksMt, marginTop: 2 }}>{r.type} | {r.audit} | {r.size}</div>
              </div>
              <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: C.biruLt, color: C.biru, border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                <Download size={14} /> Unduh
              </button>
            </div>
          ))}
        </div>
      </Sec>
    </div>
  );
}

// -- KABAR KEBAIKAN ---------------------------------------------------------
function PgKabar({ go }) {
  const [filter, setFilter] = useState("all");
  const CATS = [
    { id: "all", label: "Semua" },
    { id: "field_report", label: "Laporan" },
    { id: "program_update", label: "Update Program" },
    { id: "beneficiary_story", label: "Kisah" },
  ];
  const filtered = filter === "all" ? ARTICLES : ARTICLES.filter(a => a.cat === filter);
  return (
    <div className="panim">
      <PageHd eyebrow="Kabar Kebaikan" title="Berita, Laporan &amp; Kisah Penerima Manfaat" />
      <Sec bg={C.bg}>
        <div style={{ display: "flex", gap: ".5rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setFilter(c.id)} style={{
              padding: "7px 16px", borderRadius: 20, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
              background: filter === c.id ? C.biru : C.white,
              color: filter === c.id ? "#fff" : C.teksMd,
              border: `1.5px solid ${filter === c.id ? C.biru : C.border}`,
            }}>
              {c.label}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.25rem" }}>
          {filtered.map(a => <ArticleCard key={a.id} a={a} go={go} />)}
        </div>
      </Sec>
    </div>
  );
}

// -- KONTAK -----------------------------------------------------------------
function PgKontak() {
  const [open, setOpen] = useState(null);
  const FAQS = [
    { q: "Apakah LAZ Darul Hikam sudah berizin resmi?", a: "Ya, LAZ Darul Hikam mendapat izin resmi dari Kementerian Agama RI melalui SK No. 792 Tahun 2020 dan terdaftar sebagai anggota BAZNAS." },
    { q: "Bagaimana cara memastikan donasi saya sudah diterima?", a: "Anda akan menerima konfirmasi via email dan SMS. Status donasi juga dapat dicek melalui dashboard transparansi kami." },
    { q: "Apakah ada biaya administrasi dari donasi?", a: "Tidak ada potongan biaya administrasi. 100% dana yang Anda titipkan disalurkan; biaya operasional LAZ ditanggung dari pos amil." },
    { q: "Berapa minimal donasi yang bisa saya berikan?", a: "Tidak ada batas minimal donasi. Sekecil apapun yang Anda berikan, InsyaAllah akan berdampak bagi sesama." },
    { q: "Bisakah saya berdonasi secara anonim?", a: "Tentu bisa. Hubungi tim kami via WhatsApp dan minta opsi donasi anonim. Nama Anda tidak akan dicantumkan dalam laporan publik." },
  ];
  const CONTACTS = [
    { icon: <Phone size={18} color={C.biru} />, title: "Call Center", val: "0800-1-ZAKAT (Gratis)", sub: "Senin-Jumat, 08.00-17.00 WIB" },
    { icon: <Mail size={18} color={C.hijau} />, title: "Email", val: "cs@lazdarulhikam.org", sub: "Respon dalam 1x24 jam" },
    { icon: <MapPin size={18} color={C.emas} />, title: "Kantor Pusat", val: "Jl. Darul Hikam No.1", sub: "Kota Bandung, Jawa Barat 40133" },
    { icon: <Clock size={18} color={C.biruMd} />, title: "Jam Pelayanan", val: "Senin - Jumat", sub: "08.00 - 17.00 WIB" },
  ];
  return (
    <div className="panim">
      <PageHd eyebrow="Kontak" title="Hubungi Kami" sub="Kami siap membantu pertanyaan dan konsultasi ZISWAF Anda." />
      <Sec bg={C.bg}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "start" }}>
          {/* Contact Info + Map */}
          <div>
            <Eyebrow>Informasi Kontak</Eyebrow>
            <Title>Cara Menghubungi Kami</Title>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", marginBottom: "1.75rem" }}>
              {CONTACTS.map(c => (
                <div key={c.title} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1rem", display: "flex", gap: "1rem", alignItems: "start" }}>
                  <div style={{ width: 38, height: 38, background: C.biruLt, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: C.teksMt, textTransform: "uppercase", letterSpacing: ".5px" }}>{c.title}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.teks }}>{c.val}</div>
                    <div style={{ fontSize: 12, color: C.teksMt }}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* OpenStreetMap embed */}
            <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}` }}>
              <div style={{ background: C.biruLt, padding: ".75rem 1rem", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${C.border}` }}>
                <MapPin size={14} color={C.biru} />
                <span style={{ fontFamily: "'Cabin',sans-serif", fontWeight: 700, fontSize: 13.5, color: C.biruDk }}>Lokasi Kantor Pusat</span>
              </div>
              <iframe
                title="Lokasi LAZ Darul Hikam Bandung"
                src="https://www.openstreetmap.org/export/embed.html?bbox=107.5800%2C-6.9200%2C107.6300%2C-6.8700&layer=mapnik&marker=-6.8950%2C107.6050"
                style={{ width: "100%", height: 260, border: "none", display: "block" }}
                loading="lazy"
              />
            </div>
          </div>

          {/* FAQ */}
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <Title>Pertanyaan yang Sering Ditanyakan</Title>
            <div style={{ display: "grid", gap: ".6rem" }}>
              {FAQS.map((f, i) => (
                <div key={i} style={{ background: C.white, border: `1px solid ${open === i ? C.biru : C.border}`, borderRadius: 10, overflow: "hidden", transition: "border-color .15s" }}>
                  <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", padding: "1rem 1.1rem", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left", gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.teks, lineHeight: 1.4 }}>{f.q}</span>
                    {open === i ? <ChevronUp size={16} color={C.biru} style={{ flexShrink: 0 }} /> : <ChevronDown size={16} color={C.teksMt} style={{ flexShrink: 0 }} />}
                  </button>
                  {open === i && (
                    <div style={{ padding: ".25rem 1.1rem 1rem", fontSize: 14, color: C.teksMd, lineHeight: 1.7, borderTop: `1px solid ${C.biruLt}` }}>
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Sec>
    </div>
  );
}

// -- FOOTER -----------------------------------------------------------------
function Footer({ go }) {
  const BANKS = [
    { b: "Bank Syariah Indonesia", n: "711-9XXX-XXXX" },
    { b: "BCA Syariah", n: "090-XXXX-XXX" },
    { b: "Mandiri Syariah", n: "700-XXXX-XXX" },
  ];
  return (
    <footer style={{ background: C.biruDk, color: "#fff", padding: "3.5rem 1.5rem 2rem" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: "2.5rem", marginBottom: "2.5rem" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: "1rem" }}>
              <div style={{ width: 34, height: 34, background: C.biru, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Star size={16} color="#fff" fill="#fff" />
              </div>
              <div>
                <div style={{ fontFamily: "'Cabin',sans-serif", fontWeight: 700, fontSize: 14 }}>LAZ Darul Hikam</div>
                <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.4)" }}>SK Kemenag No. 792/2020</div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.6)", lineHeight: 1.75 }}>
              Lembaga Amil Zakat resmi yang menyalurkan ZISWAF secara transparan, akuntabel, dan berdampak nyata sejak 2012.
            </p>
          </div>
          {/* Program */}
          <div>
            <h4 style={{ fontFamily: "'Cabin',sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.9)", marginBottom: ".75rem", textTransform: "uppercase", letterSpacing: ".4px" }}>Program</h4>
            {["Beasiswa Generasi Rabbani", "Layanan Kesehatan Gratis", "Tanggap Bencana", "Modal Usaha Dhuafa", "Dakwah Umat"].map(l => (
              <div key={l} onClick={() => go("program")} style={{ fontSize: 13.5, color: "rgba(255,255,255,.55)", marginBottom: ".35rem", cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          {/* Layanan */}
          <div>
            <h4 style={{ fontFamily: "'Cabin',sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.9)", marginBottom: ".75rem", textTransform: "uppercase", letterSpacing: ".4px" }}>Layanan</h4>
            {[["ziswaf", "Bayar Zakat"], ["ziswaf", "Infaq dan Sedekah"], ["ziswaf", "Sedekah Jariyah"], ["transparansi", "Laporan Donasi"], ["kontak", "Hubungi Kami"]].map(([p, l], i) => (
              <div key={i} onClick={() => go(p)} style={{ fontSize: 13.5, color: "rgba(255,255,255,.55)", marginBottom: ".35rem", cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          {/* Rekening */}
          <div>
            <h4 style={{ fontFamily: "'Cabin',sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.9)", marginBottom: ".75rem", textTransform: "uppercase", letterSpacing: ".4px" }}>Rekening Resmi</h4>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,.5)", marginBottom: ".9rem", lineHeight: 1.6 }}>
              Salurkan donasi hanya melalui rekening resmi berikut.
            </p>
            {BANKS.map(r => (
              <div key={r.b} style={{ background: "rgba(255,255,255,.07)", borderRadius: 8, padding: ".7rem", marginBottom: ".5rem" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.45)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 2 }}>{r.b}</div>
                <div style={{ fontFamily: "'Cabin',sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: "1px" }}>{r.n}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 2 }}>a.n. LAZ Darul Hikam</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)" }}>
            &copy; 2025 LAZ Darul Hikam. Hak cipta dilindungi.
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)" }}>
            SK Kemenag No. 792/2020 | NPWP 31.284.XXX.X
          </div>
        </div>
      </div>
    </footer>
  );
}

// -- APP --------------------------------------------------------------------
export default function App() {
  const [page, setPage] = useState("beranda");

  const go = p => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = {
    beranda: <PgBeranda go={go} />,
    tentang: <PgTentang go={go} />,
    program: <PgProgram go={go} />,
    ziswaf: <PgZiswaf />,
    transparansi: <PgTransparansi />,
    kabar: <PgKabar go={go} />,
    kontak: <PgKontak />,
  };

  return (
    <div style={{ fontFamily: "'Albert Sans',sans-serif", background: C.bg, minHeight: "100vh" }}>
      <style>{CSS}</style>
      <Navbar page={page} go={go} />
      <div style={{ paddingTop: 64 }}>
        {pages[page] || pages.beranda}
        <Footer go={go} />
      </div>
    </div>
  );
}
