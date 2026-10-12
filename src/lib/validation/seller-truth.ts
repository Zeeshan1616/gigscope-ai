import { ValidationItem } from "@/types";

const FABRICATED_CLAIM_PATTERNS = [
  { pattern: /\b(\d+)\+?\s*years(?:\s*of)?\s*experience\b/i, name: "Years of experience claim" },
  { pattern: /\b(\d+)\+?\s*(?:happy\s*)?clients\b/i, name: "Specific client volume claim" },
  { pattern: /\b(?:certified|accredited)\s*(?:by|professional)\b/i, name: "Unverified certification claim" },
  { pattern: /\b100%\s*(?:money\s*back|refund)\s*guarantee\b/i, name: "100% money-back guarantee promise" },
  { pattern: /\b24\/7\s*(?:support|availability)\b/i, name: "24/7 round-the-clock availability claim" },
];

export function validateSellerTruth(
  originalDraft: string,
  optimizedContent: string
): { checks: ValidationItem[]; itemsRequiringConfirmation: string[] } {
  const checks: ValidationItem[] = [];
  const itemsRequiringConfirmation: string[] = [];

  const originalLower = originalDraft.toLowerCase();
  const optimizedLower = optimizedContent.toLowerCase();

  for (const { pattern, name } of FABRICATED_CLAIM_PATTERNS) {
    const presentInOptimized = pattern.test(optimizedLower);
    const presentInOriginal = pattern.test(originalLower);

    // If introduced in optimized without being in original draft
    if (presentInOptimized && !presentInOriginal) {
      checks.push({
        id: `check-truth-${name.toLowerCase().replace(/\s+/g, "-")}`,
        category: "seller_truth",
        ruleName: `Seller Truth: ${name}`,
        passed: false,
        severity: "warning",
        message: `Introduced ${name.toLowerCase()} that was not in your original draft.`,
        details: "Please confirm you have this credential before publishing on Fiverr.",
      });
      itemsRequiringConfirmation.push(`Verify that you actually offer/hold: ${name}`);
    }
  }

  if (checks.length === 0) {
    checks.push({
      id: "check-truth-passed",
      category: "seller_truth",
      ruleName: "Seller Truth & Claim Authenticity",
      passed: true,
      severity: "passed",
      message: "No fabricated credentials, client counts, or unverified claims introduced.",
    });
  }

  return {
    checks,
    itemsRequiringConfirmation,
  };
}
