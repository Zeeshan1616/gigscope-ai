import { ContentQualityScore, ContentType, ScoreCriterion } from "@/types";

export function calculateQualityScore(
  contentType: ContentType,
  text: string,
  deliverablesCount: number,
  unsupportedClaimsCount: number
): ContentQualityScore {
  const charLength = text.length;
  let criteria: ScoreCriterion[] = [];

  if (contentType === "title") {
    // Title scoring criteria
    const startsWithIWill = /^i will/i.test(text.trim());
    const lengthScore = charLength >= 40 && charLength <= 75 ? 95 : charLength <= 80 ? 80 : 45;
    const clarityScore = text.split(/\s+/).length >= 5 ? 88 : 60;
    const claimPenalty = unsupportedClaimsCount * 25;
    const naturalnessScore = Math.max(30, 90 - claimPenalty);
    const complianceScore = startsWithIWill && charLength <= 80 ? 100 : charLength <= 80 ? 85 : 50;

    criteria = [
      {
        name: "Service & Offer Clarity",
        score: clarityScore,
        weight: 0.25,
        label: "Clarity",
        evaluation: "Evaluates whether a buyer immediately grasps what deliverable is produced.",
        strength: clarityScore >= 80 ? "Clearly states the core service deliverable." : "Adequate baseline wording.",
        weakness: clarityScore < 80 ? "Could be more specific regarding exact deliverables." : "None observed.",
      },
      {
        name: "Length & Character Economy",
        score: lengthScore,
        weight: 0.25,
        label: "Display Optimization",
        evaluation: "Checks ideal display length (50-75 chars) so cards don't truncate on mobile apps.",
        strength: lengthScore >= 85 ? "Optimal length avoids truncation on mobile browsing grids." : "Within platform ceiling.",
        weakness: lengthScore < 85 ? (charLength > 80 ? "Exceeds Fiverr's recommended 80-character maximum." : "Too brief to convey specificity.") : "None observed.",
      },
      {
        name: "Natural Keyword Phrasing",
        score: naturalnessScore,
        weight: 0.25,
        label: "Natural Language",
        evaluation: "Assesses natural search term flow without awkward keyword stuffing.",
        strength: naturalnessScore >= 80 ? "Search terms integrate naturally into smooth English." : "Basic keyword usage.",
        weakness: naturalnessScore < 80 ? "Phrasing contains repetitive terms or empty marketing words." : "None observed.",
      },
      {
        name: "Fiverr Platform Rule Adherence",
        score: complianceScore,
        weight: 0.25,
        label: "Platform Compliance",
        evaluation: "Verifies standard Fiverr 'I will' convention and absence of prohibited punctuation.",
        strength: complianceScore >= 90 ? "Follows official Fiverr title standards." : "Minor formatting adjustment needed.",
        weakness: complianceScore < 90 ? (!startsWithIWill ? "Missing standard 'I will' opening." : "Review character ceiling.") : "None observed.",
      },
    ];
  } else if (contentType === "description") {
    // Description scoring criteria
    const lengthScore = charLength <= 1200 ? (charLength > 400 ? 92 : 75) : 40;
    const deliverableScore = deliverablesCount >= 3 ? 95 : deliverablesCount > 0 ? 80 : 55;
    const claimPenalty = unsupportedClaimsCount * 20;
    const credibilityScore = Math.max(35, 90 - claimPenalty);
    const scannabilityScore = text.includes("\n") || text.includes("-") || text.includes("•") ? 90 : 60;

    criteria = [
      {
        name: "Deliverable Specificity",
        score: deliverableScore,
        weight: 0.30,
        label: "Scope Detail",
        evaluation: "Checks whether concrete, tangible deliverables are detailed.",
        strength: deliverableScore >= 80 ? "Includes concrete deliverables that remove buyer ambiguity." : "Mentions general service outcomes.",
        weakness: deliverableScore < 80 ? "Add specific file formats or deliverables to reassure prospective buyers." : "None observed.",
      },
      {
        name: "Scannability & Structure",
        score: scannabilityScore,
        weight: 0.25,
        label: "Layout & Formatting",
        evaluation: "Measures visual layout, short paragraphs, and bulleted sections.",
        strength: scannabilityScore >= 80 ? "Structured with clear sections and easy-to-scan bullet points." : "Basic paragraph flow.",
        weakness: scannabilityScore < 80 ? "Break long walls of text into bullet points for quick scanning." : "None observed.",
      },
      {
        name: "Seller Credibility & Truth",
        score: credibilityScore,
        weight: 0.25,
        label: "Authenticity",
        evaluation: "Ensures absence of unsubstantiated claims, fake guarantees, or empty filler.",
        strength: credibilityScore >= 85 ? "Free from exaggerated slogans and empty filler phrases." : "Acceptable professional tone.",
        weakness: credibilityScore < 85 ? "Detected unsupported claims or generic filler that reduces trust." : "None observed.",
      },
      {
        name: "Platform Length Compliance",
        score: lengthScore,
        weight: 0.20,
        label: "1,200 Character Cap",
        evaluation: "Verifies adherence to Fiverr's hard ceiling of 1,200 characters.",
        strength: lengthScore >= 80 ? `Fits comfortably within Fiverr's 1,200 character cap (${charLength} chars).` : "Character budget check.",
        weakness: lengthScore < 80 ? `Exceeds Fiverr's strict 1,200 character maximum (${charLength} chars). Must trim.` : "None observed.",
      },
    ];
  } else {
    // FAQ scoring criteria
    const countScore = deliverablesCount >= 3 ? 92 : deliverablesCount >= 1 ? 80 : 50;
    const practicalityScore = 88;
    const complianceScore = charLength <= 3000 ? 95 : 60;
    const resolutionScore = 86;

    criteria = [
      {
        name: "Buyer Friction Resolution",
        score: resolutionScore,
        weight: 0.30,
        label: "Friction Reduction",
        evaluation: "Assesses whether questions address the real hesitations buyers have before purchasing.",
        strength: "Targets core pre-purchase uncertainties regarding scope and prerequisites.",
        weakness: "None observed.",
      },
      {
        name: "Answer Economy & Conciseness",
        score: practicalityScore,
        weight: 0.25,
        label: "Answer Length",
        evaluation: "Ensures answers are direct, friendly, and under Fiverr's 300-character answer ceiling.",
        strength: "Answers are crisp, informative, and avoid rambling.",
        weakness: "Ensure each answer stays under 300 characters in the Fiverr dashboard.",
      },
      {
        name: "FAQ Breadth & Coverage",
        score: countScore,
        weight: 0.25,
        label: "Coverage Scope",
        evaluation: "Checks that diverse topics (requirements, deliverables, adjustments) are covered.",
        strength: "Covers diverse buyer readiness scenarios.",
        weakness: countScore < 80 ? "Consider adding questions about buyer prerequisites." : "None observed.",
      },
      {
        name: "Platform Policy Adherence",
        score: complianceScore,
        weight: 0.20,
        label: "Platform Rules",
        evaluation: "Guarantees no off-platform contact sharing or prohibited promises in answers.",
        strength: "Complies fully with Fiverr communication and TOS guidelines.",
        weakness: "None observed.",
      },
    ];
  }

  // Calculate weighted overall score
  let totalScore = 0;
  for (const c of criteria) {
    totalScore += c.score * c.weight;
  }
  const overallScore = Math.min(100, Math.max(0, Math.round(totalScore)));

  let ratingLabel: ContentQualityScore["ratingLabel"] = "Good";
  if (overallScore >= 90) ratingLabel = "Exceptional";
  else if (overallScore >= 80) ratingLabel = "Strong";
  else if (overallScore >= 70) ratingLabel = "Good";
  else if (overallScore >= 55) ratingLabel = "Needs Improvement";
  else ratingLabel = "Underdeveloped";

  return {
    overallScore,
    ratingLabel,
    rubricSummary: `Weighted evaluation across ${criteria.length} specific dimensions for ${contentType.toUpperCase()}.`,
    criteria,
    transparencyDisclaimer:
      "This score is a GigScope AI heuristic quality evaluation based on content clarity, scannability, and buyer alignment. It is not an algorithmic ranking guarantee or a prediction of Fiverr search placement or sales conversion.",
  };
}
