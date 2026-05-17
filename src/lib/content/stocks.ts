import { Stock } from "./types";

const stocks: Stock[] = [
  // ===================== US =====================
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    region: "us",
    currency: "$",
    price: 198.45,
    change: 2.3,
    signal: "bullish",
    signalReason:
      "Apple is showing strong momentum. iPhone sales are growing in India and Brazil, services revenue keeps hitting records, and the company has more cash than most countries.",
    about:
      "Apple makes the iPhone, Mac, iPad, and Apple Watch, and runs services like the App Store, Apple Music, and iCloud. It's one of the most valuable companies in the world.",
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
          "How much investors pay for each dollar the company earns. A P/E of 32 is reasonable for Apple — it reflects expectations of continued growth.",
      },
      {
        label: "Dividend Yield",
        value: "0.51%",
        explanation:
          "How much Apple pays you just for holding the stock, as a percentage of the stock price. Small but consistent — Apple has raised its dividend every year for over a decade.",
      },
      {
        label: "Revenue Growth",
        value: "+8.2%",
        explanation:
          "How much more revenue Apple generated this quarter compared to last year. 8.2% is solid for a company this size.",
      },
      {
        label: "Beta",
        value: "1.21",
        explanation:
          "How much the stock moves relative to the overall market. A beta of 1.21 means Apple tends to move ~20% more than the market — slightly more volatile but not by much.",
      },
    ],
    news: [
      {
        title: "Apple Vision Pro sales exceed expectations in Japan launch",
        timeAgo: "2h ago",
      },
      {
        title: "Services revenue hits all-time high of $24.2B",
        timeAgo: "1d ago",
      },
      {
        title: "New iPhone SE expected to drive emerging market growth",
        timeAgo: "2d ago",
      },
    ],
    analystSummary:
      "Most analysts rate Apple a Buy with an average price target of $215 — about 8% above current levels. Drivers: iPhone in emerging markets, growing services, and potential AI features in the next iOS update.",
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    region: "us",
    currency: "$",
    price: 1245.8,
    change: 4.1,
    signal: "bullish",
    signalReason:
      "NVIDIA is the undisputed leader in AI chips. Every major tech company needs their products, and demand far exceeds supply, giving them incredible pricing power.",
    about:
      "NVIDIA makes the GPUs that power artificial intelligence, gaming, and data centers. They went from being known for gaming graphics to becoming the backbone of the AI revolution.",
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
          "Investors are paying a premium because they expect massive future growth. NVIDIA's earnings are growing so fast that many analysts think it's still reasonably priced.",
      },
      {
        label: "Revenue Growth",
        value: "+122%",
        explanation:
          "Revenue more than doubled compared to last year — extremely rare for a large company. Driven almost entirely by AI training chip demand.",
      },
      {
        label: "Gross Margin",
        value: "78.4%",
        explanation:
          "For every $1 of chips sold, NVIDIA keeps ~78 cents after production costs. Extraordinarily high and reflects unmatched technology.",
      },
      {
        label: "Beta",
        value: "1.75",
        explanation:
          "Tends to move much more than the overall market — both directions. Higher reward potential, higher risk.",
      },
    ],
    news: [
      {
        title: "Blackwell chips shipping ahead of schedule",
        timeAgo: "4h ago",
        articleId: "nvidia-blackwell",
      },
      {
        title: "Microsoft increases GPU orders by 40% for Azure AI",
        timeAgo: "1d ago",
      },
      {
        title: "NVIDIA announces next-gen Rubin architecture for 2026",
        timeAgo: "3d ago",
      },
    ],
    analystSummary:
      "Wall Street is overwhelmingly positive on NVIDIA with an average target of $1,400. Risks: a slowdown in AI investment or a credible competitor — neither seems likely near-term.",
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    region: "us",
    currency: "$",
    price: 178.2,
    change: -1.8,
    signal: "bearish",
    signalReason:
      "Production delays at the Berlin factory and intensifying competition from BYD in China are pressuring margins. The robotaxi launch creates long-term optionality but near-term execution risk remains.",
    about:
      "Tesla makes electric vehicles, batteries, solar products, and is now running a commercial robotaxi service in three US cities. Led by Elon Musk.",
    stats: [
      { label: "Market Cap", value: "$567B" },
      { label: "Volume", value: "108.3M" },
      { label: "Day Range", value: "175.10 – 182.40" },
      { label: "52W Range", value: "138.80 – 271.10" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "45.1",
        explanation:
          "Higher than typical automakers, reflecting expectations that Tesla will become more than a car company (energy, AI, robotaxi).",
      },
      {
        label: "Revenue Growth",
        value: "+2.4%",
        explanation:
          "Modest growth this quarter as EV competition intensifies and price cuts compress margins.",
      },
      {
        label: "Gross Margin",
        value: "17.2%",
        explanation:
          "Automotive margins compressed by price reductions to maintain volume against Chinese competition.",
      },
      {
        label: "Beta",
        value: "2.31",
        explanation:
          "One of the more volatile large-caps — moves much more than the broader market in both directions.",
      },
    ],
    news: [
      {
        title: "Tesla launches autonomous robotaxi service in 3 US cities",
        timeAgo: "12h ago",
        articleId: "tesla-robotaxi",
      },
      {
        title: "Berlin factory production delayed by supplier issue",
        timeAgo: "2d ago",
      },
    ],
    analystSummary:
      "Analyst views are split. Bulls highlight robotaxi and energy optionality with a $250 target; bears focus on auto margin compression and China competition with a $150 target.",
  },
  {
    ticker: "MSFT",
    name: "Microsoft",
    region: "us",
    currency: "$",
    price: 442.15,
    change: 1.2,
    signal: "bullish",
    signalReason:
      "Azure cloud revenue beat estimates and Copilot AI adoption is accelerating across enterprise customers. Microsoft remains the clearest beneficiary of AI productization in enterprise software.",
    about:
      "Microsoft makes Windows, Office, the Azure cloud platform, GitHub, LinkedIn, Xbox, and is OpenAI's largest backer. It's the most widely used productivity company in the world.",
    stats: [
      { label: "Market Cap", value: "$3.29T" },
      { label: "Volume", value: "21.8M" },
      { label: "Day Range", value: "438.20 – 443.50" },
      { label: "52W Range", value: "388.60 – 468.35" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "36.8",
        explanation:
          "Slightly above the market average. Reflects strong recurring revenue and AI growth expectations.",
      },
      {
        label: "Revenue Growth",
        value: "+15.7%",
        explanation:
          "Strong double-digit growth led by Azure cloud and Copilot AI adoption.",
      },
      {
        label: "Operating Margin",
        value: "45.0%",
        explanation:
          "One of the most profitable large companies — every $1 of revenue produces 45 cents of operating profit.",
      },
      {
        label: "Beta",
        value: "0.91",
        explanation:
          "Slightly less volatile than the broader market — Microsoft is often considered a 'defensive growth' stock.",
      },
    ],
    news: [
      {
        title: "Microsoft increases GPU orders by 40% for Azure AI",
        timeAgo: "1d ago",
      },
      { title: "Copilot adoption crosses 70% of Fortune 500", timeAgo: "3d ago" },
    ],
    analystSummary:
      "Consensus Buy rating with an average target of $490 — about 11% upside. Drivers: Azure growth, Copilot monetization, and AI infrastructure leadership.",
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    region: "us",
    currency: "$",
    price: 176.55,
    change: -0.4,
    signal: "neutral",
    signalReason:
      "Search remains dominant but generative AI disruption creates uncertainty. Cloud and YouTube growth are strong but the core advertising business faces structural questions.",
    about:
      "Alphabet is Google's parent company. It runs Search, YouTube, Android, Google Cloud, Workspace, Maps, Pixel, and the Waymo self-driving subsidiary.",
    stats: [
      { label: "Market Cap", value: "$2.18T" },
      { label: "Volume", value: "18.4M" },
      { label: "Day Range", value: "175.20 – 177.80" },
      { label: "52W Range", value: "131.55 – 193.30" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "24.1",
        explanation:
          "Reasonable for a tech company growing at this rate. Some discount baked in for AI disruption uncertainty.",
      },
      {
        label: "Revenue Growth",
        value: "+13.6%",
        explanation:
          "Healthy growth led by Cloud and YouTube. Search advertising is still the largest segment.",
      },
      {
        label: "Operating Margin",
        value: "32.7%",
        explanation:
          "Strong profitability, though slightly below peak years due to AI infrastructure investment.",
      },
      {
        label: "Beta",
        value: "1.05",
        explanation:
          "Moves roughly in line with the overall market — typical for a mega-cap.",
      },
    ],
    news: [
      {
        title: "Waymo expands to four new metros in Q2",
        timeAgo: "1d ago",
      },
      { title: "Gemini 3 enterprise tier launches", timeAgo: "2d ago" },
    ],
    analystSummary:
      "Mixed analyst views. Bulls cite Cloud and YouTube growth (target $200+); bears worry about Search disruption from generative AI (target $160). Consensus near Buy with $192 average.",
  },
  // ===================== INDIA =====================
  {
    ticker: "RELIANCE",
    name: "Reliance Industries",
    region: "india",
    currency: "₹",
    price: 2945.3,
    change: 1.4,
    signal: "bullish",
    signalReason:
      "Reliance is showing strong momentum across all its businesses. Jio is adding subscribers faster than expected, retail is expanding rapidly, and the green energy push is gaining traction.",
    about:
      "India's largest private company. They run Jio (telecom), Reliance Retail, and operate refineries and petrochemical plants. They're also investing heavily in renewable energy.",
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
          "Investors pay ₹28.60 for every ₹1 of Reliance's earnings. Moderate for a diversified conglomerate.",
      },
      {
        label: "Revenue Growth",
        value: "+12.3%",
        explanation:
          "Driven by Jio subscriber additions and retail store expansion across India.",
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
          "Moves roughly in line with the broader Indian market. Slightly less volatile than the average Nifty 50 stock.",
      },
    ],
    news: [
      { title: "Jio crosses 480M subscribers, beating estimates", timeAgo: "5h ago" },
      { title: "Reliance Retail opens 200 new stores this quarter", timeAgo: "1d ago" },
      { title: "Green energy gigafactory begins operations in Jamnagar", timeAgo: "3d ago" },
    ],
    analystSummary:
      "Most brokerages rate Reliance a Buy with an average target of ₹3,250 — about 10% upside. Strength in Jio and retail offsets slower growth in oil-to-chemicals.",
  },
  {
    ticker: "TCS",
    name: "Tata Consultancy Services",
    region: "india",
    currency: "₹",
    price: 3712.8,
    change: 0.9,
    signal: "neutral",
    signalReason:
      "Steady deal pipeline but slower discretionary spending from US clients. Margin pressure from wage hikes is balanced by efficiency gains.",
    about:
      "TCS is India's largest IT services company, providing software services, consulting, and business solutions to companies worldwide. Part of the Tata Group.",
    stats: [
      { label: "Market Cap", value: "₹13.4L Cr" },
      { label: "Volume", value: "1.8M" },
      { label: "Day Range", value: "3,690 – 3,728" },
      { label: "52W Range", value: "3,290 – 4,254" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "31.2",
        explanation:
          "Premium valuation reflecting TCS's market leadership and consistent profitability.",
      },
      {
        label: "Revenue Growth",
        value: "+5.8%",
        explanation:
          "Modest growth as IT services demand cools, particularly from US financial services clients.",
      },
      {
        label: "Operating Margin",
        value: "24.7%",
        explanation:
          "Industry-leading margins driven by scale and operational excellence.",
      },
      {
        label: "Dividend Yield",
        value: "1.32%",
        explanation:
          "Solid dividend with regular buybacks. TCS is one of the most shareholder-friendly Indian large-caps.",
      },
    ],
    news: [
      { title: "TCS wins $1B deal with UK retailer", timeAgo: "1d ago" },
      { title: "AI services revenue crosses 8% of total", timeAgo: "4d ago" },
    ],
    analystSummary:
      "Consensus Hold with average target of ₹4,000. Analysts await visible recovery in discretionary IT spending before turning more constructive.",
  },
  {
    ticker: "HDFCBANK",
    name: "HDFC Bank",
    region: "india",
    currency: "₹",
    price: 1678.9,
    change: 2.1,
    signal: "bullish",
    signalReason:
      "Strong credit growth and improving deposit mix post-merger. The bank is digesting the HDFC Ltd. merger well and net interest margins are stabilizing.",
    about:
      "India's largest private bank by assets. After merging with HDFC Ltd. (parent), it now offers banking, home loans, insurance, and asset management at a unified scale.",
    stats: [
      { label: "Market Cap", value: "₹12.8L Cr" },
      { label: "Volume", value: "12.4M" },
      { label: "Day Range", value: "1,660 – 1,684" },
      { label: "52W Range", value: "1,363 – 1,790" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "19.8",
        explanation:
          "Below sector peers, reflecting market caution around the post-merger digestion phase.",
      },
      {
        label: "Net Interest Margin",
        value: "3.46%",
        explanation:
          "The difference between what HDFC Bank earns on loans vs. pays on deposits — a key bank profitability indicator.",
      },
      {
        label: "Loan Growth",
        value: "+19.4%",
        explanation:
          "Strong loan book expansion post-merger, particularly in home loans.",
      },
      {
        label: "Gross NPA",
        value: "1.24%",
        explanation:
          "Percentage of loans not being repaid. Lower is better — HDFC Bank's asset quality remains among the best in Indian banking.",
      },
    ],
    news: [
      { title: "HDFC Bank deposit growth accelerates to 24%", timeAgo: "1d ago" },
      { title: "RBI approves new branch expansion plan", timeAgo: "3d ago" },
    ],
    analystSummary:
      "Consensus Buy with average target of ₹1,950. Most brokerages view current valuation as attractive given the bank's franchise and post-merger trajectory.",
  },
  {
    ticker: "INFY",
    name: "Infosys Ltd.",
    region: "india",
    currency: "₹",
    price: 1456.25,
    change: -0.6,
    signal: "neutral",
    signalReason:
      "Guidance maintained but margin pressure from wage hikes is expected. The company is well-positioned in AI services but conversion to revenue is slow.",
    about:
      "India's second-largest IT services company. Offers software development, consulting, and digital transformation services to clients across the globe.",
    stats: [
      { label: "Market Cap", value: "₹6.0L Cr" },
      { label: "Volume", value: "5.2M" },
      { label: "Day Range", value: "1,445 – 1,465" },
      { label: "52W Range", value: "1,358 – 1,732" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "25.4",
        explanation:
          "Below TCS but in line with the IT sector average.",
      },
      {
        label: "Revenue Growth",
        value: "+4.7%",
        explanation:
          "Modest growth tracking the broader IT services slowdown.",
      },
      {
        label: "Operating Margin",
        value: "20.8%",
        explanation:
          "Solid margins, though below peak levels due to wage inflation.",
      },
      {
        label: "Dividend Yield",
        value: "2.18%",
        explanation:
          "Higher than most large-cap Indian IT stocks. Infosys is a regular dividend payer.",
      },
    ],
    news: [
      { title: "Infosys wins multi-year deal with European bank", timeAgo: "2d ago" },
    ],
    analystSummary:
      "Consensus Hold-to-Buy with average target of ₹1,650. Analysts wait for clearer signs of IT services demand recovery.",
  },
  {
    ticker: "BHARTIARTL",
    name: "Bharti Airtel",
    region: "india",
    currency: "₹",
    price: 1534.6,
    change: 1.7,
    signal: "bullish",
    signalReason:
      "ARPU growth continues after tariff hikes, and 5G rollout is boosting data usage. Airtel is taking market share from competitors and African operations are profitable.",
    about:
      "India's second-largest telecom operator. Provides mobile, broadband, enterprise, and digital TV services across India, Africa, and other markets.",
    stats: [
      { label: "Market Cap", value: "₹9.1L Cr" },
      { label: "Volume", value: "6.8M" },
      { label: "Day Range", value: "1,510 – 1,540" },
      { label: "52W Range", value: "1,098 – 1,778" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "76.3",
        explanation:
          "High because earnings have been depressed by past tariff competition. The market is pricing in recovery.",
      },
      {
        label: "ARPU",
        value: "₹220",
        explanation:
          "Average revenue per user per month. Higher is better — Airtel's premiumization strategy is working.",
      },
      {
        label: "Revenue Growth",
        value: "+14.1%",
        explanation:
          "Driven by tariff hikes and growing data consumption.",
      },
      {
        label: "Beta",
        value: "0.78",
        explanation:
          "Less volatile than the broader market — telecom is a relatively defensive sector.",
      },
    ],
    news: [
      { title: "Airtel 5G coverage extends to 5,000 towns", timeAgo: "1d ago" },
    ],
    analystSummary:
      "Strong Buy consensus with target of ₹1,800. Analysts see continued ARPU growth and reduced capex intensity as primary tailwinds.",
  },
];

