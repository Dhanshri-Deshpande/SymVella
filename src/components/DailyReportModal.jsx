import React from "react";
import { useApp } from "../context/AppContext";
import { 
  Sparkles, 
  Volume2, 
  X, 
  Lightbulb, 
  Leaf, 
  ShieldAlert,
  BrainCircuit,
  Clock,
  CheckCircle2,
  Activity
} from "lucide-react";

export default function DailyReportModal({ reportData, isOpen, onClose }) {
  const { speakText, language, setIsSOSOpen } = useApp();

  if (!isOpen || !reportData) return null;

  const { date, reasons, upayList, isRedFlag, mlMetrics } = reportData;

  const audioSummary = reasons.join(". ") + ". ML model recommended home remedies: " + 
    upayList.map(u => `${u.title}: ${u.desc}`).join(". ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-[var(--color-border)] animate-in fade-in zoom-in duration-200 my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-badge-bg)] text-[var(--color-primary)] flex items-center justify-center shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-[var(--color-primary)] uppercase tracking-wide flex items-center gap-1">
                  <BrainCircuit className="w-3 h-3" />
                  ML Daily Clinical Report
                </span>
                <span className="text-xs text-gray-400 font-mono">{date}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">
                Today's Health Insight & Gharelu Upay 🌸
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Alert if Heavy Bleeding or Red Flag */}
        {isRedFlag && (
          <div className="my-4 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-xs text-rose-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-800">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Urgent Medical Attention Notice:</span>
            </div>
            <p>
              Your logged symptoms indicate unusually severe bleeding (soaking multiple pads per hour) or critical pain VAS. Please contact your physician or visit the nearest clinic.
            </p>
            <button
              onClick={() => {
                onClose();
                setIsSOSOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors"
            >
              Open Emergency SOS
            </button>
          </div>
        )}

        {/* 1. Underlying Reasons Section (Why this happens - Explainable AI) */}
        <div className="my-4 p-4 rounded-2xl bg-[var(--color-bg-soft)] border border-[var(--color-border)] space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              {language === "hi" ? "ML मॉडल विश्लेषण व कारण" : "Unified ML Analysis & Root Drivers"}
            </h4>
            <button
              onClick={() => speakText(audioSummary, language)}
              className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-[var(--color-primary)] text-xs font-medium flex items-center gap-1 shadow-2xs hover:bg-gray-50 transition-colors"
              title="Listen to audio explainer"
            >
              <Volume2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>Listen</span>
            </button>
          </div>
          <ul className="space-y-2 pt-1">
            {reasons.map((r, idx) => (
              <li key={idx} className="text-xs text-gray-700 leading-relaxed flex items-start gap-2">
                <span className="text-[var(--color-primary)] font-bold mt-0.5">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Gharelu Upay Section (Predicted strictly by ML Model) */}
        <div className="space-y-3 my-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-600" />
              {language === "hi" ? "ML द्वारा अनुशंसित प्रमाणित घरेलू उपाय" : "ML-Predicted Gharelu Upay & Holistic Care"}
            </h4>
            <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
              <Activity className="w-3 h-3 text-[var(--color-primary)]" />
              Tree-SHAP Ranked
            </span>
          </div>

          <div className="space-y-3">
            {upayList.map((upay, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-[var(--color-primary)] shadow-xs transition-all space-y-2 hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-gray-900 text-xs sm:text-sm">
                      {upay.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
                    <BrainCircuit className="w-3 h-3 text-emerald-600" />
                    {upay.matchScore}% ML Match
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {upay.desc}
                </p>

                {/* Preparation & Dosage details */}
                {upay.preparation && (
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-100">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{upay.preparation}</span>
                  </div>
                )}

                {/* Explainable AI attribution pill */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100">
                  <span className="text-[10px] bg-purple-50 text-[var(--color-primary)] px-2 py-0.5 rounded-md border border-purple-200 font-medium flex items-center gap-1">
                    <span>🎯</span>
                    <span>{upay.shapExplanation}</span>
                    {upay.accuracy && (
                      <span className="text-gray-400">({upay.accuracy}% model acc)</span>
                    )}
                  </span>
                  <span className="text-[10px] text-gray-400 italic">
                    {upay.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-[11px] text-gray-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Saved to your daily health history.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-[var(--color-primary)] hover:opacity-95 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Got it, Thank you ✨
          </button>
        </div>

      </div>
    </div>
  );
}
