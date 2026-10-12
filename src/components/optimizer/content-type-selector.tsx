import React from "react";
import { ContentType } from "@/types";
import { Heading, FileText, HelpCircle, CheckCircle2 } from "lucide-react";

interface ContentTypeSelectorProps {
  selected: ContentType;
  onChange: (type: ContentType) => void;
  disabled?: boolean;
}

export const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  selected,
  onChange,
  disabled = false,
}) => {
  const options = [
    {
      id: "title" as ContentType,
      title: "Gig Title",
      icon: Heading,
      badge: "Max 80 chars",
      description: "Optimize your 'I will...' title for buyer intent, natural search keywords, and zero truncation.",
    },
    {
      id: "description" as ContentType,
      title: "Gig Description",
      icon: FileText,
      badge: "Max 1,200 chars",
      description: "Structure your core offer, deliverables, process, and hook while eliminating generic filler.",
    },
    {
      id: "faqs" as ContentType,
      title: "FAQs",
      icon: HelpCircle,
      badge: "Max 300 chars / answer",
      description: "Formulate crisp answers addressing real pre-purchase hesitations and technical scope.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {options.map((opt) => {
        const isSelected = selected === opt.id;
        const Icon = opt.icon;

        return (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.id)}
            className={`relative p-5 rounded-xl text-left border transition-all flex flex-col justify-between ${
              isSelected
                ? "bg-emerald-50/40 border-emerald-500 shadow-sm ring-1 ring-emerald-500/30"
                : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/40"
            } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {opt.badge}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">{opt.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{opt.description}</p>
            </div>

            {isSelected && (
              <div className="mt-4 pt-3 border-t border-emerald-200/50 flex items-center justify-between text-[11px] text-emerald-700 font-medium">
                <span>Selected Mode</span>
                <span>{opt.badge}</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
