// Gemini Flash 2.0 wrapper for AI explanations.
// Free tier: 15 RPM, 1500 RPD. We cache aggressively by article id.

import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-2.5-flash";

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

export interface ExplainedLevel {
  meaning: string;
  context: string;
  impact: string;
}

export interface ExplainedPayload {
  aiSummary: string;
  levels: [ExplainedLevel, ExplainedLevel, ExplainedLevel, ExplainedLevel];
  relatedTopics: string[];
}

// In-memory cache: article id → explanations. Persists for the function lifetime.
const explanationCache = new Map<string, ExplainedPayload>();
const MAX_EXPLANATION_CACHE = 200;

const SYSTEM_PROMPT = `You are Nova's news interpreter. Nova is a calm news app for people who feel overwhelmed by traditional news — built to help them understand the world without jargon, fear, or fatigue.

You are given a news article. Your job is to generate 4 reading-level explanations PLUS a short AI summary PLUS 3-5 related topic tags.

Each of the 4 levels has 3 fields:
- "meaning": What this story actually means in practical terms
- "context": Background — why this is happening, what led up to it
- "impact": Why this matters to the reader's life or to the broader world

LEVEL TONE GUIDE:
- Beginner: Everyday language. Zero jargon. Like a kind friend explaining it. Short sentences (1–2 per field).
- Simple: Clear and approachable, slightly more detail. 2–3 sentences per field.
- Standard: Standard news language with terms explained where needed. 2–3 sentences per field.
- Expert: Detailed analysis with full financial/political/scientific terminology. 2–4 sentences per field.

NEVER use emojis. NEVER add markdown formatting. NEVER fabricate facts not implied by the article. If the article is too thin to write expert-level commentary, keep it factual rather than embellishing.

Return ONLY valid JSON in this exact shape, with no markdown fences:
{
  "aiSummary": "A calm 2-sentence summary of what happened.",
  "relatedTopics": ["3-5 short topic tags, 1-3 words each"],
  "levels": [
    {"meaning": "...", "context": "...", "impact": "..."},
    {"meaning": "...", "context": "...", "impact": "..."},
    {"meaning": "...", "context": "...", "impact": "..."},
    {"meaning": "...", "context": "...", "impact": "..."}
  ]
}`;

function stripJsonFences(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```(?:json)?\n?/, "").replace(/```$/, "").trim();
  }
  return trimmed;
}

function fallbackPayload(article: { title: string; aiSummary: string }): ExplainedPayload {
  const m = article.aiSummary || article.title;
  const stubLevel = (style: string): ExplainedLevel => ({
    meaning: `${style} ${m}`,
    context: "Additional background isn't available right now. The article itself is the best source.",
    impact: "We couldn't generate a custom explanation. Read the original story for full detail.",
  });
  return {
    aiSummary: article.aiSummary || article.title,
    relatedTopics: [],
    levels: [
      stubLevel("Here's what happened:"),
      stubLevel("In short:"),
      stubLevel("Summary:"),
      stubLevel("Brief:"),
    ],
  };
}

export async function explainArticle(article: {
  id: string;
  title: string;
  aiSummary: string;
  body: string;
  source: string;
}): Promise<ExplainedPayload> {
  if (explanationCache.has(article.id)) {
    return explanationCache.get(article.id)!;
  }

  const c = client();
  if (!c) return fallbackPayload(article);

  const userPrompt = `ARTICLE TITLE: ${article.title}

ARTICLE SUMMARY: ${article.aiSummary}

ARTICLE BODY:
${article.body.slice(0, 6000)}

SOURCE: ${article.source}`;

  try {
    const model = c.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    const result = await model.generateContent(userPrompt);
    const text = stripJsonFences(result.response.text());
    const parsed = JSON.parse(text) as ExplainedPayload;

    // Validate shape
    if (!parsed.levels || parsed.levels.length !== 4) {
      throw new Error("Invalid Gemini response shape");
    }

    // Cache (with LRU-style eviction)
    if (explanationCache.size >= MAX_EXPLANATION_CACHE) {
      const firstKey = explanationCache.keys().next().value;
      if (firstKey) explanationCache.delete(firstKey);
    }
    explanationCache.set(article.id, parsed);

    return parsed;
  } catch (err) {
    console.error("Gemini explain failed", err);
    return fallbackPayload(article);
  }
}

export interface StockCommentary {
  about: string;
  signal: "bullish" | "bearish" | "neutral";
  signalReason: string;
  analystSummary: string;
  metricExplanations: Record<string, string>;
}

const STOCK_COMMENTARY_CACHE = new Map<
  string,
  { commentary: StockCommentary; expiresAt: number }
