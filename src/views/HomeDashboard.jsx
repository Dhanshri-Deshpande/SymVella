import React from "react";
import { useApp } from "../context/AppContext";
import { 
  Sparkles, 
  Flame, 
  Volume2, 
  ArrowRight, 
  BrainCircuit, 
  ChevronRight,
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

export default function HomeDashboard() {
  const { 
    userProfile, 
    symptomLogs, 
    periodHistory,
    setIsCheckInOpen, 
    setActiveTab, 
    speakText, 
    language,
    setIsChatOpen,
    setIsDailyReportOpen,
    setIsPeriodModalOpen
  } = useApp();

  const recentLog = symptomLogs[symptomLogs.length - 1];
  const cycleDay = recentLog?.cycleDay || 21;

  const triggerStreakCelebration = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#965293', '#EE9FE1', '#748DE3', '#3B2E58']
    });
  };

  const dailyTip = {
    title: "Gentle Magnesium & Hydration Boost",
    description: "In the late luteal phase, progesterone declines. A warm cup of chamomile tea or roasted pumpkin seeds helps relieve muscle tension and promote restorative sleep.",
    audioText: "Today's tip: You are in your late luteal phase. A warm cup of chamomile tea and roasted pumpkin seeds helps relieve muscle tension."
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> SakhiAI Daily Companion
              </span>
              <button 
                onClick={triggerStreakCelebration}
                className="px-3 py-1 rounded-full bg-amber-400/30 text-amber-200 border border-amber-300/40 text-xs font-bold flex items-center gap-1 hover:bg-amber-400/40 transition-colors"
              >
                <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> 14-Day Streak
              </button>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
              Namaste, {userProfile.name} 🌸
            </h2>
            <p className="text-pink-100/90 text-sm max-w-lg leading-relaxed">
              Your body is currently in the <strong>Late Luteal Phase</strong> (Day {cycleDay} of {userProfile.cycleLength}). Today's check-in takes only 90 seconds.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                onClick={() => setIsCheckInOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-white text-[var(--color-primary-dark)] font-bold text-sm shadow-md hover:bg-pink-50 active:scale-95 transition-all flex items-center gap-2"
              >
                Start 1-Min Check-in <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsDailyReportOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-medium text-sm border border-white/20 transition-all flex items-center gap-2"
              >
                <Leaf className="w-4 h-4 text-emerald-300" /> Today's Gharelu Upay
              </button>
            </div>
          </div>

          {/* Cycle Intelligence Ring */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 flex flex-col items-center text-center shrink-0 w-full md:w-56">
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
                  strokeDashoffset={251.2 * (1 - cycleDay / userProfile.cycleLength)} 
                  strokeLinecap="round" 
                  fill="transparent" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black">Day {cycleDay}</span>
                <span className="text-[10px] text-pink-200 uppercase font-medium">of {userProfile.cycleLength}</span>
              </div>
            </div>
            <p className="text-xs font-semibold text-white">Next Period in ~6 Days</p>
            <p className="text-[11px] text-pink-200">Predicted: Nov 1, 2026</p>
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
                Menstrual Timeline
              </span>
              <span className="text-xs text-gray-400 font-mono">From Starting to Till Date</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-rose-500 fill-rose-500" />
              Period Dates & Cycle Length History
            </h3>
            <p className="text-xs text-gray-500">
              Track cycle length variations, past dates, and ovulation patterns over time
            </p>
          </div>

          <button
            onClick={() => setIsPeriodModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[var(--color-primary)] hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Log Period Dates
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
                label={{ value: "Days", angle: -90, position: "insideLeft", fill: "#999", fontSize: 10 }}
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
              <ReferenceLine y={28} stroke="#EE9FE1" strokeDasharray="3 3" label={{ value: "Standard 28d", fill: "#965293", fontSize: 10, position: "insideTopRight" }} />
              <ReferenceLine y={35} stroke="#E83674" strokeDasharray="2 2" label={{ value: "Irregularity Limit (35d)", fill: "#E83674", fontSize: 10, position: "insideTopRight" }} />
              <Bar dataKey="cycleLength" name="Cycle Length (Days)" radius={[8, 8, 0, 0]}>
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
              <span className="w-3 h-3 rounded-md bg-[#965293]" /> Normal Cycle (28-34d)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#3B2E58]" /> Delayed Cycle (35d+)
            </span>
          </div>
          <span className="text-[11px] font-medium text-[var(--color-primary)]">
            Tap "+ Log Period Dates" to add your next cycle dates anytime.
          </span>
        </div>
      </div>

      {/* Grid: Daily Tip + Explainable AI Alert preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Daily Personalized Wellness Tip */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1.5 border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5" /> Daily Science-Backed Tip
              </span>
              <button
                onClick={() => speakText(dailyTip.audioText, language)}
                className="p-1.5 rounded-xl bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                title="Listen to audio explainer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">{dailyTip.title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{dailyTip.description}</p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Reviewed by Clinical Nutritionist</span>
            <button 
              onClick={() => setActiveTab("info")} 
              className="font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-0.5"
            >
              Browse Info Hub <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Explainable AI Pattern Screening Highlight */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--color-badge-bg)] text-[var(--color-primary)] flex items-center gap-1.5 border border-[var(--color-border)]">
                <BrainCircuit className="w-3.5 h-3.5" /> Explainable AI (XAI)
              </span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Moderate Risk Pattern
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Ovulatory / PCOS Pattern Screening
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Cycle length fluctuated by <strong>±11 days</strong> with recurring luteal acne and fatigue spikes.
            </p>

            {/* Quick XAI Factor Bar Preview */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[11px] text-gray-500">
                <span>Cycle Length Variance (Top Driver)</span>
                <span className="font-semibold text-[var(--color-primary)]">+42% weight</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="bg-[var(--color-primary)] h-2 rounded-full" style={{ width: "42%" }} />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Confidence: High (30 Days Logged)</span>
            <button
              onClick={() => setActiveTab("xai")}
              className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1"
            >
              View Full SHAP Analysis <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
