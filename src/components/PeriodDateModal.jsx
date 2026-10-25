import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Calendar, 
  Droplet, 
  X, 
  Check, 
  Sparkles, 
  AlertCircle,
  Activity
} from "lucide-react";
import confetti from "canvas-confetti";

export default function PeriodDateModal() {
  const { isPeriodModalOpen, setIsPeriodModalOpen, addPeriodEntry, userProfile, t } = useApp();

  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [flow, setFlow] = useState("Normal");
  const [painLevel, setPainLevel] = useState("Mild");
  const [notes, setNotes] = useState("");

  if (!isPeriodModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    addPeriodEntry({
      startDate,
      endDate,
      flow,
      painLevel,
      notes: notes || "Logged period dates"
    });

    setIsPeriodModalOpen(false);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#965293', '#EE9FE1', '#748DE3', '#3B2E58']
    });
  };

  const flowOptions = [
    { key: "Spotting", label: t("period_modal.flow_spotting", "Spotting") },
    { key: "Light", label: t("period_modal.flow_light", "Light") },
    { key: "Normal", label: t("period_modal.flow_medium", "Normal") },
    { key: "Heavy", label: t("period_modal.flow_heavy", "Heavy") }
  ];

  const painOptions = [
    { key: "None", label: t("period_modal.pain_none", "None") },
    { key: "Mild", label: t("period_modal.pain_mild", "Mild") },
    { key: "Moderate", label: t("period_modal.pain_moderate", "Moderate") },
    { key: "Severe", label: t("period_modal.pain_severe", "Severe") }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-[var(--color-border)] animate-in fade-in zoom-in duration-200 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-badge-bg)] text-[var(--color-primary)] flex items-center justify-center shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{t("period_modal.title", "Log Period Dates & Cycle Info")}</h3>
              <p className="text-xs text-gray-500">{t("period_modal.subtitle", "Record your latest menstrual dates to update your cycle graph")}</p>
            </div>
          </div>
          <button
            onClick={() => setIsPeriodModalOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 my-4 text-xs">
          
          {/* Start and End Date Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700 block">
                {t("period_modal.start_date", "Period Starting Date")} 🩸
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3 py-2 text-xs font-mono font-medium text-gray-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700 block">
                {t("period_modal.end_date", "Period Ending Date")} ✨
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3 py-2 text-xs font-mono font-medium text-gray-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Flow Level Selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700 block">{t("period_modal.flow_label", "Overall Flow Intensity")}:</label>
            <div className="grid grid-cols-4 gap-2">
              {flowOptions.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFlow(f.key)}
                  className={`py-2 px-1 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                    flow === f.key
                      ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold shadow-2xs"
                      : "border-gray-200 bg-white text-gray-600 hover:border-pink-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cramp / Pain Severity */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700 block">{t("period_modal.pain_label", "Pain & Discomfort")}:</label>
            <div className="grid grid-cols-4 gap-2">
              {painOptions.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPainLevel(p.key)}
                  className={`py-2 px-1 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                    painLevel === p.key
                      ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold shadow-2xs"
                      : "border-gray-200 bg-white text-gray-600 hover:border-pink-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Input */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-700 block">{t("period_modal.notes_label", "Personal Notes / Symptoms")}:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("period_modal.notes_placeholder", "e.g. Started 2 days late, mild pelvic cramping...")}
              className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none"
            />
          </div>

          {/* Informational Hint */}
          <div className="p-3 bg-purple-50 rounded-2xl border border-[var(--color-border)] text-[11px] text-[var(--color-primary-dark)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
            <span>Symvella will automatically recalculate cycle length, regularity status, and update your home timeline graph.</span>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPeriodModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 cursor-pointer"
            >
              {t("period_modal.cancel_btn", "Cancel")}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[var(--color-primary)] hover:opacity-95 text-white font-bold shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              {t("period_modal.save_btn", "Save Period Dates")} ✨
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
