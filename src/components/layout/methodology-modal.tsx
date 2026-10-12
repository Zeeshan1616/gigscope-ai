import React from "react";
import { X, ShieldCheck, Search, BookOpen, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Research & Intelligence Methodology</h3>
              <p className="text-xs text-slate-500">Principles, evidence hierarchy, and transparency guarantees</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm text-slate-600">
          {/* Core Principle */}
          <section className="space-y-2">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2 text-base">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              1. Fundamental Product Principle
            </h4>
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3.5 text-emerald-950 font-medium">
              Research first. Understand the offer second. Optimize third. Validate fourth.
            </div>
            <p>
              GigScope AI never rewrites text blindly. The system searches publicly indexed market listings, extracts real competitor patterns, and maps common buyer hesitations before optimizing wording.
            </p>
          </section>

          {/* Evidence Hierarchy */}
          <section className="space-y-3">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2 text-base">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              2. Strict Evidence Classification
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-semibold text-emerald-700 block mb-1">Directly Observed Evidence</span>
                Factually present in a retrieved, verified public source URL at the time of gathering.
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-semibold text-sky-700 block mb-1">Repeated Observed Pattern</span>
                A recurring trend or deliverable convention identified across multiple inspected listings.
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-semibold text-purple-700 block mb-1">Reasoned Inference</span>
                An analytical deduction derived logically from known industry best practices.
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-semibold text-amber-700 block mb-1">Hypothesis / Suggestion</span>
                A potential market opportunity or differentiation angle requiring seller confirmation.
              </div>
            </div>
          </section>

          {/* Seller-Truth Guarantee */}
          <section className="space-y-2">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2 text-base">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              3. Seller-Truth Protection
            </h4>
            <p>
              We never fabricate years of experience, client volumes, awards, or fake guarantees. The optimized draft must reflect what you actually offer. If an element is absent from your draft, it is marked as an editable suggestion or confirmation item rather than an invented claim.
            </p>
          </section>

          {/* Transparent Scoring */}
          <section className="space-y-2">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2 text-base">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              4. Quality Scoring Transparency
            </h4>
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-amber-900 text-xs leading-relaxed">
              <strong>Notice:</strong> Content quality scores (0–100) are internal GigScope AI heuristic assessments measuring scannability, clarity, platform compliance, and buyer-intent alignment. They are <strong>not</strong> Fiverr search rank predictors, nor do they guarantee sales or algorithmic placement.
            </div>
          </section>
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/50">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Got it, close
          </Button>
        </div>
      </div>
    </div>
  );
};
