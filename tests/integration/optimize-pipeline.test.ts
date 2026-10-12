import { describe, it, expect } from "vitest";
import { optimizeGigDraft } from "@/lib/ai/optimize";

describe("GigScope AI Master Optimization Pipeline", () => {
  it("should optimize Gig Title with alternatives and strict 80-char limit", async () => {
    const result = await optimizeGigDraft({
      contentType: "title",
      draft: "I will do professional website development and design with react",
      optionalContext: "Focus on React and Tailwind CSS dashboards.",
    });

    expect(result.id).toBeDefined();
    expect(result.contentType).toBe("title");
    expect(result.classification.niche).toBe("Web Development");
    expect(result.recommendedContent.length).toBeLessThanOrEqual(80);
    expect(result.recommendedContent).toMatch(/^I will/i);

    expect(result.titleAlternatives).toBeDefined();
    expect(result.titleAlternatives?.length).toBeGreaterThanOrEqual(2);
    for (const alt of result.titleAlternatives || []) {
      expect(alt.title.length).toBeLessThanOrEqual(80);
      expect(alt.title).toMatch(/^I will/i);
    }

    expect(result.qualityScore.overallScore).toBeGreaterThanOrEqual(70);
    expect(result.researchCoverage).toBeDefined();
    expect(result.validationChecks.length).toBeGreaterThan(0);
  });

  it("should optimize Gig Description with deliverables and scannability", async () => {
    const result = await optimizeGigDraft({
      contentType: "description",
      draft: `Looking for a custom logo for your startup? I do logo design with vector files and high resolution exports. 100% satisfaction guarantee. Message me before ordering.`,
    });

    expect(result.contentType).toBe("description");
    expect(result.classification.category).toBe("Graphics & Design");
    expect(result.recommendedContent.length).toBeLessThanOrEqual(1200);

    expect(result.descriptionAlternatives).toBeDefined();
    expect(result.descriptionAlternatives?.length).toBe(2);

    expect(result.beforeAfterChanges.length).toBeGreaterThan(0);
    expect(result.keywords.length).toBeGreaterThan(0);
  });

  it("should optimize FAQs addressing pre-purchase friction", async () => {
    const result = await optimizeGigDraft({
      contentType: "faqs",
      draft: `Q: What files do you provide?
A: AI, SVG, PNG and PDF.

Q: How many revisions do you include?
A: Unlimited revisions.`,
    });

    expect(result.contentType).toBe("faqs");
    expect(result.faqItems).toBeDefined();
    expect(result.faqItems?.length).toBeGreaterThanOrEqual(3);

    for (const faq of result.faqItems || []) {
      expect(faq.question.length).toBeGreaterThan(5);
      expect(faq.answer.length).toBeLessThanOrEqual(300);
      expect(faq.whyUseful).toBeDefined();
    }
  });
});
