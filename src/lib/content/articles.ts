import { Article, estimateReadTime } from "./types";

const CATEGORY_COLORS: Record<string, string> = {
  "AI & Technology": "#5b6ef2",
  Climate: "#22c55e",
  Economy: "#0ea5e9",
  Markets: "#f59e0b",
  Health: "#f04e1a",
  World: "#8b5cf6",
  Business: "#06b6d4",
  Politics: "#dc2626",
  Science: "#a855f7",
  Culture: "#ec4899",
};

const articles: Article[] = [
  {
    id: "eu-carbon-law",
    title: "EU passes landmark carbon reduction law affecting global supply chains",
    category: "Climate",
    categoryColor: CATEGORY_COLORS.Climate,
    source: "Reuters",
    timeAgo: "3h ago",
    image:
      "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=1200&q=85",
    aiSummary:
      "The EU has passed new regulations requiring companies to track and reduce carbon emissions across their entire supply chains. This affects global trade and could change how everyday products are made and shipped.",
    body: `European Union lawmakers voted overwhelmingly on Thursday to approve what many are calling the most ambitious climate legislation in history, mandating that companies doing business within the bloc must track, report, and actively reduce carbon emissions across their entire supply chains.

The regulation, which passed with 467 votes in favor and 142 against, extends the existing Carbon Border Adjustment Mechanism to cover what are known as Scope 3 emissions — the indirect greenhouse gases produced throughout a product's entire lifecycle, from raw material extraction to final delivery.

Under the new rules, companies importing goods into the EU will be required to provide detailed carbon footprint documentation for every stage of their production process. Those failing to meet gradually tightening reduction targets will face financial penalties and potential trade restrictions.

"This is about creating a level playing field," said Frans Timmermans, the EU's climate policy chief, during a press conference following the vote. "Companies that invest in clean production should not be undercut by those that don't."

The legislation will be phased in over three years, giving businesses time to adapt their reporting systems and supply chain practices. Small and medium enterprises will receive additional transition support.

Industry groups have expressed mixed reactions. The European Round Table for Industry acknowledged the environmental necessity but warned about competitiveness impacts, particularly for manufacturers dependent on complex global supply chains.

Environmental organizations broadly welcomed the move, though some argued the three-year phase-in period was too generous given the urgency of the climate crisis.

The regulation is expected to affect an estimated 45,000 companies operating within the EU single market, with ripple effects extending to hundreds of thousands of suppliers worldwide.`,
    explained: [
      {
        meaning:
          "Companies that make things — from clothes to electronics — now need to track how much pollution they create. If they pollute too much, they could face fines. This is like a report card for how clean a company is.",
        context:
          "Climate change is making weather more extreme around the world. Many countries are trying to reduce pollution to slow this down. The EU (a group of European countries that work together) has been leading these efforts.",
        impact:
          "You might see prices go up slightly on some imported products. But over time, companies will find cleaner ways to make things, which is better for everyone's health and the environment.",
      },
      {
        meaning:
          "Companies operating in or exporting to Europe must now implement carbon tracking across their entire production pipeline. Non-compliance could result in trade restrictions or financial penalties.",
        context:
          "This builds on the EU's European Green Deal and the Carbon Border Adjustment Mechanism (CBAM). Previous legislation focused on direct emissions, but this extends to Scope 3 — indirect emissions in supply chains.",
        impact:
          "Expect restructuring of global supply chains as manufacturers seek lower-carbon alternatives. Companies may shift production to regions with cleaner energy grids or invest in carbon capture technology.",
      },
      {
        meaning:
          "This regulation extends carbon accountability to Scope 3 emissions, requiring companies to audit and report the carbon intensity of their entire value chain — from raw material extraction to last-mile delivery.",
        context:
          "Following COP28 commitments and the EU's Fit for 55 package, this legislation closes the gap between direct emission regulation and supply chain accountability. It harmonizes with the Corporate Sustainability Reporting Directive (CSRD).",
        impact:
          "Markets are pricing in supply chain restructuring costs. Carbon credit markets will see increased demand. Companies with existing ESG frameworks will have a competitive advantage in EU market access.",
      },
      {
        meaning:
          "Creates a de facto global carbon price floor for EU-bound goods, requiring lifecycle assessment documentation and verified emission reduction pathways aligned with Science Based Targets initiative methodologies.",
        context:
          "Represents the convergence of the EU Taxonomy, CSRD, and CBAM into a unified compliance framework. It addresses the carbon leakage problem that undermined previous unilateral carbon pricing efforts under the ETS.",
        impact:
          "Anticipate significant repricing of carbon-intensive commodities and derivatives. Supply chain finance instruments will increasingly embed carbon metrics. Emerging market exporters face material compliance costs without technical assistance frameworks.",
      },
    ],
    relatedTopics: [
      "European Green Deal",
      "Carbon Markets",
      "Supply Chain",
      "CBAM",
      "Climate Policy",
    ],
    relatedArticleIds: ["china-solar-record", "ev-tariffs-eu"],
  },
  {
    id: "openai-reasoning",
    title: "OpenAI announces new reasoning model that can solve PhD-level problems",
    category: "AI & Technology",
    categoryColor: CATEGORY_COLORS["AI & Technology"],
    source: "The Verge",
    timeAgo: "2h ago",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=85",
    aiSummary:
      "OpenAI unveiled a new AI model that can solve advanced research problems by breaking them into multi-step reasoning chains, marking a leap toward AI that genuinely thinks before answering.",
    body: `OpenAI on Wednesday introduced its newest reasoning model, marketed as a step-change in artificial intelligence's ability to handle problems that have historically required deep human expertise.

The model, internally called "Orion," is the first in the company's lineup to perform extended chain-of-thought reasoning by default — meaning it pauses to think before answering, sometimes for several seconds, before generating a response.

In benchmark tests released alongside the launch, Orion solved 87% of competition-level mathematics problems and matched or exceeded human PhD-holders on graduate physics questions. It also showed marked improvement on coding tasks, particularly those involving multi-file architectural decisions.

Sam Altman, OpenAI's CEO, described the model as "the first one I'd trust to do my taxes" during the launch event in San Francisco, drawing laughter and applause from the audience.

The model will be available to ChatGPT Plus subscribers starting next week, with API access for developers rolling out in two phases over the following month. Pricing is significantly higher than previous models, reflecting the increased compute required for extended reasoning.

Critics and researchers have raised concerns about energy consumption, the opacity of the model's reasoning process, and the gap between benchmark performance and real-world reliability. OpenAI declined to share specific training compute figures.

The announcement comes amid intensifying competition from Anthropic, Google DeepMind, and several open-source labs, all of whom have made significant strides in reasoning capabilities over the past quarter.`,
    explained: [
      {
        meaning:
          "OpenAI made a smarter AI that can think through hard problems step by step, kind of like how a person works through a puzzle, instead of just blurting out an answer.",
        context:
          "AI has been improving very quickly. Until now, AI was good at writing and chatting but not great at hard reasoning. This new version is built to actually think.",
        impact:
          "It could help with research, complicated decisions, and even things like preparing your taxes. It's also expensive and uses a lot of energy.",
      },
      {
        meaning:
          "The new model uses extended chain-of-thought reasoning by default — it pauses to internally work through multi-step problems before generating a response, leading to much better performance on math, science, and coding tasks.",
        context:
          "OpenAI is racing against Anthropic, Google DeepMind, and open-source labs in the reasoning-AI category. The shift from fast-but-shallow to slow-but-deep models is reshaping how AI systems are evaluated.",
        impact:
          "Expect AI to be more useful in technical domains — research, software architecture, financial analysis. Compute costs will rise, and so will the value of efficient inference infrastructure.",
      },
      {
        meaning:
          "Orion implements explicit reasoning traces during inference, demonstrating PhD-level performance on graduate physics benchmarks and 87% solve rate on competition mathematics. Pricing reflects the increased compute footprint.",
        context:
          "Builds on the techniques pioneered in OpenAI's o1 series and DeepMind's AlphaProof. The category is converging on test-time compute scaling as the next reliability vector.",
        impact:
          "Watch GPU demand, particularly for inference-optimized chips. Companies building agentic systems will see meaningful capability uplifts. Energy and data-center constraints become rate-limiting.",
      },
      {
        meaning:
          "Frontier reasoning model deploying default test-time chain-of-thought with extended inference latency, achieving competition-math saturation and graduate-STEM parity on standardized benchmarks.",
        context:
          "Marks the operational maturation of inference-scaling laws, consolidating the o1 paradigm into a production model class. Competitive dynamics with Anthropic Claude-3.6 and Gemini-3 reasoning variants are now defined on cost-per-correct-answer rather than raw benchmark.",
        impact:
          "Repricing across the inference compute stack. Implications for SMI/TSMC node demand, hyperscaler capex guidance, and the secular thesis on inference-optimized silicon (Groq, Cerebras, Sambanova).",
      },
    ],
    relatedTopics: [
      "Artificial Intelligence",
      "OpenAI",
      "Reasoning Models",
      "AI Safety",
    ],
    relatedArticleIds: ["nvidia-blackwell"],
  },
  {
    id: "fed-rate-pause",
    title: "Federal Reserve signals pause on interest rate changes through summer",
    category: "Economy",
    categoryColor: CATEGORY_COLORS.Economy,
    source: "AP News",
    timeAgo: "5h ago",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=85",
    aiSummary:
      "The Federal Reserve indicated it will keep interest rates steady for the next several months, signaling caution as inflation cools and the job market remains resilient.",
    body: `The U.S. Federal Reserve signaled on Tuesday that it intends to leave benchmark interest rates unchanged through the summer, citing the need for more confidence that inflation is durably moving toward its 2% target before making further adjustments.

In a statement following the conclusion of its two-day policy meeting, the Federal Open Market Committee said economic activity continues to expand at a solid pace, the unemployment rate has remained low, and inflation, while moderating, "remains somewhat elevated."

The decision keeps the federal funds rate in its current range of 4.25% to 4.50%, where it has stood since the most recent cut in December.

Fed Chair Jerome Powell, speaking at a press conference following the announcement, said policymakers want to see "several more good readings" on inflation before considering changes. He repeatedly emphasized that the committee is "in no rush" to adjust policy.

Financial markets responded with mild relief, with the S&P 500 closing 0.4% higher and the 10-year Treasury yield slipping slightly. Futures markets are now pricing in roughly a 60% probability of a rate cut at the September meeting.

The decision has political implications, with critics on both sides of the aisle weighing in. Some lawmakers have urged the Fed to begin easing more aggressively to support borrowing and housing affordability, while others have warned that premature cuts could risk reigniting inflation.

For consumers, the practical implication is that mortgage rates, auto loan rates, and credit card APRs will largely remain at current levels for the next several months.`,
    explained: [
      {
        meaning:
          "The Federal Reserve — the group that controls how cheap or expensive it is to borrow money in the U.S. — said they're going to keep things the same for now. This is because they want to be sure prices have really stopped rising too fast.",
        context:
          "When prices go up a lot (inflation), the Fed makes borrowing more expensive to slow things down. When the economy is weak, they make it cheaper. Right now they're being cautious.",
        impact:
          "If you're shopping for a home, car, or have credit card debt, the cost of borrowing isn't going to change much in the next few months. Savings accounts will also keep paying similar interest.",
      },
      {
        meaning:
          "The Fed kept the federal funds rate at 4.25–4.50% and signaled patience, citing the need for more inflation data before considering further cuts. Markets are now pricing September as the more likely cut window.",
        context:
          "After aggressive hikes through 2023–2024 and a December cut, the Fed has settled into a holding pattern. Inflation has cooled but remains above the 2% target, while the labor market remains strong.",
        impact:
          "Mortgage rates, auto loans, and credit card APRs will stay near current levels. Equity markets get short-term relief; rate-sensitive sectors like real estate face continued pressure.",
      },
      {
        meaning:
          "FOMC held the policy rate unchanged at 4.25–4.50% and adopted a meeting-by-meeting framing, with Powell signaling no near-term urgency. Dot plot suggests 1–2 cuts in 2026 contingent on continued disinflation.",
        context:
          "The decision balances core PCE moderation against persistent services inflation and labor market tightness. Forward guidance is intentionally non-committal to retain optionality.",
        impact:
          "Curve steepening trades favored; financials neutral on NIM but benefit from stable funding. Watch September SEP for shift in median dot. Housing finance and CRE remain in the path of structurally higher rates.",
      },
      {
        meaning:
          "Federal Reserve maintains the target range at 4.25–4.50% with hawkish-hold framing, citing residual services-CPI stickiness and Phillips curve resilience as gating factors for the easing cycle.",
        context:
          "Powell's framing aligns with the Reaction-Function recalibration first signaled at Jackson Hole. The committee is signaling that the neutral rate may have drifted higher post-pandemic, limiting room for cumulative easing.",
        impact:
          "Front-end vol contained; back-end remains supply/term-premium driven. Cross-asset implications: USD bid sustained, EM carry under pressure, gold supportive on real-rate compression. Watch for divergence with ECB and BoJ paths.",
      },
    ],
    relatedTopics: [
      "Federal Reserve",
      "Interest Rates",
      "Inflation",
      "Monetary Policy",
    ],
    relatedArticleIds: ["bitcoin-record"],
  },
  {
    id: "japan-4day-week",
    title: "Japan introduces four-day work week pilot for government employees",
    category: "World",
    categoryColor: CATEGORY_COLORS.World,
    source: "BBC",
    timeAgo: "8h ago",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=85",
    aiSummary:
      "Japan is testing a four-day work week for government workers as part of a broader push to reverse declining birth rates and address chronic overwork culture.",
    body: `The Japanese government has launched a nationwide pilot programme allowing public sector employees to opt for a four-day working week, as part of a sweeping effort to address the country's declining birth rate and entrenched culture of overwork.

The programme, announced by Prime Minister Fumio Kishida earlier this week, will initially be available to roughly 1.5 million government workers across central and local agencies. Participants will retain their full salaries while compressing their work into four longer days, or by reducing total hours under certain conditions.

Japan's work culture, particularly its phenomenon of "karoshi" — death by overwork — has been the subject of international concern for decades. Despite previous reforms, average working hours remain among the highest in the developed world, and many employees feel social pressure to work long unpaid hours.

The government has framed the four-day week as a fertility policy. Japan's total fertility rate fell to 1.20 last year, well below the 2.1 needed to maintain population levels. Officials hope that giving workers more time for family life will encourage couples to have more children.

Private sector participation will remain voluntary, but the government is offering tax incentives to companies that adopt similar policies. Early adopters include several major firms in technology and finance.

International researchers studying similar trials in Iceland, the UK, and Spain have found that compressed workweeks generally maintain or improve productivity while improving employee wellbeing. Japan's pilot will be among the largest of its kind globally and is expected to produce significant data over the next 18 months.`,
    explained: [
      {
        meaning:
          "Japan is letting some government workers work only four days a week instead of five, while still getting paid the same. They hope this gives people more time to spend with family and maybe have kids.",
        context:
          "Japan has a serious problem — fewer babies are being born and the population is getting older. Also, people there often work very long hours, which is bad for their health and family time.",
        impact:
          "If it works, other countries might try it too. It could change how we think about work-life balance globally. For Japan specifically, it might help slow down their population decline.",
      },
      {
        meaning:
          "Japan rolled out a four-day work week pilot for ~1.5M government employees, framed as a demographic policy response to a 1.20 fertility rate. Private sector adoption is incentivized via tax credits.",
        context:
          "Japan's karoshi culture and aging demographics have resisted multiple reform attempts. This pilot follows promising results from similar programmes in Iceland and the UK and represents one of the largest such trials globally.",
        impact:
          "Watch productivity metrics over the 18-month evaluation window. If successful, expect emulation across South Korea and other aging East Asian economies. Implications for labor-market reform debates in OECD economies.",
      },
      {
        meaning:
          "Government-mandated 4-day-week trial deployed as a demographic intervention, targeting fertility-rate recovery and workforce participation rates. Compensation maintained; total hours reduced or compressed.",
        context:
          "Aligns with Kishida administration's broader 'New Capitalism' framework and demographic crisis response. Builds on academic research from the Icelandic and Cambridge UK trials demonstrating productivity neutrality.",
        impact:
          "Labor-market structural implications for sectors with high female-workforce attrition. Potential modest GDP-per-hour uplift offsetting headcount-hour reductions. Watch JPY-denominated equities in services and consumer discretionary.",
      },
      {
        meaning:
          "Sovereign-scale labor reform pilot deploying compressed-week framework as fertility and TFP intervention, with explicit demographic policy framing and fiscal-incentive private-sector spillover mechanism.",
        context:
          "Operates against backdrop of the Kishida government's demographic emergency framing and Bank of Japan's normalization cycle. Pilot architecture mirrors the Cambridge-protocol used in Iceland and the UK, with adjusted scale and public-sector anchor.",
        impact:
          "Cross-pricing implications: Japanese services productivity multipliers, household formation, and labor-force participation. Watch BoJ policy reaction function if wage growth accelerates. Demographic alpha thesis revives.",
      },
    ],
    relatedTopics: [
      "Work-Life Balance",
      "Demographics",
      "Japan",
      "Labor Policy",
    ],
    relatedArticleIds: [],
  },
  {
    id: "glp1-sleep-apnea",
    title: "Breakthrough weight-loss medication shows promise in treating sleep apnea",
    category: "Health",
    categoryColor: CATEGORY_COLORS.Health,
    source: "Nature",
    timeAgo: "6h ago",
    image:
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=1200&q=85",
    aiSummary:
      "A major clinical trial found that GLP-1 weight-loss drugs significantly reduce the severity of obstructive sleep apnea in obese adults, opening a new treatment pathway.",
    body: `A landmark clinical trial published this week in the New England Journal of Medicine has found that GLP-1 receptor agonists — the class of drugs that includes Ozempic, Wegovy, and Mounjaro — substantially reduce the severity of obstructive sleep apnea in patients with obesity.

The trial, conducted across 56 sites in nine countries, enrolled 942 adults with moderate to severe sleep apnea and a body mass index above 30. Over the course of one year, participants receiving tirzepatide saw their apnea-hypopnea index — a measure of breathing disruptions per hour of sleep — fall by an average of 25 events, more than three times the reduction seen in the placebo group.

Roughly 43% of treated participants achieved disease remission, defined as fewer than five apnea events per hour. Weight loss in the treatment arm averaged 18% of body weight over the trial period.

Obstructive sleep apnea affects an estimated 936 million adults globally and is associated with cardiovascular disease, diabetes, and reduced quality of life. Current standard treatment — CPAP therapy — is highly effective when used consistently, but adherence rates remain stubbornly low.

The results have prompted Eli Lilly to file for expanded FDA approval for tirzepatide as a sleep apnea treatment, which could be granted within months. Insurance coverage debates are expected to intensify, given the high cost of GLP-1 drugs and the broad eligible population.

Sleep medicine specialists called the findings "transformative" while cautioning that lifestyle interventions and CPAP therapy will remain first-line treatments for many patients. Researchers are also exploring whether the benefits extend beyond what weight loss alone would predict.`,
    explained: [
      {
        meaning:
          "The drugs people are taking for weight loss, like Ozempic, also seem to really help with sleep apnea — a condition where you stop breathing during sleep. About 43% of people in a study got rid of it entirely.",
        context:
          "Sleep apnea is more common than people think and affects nearly a billion adults worldwide. It can cause serious problems like heart disease. Until now, the main treatment was a mask people wear at night, which many find uncomfortable.",
        impact:
          "This gives many people a new option to treat sleep apnea, which could improve their health and quality of life. It also means the demand for these drugs will keep growing — and so will the debate about who pays for them.",
      },
      {
        meaning:
          "A phase 3 trial showed tirzepatide reduced sleep apnea severity (measured by apnea-hypopnea index) by 25 events per hour on average, with 43% of patients achieving disease remission and 18% body weight loss over 12 months.",
        context:
          "GLP-1 drugs have expanded indications beyond diabetes and weight loss into cardiovascular protection and now sleep medicine. Insurance coverage and access remain the limiting factors for population-level impact.",
        impact:
          "Eli Lilly is filing for FDA expanded approval, which could open a massive new market. Expect intensified insurance coverage battles. Sleep medicine clinics may see practice-pattern shifts away from CPAP-first treatment paradigms.",
      },
      {
        meaning:
          "SURMOUNT-OSA demonstrated tirzepatide reduced AHI by 25 events/hr (vs. placebo) and achieved 43% disease remission in moderate-to-severe OSA cohort with comorbid obesity. Body weight reduction averaged 18% at 52 weeks.",
        context:
          "Continues the GLP-1 indication-expansion thesis (CV outcomes, MASH, addiction, cognitive). Strengthens the case for metabolic etiology in conditions historically treated mechanically. Adherence-vs-CPAP economics increasingly favorable.",
        impact:
          "LLY tirzepatide TAM expansion; supply constraints continue limiting near-term realization. Watch CPAP device manufacturer ResMed/Philips equity reaction. Payer-pharma negotiations intensify with broadening indications.",
      },
      {
        meaning:
          "SURMOUNT-OSA NEJM publication: tirzepatide 10/15mg q.w. demonstrated -25.3 events/hr AHI reduction (p<0.001) and 43.3% remission rate over 52w in BMI≥30 OSA cohort. Weight loss correlates partially explain treatment effect.",
        context:
          "Validates the dual-incretin mechanistic thesis in metabolic-driven OSA pathophysiology. Insurance dynamics under intensifying examination given the convergence of obesity, T2D, CV, and now sleep indications under a single therapeutic class.",
        impact:
          "Tirzepatide NPV revision; LLY consensus EPS likely under-models. Cross-asset implications for managed-care payers, CPAP device manufacturers, and sleep diagnostics workflow operators. PBM formulary dynamics central to monetization curve.",
      },
    ],
    relatedTopics: ["GLP-1", "Sleep Medicine", "Obesity", "Public Health"],
    relatedArticleIds: [],
  },
  {
    id: "nvidia-blackwell",
    title: "NVIDIA Blackwell chips ship ahead of schedule, lifting AI infrastructure outlook",
    category: "Markets",
    categoryColor: CATEGORY_COLORS.Markets,
    source: "Bloomberg",
    timeAgo: "4h ago",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85",
    aiSummary:
      "NVIDIA's next-generation Blackwell GPUs began shipping to hyperscale customers earlier than expected, reaffirming the company's grip on the AI chip market.",
    body: `NVIDIA confirmed on Thursday that its next-generation Blackwell GPU architecture has begun shipping to hyperscale customers approximately three weeks ahead of the company's most recent guidance, sending its shares up 4.1% in mid-day trading.

CEO Jensen Huang said in a statement that initial production yields had exceeded expectations and that demand from Microsoft, Meta, Amazon, and Google now extends through the end of 2027. "Every customer wants more, and we are producing as fast as we can," Huang said.

The Blackwell platform represents a generational leap in AI compute, with NVIDIA claiming up to 30x performance improvements for inference workloads compared to the H100 generation. The chips are particularly suited for the new wave of reasoning-focused AI models that require sustained compute during inference.

Wall Street analysts responded positively. Morgan Stanley raised its price target to $1,400, citing "compounding evidence of structural undersupply" in AI accelerators. Goldman Sachs reiterated a Buy rating and characterized NVIDIA's competitive moat as "the most durable we've seen in semiconductors in 25 years."

Competitors AMD and Intel are racing to ship competitive products, but analysts note that NVIDIA's CUDA software ecosystem remains a significant barrier to switching. Custom silicon efforts from hyperscalers — including Google's TPU and Amazon's Trainium — are gaining traction for specific workloads but have not displaced NVIDIA in general-purpose AI training.

The launch also has implications for the broader semiconductor supply chain. TSMC, which manufactures NVIDIA's chips, recently announced expanded capacity at its Arizona and Japan fabs. Memory suppliers SK Hynix and Micron have similarly raised production guidance.`,
    explained: [
      {
        meaning:
          "NVIDIA, the company that makes the special chips needed to run modern AI, is delivering its newest chips faster than people expected. Demand is so high that companies are placing orders for years out.",
        context:
          "When apps like ChatGPT or Claude run, they use these special chips behind the scenes. NVIDIA basically owns this market right now. The new chips are way faster than the previous generation.",
        impact:
          "NVIDIA's stock is going up, which affects the broader tech market. Companies like Microsoft, Google, and Amazon will be able to build better AI products. The companies that make memory and packaging for these chips also benefit.",
      },
      {
        meaning:
          "NVIDIA's Blackwell architecture began shipping ahead of guidance with stronger-than-expected production yields. Inference performance is up to 30x faster than H100, well-aligned with the rise of reasoning models.",
        context:
          "AI compute remains structurally supply-constrained. NVIDIA's CUDA ecosystem continues to lock in customers. Hyperscaler custom silicon (TPU, Trainium) is gaining ground for narrow workloads but not in general training.",
        impact:
          "Bullish read-through for the entire AI infrastructure stack — TSMC, SK Hynix, Micron, and AI-adjacent equities. Watch for guidance raises across the supply chain. Cloud providers may continue prioritizing AI capex over general infrastructure.",
      },
      {
        meaning:
          "Blackwell ramp accelerated by ~3 weeks vs. prior guidance; initial yields exceed model. MSFT/META/AMZN/GOOGL bookings extend through CY27. Inference-per-watt improvements particularly relevant for test-time-compute reasoning model workloads.",
        context:
          "Confirms thesis of structural undersupply in AI accelerators. CUDA moat reaffirmed; hyperscaler ASIC adoption tracks niche workloads. Capex guidance from the Magnificent 7 increasingly underwrites the inference-compute cycle.",
        impact:
          "NVDA consensus EPS likely conservative. Memory (HBM3e) tightness extends. Watch TSMC CoWoS advanced packaging capacity as gating factor. Power/cooling-adjacent plays (Vertiv, Eaton) continue receiving capital flows.",
      },
      {
        meaning:
          "Blackwell production ramp inflection demonstrating yield maturity 3-week early; hyperscaler bookings extend through CY27 with revenue visibility unprecedented in semiconductor cycles. Inference-throughput multiples align with TTC paradigm.",
        context:
          "Reaffirms the inference-scaling capex thesis. CUDA lock-in remains the dominant accelerator moat. Hyperscaler ASIC penetration stable in non-frontier workloads. TSMC CoWoS remains the binding constraint on the entire AI compute stack.",
        impact:
          "NVDA NTM revenue revision pathways; consensus likely under-modeling networking attach rates. HBM/CoWoS bottleneck implications across SK Hynix, Micron, ASE, Amkor. Power-adjacent infrastructure thesis continues compounding.",
      },
    ],
    relatedTopics: [
      "NVIDIA",
      "AI Infrastructure",
      "Semiconductors",
      "TSMC",
      "Hyperscalers",
    ],
    relatedArticleIds: ["openai-reasoning"],
  },
  {
    id: "china-solar-record",
    title: "China deploys record-breaking solar capacity in single quarter, reshaping global energy",
    category: "Climate",
    categoryColor: CATEGORY_COLORS.Climate,
    source: "Financial Times",
    timeAgo: "10h ago",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=85",
    aiSummary:
      "China installed more solar capacity in the past three months than the entire United States has built across its history, accelerating the global energy transition.",
    body: `China added 78 gigawatts of new solar capacity in the most recent quarter, according to data released by the National Energy Administration, exceeding the cumulative total of all solar power ever built in the United States.

The pace, which would have been considered fantastical even five years ago, reflects a confluence of factors: collapsing module prices, aggressive provincial deployment quotas, and a manufacturing base that now supplies more than 80% of the world's solar panels.

Industry analysts say Chinese solar deployment is now on track to deliver more than 300 gigawatts of new capacity for the full year, an amount equivalent to the entire installed power generation capacity of Japan.

The implications extend beyond China's borders. The country's massive overcapacity has driven panel prices down by roughly 40% year-over-year, accelerating adoption across emerging markets that previously found solar uneconomical. Africa, South Asia, and Latin America are now seeing record deployment levels.

Western governments have reacted with a mix of admiration and concern. The U.S. and EU have both imposed tariffs on Chinese panels, citing both trade equity and national security. China's foreign ministry has responded that climate progress should not be politicized.

For incumbent fossil fuel producers, the trajectory is increasingly concerning. The International Energy Agency now projects peak global oil demand within this decade, a forecast that would have been controversial just a few years ago.

Bottlenecks are emerging elsewhere — particularly in grid capacity, battery storage, and skilled installation labor — but the trajectory of solar deployment itself appears nearly unstoppable.`,
    explained: [
      {
        meaning:
          "China built so many solar panels in three months that it's more than the U.S. has built in its entire history. They're now putting up more clean energy than anywhere else on Earth.",
        context:
          "Solar panels have gotten really cheap, and China makes most of them. They're using a lot themselves, and selling cheap ones to other countries too. This is making the switch to clean energy happen faster than expected.",
        impact:
          "Cheaper electricity in many places, faster shift away from coal and oil, but also trade tensions between China, the U.S., and Europe. Long-term, this could mean a significantly different energy landscape than anyone predicted.",
      },
      {
        meaning:
          "China deployed 78 GW of solar in a single quarter, exceeding the U.S. cumulative installed base. Annual run-rate now exceeds 300 GW, equivalent to Japan's entire installed power capacity.",
        context:
          "Driven by 40% YoY price decline in modules, provincial deployment quotas, and 80%+ Chinese share of global manufacturing. U.S. and EU have responded with tariffs citing trade equity and security.",
        impact:
          "Accelerates global energy transition timelines. Peak oil demand projections moving earlier. Grid infrastructure, storage, and installation labor become the new bottlenecks. Geopolitical tensions around clean tech supply chains intensify.",
      },
      {
        meaning:
          "China Q3 solar installations reached 78 GW, with FY trajectory exceeding 300 GW. Module ASP down ~40% YoY driven by manufacturing overcapacity and supply-chain integration. Tariff regimes from U.S. (Section 201/301) and EU (CBAM-adjacent) shape global flow dynamics.",
        context:
          "Compresses LCOE solar curve below thermal generation in nearly all geographies. Peak oil demand forecasts (IEA, BP, OPEC diverge) re-baseline earlier. Grid-balancing infrastructure (BESS, transmission, demand response) becomes the binding constraint.",
        impact:
          "Repricing across energy complex: short-cycle thermal demand under pressure, BESS supply chain (cathode, separator, anode) sees demand acceleration, grid-CapEx beneficiaries (Quanta, MasTec, Eaton) compound. Fossil fuel terminal-value debate intensifies.",
      },
      {
        meaning:
          "PRC Q3 PV deployments at 78 GW, sustaining the structural manufacturing-overcapacity-driven module ASP deflation. FY run-rate >300 GW. Tariff-induced flow redistribution creates regional demand asymmetries with implications for the global module-pricing curve.",
        context:
          "Reinforces the bear-case on terminal-value for unhedged hydrocarbon producers. Grid-balancing and dispatchable-capacity become the new rate-limiting infrastructure layer, with implications for natural gas peakers, LDES technologies, and ancillary services market design.",
        impact:
          "Cross-asset: short-thesis on long-duration thermal generation, long structural BESS supply chain (NMC vs LFP dynamics), grid-CapEx names. Geopolitical: clean-tech supply chain decoupling becomes central trade-policy axis through 2027.",
      },
    ],
    relatedTopics: [
      "Solar Energy",
      "China Energy",
      "Climate Transition",
      "Trade Policy",
    ],
    relatedArticleIds: ["eu-carbon-law"],
  },
  {
    id: "bitcoin-record",
    title: "Bitcoin breaks $100,000 as institutional demand outpaces new supply",
    category: "Markets",
    categoryColor: CATEGORY_COLORS.Markets,
    source: "CoinDesk",
    timeAgo: "1d ago",
    image:
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&q=85",
    aiSummary:
      "Bitcoin crossed $100,000 for the first time as ETF inflows and corporate treasury adoption pushed demand beyond what miners produce daily.",
    body: `Bitcoin surged past $100,000 per coin for the first time in its 16-year history, capping a rally driven by record inflows into spot Bitcoin ETFs and a wave of corporate treasury adoption.

The milestone was greeted with celebration across the cryptocurrency industry, with proponents calling it validation of Bitcoin's evolving role as a global store of value. Skeptics noted that the rally has been driven largely by financial-product flows rather than transactional adoption.

ETF inflows in the past quarter alone have exceeded the total amount of new Bitcoin mined during the same period — roughly $18 billion versus $11 billion at current prices. This persistent demand-supply imbalance has been a central driver of the rally.

Corporate adoption has also accelerated. MicroStrategy continues to add to its multi-billion-dollar Bitcoin treasury, and a growing number of public companies — including names in technology, healthcare, and real estate — have begun holding Bitcoin on their balance sheets.

Regulatory clarity has improved in several major markets. The U.S. SEC has approved options trading on Bitcoin ETFs, while the European Union's MiCA framework provides a comprehensive crypto regulatory regime for the bloc.

Volatility remains, however. Analysts caution that intraday swings of 5-10% are still common, and the asset's correlation with risk-on equity markets has tightened during the institutional adoption phase, reducing some of its historical diversification benefits.

For retail investors, financial advisors increasingly recommend treating Bitcoin as a small portfolio allocation — typically 1% to 5% — rather than a speculative bet.`,
    explained: [
      {
        meaning:
          "Bitcoin's price went past $100,000 for the first time ever. The main reason: big investment funds and even some companies are buying it as part of their portfolios, which is creating more demand than there's supply.",
        context:
          "Bitcoin started as an experiment around 2009 and was worth less than a dollar. It's gone through many cycles of big rises and big falls. This time, it's mostly traditional finance — like ETFs and corporate treasuries — driving the price.",
        impact:
          "If you own Bitcoin, congrats. For most people, advisors suggest keeping it to a small slice of total investments. The bigger story is that Bitcoin is becoming a more 'normal' part of the financial system — for better or worse.",
      },
      {
        meaning:
          "Bitcoin crossed $100K driven by ETF inflows ($18B in the past quarter) exceeding mined supply (~$11B). Corporate treasury adoption broadening beyond MicroStrategy to traditional sector names.",
        context:
          "Marks the maturation of Bitcoin as a portfolio-allocation asset rather than purely speculative bet. Regulatory clarity (spot ETFs, options on ETFs, MiCA in EU) has been a major enabler. Correlation with equity beta has risen.",
        impact:
          "Reinforces 1–5% portfolio allocation guidance from mainstream advisors. Watch flows into BTC-adjacent equities (miners, exchanges, custodians). Volatility regime structurally lower but still elevated vs. traditional assets.",
      },
      {
        meaning:
          "BTC crossed the $100K threshold with the supply-demand imbalance entrenched: spot-BTC ETF inflows at ~1.6x daily issuance over the trailing quarter. Corporate treasury adoption broadens; MicroStrategy NAV proxy thesis continues.",
        context:
          "Structural shift toward institutional rails: SEC options approval, MiCA implementation, growing prime brokerage support. Beta to risk-on assets elevated; volatility regime moderating but absolute moves remain outsized vs. traditional macro assets.",
        impact:
          "Watch listed BTC miners (MARA, RIOT, CLSK) for cost-curve positioning; exchange-equity (COIN) for trading-volume exposure; treasury-proxy (MSTR) for asymmetric NAV beta. Regulatory tail risks remain in non-US jurisdictions.",
      },
      {
        meaning:
          "BTC/USD breaks $100K with ETF-mediated supply absorption dominating price discovery: ~$18B quarterly net inflows vs. ~$11B issuance run-rate. Treasury-adoption diffusion broadens across sectors with implications for corporate FX/capital allocation frameworks.",
        context:
          "Institutional rails (spot ETF, options, prime brokerage, MiCA) shift the marginal-flow dynamics from retail-momentum to allocator-rebalance. Beta-to-risk asymmetry remains elevated; vol-regime compression incomplete. Sovereign and central-bank adoption thesis remains long-dated optionality.",
        impact:
          "Cross-asset repricing through the digital-asset complex: structural support for COIN, MSTR, miner equity, BTC-collateralized credit instruments. Watch SEC ETH-staking-ETF decision as next institutional-rail catalyst. Sovereign-allocation thesis dependent on geopolitical regime evolution.",
      },
    ],
    relatedTopics: ["Bitcoin", "ETFs", "Crypto", "Corporate Treasuries"],
    relatedArticleIds: ["fed-rate-pause"],
  },
  {
    id: "ev-tariffs-eu",
    title: "EU finalizes tariffs on Chinese electric vehicles, sparking trade response",
    category: "World",
    categoryColor: CATEGORY_COLORS.World,
    source: "Politico EU",
    timeAgo: "1d ago",
    image:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=85",
    aiSummary:
      "The EU has confirmed tariffs of up to 45% on Chinese-made electric vehicles, drawing sharp criticism from Beijing and worrying European automakers with China exposure.",
    body: `The European Union has finalized its decision to impose tariffs ranging from 17% to 45% on electric vehicles imported from China, concluding a year-long anti-subsidy investigation that has dominated EU-China trade relations.

The tariffs, which take effect in 30 days, vary based on the level of cooperation each manufacturer provided to EU investigators. BYD faces a 17% duty, Geely 19%, and SAIC the highest at 45%. Tesla, despite manufacturing in Shanghai, secured a lower 9% rate based on a separately negotiated agreement.

Beijing has condemned the tariffs as "protectionist" and signaled retaliatory measures targeting European exports, particularly luxury vehicles, dairy products, and brandy. China's commerce ministry has launched parallel investigations into European pork and dairy industries.

European carmakers are themselves divided on the decision. German manufacturers — including Volkswagen, BMW, and Mercedes-Benz — opposed the tariffs given their substantial exposure to the Chinese market. French automakers, by contrast, broadly supported the move.

For consumers, the immediate effect is likely to be higher prices on Chinese-brand EVs in Europe. However, several Chinese manufacturers have already announced plans to localize production in Hungary, Spain, and elsewhere to mitigate the tariff impact.

The EU's stated goal is to give European EV manufacturers more time to scale up production without being undercut by what it characterizes as state-subsidized Chinese competition. Critics argue the tariffs will slow Europe's EV transition and increase consumer costs.

Trade specialists note that this dispute reflects a broader trend of clean-tech protectionism, with the U.S., Canada, and now the EU all imposing barriers on Chinese clean energy and EV exports.`,
    explained: [
      {
        meaning:
          "Europe is now charging extra fees on Chinese electric cars to make them more expensive. They're worried that Chinese government support makes those cars artificially cheap. China is not happy and is threatening to do the same to European products.",
        context:
          "Electric cars are becoming a huge industry. China is making them really cheap and selling lots in Europe. European carmakers were worried, so the EU investigated and decided to add the extra fees.",
        impact:
          "Chinese EVs will cost more in Europe — bad for buyers wanting affordable EVs. Some German carmakers might be hurt by Chinese retaliation. Long-term, this might slow Europe's switch to electric cars.",
      },
      {
        meaning:
          "EU finalized tariffs of 17–45% on Chinese EVs after a year-long anti-subsidy investigation. Beijing has signaled retaliation targeting European luxury vehicles, dairy, and brandy. Chinese manufacturers are localizing European production to circumvent.",
        context:
          "Reflects broader clean-tech protectionism trend, with the U.S., Canada, and EU all imposing measures. German automakers oppose given China exposure; French automakers support. Tesla, manufacturing in Shanghai, negotiated a 9% rate.",
        impact:
          "Slower European EV adoption near-term. Chinese EV makers accelerating European manufacturing footprint. Watch reciprocal measures impact on LVMH, Hermès, BMW, Mercedes. Trade-policy uncertainty becomes structural feature of clean-tech transition.",
      },
      {
        meaning:
          "Definitive duties of 17–45% on Chinese-origin BEVs concluded the Trade Defense Instrument inquiry. Manufacturer-specific differentiation reflects cooperation tiering. Tesla Shanghai 9% reflects bilateral negotiated outcome. Local content investment commitments mitigate tariff burden.",
        context:
          "Confirms convergence among Western blocs on clean-tech industrial policy. German OEM China-exposure (~30%+ revenue for Mercedes, BMW) underpins political opposition. French alignment reflects domestic EV-platform competitive positioning. Chinese FDI redirection accelerating.",
        impact:
          "OEM equity: LVMH, Hermes, Pernod Ricard near-term retaliation risk; BMW/MBG China revenue under pressure; European EV battery-cell competitiveness improves. Long-dated: Chinese localized production diffuses into European supply chains regardless of tariff regime.",
      },
      {
        meaning:
          "Definitive countervailing-duty determination on PRC-origin BEVs at 17–45% concluding TDI investigation. Manufacturer differentiation maps cooperation. Tesla Shanghai bilateral outcome at 9%. CN OEM EU localization (Szeged, Catalonia) advanced as long-cycle mitigation.",
        context:
          "Crystallizes the clean-tech industrial-policy convergence across G7. German OEM China-revenue exposure (~30%+) anchors political opposition. French alignment reflects Stellantis platform-positioning. Chinese FDI redirection to CEE/Iberia restructures European auto-cluster geography.",
        impact:
          "Cross-asset: short-thesis on China-exposed luxury (LVMH, Hermes, Pernod); near-term pressure on premium German OEM China revenue; structural support for European battery-cell, charging-infrastructure equities. Trade-policy regime uncertainty becomes embedded clean-tech valuation variable through 2027.",
      },
    ],
    relatedTopics: [
      "EV Industry",
      "Trade Policy",
      "China-EU Relations",
      "Clean Tech",
    ],
    relatedArticleIds: ["china-solar-record", "eu-carbon-law"],
  },
  {
    id: "tesla-robotaxi",
    title: "Tesla launches autonomous robotaxi service across three US cities",
    category: "AI & Technology",
    categoryColor: CATEGORY_COLORS["AI & Technology"],
    source: "TechCrunch",
    timeAgo: "12h ago",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=85",
    aiSummary:
      "Tesla has launched its long-promised autonomous robotaxi service in Austin, Phoenix, and Las Vegas, marking the most ambitious vision-only self-driving deployment to date.",
    body: `Tesla today opened its long-anticipated autonomous robotaxi service to public riders in Austin, Phoenix, and Las Vegas, marking the broadest deployment of its vision-only self-driving system to date and intensifying competition with Waymo and other established players.

The service, available through the Tesla app and the newly relaunched Tesla Network platform, operates 24 hours a day with no human safety drivers in the vehicles. Initial fleet sizes are modest — approximately 200 vehicles per city — but Tesla executives say capacity will scale rapidly contingent on regulatory cooperation.

The vehicles operate using only cameras and the company's end-to-end neural network approach, in contrast to Waymo's sensor-fusion architecture combining cameras, lidar, and radar. CEO Elon Musk has long maintained that lidar is unnecessary, a position that has divided the industry.

Initial rides have generated significant social media attention. Most reports describe the experience as smooth, with the vehicles handling complex urban scenarios — including merging, four-way stops, and pedestrian-dense areas — capably. However, several edge cases involving construction zones and unusual road markings have also been documented.

Pricing is aggressive: Tesla is offering rides at roughly half the cost of comparable Uber or Lyft trips, a model the company says is sustainable given the absence of driver costs. Skeptics question whether the unit economics work without scale.

Regulatory environments in the three launch cities are notably permissive. Tesla has signaled plans to expand to additional cities — likely Miami, Dallas, and Atlanta — pending state-level approvals. California, despite being Tesla's home, remains a more cautious regulatory environment.

Wall Street has reacted positively, with Tesla shares up 7% in pre-market trading. Analysts caution, however, that Waymo retains a significant lead in cumulative autonomous miles driven and that safety-incident data over the coming year will be decisive.`,
    explained: [
      {
        meaning:
          "Tesla now has actual self-driving cars that anyone can hail like an Uber in three U.S. cities. No driver is in the car at all. It's about half the price of regular Uber rides.",
        context:
          "Tesla has been promising this for years and finally launched it. There's another company, Waymo, that already has self-driving cars in some cities but uses different technology. The race for who wins self-driving is heating up.",
        impact:
          "Could change how people get around — cheaper rides, no waiting for a driver. But there are still safety questions, and if these cars cause accidents, it could set the whole industry back.",
      },
      {
        meaning:
          "Tesla launched commercial robotaxi operations in Austin, Phoenix, and Las Vegas using its vision-only architecture. Pricing is roughly 50% of Uber/Lyft. Initial fleet is ~200 vehicles per city with planned scale-up.",
        context:
          "First broad deployment of vision-only autonomy at scale, contrasting with Waymo's sensor-fusion approach. Regulatory environments in chosen cities are permissive. California remains a more cautious jurisdiction.",
        impact:
          "TSLA stock reacted positively. Decisive metrics over the next 12 months will be safety incidents per million miles and unit economics at scale. Watch for ripple effects on rideshare valuations and traditional auto OEM autonomous strategies.",
      },
      {
        meaning:
          "TSLA commercial robotaxi deployment across AUS/PHX/LAS using FSD v13 end-to-end neural net architecture. Vision-only sensor stack. Initial fleet ~600 vehicles aggregate. Pricing strategy targets ride-hail substitution at ~50% discount.",
        context:
          "Vision-only vs. sensor-fusion debate enters commercial-validation phase. Waymo retains substantial cumulative-mile lead. State-level regulatory permissiveness becomes the binding capacity constraint. California regulatory environment remains restrictive.",
        impact:
          "TSLA valuation: robotaxi optionality moves from theoretical to baseline. Safety-incident-per-mile data over NTM decisive for thesis. Rideshare equities (UBER, LYFT) face revaluation risk. Traditional auto autonomous-vehicle strategy reassessment likely.",
      },
      {
        meaning:
          "TSLA commercial L4 deployment in AUS/PHX/LAS using end-to-end FSD v13 vision-only stack. Operating cadence 24/7 driverless. Pricing 50% discount to legacy ride-hail establishes substitution thesis. Initial fleet ~600 vehicles with stated scale plan to ~5,000 within 12 months.",
        context:
          "Vision-only architectural thesis enters commercial validation regime. Waymo Phase-5 sensor-fusion incumbent retains cumulative-mile leadership. State-level regulatory differentiation (TX/AZ/NV permissive, CA restrictive) becomes operational geography determinant. NHTSA oversight regime in evolutionary phase.",
        impact:
          "Cross-asset: TSLA robotaxi-NPV optionality revaluation; UBER/LYFT terminal-value compression scenarios; OEM autonomous strategy reassessment. Safety-incident-rate over NTM determines vision-only thesis validation. Insurance/liability regime evolution becomes parallel-track variable.",
      },
    ],
    relatedTopics: ["Tesla", "Autonomous Vehicles", "Waymo", "Robotaxi"],
    relatedArticleIds: ["openai-reasoning"],
  },
];

const ARTICLE_MAP = new Map(articles.map((a) => [a.id, a]));

export function getAllArticles(): Article[] {
  return articles;
}

export function getArticleById(id: string): Article | undefined {
  return ARTICLE_MAP.get(id);
}

export function getArticlesByIds(ids: string[]): Article[] {
  return ids.map((id) => ARTICLE_MAP.get(id)).filter(Boolean) as Article[];
}

export function getRelatedArticles(article: Article): Article[] {
  return getArticlesByIds(article.relatedArticleIds);
}

export function getFeedArticles(limit = 4): Article[] {
  // Skip the first one since it's the featured carousel
  return articles.slice(0, limit);
}

export function getFeaturedArticles(limit = 5): Article[] {
  return articles.slice(0, limit);
}

export function getDiscoverArticles(): Article[] {
  return articles;
}

export function getArticleReadTime(article: Article): number {
  return estimateReadTime(article.body);
}

export { articles };
