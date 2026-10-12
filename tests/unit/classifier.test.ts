import { describe, it, expect } from "vitest";
import { classifyDraftHeuristically } from "@/lib/analysis/classifier";

describe("Service & Niche Classifier", () => {
  it("should classify React web development draft accurately", () => {
    const draft = "I will build responsive web app using React, Next.js and Tailwind CSS with API integration.";
    const result = classifyDraftHeuristically(draft, "title");

    expect(result.category).toBe("Programming & Tech");
    expect(result.niche).toBe("Web Development");
    expect(result.confidence).toBe("high");
    expect(result.requiresClarification).toBe(false);
  });

  it("should classify Logo & Branding draft accurately", () => {
    const draft = "Looking for a clean minimalist logo design and complete vector brand identity for your business.";
    const result = classifyDraftHeuristically(draft, "description");

    expect(result.category).toBe("Graphics & Design");
    expect(result.niche).toBe("Logo & Brand Identity");
    expect(result.primaryDeliverable).toContain("Vector logo");
  });

  it("should classify SEO optimization draft accurately", () => {
    const draft = "I will do on-page SEO optimization and technical audit to rank your website higher on Google.";
    const result = classifyDraftHeuristically(draft, "title");

    expect(result.category).toBe("Digital Marketing");
    expect(result.niche).toBe("Search Engine Optimization (SEO)");
  });

  it("should flag very short ambiguous drafts for clarification", () => {
    const draft = "I do design";
    const result = classifyDraftHeuristically(draft, "title");

    expect(result.confidence).toBe("low");
    expect(result.requiresClarification).toBe(true);
    expect(result.clarificationQuestion).toBeDefined();
  });
});
