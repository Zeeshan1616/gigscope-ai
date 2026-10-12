/**
 * Core type definitions for GigScope AI
 */

export type ContentType = "title" | "description" | "faqs";

export type EvidenceLevel =
  | "directly_observed"     // Directly observed in a retrieved public source
  | "repeated_pattern"      // Observed across multiple relevant sources (with sample size)
  | "reasoned_inference"    // Concluded reasonably based on available market evidence
  | "hypothesis";           // Suggested opportunity that requires seller validation

export interface SourceRecord {
  id: string;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  sourceType: "fiverr_listing" | "competitor_service" | "buyer_discussion" | "platform_guide" | "web_source";
  retrievalTimestamp: string;
  isFullPageRetrieved: boolean;
  relevanceScore: number; // 0 to 1
  observedExcerpt?: string;
  reliabilityConfidence: "high" | "medium" | "low";
}

export interface ResearchCoverage {
  providerUsed: string;
  sourcesFound: number;
  sourcesInspected: number;
  fullPagesRetrieved: number;
  snippetsEvaluated: number;
  competitorListingsCount: number;
  timestamp: string;
  searchQueriesExecuted: string[];
  coverageCompleteness: "comprehensive" | "moderate" | "partial" | "insufficient";
  coverageGaps: string[];
  limitationsDisclosed: string[];
}

export interface ServiceClassification {
  category: string;
  niche: string;
  subNiche: string;
  coreService: string;
  primaryDeliverable: string;
  targetBuyer: string;
  buyerIntent: string;
  buyerProblem: string;
  confidence: "high" | "medium" | "low";
  classificationNotes: string;
  requiresClarification: boolean;
  clarificationQuestion?: string;
}

export interface ExtractedSellerOffer {
  explicitDeliverables: string[];
  statedToolsOrTech: string[];
  statedProcess: string[];
  limitationsOrExclusions: string[];
  targetAudience: string[];
  unsupportedClaimsDetected: string[];
}

export interface CompetitorPattern {
  pattern: string;
  frequency: "frequent" | "common" | "occasional";
  evidenceType: EvidenceLevel;
  sourceReferences: string[]; // Source IDs or URLs
  description: string;
  relevanceToSeller: "directly_applicable" | "optional_if_offered" | "out_of_scope";
}

export interface KeywordRecommendation {
  phrase: string;
  category:
    | "primary_service"
    | "secondary_service"
    | "long_tail"
    | "buyer_intent"
    | "deliverable_specific"
    | "audience_specific";
  evidenceLevel: EvidenceLevel;
  sourceReferences: string[];
  recommendedPlacement: "title_lead" | "description_hook" | "description_bullets" | "faq_question" | "natural_body";
  reasoning: string;
  isQuantitativeVolumeAvailable: boolean; // Must be false unless a verified keyword API provides real volume
  volumeMetricDisclosed?: string;
}

export interface BuyerConcern {
  id: string;
  concern: string;
  whyItMatters: string;
  evidenceLevel: EvidenceLevel;
  sourceReferences: string[];
  recommendedHandlingLocation: "title" | "description" | "faqs";
  suggestedClarification: string;
  requiresSellerConfirmation: boolean;
}

export interface MarketGap {
  opportunity: string;
  evidenceType: EvidenceLevel;
  explanation: string;
  sourceReferences: string[];
}

export interface ScoreCriterion {
  name: string;
  score: number; // 0 to 100
  weight: number; // 0 to 1
  label: string;
  evaluation: string;
  strength: string;
  weakness: string;
}

export interface ContentQualityScore {
  overallScore: number; // 0 to 100
  ratingLabel: "Exceptional" | "Strong" | "Good" | "Needs Improvement" | "Underdeveloped";
  rubricSummary: string;
  criteria: ScoreCriterion[];
  transparencyDisclaimer: string; // Explains this is an AI heuristic, not a Fiverr ranking guarantee
}

export interface TitleAlternative {
  title: string;
  style: "Direct & Clear" | "Deliverable-Focused" | "Benefit-Oriented";
  characterCount: number;
  explanation: string;
}

export interface DescriptionAlternative {
  version: "Concise & Direct" | "Detailed & Explanatory";
  content: string;
  wordCount: number;
  characterCount: number;
  explanation: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  whyUseful: string;
  evidenceLevel: EvidenceLevel;
  category: "scope" | "deliverables" | "buyer_prerequisites" | "process" | "communication";
  requiresSellerConfirmation: boolean;
  sourceReferences: string[];
}

export interface BeforeAfterChange {
  section: string;
  originalTextSnippet: string;
  optimizedTextSnippet: string;
  reasonForChange: string;
  evidenceBacking: string;
  isAssumptionRequiringConfirmation: boolean;
}

export interface ValidationItem {
  id: string;
  category: "platform_compliance" | "seller_truth" | "clarity" | "originality" | "buyer_readiness";
  ruleName: string;
  passed: boolean;
  severity: "critical" | "warning" | "passed";
  message: string;
  details?: string;
}

export interface OptimizationResult {
  id: string;
  timestamp: string;
  contentType: ContentType;
  originalDraft: string;
  optionalContext?: string;

  // Analysis & Classification
  classification: ServiceClassification;
  sellerOffer: ExtractedSellerOffer;

  // Research
  researchCoverage: ResearchCoverage;
  sources: SourceRecord[];
  competitorPatterns: CompetitorPattern[];
  keywords: KeywordRecommendation[];
  buyerConcerns: BuyerConcern[];
  marketGaps: MarketGap[];

  // Optimized Content
  recommendedContent: string;
  titleAlternatives?: TitleAlternative[];
  descriptionAlternatives?: DescriptionAlternative[];
  faqItems?: FAQItem[];

  // Explanations & Scoring
  whyItIsBetter: string;
  beforeAfterChanges: BeforeAfterChange[];
  qualityScore: ContentQualityScore;

  // Validation
  validationChecks: ValidationItem[];
  itemsRequiringConfirmation: string[];
}

export interface AnalyzeRequestPayload {
  contentType: ContentType;
  draft: string;
  optionalContext?: string;
}
