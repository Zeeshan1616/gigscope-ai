/**
 * Text processing and measurement utilities
 */

export function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function countCharacters(text: string): number {
  return text ? text.length : 0;
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

export function cleanHtmlToText(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ")
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, " ")
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, " ")
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Standardize title ensuring proper capitalization and trimming
 */
export function normalizeTitle(title: string): string {
  let cleaned = title.trim();
  // Strip trailing period if present
  if (cleaned.endsWith(".")) {
    cleaned = cleaned.slice(0, -1).trim();
  }
  return cleaned;
}

/**
 * Extract simple difference blocks between original and optimized content
 */
export function generateSimpleDiffSummary(original: string, optimized: string): string[] {
  const originalWords = new Set(original.toLowerCase().split(/\s+/).filter(Boolean));
  const optimizedWords = new Set(optimized.toLowerCase().split(/\s+/).filter(Boolean));

  const addedWords: string[] = [];
  for (const w of optimizedWords) {
    if (!originalWords.has(w) && w.length > 3) {
      addedWords.push(w);
    }
  }

  return addedWords.slice(0, 10);
}
