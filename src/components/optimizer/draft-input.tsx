import React, { useState } from "react";
import { ContentType } from "@/types";
import { Sparkles, ChevronDown, ChevronUp, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

interface DraftInputProps {
  contentType: ContentType;
  draft: string;
  onDraftChange: (val: string) => void;
  optionalContext: string;
  onOptionalContextChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const PLACEHOLDERS: Record<ContentType, string> = {
  title: "e.g., I will do professional website development and design for your business",
  description: `e.g., Welcome to my gig! I provide website development using React and Next.js. I have years of experience and provide 100% satisfaction guarantee. I will build responsive pages, connect APIs, and give you clean code. Message me today!`,
  faqs: `e.g., Q: What do you need to get started?
A: Just send me your requirements and ideas.

Q: Do you offer revisions?
A: Yes, unlimited revisions until you are satisfied.`,
};

const SAMPLE_DRAFTS: Record<ContentType, Array<{ label: string; text: string; notes?: string }>> = {
  title: [
    {
      label: "Web Dev Draft",
      text: "I will do professional website development and design with react",
      notes: "Focusing on React, Next.js, and modern responsive frontend dashboards.",
    },
    {
      label: "Logo Design Draft",
      text: "I will design modern minimalist business logo for your company",
      notes: "Vector files, brand identity guidelines, and high-res exports.",
    },
    {
      label: "SEO Draft",
      text: "I will do complete on page seo optimization to rank your site",
      notes: "Meta tags, keyword research, technical crawl fixes.",
    },
  ],
  description: [
    {
      label: "React Web App",
      text: `Are you looking for a modern web application? I will build a fast, responsive frontend for your startup.

What you get:
- Responsive React / Next.js interface
- API integration
- Clean maintainable code
- Cross-browser testing

I guarantee 100% satisfaction and quick turnaround. Contact me before placing an order!`,
      notes: "Tech stack: React, TypeScript, Tailwind CSS. Deliverables: responsive web app.",
    },
    {
      label: "Brand Logo Identity",
      text: `Looking for a professional logo for your brand? I create clean minimalist logos that make your business stand out.

Included in this gig:
- 2 initial logo concepts
- High-resolution PNG and JPEG files
- Vector source files (AI, SVG)
- Commercial usage rights

Best quality guaranteed. Message me with your brand name to begin.`,
      notes: "Target: Startups and e-commerce stores wanting minimalist branding.",
    },
  ],
  faqs: [
    {
      label: "Standard Web FAQs",
      text: `Q: What do you need from me before starting?
A: Please provide your design wireframes or reference links and any specific API endpoints.

Q: Will the website be mobile responsive?
A: Yes, it will look great on phones, tablets, and desktops.

Q: Do you provide the full source code?
A: Yes, you receive 100% ownership of the GitHub repository or zipped source files.`,
      notes: "Targeting frontend development scope and prerequisites.",
    },
  ],
};

export const DraftInput: React.FC<DraftInputProps> = ({
  contentType,
  draft,
  onDraftChange,
  optionalContext,
  onOptionalContextChange,
  onSubmit,
  isLoading,
}) => {
  const [showOptionalContext, setShowOptionalContext] = useState(false);

  const charCount = draft.length;
  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;

  const maxChars = contentType === "title" ? 80 : contentType === "description" ? 1200 : 3000;
  const isOverLimit = contentType === "title" ? charCount > 80 : contentType === "description" ? charCount > 1200 : false;
  const isTooShort = draft.trim().length < 3;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header and Quick Samples */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <label htmlFor="draft-textarea" className="block text-base font-semibold text-slate-900">
            Paste Your {contentType === "title" ? "Gig Title" : contentType === "description" ? "Gig Description" : "FAQ"} Draft
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            We will infer your niche, retrieve live market intelligence, and optimize the wording.
          </p>
        </div>

        {/* Quick Sample Loaders */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Try sample:</span>
          {SAMPLE_DRAFTS[contentType]?.map((sample) => (
            <button
              key={sample.label}
              type="button"
              disabled={isLoading}
              onClick={() => {
                onDraftChange(sample.text);
                if (sample.notes) onOptionalContextChange(sample.notes);
              }}
              className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200/80 transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            id="draft-textarea"
            rows={contentType === "title" ? 3 : 7}
            disabled={isLoading}
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder={PLACEHOLDERS[contentType]}
            className={`w-full p-4 text-sm text-slate-900 bg-slate-50/50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all resize-y ${
              isOverLimit
                ? "border-rose-400 focus:ring-rose-400"
                : "border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
            }`}
          />
        </div>

        {/* Character Counter & Indicators */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            {isOverLimit && (
              <span className="text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Exceeds Fiverr maximum ({maxChars} chars)
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className={isOverLimit ? "text-rose-600 font-semibold" : ""}>{charCount}</span>
            <span className="text-slate-400">/ {maxChars} max characters</span>
          </div>
        </div>
      </div>

      {/* Optional Context Accordion */}
      <div className="border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => setShowOptionalContext(!showOptionalContext)}
          className="flex items-center justify-between w-full text-xs font-medium text-slate-600 hover:text-slate-900 py-1"
        >
          <span className="flex items-center gap-1.5">
            <span>Optional Seller Context (tools, target audience, specific constraints)</span>
            <span className="text-[11px] text-slate-400 font-normal">(not required)</span>
          </span>
          {showOptionalContext ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showOptionalContext && (
          <div className="mt-3 animate-in fade-in duration-200">
            <textarea
              rows={2}
              disabled={isLoading}
              value={optionalContext}
              onChange={(e) => onOptionalContextChange(e.target.value)}
              placeholder="e.g., I build with React 19 and Tailwind; I don't provide backend hosting; target audience is SaaS founders."
              className="w-full p-3 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Researches live market listings & evaluates buyer expectations</span>
        </div>

        <Button
          type="button"
          size="lg"
          disabled={isTooShort || isLoading}
          isLoading={isLoading}
          onClick={onSubmit}
          className="w-full sm:w-auto min-w-[200px]"
        >
          <span>Research & Optimize</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
};
