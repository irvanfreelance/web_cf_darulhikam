# Product Requirements Document — Public Website
# LAZ Darul Hikam

**Version:** 2.0  
**Scope:** Public-facing website only (7 routes, SSR/SSG/ISR, SEO-first).  
**Companion docs:** `prd-admin.md` · `crowdfunding-portal.md`  
**Stack:** Next.js 15 · TypeScript · PostgreSQL 16 (Neon) · Drizzle ORM · Tailwind CSS v4 · Vercel · Cloudflare R2

---

## 1. Executive Summary

LAZ Darul Hikam is a licensed Indonesian Zakat institution (*Lembaga Amil Zakat*) under Ministry of Religious Affairs permit SK No. 792/2020. This document specifies the **public website** — 7 SSR/SSG routes fully optimized for search engine indexing, social sharing, and Core Web Vitals.

> **JSX Artifact Notice:** `LAZDarulHikam.jsx` is a single-file React SPA used only as a visual design and component reference. It is **not** the production implementation. Production code uses Next.js App Router with proper SSR, individual route files, `generateMetadata()`, and no client-side routing between pages.

> **Crowdfunding Notice:** Donation forms, payment gateway, transaction flows, and campaign pages are out of scope — see `crowdfunding-portal.md`. The crowdfunding platform shares the same PostgreSQL database using the `cf_` table prefix.

---

## 2. Why SSR, Not SPA

| Concern | SPA (JSX artifact) | SSR (Next.js production) |
|---|---|---|
| Google indexing | JS must execute before content exists | HTML fully rendered at request time |
| Unique `<title>` per page | One `<title>` for all routes | `generateMetadata()` per route file |
| `og:image`, `og:title` for WhatsApp/Twitter | Missing or generic | Per-page in `metadata` export |
| Article URL shareable | `/#kabar` not a real URL | `/kabar-kebaikan/[slug]` real route |
| Back button / bookmarking | Broken or simulated | Native browser behavior |
| Core Web Vitals (LCP) | JS bundle must load first | HTML streamed, no JS required for initial paint |
| `sitemap.xml` | Manual, static | Auto-generated from DB via `app/sitemap.ts` |
| Structured data JSON-LD | Cannot inject per-article | `<script type="application/ld+json">` in `<head>` |
| Canonical URLs | Not possible | `<link rel="canonical">` per route |

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────┐
│              Next.js 15 — App Router                 │
│                                                     │
│   PUBLIC ROUTES (SSR / SSG / ISR)                   │
│   /                    → ISR 5min                   │
│   /tentang-kami        → SSG                        │
│   /program             → ISR 5min                   │
│   /program/[slug]      → ISR 10min                  │
│   /layanan-ziswaf      → SSG                        │
│   /transparansi        → ISR 1h                     │
│   /kabar-kebaikan      → ISR 2min                   │
│   /kabar-kebaikan/[slug] → ISR 10min                │
│   /kontak              → SSG                        │
│   /sitemap.xml         → Dynamic (no cache)         │
│   /robots.txt          → Static file                │
└─────────────────────────────────────────────────────┘
              │
     ┌────────┼─────────┐
     ▼        ▼         ▼
PostgreSQL  Redis     Cloudflare R2
(web_* tables) (ISR cache)  (Images/PDFs)
```

**On-demand revalidation:** CMS writes call `revalidatePath()` via Server Actions, purging ISR cache for affected routes instantly.

---

## 4. Rendering Strategy — Per Route

| Route | Mode | Justification | TTL / Trigger |
|-------|------|--------------|---------------|
| `/` | ISR | Featured programs, counters, latest 3 articles all change | 5 min; on-demand on CMS save |
| `/tentang-kami` | SSG | Team, history, legal docs change rarely | Rebuild on `revalidatePath` from admin |
| `/program` | ISR | `collected_amount` updated monthly | 5 min; on-demand |
| `/program/[slug]` | ISR | Program detail may update | 10 min; on-demand |
| `/layanan-ziswaf` | SSG | Bank accounts are quasi-static | `revalidatePath` on bank account change |
| `/transparansi` | ISR | Reports quarterly; counters monthly | 1 hour; on-demand |
| `/kabar-kebaikan` | ISR | New articles published daily/weekly | 2 min; on-demand on publish |
| `/kabar-kebaikan/[slug]` | ISR | Article content updates | 10 min; on-demand on publish/update |
| `/kontak` | SSG | FAQ changes monthly | `revalidatePath` on FAQ change |
| `/sitemap.xml` | Dynamic | Always reflects current published content | Real-time DB query |
| `/robots.txt` | Static | Never changes | ∞ |

### ISR On-Demand Flow

```
Admin CMS save (Server Action)
  → write to DB
  → revalidatePath('/kabar-kebaikan')
  → revalidatePath('/kabar-kebaikan/' + slug)
  → revalidatePath('/')
  → return success to CMS editor
