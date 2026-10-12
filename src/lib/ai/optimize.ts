import {
  AnalyzeRequestPayload,
  OptimizationResult,
  SourceRecord,
} from "@/types";
import { validateInputPayload } from "../security/input-limits";
import { ValidationError } from "../utils/errors";
import { classifyDraftHeuristically } from "../analysis/classifier";
import { extractSellerOffer } from "../analysis/offer-extraction";
import { buildResearchPlan } from "../research/planner";
import { DuckDuckGoSearchProvider } from "../research/duckduckgo";
import { TavilySearchProvider } from "../research/tavily";
import { deduplicateAndScoreSources } from "../research/deduplication";
import { buildCoverageReport } from "../research/coverage";
import { analyzeCompetitorPatterns } from "../analysis/competitor-analysis";
import { analyzeKeywords } from "../analysis/keyword-analysis";
import { analyzeBuyerConcerns } from "../analysis/buyer-intent";
import { analyzeMarketGaps } from "../analysis/market-gaps";
import { runAIOptimization } from "./provider";
import { calculateQualityScore } from "../analysis/scoring";
import { validatePlatformRules } from "../validation/platform-rules";
import { checkOriginalityAgainstSources } from "../validation/originality";
import { validateSellerTruth } from "../validation/seller-truth";

/**
 * Master end-to-end optimization workflow
 */
export async function optimizeGigDraft(payload: AnalyzeRequestPayload): Promise<OptimizationResult> {
  const { contentType, draft, optionalContext } = payload;

  // 1. Strict input validation
  const validation = validateInputPayload(contentType, draft, optionalContext);
  if (!validation.isValid) {
    throw new ValidationError(validation.error || "Invalid request payload", { field: validation.field });
  }

  const cleanDraft = draft.trim();
  const cleanOptionalContext = optionalContext?.trim();

  // 2. Service and niche classification
  const classification = classifyDraftHeuristically(cleanDraft, contentType, cleanOptionalContext);

  // 3. Seller offer extraction
  const sellerOffer = extractSellerOffer(cleanDraft);

  // 4. Research query planning
  const researchPlan = buildResearchPlan(classification, contentType, cleanDraft);

  // 5. Live market research retrieval
  let searchProvider = new DuckDuckGoSearchProvider();
  if (process.env.RESEARCH_PROVIDER === "tavily" && process.env.TAVILY_API_KEY) {
    searchProvider = new TavilySearchProvider() as unknown as DuckDuckGoSearchProvider;
  }

  const rawResults: Array<{ title: string; url: string; snippet: string }> = [];
  const executedQueries: string[] = [];

  for (const query of researchPlan.searchQueries) {
    executedQueries.push(query);
    try {
      const results = await searchProvider.search(query, 5);
      rawResults.push(...results);
    } catch {
      // Continue to next query if one query times out
    }
  }

  // Deduplicate and score source relevance
  const targetKeywords = [classification.coreService, classification.niche, classification.subNiche, ...sellerOffer.statedToolsOrTech];
  const sources = deduplicateAndScoreSources(rawResults, targetKeywords);

  // Build research coverage disclosure
  const coverageReport = buildCoverageReport(searchProvider.name, sources, executedQueries);

  // 6. Market analysis modules
  const competitorPatterns = analyzeCompetitorPatterns(sources, classification);
  const keywords = analyzeKeywords(sources, classification, cleanDraft);
  const buyerConcerns = analyzeBuyerConcerns(sources, classification, sellerOffer.explicitDeliverables);
  const marketGaps = analyzeMarketGaps(sources, classification);

  // 7. Optimization generation (AI model or research-backed synthesis)
  const aiResult = await runAIOptimization(
    contentType,
    cleanDraft,
    classification,
    sellerOffer,
    sources,
    cleanOptionalContext
  );

  // 8. Quality scoring
  const qualityScore = calculateQualityScore(
    contentType,
    aiResult.recommendedContent,
    sellerOffer.explicitDeliverables.length,
    sellerOffer.unsupportedClaimsDetected.length
  );

  // 9. Platform compliance validation
  const platformRuleChecks = validatePlatformRules(contentType, aiResult.recommendedContent);

  // 10. Originality check against sources
  const originalityCheck = checkOriginalityAgainstSources(aiResult.recommendedContent, sources);

  // 11. Seller truth verification
  const truthCheck = validateSellerTruth(cleanDraft, aiResult.recommendedContent);

  // Consolidate validation checks & items requiring confirmation
  const allValidationChecks = [
    ...platformRuleChecks,
    ...originalityCheck.checks,
    ...truthCheck.checks,
  ];

  const allConfirmations = Array.from(
    new Set([...aiResult.itemsRequiringConfirmation, ...truthCheck.itemsRequiringConfirmation])
  );

  // 12. Return structured OptimizationResult
  return {
    id: `opt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    contentType,
    originalDraft: cleanDraft,
    optionalContext: cleanOptionalContext,

    classification,
    sellerOffer,

    researchCoverage: coverageReport,
    sources,
    competitorPatterns,
    keywords,
    buyerConcerns,
    marketGaps,

    recommendedContent: aiResult.recommendedContent,
    titleAlternatives: aiResult.titleAlternatives,
    descriptionAlternatives: aiResult.descriptionAlternatives,
    faqItems: aiResult.faqItems,

    whyItIsBetter: aiResult.whyStronger,
    beforeAfterChanges: aiResult.changes,
    qualityScore,

    validationChecks: allValidationChecks,
    itemsRequiringConfirmation: allConfirmations,
  };
}
