"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const stockData: Record<
  string,
  {
    ticker: string;
    name: string;
    price: string;
    change: number;
    signal: "bullish" | "bearish" | "neutral";
    signalReason: string;
    about: string;
    metrics: { label: string; value: string; explanation: string }[];
    news: { title: string; timeAgo: string }[];
    analystSummary: string;
  }
> = {
  AAPL: {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: "198.45",
    change: 2.3,
    signal: "bullish",
    signalReason:
      "Apple is showing strong momentum right now. iPhone sales are growing in countries like India and Brazil, services revenue (App Store, Apple Music, iCloud) keeps hitting records, and the company has more cash than most countries. Most analysts think the stock will continue to go up over the next year.",
    about:
      "Apple makes the iPhone, Mac computers, iPad, and Apple Watch. They also run services like the App Store, Apple Music, and iCloud. They're one of the most valuable companies in the world.",
    metrics: [
      {
        label: "P/E Ratio",
        value: "32.4",
        explanation:
          "This tells you how much investors are willing to pay for each dollar the company earns. A P/E of 32 means investors pay $32 for every $1 of profit. For Apple, this is reasonable — it shows people believe the company will keep growing.",
      },
      {
        label: "Market Cap",
        value: "$3.05T",
        explanation:
          "This is the total value of all Apple shares combined — how much it would cost to buy the entire company. $3 trillion makes Apple one of the most valuable companies ever.",
      },
      {
        label: "52-Week Range",
        value: "$164.08 – $199.62",
        explanation:
          "The lowest and highest price the stock has traded at over the past year. Apple is currently near its highest point, which suggests strong investor confidence.",
      },
      {
        label: "Dividend Yield",
        value: "0.51%",
        explanation:
          "This is how much Apple pays you just for holding the stock, as a percentage of the stock price. 0.51% is small but consistent — Apple has increased its dividend every year for over a decade.",
      },
      {
        label: "Revenue Growth",
        value: "+8.2%",
        explanation:
          "How much more money Apple made this quarter compared to the same time last year. 8.2% growth is solid for a company this large — it means they're still finding new customers and selling more products.",
      },
    ],
    news: [
      { title: "Apple Vision Pro sales exceed expectations in Japan launch", timeAgo: "2h ago" },
      { title: "Services revenue hits all-time high of $24.2B", timeAgo: "1d ago" },
      { title: "New iPhone SE expected to drive emerging market growth", timeAgo: "2d ago" },
    ],
    analystSummary:
      "Most Wall Street analysts recommend buying Apple stock. The average price target is $215, which means analysts think it could go up about 8% from here. The main reasons: iPhone sales in new markets, growing services business, and potential AI features in the next iOS update.",
  },
  NVDA: {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    price: "1,245.80",
    change: 4.1,
    signal: "bullish",
    signalReason:
      "NVIDIA is the undisputed leader in AI chips. Every major tech company needs their products to build AI systems, and demand far exceeds what NVIDIA can produce. This gives them incredible pricing power. The stock is expensive, but the growth backs it up.",
    about:
      "NVIDIA makes the powerful computer chips (GPUs) that power artificial intelligence, gaming, and data centers. They went from being known for gaming graphics to becoming the backbone of the AI revolution.",
    metrics: [
      {
        label: "P/E Ratio",
        value: "68.2",
        explanation:
          "A high P/E of 68 means investors are paying a premium because they expect massive future growth. For most companies this would be expensive, but NVIDIA's earnings are growing so fast that many analysts think it's still reasonably priced.",
      },
      {
        label: "Market Cap",
        value: "$3.07T",
        explanation:
          "NVIDIA is worth over $3 trillion, making it one of the most valuable companies in the world. A year ago it was worth less than half this — showing how fast AI demand has boosted the company.",
      },
      {
        label: "Revenue Growth",
        value: "+122%",
        explanation:
          "NVIDIA's revenue more than doubled compared to last year. This kind of growth is extremely rare for a large company and is driven almost entirely by demand for their AI training chips.",
      },
      {
        label: "Gross Margin",
        value: "78.4%",
        explanation:
          "For every $1 of chips NVIDIA sells, they keep about 78 cents after production costs. This is extraordinarily high and shows they can charge premium prices because no competitor can match their technology.",
      },
      {
        label: "52-Week Range",
        value: "$475.05 – $1,264.20",
        explanation:
          "The stock has nearly tripled from its lowest point this year. It's trading near all-time highs, driven by seemingly insatiable demand for AI infrastructure.",
      },
    ],
    news: [
      { title: "New Blackwell chips shipping ahead of schedule", timeAgo: "4h ago" },
      { title: "Microsoft increases GPU orders by 40% for Azure AI", timeAgo: "1d ago" },
      { title: "NVIDIA announces next-gen Rubin architecture for 2026", timeAgo: "3d ago" },
    ],
    analystSummary:
      "Wall Street is overwhelmingly positive on NVIDIA. The average price target is $1,400, suggesting about 12% more upside. Analysts highlight that AI spending by big tech companies is accelerating, not slowing. The biggest risk is if AI investment slows down or a competitor catches up — but neither seems likely in the near term.",
  },
};

