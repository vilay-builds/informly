// Gemini Flash 2.5-lite wrapper for Vero's beginner-focused stock insights.
// Free tier: 1000 RPD on flash-lite. Cached aggressively per ticker.

import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-2.5-flash-lite";
const FALLBACK_MODEL = "gemini-flash-lite-latest";

let _client: GoogleGenerativeAI | null = null;
function client(): GoogleGenerativeAI | null {
  if (_client) return _client;
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn("GEMINI_API_KEY not set");
    return null;
  }
  _client = new GoogleGenerativeAI(key);
  return _client;
}

function stripJsonFences(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```(?:json)?\n?/, "").replace(/```$/, "").trim();
  }
  return trimmed;
}

async function generateWithFallback(
  c: GoogleGenerativeAI,
  args: {
    systemInstruction?: string;
    prompt: string;
    temperature?: number;
    maxOutputTokens?: number;
  }
): Promise<string> {
  const models = [MODEL_NAME, FALLBACK_MODEL];
  let lastErr: unknown = null;
  for (const modelName of models) {
    try {
      const model = c.getGenerativeModel({
        model: modelName,
        systemInstruction: args.systemInstruction,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: args.temperature ?? 0.6,
          maxOutputTokens: args.maxOutputTokens ?? 2048,
        },
      });
      const result = await model.generateContent(args.prompt);
      return stripJsonFences(result.response.text());
    } catch (err) {
      lastErr = err;
      console.warn(
        `Gemini model ${modelName} failed, trying next`,
        (err as Error).message
      );
    }
  }
  throw lastErr ?? new Error("All Gemini models failed");
}

// ============ STOCK COMMENTARY ============

export type TermFit = "short" | "mid" | "long" | "any";
export type BeginnerVerdict = "yes" | "maybe" | "wait" | "avoid";

export interface StockCommentary {
  /** 2-3 sentence plain-language explanation of what the company does */
  about: string;
  /** Bull/bear/neutral signal */
  signal: "bullish" | "bearish" | "neutral";
  /** Why we landed on that signal — in plain language */
  signalReason: string;
  /** Best-fit time horizon */
  termFit: TermFit;
  /** Why this term — short paragraph */
  termFitReason: string;
  /** Should a new investor consider this stock? */
  beginnerVerdict: BeginnerVerdict;
  /** Why this verdict — short paragraph */
  beginnerVerdictReason: string;
  /** 2-3 bullet reasons people are bullish */
  whyBuying: string[];
  /** 2-3 bullet risks / why people are cautious */
  whyAvoiding: string[];
  /** What broader market analysts are saying */
  analystSummary: string;
  /** Per-metric beginner explanations */
  metricExplanations: Record<string, string>;
}

const STOCK_COMMENTARY_CACHE = new Map<
  string,
  { commentary: StockCommentary; expiresAt: number }
>();

