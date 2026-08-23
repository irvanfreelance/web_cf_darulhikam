import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIDR(amount: number | null | undefined): string {
  if (amount == null) return "Rp 0";
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function truncateText(text: string | null | undefined, length: number): string {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

const HTML_ENTITIES: Record<string, string> = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'",
};

// Rich-text fields (campaign description, article body) are stored as HTML for the
// full detail view. Card previews need a plain-text excerpt — this strips tags/entities
// and collapses whitespace so every card gets a clean, consistently truncated summary.
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  const withoutTags = html.replace(/<[^>]*>/g, ' ');
  const decoded = withoutTags.replace(/&[a-zA-Z#0-9]+;/g, (m) => HTML_ENTITIES[m] ?? ' ');
  return decoded.replace(/\s+/g, ' ').trim();
}
