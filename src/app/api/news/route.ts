import { NextRequest, NextResponse } from "next/server";
import { fetchFeedNews } from "@/lib/api/news";

export const revalidate = 600;

export async function GET(req: NextRequest) {
  const region = (req.nextUrl.searchParams.get("region") || "in") as "us" | "in";
  const articles = await fetchFeedNews(region);
  return NextResponse.json({ articles });
}
