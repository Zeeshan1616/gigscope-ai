import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Search, Sparkles } from "lucide-react";

interface AnalysisProgressProps {
  isLoading: boolean;
}

const STAGES = [
  "Analyzing draft & inferring service niche...",
  "Building live market research query plan...",
  "Querying public search indices & competitor listings...",
  "Analyzing keyword demand & pre-purchase buyer concerns...",
  "Synthesizing optimized drafts & specific alternatives...",
  "Executing platform compliance & seller-truth validation...",
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ isLoading }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStageIndex(0);
      return;
    }

    // Step through the visual progression while the real backend call runs
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1800);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="bg-white border border-emerald-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center animate-pulse">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-base">Live Market Research & Optimization in Progress</h3>
          <p className="text-xs text-slate-500">Retrieving genuine web market data and evaluating your draft</p>
        </div>
      </div>

      <div className="space-y-3">
        {STAGES.map((stageText, index) => {
          const isDone = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;

          return (
            <div
              key={stageText}
              className={`flex items-center gap-3 p-3 rounded-lg text-xs transition-all ${
                isCurrent
                  ? "bg-emerald-50/80 border border-emerald-200 text-emerald-950 font-medium"
                  : isDone
                  ? "text-slate-700 bg-slate-50/60"
                  : "text-slate-400 opacity-60"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-emerald-600 shrink-0 animate-spin" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              )}
              <span>{stageText}</span>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-500 flex items-center gap-2">
        <Search className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Querying public search indices and inspecting competitor patterns. No data is published to Fiverr.
        </span>
      </div>
    </div>
  );
};
