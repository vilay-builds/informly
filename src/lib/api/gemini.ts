// Gemini Flash 2.5-lite wrapper for beginner-focused stock insights.
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
- Never recommend specific buys or sells. Frame everything as "what someone might consider".
- Never use emojis. Never use markdown formatting (no **bold**, no bullet symbols — JSON arrays are bullets enough).
- Stay factual; if you don't know something specific, say "details aren't clear" rather than inventing numbers.
- All amounts in INR (₹) when the context is Indian. Use Indian numbering (Lakh / Crore) where natural.

REQUIRED JSON SHAPE (no markdown fences, no preamble):
{
  "about": "2-3 sentence plain explanation of what the company actually does.",
  "signal": "bullish" | "bearish" | "neutral",
  "signalReason": "2-3 sentences. Why is it bullish/bearish/neutral RIGHT NOW based on the live data and headlines provided.",
  "termFit": "short" | "mid" | "long" | "any",
  "termFitReason": "2-3 sentences. Why does this stock fit that horizon best for a beginner? Mention what the timeframes mean (short = weeks to a few months, mid = 6 months to ~2 years, long = 3+ years).",
  "beginnerVerdict": "yes" | "maybe" | "wait" | "avoid",
  "beginnerVerdictReason": "2-3 sentences. Would a true beginner be reasonable to look at this stock? Be honest. If volatility or complexity is high, say so.",
  "whyBuying": ["2-3 concise bullet-phrase reasons people are bullish. Each 1 short sentence."],
  "whyAvoiding": ["2-3 concise bullet-phrase risks or reasons people are cautious. Each 1 short sentence."],
  "analystSummary": "2-3 sentences. Stance of broader market analysts and any near-term catalysts. If unknown, say so honestly.",
  "metricExplanations": {
    "P/E Ratio": "1-2 sentences. What this number means for THIS company. Use plain language.",
    "Market Cap": "1 sentence. What the size means in context.",
    "52-Week Range": "1 sentence. Whether the price is near a high or low.",
    "Day Change": "1 sentence. What today's move means.",
    "Dividend Yield": "1 sentence. What this means for shareholders."
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

  const prompt = `STOCK: ${input.ticker} (${input.name}) — NSE listed
PRICE: ₹${input.price}
DAY CHANGE: ${input.changePercent.toFixed(2)}%
MARKET CAP: ${input.marketCap ?? "N/A"}
P/E: ${input.peRatio ?? "N/A"}
DIVIDEND YIELD: ${input.dividendYield ?? "N/A"}
52W RANGE: ₹${input.weekLow ?? "?"} – ₹${input.weekHigh ?? "?"}
${input.longBusinessSummary ? `\nBUSINESS DESCRIPTION:\n${input.longBusinessSummary.slice(0, 1500)}` : ""}${newsBlock}

Now produce the full JSON commentary for a beginner-first Indian investor.`;

  try {
    const text = await generateWithFallback(c, {
      systemInstruction: SYSTEM_PROMPT_STOCK,
      prompt,
      temperature: 0.55,
      maxOutputTokens: 2500,
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
