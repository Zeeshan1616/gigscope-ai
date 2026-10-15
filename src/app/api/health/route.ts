import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const aiProvider = process.env.AI_PROVIDER || "openrouter";
  const aiModel = process.env.AI_MODEL || "nvidia/nemotron-3.5-lightning";
  const isAiKeyConfigured = Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY.trim().length > 0);
  const researchProvider = process.env.RESEARCH_PROVIDER || "duckduckgo";
  const isTavilyConfigured = Boolean(process.env.TAVILY_API_KEY && process.env.TAVILY_API_KEY.trim().length > 0);

  return NextResponse.json(
    {
      status: "ok",
      application: "GigScope AI",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      configuration: {
        aiProvider,
        aiModel,
        aiKeyConfigured: isAiKeyConfigured,
        runtimeMode: isAiKeyConfigured ? "live_model_generation" : "research_grounded_synthesis",
        researchProvider,
        liveSearchConfigured: true, // DuckDuckGo is active by default
        premiumSearchConfigured: isTavilyConfigured,
      },
    },
    { status: 200 }
  );
}
