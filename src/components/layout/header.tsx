"use client";

import React, { useState } from "react";
import { Sparkles, BookOpen, ShieldCheck } from "lucide-react";
import { MethodologyModal } from "./methodology-modal";

export const Header: React.FC = () => {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Descriptor */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-sm shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900">GigScope AI</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Pre-Publish
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-500 -mt-0.5">
                Fiverr Gig Research & Pre-Publication Content Intelligence
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Methodology</span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 pl-3 border-l border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Seller-Truth Protected</span>
            </div>
          </div>
        </div>
      </header>

      <MethodologyModal isOpen={isMethodologyOpen} onClose={() => setIsMethodologyOpen(false)} />
    </>
  );
};
