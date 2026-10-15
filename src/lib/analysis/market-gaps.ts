import { MarketGap, ServiceClassification, SourceRecord } from "@/types";

export function analyzeMarketGaps(
  sources: SourceRecord[],
  classification: ServiceClassification
): MarketGap[] {
  const gaps: MarketGap[] = [];

  gaps.push({
    opportunity: "Explicit Pre-Requisite Transparency",
    evidenceType: "hypothesis",
    explanation: `Many competitor listings in ${classification.niche} leave buyers guessing what assets they must provide. Clarifying prerequisites upfront distinguishes your offer as professional and organized.`,
    sourceReferences: sources.slice(0, 1).map((s) => s.url),
  });

  gaps.push({
    opportunity: "Scope Boundary Definition",
    evidenceType: "reasoned_inference",
    explanation: `Explicitly stating what is included versus what requires an extra custom quote prevents buyer friction and protects your delivery metrics in ${classification.subNiche || classification.niche}.`,
    sourceReferences: sources.slice(1, 2).map((s) => s.url),
  });

  return gaps;
}