→ Next request serves fresh HTML within milliseconds
```

---

## 5. Routes & Data Sources

| # | Route | Primary DB Query | Key Sections |
|---|-------|-----------------|--------------|
| 1 | `/` | `v_active_programs` (featured=3), `web_articles` (latest 3), `web_impact_metrics`, `web_testimonials` (3), `web_partners` | Hero, Intro, Programs, ZISWAF CTA, Values, Impact, Testimonials, Partners, Latest News, Contact CTA |
| 2 | `/tentang-kami` | `web_team_members`, `web_legality` | History timeline, Visi Misi, Board, Legality |
| 3 | `/program` | `v_active_programs` (all) | All program cards with progress bars |
| 4 | `/program/[slug]` | `web_programs` by slug | Program detail, related articles |
| 5 | `/layanan-ziswaf` | `web_bank_accounts` | ZISWAF guide, bank accounts, WhatsApp CTA |
| 6 | `/transparansi` | `web_financial_reports`, `web_impact_metrics`, `web_fund_allocations` | Allocation chart, report downloads, counters |
| 7 | `/kabar-kebaikan` | `v_published_articles` paginated | Article grid, category filter |
| 8 | `/kabar-kebaikan/[slug]` | `v_published_articles` by slug | Article body (Tiptap HTML), JSON-LD |
| 9 | `/kontak` | `web_faqs` | Contact cards, OpenStreetMap embed, FAQ accordion |

---

## 6. SEO Implementation

### 6.1 `generateMetadata()` — Per Route

```typescript
// app/(public)/kabar-kebaikan/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  return {
    title: article.seo_title ?? article.title,
    description: article.seo_description ?? article.excerpt,
    alternates: {
      canonical: article.canonical_url ?? `https://lazdarulhikam.org/kabar-kebaikan/${article.slug}`,
    },
    openGraph: {
      title: article.seo_title ?? article.title,
      description: article.seo_description ?? article.excerpt,
      type: "article",
      publishedTime: article.published_at?.toISOString(),
      images: [{
        url: article.og_image_url ?? article.featured_image_url ?? DEFAULT_OG,
        width: article.featured_image_width ?? 1200,
        height: article.featured_image_height ?? 630,
        alt: article.og_image_alt ?? article.featured_image_alt,
      }],
    },
    twitter: {
      card: article.twitter_card_type ?? "summary_large_image",
      title: article.twitter_title ?? article.seo_title ?? article.title,
      description: article.twitter_description ?? article.excerpt,
    },
    robots: article.robots_directive ?? "index,follow",
  };
}
```

### 6.2 Metadata Fallback Chain

```
<title>          → seo_title  → title (≤70 chars, required)
meta description → seo_description → excerpt (≤160 chars, required)
og:image         → og_image_url → featured_image_url → DEFAULT_OG_IMAGE
canonical        → canonical_url → auto-generated from slug
robots           → robots_directive → "index,follow" (default)
```

### 6.3 Structured Data JSON-LD

| Route | Schema Type | Key Fields |
|-------|------------|-----------|
| `/` | `Organization` | name, url, logo, contactPoint, sameAs |
| `/kabar-kebaikan/[slug]` | `NewsArticle` | headline, author, datePublished, image, publisher |
| `/program` | `ItemList` | ListItem per active program |
| `/tentang-kami` | `Organization` + `Person[]` | name, jobTitle per team member |
| `/kontak` | `LocalBusiness` + `FAQPage` | address, telephone, openingHours, FAQs |
| `/transparansi` | `Dataset` | name, description, PDF distribution links |

### 6.4 Sitemap (`/sitemap.xml`)

Auto-generated from DB on every request — not a static file.

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await db.select().from(web_articles)
    .where(and(eq(web_articles.status, "published"), isNull(web_articles.deleted_at)));
  return [
    { url: "https://lazdarulhikam.org/", changeFrequency: "daily", priority: 1.0 },
    { url: "https://lazdarulhikam.org/program", changeFrequency: "weekly", priority: 0.9 },
    { url: "https://lazdarulhikam.org/kabar-kebaikan", changeFrequency: "daily", priority: 0.9 },
    ...articles.map(a => ({
      url: `https://lazdarulhikam.org/kabar-kebaikan/${a.slug}`,
      lastModified: a.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
```

### 6.5 `robots.txt`

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://lazdarulhikam.org/sitemap.xml
```

### 6.6 `next/image` Enforcement

- All images use `next/image` — raw `<img>` banned via ESLint `@next/next/no-img-element`
- `priority={true}` on hero/LCP images per page
- `width` + `height` stored in DB to prevent CLS (Core Web Vital)
- WebP served automatically via Vercel Image Optimization
- `sizes` prop set per breakpoint

---

## 7. Article Page — Body Rendering

```typescript
// app/(public)/kabar-kebaikan/[slug]/page.tsx
export default async function ArticlePage({ params }) {
  const article = await getArticleBySlug(params.slug);  // server-side
  if (!article) notFound();
  const safeHtml = sanitizeArticleBody(article.body);    // DOMPurify server-side

  return (
    <article>
      <h1>{article.title_long ?? article.title}</h1>
      <Image
        src={article.featured_image_url}
        alt={article.featured_image_alt}
        width={article.featured_image_width}
        height={article.featured_image_height}
        priority
        sizes="(max-width: 768px) 100vw, 1000px"
      />
      <div className="article-body prose"
        dangerouslySetInnerHTML={{ __html: safeHtml }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleJsonLd(article)) }} />
    </article>
  );
}
```

