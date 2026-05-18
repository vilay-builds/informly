// Server-only NewsData.io wrapper with aggressive caching.
// Free tier: 200 requests/day. We cache lists for 10 min, individual articles
// indefinitely (in memory) so we only ever pay for fresh-list fetches.

import "server-only";

export interface NewsDataArticle {
  article_id: string;
  title: string;
  link: string;
  description: string | null;
  content: string | null;
  pubDate: string;
  image_url: string | null;
  source_id: string;
  source_name?: string;
  source_priority?: number;
  country?: string[];
  category?: string[];
  language?: string;
  creator?: string[] | null;
}

export interface NormalizedArticle {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  source: string;
  pubDate: string;
  timeAgo: string;
  image: string;
  link: string;
  aiSummary: string;
  body: string;
  language: string;
}

const NEWSDATA_BASE = "https://newsdata.io/api/1/latest";

const CATEGORY_COLORS: Record<string, string> = {
  business: "#0ea5e9",
  technology: "#5b6ef2",
  science: "#a855f7",
  health: "#f04e1a",
  politics: "#dc2626",
  sports: "#16a34a",
  entertainment: "#ec4899",
  world: "#8b5cf6",
  environment: "#22c55e",
  top: "#f59e0b",
  other: "#6b7194",
};

const CATEGORY_LABELS: Record<string, string> = {
  business: "Business",
  technology: "Technology",
  science: "Science",
  health: "Health",
  politics: "Politics",
  sports: "Sports",
  entertainment: "Culture",
  world: "World",
  environment: "Climate",
  top: "Top Stories",
  other: "News",
};

// Article cache: id → article. Persists for the lifetime of the function instance.
const articleCache = new Map<string, NormalizedArticle>();
const MAX_CACHE = 500;

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso.replace(" ", "T") + "Z").getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function pickCategory(cats?: string[]): {
  label: string;
  color: string;
  key: string;
} {
  const key = (cats && cats[0]) || "other";
  return {
    key,
    label: CATEGORY_LABELS[key] ?? "News",
    color: CATEGORY_COLORS[key] ?? CATEGORY_COLORS.other,
  };
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&q=80";

function normalize(a: NewsDataArticle): NormalizedArticle {
  const cat = pickCategory(a.category);
  const body =
    a.content && a.content.length > 200
      ? a.content
      : `${a.description ?? ""}\n\nRead more at ${a.source_name ?? a.source_id}.`;
  return {
    id: a.article_id,
    title: a.title,
    category: cat.label,
    categoryColor: cat.color,
    source: a.source_name ?? a.source_id,
    pubDate: a.pubDate,
    timeAgo: relativeTime(a.pubDate),
    image: a.image_url || FALLBACK_IMAGE,
    link: a.link,
    aiSummary: a.description ?? "",
    body,
    language: a.language ?? "english",
  };
}

interface FetchListOpts {
  country?: "us" | "in" | "gb" | "global";
  category?: string;
  q?: string;
  size?: number;
}

/**
 * Fetch a list of latest articles. Cached at the Next.js fetch layer
 * for 10 minutes — multiple concurrent renders share one network call.
 */
export async function fetchLatestNews(
  opts: FetchListOpts = {}
): Promise<NormalizedArticle[]> {
  const key = process.env.NEWSDATA_API_KEY;
  if (!key) {
    console.warn("NEWSDATA_API_KEY not set, returning empty list");
    return [];
  }

  const params = new URLSearchParams({
    apikey: key,
    language: "en",
    size: String(opts.size ?? 10),
    image: "1",
    removeduplicate: "1",
  });
  if (opts.country && opts.country !== "global") {
    params.set("country", opts.country);
  }
  if (opts.category) params.set("category", opts.category);
  if (opts.q) params.set("q", opts.q);

  const url = `${NEWSDATA_BASE}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 600, tags: ["news"] },
    });
    if (!res.ok) {
      console.error("NewsData error", res.status, await res.text());
      return [];
    }
    const data = (await res.json()) as {
      status: string;
      results?: NewsDataArticle[];
    };
    if (data.status !== "success" || !data.results) return [];

    const normalized = data.results
      .filter((a) => a.title && a.article_id)
      .map(normalize);

    // Populate cache
    for (const a of normalized) {
      if (articleCache.size >= MAX_CACHE) {
        const firstKey = articleCache.keys().next().value;
        if (firstKey) articleCache.delete(firstKey);
      }
      articleCache.set(a.id, a);
    }

    return normalized;
  } catch (err) {
    console.error("NewsData fetch failed", err);
    return [];
  }
}

/**
 * Fetch by id. Hits the in-memory cache; if missing, refreshes the latest
 * list and looks again. If still missing, returns null.
 */
export async function fetchArticleById(
  id: string
): Promise<NormalizedArticle | null> {
  if (articleCache.has(id)) return articleCache.get(id) ?? null;
  await fetchLatestNews({ size: 50 });
  await fetchLatestNews({ country: "in", size: 30 });
  await fetchLatestNews({ country: "us", size: 30 });
  return articleCache.get(id) ?? null;
}

/**
 * Compose the "feed" by mixing global + region-specific results.
 * Region-aware so India users see India-relevant content alongside global.
 */
export async function fetchFeedNews(
  region: "us" | "in" = "in"
): Promise<NormalizedArticle[]> {
  const [regional, global] = await Promise.all([
    fetchLatestNews({ country: region, size: 10 }),
    fetchLatestNews({ size: 10 }),
  ]);
  const seen = new Set<string>();
  const merged: NormalizedArticle[] = [];
  for (const a of [...regional, ...global]) {
    if (seen.has(a.id)) continue;
    seen.add(a.id);
    merged.push(a);
  }
  return merged;
}

export { CATEGORY_COLORS, CATEGORY_LABELS };
