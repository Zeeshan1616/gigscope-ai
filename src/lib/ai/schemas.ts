import { z } from "zod";

export const TitleOptimizationSchema = z.object({
  recommendedTitle: z.string().max(80),
  alternatives: z.array(
    z.object({
      title: z.string().max(80),
      style: z.enum(["Direct & Clear", "Deliverable-Focused", "Benefit-Oriented"]),
      explanation: z.string(),
    })
  ).min(2).max(3),
  targetKeywords: z.array(z.string()),
  whyStronger: z.string(),
  changes: z.array(
    z.object({
      section: z.string(),
      originalTextSnippet: z.string(),
      optimizedTextSnippet: z.string(),
      reasonForChange: z.string(),
      evidenceBacking: z.string(),
      isAssumptionRequiringConfirmation: z.boolean(),
    })
  ),
  itemsRequiringConfirmation: z.array(z.string()).default([]),
});

export const DescriptionOptimizationSchema = z.object({
  recommendedContent: z.string().max(1200),
  conciseAlternative: z.string().max(1200),
  detailedAlternative: z.string().max(1200),
  whyStronger: z.string(),
  changes: z.array(
    z.object({
      section: z.string(),
      originalTextSnippet: z.string(),
      optimizedTextSnippet: z.string(),
      reasonForChange: z.string(),
      evidenceBacking: z.string(),
      isAssumptionRequiringConfirmation: z.boolean(),
    })
  ),
  itemsRequiringConfirmation: z.array(z.string()).default([]),
});

export const FAQOptimizationSchema = z.object({
  faqItems: z.array(
    z.object({
      question: z.string().max(100),
      answer: z.string().max(300),
      whyUseful: z.string(),
      category: z.enum(["scope", "deliverables", "buyer_prerequisites", "process", "communication"]),
      requiresSellerConfirmation: z.boolean(),
      evidenceLevel: z.enum(["directly_observed", "repeated_pattern", "reasoned_inference", "hypothesis"]),
    })
  ).min(3).max(8),
  whyStronger: z.string(),
  changes: z.array(
    z.object({
      section: z.string(),
      originalTextSnippet: z.string(),
      optimizedTextSnippet: z.string(),
      reasonForChange: z.string(),
      evidenceBacking: z.string(),
      isAssumptionRequiringConfirmation: z.boolean(),
    })
  ),
  itemsRequiringConfirmation: z.array(z.string()).default([]),
});
