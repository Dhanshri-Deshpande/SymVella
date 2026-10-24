import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Bell, Clock, Volume2, CheckCircle2, AlertCircle, ArrowRight, X } from "lucide-react";

export default function AlarmEscalationModal({ isOpen, onClose }) {
  const { userProfile, setUserProfile, playChime, setIsCheckInOpen } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const handleTestSound = (type) => {
    setIsPlayingAudio(true);
    playChime(type);
    setTimeout(() => setIsPlayingAudio(false), 900);
  };

  const steps = [
    {
      step: 1,
      title: "1. Primary Push Notification",
      time: userProfile.alarmSettings.time,
      badge: "Standard Notice",
      badgeColor: "bg-blue-100 text-blue-700",
      content: `"Time for your daily check-in! It takes only 1 minute."`,
      actionLabel: "Simulate Trigger",
      action: () => handleTestSound("gentle")
    },
    {
      step: 2,
      title: "2. Gentle Reminder Alarm (Grace Window)",
      time: "+30 Mins (Grace Exceeded)",
      badge: "Audible Alarm",
      badgeColor: "bg-amber-100 text-amber-700",
      content: "Fires melodic chime with soft vibration to prevent symptom recall loss.",
      actionLabel: "Test Melodic Chime",
      action: () => handleTestSound("gentle")
    },
    {
      step: 3,
      title: "3. Rapid 3-Question Nudge",
      time: "Later Evening",
      badge: "Quick Catch-up",
      badgeColor: "bg-purple-100 text-purple-700",
      content: "Shortens check-in to just 3 essential taps: Flow, Peak Pain, and Sleep.",
      actionLabel: "Open Quick Check-in",
      action: () => {
        onClose();
        setIsCheckInOpen(true);
      }
    },
    {
      step: 4,
      title: "4. Next-Morning Back-Fill",
      time: "Following Day (08:00 AM)",
      badge: "No Shame / Streak Safe",
      badgeColor: "bg-emerald-100 text-emerald-700",
      content: "Gently presents yesterday's missed log with 1-tap estimate to keep data continuous.",
      actionLabel: "Back-fill Yesterday",
      action: () => {
        onClose();
        setIsCheckInOpen(true);
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-pink-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-badge-bg)] text-[var(--color-primary)] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Smart Alarm Escalation Flow</h3>
              <p className="text-xs text-gray-500">How SakhiAI keeps symptom data continuous without annoyance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Configuration Bar */}
        <div className="my-4 p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Preferred Daily Check-in Time:</span>
            <input
              type="time"
              value={userProfile.alarmSettings.time}
              onChange={(e) => setUserProfile(prev => ({
                ...prev,
                alarmSettings: { ...prev.alarmSettings, time: e.target.value }
              }))}
              className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 font-mono font-medium text-gray-900"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Grace Window:</span>
            <span className="bg-white px-2 py-1 rounded-lg border border-gray-300 font-mono">30 mins</span>
          </div>
        </div>

        {/* Step-by-Step Flow */}
        <div className="space-y-3 my-4">
          {steps.map((s) => (
            <div
              key={s.step}
              className={`p-3.5 rounded-2xl border transition-all ${
                currentStep === s.step
                  ? "border-[var(--color-primary)] bg-[var(--color-bg-soft)] shadow-sm"
                  : "border-gray-200 bg-white opacity-85 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-gray-900">{s.title}</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.badgeColor}`}>
                  {s.badge}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2 italic">{s.content}</p>
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-gray-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" /> {s.time}
                </span>
                <button
                  onClick={s.action}
                  className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5" /> {s.actionLabel}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <span>Smart Quiet Hours: 10:00 PM – 07:00 AM (Zero disturbance)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
