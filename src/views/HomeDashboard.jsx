import React from "react";
import { useApp } from "../context/AppContext";
import { 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Leaf,
  Droplet,
  Plus
} from "lucide-react";
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine, 
  Cell 
} from "recharts";
import confetti from "canvas-confetti";
import { calculateCycleStatus } from "../data/cycleCalculator";

export default function HomeDashboard() {
  const { 
    userProfile, 
    currentUser,
    symptomLogs, 
    periodHistory,
    setIsCheckInOpen, 
    setActiveTab, 
    speakText, 
    language,
    setIsChatOpen,
    setIsDailyReportOpen,
    setIsPeriodModalOpen,
    t
  } = useApp();

  const displayName = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ").trim() 
    || currentUser?.name
    || userProfile?.name 
    || "Friend";

  // Derive dynamic cycle metrics from last logged period and user settings
  const lastPeriodStartDate = periodHistory && periodHistory.length > 0 
    ? periodHistory[periodHistory.length - 1].startDate 
    : (userProfile?.lastPeriodDate || "2026-10-04");

  const cycleStatus = calculateCycleStatus(
    lastPeriodStartDate, 
    userProfile?.cycleLength || 32, 
    userProfile?.periodDuration || 5
  );

  const {
    cycleDay,
    cycleLength,
    daysUntilNext,
    predictedNextPeriodFormatted,
    phaseName,
    phaseDesc
  } = cycleStatus;

  const triggerStreakCelebration = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#965293', '#EE9FE1', '#748DE3', '#3B2E58']
    });
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> {t("home.companion_badge", "Symvella Daily Companion")}
              </span>
              <button 
                onClick={triggerStreakCelebration}
                className="px-3 py-1 rounded-full bg-amber-400/30 text-amber-200 border border-amber-300/40 text-xs font-bold flex items-center gap-1 hover:bg-amber-400/40 transition-colors"
              >
                <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> {t("home.streak", "14-Day Streak")}
              </button>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
              {t("home.greeting", "Namaste")}, {displayName} 🌸
            </h2>
            <p className="text-pink-100/90 text-sm max-w-lg leading-relaxed">
              {t("home.status_lead", "Your body is currently in the")} <strong>{phaseName}</strong> ({t("home.day_count", { day: cycleDay, total: cycleLength })}). {phaseDesc}
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                onClick={() => setIsCheckInOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-white text-[var(--color-primary-dark)] font-bold text-sm shadow-md hover:bg-pink-50 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                {t("home.start_checkin", "Start 1-Min Check-in")} <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsDailyReportOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-medium text-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Leaf className="w-4 h-4 text-emerald-300" /> {t("home.todays_remedies", "Today's Gharelu Upay")}
              </button>
            </div>
          </div>

          {/* Cycle Intelligence Ring - Clickable to view or adjust cycle dates */}
          <div 
            onClick={() => setIsPeriodModalOpen(true)}
            className="bg-white/10 hover:bg-white/15 cursor-pointer transition-all backdrop-blur-md border border-white/20 rounded-3xl p-5 flex flex-col items-center text-center shrink-0 w-full md:w-56 group"
            title="Click to adjust cycle day or log period dates"
          >
            <div className="relative w-28 h-28 flex items-center justify-center mb-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="#EE9FE1" 
                  strokeWidth="8" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 * (1 - Math.min(1, cycleDay / cycleLength))} 
                  strokeLinecap="round" 
                  fill="transparent" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black">Day {cycleDay}</span>
                <span className="text-[10px] text-pink-200 uppercase font-medium">of {cycleLength}</span>
              </div>
            </div>
            <p className="text-xs font-semibold text-white">
              {t("home.next_period", "Next Period in")} ~{daysUntilNext} {t("home.days_unit", "Days")}
            </p>
            <p className="text-[11px] text-pink-200">Predicted: {predictedNextPeriodFormatted}</p>
            <span className="mt-2 text-[10px] bg-white/20 group-hover:bg-white/30 text-white px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 font-medium">
              ✏️ Tap to adjust day
            </span>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* PERIOD DATES & CYCLE HISTORY GRAPH (Prominently Placed on Home Page as requested) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[var(--color-border)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] uppercase">
                {t("home.timeline_badge", "Menstrual Timeline")}
              </span>
              <span className="text-xs text-gray-400 font-mono">{t("home.timeline_sub", "From Starting to Till Date")}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-rose-500 fill-rose-500" />
              {t("home.timeline_title", "Period Dates & Cycle History")}
            </h3>
            <p className="text-xs text-gray-500">
              {t("home.timeline_desc", "Track cycle length variations, past dates, and ovulation patterns over time")}
            </p>
          </div>

          <button
            onClick={() => setIsPeriodModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[var(--color-primary)] hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {t("home.log_period_btn", "+ Log Period Dates")}
          </button>
        </div>

        {/* Recharts Timeline Graph */}
        <div className="h-68 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={periodHistory} margin={{ top: 20, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0eaf4" />
              <XAxis 
                dataKey="displayRange" 
                tick={{ fontSize: 11, fill: "#69577D" }}
                angle={-15}
                textAnchor="end"
              />
              <YAxis 
                domain={[20, 42]} 
                tick={{ fontSize: 11, fill: "#69577D" }}
                label={{ value: t("home.days_unit", "Days"), angle: -90, position: "insideLeft", fill: "#999", fontSize: 10 }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3.5 rounded-2xl shadow-xl border border-[var(--color-border)] text-xs space-y-1">
                        <p className="font-bold text-[var(--color-primary-dark)] text-sm">{data.cycleNum} ({data.displayRange})</p>
                        <p className="text-gray-700">Cycle Length: <strong>{data.cycleLength} Days</strong></p>
                        <p className="text-gray-700">Bleeding Days: <strong>{data.bleedingDays} Days</strong></p>
                        <p className="text-gray-700">Flow: <strong>{data.flow}</strong></p>
                        <p className="text-rose-600 text-[11px] font-medium pt-0.5">"{data.notes}"</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={28} stroke="#EE9FE1" strokeDasharray="3 3" label={{ value: t("home.standard_label", "Standard 28d"), fill: "#965293", fontSize: 10, position: "insideTopRight" }} />
              <ReferenceLine y={35} stroke="#E83674" strokeDasharray="2 2" label={{ value: t("home.irregular_label", "Irregularity Limit (35d)"), fill: "#E83674", fontSize: 10, position: "insideTopRight" }} />
              <Bar dataKey="cycleLength" name={t("home.cycle_axis", "Cycle Length (Days)")} radius={[8, 8, 0, 0]}>
                {periodHistory.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.cycleLength > 34 ? "#3B2E58" : "#965293"} 
                  />
                ))}
              </Bar>
              <Line 
                type="monotone" 
                dataKey="cycleLength" 
                stroke="#748DE3" 
                strokeWidth={2.5} 
                dot={{ r: 4, fill: "#748DE3" }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Status Pill */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500 gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#965293]" /> {t("home.normal_cycle", "Normal Cycle (28-34d)")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#3B2E58]" /> {t("home.delayed_cycle", "Delayed Cycle (35d+)")}
            </span>
          </div>
          <span className="text-[11px] font-medium text-[var(--color-primary)]">
            {t("home.history_tip", 'Tap "+ Log Period Dates" to add your next cycle dates anytime.')}
          </span>
        </div>
      </div>

    </div>
  );
}
