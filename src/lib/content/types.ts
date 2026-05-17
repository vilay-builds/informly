export type Category =
  | "AI & Technology"
  | "Climate"
  | "Economy"
  | "Markets"
  | "Health"
  | "World"
  | "Business"
  | "Politics"
  | "Science"
  | "Culture";

export interface ExplainedLevel {
  meaning: string;
  context: string;
  impact: string;
}

export interface Article {
  id: string;
  title: string;
  category: Category;
  categoryColor: string;
  source: string;
  timeAgo: string;
  image: string;
  aiSummary: string;
  body: string; // newline-separated paragraphs
  explained: [ExplainedLevel, ExplainedLevel, ExplainedLevel, ExplainedLevel];
  relatedTopics: string[];
  relatedArticleIds: string[];
}

export type SignalType = "bullish" | "bearish" | "neutral";

export interface StockMetric {
  label: string;
  value: string;
  explanation: string;
}

export interface StockStat {
  label: string;
  value: string;
}

export interface StockNews {
  title: string;
  timeAgo: string;
  articleId?: string;
}

export interface Stock {
  ticker: string;
  name: string;
  region: "us" | "india";
  currency: "$" | "₹";
  price: number;
  change: number;
  signal: SignalType;
  signalReason: string;
  about: string;
  stats: StockStat[];
  metrics: StockMetric[];
  news: StockNews[];
  analystSummary: string;
}

// Estimate reading time in minutes from word count (~220 wpm)
export function estimateReadTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
