"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UnderstandingSlider } from "@/components/UnderstandingSlider";
import Link from "next/link";

const summaries = [
  {
    summary:
      "The EU made a new rule that says companies have to be more careful about pollution. This affects how things are made and shipped around the world. It means products might cost a little more, but it helps the planet.",
    meaning:
      "Companies that make things — from clothes to electronics — now need to track how much pollution they create. If they pollute too much, they could face fines. This is like a report card for how clean a company is.",
    context:
      "Climate change is making weather more extreme around the world. Many countries are trying to reduce pollution to slow this down. The EU (a group of European countries that work together) has been leading these efforts.",
    impact:
      "You might see prices go up slightly on some imported products. But over time, companies will find cleaner ways to make things, which is better for everyone's health and the environment.",
  },
  {
    summary:
      "The European Union has passed new carbon reduction regulations requiring companies to monitor and reduce emissions throughout their supply chains. This legislation affects global trade and manufacturing practices.",
    meaning:
      "Companies operating in or exporting to Europe must now implement carbon tracking across their entire production pipeline. Non-compliance could result in trade restrictions or financial penalties.",
    context:
      "This builds on the EU's European Green Deal and the Carbon Border Adjustment Mechanism (CBAM). Previous legislation focused on direct emissions, but this extends to Scope 3 — indirect emissions in supply chains.",
    impact:
      "Expect restructuring of global supply chains as manufacturers seek lower-carbon alternatives. Companies may shift production to regions with cleaner energy grids or invest in carbon capture technology.",
  },
  {
    summary:
      "The EU has enacted comprehensive supply chain carbon legislation mandating full-scope emissions tracking and reduction targets for companies trading within the single market, building on the CBAM framework.",
    meaning:
      "This regulation extends carbon accountability to Scope 3 emissions, requiring companies to audit and report the carbon intensity of their entire value chain — from raw material extraction to last-mile delivery.",
    context:
      "Following COP28 commitments and the EU's Fit for 55 package, this legislation closes the gap between direct emission regulation and supply chain accountability. It harmonizes with the Corporate Sustainability Reporting Directive (CSRD).",
    impact:
      "Markets are pricing in supply chain restructuring costs. Carbon credit markets will see increased demand. Companies with existing ESG frameworks will have a competitive advantage in EU market access.",
  },
  {
    summary:
      "The EU Council has ratified an amendment to the CBAM regulation extending carbon pricing mechanisms to encompass Scope 1-3 emissions across all supply chain tiers for goods entering the European single market.",
    meaning:
      "This creates a de facto global carbon price floor for EU-bound goods, requiring lifecycle assessment (LCA) documentation and verified emission reduction pathways aligned with Science Based Targets initiative (SBTi) methodologies.",
    context:
      "This regulation represents the convergence of the EU Taxonomy, CSRD, and CBAM into a unified compliance framework. It addresses the carbon leakage problem that undermined previous unilateral carbon pricing efforts under the ETS.",
    impact:
      "Anticipate significant repricing of carbon-intensive commodities and derivatives. Supply chain finance instruments will increasingly embed carbon metrics. Emerging market exporters face material compliance costs without technical assistance frameworks.",
  },
];

export default function ArticlePage() {
  const [level, setLevel] = useState(1);
  const content = summaries[level];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Hero */}
      <div
        className="relative h-[280px] flex items-end p-6"
        style={{
          background:
            "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back button */}
        <Link
          href="/"
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
              Climate
            </span>
            <span className="text-xs text-white/60">3h ago</span>
          </div>
          <h1 className="text-xl font-bold text-white leading-snug">
            EU passes landmark carbon reduction law affecting global supply
            chains
          </h1>
          <div className="flex items-center gap-3 text-xs text-white/50">
            <span>Reuters</span>
            <span>4 min read</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 pt-5 space-y-5">
        {/* Understanding Slider */}
        <UnderstandingSlider value={level} onChange={setLevel} />

        {/* AI Summary */}
        <motion.section
          key={`summary-${level}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-50 rounded-2xl p-5 border border-primary-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
              <svg
                width="12"
                height="12"
                fill="white"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-primary-700">
              AI Summary
            </h3>
          </div>
          <p className="text-sm text-primary-900 leading-relaxed">
            {content.summary}
          </p>
        </motion.section>

        {/* What This Actually Means */}
        <motion.section
          key={`meaning-${level}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-surface rounded-2xl p-5 border border-border"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            What This Actually Means
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {content.meaning}
          </p>
        </motion.section>

        {/* Context */}
        <motion.section
          key={`context-${level}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-2xl p-5 border border-border"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            Background & Context
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {content.context}
          </p>
        </motion.section>

        {/* Why It Matters */}
        <motion.section
          key={`impact-${level}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-accent-50 rounded-2xl p-5 border border-accent-100"
        >
          <h3 className="text-sm font-semibold text-accent-700 mb-2">
            Why It Matters To You
          </h3>
          <p className="text-sm text-accent-800 leading-relaxed">
            {content.impact}
          </p>
        </motion.section>

        {/* Related Topics */}
        <section className="pb-6">
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Related Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "European Green Deal",
              "Carbon Markets",
              "Supply Chain",
              "CBAM",
              "Climate Policy",
            ].map((topic) => (
              <span
                key={topic}
                className="text-xs px-3 py-1.5 rounded-full bg-surface-secondary text-text-secondary border border-border cursor-pointer hover:border-primary-300 transition-colors"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
