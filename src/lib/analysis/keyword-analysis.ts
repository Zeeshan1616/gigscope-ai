import { KeywordRecommendation, ServiceClassification, SourceRecord } from "@/types";

export function analyzeKeywords(
  sources: SourceRecord[],
  classification: ServiceClassification,
  draft: string
): KeywordRecommendation[] {
  const recommendations: KeywordRecommendation[] = [];
  const textCorpus = `${draft} ${sources.map((s) => `${s.title} ${s.snippet}`).join(" ")}`.toLowerCase();

  const primaryService = classification.coreService || classification.niche;
  const primarySources = sources.filter((s) => `${s.title} ${s.snippet}`.toLowerCase().includes(primaryService.toLowerCase())).map((s) => s.url);

  // 1. Primary Service Keyword
  recommendations.push({
    phrase: primaryService,
    category: "primary_service",
    evidenceLevel: primarySources.length > 0 ? "directly_observed" : "reasoned_inference",
    sourceReferences: primarySources.slice(0, 3),
    recommendedPlacement: "title_lead",
    reasoning: "The foundational service term defining what buyers search for when seeking this deliverable.",
    isQuantitativeVolumeAvailable: false,
    volumeMetricDisclosed: "Qualitative market relevance. Quantitative search volume requires an enterprise keyword API subscription.",
  });

  // 2. Secondary Service Keywords
  if (classification.subNiche && classification.subNiche !== primaryService) {
    recommendations.push({
      phrase: classification.subNiche,
      category: "secondary_service",
      evidenceLevel: "reasoned_inference",
      sourceReferences: sources.slice(0, 2).map((s) => s.url),
      recommendedPlacement: "description_hook",
      reasoning: "Narrows the service to a specialized sub-category to differentiate from generic competitors.",
      isQuantitativeVolumeAvailable: false,
    });
  }

  // 3. Deliverable-Specific Keywords
  const deliverableCandidates = [
    "responsive design", "clean code", "source files", "vector format",
    "speed optimization", "mobile friendly", "commercial use", "seo optimized",
    "modern ui", "fast turnaround"
  ];

  for (const candidate of deliverableCandidates) {
    if (textCorpus.includes(candidate)) {
      const matchingSources = sources.filter((s) => `${s.title} ${s.snippet}`.toLowerCase().includes(candidate)).map((s) => s.url);
      recommendations.push({
        phrase: candidate,
        category: "deliverable_specific",
        evidenceLevel: matchingSources.length > 1 ? "repeated_pattern" : "directly_observed",
        sourceReferences: matchingSources.slice(0, 2),
        recommendedPlacement: "description_bullets",
        reasoning: "A tangible outcome buyers actively scan for to verify whether their technical requirements will be met.",
        isQuantitativeVolumeAvailable: false,
      });
      if (recommendations.length >= 4) break;
    }
  }

  // 4. Buyer-Intent & Long-Tail Phrases
  const intentPhrases = [
    `custom ${classification.niche.toLowerCase()}`,
    `professional ${classification.coreService.toLowerCase()}`,
    `${classification.niche.toLowerCase()} expert`,
  ];

  for (const phrase of intentPhrases) {
    recommendations.push({
      phrase,
      category: "buyer_intent",
      evidenceLevel: "reasoned_inference",
      sourceReferences: [],
      recommendedPlacement: "natural_body",
      reasoning: "Natural search phrasing indicating high buyer readiness rather than exploratory browsing.",
      isQuantitativeVolumeAvailable: false,
    });
    if (recommendations.length >= 6) break;
  }

  return recommendations;
}
