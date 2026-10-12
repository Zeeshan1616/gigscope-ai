import React from "react";
import { OptimizationResult } from "@/types";
import { KeyRound, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { Badge } from "../ui/badge";

interface KeywordPanelProps {
  result: OptimizationResult;
}

export const KeywordPanel: React.FC<KeywordPanelProps> = ({ result }) => {
  const { keywords } = result;

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "primary_service":
        return "Primary Service Term";
      case "secondary_service":
        return "Secondary Niche Term";
      case "deliverable_specific":
        return "Deliverable-Specific";
      case "buyer_intent":
        return "Buyer-Intent Phrase";
      case "long_tail":
        return "Long-Tail Phrase";
      default:
        return "Supporting Term";
    }
  };

  const getPlacementAdvice = (placement: string) => {
    switch (placement) {
      case "title_lead":
        return "Place prominently near the beginning of your title";
      case "description_hook":
        return "Include within the opening 110 characters of your description";
      case "description_bullets":
        return "Include directly in your 'What's Included' bulleted list";
      case "faq_question":
        return "Formulate as a direct FAQ question header";
      default:
        return "Weave naturally into your body text without keyword stuffing";
    }
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer on Search Volume */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 text-amber-900 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-amber-950">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Keyword Intelligence & Volume Disclosure</span>
        </div>
        <p className="leading-relaxed">
          GigScope AI prioritizes <strong>natural buyer relevance</strong> over arbitrary keyword density. Quantitative search volume statistics (e.g. &ldquo;12,500 monthly searches&rdquo;) are explicitly disclosed as unavailable unless tied to an enterprise keyword database. We never invent fake search metrics.
        </p>
      </div>

      {/* Keywords Grid */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <h4 className="font-semibold text-slate-900 text-sm">Recommended Search Terminology ({keywords.length})</h4>
          </div>
          <span className="text-xs text-slate-400">Classified by buyer intent and evidence</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keywords.map((kw, idx) => (
            <div key={idx} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm text-slate-900">&ldquo;{kw.phrase}&rdquo;</span>
                <Badge variant={kw.category === "primary_service" ? "emerald" : "slate"} size="sm">
                  {getCategoryLabel(kw.category)}
                </Badge>
              </div>

              <p className="text-slate-600 leading-relaxed">{kw.reasoning}</p>

              <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{getPlacementAdvice(kw.recommendedPlacement)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle2 className="w-3 h-3 text-slate-400" />
                  <span>Evidence: {kw.evidenceLevel.replace("_", " ")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
