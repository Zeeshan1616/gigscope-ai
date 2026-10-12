import React from "react";
import { OptimizationResult } from "@/types";
import { ScoreCard } from "./score-card";
import { Tag, Target, UserCheck, ShieldCheck, Search, AlertCircle, ArrowUpRight } from "lucide-react";
import { Badge } from "../ui/badge";

interface OverviewPanelProps {
  result: OptimizationResult;
  onNavigateToContent: () => void;
}

export const OverviewPanel: React.FC<OverviewPanelProps> = ({ result, onNavigateToContent }) => {
  const { classification, sellerOffer, researchCoverage, qualityScore } = result;

  return (
    <div className="space-y-6">
      {/* Top Banner: Service Detection & Classification */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Inferred Service Intelligence
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{classification.coreService}</h3>
            <p className="text-xs text-slate-500">{classification.classificationNotes}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="emerald" size="md">
              Category: {classification.category}
            </Badge>
            <Badge variant="slate" size="md">
              Confidence: {classification.confidence.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Niche Taxonomy Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium block mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Niche & Sub-Niche
            </span>
            <span className="font-semibold text-slate-800">
              {classification.niche} &bull; {classification.subNiche}
            </span>
          </div>

          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium block mb-1 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-slate-400" />
              Primary Deliverable
            </span>
            <span className="font-semibold text-slate-800 line-clamp-2">
              {classification.primaryDeliverable}
            </span>
          </div>

          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium block mb-1 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              Target Buyer
            </span>
            <span className="font-semibold text-slate-800 line-clamp-2">
              {classification.targetBuyer}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Quality Score & Research Coverage Disclosure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Score Breakdown */}
        <ScoreCard score={qualityScore} />

        {/* Live Research Coverage Report */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-600" />
                <h4 className="font-semibold text-slate-900 text-sm">Research Coverage Disclosure</h4>
              </div>
              <Badge variant="emerald" size="sm">
                {researchCoverage.coverageCompleteness.toUpperCase()} COVERAGE
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 text-[11px] block">Live Sources Inspected</span>
                <span className="text-base font-bold text-slate-900">{researchCoverage.sourcesInspected} listings</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 text-[11px] block">Search Provider</span>
                <span className="text-xs font-semibold text-slate-900 truncate block">{researchCoverage.providerUsed}</span>
              </div>
            </div>

            {/* Queries executed */}
            <div className="space-y-1 text-xs">
              <span className="font-medium text-slate-600">Search Queries Executed:</span>
              <ul className="space-y-1">
                {researchCoverage.searchQueriesExecuted.map((q, idx) => (
                  <li key={idx} className="font-mono text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100 truncate">
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclosed limitations */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-[11px] text-slate-500 space-y-1">
              <span className="font-semibold text-slate-700 block flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                Coverage Limitations:
              </span>
              <p>{researchCoverage.limitationsDisclosed[0]}</p>
            </div>
          </div>

          <button
            onClick={onNavigateToContent}
            className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-emerald-200/60"
          >
            <span>Review Recommended Draft & Alternatives</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </div>

      {/* Seller Offer Extraction Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h4 className="font-semibold text-slate-900 text-sm">Seller Offer Integrity Check</h4>
        </div>
        <p className="text-xs text-slate-500">
          We extracted the factual claims from your draft to prevent our model from adding unverified capabilities.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="font-semibold text-slate-700 block mb-1">Detected Tools & Technology:</span>
            {sellerOffer.statedToolsOrTech.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {sellerOffer.statedToolsOrTech.map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 text-[11px]">
                    {t}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-slate-400">None explicitly stated (generic service draft)</span>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="font-semibold text-slate-700 block mb-1">Explicit Deliverables Mentioned:</span>
            {sellerOffer.explicitDeliverables.length > 0 ? (
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                {sellerOffer.explicitDeliverables.slice(0, 3).map((d, i) => (
                  <li key={i} className="truncate">{d}</li>
                ))}
              </ul>
            ) : (
              <span className="text-slate-400">No structured deliverables detected in original draft</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
