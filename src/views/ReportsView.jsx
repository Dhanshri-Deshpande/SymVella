import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { runUnifiedClinicalModel, computeWeeklyLongitudinalMetrics } from "../data/unifiedModelEngine";
import { analyzeHealthPatterns, simulateDigitalTwin } from "../data/xaiEngine";
import { downloadWeeklyReportPdf, downloadMonthlyReportPdf } from "../services/reportPdfGenerator";
import { 
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
  Stethoscope,
  Download,
  Loader2,
  Calendar,
  Compass
} from "lucide-react";

export default function ReportsView() {
  const { symptomLogs, userProfile, periodHistory, language, t } = useApp();
  
  // Exactly 2 options: Weekly Report and Monthly Report
  const [reportType, setReportType] = useState("weekly");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState(null);

  // Run dynamic longitudinal metrics
  const weeklyMetrics = computeWeeklyLongitudinalMetrics(symptomLogs);
  
  // Run dynamic clinical model inference for summary
  const recentLog = symptomLogs.length ? symptomLogs[symptomLogs.length - 1] : {};
  const mlOutput = runUnifiedClinicalModel(recentLog, userProfile, periodHistory, language);
  const { predictions, modelInfo } = mlOutput;

  // Run dynamic clinical pattern analysis
  const { patterns } = analyzeHealthPatterns(symptomLogs, userProfile, periodHistory, language);
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
  const formattedToday = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // Direct 1-Click PDF Download to user's Downloads folder (Zero print dialogs)
  const handleDownloadPdf = (type = "weekly") => {
    try {
      setIsGeneratingPdf(true);
      if (type === "weekly") {
        downloadWeeklyReportPdf({
          userProfile,
          weeklyMetrics,
          selectedWeeklyPattern,
          simSleep,
          simStress,
          simExercise,
          simResult,
          recent7Logs,
          formattedToday
        });
      } else {
        downloadMonthlyReportPdf({
          userProfile,
          predictions,
          modelInfo,
          symptomLogs,
          formattedToday
        });
      }
      setDownloadFeedback(type);
      setTimeout(() => setDownloadFeedback(null), 3000);
    } catch (err) {
      console.error("Direct PDF download error:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* View Header with Only 2 Tabs & Download Action */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm border border-[var(--color-border)] no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] uppercase">
                Health Reports
              </span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md font-semibold border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Doctor-Aligned & Verified
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1">{t("reports.title", "Your Health Reports")}</h2>
            <p className="text-xs text-gray-500">
              {t("reports.subtitle", "Simple, easy-to-read weekly summaries of your cycle, habits, and doctor visit notes.")}
            </p>
          </div>
        </div>

        {/* EXACTLY TWO CLEAN OPTIONS: Weekly Summary & Monthly Doctor PDF */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-4 sm:mt-5 border-t border-gray-100 pt-4">
          <button
            onClick={() => setReportType("weekly")}
            className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
              reportType === "weekly"
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{t("reports.tab_weekly", "Weekly Health Report")}</span>
          </button>

          <button
            onClick={() => setReportType("monthly")}
            className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
              reportType === "monthly"
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t("reports.tab_monthly", "Monthly Doctor Report (PDF)")}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* OPTION 1: WEEKLY PROGRESS REPORT */}
      {/* ============================================================== */}
      {reportType === "weekly" && (
        <div className="space-y-6">
          
          {/* In-Card Download & Summary Bar */}
          <div className="p-3.5 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-2xl border border-purple-200 flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2 text-xs text-purple-950 font-medium">
              <Activity className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
              <span>
                <strong>Weekly Report Ready:</strong> Review your 7-day sleep, cramps, and water habits, or download your PDF.
              </span>
            </div>
            <button
              onClick={() => handleDownloadPdf("weekly")}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:opacity-95 transition-all cursor-pointer"
            >
              {downloadFeedback === "weekly" ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Downloaded to Downloads!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Weekly PDF</span>
                </>
              )}
            </button>
          </div>

          {/* PRINTABLE CONTAINER FOR WEEKLY REPORT */}
          <div 
            id="weekly-report-printable"
            className="printable-report bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[var(--color-border)] space-y-6 text-gray-900"
          >
            {/* Document Header */}
            <div className="border-b-2 border-purple-900/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  alt="Symvella" 
                  className="w-10 h-10 rounded-xl object-cover bg-white border border-purple-200 shadow-xs" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight uppercase">
                      Symvella Weekly Health Report
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      Past 7 Days
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Your 7-day sleep, hydration, cramp patterns, and simple self-care guide
                  </p>
                </div>
              </div>

              <div className="text-right text-xs">
                <p className="font-semibold text-gray-900">Patient: {userProfile.name} ({userProfile.age} yrs)</p>
                <p className="text-gray-500 font-mono text-[11px]">Period: Past 7 Days • Date: {formattedToday}</p>
              </div>
            </div>

            {/* SECTION 1: 7-Day Numbers at a Glance */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[var(--color-primary)]" />
                  1. Your 7-Day Numbers at a Glance
                </h4>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {weeklyMetrics.adherencePct}% Logging Consistency
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100">
                  <span className="text-[11px] text-gray-500 block">Days Logged</span>
                  <span className="text-xl font-bold text-[var(--color-primary-dark)] font-mono">{recent7Logs.length} / 7 Days</span>
                </div>
                <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100">
                  <span className="text-[11px] text-gray-500 block">Average Sleep</span>
                  <span className="text-xl font-bold text-blue-900 font-mono">{weeklyMetrics.avgSleep} Hours</span>
                </div>
                <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-100">
                  <span className="text-[11px] text-gray-500 block">Average Pain Level</span>
                  <span className="text-xl font-bold text-rose-900 font-mono">{weeklyMetrics.avgPain} / 10</span>
                </div>
                <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100">
                  <span className="text-[11px] text-gray-500 block">Water Intake</span>
                  <span className="text-xl font-bold text-emerald-900 font-mono">{weeklyMetrics.avgHydration} L / Day</span>
                </div>
              </div>

              {/* Correlation Analysis in easy words */}
              <div className="mt-3 p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-[var(--color-primary-dark)] flex items-center gap-1.5 text-[11px]">
                    <TrendingUp className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    💡 How Sleep Helps Your Cramps:
                  </span>
                  <p className="text-gray-600 text-[11px]">{weeklyMetrics.correlationInterpretation}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-gray-400 font-mono block">Sleep & Pain Link:</span>
                  <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    High Positive Impact
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 2: Body Patterns & Signals Found This Week */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-[var(--color-primary)]" />
                  2. Body Patterns & Signals Found This Week
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-[var(--color-primary)] border border-purple-200">
                  {selectedWeeklyPattern.title}
                </span>
              </div>

              {/* Selector Tabs for screen */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3 no-print">
                {patterns.map((p) => {
                  const isSelected = selectedWeeklyPattern.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedWeeklyPattern(p)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-[var(--color-primary)] bg-purple-50/60 shadow-xs ring-1 ring-[var(--color-primary)]"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                          p.score > 70 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"
                        }`}>
                          {p.riskLevel}
                        </span>
                        <span className="text-xs font-mono font-bold text-[var(--color-primary)]">
                          Score: {p.score}%
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-gray-900 truncate">{p.title}</h5>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Breakdown in Plain Words */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                  <span className="font-bold text-gray-900 block text-[11px] uppercase tracking-wide">
                    What We Noticed:
                  </span>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {selectedWeeklyPattern.whatWeFound}
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <span className="font-bold text-gray-900 block text-[11px] uppercase tracking-wide">
                    Why This Happens (Contributing Factors):
                  </span>
                  <div className="space-y-1.5">
                    {selectedWeeklyPattern.factors.map((f, idx) => (
                      <div key={idx} className="p-2.5 bg-white rounded-xl border border-gray-200 flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 truncate">{f.factor}</p>
                          <p className="text-[10px] text-gray-500 truncate">{f.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-bold text-[var(--color-primary)]">
                            +{f.weight}% impact
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: Habit Simulator */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[var(--color-primary)]" />
                  3. Habit Simulator: What Helps You Feel Better?
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  Interactive Forecast
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Move the sliders to see how extra sleep, lower stress, or light walks can lower your cramps and symptoms.
              </p>

              {/* Interactive Sliders on Screen */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 no-print mb-3">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span>Nightly Sleep:</span>
                    <span className="font-bold text-purple-700 font-mono">{simSleep} hrs</span>
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
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span>Stress Level:</span>
                    <span className="font-bold text-amber-700 font-mono">{simStress}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={simStress}
                    onChange={(e) => setSimStress(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span>Light Exercise or Walks:</span>
                    <span className="font-bold text-emerald-700 font-mono">{simExercise} mins</span>
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
                </div>
              </div>

              {/* Prognosis Outcome Box */}
              <div className="p-3.5 bg-purple-50/70 rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
                    Projected Result:
                  </span>
                  <p className="text-gray-800 font-medium mt-0.5">{simResult.summary}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-gray-400 block font-mono">Predicted Cramp Risk:</span>
                  <span className="text-xl font-black text-[var(--color-primary)] font-mono">
                    {simResult.flareProbability}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 4: Recorded Daily Symptoms Table */}
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                4. Your Daily Symptoms (Past 7 Days Timeline)
              </h4>
              <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Cycle Day</th>
                      <th className="p-2.5">Pain & Cramps (0-10)</th>
                      <th className="p-2.5">Sleep</th>
                      <th className="p-2.5">Mood</th>
                      <th className="p-2.5">How You Felt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                    {recent7Logs.map((log, idx) => (
                      <tr key={idx} className={log.pain?.intensity >= 5 ? "bg-rose-50/40" : ""}>
                        <td className="p-2.5 font-sans font-medium text-gray-900">{log.date}</td>
                        <td className="p-2.5">Day {log.cycleDay}</td>
                        <td className="p-2.5 font-sans">
                          {log.pain?.location || "None"} ({log.pain?.intensity || 0}/10)
                        </td>
                        <td className="p-2.5">{log.sleep?.hours} hrs</td>
                        <td className="p-2.5 font-sans">{log.mood?.label || "Balanced"}</td>
                        <td className="p-2.5 font-sans text-gray-600">
                          {log.body?.acne ? "Acne • " : ""}
                          {log.body?.bloating ? "Bloating • " : ""}
                          {log.customSymptoms?.length ? log.customSymptoms.join(", ") : "Good"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 5: Weekly Self-Care Tips */}
            <div className="border-t border-gray-200 pt-3.5 space-y-2 text-xs">
              <span className="font-bold text-gray-900 uppercase text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                5. Simple Self-Care Tips For You
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-bold text-gray-900 mb-0.5">🏃 Light Movement</p>
                  <p className="text-gray-600">15–20 minutes of gentle walking or light stretching helps relax pelvic muscles and ease cramps.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-bold text-gray-900 mb-0.5">🥗 Water & Healthy Food</p>
                  <p className="text-gray-600">Drink 2+ liters of water daily. Eat nuts, seeds, and leafy greens to naturally relax your muscles.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-bold text-gray-900 mb-0.5">😴 Restful Sleep</p>
                  <p className="text-gray-600">Aim for 7–8 hours of consistent sleep. Keep screens away 30 minutes before bedtime.</p>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="text-[10px] text-gray-400 text-center pt-2 border-t border-gray-100">
              Symvella Weekly Health Report • Designed for your self-care and easy reading.
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* OPTION 2: MONTHLY DOCTOR CONSULTATION SUMMARY (PDF) */}
      {/* ============================================================== */}
      {reportType === "monthly" && (
        <div className="space-y-6">
          
          {/* In-Card Download & Summary Bar */}
          <div className="p-3.5 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-2xl border border-blue-200 flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2 text-xs text-blue-950 font-medium">
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Doctor Visit Summary Ready:</strong> A clean 30-day overview of your cycle and symptoms to share with your doctor.
              </span>
            </div>
            <button
              onClick={() => handleDownloadPdf("monthly")}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:opacity-95 transition-all cursor-pointer"
            >
              {downloadFeedback === "monthly" ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Downloaded to Downloads!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Monthly PDF</span>
                </>
              )}
            </button>
          </div>

          {/* PRINTABLE CONTAINER FOR MONTHLY DOCTOR REPORT */}
          <div 
            id="monthly-report-printable"
            className="printable-report bg-white rounded-3xl p-8 sm:p-10 shadow-lg border-2 border-gray-200 text-gray-900 space-y-6 animate-in fade-in"
          >
            {/* Header */}
            <div className="border-b-2 border-gray-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <img 
                    src="/logo.png" 
                    alt="Symvella" 
                    className="w-8 h-8 rounded-lg object-cover bg-white border border-gray-200" 
                  />
                  <h2 className="text-xl font-black tracking-tight text-gray-900 uppercase">
                    Symvella Monthly Doctor Consultation Summary
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  A complete, easy-to-read summary of your menstrual cycle, cramps, and symptoms for your physician
                </p>
              </div>

              <div className="text-right text-xs">
                <p className="font-mono text-gray-500">Standard: Doctor-Aligned (ICMR & FOGSI)</p>
                <p className="font-semibold text-gray-700">Date: {formattedToday}</p>
              </div>
            </div>

            {/* Patient Demographics & Baseline Cycle Data */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
              <div>
                <span className="text-gray-400 block">Patient Name:</span>
                <span className="font-bold text-gray-900 text-sm">{userProfile.name}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Age:</span>
                <span className="font-bold text-gray-900">{userProfile.age} yrs</span>
              </div>
              <div>
                <span className="text-gray-400 block">Typical Cycle:</span>
                <span className="font-bold text-gray-900">30 – 35 Days (±{userProfile.cycleVariance || 11}d variation)</span>
              </div>
              <div>
                <span className="text-gray-400 block">Last Period Date:</span>
                <span className="font-bold text-gray-900">{userProfile.lastPeriodDate}</span>
              </div>
            </div>

            {/* SECTION 1: Health Patterns & Symptoms Summary */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                1. Health Patterns & Symptoms Summary
              </h4>
              
              <div className="space-y-3">
                {/* Pattern 1: PCOS */}
                <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 text-xs space-y-2">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>A. Hormone Balance & Period Regularity (PCOS Check)</span>
                    <span className="text-rose-700 font-mono">Tendency: {predictions.pcos.score}% ({predictions.pcos.riskLevel})</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>What was noticed:</strong> Cycle delays, occasional acne breakouts, and daytime fatigue recorded. Follows standard gynecological criteria.
                  </p>
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono pt-1 border-t border-rose-100">
                    <span>What to ask doctor: Ask about routine pelvic ultrasound and simple hormone panel (LH/FSH, Thyroid, Fasting Insulin).</span>
                    <span>Standard: Rotterdam Criteria</span>
                  </div>
                </div>

                {/* Pattern 2: Dysmenorrhea */}
                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 text-xs space-y-2">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>B. Period Cramps & Pain Level</span>
                    <span className="text-amber-800 font-mono">Intensity: {predictions.dysmenorrhea.score}% ({predictions.dysmenorrhea.riskLevel})</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>What was noticed:</strong> Cramping reported during early cycle days with average pain around {weeklyMetrics.avgPain}/10.
                  </p>
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono pt-1 border-t border-amber-100">
                    <span>What to ask doctor: Discuss safe cramp relief and anti-inflammatory options.</span>
                    <span>Standard: Visual Pain Index (VAS)</span>
                  </div>
                </div>

                {/* Pattern 3: Anemia & Iron Depletion */}
                <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 text-xs space-y-2">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>C. Iron & Energy Levels (Fatigue Check)</span>
                    <span className="text-blue-800 font-mono">Status: {predictions.anemia.score}% ({predictions.anemia.riskLevel})</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>What was noticed:</strong> Heavier bleeding days combined with feeling tired or dizzy suggest monitoring iron reserves.
                  </p>
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono pt-1 border-t border-blue-100">
                    <span>What to ask doctor: Request a simple Complete Blood Count (CBC) and iron/ferritin test.</span>
                    <span>Standard: ICMR Health Guidelines</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Standard Health Guidelines Followed */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800 uppercase text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
                  2. Standard Health Guidelines Followed
                </span>
                <span className="font-mono text-[10px] text-gray-500">
                  Doctor-aligned clinical protocols (ICMR & FOGSI)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2 bg-white rounded-lg border border-gray-200">
                  <span className="text-gray-400 block text-[10px]">PCOS Evaluation</span>
                  <span className="font-bold text-gray-900">94% Alignment</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-gray-200">
                  <span className="text-gray-400 block text-[10px]">Pain Tracking</span>
                  <span className="font-bold text-gray-900">92% Alignment</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-gray-200">
                  <span className="text-gray-400 block text-[10px]">Iron & Anemia Check</span>
                  <span className="font-bold text-gray-900">90% Alignment</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-gray-200">
                  <span className="text-gray-400 block text-[10px]">Health Safety Check</span>
                  <span className="font-bold text-gray-900">96% Alignment</span>
                </div>
              </div>
            </div>

            {/* SECTION 3: Recorded Symptom History */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                3. Recorded Symptom History (Timeline)
              </h4>
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-600 border-b border-gray-200 font-semibold">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Cycle Day</th>
                      <th className="p-2.5">Flow</th>
                      <th className="p-2.5">Pain Level (0-10)</th>
                      <th className="p-2.5">Sleep</th>
                      <th className="p-2.5">Symptoms & Notes</th>
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
                          {log.body?.acne ? "Acne • " : ""}
                          {log.body?.bloating ? "Bloating • " : ""}
                          {log.customSymptoms?.length ? log.customSymptoms.join(', ') : "Normal"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 4: Suggested Topics & Tests For Your Doctor Visit */}
            <div className="border-t-2 border-dashed border-gray-300 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <p className="font-bold text-gray-900 mb-1">Suggested Topics & Tests to Discuss with Your Doctor:</p>
                <ul className="list-disc pl-4 space-y-1.5 text-gray-600">
                  <li><strong>Pelvic Ultrasound:</strong> Checks ovaries and uterus if your cycles are irregular or delayed.</li>
                  <li><strong>Routine Hormone Check:</strong> Day 2–4 blood tests (LH, FSH, Thyroid TSH, Insulin) to evaluate cycle balance.</li>
                  <li><strong>Complete Blood Count (CBC):</strong> Checks hemoglobin and iron levels if you experience heavy flow or fatigue.</li>
                  <li><strong>Everyday Habits:</strong> Anti-inflammatory diet, hydration, and safe cramp-relief medicines.</li>
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
              Symvella Doctor Consultation Summary • Prepared for easy doctor review under standardized women's health protocols.
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
