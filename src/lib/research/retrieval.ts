import { isSafeUrl } from "../security/url-safety";

export interface RetrievedPageContent {
  url: string;
  success: boolean;
  html?: string;
  error?: string;
  statusCode?: number;
}

/**
 * SSRF-hardened and bounded webpage retrieval helper
 */
export async function retrievePublicPage(
  rawUrl: string,
  timeoutMs = Number(process.env.MAX_FETCH_TIMEOUT_MS || 8000),
  maxBytes = Number(process.env.MAX_FETCH_BODY_BYTES || 524288) // 512 KB
): Promise<RetrievedPageContent> {
  const safetyCheck = await isSafeUrl(rawUrl);
  if (!safetyCheck.isSafe) {
    return {
      url: rawUrl,
      success: false,
      error: `Blocked by SSRF security policy: ${safetyCheck.reason}`,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(rawUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 GigScopeAI-ResearchBot/1.0",
        "Accept": "text/html,application/xhtml+xml,text/plain;q=0.8",
      },
      redirect: "follow",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Re-verify the final redirected URL for SSRF
    if (response.url && response.url !== rawUrl) {
      const redirectSafety = await isSafeUrl(response.url);
      if (!redirectSafety.isSafe) {
        return {
          url: response.url,
          success: false,
          error: `Redirected to unsafe destination: ${redirectSafety.reason}`,
        };
      }
    }

    if (!response.ok) {
      return {
        url: rawUrl,
        success: false,
        statusCode: response.status,
        error: `HTTP ${response.status} ${response.statusText}`,
      };
    }

    const contentType = response.headers.get("content-type") || "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("text/plain") &&
      !contentType.includes("application/xhtml")
    ) {
      return {
        url: rawUrl,
        success: false,
        error: `Ignored non-text content-type: ${contentType}`,
      };
    }

    // Read stream up to maxBytes to avoid memory exhaustion
    const reader = response.body?.getReader();
    if (!reader) {
      const text = await response.text();
      return {
        url: rawUrl,
        success: true,
        statusCode: response.status,
        html: text.slice(0, maxBytes),
      };
    }

    const chunks: Uint8Array[] = [];
    let receivedBytes = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        receivedBytes += value.length;
        if (receivedBytes >= maxBytes) {
          reader.cancel();
          break;
        }
      }
    }

    const totalBuffer = new Uint8Array(receivedBytes);
    let offset = 0;
    for (const chunk of chunks) {
      totalBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    const decoder = new TextDecoder("utf-8");
    const html = decoder.decode(totalBuffer);

    return {
      url: rawUrl,
      success: true,
      statusCode: response.status,
      html,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      url: rawUrl,
      success: false,
      error: `Failed to retrieve page: ${message}`,
    };
  }
}
