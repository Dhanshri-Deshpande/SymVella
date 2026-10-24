import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Printer, 
  Calendar, 
  FileText, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Heart,
  Droplet,
  Clock,
  Sparkles,
  TrendingUp,
  Moon
} from "lucide-react";

export default function ReportsView() {
  const { symptomLogs, userProfile } = useApp();
  
  // Exactly 2 options: Weekly Report and Monthly Report
  const [reportType, setReportType] = useState("weekly");

  const recent7Logs = symptomLogs.slice(-7);
  const avgSleep7 = (recent7Logs.reduce((acc, l) => acc + (l.sleep?.hours || 7), 0) / (recent7Logs.length || 1)).toFixed(1);
  const avgPain7 = (recent7Logs.reduce((acc, l) => acc + (l.pain?.intensity || 0), 0) / (recent7Logs.length || 1)).toFixed(1);
  const waterAvg7 = (recent7Logs.reduce((acc, l) => acc + (l.lifestyle?.waterLiters || 2), 0) / (recent7Logs.length || 1)).toFixed(1);

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
                Health Analytics
              </span>
              <span className="text-xs text-gray-400">Weekly & Monthly Insights</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1">Health Reports</h2>
            <p className="text-xs text-gray-500">
              Structured summaries for your personal wellness tracking and clinical consultations
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
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Weekly Health Aggregation (Past 7 Days)
                </h3>
                <p className="text-xs text-gray-500">Summary of check-ins, sleep, and pain intensity</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                100% Continuous Streak
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-[var(--color-border)]">
                <span className="text-[11px] text-gray-500 block">Logged Days</span>
                <span className="text-xl font-bold text-[var(--color-primary-dark)] font-mono">7 / 7 Days</span>
              </div>
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
                <span className="text-[11px] text-gray-500 block">Average Sleep</span>
                <span className="text-xl font-bold text-blue-900 font-mono">{avgSleep7} Hours</span>
              </div>
              <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-100">
                <span className="text-[11px] text-gray-500 block">Average Pain</span>
                <span className="text-xl font-bold text-rose-900 font-mono">{avgPain7} / 10</span>
              </div>
              <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <span className="text-[11px] text-gray-500 block">Avg Hydration</span>
                <span className="text-xl font-bold text-emerald-900 font-mono">{waterAvg7} L / Day</span>
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
              <p className="font-mono text-gray-400">Report Ref: #SKH-MONTHLY-2026-OCT</p>
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
              <span className="font-bold text-gray-900">30 – 35 Days (±11d variance)</span>
            </div>
            <div>
              <span className="text-gray-400 block">Last Menstrual Period:</span>
              <span className="font-bold text-gray-900">{userProfile.lastPeriodDate}</span>
            </div>
          </div>

          {/* Month Overview Summary */}
          <div className="p-4 rounded-xl bg-purple-50/60 border border-[var(--color-border)] text-xs text-gray-800 space-y-2">
            <h4 className="font-bold text-[var(--color-primary-dark)] text-sm">Monthly Cycle Evaluation:</h4>
            <p>
              Over the recorded period cycles, cycle length has fluctuated between 30 and 35 days, with delayed intervals in August and September. Luteal phase check-ins highlight recurring cystic acne (6 days) and mid-cycle pelvic cramping peaking at 6/10.
            </p>
          </div>

          {/* Flagged Patterns */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> Physician Clinical Alert
            </h4>
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 text-xs space-y-1">
              <div className="flex justify-between font-bold text-gray-900">
                <span>Suspected Ovulatory Irregularity / PCOS Tendency</span>
                <span className="text-rose-700">Score: 78% (Moderate-High)</span>
              </div>
              <p className="text-gray-700">
                Attribution: 11-day cycle variability + recurring luteal acne and afternoon fatigue. Suggested: Day-3 hormone profile (LH, FSH, Prolactin, Fasting Insulin) and pelvic sonography.
              </p>
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
                <li>Review ultrasound scan for ovarian volume and follicular count.</li>
                <li>Evaluate Serum Ferritin and Hemoglobin levels.</li>
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
            SakhiAI Explainable AI clinical report. Formatted for standardized medical consultation.
          </div>
        </div>
      )}

    </div>
  );
}
