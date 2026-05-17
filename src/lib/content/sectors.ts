export interface Sector {
  name: string;
  change: number;
  description?: string;
}

const sectors: Record<"us" | "india", Sector[]> = {
  us: [
    { name: "Technology", change: 1.8 },
    { name: "Financials", change: 0.4 },
    { name: "Healthcare", change: -0.3 },
    { name: "Energy", change: -1.1 },
    { name: "Consumer", change: 0.9 },
    { name: "Industrials", change: 0.6 },
    { name: "Real Estate", change: -0.5 },
    { name: "Materials", change: 0.2 },
  ],
  india: [
    { name: "IT", change: 1.1 },
    { name: "Banking", change: 1.4 },
    { name: "Auto", change: 0.5 },
    { name: "FMCG", change: -0.2 },
    { name: "Pharma", change: 0.3 },
    { name: "Energy", change: -0.8 },
    { name: "Metals", change: 1.7 },
    { name: "Realty", change: -0.6 },
  ],
};

export function getSectors(region: "us" | "india"): Sector[] {
  return sectors[region];
}