const defaultStock = stockData.AAPL;

const signalStyles = {
  bullish: {
    bg: "bg-success-400/15",
    color: "text-success-500",
    border: "border-success-400/30",
    label: "Bullish — Looking Good",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  bearish: {
    bg: "bg-red-50",
    color: "text-red-500",
    border: "border-red-200",
    label: "Bearish — Use Caution",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
  },
  neutral: {
    bg: "bg-yellow-50",
    color: "text-yellow-600",
    border: "border-yellow-200",
    label: "Neutral — Wait & Watch",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      </svg>
    ),
  },
};

function StockContent() {
  const searchParams = useSearchParams();
  const ticker = searchParams.get("t") || "AAPL";
  const stock = stockData[ticker] || defaultStock;
  const signal = signalStyles[stock.signal];
  const [expandedMetric, setExpandedMetric] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center gap-3">
          <Link
            href="/markets"
            className="w-9 h-9 rounded-full bg-surface-secondary flex items-center justify-center"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-text-primary">
              {stock.ticker}
            </h1>
            <p className="text-xs text-text-tertiary">{stock.name}</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pt-5 space-y-5">
        {/* Price */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <p className="text-4xl font-bold text-text-primary">${stock.price}</p>
          <p
            className={`text-lg font-semibold mt-1 ${
              stock.change >= 0 ? "text-success-500" : "text-red-500"
            }`}
          >
            {stock.change >= 0 ? "+" : ""}
            {stock.change}% today
          </p>
        </motion.div>

        {/* Signal */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`rounded-2xl p-5 border ${signal.bg} ${signal.border}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className={signal.color}>{signal.icon}</span>
            <h3 className={`text-sm font-bold ${signal.color}`}>
              {signal.label}
            </h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {stock.signalReason}
          </p>
        </motion.section>

        {/* About */}
        <section className="bg-surface rounded-2xl p-5 border border-border">
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            What does {stock.name} do?
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {stock.about}
          </p>
        </section>

        {/* Key Metrics */}
        <section>
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Key Metrics — Tap to understand
          </h3>
          <div className="space-y-2">
            {stock.metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
                className="bg-surface rounded-xl border border-border overflow-hidden cursor-pointer"
                onClick={() =>
                  setExpandedMetric(expandedMetric === i ? null : i)
                }
              >
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm text-text-secondary">
                    {metric.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary">
                      {metric.value}
                    </span>
                    <motion.svg
                      width="14"
                      height="14"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-text-tertiary"
                      animate={{ rotate: expandedMetric === i ? 180 : 0 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </motion.svg>
                  </div>
                </div>
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedMetric === i ? "auto" : 0,
                    opacity: expandedMetric === i ? 1 : 0,
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {metric.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Analyst Summary */}
        <section className="bg-primary-50 rounded-2xl p-5 border border-primary-100">
          <h3 className="text-sm font-semibold text-primary-700 mb-2">
            What Analysts Are Saying
          </h3>
          <p className="text-sm text-primary-800 leading-relaxed">
            {stock.analystSummary}
          </p>
        </section>

        {/* Related News */}
        <section className="pb-6">
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Latest News
          </h3>
          <div className="space-y-2">
            {stock.news.map((item, i) => (
              <div
                key={i}
                className="bg-surface rounded-xl p-4 border border-border flex items-center justify-between"
              >
                <p className="text-sm text-text-primary leading-snug flex-1 mr-3">
                  {item.title}
                </p>
                <span className="text-xs text-text-tertiary whitespace-nowrap">
                  {item.timeAgo}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function StockPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <StockContent />
    </Suspense>
  );
}
