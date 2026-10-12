import { describe, it, expect } from "vitest";
import { calculateQualityScore } from "@/lib/analysis/scoring";

describe("Quality Scoring Rubrics", () => {
  it("should calculate high score for optimal Title adhering to rules", () => {
    const title = "I will build responsive react web applications with clean code";
    const score = calculateQualityScore("title", title, 2, 0);

    expect(score.overallScore).toBeGreaterThanOrEqual(80);
    expect(score.criteria.length).toBe(4);
    expect(score.transparencyDisclaimer).toContain("not an algorithmic ranking guarantee");
  });

  it("should penalize titles exceeding 80 characters or having unsupported claims", () => {
    const longTitle = "I will provide the absolute best number one world class top ranked website development services in the entire world guaranteed";
    const score = calculateQualityScore("title", longTitle, 0, 2);

    expect(score.overallScore).toBeLessThan(75);
  });

  it("should evaluate descriptions on deliverable specificity and scannability", () => {
    const description = `Are you looking for a clean modern web app?
I specialize in React and Tailwind CSS development.

What You Get:
• Responsive multi-page layout
• Clean component architecture
• Complete source code files

Contact me today to discuss your project!`;

    const score = calculateQualityScore("description", description, 3, 0);
    expect(score.overallScore).toBeGreaterThanOrEqual(80);
    expect(score.ratingLabel).toMatch(/Strong|Exceptional/);
  });
});
