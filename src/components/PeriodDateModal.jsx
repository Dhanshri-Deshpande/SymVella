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
  const { isPeriodModalOpen, setIsPeriodModalOpen, addPeriodEntry, userProfile } = useApp();

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
              <h3 className="text-lg font-bold text-gray-900">Log Period Dates & Cycle Info</h3>
              <p className="text-xs text-gray-500">Record your latest menstrual dates to update your cycle graph</p>
            </div>
          </div>
          <button
            onClick={() => setIsPeriodModalOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
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
                Period Start Date 🩸
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
                Period End Date ✨
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
            <label className="font-semibold text-gray-700 block">Overall Flow Intensity:</label>
            <div className="grid grid-cols-4 gap-2">
              {["Spotting", "Light", "Normal", "Heavy"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFlow(f)}
                  className={`py-2 px-1 rounded-xl border text-center font-medium transition-all ${
                    flow === f
                      ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold shadow-2xs"
                      : "border-gray-200 bg-white text-gray-600 hover:border-pink-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Cramp / Pain Severity */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700 block">Peak Pain / Cramp Severity:</label>
            <div className="grid grid-cols-4 gap-2">
              {["None", "Mild", "Moderate", "Severe"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPainLevel(p)}
                  className={`py-2 px-1 rounded-xl border text-center font-medium transition-all ${
                    painLevel === p
                      ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold shadow-2xs"
                      : "border-gray-200 bg-white text-gray-600 hover:border-pink-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Input */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-700 block">Personal Notes / Symptoms:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Started 2 days late, mild pelvic cramping on Day 1..."
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
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[var(--color-primary)] hover:opacity-95 text-white font-bold shadow-sm transition-transform active:scale-95"
            >
              Save Period Entry ✨
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
