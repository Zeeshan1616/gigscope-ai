import { RawSearchResult, SearchProvider } from "./provider";

export class TavilySearchProvider implements SearchProvider {
  public name = "Tavily Search API";
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.TAVILY_API_KEY;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  public async search(query: string, limit = 6): Promise<RawSearchResult[]> {
    if (!this.apiKey) return [];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          query,
          search_depth: "basic",
          include_answer: false,
          max_results: limit,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) return [];

      const data = await response.json();
      if (!Array.isArray(data.results)) return [];

      return data.results.map((r: { title?: string; url?: string; content?: string }) => ({
        title: r.title || "Web Result",
        url: r.url || "",
        snippet: r.content || "",
      }));
    } catch {
      return [];
    }
  }
}
