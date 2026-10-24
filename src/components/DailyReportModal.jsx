import React, { useState } from "react";
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
  Activity,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  ShieldCheck,
  Stethoscope
} from "lucide-react";

export default function DailyReportModal({ reportData, isOpen, onClose }) {
  const { speakText, language, setIsSOSOpen } = useApp();
  const [showBiomarkerDetails, setShowBiomarkerDetails] = useState(false);

  if (!isOpen || !reportData) return null;

  const { date, reasons, upayList, isRedFlag, mlMetrics } = reportData;

  const audioSummary = reasons.join(". ") + ". Recommended therapeutic home care: " + 
    upayList.map(u => `${u.title}: ${u.desc}`).join(". ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-[var(--color-border)] animate-in fade-in zoom-in duration-200 my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Symvella" 
              className="w-12 h-12 rounded-2xl object-cover bg-white shadow-xs border border-purple-100" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-[var(--color-primary)] uppercase tracking-wide flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[var(--color-primary)]" />
                  Symvella Clinical Summary
                </span>
                <span className="text-xs text-gray-400 font-mono">{date}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">
                {language === "hi" ? "दैनिक स्वास्थ्य रिपोर्ट व उपचार परामर्श 🌸" : "Daily Health Findings & Care Guidance 🌸"}
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

        {/* Emergency Alert if Critical Symptoms Noted */}
        {isRedFlag && (
          <div className="my-4 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-xs text-rose-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-800">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Urgent Medical Consultation Notice:</span>
            </div>
            <p>
              Reported symptoms indicate severe bleeding volume (soaking multiple pads per hour) or elevated pain intensity. Prompt clinical evaluation by a healthcare provider is strongly advised.
            </p>
            <button
              onClick={() => {
                onClose();
                setIsSOSOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-xs"
            >
              Open Emergency SOS
            </button>
          </div>
        )}

        {/* 1. Clinical Findings & Physiological Indicators */}
        <div className="my-4 p-4 rounded-2xl bg-[var(--color-bg-soft)] border border-[var(--color-border)] space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[var(--color-primary)]" />
              {language === "hi" ? "नैदानिक निष्कर्ष व शारीरिक संकेतक" : "Clinical Findings & Physiological Indicators"}
            </h4>
            <button
              onClick={() => speakText(audioSummary, language)}
              className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-[var(--color-primary)] text-xs font-medium flex items-center gap-1 shadow-2xs hover:bg-gray-50 transition-colors"
              title="Listen to clinical summary"
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

        {/* 2. Contributing Biomarkers & Risk Stratification */}
        <div className="my-4 p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Contributing Biomarkers & Clinical Severity
              </span>
            </div>
            <button
              onClick={() => setShowBiomarkerDetails(!showBiomarkerDetails)}
              className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
            >
              <span>{showBiomarkerDetails ? "Hide Details" : "View Biomarker Impact"}</span>
              {showBiomarkerDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Clinical Severity Gauges */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100">
              <span className="text-[10px] text-gray-500 block font-medium">Pelvic Discomfort</span>
              <span className="font-bold text-[var(--color-primary)] font-mono text-sm">{mlMetrics?.dysmenorrheaScore || 0}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100">
              <span className="text-[10px] text-gray-500 block font-medium">Ferritin Depletion</span>
              <span className="font-bold text-rose-700 font-mono text-sm">{mlMetrics?.anemiaScore || 0}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-[10px] text-gray-500 block font-medium">Clinical Triage</span>
              <span className="font-bold text-emerald-700 font-mono text-sm">{mlMetrics?.triageScore || 0}%</span>
            </div>
          </div>

          {/* Collapsible Biomarker Factor Breakdown */}
          {showBiomarkerDetails && mlMetrics?.shapFactors && (
            <div className="space-y-2 pt-2 border-t border-gray-100 animate-in fade-in">
              <span className="text-[11px] text-gray-500 font-medium block">
                Relative physiological impact of today's reported parameters:
              </span>
              {mlMetrics.shapFactors.map((sf, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-gray-800">{sf.feature}</span>
                    <span className="font-mono text-[var(--color-primary)] font-bold">+{sf.weight}% clinical weight</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[var(--color-primary)] h-1.5 rounded-full" 
                      style={{ width: `${Math.min(100, sf.weight * 2)}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Preventive Clinical Guidance */}
          {mlMetrics?.counterfactual && (
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[11px] uppercase tracking-wide block text-amber-900">
                  Preventive Clinical Guidance:
                </span>
                <p className="mt-0.5 text-xs text-amber-900 leading-relaxed font-medium">
                  {mlMetrics.counterfactual}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3. Evidence-Based Home Remedies & Holistic Care */}
        <div className="space-y-3 my-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-600" />
              {language === "hi" ? "प्रमाणित घरेलू देखभाल व समग्र उपचार" : "Targeted Home Care & Holistic Regimens"}
            </h4>
            <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1 bg-gray-100 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Clinically Stratified
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
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {upay.matchScore}% Clinical Concordance
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {upay.desc}
                </p>

                {/* Preparation & Administration Timing */}
                {upay.preparation && (
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-100">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{upay.preparation}</span>
                  </div>
                )}

                {/* Clinical Indication Footnote */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100">
                  <span className="text-[10px] bg-purple-50 text-[var(--color-primary)] px-2 py-0.5 rounded-md border border-purple-200 font-medium flex items-center gap-1">
                    <span>🎯</span>
                    <span>{upay.shapExplanation}</span>
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
            <span>Recorded to your private longitudinal medical history.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-[var(--color-primary)] hover:opacity-95 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
