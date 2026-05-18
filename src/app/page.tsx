import { fetchFeedNews } from "@/lib/api/news";
import FeedView, { FeedArticle } from "./FeedView";

function estimateReadTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const dynamic = "force-dynamic";
export const revalidate = 600;

export default async function HomePage() {
  // Default to India + Global mix at the server (free-tier-safe).
  const live = await fetchFeedNews("in");

  const articles: FeedArticle[] = live
    .filter((a) => a.title && a.image)
    .slice(0, 14)
    .map((a) => ({
      id: a.id,
      title: a.title,
      category: a.category,
      categoryColor: a.categoryColor,
      source: a.source,
      timeAgo: a.timeAgo,
      image: a.image,
      aiSummary: a.aiSummary || "",
      readTime: estimateReadTime(a.body),
    }));

  // Featured carousel takes only articles that have real news-provided images
  // (not category fallbacks), so the For You section always looks great.
  const featured = articles.slice(0, 5);
  const rest = articles.slice(5);

  return <FeedView articles={rest} featured={featured} />;
}
