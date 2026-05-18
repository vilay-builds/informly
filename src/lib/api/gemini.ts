// Gemini Flash 2.0 wrapper for AI explanations.
// Free tier: 15 RPM, 1500 RPD. We cache aggressively by article id.

import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Free tier limits per day on the project:
// - gemini-2.5-flash:       20 RPD   (too restrictive for real usage)
// - gemini-2.5-flash-lite:  1,000 RPD (50x more headroom, still high quality)
// - gemini-flash-lite-latest: same as lite, just the moving alias
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

export interface ExplainedLevel {
  meaning: string;
  context: string;
  impact: string;
}

export interface ExplainedPayload {
  aiSummary: string;
  expandedBody: string; // Nova-quality article (3-5 paragraphs) when source is thin
  levels: [ExplainedLevel, ExplainedLevel, ExplainedLevel, ExplainedLevel];
  relatedTopics: string[];
}

// In-memory cache: article id → explanations. Persists for the function lifetime.
const explanationCache = new Map<string, ExplainedPayload>();
const MAX_EXPLANATION_CACHE = 200;

const SYSTEM_PROMPT = `You are Nova's news interpreter. Nova is a calm news app for people who feel overwhelmed by traditional news — built to help them understand the world without jargon, fear, or fatigue.

You receive a news article (often only a headline and 1-2 sentence summary from a news aggregator). Produce:

1. "aiSummary" — a calm, paraphrased 2-sentence summary of what happened.
2. "expandedBody" — a thoughtful Nova-original write-up of the story across 3-5 paragraphs. Use the source title and summary as anchors, but flesh out the story with the obvious context a well-informed reader would know. Maintain a journalistic, factual tone. Never fabricate specific numbers, quotes, or names not implied by the source. If you genuinely don't know something, frame it as a question or note that "details are still emerging".
3. "relatedTopics" — 3-5 short topic tags, 1-3 words each.
4. "levels" — 4 reading-level explanations. Each level has 3 fields: "meaning" (what it actually means in practical terms), "context" (background, what led to it), "impact" (why it matters to the reader).

LEVEL TONE GUIDE:
- Beginner: Everyday language. Zero jargon. Like a kind friend explaining it. 1-2 sentences per field.
- Simple: Clear and approachable with a bit more depth. 2-3 sentences per field.
- Standard: Standard news language with terms explained where needed. 2-3 sentences per field.
- Expert: Detailed analysis with full financial/political/scientific terminology. 2-4 sentences per field.

GENERAL RULES:
- NEVER use emojis.
- NEVER add markdown formatting (no **bold**, no headers).
- NEVER fabricate facts. If something isn't in the source and isn't general knowledge, don't claim it.
- Match the language and reading level of the source article.
- Keep an even, calm tone. No alarmism, no hype.

Return ONLY valid JSON in this exact shape (no markdown fences, no preamble):
{
  "aiSummary": "...",
  "expandedBody": "Paragraph 1.\\n\\nParagraph 2.\\n\\nParagraph 3.\\n\\nOptional paragraph 4.",
  "relatedTopics": ["..."],
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
          temperature: args.temperature ?? 0.7,
          maxOutputTokens: args.maxOutputTokens ?? 2048,
        },
      });
      const result = await model.generateContent(args.prompt);
      return stripJsonFences(result.response.text());
    } catch (err) {
      lastErr = err;
      console.warn(`Gemini model ${modelName} failed, trying next`, (err as Error).message);
    }
  }
  throw lastErr ?? new Error("All Gemini models failed");
}

function fallbackPayload(article: { title: string; aiSummary: string; body?: string }): ExplainedPayload {
  const m = article.aiSummary || article.title;
  const stubLevel = (style: string): ExplainedLevel => ({
    meaning: `${style} ${m}`,
    context: "Additional background isn't available right now. The article itself is the best source.",
    impact: "We couldn't generate a custom explanation. Read the original story for full detail.",
  });
  return {
    aiSummary: article.aiSummary || article.title,
    expandedBody: article.body || article.aiSummary || article.title,
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
    const text = await generateWithFallback(c, {
      systemInstruction: SYSTEM_PROMPT,
      prompt: userPrompt,
      temperature: 0.7,
      maxOutputTokens: 4096,
    });
    const parsed = JSON.parse(text) as ExplainedPayload;

    // Validate shape
    if (!parsed.levels || parsed.levels.length !== 4) {
      throw new Error("Invalid Gemini response shape");
    }
    if (!parsed.expandedBody) parsed.expandedBody = article.body || article.aiSummary;

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
    const text = await generateWithFallback(c, {
      prompt,
      temperature: 0.6,
      maxOutputTokens: 1500,
    });
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
    const prompt = `You are Nova's calm market interpreter.

Given today's ${region === "india" ? "Indian" : "US"} index movements: ${indexList}

Write a calm one-sentence headline and a 2-sentence plain-language explanation. Avoid jargon. Avoid emojis. Avoid alarmism.

Return JSON: {"title": "...", "explanation": "..."}`;

    const text = await generateWithFallback(c, {
      prompt,
      temperature: 0.6,
      maxOutputTokens: 256,
    });
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
