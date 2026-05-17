"use client";

import { useState, Suspense, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { StockChart, generateChartData } from "@/components/StockChart";

const stockData: Record<
  string,
  {
    ticker: string;
    name: string;
    price: number;
    change: number;
    currency: string;
    signal: "bullish" | "bearish" | "neutral";
    signalReason: string;
    about: string;
    stats: { label: string; value: string }[];
    metrics: { label: string; value: string; explanation: string }[];
    news: { title: string; timeAgo: string }[];
    analystSummary: string;
  }
> = {
  AAPL: {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 198.45,
    change: 2.3,
    currency: "$",
    signal: "bullish",
    signalReason:
      "Apple is showing strong momentum right now. iPhone sales are growing in countries like India and Brazil, services revenue keeps hitting records, and the company has more cash than most countries. Most analysts think the stock will continue going up.",
    about:
      "Apple makes the iPhone, Mac computers, iPad, and Apple Watch. They also run services like the App Store, Apple Music, and iCloud. They're one of the most valuable companies in the world.",
    stats: [
      { label: "Market Cap", value: "$3.05T" },
      { label: "Volume", value: "52.4M" },
      { label: "Day Range", value: "194.20 – 199.40" },
      { label: "52W Range", value: "164.08 – 199.62" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "32.4",
        explanation:
          "How much investors pay for each dollar the company earns. A P/E of 32 means investors pay $32 for every $1 of profit. For Apple, this is reasonable — it shows people believe the company will keep growing.",
      },
      {
        label: "Dividend Yield",
        value: "0.51%",
        explanation:
          "How much Apple pays you just for holding the stock, as a percentage of the stock price. 0.51% is small but consistent — Apple has increased its dividend every year for over a decade.",
      },
      {
        label: "Revenue Growth",
        value: "+8.2%",
        explanation:
          "How much more money Apple made this quarter compared to the same time last year. 8.2% growth is solid for a company this large.",
      },
      {
        label: "Beta",
        value: "1.21",
        explanation:
          "How much the stock moves compared to the overall market. A beta of 1.21 means Apple tends to move ~20% more than the market — slightly more volatile but not by much.",
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
    price: 1245.8,
    change: 4.1,
    currency: "$",
    signal: "bullish",
    signalReason:
      "NVIDIA is the undisputed leader in AI chips. Every major tech company needs their products to build AI systems, and demand far exceeds what NVIDIA can produce. This gives them incredible pricing power.",
    about:
      "NVIDIA makes the powerful computer chips (GPUs) that power artificial intelligence, gaming, and data centers. They went from being known for gaming graphics to becoming the backbone of the AI revolution.",
    stats: [
      { label: "Market Cap", value: "$3.07T" },
      { label: "Volume", value: "284.1M" },
      { label: "Day Range", value: "1,210 – 1,264" },
      { label: "52W Range", value: "475.05 – 1,264.20" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "68.2",
        explanation:
          "A high P/E of 68 means investors are paying a premium because they expect massive future growth. NVIDIA's earnings are growing so fast that many analysts think it's still reasonably priced.",
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
        label: "Beta",
        value: "1.75",
        explanation:
          "NVIDIA's stock tends to move much more than the overall market — both up and down. Higher reward potential but also higher risk.",
      },
    ],
    news: [
      { title: "New Blackwell chips shipping ahead of schedule", timeAgo: "4h ago" },
      { title: "Microsoft increases GPU orders by 40% for Azure AI", timeAgo: "1d ago" },
      { title: "NVIDIA announces next-gen Rubin architecture for 2026", timeAgo: "3d ago" },
    ],
    analystSummary:
      "Wall Street is overwhelmingly positive on NVIDIA. The average price target is $1,400, suggesting about 12% more upside. The biggest risk is if AI investment slows down or a competitor catches up — but neither seems likely in the near term.",
  },
  RELIANCE: {
    ticker: "RELIANCE",
    name: "Reliance Industries",
    price: 2945.3,
    change: 1.4,
    currency: "₹",
    signal: "bullish",
    signalReason:
      "Reliance is showing strong momentum across all its businesses. Jio is adding subscribers faster than expected, retail is expanding rapidly, and the green energy push is gaining traction. Most Indian analysts are positive.",
    about:
      "Reliance Industries is India's largest private company. They run Jio (telecom), Reliance Retail (grocery and electronics stores), and operate refineries and petrochemical plants. They're also investing heavily in renewable energy.",
    stats: [
      { label: "Market Cap", value: "₹19.9L Cr" },
      { label: "Volume", value: "8.2M" },
      { label: "Day Range", value: "2,920 – 2,968" },
      { label: "52W Range", value: "2,180 – 3,024" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "28.6",
        explanation:
          "Investors pay ₹28.60 for every ₹1 of Reliance's earnings. This is moderate for a diversified conglomerate and reflects steady growth expectations.",
      },
      {
        label: "Revenue Growth",
        value: "+12.3%",
        explanation:
          "Reliance grew revenue 12% compared to last year, driven by Jio subscriber additions and retail store expansion across India.",
      },
      {
        label: "Dividend Yield",
        value: "0.34%",
        explanation:
          "Reliance pays a small but steady dividend. They prefer to reinvest profits into new businesses like green energy and retail.",
      },
      {
        label: "Beta",
        value: "0.95",
        explanation:
          "Reliance moves roughly in line with the broader Indian market. Slightly less volatile than the average Nifty 50 stock.",
      },
    ],
    news: [
      { title: "Jio crosses 480M subscribers, beating estimates", timeAgo: "5h ago" },
      { title: "Reliance Retail opens 200 new stores this quarter", timeAgo: "1d ago" },
      { title: "Green energy gigafactory begins operations in Jamnagar", timeAgo: "3d ago" },
    ],
    analystSummary:
      "Most brokerages rate Reliance a 'Buy' with an average target of ₹3,250 — about 10% upside. Strength in Jio and retail offset slower growth in the oil-to-chemicals business. Long-term outlook tied to green energy ramp-up.",
  },
};

const ranges = ["1D", "1W", "1M", "3M", "1Y", "5Y"] as const;
type Range = (typeof ranges)[number];

const rangePointCounts: Record<Range, number> = {
  "1D": 24,
  "1W": 28,
  "1M": 30,
  "3M": 40,
  "1Y": 52,
  "5Y": 60,
};

const rangeChangeMultipliers: Record<Range, number> = {
  "1D": 1,
  "1W": 1.8,
  "1M": 3.2,
  "3M": 5.5,
  "1Y": 12,
  "5Y": 25,
};

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
  const stock = stockData[ticker] || stockData.AAPL;
  const signal = signalStyles[stock.signal];
  const [expandedMetric, setExpandedMetric] = useState<number | null>(null);
  const [range, setRange] = useState<Range>("1M");
  const [watching, setWatching] = useState(true);

  const isPositive = stock.change >= 0;

  const chartData = useMemo(() => {
    const points = rangePointCounts[range];
    const totalChange = (stock.change / 100) * rangeChangeMultipliers[range];
    const startPrice = stock.price / (1 + totalChange);
    return generateChartData(startPrice, stock.price, points, 0.012);
  }, [range, stock.price, stock.change]);

  const formatPrice = (p: number) =>
    stock.currency === "₹"
      ? p.toLocaleString("en-IN", { maximumFractionDigits: 2 })
      : p.toLocaleString("en-US", { maximumFractionDigits: 2 });

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-white/30">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/markets"
              className="w-9 h-9 rounded-full bg-surface flex items-center justify-center border border-border"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                isPositive
                  ? "bg-success-400/15 text-success-500"
                  : "bg-red-100 text-red-500"
              }`}
            >
              {stock.ticker} {isPositive ? "+" : ""}
              {stock.change}%
            </span>
          </div>

          <button
            onClick={() => setWatching(!watching)}
            className="w-9 h-9 rounded-full bg-surface flex items-center justify-center border border-border"
          >
            <svg
              width="18"
              height="18"
              fill={watching ? "#f59e0b" : "none"}
              viewBox="0 0 24 24"
              stroke={watching ? "#f59e0b" : "currentColor"}
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pt-6 space-y-6">
        {/* Title + Price */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-text-tertiary mb-1">Last traded price</p>
          <p className="text-4xl font-bold text-text-primary tracking-tight">
            <span className="text-2xl text-text-tertiary mr-1">
              {stock.currency}
            </span>
            {formatPrice(stock.price)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-medium text-text-secondary">
              {stock.name}
            </span>
            <span className="w-1 h-1 rounded-full bg-text-tertiary" />
            <span
              className={`text-sm font-semibold ${
                isPositive ? "text-success-500" : "text-red-500"
              }`}
            >
              {isPositive ? "+" : ""}
              {stock.change}% ({range})
            </span>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-3xl p-5 border border-border"
        >
          <StockChart data={chartData} isPositive={isPositive} height={200} />

          {/* Range pills */}
          <div className="flex items-center gap-1.5 mt-4 bg-surface-secondary rounded-full p-1">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  range === r
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface rounded-2xl p-4 border border-border"
        >
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Market Stats
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {stock.stats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between">
                <span className="text-xs text-text-tertiary">{stat.label}</span>
                <span className="text-xs font-semibold text-text-primary">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Signal */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
                transition={{ delay: 0.25 + i * 0.04 }}
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
