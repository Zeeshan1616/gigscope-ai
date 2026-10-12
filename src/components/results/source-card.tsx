import React from "react";
import { SourceRecord } from "@/types";
import { ExternalLink, Globe, Clock, ShieldCheck } from "lucide-react";

interface SourceCardProps {
  source: SourceRecord;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  const getSourceTypeBadge = (type: SourceRecord["sourceType"]) => {
    switch (type) {
      case "fiverr_listing":
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Fiverr Listing</span>;
      case "competitor_service":
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">Competitor Service</span>;
      case "buyer_discussion":
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">Buyer Discussion</span>;
      default:
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">Market Reference</span>;
    }
  };

  const formattedTime = new Date(source.retrievalTimestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-3">
      <div className="space-y-2">
        {/* Source metadata header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{source.domain}</span>
          </div>
          {getSourceTypeBadge(source.sourceType)}
        </div>

        {/* Title */}
        <h5 className="font-semibold text-slate-900 text-xs line-clamp-2 hover:text-emerald-700">
          <a href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1 group">
            <span>{source.title}</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 shrink-0 mt-0.5" />
          </a>
        </h5>

        {/* Snippet / observed excerpt */}
        <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
          {source.snippet}
        </p>
      </div>

      {/* Footer provenance */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>Retrieved {formattedTime}</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-700 font-medium">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Verified URL</span>
        </div>
      </div>
    </div>
  );
};
