import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { runUnifiedClinicalModel, computeWeeklyLongitudinalMetrics } from "../data/unifiedModelEngine";
import { analyzeHealthPatterns, simulateDigitalTwin } from "../data/xaiEngine";
import { 
  Printer, 
  FileText, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Heart,
  Droplet,
  Clock,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  ShieldCheck,
  Sliders,
  HelpCircle,
  Lightbulb,
  Info,
  Stethoscope
} from "lucide-react";

export default function ReportsView() {
  const { symptomLogs, userProfile, periodHistory } = useApp();
  
  // Exactly 2 options: Weekly Report and Monthly Report
  const [reportType, setReportType] = useState("weekly");

  // Run dynamic longitudinal metrics
  const weeklyMetrics = computeWeeklyLongitudinalMetrics(symptomLogs);
  
  // Run dynamic clinical model inference for summary
  const recentLog = symptomLogs.length ? symptomLogs[symptomLogs.length - 1] : {};
  const mlOutput = runUnifiedClinicalModel(recentLog, userProfile, periodHistory);
  const { predictions, modelInfo } = mlOutput;

  // Run dynamic clinical pattern analysis
  const { patterns } = analyzeHealthPatterns(symptomLogs, userProfile, periodHistory);
  const [selectedWeeklyPattern, setSelectedWeeklyPattern] = useState(patterns[0]);

  // Lifestyle & Clinical Prognosis Simulator states embedded in Weekly Report
  const [simSleep, setSimSleep] = useState(8);
  const [simStress, setSimStress] = useState(4);
  const [simExercise, setSimExercise] = useState(30);

  const simResult = simulateDigitalTwin({
    baseScore: selectedWeeklyPattern.score,
    sleepHours: simSleep,
    stressLevel: simStress,
    exerciseMins: simExercise
  });

  const recent7Logs = symptomLogs.slice(-7);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* View Header with Only 2 Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[var(--color-border)] no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] uppercase">
                Clinical Health Reports
              </span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md font-semibold border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Standardized Reproductive Healthcare Protocols (FOGSI / ICMR)
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1">Comprehensive Health Reports</h2>
            <p className="text-xs text-gray-500">
              Longitudinal physiological trends, biomarker factor analyses, and physician-ready consultation summaries
            </p>
          </div>

          {reportType === "monthly" && (
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-2xl bg-[var(--color-primary)] hover:opacity-95 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 self-start sm:self-auto"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
          )}
        </div>

        {/* EXACTLY TWO CLEAN OPTIONS: Weekly Summary & Monthly Doctor PDF */}
        <div className="grid grid-cols-2 gap-3 mt-5 border-t border-gray-100 pt-4">
          <button
            onClick={() => setReportType("weekly")}
            className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 border ${
              reportType === "weekly"
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Weekly Summary & Prognosis Assessment</span>
          </button>

          <button
            onClick={() => setReportType("monthly")}
            className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 border ${
              reportType === "monthly"
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Monthly Clinical Consultation Summary (PDF)</span>
          </button>
        </div>
      </div>

      {/* OPTION 1: WEEKLY REPORT WITH CLINICAL PATTERN ASSESSMENT & PROGNOSIS SIMULATOR */}
      {reportType === "weekly" && (
        <div className="space-y-6 no-print">
          
          {/* SECTION 1: Weekly Longitudinal Physiological Metrics Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[var(--color-border)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[var(--color-primary)]" />
                  Weekly Longitudinal Physiological Summary (Past 7 Days)
                </h3>
                <p className="text-xs text-gray-500">
                  Aggregated from continuous daily physiological logs across standardized reproductive health metrics
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                {weeklyMetrics.adherencePct}% Logging Adherence
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-[var(--color-border)]">
                <span className="text-[11px] text-gray-500 block">Recorded Days</span>
                <span className="text-xl font-bold text-[var(--color-primary-dark)] font-mono">{recent7Logs.length} / 7 Days</span>
              </div>
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
                <span className="text-[11px] text-gray-500 block">Average Restorative Sleep</span>
                <span className="text-xl font-bold text-blue-900 font-mono">{weeklyMetrics.avgSleep} Hours</span>
              </div>
              <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-100">
                <span className="text-[11px] text-gray-500 block">Mean Pain Severity (VAS)</span>
                <span className="text-xl font-bold text-rose-900 font-mono">{weeklyMetrics.avgPain} / 10</span>
              </div>
              <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <span className="text-[11px] text-gray-500 block">Mean Daily Hydration</span>
                <span className="text-xl font-bold text-emerald-900 font-mono">{weeklyMetrics.avgHydration} L / Day</span>
              </div>
            </div>

            {/* Longitudinal Correlation Analysis */}
            <div className="p-4 rounded-2xl bg-[var(--color-bg-soft)] border border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-[var(--color-primary-dark)] flex items-center gap-1.5 uppercase text-[11px]">
                  <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" />
                  Longitudinal Correlation: Sleep Duration vs. Pain Sensitivity
                </span>
                <p className="text-gray-600">{weeklyMetrics.correlationInterpretation}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-gray-400 block font-mono">Correlation Coefficient:</span>
                <span className="text-xl font-bold font-mono text-[var(--color-primary)]">
                  r = {weeklyMetrics.correlationSleepPain}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: DIAGNOSTIC PATTERN ASSESSMENT & CONTRIBUTING BIOMARKERS */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[var(--color-border)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-[var(--color-primary)]" />
                    Diagnostic Pattern Assessment & Contributing Biomarkers
                  </h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Rotterdam / FOGSI Protocols
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Select a clinical pattern to inspect primary diagnostic indicators, contributing physiological factors, and therapeutic care plans
                </p>
              </div>
            </div>

            {/* Clinical Pattern Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {patterns.map((p) => {
                const isSelected = selectedWeeklyPattern.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedWeeklyPattern(p)}
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
                          Index: {p.score}%
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">{p.title}</h4>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">{p.badge}</p>
                  </button>
                );
              })}
            </div>

            {/* 3 Core Clinical Perspectives */}
            <div className="space-y-4">
              {/* Question 1: Clinical Findings & Diagnostic Impression */}
              <div className="p-4 rounded-2xl bg-[var(--color-bg-soft)] border border-[var(--color-border)]">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                  <HelpCircle className="w-4 h-4" /> 1. Clinical Findings & Diagnostic Impression
                </div>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                  {selectedWeeklyPattern.whatWeFound}
                </p>
                <div className="mt-2.5 flex items-center gap-4 text-xs text-gray-500">
                  <span>Diagnostic Concordance: <strong className="text-gray-900">{selectedWeeklyPattern.confidence}</strong></span>
                  <span>Clinical Standard: <strong className="text-gray-900">{selectedWeeklyPattern.badge}</strong></span>
                </div>
              </div>

              {/* Question 2: Contributing Biomarkers & Relative Clinical Weights */}
              <div className="p-4 rounded-2xl bg-gray-50/60 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                    <TrendingUp className="w-4 h-4" /> 2. Contributing Biomarkers & Factor Weighting
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">Standardized Factor Decomposition</span>
                </div>
                <p className="text-xs text-gray-600">{selectedWeeklyPattern.whyWeSaidThat}</p>

                <div className="space-y-2.5">
                  {selectedWeeklyPattern.factors.map((f, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-gray-200 space-y-1.5 shadow-2xs">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-gray-900">{f.factor}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 font-mono text-[11px]">{f.value}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            f.impact === "High Clinical Relevance" ? "bg-rose-100 text-rose-700" : "bg-purple-100 text-purple-700"
                          }`}>
                            +{f.weight}% clinical weight
                          </span>
                        </div>
                      </div>
                      
                      {/* Visual Bar */}
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, f.weight * 2)}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 leading-snug">{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question 3: Preventive Guidance & Action Plan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-amber-900 uppercase">
                    <Lightbulb className="w-4 h-4 text-amber-600" /> Preventive Clinical Guidance
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed font-medium">
                    "{selectedWeeklyPattern.counterfactual}"
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-emerald-900 uppercase">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Recommended Clinical Action Plan
                  </div>
                  <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                    {selectedWeeklyPattern.recommendedAction}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: PREVENTIVE CARE SCENARIO & PROGNOSIS SIMULATOR */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[var(--color-border)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[var(--color-primary)]" />
                  Preventive Care Scenario & Prognosis Assessment
                </h3>
                <p className="text-xs text-gray-500">
                  Evaluate how targeted adjustments in sleep, stress modulation, and physical movement influence projected cycle comfort
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                Prognostic Assessment
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sleep Slider */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span>Nightly Restorative Sleep:</span>
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
                <p className="text-[10px] text-gray-400">Aim for ≥ 7.5 hrs to mitigate insulin resistance and cortisol surges</p>
              </div>

              {/* Stress Slider */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span>Perceived Stress Level:</span>
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
                <p className="text-[10px] text-gray-400">Elevated cortisol suppresses LH pulsation and intensifies prostaglandins</p>
              </div>

              {/* Exercise Slider */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span>Moderate Physical Activity:</span>
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
                <p className="text-[10px] text-gray-400">Gentle pelvic mobilization improves lumbosacral microcirculation</p>
              </div>
            </div>

            {/* Prognostic Projected Output */}
            <div className="p-4 rounded-2xl bg-[var(--color-bg-soft)] border border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
                  Projected Clinical Prognosis:
                </span>
                <p className="text-xs text-gray-800 font-medium mt-0.5">{simResult.summary}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-gray-400">Projected Severity Risk Index:</p>
                <p className="text-2xl font-black text-[var(--color-primary)] font-mono">
                  {simResult.flareProbability}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4: Recorded Longitudinal Log Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[var(--color-border)] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Recorded Longitudinal Symptoms (Past 7 Days)
            </h4>
            <div className="overflow-x-auto border border-gray-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Cycle Day</th>
                    <th className="p-3">Pain Location & VAS (0-10)</th>
                    <th className="p-3">Sleep Duration</th>
                    <th className="p-3">Emotional State</th>
                    <th className="p-3">Physical Biomarkers & Signs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                  {recent7Logs.map((log, idx) => (
                    <tr key={idx} className={log.pain?.intensity >= 5 ? "bg-rose-50/40" : ""}>
                      <td className="p-3 font-sans font-medium text-gray-900">{log.date}</td>
                      <td className="p-3">Day {log.cycleDay}</td>
                      <td className="p-3 font-sans">
                        {log.pain?.location || "None"} ({log.pain?.intensity || 0}/10)
                      </td>
                      <td className="p-3">{log.sleep?.hours} hrs</td>
                      <td className="p-3 font-sans">{log.mood?.label || "Balanced"}</td>
                      <td className="p-3 font-sans text-gray-600">
                        {log.body?.acne ? "Acne • " : ""}
                        {log.body?.bloating ? "Bloating • " : ""}
                        {log.customSymptoms?.length ? log.customSymptoms.join(", ") : "Normal"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* OPTION 2: MONTHLY REPORT (Formal Physician-Ready Clinical Summary 1-Page PDF) */}
      {reportType === "monthly" && (
        <div 
          id="doctor-report-printable"
          className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border-2 border-gray-200 text-gray-900 space-y-6 animate-in fade-in"
        >
          {/* Formal Clinical Summary Header */}
          <div className="border-b-2 border-gray-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <img 
                  src="/logo.png" 
                  alt="Symvella" 
                  className="w-8 h-8 rounded-lg object-cover bg-white border border-gray-200" 
                />
                <h2 className="text-xl font-black tracking-tight text-gray-900 uppercase">
                  Symvella Monthly Comprehensive Clinical Summary
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Standardized Longitudinal Patient History & Diagnostic Risk Stratification for Gynaecological & Endocrine Consultation
              </p>
            </div>

            <div className="text-right text-xs">
              <p className="font-mono text-gray-500">Framework: Clinical CDSS (FOGSI / ICMR Aligned)</p>
              <p className="font-semibold text-gray-700">Date Generated: Oct 24, 2026</p>
            </div>
          </div>

          {/* Patient Demographics & Baseline Cycle Data */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
            <div>
              <span className="text-gray-400 block">Patient Name:</span>
              <span className="font-bold text-gray-900 text-sm">{userProfile.name}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Age / Clinical Stage:</span>
              <span className="font-bold text-gray-900">{userProfile.age} yrs • Reproductive Age</span>
            </div>
            <div>
              <span className="text-gray-400 block">Reported Cycle Variability:</span>
              <span className="font-bold text-gray-900">30 – 35 Days (±{userProfile.cycleVariance || 11}d variance)</span>
            </div>
            <div>
              <span className="text-gray-400 block">Last Menstrual Period (LMP):</span>
              <span className="font-bold text-gray-900">{userProfile.lastPeriodDate}</span>
            </div>
          </div>

          {/* Primary Diagnostic Impressions & Biomarker Profile */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              1. Primary Diagnostic Impressions & Biomarker Profile
            </h4>
            
            <div className="space-y-3">
              {/* Pattern 1: PCOS */}
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 text-xs space-y-2">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>A. Suspected Chronic Anovulation / Polycystic Ovarian Syndrome (PCOS) Phenotype</span>
                  <span className="text-rose-700 font-mono">Severity Index: {predictions.pcos.score}% ({predictions.pcos.riskLevel})</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Key Pathophysiological Indicators:</strong> {predictions.pcos.shapFactors.map(f => `${f.feature} (+${f.weight}% weight)`).join(", ")}.
                </p>
                <div className="flex justify-between text-[10px] text-gray-500 font-mono pt-1 border-t border-rose-100">
                  <span>Diagnostic Concordance: {predictions.pcos.confidence}</span>
                  <span>Protocol Standard: Rotterdam ESHRE/ASRM Criteria</span>
                </div>
              </div>

              {/* Pattern 2: Dysmenorrhea */}
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 text-xs space-y-2">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>B. Primary Dysmenorrhea & Myometrial Hyper-Reactivity</span>
                  <span className="text-amber-800 font-mono">Severity Index: {predictions.dysmenorrhea.score}% ({predictions.dysmenorrhea.riskLevel})</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Key Pathophysiological Indicators:</strong> {predictions.dysmenorrhea.shapFactors.map(f => `${f.feature} (+${f.weight}% weight)`).join(", ")}.
                </p>
                <div className="flex justify-between text-[10px] text-gray-500 font-mono pt-1 border-t border-amber-100">
                  <span>Diagnostic Concordance: {predictions.dysmenorrhea.confidence}</span>
                  <span>Protocol Standard: Visual Analogue Scale (VAS) Scoring Index</span>
                </div>
              </div>

              {/* Pattern 3: Anemia & Iron Depletion */}
              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 text-xs space-y-2">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>C. Hematopoietic Depletion & Microcytic Anemia Risk</span>
                  <span className="text-blue-800 font-mono">Severity Index: {predictions.anemia.score}% ({predictions.anemia.riskLevel})</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Key Pathophysiological Indicators:</strong> {predictions.anemia.shapFactors.map(f => `${f.feature} (+${f.weight}% weight)`).join(", ")}.
                </p>
                <div className="flex justify-between text-[10px] text-gray-500 font-mono pt-1 border-t border-blue-100">
                  <span>Diagnostic Concordance: {predictions.anemia.confidence}</span>
                  <span>Protocol Standard: ICMR National Anemia Control Program</span>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Protocol Benchmarks & Diagnostic Confidence */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800 uppercase text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
                2. Clinical Protocol Benchmarks & Diagnostic Confidence
              </span>
              <span className="font-mono text-[10px] text-gray-500">
                Validated against {modelInfo.trainingSamples} multi-center clinical patient records
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <span className="text-gray-400 block text-[10px]">PCOS Protocol Alignment</span>
                <span className="font-bold text-gray-900">{modelInfo.metrics["PCOS Risk"]}%</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <span className="text-gray-400 block text-[10px]">Pain VAS Concordance</span>
                <span className="font-bold text-gray-900">{modelInfo.metrics["Dysmenorrhea Severity"]}%</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <span className="text-gray-400 block text-[10px]">Hematologic Specificity</span>
                <span className="font-bold text-gray-900">{modelInfo.metrics["Anemia Depletion"]}%</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <span className="text-gray-400 block text-[10px]">Triage Sensitivity</span>
                <span className="font-bold text-gray-900">{modelInfo.metrics["Daily Triage"]}%</span>
              </div>
            </div>
          </div>

          {/* Longitudinal Symptom Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              3. Recorded Longitudinal Symptom Timeline
            </h4>
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 text-gray-600 border-b border-gray-200 font-semibold">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Cycle Day</th>
                    <th className="p-2.5">Menstrual Volume</th>
                    <th className="p-2.5">Pain Site & VAS (0-10)</th>
                    <th className="p-2.5">Restorative Sleep</th>
                    <th className="p-2.5">Associated Clinical Signs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-mono text-[11px]">
                  {symptomLogs.slice(-6).map((log, idx) => (
                    <tr key={idx} className={log.pain?.intensity >= 5 ? "bg-rose-50/40" : ""}>
                      <td className="p-2.5 font-sans font-medium">{log.date}</td>
                      <td className="p-2.5">Day {log.cycleDay}</td>
                      <td className="p-2.5 capitalize">{log.menstrual?.flow || "None"}</td>
                      <td className="p-2.5 font-sans">
                        {log.pain?.location || "None"} ({log.pain?.intensity || 0}/10)
                      </td>
                      <td className="p-2.5">{log.sleep?.hours} hrs</td>
                      <td className="p-2.5 font-sans">
                        {log.body?.acne ? "Cutaneous Acne " : ""}
                        {log.body?.bloating ? "Abdominal Distension " : ""}
                        {log.customSymptoms?.length ? `[${log.customSymptoms.join(', ')}]` : ""}
                        {!log.body?.acne && !log.body?.bloating && !log.customSymptoms?.length ? "Baseline" : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attending Physician Orders & Recommendations */}
          <div className="border-t-2 border-dashed border-gray-300 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <p className="font-bold text-gray-900 mb-1">Recommended Diagnostic Workup & Clinical Orders:</p>
              <ul className="list-disc pl-4 space-y-1 text-gray-600">
                <li>Diagnostic Pelvic Ultrasonography: Assess bilateral ovarian morphology, stroma-to-ovarian ratio, and antral follicle count (AFC).</li>
                <li>Targeted Endocrine Evaluation: Day 2–4 Serum LH, FSH, Total Testosterone, DHEA-S, Fasting Insulin, and TSH.</li>
                <li>Hematological Profile: Complete Blood Count (CBC) with Serum Ferritin and Total Iron Binding Capacity (TIBC).</li>
                <li>Therapeutic Lifestyle Interventions: Low-glycemic anti-inflammatory nutrition, magnesium replenishment, and sleep hygiene.</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-6">
              <div className="flex justify-between text-gray-400 text-[11px]">
                <span>Attending Physician Signature</span>
                <span>Hospital / Clinic Seal</span>
              </div>
              <div className="h-8 border-b border-gray-300" />
            </div>
          </div>

          <div className="text-[10px] text-gray-400 text-center pt-2">
            Symvella Clinical Summary generated under standardized clinical decision protocols (FOGSI / Rotterdam Criteria aligned).
          </div>
        </div>
      )}

    </div>
  );
}
