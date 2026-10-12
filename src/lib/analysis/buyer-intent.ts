import { BuyerConcern, ServiceClassification, SourceRecord } from "@/types";

export function analyzeBuyerConcerns(
  sources: SourceRecord[],
  classification: ServiceClassification,
  sellerDeliverables: string[]
): BuyerConcern[] {
  const concerns: BuyerConcern[] = [];

  // Concern 1: Scope & exact deliverables
  concerns.push({
    id: "concern-scope-1",
    concern: "Will the final delivery work out of the box, or are essential assets missing?",
    whyItMatters: "Buyers hesitate when descriptions use vague promises like 'full setup' without listing explicit file formats or components.",
    evidenceLevel: "repeated_pattern",
    sourceReferences: sources.slice(0, 2).map((s) => s.url),
    recommendedHandlingLocation: "description",
    suggestedClarification: "Provide a crisp bulleted list of final deliverables (e.g. source files, formats, documentation).",
    requiresSellerConfirmation: sellerDeliverables.length === 0,
  });

  // Concern 2: Buyer prerequisites / inputs needed
  concerns.push({
    id: "concern-inputs-2",
    concern: "What materials or credentials do I need to prepare before placing the order?",
    whyItMatters: "Orders stall when buyers order first and only discover later that they lacked necessary logins, content, or designs.",
    evidenceLevel: "reasoned_inference",
    sourceReferences: [],
    recommendedHandlingLocation: "faqs",
    suggestedClarification: "Detail required assets upfront (e.g., text copy, logo vectors, hosting access, brand palette).",
    requiresSellerConfirmation: true,
  });

  // Concern 3: Platform compatibility / tech stack
  concerns.push({
    id: "concern-compat-3",
    concern: "Is this service compatible with my current tools or existing workflow?",
    whyItMatters: "Buyers need reassurance that they will not receive an incompatible file format or unsupported code framework.",
    evidenceLevel: "directly_observed",
    sourceReferences: sources.slice(0, 1).map((s) => s.url),
    recommendedHandlingLocation: "description",
    suggestedClarification: `Clarify supported environments, frameworks, and export formats for ${classification.subNiche}.`,
    requiresSellerConfirmation: false,
  });

  // Concern 4: Revisions and adjustment boundaries
  concerns.push({
    id: "concern-revisions-4",
    concern: "How are minor adjustments handled if the initial delivery needs refinement?",
    whyItMatters: "Buyers fear being locked into an unsatisfactory delivery, while sellers risk endless uncompensated scope creep.",
    evidenceLevel: "repeated_pattern",
    sourceReferences: sources.slice(1, 3).map((s) => s.url),
    recommendedHandlingLocation: "faqs",
    suggestedClarification: "State how revisions are handled and encourage pre-order discussion for custom requirements.",
    requiresSellerConfirmation: true,
  });

  return concerns;
}
