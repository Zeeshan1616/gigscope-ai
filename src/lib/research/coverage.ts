import { ResearchCoverage, SourceRecord } from "@/types";

export function buildCoverageReport(
  providerName: string,
  sources: SourceRecord[],
  queriesExecuted: string[],
  fullPagesCount = 0
): ResearchCoverage {
  const competitorCount = sources.filter((s) => s.sourceType === "fiverr_listing" || s.sourceType === "competitor_service").length;
  const sourcesCount = sources.length;

  let completeness: ResearchCoverage["coverageCompleteness"] = "insufficient";
  if (sourcesCount >= 5 && competitorCount >= 2) {
    completeness = "comprehensive";
  } else if (sourcesCount >= 3) {
    completeness = "moderate";
  } else if (sourcesCount > 0) {
    completeness = "partial";
  }

  const limitations: string[] = [
    "Observed listings represent publicly accessible web data at the time of retrieval and do not reflect private Fiverr metrics.",
    "No claim is made that competitor frequency correlates with sales volume or algorithmic rank.",
    "Quantitative keyword volumes are disclosed as unavailable unless supported by a verified search metric API.",
  ];

  const gaps: string[] = [];
  if (competitorCount === 0) {
    gaps.push("No direct public Fiverr listings were indexed in the immediate query sample; relied on broader web service market data.");
  }
  if (fullPagesCount === 0) {
    gaps.push("Analysis operated on verified search snippets and indexed meta extracts; full-page deep retrieval was not triggered for all candidates.");
  }

  return {
    providerUsed: providerName,
    sourcesFound: sourcesCount,
    sourcesInspected: sourcesCount,
    fullPagesRetrieved: fullPagesCount,
    snippetsEvaluated: sourcesCount,
    competitorListingsCount: competitorCount,
    timestamp: new Date().toISOString(),
    searchQueriesExecuted: queriesExecuted,
    coverageCompleteness: completeness,
    coverageGaps: gaps,
    limitationsDisclosed: limitations,
  };
}
