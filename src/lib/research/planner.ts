import { ContentType, ServiceClassification } from "@/types";

export interface ResearchPlan {
  searchQueries: string[];
  targetDeliverablesToVerify: string[];
  rationale: string;
}

/**
 * Builds a dynamic, niche-grounded research query plan
 */
export function buildResearchPlan(
  classification: ServiceClassification,
  contentType: ContentType,
  draftSnippet: string
): ResearchPlan {
  const service = classification.coreService || classification.niche || "freelance service";
  const subNiche = classification.subNiche || classification.niche;

  const queries: string[] = [];

  // Query 1: Fiverr competitor listings
  queries.push(`site:fiverr.com "${service}"`);

  // Query 2: Deliverables & market scope
  queries.push(`"${service}" freelance deliverables scope`);

  // Query 3: Buyer expectations & common pre-purchase questions
  if (contentType === "faqs") {
    queries.push(`"${service}" buyer questions requirements before ordering`);
  } else if (contentType === "title") {
    queries.push(`"${subNiche}" "${service}" top gig titles best practices`);
  } else {
    queries.push(`"${service}" buyer expectations common pitfalls checklist`);
  }

  // Query 4: Niche-specific search
  if (subNiche && subNiche !== service) {
    queries.push(`"${subNiche}" service description deliverables`);
  }

  return {
    searchQueries: queries.slice(0, 3), // Keep bounded to 3 high-impact queries
    targetDeliverablesToVerify: [
      classification.primaryDeliverable,
      "turnaround time",
      "prerequisites from buyer",
      "scope boundaries",
    ].filter(Boolean),
    rationale: `Targeting public Fiverr listings and buyer expectation patterns for ${service} (${subNiche})`,
  };
}