// Lightweight "mover" entries — listed in movers/search but without
// the deep about/metrics narrative. They still get full detail pages
// rendered from this minimal data plus generic copy fallbacks.
const lightStocks: Stock[] = [
  // US extras
  {
    ticker: "AMD",
    name: "AMD",
    region: "us",
    currency: "$",
    price: 178.4,
    change: 3.6,
    signal: "bullish",
    signalReason:
      "AMD continues to take server CPU share and is making meaningful AI inference progress with the MI300 series.",
    about:
      "AMD designs CPUs, GPUs, and adaptive computing chips. Major competitor to NVIDIA and Intel.",
    stats: [
      { label: "Market Cap", value: "$289B" },
      { label: "Volume", value: "48.2M" },
      { label: "Day Range", value: "172 – 180" },
      { label: "52W Range", value: "94.50 – 184.92" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "42.8",
        explanation:
          "Higher than the broader market — reflects expectations that AMD's AI and data-center growth continues.",
      },
      {
        label: "Revenue Growth",
        value: "+18.2%",
        explanation:
          "Solid growth driven by data-center CPUs and early AI accelerator traction.",
      },
    ],
    news: [],
    analystSummary:
      "Consensus Buy with average target of $210. Bulls cite AI accelerator ramp and server CPU share gains.",
  },
  {
    ticker: "AMZN",
    name: "Amazon",
    region: "us",
    currency: "$",
    price: 189.3,
    change: 1.6,
    signal: "bullish",
    signalReason:
      "AWS growth re-accelerating with AI workloads. Retail margin recovery is on track and advertising remains a strong second engine.",
    about:
      "Amazon runs the world's largest e-commerce marketplace and the AWS cloud platform, along with advertising, Prime Video, and devices.",
    stats: [
      { label: "Market Cap", value: "$1.97T" },
      { label: "Volume", value: "42.6M" },
      { label: "Day Range", value: "186 – 191" },
      { label: "52W Range", value: "144 – 201" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "58.3",
        explanation:
          "Premium valuation reflecting AWS profitability and the long-term AI cloud thesis.",
      },
    ],
    news: [],
    analystSummary:
      "Consensus Buy, average target $215. AWS reacceleration and advertising are the main drivers.",
  },
  {
    ticker: "META",
    name: "Meta Platforms",
    region: "us",
    currency: "$",
    price: 512.7,
    change: 2.4,
    signal: "bullish",
    signalReason:
      "Ad revenue surging as Reels monetization improves. AI-driven targeting is lifting price per impression across Instagram and Facebook.",
    about:
      "Meta runs Facebook, Instagram, WhatsApp, and Threads, plus Reality Labs (Quest VR headsets and AR research).",
    stats: [
      { label: "Market Cap", value: "$1.30T" },
      { label: "Volume", value: "12.4M" },
      { label: "Day Range", value: "508 – 516" },
      { label: "52W Range", value: "394 – 542" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "27.1",
        explanation:
          "Reasonable for a mega-cap growing this fast. Some discount for Reality Labs losses.",
      },
    ],
    news: [],
    analystSummary:
      "Strong Buy consensus, target $580. Ad strength + Reels monetization + AI infrastructure leverage.",
  },
  {
    ticker: "NFLX",
    name: "Netflix",
    region: "us",
    currency: "$",
    price: 612.4,
    change: -1.2,
    signal: "neutral",
    signalReason:
      "Subscriber growth steady but content costs remain elevated. Ad tier is gaining traction but monetization is still ramping.",
    about:
      "Netflix is the largest subscription streaming service globally, with ~270M paid subscribers.",
    stats: [
      { label: "Market Cap", value: "$268B" },
      { label: "Volume", value: "4.8M" },
      { label: "Day Range", value: "608 – 619" },
      { label: "52W Range", value: "434 – 698" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "42.0",
        explanation: "Premium valuation reflecting content moat and operational discipline.",
      },
    ],
    news: [],
    analystSummary: "Mixed views; average target $640. Ad tier execution is the key variable.",
  },
  {
    ticker: "BAC",
    name: "Bank of America",
    region: "us",
    currency: "$",
    price: 42.8,
    change: 0.6,
    signal: "neutral",
    signalReason:
      "Net interest income stabilizing as the rate-cut cycle pauses. Consumer credit quality remains within expectations.",
    about:
      "Bank of America is one of the largest U.S. banks, with consumer banking, wealth management, and global markets divisions.",
    stats: [
      { label: "Market Cap", value: "$338B" },
      { label: "Volume", value: "32.1M" },
      { label: "Day Range", value: "42.4 – 43.1" },
      { label: "52W Range", value: "33.0 – 45.8" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "13.2",
        explanation: "Below market — typical for large banks in a rate-stable environment.",
      },
    ],
    news: [],
    analystSummary: "Consensus Hold, target $46. Higher-for-longer rates are supportive.",
  },

  // India extras
  {
    ticker: "ICICIBANK",
    name: "ICICI Bank",
    region: "india",
    currency: "₹",
    price: 1185.4,
    change: 2.5,
    signal: "bullish",
    signalReason:
      "Strong retail loan growth and improving asset quality. ICICI Bank is taking market share from PSU banks.",
    about:
      "ICICI Bank is one of India's largest private-sector banks, offering retail, corporate, and investment banking.",
    stats: [
      { label: "Market Cap", value: "₹8.4L Cr" },
      { label: "Volume", value: "10.2M" },
      { label: "Day Range", value: "1,175 – 1,192" },
      { label: "52W Range", value: "920 – 1,210" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "18.9",
        explanation: "Attractive valuation for a top-tier private bank with strong growth.",
      },
    ],
    news: [],
    analystSummary: "Consensus Buy, target ₹1,350. Asset quality and retail mix are highlights.",
  },
  {
    ticker: "MARUTI",
    name: "Maruti Suzuki",
    region: "india",
    currency: "₹",
    price: 12420.0,
    change: 1.9,
    signal: "bullish",
    signalReason:
      "Auto sector recovery underway. Maruti's SUV portfolio is gaining traction and rural demand is improving.",
    about:
      "Maruti Suzuki is India's largest carmaker, with the broadest small-car portfolio and a growing SUV lineup.",
    stats: [
      { label: "Market Cap", value: "₹3.9L Cr" },
      { label: "Volume", value: "0.8M" },
      { label: "Day Range", value: "12,290 – 12,460" },
      { label: "52W Range", value: "9,738 – 13,680" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "26.2",
        explanation: "Slightly above sector average, reflecting market leadership.",
      },
    ],
    news: [],
    analystSummary: "Consensus Buy, target ₹14,000. SUV mix shift and rural recovery are positives.",
  },
  {
    ticker: "ASIANPAINT",
    name: "Asian Paints",
    region: "india",
    currency: "₹",
    price: 2680.5,
    change: -1.2,
    signal: "bearish",
    signalReason:
      "Margin pressure from raw material costs and increased competition from new entrants. Volume growth has slowed.",
    about:
      "Asian Paints is India's largest paint company, expanding into home decor and waterproofing solutions.",
    stats: [
      { label: "Market Cap", value: "₹2.6L Cr" },
      { label: "Volume", value: "1.8M" },
      { label: "Day Range", value: "2,670 – 2,720" },
      { label: "52W Range", value: "2,560 – 3,420" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "49.8",
        explanation: "Historically premium valuation under pressure from competition.",
      },
    ],
    news: [],
    analystSummary: "Mixed views, average target ₹2,900. Competition is the key concern.",
  },
  {
    ticker: "TITAN",
    name: "Titan Company",
    region: "india",
    currency: "₹",
    price: 3450.2,
    change: 2.8,
    signal: "bullish",
    signalReason:
      "Wedding season demand strong and jewelry segment growing in double digits. Watches and eyewear also recovering.",
    about:
      "Titan is India's largest jewelry retailer (Tanishq, CaratLane) and a leading watches/eyewear brand. Part of the Tata Group.",
    stats: [
      { label: "Market Cap", value: "₹3.1L Cr" },
      { label: "Volume", value: "1.2M" },
      { label: "Day Range", value: "3,418 – 3,468" },
      { label: "52W Range", value: "2,925 – 3,886" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "84.2",
        explanation: "High P/E reflects long-term growth runway in formalizing Indian jewelry market.",
      },
    ],
    news: [],
    analystSummary: "Consensus Buy, target ₹3,800. Premiumization and store expansion drive thesis.",
  },
  {
    ticker: "SUNPHARMA",
    name: "Sun Pharma",
    region: "india",
    currency: "₹",
    price: 1645.8,
    change: -0.4,
    signal: "neutral",
    signalReason:
      "Specialty pharma growth steady. Generic competition in US continues to pressure pricing in select molecules.",
    about:
      "Sun Pharma is India's largest pharma company, with a growing specialty business in the US and Japan.",
    stats: [
      { label: "Market Cap", value: "₹3.9L Cr" },
      { label: "Volume", value: "1.6M" },
      { label: "Day Range", value: "1,640 – 1,658" },
      { label: "52W Range", value: "1,374 – 1,803" },
    ],
    metrics: [
      {
        label: "P/E Ratio",
        value: "35.4",
        explanation: "Premium valuation reflecting specialty pharma upside.",
      },
    ],
    news: [],
    analystSummary: "Consensus Hold-to-Buy, target ₹1,800.",
  },
];

stocks.push(...lightStocks);

const STOCK_MAP = new Map(stocks.map((s) => [s.ticker, s]));

export function getAllStocks(): Stock[] {
  return stocks;
}

export function getStockByTicker(ticker: string): Stock | undefined {
  return STOCK_MAP.get(ticker.toUpperCase());
}

export function getStocksByRegion(region: "us" | "india"): Stock[] {
  return stocks.filter((s) => s.region === region);
}

export function getTopGainers(region: "us" | "india", limit = 4): Stock[] {
  return getStocksByRegion(region)
    .filter((s) => s.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, limit);
}

export function getTopLosers(region: "us" | "india", limit = 4): Stock[] {
  return getStocksByRegion(region)
    .filter((s) => s.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, limit);
}

export { stocks };