**Sanitization rules (DOMPurify server-side):**
- Allowed: `<h2>`–`<h4>`, `<p>`, `<ul>`, `<ol>`, `<li>`, `<strong>`, `<em>`, `<a>`, `<img>`, `<figure>`, `<figcaption>`, `<blockquote>`, `<iframe>` (YouTube only, allowlist)
- YouTube `<iframe>`: wrapped in `<div class="video-embed">`, `loading="lazy"` added
- `<img>` in body replaced with `<Image>` via HTML parser

---

## 8. Server vs Client Components

**Rule:** Default Server Component. Mark `'use client'` only when strictly required.

| Requires `'use client'` | Stay Server Component |
|---|---|
| `useState`, `useEffect`, `useRef` | DB fetch (async/await in component) |
| `onClick`, `onChange` events | `generateMetadata()` |
| Tiptap editor | Article HTML rendering |
| Count-up animation (IntersectionObserver) | Image with `next/image` |
| CSS marquee animation controls | JSON-LD script injection |
| Category filter (URL params) | Static layout sections |

**Boundary example:**
```
page.tsx (Server — fetches metrics from DB)
  └── ImpactSection.tsx (Server)
        └── CountUpNumber.tsx ('use client' — animation only)
```

---

## 9. Folder Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root: fonts, analytics, global meta
│   ├── sitemap.ts                    # Dynamic sitemap from DB
│   ├── robots.ts                     # Or /public/robots.txt
│   ├── not-found.tsx                 # SSG 404
│   ├── error.tsx                     # Client error boundary
│   │
│   └── (public)/                     # Route group — public layout
│       ├── layout.tsx                # Navbar + Footer (server components)
│       ├── page.tsx                  # /  — Home (ISR)
│       ├── tentang-kami/page.tsx     # SSG
│       ├── program/
│       │   ├── page.tsx              # ISR — program listing
│       │   └── [slug]/page.tsx       # ISR — program detail
│       ├── layanan-ziswaf/page.tsx   # SSG
│       ├── transparansi/page.tsx     # ISR 1h
│       ├── kabar-kebaikan/
│       │   ├── page.tsx              # ISR 2min — article listing
│       │   └── [slug]/page.tsx       # ISR 10min — article detail
│       └── kontak/page.tsx           # SSG
│
├── components/public/
│   ├── layout/Navbar.tsx             # Server component
│   ├── layout/Footer.tsx             # Server component
│   ├── home/HeroSection.tsx
│   ├── home/ImpactSection.tsx        # Server; child CountUpNumber is 'use client'
│   ├── home/MitraMarquee.tsx         # 'use client' (CSS animation)
│   ├── articles/ArticleCard.tsx
│   ├── articles/ArticleBody.tsx      # Renders sanitized Tiptap HTML
│   ├── articles/CategoryFilter.tsx   # 'use client' (URL param filter)
│   └── programs/ProgramCard.tsx
│
├── lib/
│   ├── db/index.ts                   # Drizzle + Neon HTTP
│   ├── db/schema.ts                  # Matches web_* tables
│   ├── db/queries/articles.ts
│   ├── db/queries/programs.ts
│   ├── seo/metadata.ts               # generateMetadata helpers
│   ├── seo/jsonld.ts                 # Schema.org builders
│   ├── content/sanitize.ts           # DOMPurify server-side
│   └── content/readTime.ts
│
└── constants/
    ├── site.ts                       # BASE_URL, SITE_NAME, DEFAULT_OG (STATIC)
    ├── nav.ts                        # NAV_ITEMS (STATIC)
    └── legal.ts                      # SK_NUMBER, NPWP (STATIC)
```

---

## 10. Non-Functional Requirements

| Requirement | Target |
|---|---|
| LCP (mobile 4G) | < 1.5s |
| CLS | < 0.1 (enforced by `next/image` with width/height) |
| INP | < 200ms (minimal client JS on public pages) |
| Accessibility | WCAG 2.1 AA |
| SEO | Every route: unique `<title>`, `<meta description>`, `og:image`, `canonical`, JSON-LD |
| Sitemap | Auto-updated on every article publish |
| TypeScript | Strict mode; no `any` |
| No raw `<img>` | ESLint `@next/next/no-img-element` error |
| Image format | WebP via Vercel Image Optimization |

---

## 11. Out of Scope

| Feature | Document |
|---|---|
| CMS admin portal | `prd-admin.md` |
| Donation forms, payment gateway | `crowdfunding-portal.md` |
| Crowdfunding campaign pages | `crowdfunding-portal.md` |
| Donor dashboard | `crowdfunding-portal.md` |
| BAZNAS regulatory API | `regulatory-integration.md` |
