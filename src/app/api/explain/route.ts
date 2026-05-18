import { NextRequest, NextResponse } from "next/server";
import { fetchArticleById } from "@/lib/api/news";
import { explainArticle } from "@/lib/api/gemini";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { id: string };
  if (!body.id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const article = await fetchArticleById(body.id);
  if (!article) {
    return NextResponse.json({ error: "article not found" }, { status: 404 });
  }

  const explanation = await explainArticle({
    id: article.id,
    title: article.title,
    aiSummary: article.aiSummary,
    body: article.body,
    source: article.source,
  });

  return NextResponse.json({ explanation });
}
