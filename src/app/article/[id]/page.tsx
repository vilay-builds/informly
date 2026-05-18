import { notFound } from "next/navigation";
import { fetchArticleById, fetchLatestNews, NormalizedArticle } from "@/lib/api/news";
import { explainArticle } from "@/lib/api/gemini";
import { getArticleById as getStaticArticle } from "@/lib/content/articles";
import ArticleView, { ArticleData } from "./ArticleView";

export const dynamic = "force-dynamic";

function estimateReadTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);

  // Try live NewsData article first
  let article: NormalizedArticle | null = await fetchArticleById(id);

  // Fall back to static catalog (used by Brief, Discover, etc.)
  if (!article) {
    const stat = getStaticArticle(id);
    if (stat) {
      article = {
        id: stat.id,
        title: stat.title,
        category: stat.category,
        categoryColor: stat.categoryColor,
        source: stat.source,
        pubDate: new Date().toISOString(),
        timeAgo: stat.timeAgo,
        image: stat.image,
        link: "#",
        aiSummary: stat.aiSummary,
        body: stat.body,
        language: "english",
      };
    }
  }

  if (!article) notFound();

  const explanation = await explainArticle({
    id: article.id,
    title: article.title,
    aiSummary: article.aiSummary,
    body: article.body,
    source: article.source,
  });

  const articleData: ArticleData = {
    id: article.id,
    title: article.title,
    category: article.category,
    categoryColor: article.categoryColor,
    source: article.source,
    timeAgo: article.timeAgo,
    image: article.image,
    link: article.link,
    aiSummary: explanation.aiSummary || article.aiSummary,
    body: article.body,
    readTime: estimateReadTime(article.body),
    relatedTopics: explanation.relatedTopics ?? [],
    levels: explanation.levels,
  };

  const latest = await fetchLatestNews({ size: 12 });
  const related = latest
    .filter((a) => a.id !== article!.id)
    .slice(0, 3)
    .map((a) => ({
      id: a.id,
      title: a.title,
      category: a.category,
      categoryColor: a.categoryColor,
      image: a.image,
    }));

  return <ArticleView article={articleData} related={related} />;
}
