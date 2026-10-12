import { SourceRecord } from "@/types";
import { RawSearchResult } from "./provider";

export function deduplicateAndScoreSources(
  rawResults: RawSearchResult[],
  nicheKeywords: string[]
): SourceRecord[] {
  const seenUrls = new Set<string>();
  const sources: SourceRecord[] = [];

  const lowerKeywords = nicheKeywords.map((k) => k.toLowerCase().trim()).filter(Boolean);

  for (const item of rawResults) {
    if (!item.url || seenUrls.has(item.url)) continue;
    seenUrls.add(item.url);

    let domain = "";
    try {
      const u = new URL(item.url);
      domain = u.hostname.replace(/^www\./, "");
    } catch {
      continue;
    }

    // Determine source type
    let sourceType: SourceRecord["sourceType"] = "web_source";
    if (domain.includes("fiverr.com")) {
      sourceType = "fiverr_listing";
    } else if (domain.includes("reddit.com") || domain.includes("quora.com") || domain.includes("forum")) {
      sourceType = "buyer_discussion";
    } else if (domain.includes("upwork.com") || domain.includes("freelancer.com")) {
      sourceType = "competitor_service";
    }

    // Compute basic relevance score based on keyword match
    const textBlob = `${item.title} ${item.snippet}`.toLowerCase();
    let matches = 0;
    for (const kw of lowerKeywords) {
      if (textBlob.includes(kw)) matches++;
    }

    const relevanceScore = Math.min(
      1,
      0.35 + (matches > 0 ? (matches / Math.max(1, lowerKeywords.length)) * 0.65 : 0)
    );

    sources.push({
      id: `src-${sources.length + 1}-${Math.random().toString(36).slice(2, 7)}`,
      title: item.title || "Market Research Reference",
      url: item.url,
      domain,
      snippet: item.snippet || "Public search record extracted during niche intelligence gathering.",
      sourceType,
      retrievalTimestamp: new Date().toISOString(),
      isFullPageRetrieved: false,
      relevanceScore: Number(relevanceScore.toFixed(2)),
      reliabilityConfidence: domain.includes("fiverr.com") ? "high" : "medium",
    });
  }

  // Sort by relevance score descending
  return sources.sort((a, b) => b.relevanceScore - a.relevanceScore);
}
