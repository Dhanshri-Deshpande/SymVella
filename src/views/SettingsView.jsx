import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { LIFE_STAGES } from "../data/healthKnowledge";
import { 
  User, 
  Settings, 
  Heart, 
  Calendar, 
  Phone, 
  Lock, 
  Bell, 
  Trash2, 
  Save, 
  CheckCircle2, 
  Volume2, 
  ShieldCheck, 
  Sparkles,
  ChevronRight
} from "lucide-react";
import confetti from "canvas-confetti";

export default function SettingsView() {
  const { 
    userProfile, 
    setUserProfile, 
    playChime, 
    setIsDiscreetMode,
    setActiveTab 
  } = useApp();

  // Form states
  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(userProfile.age);
  const [lifeStage, setLifeStage] = useState(userProfile.lifeStage);
  const [cycleLength, setCycleLength] = useState(userProfile.cycleLength);
  const [periodDuration, setPeriodDuration] = useState(userProfile.periodDuration);
  const [doctorName, setDoctorName] = useState(userProfile.emergencyContact.name);
  const [doctorPhone, setDoctorPhone] = useState(userProfile.emergencyContact.phone);
  const [checkInTime, setCheckInTime] = useState(userProfile.alarmSettings.time);
  const [discreetPin, setDiscreetPin] = useState(userProfile.discreetPin || "1234");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name,
      age: Number(age),
      lifeStage,
      cycleLength: Number(cycleLength),
      periodDuration: Number(periodDuration),
      discreetPin,
      alarmSettings: {
        ...prev.alarmSettings,
        time: checkInTime
      },
      emergencyContact: {
        ...prev.emergencyContact,
        name: doctorName,
        phone: doctorPhone
      }
    }));

    setSavedSuccess(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#965293', '#EE9FE1', '#748DE3', '#3B2E58']
    });

    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to delete all stored health records? This action adheres to the DPDP Act and cannot be undone.")) {
      localStorage.clear();
      alert("All local symptom logs and private health records have been permanently cleared.");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[var(--color-border)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-badge-bg)] text-[var(--color-primary)] flex items-center justify-center font-bold text-lg">
              {name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">My Profile & Settings</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[var(--color-primary)]">
                  Personal Vault
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Manage your life stage, cycle parameters, emergency doctor, and privacy pin
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-2xl bg-[var(--color-primary)] hover:opacity-95 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile and health preferences saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECTION 1: Personal Details */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)] space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--color-primary)]" /> Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Age (Years)</label>
              <input
                type="number"
                min="10"
                max="90"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Life Stage (MOVED FROM NAVBAR HERE WITH RICH CARDS) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)] space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--color-primary)]" /> Current Life Stage
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              SakhiAI adapts its daily check-in questions, dietary tips, and reports based on your selected biological stage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {LIFE_STAGES.map((ls) => {
              const isSelected = lifeStage === ls.id;
              return (
                <button
                  key={ls.id}
                  type="button"
                  onClick={() => setLifeStage(ls.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold shadow-xs ring-2 ring-[var(--color-primary)]"
                      : "border-gray-200 bg-white hover:border-pink-300 text-gray-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-gray-900">{ls.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)]" />}
                    </div>
                    <p className="text-[11px] text-gray-500 font-normal leading-relaxed">{ls.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: Menstrual Cycle Defaults */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)] space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--color-primary)]" /> Typical Cycle Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-700">Average Cycle Length:</span>
                <span className="font-bold text-[var(--color-primary)] font-mono">{cycleLength} Days</span>
              </div>
              <input
                type="range"
                min="21"
                max="45"
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
                className="w-full accent-[var(--color-primary)] cursor-pointer"
              />
              <span className="text-[10px] text-gray-400">Normal healthy range is between 28 and 35 days</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-700">Typical Period Bleeding Duration:</span>
                <span className="font-bold text-[var(--color-primary)] font-mono">{periodDuration} Days</span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                value={periodDuration}
                onChange={(e) => setPeriodDuration(e.target.value)}
                className="w-full accent-[var(--color-primary)] cursor-pointer"
              />
              <span className="text-[10px] text-gray-400">Normal duration is between 3 and 7 days</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: Emergency Doctor & Primary Contact */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)] space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Phone className="w-4 h-4 text-rose-600" /> Registered Physician & Emergency Contact
          </h3>
          <p className="text-xs text-gray-500">
            This contact is displayed on your 1-tap SOS modal and printed on your Clinical Summary PDF.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Doctor / Contact Name</label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={doctorPhone}
                onChange={(e) => setDoctorPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: Smart Alarm Reminder Timing */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-600" /> Daily Check-in Alarm & Reminders
            </h3>
            <button
              type="button"
              onClick={() => playChime("gentle")}
              className="text-xs text-[var(--color-primary)] font-semibold flex items-center gap-1 hover:underline"
            >
              <Volume2 className="w-3.5 h-3.5" /> Test Sound Chime
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Preferred Check-in Time</label>
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-mono"
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 flex flex-col justify-center">
              <span><strong>Quiet Hours:</strong> 10:00 PM – 07:00 AM (Zero disturbance)</span>
              <span className="text-[11px] text-gray-400 mt-0.5">Grace period of 30 minutes before gentle chime</span>
            </div>
          </div>
        </div>

        {/* SECTION 6: Privacy Vault & Discreet PIN */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-700" /> Privacy Vault & Discreet PIN
            </h3>
            <button
              type="button"
              onClick={() => setIsDiscreetMode(true)}
              className="text-xs text-slate-600 font-semibold hover:underline"
            >
              Test Stealth Mode
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                4-Digit Calculator Vault PIN (To restore app from disguise)
              </label>
              <input
                type="password"
                maxLength={4}
                value={discreetPin}
                onChange={(e) => setDiscreetPin(e.target.value)}
                className="w-32 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-center text-sm font-mono tracking-widest text-gray-900"
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 flex flex-col justify-center">
              <span><strong>Discreet Mode:</strong> Hides app behind a functional calculator. Enter PIN to reveal your health dashboard.</span>
            </div>
          </div>

          {/* Delete All Data */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-800">Clear All Health Records</p>
              <p className="text-[11px] text-gray-500">Permanently wipes all local symptom logs & cycle data</p>
            </div>
            <button
              type="button"
              onClick={handleClearData}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Wipe My Data
            </button>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[var(--color-primary)] hover:opacity-95 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <Save className="w-4 h-4" /> Save All Profile Changes ✨
          </button>
        </div>

      </form>

    </div>
  );
}
