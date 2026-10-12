export interface RawSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface SearchProvider {
  name: string;
  isConfigured(): boolean;
  search(query: string, limit?: number): Promise<RawSearchResult[]>;
}
