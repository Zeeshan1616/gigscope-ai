import { SourceRecord, ValidationItem } from "@/types";

/**
 * Checks content originality against retrieved competitor sources.
 * Identifies exact long phrase overlaps (>6 words) to prevent copying.
 */
export function checkOriginalityAgainstSources(
  content: string,
  sources: SourceRecord[]
): { checks: ValidationItem[]; copiedPhrases: string[] } {
  const contentLower = content.toLowerCase();
  const copiedPhrases: string[] = [];

  for (const source of sources) {
    const snippetText = `${source.title} ${source.snippet}`.toLowerCase();
    const snippetWords = snippetText.split(/\s+/).filter((w) => w.length > 2);

    // Slide a 6-word window across source text to detect verbatim copying
    for (let i = 0; i <= snippetWords.length - 6; i++) {
      const phrase = snippetWords.slice(i, i + 6).join(" ");
      // Exclude trivial phrases
      if (
        phrase.includes("fiverr") ||
        phrase.includes("click here") ||
        phrase.includes("read more")
      ) {
        continue;
      }

      if (contentLower.includes(phrase) && !copiedPhrases.includes(phrase)) {
        copiedPhrases.push(phrase);
        if (copiedPhrases.length >= 3) break;
      }
    }
  }

  const passed = copiedPhrases.length === 0;

  const checkItem: ValidationItem = {
    id: "check-originality-sources",
    category: "originality",
    ruleName: "Competitor Source Originality Check",
    passed,
    severity: passed ? "passed" : "warning",
    message: passed
      ? "Content is original and does not copy verbatim text from inspected competitor listings."
      : `Detected ${copiedPhrases.length} phrase overlap(s) with observed listings: "${copiedPhrases[0]}"`,
    details:
      "GigScope AI requires distinct, original expression rather than duplicating competitor phrases.",
  };

  return {
    checks: [checkItem],
    copiedPhrases,
  };
}
