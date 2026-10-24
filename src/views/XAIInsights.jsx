import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { analyzeHealthPatterns, simulateDigitalTwin } from "../data/xaiEngine";
import { 
  BrainCircuit, 
  HelpCircle, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  Info,
  CheckCircle2,
  AlertTriangle,
  Lightbulb
} from "lucide-react";

export default function XAIInsights() {
  const { symptomLogs, userProfile, setActiveTab } = useApp();

  const { patterns, digitalTwin } = analyzeHealthPatterns(symptomLogs, userProfile);
  const [selectedPattern, setSelectedPattern] = useState(patterns[0]);

  // "What-if" Simulator States
  const [simSleep, setSimSleep] = useState(8);
  const [simStress, setSimStress] = useState(4);
  const [simExercise, setSimExercise] = useState(30);

  const simResult = simulateDigitalTwin({
    baseScore: selectedPattern.score,
    sleepHours: simSleep,
    stressLevel: simStress,
    exerciseMins: simExercise
  });

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[var(--color-border)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-badge-bg)] text-[var(--color-primary)] flex items-center justify-center shadow-xs">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">Explainable AI (XAI) Health Engine</h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  SHAP Attribution
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Transparent feature weights, confidence metrics & clinical guideline references
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("reports")}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 text-xs font-semibold self-start sm:self-auto flex items-center gap-1.5 shadow-sm"
          >
            Export Clinical PDF <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pattern Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {patterns.map((p) => {
          const isSelected = selectedPattern.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPattern(p)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? "border-[var(--color-primary)] bg-white shadow-md ring-2 ring-[var(--color-badge-bg)]"
                  : "border-gray-200 bg-white/70 hover:bg-white hover:border-pink-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p.score > 70 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"
                  }`}>
                    {p.riskLevel}
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--color-primary)]">
                    Score: {p.score}%
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">{p.title}</h4>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">{p.badge}</p>
            </button>
          );
        })}
      </div>

      {/* Detailed Pattern Deep-Dive with 3 Core XAI Questions */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[var(--color-border)] space-y-6">
        
        {/* Question 1: What did we find? */}
        <div className="p-4 rounded-2xl bg-[var(--color-bg-soft)] border border-[var(--color-border)]">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
            <HelpCircle className="w-4 h-4" /> 1. What Did We Find?
          </div>
          <p className="text-sm text-gray-800 leading-relaxed font-medium">
            {selectedPattern.whatWeFound}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span>Confidence: <strong className="text-gray-900">{selectedPattern.confidence}</strong></span>
            <span>Guideline: <strong className="text-gray-900">{selectedPattern.badge}</strong></span>
          </div>
        </div>

        {/* Question 2: Why did we say that? (SHAP Feature Attribution Bars) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
              <TrendingUp className="w-4 h-4" /> 2. Why Did We Say That? (Feature Attribution)
            </div>
            <span className="text-[11px] text-gray-400 italic">SHAP / Tree-Attribution Model</span>
          </div>
          <p className="text-xs text-gray-600 mb-4">{selectedPattern.whyWeSaidThat}</p>

          <div className="space-y-3">
            {selectedPattern.factors.map((f, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-900">{f.factor}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-mono text-[11px]">{f.value}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      f.impact === "High Impact" ? "bg-rose-100 text-rose-700" : "bg-purple-100 text-purple-700"
                    }`}>
                      +{f.weight}% weight
                    </span>
                  </div>
                </div>
                
                {/* Visual Bar */}
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${f.weight * 2}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-500 leading-snug">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Question 3: Counterfactual Hints & What should I do? */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-900 uppercase">
              <Lightbulb className="w-4 h-4 text-amber-600" /> Counterfactual Insight
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              "{selectedPattern.counterfactual}"
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-900 uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Clinical Action Plan
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed">
              {selectedPattern.recommendedAction}
            </p>
          </div>

        </div>

      </div>

      {/* Digital Twin & "What-If" Simulator */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[var(--color-border)] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[var(--color-primary)]" />
              Digital Twin "What-If" Interactive Simulator
            </h3>
            <p className="text-xs text-gray-500">
              Adjust your lifestyle variables below to see how your forecasted symptom flare probability shifts
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
            Personalized Model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Sleep Slider */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-700">
              <span>Nightly Sleep:</span>
              <span className="font-bold text-purple-700 font-mono">{simSleep} Hours</span>
            </div>
            <input
              type="range"
              min="4"
              max="10"
              step="0.5"
              value={simSleep}
              onChange={(e) => setSimSleep(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <p className="text-[10px] text-gray-400">Aim for ≥ 7.5 hrs to lower insulin resistance</p>
          </div>

          {/* Stress Slider */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-700">
              <span>Perceived Stress:</span>
              <span className="font-bold text-amber-700 font-mono">{simStress} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={simStress}
              onChange={(e) => setSimStress(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[10px] text-gray-400">Cortisol spikes delay ovulation & aggravate cramps</p>
          </div>

          {/* Exercise Slider */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-700">
              <span>Moderate Movement:</span>
              <span className="font-bold text-emerald-700 font-mono">{simExercise} Mins</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={simExercise}
              onChange={(e) => setSimExercise(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[10px] text-gray-400">Walking or yoga releases endorphins</p>
          </div>
        </div>

        {/* Simulator Projected Output */}
        <div className="p-4 rounded-2xl bg-[var(--color-bg-soft)] border border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
              Digital Twin Simulation Result:
            </span>
            <p className="text-xs text-gray-800 font-medium mt-0.5">{simResult.summary}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[11px] text-gray-400">Projected Flare Risk:</p>
            <p className="text-2xl font-black text-[var(--color-primary)] font-mono">
              {simResult.flareProbability}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
