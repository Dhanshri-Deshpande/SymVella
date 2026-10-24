import React from "react";
import { useApp } from "../context/AppContext";
import { 
  Sparkles, 
  Heart, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Lightbulb, 
  Leaf, 
  ShieldAlert,
  ArrowRight
} from "lucide-react";

export default function DailyReportModal({ reportData, isOpen, onClose }) {
  const { speakText, language, setIsSOSOpen } = useApp();

  if (!isOpen || !reportData) return null;

  const { date, reasons, upayList, isRedFlag } = reportData;

  const audioSummary = reasons.join(". ") + ". Recommended home care: " + upayList.map(u => u.title + ": " + u.desc).join(". ");

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
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-[var(--color-primary)] uppercase tracking-wide">
                  Daily Check-in Report
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
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
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
              Your logged symptoms indicate unusually severe bleeding (soaking multiple pads per hour). Please contact your physician or visit the nearest clinic.
            </p>
            <button
              onClick={() => {
                onClose();
                setIsSOSOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
            >
              Open Emergency SOS
            </button>
          </div>
        )}

        {/* 1. Underlying Reasons Section (Why this happens) */}
        <div className="my-4 p-4 rounded-2xl bg-[var(--color-bg-soft)] border border-[var(--color-border)] space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              {language === "hi" ? "संभावित कारण (Why You Feel This Way)" : "Possible Reasons (Biological & Lifestyle Factors)"}
            </h4>
            <button
              onClick={() => speakText(audioSummary, language)}
              className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-[var(--color-primary)] text-xs font-medium flex items-center gap-1 shadow-2xs"
              title="Listen to audio explainer"
            >
              <Volume2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>Listen</span>
            </button>
          </div>
          <ul className="space-y-1.5 pt-1">
            {reasons.map((r, idx) => (
              <li key={idx} className="text-xs text-gray-700 leading-relaxed flex items-start gap-2">
                <span className="text-[var(--color-primary)] font-bold mt-0.5">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Gharelu Upay Section (Home Remedies) */}
        <div className="space-y-3 my-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
            <Leaf className="w-4 h-4 text-emerald-600" />
            {language === "hi" ? "आज के प्रमाणित घरेलू उपाय (Gharelu Upay)" : "Targeted Home Remedies (Gharelu Upay & Holistic Care)"}
          </h4>

          <div className="space-y-2.5">
            {upayList.map((upay, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-[var(--color-primary)] shadow-xs transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-xs sm:text-sm">
                    {upay.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {upay.tag}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {upay.desc}
                </p>
                <span className="text-[10px] text-gray-400 block pt-0.5 italic">
                  Category: {upay.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            Saved to your daily health history.
          </span>
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
