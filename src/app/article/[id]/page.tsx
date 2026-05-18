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

  // If we couldn't resolve the article, redirect home with a soft message
  // rather than a hard 404 — most likely the article rolled off the
  // free-tier feed window.
  if (!article) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-6 text-center">
        <div className="max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-surface-secondary flex items-center justify-center text-text-tertiary mx-auto mb-5">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-text-primary mb-2 font-[family-name:var(--font-display)]">
            This story has rolled off the feed
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed mb-5">
            Older articles can disappear from our free news feed as fresher ones come in. Head back to today&apos;s feed to keep reading.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary-500 text-white text-sm font-semibold"
          >
            Back to your feed
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  const explanation = await explainArticle({
    id: article.id,
    title: article.title,
    aiSummary: article.aiSummary,
    body: article.body,
    source: article.source,
  });

  // Use Gemini's expanded body when source is thin (under ~500 chars)
  const sourceBody = article.body.trim();
  const useExpanded =
    sourceBody.length < 500 && explanation.expandedBody && explanation.expandedBody.length > sourceBody.length;
  const finalBody = useExpanded ? explanation.expandedBody : sourceBody;

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
    body: finalBody,
    readTime: estimateReadTime(finalBody),
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
