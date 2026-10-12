import React, { useState } from "react";
import { OptimizationResult } from "@/types";
import { LayoutDashboard, Sparkles, Search, KeyRound, GitCompare, ShieldCheck } from "lucide-react";
import { OverviewPanel } from "./overview-panel";
import { OptimizedContentPanel } from "./optimized-content-panel";
import { MarketResearchPanel } from "./market-research-panel";
import { KeywordPanel } from "./keyword-panel";
import { ComparisonPanel } from "./comparison-panel";
import { ValidationPanel } from "./validation-panel";

interface ResultsLayoutProps {
  result: OptimizationResult;
  onReset: () => void;
}

type TabType = "overview" | "optimized" | "research" | "keywords" | "comparison" | "validation";

export const ResultsLayout: React.FC<ResultsLayoutProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<TabType>("optimized");

  const tabs: Array<{ id: TabType; label: string; icon: React.ElementType; badge?: string | number }> = [
    { id: "optimized", label: "Optimized Content", icon: Sparkles, badge: "Editable" },
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "research", label: "Market Research", icon: Search, badge: result.sources.length },
    { id: "keywords", label: "Keywords", icon: KeyRound, badge: result.keywords.length },
    { id: "comparison", label: "Before & After", icon: GitCompare },
    { id: "validation", label: "Validation", icon: ShieldCheck, badge: `${result.qualityScore.overallScore}/100` },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all select-none ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-slate-800 text-emerald-400" : "bg-slate-200/80 text-slate-600"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={onReset}
          className="text-xs font-medium text-slate-500 hover:text-emerald-700 hover:underline shrink-0"
        >
          &larr; Optimize Another Draft
        </button>
      </div>

      {/* Tab Content Panels */}
      <div>
        {activeTab === "overview" && (
          <OverviewPanel result={result} onNavigateToContent={() => setActiveTab("optimized")} />
        )}
        {activeTab === "optimized" && <OptimizedContentPanel result={result} />}
        {activeTab === "research" && <MarketResearchPanel result={result} />}
        {activeTab === "keywords" && <KeywordPanel result={result} />}
        {activeTab === "comparison" && <ComparisonPanel result={result} />}
        {activeTab === "validation" && <ValidationPanel result={result} />}
      </div>
    </div>
  );
};
