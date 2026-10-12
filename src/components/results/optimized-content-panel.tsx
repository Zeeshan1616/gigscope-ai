import React, { useState } from "react";
import { ContentType, OptimizationResult } from "@/types";
import { Copy, Check, RotateCcw, Sparkles, AlertCircle, FileCheck } from "lucide-react";
import { Button } from "../ui/button";

interface OptimizedContentPanelProps {
  result: OptimizationResult;
}

export const OptimizedContentPanel: React.FC<OptimizedContentPanelProps> = ({ result }) => {
  const { contentType, recommendedContent, titleAlternatives, descriptionAlternatives, faqItems, whyItIsBetter } = result;

  // Editable content state
  const [editableText, setEditableText] = useState(recommendedContent);
  const [copied, setCopied] = useState(false);
  const [activeAltIndex, setActiveAltIndex] = useState<number | null>(null);

  const charLimit = contentType === "title" ? 80 : contentType === "description" ? 1200 : 3000;
  const currentChars = editableText.length;
  const isOverLimit = contentType === "title" ? currentChars > 80 : contentType === "description" ? currentChars > 1200 : false;

  const handleCopy = async (textToCopy = editableText) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleSelectAlternative = (content: string, index: number) => {
    setEditableText(content);
    setActiveAltIndex(index);
  };

  const handleResetToRecommended = () => {
    setEditableText(recommendedContent);
    setActiveAltIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Editor Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                {activeAltIndex !== null ? "Selected Alternative Draft" : "Recommended Final Draft"}
              </span>
              <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                Directly Editable
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Optimized {contentType === "title" ? "Gig Title" : contentType === "description" ? "Gig Description" : "FAQs"}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToRecommended}
              className="text-xs text-slate-500 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 flex items-center gap-1 transition-colors"
              title="Reset to recommended version"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <Button
              variant={copied ? "secondary" : "primary"}
              size="sm"
              onClick={() => handleCopy(editableText)}
              className="min-w-[110px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Final</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <textarea
            rows={contentType === "title" ? 3 : 10}
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            className={`w-full p-4 text-sm font-normal text-slate-900 bg-slate-50/50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all font-mono leading-relaxed resize-y ${
              isOverLimit
                ? "border-rose-400 focus:ring-rose-400"
                : "border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
            }`}
          />

          {/* Character Budget Counter */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Feel free to edit wording before copying to Fiverr</span>
            </div>
            <div className="flex items-center gap-2">
              {isOverLimit && (
                <span className="text-rose-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Exceeds Fiverr maximum limit!
                </span>
              )}
              <span className={`font-medium ${isOverLimit ? "text-rose-600" : "text-slate-800"}`}>
                {currentChars} / {charLimit} max characters
              </span>
            </div>
          </div>
        </div>

        {/* Why this is stronger note */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 text-xs text-emerald-950 space-y-1">
          <span className="font-semibold flex items-center gap-1.5 text-emerald-900">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            Why This Version Is Stronger:
          </span>
          <p className="leading-relaxed">{whyItIsBetter}</p>
        </div>
      </div>

      {/* Alternative Versions Section */}
      {contentType === "title" && titleAlternatives && titleAlternatives.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 text-sm">Alternative Title Angles</h4>
            <p className="text-xs text-slate-500">
              Select any alternative to load it into the editor above.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {titleAlternatives.map((alt, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  activeAltIndex === idx
                    ? "bg-emerald-50/50 border-emerald-500 ring-1 ring-emerald-500/20"
                    : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-700 uppercase">{alt.style}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{alt.characterCount} chars</span>
                  </div>
                  <p className="text-xs font-medium text-slate-900 leading-snug">&ldquo;{alt.title}&rdquo;</p>
                  <p className="text-[11px] text-slate-500">{alt.explanation}</p>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleSelectAlternative(alt.title, idx)}
                  >
                    Load into Editor
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description Alternatives */}
      {contentType === "description" && descriptionAlternatives && descriptionAlternatives.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 text-sm">Alternative Description Styles</h4>
            <p className="text-xs text-slate-500">
              Test a direct concise version versus an in-depth explanatory layout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {descriptionAlternatives.map((alt, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  activeAltIndex === idx
                    ? "bg-emerald-50/50 border-emerald-500 ring-1 ring-emerald-500/20"
                    : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700">{alt.version}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {alt.wordCount} words &bull; {alt.characterCount} chars
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{alt.explanation}</p>
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80 max-h-48 overflow-y-auto text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {alt.content}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs mt-2"
                  onClick={() => handleSelectAlternative(alt.content, idx)}
                >
                  Load {alt.version} into Editor
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Individual Items View */}
      {contentType === "faqs" && faqItems && faqItems.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 text-sm">Structured FAQ Pairs Breakdown</h4>
            <p className="text-xs text-slate-500">
              Each FAQ is formulated under Fiverr's 300-character ceiling to reduce buyer friction.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((faq) => (
              <div key={faq.id} className="p-4 bg-slate-50/60 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    Category: {faq.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{faq.answer.length}/300 chars</span>
                </div>
                <h5 className="font-semibold text-xs text-slate-900">{faq.question}</h5>
                <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded border border-slate-100">
                  {faq.answer}
                </p>
                <p className="text-[11px] text-emerald-700 font-medium">{faq.whyUseful}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
