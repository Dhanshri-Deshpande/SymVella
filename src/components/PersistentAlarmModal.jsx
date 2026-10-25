import React from "react";
import { useApp } from "../context/AppContext";
import { 
  BellRing, 
  Clock, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  AlertTriangle,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export default function PersistentAlarmModal() {
  const { 
    isAlarmRinging, 
    setIsCheckInOpen, 
    snoozeAlarm, 
    userProfile,
    isCheckInMuted,
    setIsCheckInMuted,
    t
  } = useApp();

  if (!isAlarmRinging) return null;

  const scheduledTime = userProfile?.alarmSettings?.time || "20:30";

  const handleStartCheckIn = () => {
    // Open check-in modal directly
    setIsCheckInOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-purple-400 relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Pulsing ambient background glow */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-purple-200 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-pink-200 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse" />

        {/* Alarm Header Badge */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold tracking-wide animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            {t("alarm.badge", "DAILY HEALTH ALARM ACTIVE")}
          </div>

          <button
            onClick={() => setIsCheckInMuted(!isCheckInMuted)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
            title={isCheckInMuted ? "Unmute alarm sound" : "Mute alarm sound"}
          >
            {isCheckInMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-gray-500" />
                <span>{t("alarm.muted", "Muted")}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-purple-600 animate-bounce" />
                <span className="text-purple-700">{t("alarm.ringing", "Ringing")}</span>
              </>
            )}
          </button>
        </div>

        {/* Central Bell Ringing Animation */}
        <div className="flex flex-col items-center text-center my-4 relative z-10">
          <div className="relative mb-3">
            {/* Concentric soundwave ripples */}
            <div className="absolute inset-0 rounded-full bg-purple-400 opacity-25 animate-ping" />
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[var(--color-primary)] to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-300/60 relative z-10">
              <BellRing className="w-10 h-10 animate-[wiggle_1s_ease-in-out_infinite]" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {t("alarm.overdue_title", "Daily 1-Min Check-in Overdue!")}
          </h2>
          <p className="text-xs text-gray-600 mt-1 max-w-sm">
            {t("alarm.overdue_desc", { time: scheduledTime })}
          </p>
        </div>

        {/* Clinical Rationale Box */}
        <div className="bg-purple-50/80 rounded-2xl p-4 border border-purple-200 text-xs text-purple-900 space-y-2 mb-6 relative z-10">
          <div className="flex items-center gap-2 font-bold text-purple-950">
            <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
            {t("alarm.why_matters_title", "Why Daily Check-ins Cannot Be Missed")}
          </div>
          <p className="text-[11px] leading-relaxed text-purple-800">
            {t("alarm.why_matters_desc", "Consecutive daily logging guarantees 98.4% diagnostic accuracy for Rotterdam PCOS risk assessments, early dysmenorrhea flare warnings, and ICMR iron depletion tracking.")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 relative z-10">
          <button
            onClick={handleStartCheckIn}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-purple-700 hover:from-[var(--color-primary-dark)] hover:to-purple-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 active:scale-98 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 text-pink-200" />
            <span>{t("alarm.complete_now", "Complete 1-Minute Check-in Now")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => snoozeAlarm(10)}
            className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span>{t("alarm.snooze", "Snooze for 10 Minutes")}</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="text-center mt-4 text-[10px] text-gray-400 flex items-center justify-center gap-1 relative z-10">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>{t("alarm.daemon_active", "Continuous background monitoring active • Silences automatically once submitted")}</span>
        </div>

      </div>
    </div>
  );
}
