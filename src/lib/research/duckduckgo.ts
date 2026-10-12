import { RawSearchResult, SearchProvider } from "./provider";
import { cleanHtmlToText } from "../utils/text";

/**
 * Live search provider using DuckDuckGo HTML / Lite interface
 * Executes real public web searches without requiring an API key.
 */
export class DuckDuckGoSearchProvider implements SearchProvider {
  public name = "DuckDuckGo Live Search";

  public isConfigured(): boolean {
    return true; // No API key required
  }

  public async search(query: string, limit = 6): Promise<RawSearchResult[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `https://html.duckduckgo.com/html/?q=${encodedQuery}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `q=${encodedQuery}&b=`,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Fallback to GET on lite endpoint if POST fails
        return await this.fallbackLiteSearch(query, limit);
      }

      const html = await response.text();
      const results = this.parseHtmlResults(html, limit);

      if (results.length === 0) {
        return await this.fallbackLiteSearch(query, limit);
      }

      return results;
    } catch {
      // In case of network interruption or timeout, try lite fallback
      try {
        return await this.fallbackLiteSearch(query, limit);
      } catch {
        return [];
      }
    }
  }

  private async fallbackLiteSearch(query: string, limit = 6): Promise<RawSearchResult[]> {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://lite.duckduckgo.com/lite/`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `q=${encodedQuery}`,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) return [];

    const html = await response.text();
    return this.parseLiteResults(html, limit);
  }

  private parseHtmlResults(html: string, limit: number): RawSearchResult[] {
    const results: RawSearchResult[] = [];
    // Extract results from <div class="result ..."> blocks
    const resultBlocks = html.split(/class="result\s+results_links/g);

    for (let i = 1; i < resultBlocks.length && results.length < limit; i++) {
      const block = resultBlocks[i];

      // Extract URL and Title from <a class="result__url" ...> or <a class="result__snippet" ...> or <a class="result__a" ...>
      const linkMatch = block.match(/<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
      const snippetMatch = block.match(/<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i);

      if (linkMatch) {
        const rawUrl = linkMatch[1];
        const unescapedUrl = this.unwrapDuckDuckGoUrl(rawUrl);
        const title = cleanHtmlToText(linkMatch[2]);
        const snippet = snippetMatch ? cleanHtmlToText(snippetMatch[1]) : "";

        if (unescapedUrl && title) {
          results.push({
            title,
            url: unescapedUrl,
            snippet,
          });
        }
      }
    }

    return results;
  }

  private parseLiteResults(html: string, limit: number): RawSearchResult[] {
    const results: RawSearchResult[] = [];
    const linkMatches = [...html.matchAll(/<a[^>]+class="result-link"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
    const snippetMatches = [...html.matchAll(/<td[^>]+class="result-snippet"[^>]*>([\s\S]*?)<\/td>/gi)];

    for (let i = 0; i < linkMatches.length && results.length < limit; i++) {
      const linkMatch = linkMatches[i];
      const snippetMatch = snippetMatches[i];

      const rawUrl = linkMatch[1];
      const unescapedUrl = this.unwrapDuckDuckGoUrl(rawUrl);
      const title = cleanHtmlToText(linkMatch[2]);
      const snippet = snippetMatch ? cleanHtmlToText(snippetMatch[1]) : "";

      if (unescapedUrl && title) {
        results.push({
          title,
          url: unescapedUrl,
          snippet,
        });
      }
    }

    return results;
  }

  private unwrapDuckDuckGoUrl(rawUrl: string): string {
    if (!rawUrl) return "";
    try {
      if (rawUrl.startsWith("//")) {
        rawUrl = "https:" + rawUrl;
      }
      if (rawUrl.includes("uddg=")) {
        const parsed = new URL(rawUrl, "https://duckduckgo.com");
        const target = parsed.searchParams.get("uddg");
        if (target) return decodeURIComponent(target);
      }
      return rawUrl;
    } catch {
      return rawUrl;
    }
  }
}
