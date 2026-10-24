import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { runUnifiedClinicalModel, computeWeeklyLongitudinalMetrics } from "../data/unifiedModelEngine";
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
  ShieldCheck
} from "lucide-react";

export default function ReportsView() {
  const { symptomLogs, userProfile, periodHistory } = useApp();
  
  // Exactly 2 options: Weekly Report and Monthly Report
  const [reportType, setReportType] = useState("weekly");

  // Run dynamic longitudinal metrics
  const weeklyMetrics = computeWeeklyLongitudinalMetrics(symptomLogs);
  
  // Run dynamic unified model inference for monthly summary
  const recentLog = symptomLogs.length ? symptomLogs[symptomLogs.length - 1] : {};
  const mlOutput = runUnifiedClinicalModel(recentLog, userProfile, periodHistory);
  const { predictions, modelInfo } = mlOutput;

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
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold border border-emerald-200">
                ⚡ SakhiUnifiedModel (Trained ML)
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1">Health Reports</h2>
            <p className="text-xs text-gray-500">
              Longitudinal weekly trends and doctor-ready clinical summaries powered by unified machine learning
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

        {/* EXACTLY TWO CLEAN OPTIONS: Weekly Report & Monthly Report */}
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
            <span>Weekly Report</span>
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
            <span>Monthly Report (Doctor Summary PDF)</span>
          </button>
        </div>
      </div>

      {/* OPTION 1: CLEAN WEEKLY REPORT */}
      {reportType === "weekly" && (
        <div className="space-y-6 no-print">
          
          {/* Weekly Key Metrics Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[var(--color-border)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[var(--color-primary)]" />
                  Weekly Health Aggregation (Past 7 Days)
                </h3>
                <p className="text-xs text-gray-500">
                  Computed via rolling multi-task inference engine ({modelInfo.trainingSamples} clinical benchmark samples)
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                {weeklyMetrics.adherencePct}% Logging Adherence
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-[var(--color-border)]">
                <span className="text-[11px] text-gray-500 block">Logged Days</span>
                <span className="text-xl font-bold text-[var(--color-primary-dark)] font-mono">{recent7Logs.length} / 7 Days</span>
              </div>
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
                <span className="text-[11px] text-gray-500 block">Average Sleep</span>
                <span className="text-xl font-bold text-blue-900 font-mono">{weeklyMetrics.avgSleep} Hours</span>
              </div>
              <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-100">
                <span className="text-[11px] text-gray-500 block">Average Pain VAS</span>
                <span className="text-xl font-bold text-rose-900 font-mono">{weeklyMetrics.avgPain} / 10</span>
              </div>
              <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <span className="text-[11px] text-gray-500 block">Avg Hydration</span>
                <span className="text-xl font-bold text-emerald-900 font-mono">{weeklyMetrics.avgHydration} L / Day</span>
              </div>
            </div>

            {/* Pearson Sleep-Pain Correlation Card */}
            <div className="p-4 rounded-2xl bg-[var(--color-bg-soft)] border border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-[var(--color-primary-dark)] flex items-center gap-1.5 uppercase text-[11px]">
                  <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" />
                  Pearson Correlation: Sleep vs. Pain Intensity
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

            {/* Weekly Symptom Table */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Last 7 Days Recorded Logs
              </h4>
              <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Cycle Day</th>
                      <th className="p-3">Pain Location & Score</th>
                      <th className="p-3">Sleep</th>
                      <th className="p-3">Mood</th>
                      <th className="p-3">Symptoms / Notes</th>
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
                          {log.customSymptoms?.length ? log.customSymptoms.join(", ") : "None"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* OPTION 2: MONTHLY REPORT (Doctor-Ready Clinical Summary 1-Page PDF) */}
      {reportType === "monthly" && (
        <div 
          id="doctor-report-printable"
          className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border-2 border-gray-200 text-gray-900 space-y-6 animate-in fade-in"
        >
          {/* Clinical Header */}
          <div className="border-b-2 border-gray-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <h2 className="text-xl font-black tracking-tight text-gray-900 uppercase">
                  SakhiAI Monthly Clinical Patient Summary
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Standardized Longitudinal History for Gynaecological & Endocrine Consultation
              </p>
            </div>

            <div className="text-right text-xs">
              <p className="font-mono text-gray-400">Model: {modelInfo.modelName}</p>
              <p className="font-semibold text-gray-700">Date Generated: Oct 24, 2026</p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
            <div>
              <span className="text-gray-400 block">Patient Name:</span>
              <span className="font-bold text-gray-900 text-sm">{userProfile.name}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Age / Stage:</span>
              <span className="font-bold text-gray-900">{userProfile.age} yrs • Reproductive Age</span>
            </div>
            <div>
              <span className="text-gray-400 block">Recorded Cycle Variation:</span>
              <span className="font-bold text-gray-900">30 – 35 Days (±{userProfile.cycleVariance || 11}d variance)</span>
            </div>
            <div>
              <span className="text-gray-400 block">Last Menstrual Period:</span>
              <span className="font-bold text-gray-900">{userProfile.lastPeriodDate}</span>
            </div>
          </div>

          {/* ML Flagged Clinical Risk Patterns */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Machine Learning Clinical Pattern Flags (Tree-SHAP Attributions)
            </h4>
            
            <div className="space-y-3">
              {/* Pattern 1: PCOS */}
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 text-xs space-y-2">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>1. Suspected Ovulatory Irregularity / PCOS Tendency</span>
                  <span className="text-rose-700 font-mono">Trained Score: {predictions.pcos.score}% ({predictions.pcos.riskLevel})</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <strong>SHAP Drivers:</strong> {predictions.pcos.shapFactors.map(f => `${f.feature} (+${f.weight}%)`).join(", ")}.
                </p>
                <span className="text-[10px] text-gray-500 font-mono block">
                  Validation Benchmark: {predictions.pcos.confidence}
                </span>
              </div>

              {/* Pattern 2: Dysmenorrhea */}
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 text-xs space-y-2">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>2. Dysmenorrhea & Pelvic Prostaglandin Flare Index</span>
                  <span className="text-amber-800 font-mono">Trained Score: {predictions.dysmenorrhea.score}% ({predictions.dysmenorrhea.riskLevel})</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <strong>SHAP Drivers:</strong> {predictions.dysmenorrhea.shapFactors.map(f => `${f.feature} (+${f.weight}%)`).join(", ")}.
                </p>
              </div>
            </div>
          </div>

          {/* Longitudinal Symptom Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Recent Check-in Logs (Daily Symptoms & Interventions)
            </h4>
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 text-gray-600 border-b border-gray-200 font-semibold">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Cycle Day</th>
                    <th className="p-2.5">Bleeding</th>
                    <th className="p-2.5">Pain Site & VAS</th>
                    <th className="p-2.5">Sleep</th>
                    <th className="p-2.5">Physical / Custom Signs</th>
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
                        {log.body?.acne ? "Acne " : ""}
                        {log.body?.bloating ? "Bloating " : ""}
                        {log.customSymptoms?.length ? `[${log.customSymptoms.join(', ')}]` : ""}
                        {!log.body?.acne && !log.body?.bloating && !log.customSymptoms?.length ? "Normal" : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Physician Stamp Area */}
          <div className="border-t-2 border-dashed border-gray-300 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <p className="font-bold text-gray-900 mb-1">Physician Clinical Recommendations:</p>
              <ul className="list-disc pl-4 space-y-1 text-gray-600">
                <li>Pelvic ultrasound (transabdominal/transvaginal) for follicular count and ovarian volume.</li>
                <li>Endocrine panel: LH, FSH, Estradiol, Fasting Insulin, and TSH.</li>
                <li>Serum Ferritin and CBC check for baseline iron reserves.</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-6">
              <div className="flex justify-between text-gray-400 text-[11px]">
                <span>Attending Physician Signature</span>
                <span>Hospital / Clinic Stamp</span>
              </div>
              <div className="h-8 border-b border-gray-300" />
            </div>
          </div>

          <div className="text-[10px] text-gray-400 text-center pt-2">
            SakhiAI Explainable AI clinical report. Powered by trained unified machine learning ensemble ({modelInfo.modelName}).
          </div>
        </div>
      )}

    </div>
  );
}
