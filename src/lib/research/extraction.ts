import { cleanHtmlToText } from "../utils/text";

export interface ExtractedPageData {
  title: string;
  metaDescription: string;
  headings: string[];
  mainText: string;
  excerpts: string[];
}

export function extractPageContent(html: string, targetKeywords: string[] = []): ExtractedPageData {
  if (!html) {
    return {
      title: "",
      metaDescription: "",
      headings: [],
      mainText: "",
      excerpts: [],
    };
  }

  // Extract <title>
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? cleanHtmlToText(titleMatch[1]) : "";

  // Extract <meta name="description" ...>
  const metaDescMatch = html.match(/<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']*)["']/i);
  const metaDescription = metaDescMatch ? cleanHtmlToText(metaDescMatch[1]) : "";

  // Extract headings (h1, h2, h3)
  const headings: string[] = [];
  const headingMatches = [...html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)];
  for (const m of headingMatches.slice(0, 10)) {
    const text = cleanHtmlToText(m[1]);
    if (text && text.length > 3 && !headings.includes(text)) {
      headings.push(text);
    }
  }

  // Clean full body text
  const mainText = cleanHtmlToText(html);

  // Extract relevant excerpts that contain target keywords
  const sentences = mainText.split(/(?<=[.!?])\s+/);
  const excerpts: string[] = [];

  const lowerKeywords = targetKeywords.map((k) => k.toLowerCase().trim()).filter(Boolean);

  for (const sentence of sentences) {
    if (sentence.length < 25 || sentence.length > 300) continue;
    const lowerSentence = sentence.toLowerCase();

    const matchesKeyword = lowerKeywords.some((k) => lowerSentence.includes(k));
    if (matchesKeyword || excerpts.length < 3) {
      if (!excerpts.includes(sentence)) {
        excerpts.push(sentence);
      }
      if (excerpts.length >= 6) break;
    }
  }

  return {
    title,
    metaDescription,
    headings,
    mainText: mainText.slice(0, 4000), // Bounded excerpt
    excerpts,
  };
}