const SYSTEM_PROMPT_STOCK = `You are the in-app stock interpreter for a calm, beginner-first investing app aimed at young Indian users who are new to the market. Your goal: help them understand stocks the way a wise older sibling would — patient, clear, never preachy, never hype-y.

GROUND RULES:
- Always use everyday language. When you must use a financial term, explain it inline in plain English.
- Be honest about risk. Never sound like a finsta pump or a doomer thread.
- Never use emojis. Never use markdown formatting (no **bold**, no bullet symbols — JSON arrays are bullets enough).
- Stay factual; if you don't know something specific, say "details aren't clear" rather than inventing numbers.
- All amounts in INR when the context is Indian. Use Indian numbering (Lakh / Crore) where natural.

CRITICAL — TAKE A REAL STANCE:
You MUST form a genuine opinion based on the data provided. Do NOT default to neutral/wait/any. Analyse the actual numbers:
- If P/E is reasonable, growth is solid, and sentiment is positive → say bullish. If the stock is overvalued, at 52-week highs with weakening fundamentals → say bearish.
- Only use "neutral" when the data genuinely pulls in both directions with roughly equal weight. Most stocks are NOT neutral — they lean one way.
- For termFit: pick the BEST single horizon. "any" should be rare — most stocks suit one horizon better than others based on their volatility, growth stage, and dividend profile.
- For beginnerVerdict: "yes" means a stable, well-known company a beginner can reasonably hold. "maybe" means it's fine but needs some homework. "wait" means timing or volatility makes it risky right now. "avoid" means it's too complex, speculative, or risky for someone new. Pick the one that genuinely fits.
- You are not a financial advisor and this is not a buy/sell recommendation — but you ARE an informed interpreter who should have a clear, defensible view. Sitting on the fence helps nobody.

REQUIRED JSON SHAPE (no markdown fences, no preamble):
{
  "about": "2-3 sentence plain explanation of what the company actually does. What do they sell or provide? Why do people use them?",
  "signal": "bullish" | "bearish" | "neutral",
  "signalReason": "2-3 sentences. Why is it bullish/bearish/neutral RIGHT NOW based on the live data and headlines provided. Reference specific numbers from the data (price relative to 52-week range, P/E, recent move).",
  "termFit": "short" | "mid" | "long" | "any",
  "termFitReason": "2-3 sentences. Why does this stock fit that horizon best? Mention what the timeframe means (short = weeks to a few months, mid = 6 months to about 2 years, long = 3 years or more). Connect it to the company's growth stage and stability.",
  "beginnerVerdict": "yes" | "maybe" | "wait" | "avoid",
  "beginnerVerdictReason": "2-3 sentences. Speak directly to the beginner: what should they know before considering this stock? If it's a yes, say what makes it approachable. If avoid, say what specifically makes it risky for a new investor.",
  "whyBuying": ["Exactly 3 concise reasons people are optimistic. Each must be 1 specific sentence referencing real data or business strength, not generic praise."],
  "whyAvoiding": ["Exactly 3 concise risks or concerns. Each must be 1 specific sentence referencing a real weakness, not generic caution."],
  "analystSummary": "2-3 sentences. What broader market analysts think and any near-term catalysts or concerns. If unknown, say so honestly.",
  "metricExplanations": {
    "P/E Ratio": "3-4 sentences. First explain what P/E means in plain language (price divided by earnings — how many years of current profits it would take to equal the stock price). Then say whether THIS stock's P/E is high, low, or average for its sector and what that implies. If P/E is N/A, explain why (the company might not be profitable yet, or data may not be available). End with when a beginner should care about P/E.",
    "Market Cap": "2-3 sentences. Explain what market cap tells you about a company's size (total value of all its shares). Say whether this company is a large-cap, mid-cap, or small-cap and what that means for stability and growth potential.",
    "52-Week Range": "2-3 sentences. Explain that this shows the highest and lowest price in the past year. Say where the current price sits in that range and what that might suggest — near the high could mean momentum or overvaluation, near the low could mean a dip or trouble.",
    "Day Change": "2-3 sentences. Explain what today's price movement means. Say whether this is a normal-sized move for this stock or unusually large. Remind beginners that one day's move matters much less than the longer trend.",
    "Dividend Yield": "2-3 sentences. Explain what dividends are (a share of profits paid to shareholders, usually quarterly). Say what this stock's yield means — is it generous, modest, or zero? If N/A or zero, explain that many growth companies reinvest profits instead of paying dividends, and that's not necessarily bad.",
    "Volume": "2-3 sentences. Explain what trading volume means (how many shares changed hands today). Say whether this stock's volume is high or low and what that means for a beginner — high volume means it's easy to buy and sell, low volume can mean your order takes longer to fill or the price can jump around more."
  }
}`;

function fallbackStockCommentary(input: {
  ticker: string;
  name: string;
  longBusinessSummary?: string;
  changePercent: number;
}): StockCommentary {
  return {
    about:
      input.longBusinessSummary?.slice(0, 400) ??
      `${input.name} is listed on the NSE. Detailed company info is temporarily unavailable.`,
    signal:
      input.changePercent > 1
        ? "bullish"
        : input.changePercent < -1
          ? "bearish"
          : "neutral",
    signalReason:
      "Live AI commentary is temporarily unavailable. The signal above is a rough read based on today's price movement only.",
    termFit: "any",
    termFitReason:
      "We couldn't generate a horizon view right now. As a rule of thumb: short term means weeks to a few months, mid term means 6 months to about 2 years, and long term means 3 years or more.",
    beginnerVerdict: "wait",
    beginnerVerdictReason:
      "Detailed beginner guidance is temporarily unavailable. When in doubt, take time to read about the company before deciding.",
    whyBuying: [],
    whyAvoiding: [],
    analystSummary: "Analyst summary is temporarily unavailable.",
    metricExplanations: {},
  };
}

