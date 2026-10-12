import React from "react";
import { ShieldAlert } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white/70 mt-auto py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:space-y-0">
        <div className="space-y-1">
          <p className="font-semibold text-slate-700">GigScope AI — Research smarter. Write better. Launch with confidence.</p>
          <p className="text-[11px] text-slate-400">
            A pre-publication research and content intelligence assistant for freelance sellers.
          </p>
        </div>

        <div className="flex items-center justify-center sm:justify-end gap-2 text-[11px] text-slate-400 max-w-md text-right">
          <ShieldAlert className="w-4 h-4 shrink-0 text-slate-400" />
          <span>
            GigScope AI is an independent software tool. Not affiliated with, endorsed by, or sponsored by Fiverr International Ltd.
          </span>
        </div>
      </div>
    </footer>
  );
};
