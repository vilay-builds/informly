import { fetchFeedNews } from "@/lib/api/news";
import DiscoverView, { DiscoverCard } from "./DiscoverView";

export const dynamic = "force-dynamic";
export const revalidate = 600;

export default async function DiscoverPage() {
  const articles = await fetchFeedNews("in");
  const cards: DiscoverCard[] = articles.slice(0, 12).map((a) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    aiSummary: a.aiSummary || "Tap to read the full story.",
    source: a.source,
    timeAgo: a.timeAgo,
    image: a.image,
  }));

  return <DiscoverView cards={cards} />;
}