export async function explainStock(input: {
  ticker: string;
  name: string;
  longBusinessSummary?: string;
  price: number;
  changePercent: number;
  marketCap: number | null;
  peRatio: number | null;
  weekHigh: number | null;
  weekLow: number | null;
  dividendYield?: number | null;
  volume?: number | null;
  recentNewsTitles?: string[];
}): Promise<StockCommentary> {
  const cacheKey = input.ticker.toUpperCase();
  const cached = STOCK_COMMENTARY_CACHE.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.commentary;

  const c = client();
  if (!c) return fallbackStockCommentary(input);

  const newsBlock = input.recentNewsTitles?.length
    ? `\nRecent headlines:\n${input.recentNewsTitles.slice(0, 5).map((t) => `- ${t}`).join("\n")}`
    : "";

  const pos52w = input.weekLow != null && input.weekHigh != null && input.weekHigh > input.weekLow
    ? (((input.price - input.weekLow) / (input.weekHigh - input.weekLow)) * 100).toFixed(0)
    : null;

  const prompt = `STOCK: ${input.ticker} (${input.name}) — NSE listed
PRICE: ₹${input.price}
DAY CHANGE: ${input.changePercent.toFixed(2)}%
MARKET CAP: ${input.marketCap ?? "N/A"}
P/E: ${input.peRatio ?? "N/A"}
DIVIDEND YIELD: ${input.dividendYield != null ? `${(input.dividendYield * 100).toFixed(2)}%` : "N/A"}
VOLUME TODAY: ${input.volume ?? "N/A"}
52W RANGE: ₹${input.weekLow ?? "?"} – ₹${input.weekHigh ?? "?"}${pos52w ? ` (current price is at the ${pos52w}% mark of this range)` : ""}
${input.longBusinessSummary ? `\nBUSINESS DESCRIPTION:\n${input.longBusinessSummary.slice(0, 1500)}` : ""}${newsBlock}

Analyse the data above carefully. Take a clear stance — do not hedge toward neutral/wait/any unless the data genuinely supports it. Produce the full JSON commentary.`;

  try {
    const text = await generateWithFallback(c, {
      systemInstruction: SYSTEM_PROMPT_STOCK,
      prompt,
      temperature: 0.7,
      maxOutputTokens: 3500,
    });
    const parsed = JSON.parse(text) as StockCommentary;
    if (!parsed.about || !parsed.signal) throw new Error("Invalid stock JSON");

    // Ensure arrays even if the model omitted them
    parsed.whyBuying = parsed.whyBuying ?? [];
    parsed.whyAvoiding = parsed.whyAvoiding ?? [];
    parsed.metricExplanations = parsed.metricExplanations ?? {};

    STOCK_COMMENTARY_CACHE.set(cacheKey, {
      commentary: parsed,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24h
    });
    return parsed;
  } catch (err) {
    console.error("Stock explain failed", err);
    return fallbackStockCommentary(input);
  }
}

// ============ MARKET MOOD ============

export interface MarketSummary {
  title: string;
  explanation: string;
}

const MARKET_SUMMARY_CACHE = new Map<
  string,
  { summary: MarketSummary; expiresAt: number }
>();

export async function explainMarketState(
  indices: { name: string; changePercent: number }[]
): Promise<MarketSummary> {
  const cacheKey = "india";
  const cached = MARKET_SUMMARY_CACHE.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.summary;

  const c = client();
  if (!c) {
    return {
      title: "Indian markets opened today",
      explanation:
        "We're temporarily unable to summarize today's market mood. Check back in a few minutes.",
    };
  }

  const indexList = indices
    .map(
      (i) =>
        `${i.name}: ${i.changePercent >= 0 ? "+" : ""}${i.changePercent.toFixed(2)}%`
    )
    .join(", ");

  const prompt = `You are the calm market interpreter for a beginner-friendly Indian investing app.

Today's Indian index movements: ${indexList}

Write a calm one-sentence headline (under 12 words) and a 2-sentence plain-language explanation of what's happening in plain Hinglish-free English. Avoid jargon. Avoid emojis. Avoid alarmism.

Return JSON: {"title": "...", "explanation": "..."}`;

  try {
    const text = await generateWithFallback(c, {
      prompt,
      temperature: 0.55,
      maxOutputTokens: 300,
    });
    const parsed = JSON.parse(text) as MarketSummary;

    MARKET_SUMMARY_CACHE.set(cacheKey, {
      summary: parsed,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });
    return parsed;
  } catch (err) {
    console.error("Market summary failed", err);
    return {
      title: "Indian markets opened today",
      explanation:
        "We're temporarily unable to summarize today's market mood. Check back in a few minutes.",
    };
  }
}
