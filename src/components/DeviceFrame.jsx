import React from "react";
import { useApp } from "../context/AppContext";
import { Wifi, Battery, Signal, Smartphone } from "lucide-react";

export default function DeviceFrame({ children }) {
  const { isPhoneFrame, setIsPhoneFrame } = useApp();

  if (!isPhoneFrame) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-soft)] text-[var(--color-text-main)] transition-colors duration-300">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-24">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-4 flex flex-col items-center justify-center transition-colors">
      
      {/* Device Frame Top Control Bar */}
      <div className="mb-4 flex items-center justify-between w-full max-w-sm text-xs text-slate-300 no-print">
        <span className="flex items-center gap-1.5 font-medium">
          <Smartphone className="w-4 h-4 text-pink-400" /> Mobile Preview Mockup
        </span>
        <button
          onClick={() => setIsPhoneFrame(false)}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-[11px] transition-colors"
        >
          Exit to Fullscreen
        </button>
      </div>

      {/* Realistic Smartphone Shell */}
      <div className="relative w-full max-w-[420px] h-[860px] bg-black rounded-[52px] p-3 shadow-2xl ring-12 ring-slate-800/80 border-4 border-slate-700/60 overflow-hidden flex flex-col">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
        </div>

        {/* Mobile Status Bar */}
        <div className="h-9 px-6 pt-1 flex items-center justify-between text-[11px] font-bold text-gray-800 bg-white/95 shrink-0 z-40 select-none">
          <span>09:41</span>
          <div className="flex items-center gap-1.5 text-gray-700">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Scrollable Mobile Screen Content */}
        <div className="flex-1 overflow-y-auto bg-[var(--color-bg-soft)] rounded-b-[40px] text-[var(--color-text-main)] scroll-smooth relative">
          <div className="p-4 pb-24">
            {children}
          </div>
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-400 rounded-full pointer-events-none z-50" />
      </div>

    </div>
  );
}
