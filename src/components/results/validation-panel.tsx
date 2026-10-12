import React from "react";
import { OptimizationResult } from "@/types";
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, HelpCircle } from "lucide-react";

interface ValidationPanelProps {
  result: OptimizationResult;
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ result }) => {
  const { validationChecks, itemsRequiringConfirmation } = result;

  const getStatusIcon = (severity: string, passed: boolean) => {
    if (passed) return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
    if (severity === "critical") return <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
    return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
  };

  return (
    <div className="space-y-6">
      {/* Platform & Quality Validation Checklist */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h4 className="font-semibold text-slate-900 text-sm">Platform Compliance & Quality Checklist</h4>
          </div>
          <span className="text-xs text-slate-400">Verified against official Fiverr standards</span>
        </div>

        <div className="space-y-3">
          {validationChecks.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex items-start gap-3 text-xs transition-colors ${
                item.passed
                  ? "bg-emerald-50/30 border-emerald-200/80 text-slate-800"
                  : item.severity === "critical"
                  ? "bg-rose-50/50 border-rose-200 text-rose-950"
                  : "bg-amber-50/40 border-amber-200 text-amber-950"
              }`}
            >
              {getStatusIcon(item.severity, item.passed)}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.ruleName}</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                      item.passed
                        ? "bg-emerald-100 text-emerald-800"
                        : item.severity === "critical"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.passed ? "Passed" : item.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-600">{item.message}</p>
                {item.details && <p className="text-slate-400 text-[11px]">{item.details}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seller Confirmation Items */}
      {itemsRequiringConfirmation.length > 0 && (
        <div className="bg-white border border-amber-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-amber-100">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <h4 className="font-semibold text-slate-900 text-sm">Items Requiring Seller Confirmation</h4>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Before publishing your optimized gig on Fiverr, please double-check that you genuinely offer and support the following details:
          </p>

          <ul className="space-y-2">
            {itemsRequiringConfirmation.map((item, idx) => (
              <li
                key={idx}
                className="p-3 bg-amber-50/50 border border-amber-200/70 rounded-lg text-xs text-amber-950 flex items-center gap-2 font-medium"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
