import { CompetitorPattern, ServiceClassification, SourceRecord } from "@/types";

export function analyzeCompetitorPatterns(
  sources: SourceRecord[],
  classification: ServiceClassification
): CompetitorPattern[] {
  const patterns: CompetitorPattern[] = [];
  const textCorpus = sources.map((s) => `${s.title} ${s.snippet}`).join(" ").toLowerCase();

  // Pattern 1: Responsive design & cross-platform compatibility
  if (textCorpus.includes("responsive") || textCorpus.includes("mobile") || textCorpus.includes("device")) {
    const matchingSources = sources.filter((s) => /responsive|mobile|device/i.test(`${s.title} ${s.snippet}`)).map((s) => s.url);
    patterns.push({
      pattern: "Mobile & Responsive Cross-Platform Verification",
      frequency: matchingSources.length > 2 ? "frequent" : "common",
      evidenceType: matchingSources.length > 1 ? "repeated_pattern" : "directly_observed",
      sourceReferences: matchingSources,
      description: "Top-performing listings consistently emphasize multi-device responsiveness and mobile usability as standard deliverables.",
      relevanceToSeller: "directly_applicable",
    });
  }

  // Pattern 2: Turnaround speed and clear milestone expectations
  if (textCorpus.includes("fast delivery") || textCorpus.includes("turnaround") || textCorpus.includes("day delivery") || textCorpus.includes("hours")) {
    const matchingSources = sources.filter((s) => /fast delivery|turnaround|day delivery|hours/i.test(`${s.title} ${s.snippet}`)).map((s) => s.url);
    patterns.push({
      pattern: "Realistic Turnaround & Express Option Clarification",
      frequency: "frequent",
      evidenceType: "repeated_pattern",
      sourceReferences: matchingSources,
      description: "Competitors state exact delivery timeframes upfront to prevent buyer delivery disputes.",
      relevanceToSeller: "optional_if_offered",
    });
  }

  // Pattern 3: Clean deliverables & source files included
  if (textCorpus.includes("source code") || textCorpus.includes("source file") || textCorpus.includes("vector") || textCorpus.includes("clean code")) {
    const matchingSources = sources.filter((s) => /source code|source file|vector|clean code/i.test(`${s.title} ${s.snippet}`)).map((s) => s.url);
    patterns.push({
      pattern: "Complete Source Files & Asset Ownership Guarantee",
      frequency: "common",
      evidenceType: "directly_observed",
      sourceReferences: matchingSources,
      description: "Clear disclosure of whether editable source files or commercial rights are included with the order.",
      relevanceToSeller: "directly_applicable",
    });
  }

  // Pattern 4: Step-by-step buyer onboarding (What I need from you)
  if (textCorpus.includes("requirements") || textCorpus.includes("before ordering") || textCorpus.includes("contact me")) {
    const matchingSources = sources.filter((s) => /requirements|before ordering|contact me/i.test(`${s.title} ${s.snippet}`)).map((s) => s.url);
    patterns.push({
      pattern: "Structured Pre-Order Checklist & Contact Invitation",
      frequency: "frequent",
      evidenceType: "repeated_pattern",
      sourceReferences: matchingSources,
      description: "Encouraging buyers to message before ordering to align scope and prevent cancellations.",
      relevanceToSeller: "directly_applicable",
    });
  }

  // Fallback pattern if sparse sources
  if (patterns.length === 0 && sources.length > 0) {
    patterns.push({
      pattern: `Deliverable Precision in ${classification.niche}`,
      frequency: "occasional",
      evidenceType: "reasoned_inference",
      sourceReferences: sources.slice(0, 2).map((s) => s.url),
      description: "Listing titles and summaries in this category lead with concrete technical deliverables rather than generic slogans.",
      relevanceToSeller: "directly_applicable",
    });
  }

  return patterns;
}
