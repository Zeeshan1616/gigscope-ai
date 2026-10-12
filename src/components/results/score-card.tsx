import React from "react";
import { ContentQualityScore } from "@/types";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

interface ScoreCardProps {
  score: ContentQualityScore;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  const getScoreColor = (val: number) => {
    if (val >= 85) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (val >= 70) return "text-sky-600 bg-sky-50 border-sky-200";
    if (val >= 55) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  const getProgressBarColor = (val: number) => {
    if (val >= 85) return "bg-emerald-500";
    if (val >= 70) return "bg-sky-500";
    if (val >= 55) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
      {/* Overall Score Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Content Quality Score</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-extrabold text-slate-900">{score.overallScore}</span>
            <span className="text-sm text-slate-400">/ 100</span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getScoreColor(
                score.overallScore
              )}`}
            >
              {score.ratingLabel}
            </span>
          </div>
        </div>

        <div className="text-right text-xs text-slate-400 max-w-[200px]">
          {score.rubricSummary}
        </div>
      </div>

      {/* Criteria Breakdown */}
      <div className="space-y-3.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Evaluated Dimensions</h4>
        {score.criteria.map((c) => (
          <div key={c.name} className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between font-medium">
              <span className="text-slate-800">{c.name}</span>
              <span className="text-slate-500">{c.score}/100</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(c.score)}`}
                style={{ width: `${c.score}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {c.strength}
              </span>
              {c.weakness !== "None observed." && (
                <span className="text-amber-700 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  {c.weakness}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Transparency Disclaimer */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-[11px] text-slate-500 flex items-start gap-2 leading-relaxed">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>{score.transparencyDisclaimer}</span>
      </div>
    </div>
  );
};