>();

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
  recentNewsTitles?: string[];
}): Promise<StockCommentary> {
  const cacheKey = input.ticker.toUpperCase();
  const cached = STOCK_COMMENTARY_CACHE.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.commentary;

  const c = client();
  if (!c) {
    return {
      about: input.longBusinessSummary ?? `${input.name} is a publicly traded company.`,
      signal:
        input.changePercent > 1 ? "bullish" : input.changePercent < -1 ? "bearish" : "neutral",
      signalReason: "Live AI commentary is temporarily unavailable.",
      analystSummary: "Analyst summary is temporarily unavailable.",
      metricExplanations: {},
    };
  }

  const newsBlock = input.recentNewsTitles?.length
    ? `\nRecent headlines:\n${input.recentNewsTitles.slice(0, 5).map((t) => `- ${t}`).join("\n")}`
    : "";

  const prompt = `You are Nova's calm equity interpreter. Given live data on a publicly traded stock, write beginner-friendly commentary that helps a casual investor understand it.

STOCK: ${input.ticker} (${input.name})
PRICE: ${input.price}
DAY CHANGE: ${input.changePercent.toFixed(2)}%
MARKET CAP: ${input.marketCap ?? "N/A"}
P/E: ${input.peRatio ?? "N/A"}
52W RANGE: ${input.weekLow ?? "?"} – ${input.weekHigh ?? "?"}
${input.longBusinessSummary ? `\nBUSINESS DESCRIPTION:\n${input.longBusinessSummary.slice(0, 1200)}` : ""}${newsBlock}

Return ONLY valid JSON, no markdown, in this shape:
{
  "about": "2-3 sentence plain-language explanation of what this company does. Avoid jargon.",
  "signal": "bullish" | "bearish" | "neutral",
  "signalReason": "2-3 sentences explaining the current signal in plain language. Reference the recent move and any obvious drivers.",
  "analystSummary": "2-3 sentences with the general analyst stance and any near-term catalysts. If unknown, be honest and say so.",
  "metricExplanations": {
    "P/E Ratio": "1-2 sentences explaining this stock's P/E in beginner terms",
    "Market Cap": "1 sentence putting the cap in context",
    "52-Week Range": "1 sentence on whether it's near highs or lows",
    "Day Change": "1 sentence on what today's % move means"
  }
}

Never use emojis. Never embellish facts. If a metric is missing, write "Data not available" for that key.`;

  try {
    const model = c.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.6,
        maxOutputTokens: 1500,
      },
    });
    const result = await model.generateContent(prompt);
    const text = stripJsonFences(result.response.text());
    const parsed = JSON.parse(text) as StockCommentary;
    if (!parsed.about || !parsed.signal) throw new Error("Invalid stock JSON");

    STOCK_COMMENTARY_CACHE.set(cacheKey, {
      commentary: parsed,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24h
    });
    return parsed;
  } catch (err) {
    console.error("Stock explain failed", err);
    return {
      about: input.longBusinessSummary ?? `${input.name} is a publicly traded company.`,
      signal:
        input.changePercent > 1 ? "bullish" : input.changePercent < -1 ? "bearish" : "neutral",
      signalReason: "Live AI commentary is temporarily unavailable.",
      analystSummary: "Analyst summary is temporarily unavailable.",
      metricExplanations: {},
    };
  }
}

export interface MarketSummary {
  title: string;
  explanation: string;
}

const MARKET_SUMMARY_CACHE = new Map<
  string,
  { summary: MarketSummary; expiresAt: number }
>();

export async function explainMarketState(
  region: "us" | "india",
  indices: { name: string; changePercent: number }[]
): Promise<MarketSummary> {
  const cached = MARKET_SUMMARY_CACHE.get(region);
  if (cached && cached.expiresAt > Date.now()) return cached.summary;

  const c = client();
  if (!c) {
    return {
      title: `${region === "india" ? "Indian" : "US"} markets opened today`,
      explanation: "We're temporarily unable to summarize today's market mood.",
    };
  }

  const indexList = indices
    .map((i) => `${i.name}: ${i.changePercent >= 0 ? "+" : ""}${i.changePercent.toFixed(2)}%`)
    .join(", ");

  try {
    const model = c.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.6,
        maxOutputTokens: 256,
      },
    });

    const prompt = `You are Nova's calm market interpreter.

Given today's ${region === "india" ? "Indian" : "US"} index movements: ${indexList}

Write a calm one-sentence headline and a 2-sentence plain-language explanation. Avoid jargon. Avoid emojis. Avoid alarmism.

Return JSON: {"title": "...", "explanation": "..."}`;

    const result = await model.generateContent(prompt);
    const text = stripJsonFences(result.response.text());
    const parsed = JSON.parse(text) as MarketSummary;

    MARKET_SUMMARY_CACHE.set(region, {
      summary: parsed,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 min
    });
    return parsed;
  } catch (err) {
    console.error("Market summary failed", err);
    return {
      title: `${region === "india" ? "Indian" : "US"} markets opened today`,
      explanation:
        "We're temporarily unable to summarize today's market mood.",
    };
  }
}
