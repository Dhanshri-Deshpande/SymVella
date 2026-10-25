import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Calendar, 
  Droplet, 
  X, 
  Check, 
  Sparkles, 
  AlertCircle,
  Activity,
  Clock,
  ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";
import { calculateCycleStatus, getStartDateForCycleDay } from "../data/cycleCalculator";

export default function PeriodDateModal() {
  const { isPeriodModalOpen, setIsPeriodModalOpen, addPeriodEntry, userProfile, t } = useApp();

  const [startDate, setStartDate] = useState(userProfile?.lastPeriodDate || "2026-10-04");
  const [endDate, setEndDate] = useState("2026-10-09");
  const [flow, setFlow] = useState("Normal");
  const [painLevel, setPainLevel] = useState("Mild");
  const [notes, setNotes] = useState("");

  // Sync state whenever modal opens or userProfile changes
  useEffect(() => {
    if (isPeriodModalOpen) {
      const initialStart = userProfile?.lastPeriodDate || "2026-10-04";
      setStartDate(initialStart);
      const dur = userProfile?.periodDuration || 5;
      try {
        const parts = initialStart.split("-").map(Number);
        const d = new Date(parts[0], parts[1] - 1, parts[2] + dur);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const dt = String(d.getDate()).padStart(2, "0");
        setEndDate(`${y}-${m}-${dt}`);
      } catch (e) {
        setEndDate(initialStart);
      }
    }
  }, [isPeriodModalOpen, userProfile?.lastPeriodDate, userProfile?.periodDuration]);

  // Calculate live dynamic cycle status preview
  const cycleStatus = calculateCycleStatus(
    startDate,
    userProfile?.cycleLength || 32,
    userProfile?.periodDuration || 5
  );

  if (!isPeriodModalOpen) return null;

  const handleQuickDaySelect = (dayNum) => {
    const newStart = getStartDateForCycleDay(dayNum);
    setStartDate(newStart);
    const dur = userProfile?.periodDuration || 5;
    try {
      const parts = newStart.split("-").map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2] + dur);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dt = String(d.getDate()).padStart(2, "0");
      setEndDate(`${y}-${m}-${dt}`);
    } catch (e) {}
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    addPeriodEntry({
      startDate,
      endDate,
      flow,
      painLevel,
      notes: notes || "Logged period dates",
      cycleLength: userProfile?.cycleLength || 32
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

  const quickDays = [
    { day: 1, label: "Day 1 (Period)", tag: "Period start" },
    { day: 7, label: "Day 7 (Follicular)", tag: "Energy boost" },
    { day: 14, label: "Day 14 (Ovulation)", tag: "Peak fertility" },
    { day: 21, label: "Day 21 (Luteal)", tag: "Progesterone" },
    { day: 28, label: "Day 28 (Late Luteal)", tag: "Pre-menstrual" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-2 border-[var(--color-border)] animate-in fade-in zoom-in duration-200 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-badge-bg)] text-[var(--color-primary)] flex items-center justify-center shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">{t("period_modal.title", "Log Period Dates & Cycle Info")}</h3>
              <p className="text-xs text-gray-500">{t("period_modal.subtitle", "Adjust dates or jump to any day to update your cycle ring immediately")}</p>
            </div>
          </div>
          <button
            onClick={() => setIsPeriodModalOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Dynamic Cycle Status Card */}
        <div className="mt-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border border-purple-200 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-purple-200 flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider leading-none">DAY</span>
                <span className="text-lg font-extrabold text-purple-900 leading-tight">{cycleStatus.cycleDay}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-900">{cycleStatus.phaseName}</span>
                  <span className="text-[10px] bg-purple-200 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                    of {cycleStatus.cycleLength} Days
                  </span>
                </div>
                <p className="text-[11px] text-purple-700 font-medium mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-purple-500 inline shrink-0" />
                  Next period in <strong>~{cycleStatus.daysUntilNext} days</strong> ({cycleStatus.predictedNextPeriodFormatted})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Day Selector Buttons */}
        <div className="mt-3.5 space-y-1.5">
          <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
            <span>⚡ Set Current Cycle Day Today:</span>
            <span className="text-[11px] font-normal text-purple-700">Tap to test or set today's day</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {quickDays.map((q) => (
              <button
                key={q.day}
                type="button"
                onClick={() => handleQuickDaySelect(q.day)}
                className={`py-2 px-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col ${
                  cycleStatus.cycleDay === q.day
                    ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] shadow-xs ring-1 ring-[var(--color-primary)]"
                    : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/40 text-gray-700"
                }`}
              >
                <span className="text-xs font-bold text-gray-900">{q.label}</span>
                <span className="text-[10px] text-gray-500 font-medium">{q.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 mt-3 text-xs">
          
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
            <span>Symvella will instantly update the Home Ring, predicted period date, and phase timeline.</span>
          </div>

          {/* Form Actions */}
          <div className="pt-2.5 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPeriodModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 cursor-pointer"
            >
              {t("period_modal.cancel_btn", "Cancel")}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[var(--color-primary)] hover:opacity-95 text-white font-bold shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>{t("period_modal.save_btn", "Save & Apply Changes")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
