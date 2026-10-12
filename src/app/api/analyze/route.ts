import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { optimizeGigDraft } from "@/lib/ai/optimize";
import { AppError } from "@/lib/utils/errors";

export async function POST(req: NextRequest) {
  // 1. Determine client IP for rate limiting
  const forwardedFor = req.headers.get("x-forwarded-for");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

  const rateLimitStatus = checkRateLimit(clientIp);
  if (rateLimitStatus.isLimited) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Please wait a moment before submitting another optimization request.",
        code: "RATE_LIMIT_EXCEEDED",
        retryAfterSeconds: rateLimitStatus.resetSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitStatus.resetSeconds),
          "X-RateLimit-Limit": String(rateLimitStatus.limit),
          "X-RateLimit-Remaining": String(rateLimitStatus.remaining),
        },
      }
    );
  }

  // 2. Parse request body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        error: "Malformed JSON request body.",
        code: "INVALID_JSON",
      },
      { status: 400 }
    );
  }

  // 3. Execute master optimization pipeline
  try {
    const result = await optimizeGigDraft(body as { contentType: "title" | "description" | "faqs"; draft: string; optionalContext?: string });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "X-RateLimit-Limit": String(rateLimitStatus.limit),
        "X-RateLimit-Remaining": String(rateLimitStatus.remaining),
      },
    });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(
        {
          error: err.message,
          code: err.code,
          details: err.details,
        },
        { status: err.statusCode }
      );
    }

    const message = err instanceof Error ? err.message : "An unexpected server error occurred.";
    return NextResponse.json(
      {
        error: message,
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
