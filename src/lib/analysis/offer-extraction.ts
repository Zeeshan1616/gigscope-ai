import { ExtractedSellerOffer } from "@/types";

const COMMON_TOOLS = [
  "React", "Next.js", "Vue", "Angular", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind",
  "WordPress", "Shopify", "Webflow", "Wix", "WooCommerce",
  "Figma", "Photoshop", "Illustrator", "Canva", "InDesign",
  "Premiere Pro", "After Effects", "DaVinci Resolve", "CapCut",
  "Python", "Node.js", "Express", "Docker", "PostgreSQL", "MongoDB",
  "Google Analytics", "Ahrefs", "Semrush", "Mailchimp", "Klaviyo",
];

const UNSUPPORTED_CLAIM_PATTERNS = [
  { pattern: /100%\s*(satisfaction|guarantee)/i, claim: "100% satisfaction guarantee (often flags buyer disputes or platform friction)" },
  { pattern: /guaranteed\s*(#1|top|first\s*page)\s*rank/i, claim: "Guaranteed #1 search ranking (unsubstantiated ranking guarantee)" },
  { pattern: /(best|number\s*one|#1)\s*(in\s*the\s*world|seller)/i, claim: "Unsubstantiated superlative ('best in the world')" },
  { pattern: /unlimited\s*revisions/i, claim: "Unlimited revisions without scope limits (can lead to unbounded revision requests)" },
  { pattern: /double\s*your\s*(sales|revenue)/i, claim: "Financial / conversion multiplication promise without verified client data" },
];

export function extractSellerOffer(draft: string): ExtractedSellerOffer {
  const explicitDeliverables: string[] = [];
  const statedToolsOrTech: string[] = [];
  const statedProcess: string[] = [];
  const limitationsOrExclusions: string[] = [];
  const targetAudience: string[] = [];
  const unsupportedClaimsDetected: string[] = [];

  // Detect tech / tools
  for (const tool of COMMON_TOOLS) {
    const regex = new RegExp(`\\b${tool.replace(".", "\\.")}\\b`, "i");
    if (regex.test(draft)) {
      statedToolsOrTech.push(tool);
    }
  }

  // Detect lines that resemble bullet points or deliverables
  const lines = draft.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const isBullet = line.startsWith("-") || line.startsWith("•") || line.startsWith("*") || /^\d+\./.test(line);
    const cleanLine = line.replace(/^[-•*\d.]+\s*/, "").trim();

    if (isBullet && cleanLine.length > 5 && cleanLine.length < 120) {
      explicitDeliverables.push(cleanLine);
    }

    // Process detection
    if (/step|process|workflow|phase/i.test(line) && line.length < 150) {
      statedProcess.push(cleanLine);
    }

    // Exclusion / limitation detection
    if (/not included|exclusion|please note|requirement|i do not/i.test(line)) {
      limitationsOrExclusions.push(cleanLine);
    }
  }

  // Detect unsupported claims
  for (const { pattern, claim } of UNSUPPORTED_CLAIM_PATTERNS) {
    if (pattern.test(draft)) {
      unsupportedClaimsDetected.push(claim);
    }
  }

  return {
    explicitDeliverables: explicitDeliverables.slice(0, 10),
    statedToolsOrTech,
    statedProcess: statedProcess.slice(0, 5),
    limitationsOrExclusions: limitationsOrExclusions.slice(0, 5),
    targetAudience,
    unsupportedClaimsDetected,
  };
}
