"use client";

import React, { useState } from "react";
import { ContentType, OptimizationResult } from "@/types";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContentTypeSelector } from "@/components/optimizer/content-type-selector";
import { DraftInput } from "@/components/optimizer/draft-input";
import { AnalysisProgress } from "@/components/optimizer/analysis-progress";
import { ResultsLayout } from "@/components/results/results-layout";
import { AlertCircle, Sparkles, ShieldCheck } from "lucide-react";

import { optimizeGigDraftClient } from "@/lib/client-optimize";

export default function Home() {
  const [contentType, setContentType] = useState<ContentType>("title");
  const [draft, setDraft] = useState("");
  const [optionalContext, setOptionalContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);

  const handleContentTypeChange = (newType: ContentType) => {
    setContentType(newType);
    setDraft("");
    setError(null);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!draft.trim()) {
      setError("Please paste or type your draft content first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let data: OptimizationResult | null = null;

      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL ||
          (typeof window !== "undefined" && window.location.pathname.startsWith("/gigscope-ai")
            ? "/gigscope-ai"
            : "");
        const apiUrl = `${apiBase}/api/analyze`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentType,
            draft: draft.trim(),
            optionalContext: optionalContext.trim() || undefined,
          }),
        });

        if (response.ok) {
          data = await response.json();
        } else if (response.status === 429) {
          const errData = await response.json().catch(() => null);
          throw new Error(
            errData?.error || "Rate limit exceeded. Please wait a moment before submitting another optimization request."
          );
        } else if (response.status === 400) {
          const errData = await response.json().catch(() => null);
          throw new Error(errData?.error || "Validation error: Please verify your input draft.");
        } else if (response.status === 404 || response.status === 405) {
          // Static host (e.g. GitHub Pages) where Node.js POST API route is unavailable
          data = null;
        } else {
          // Other status, fall back to client engine
          data = null;
        }
      } catch (fetchErr: unknown) {
        // If it's an explicit validation or rate-limit error, rethrow it
        if (fetchErr instanceof Error && (fetchErr.message.includes("Rate limit") || fetchErr.message.includes("Validation error"))) {
          throw fetchErr;
        }
        // Otherwise network/CORS error on static host, proceed to client fallback
      }

      if (!data) {
        data = await optimizeGigDraftClient({
          contentType,
          draft: draft.trim(),
          optionalContext: optionalContext.trim() || undefined,
        });
      }

      setResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to run optimization.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50/60">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Main Hero Header */}
        {!result && (
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pre-Publication Freelance Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Make your next Fiverr Gig more competitive.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Paste your proposed draft. We will research the market, inspect competitor patterns, identify buyer concerns, and produce a stronger, platform-compliant version before you publish.
            </p>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="max-w-3xl mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Optimization Error</span>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Results or Main Flow */}
        {result ? (
          <ResultsLayout result={result} onReset={handleReset} />
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Mode Selector */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block text-center sm:text-left">
                Step 1: Select Content Mode
              </span>
              <ContentTypeSelector
                selected={contentType}
                onChange={handleContentTypeChange}
                disabled={isLoading}
              />
            </div>

            {/* Draft Input Panel */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block text-center sm:text-left">
                Step 2: Paste Your Proposed Draft
              </span>
              <DraftInput
                contentType={contentType}
                draft={draft}
                onDraftChange={setDraft}
                optionalContext={optionalContext}
                onOptionalContextChange={setOptionalContext}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>

            {/* Loading Progression */}
            <AnalysisProgress isLoading={isLoading} />

            {/* Trust & Guarantee Callout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-slate-500 text-center sm:text-left">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block mb-0.5">No Published Gig Required</strong>
                  Works entirely pre-publication. No account credentials or live Fiverr URL needed.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block mb-0.5">Real Market Evidence</strong>
                  Queries publicly indexed web listings rather than inventing fake competitor data.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block mb-0.5">Seller-Truth Protected</strong>
                  Never fabricates years of experience, fake certificates, or unsubstantiated guarantees.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
