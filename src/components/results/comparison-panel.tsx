import React from "react";
import { OptimizationResult } from "@/types";
import { GitCompare, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

interface ComparisonPanelProps {
  result: OptimizationResult;
}

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({ result }) => {
  const { originalDraft, recommendedContent, beforeAfterChanges } = result;

  return (
    <div className="space-y-6">
      {/* Side-by-side View */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <GitCompare className="w-4 h-4 text-emerald-600" />
          <h4 className="font-semibold text-slate-900 text-sm">Direct Before & After Comparison</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Original Seller Draft ({originalDraft.length} chars)
            </span>
            <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {originalDraft}
            </div>
          </div>

          {/* Optimized */}
          <div className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 block">
              Optimized Recommended Version ({recommendedContent.length} chars)
            </span>
            <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto font-medium">
              {recommendedContent}
            </div>
          </div>
        </div>
      </div>

      {/* Changes & Rationale Breakdown */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h4 className="font-semibold text-slate-900 text-sm">Detailed Change Log & Rationale</h4>
          <span className="text-xs text-slate-400">Every change linked to market evidence</span>
        </div>

        <div className="space-y-3">
          {beforeAfterChanges.map((change, idx) => (
            <div key={idx} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{change.section}</span>
                {change.isAssumptionRequiringConfirmation && (
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    Assumption - Please Verify
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200/70">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Original:</span>
                  <p className="text-slate-600 italic">&ldquo;{change.originalTextSnippet}&rdquo;</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-700 uppercase font-semibold">Improved:</span>
                  <p className="text-slate-900 font-medium">&ldquo;{change.optimizedTextSnippet}&rdquo;</p>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-start gap-1.5 text-slate-700">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Why It Changed:</strong> {change.reasonForChange}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-slate-500 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Market Evidence:</strong> {change.evidenceBacking}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
