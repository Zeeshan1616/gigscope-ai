import React from "react";
import { OptimizationResult } from "@/types";
import { SourceCard } from "./source-card";
import { Users, HelpCircle, Lightbulb, Search, ExternalLink } from "lucide-react";
import { Badge } from "../ui/badge";

interface MarketResearchPanelProps {
  result: OptimizationResult;
}

export const MarketResearchPanel: React.FC<MarketResearchPanelProps> = ({ result }) => {
  const { sources, competitorPatterns, buyerConcerns, marketGaps } = result;

  return (
    <div className="space-y-6">
      {/* Competitor Observed Patterns */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <h4 className="font-semibold text-slate-900 text-sm">Observed Competitor Offer Patterns</h4>
          </div>
          <span className="text-xs text-slate-400">Based on inspected public marketplace listings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {competitorPatterns.map((cp, idx) => (
            <div key={idx} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">{cp.pattern}</span>
                <Badge variant={cp.frequency === "frequent" ? "emerald" : "slate"} size="sm">
                  {cp.frequency.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{cp.description}</p>
              {cp.sourceReferences.length > 0 && (
                <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                  <span className="truncate">Observed in: {cp.sourceReferences[0]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Buyer Pre-Purchase Concerns */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <h4 className="font-semibold text-slate-900 text-sm">Pre-Purchase Buyer Hesitations & Scope Boundaries</h4>
          </div>
          <span className="text-xs text-slate-400">Identified from public discussion & buyer queries</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {buyerConcerns.map((bc) => (
            <div key={bc.id} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2 text-xs">
              <span className="font-semibold text-slate-900 block leading-snug">&ldquo;{bc.concern}&rdquo;</span>
              <p className="text-slate-600 leading-relaxed">{bc.whyItMatters}</p>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-emerald-900 font-medium">
                Recommendation: {bc.suggestedClarification}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Location: {bc.recommendedHandlingLocation.toUpperCase()}</span>
                {bc.requiresSellerConfirmation && (
                  <span className="text-amber-600 font-medium">Requires Seller Confirmation</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Identified Market Gaps */}
      {marketGaps.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lightbulb className="w-4 h-4 text-emerald-600" />
            <h4 className="font-semibold text-slate-900 text-sm">Market Differentiation Hypotheses</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {marketGaps.map((mg, idx) => (
              <div key={idx} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                <span className="font-semibold text-slate-900 block">{mg.opportunity}</span>
                <p className="text-slate-600 leading-relaxed">{mg.explanation}</p>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block pt-1">
                  Evidence: {mg.evidenceType.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Verified Source Records */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-600" />
            <h4 className="font-semibold text-slate-900 text-sm">Verified Source Provenance ({sources.length})</h4>
          </div>
          <span className="text-xs text-slate-400">Genuine external listings retrieved during analysis</span>
        </div>

        {sources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sources.map((src) => (
              <SourceCard key={src.id} source={src} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic p-4 text-center">
            No live public listings were indexed for this specific query sample.
          </p>
        )}
      </div>
    </div>
  );
};
