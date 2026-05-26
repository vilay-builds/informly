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
