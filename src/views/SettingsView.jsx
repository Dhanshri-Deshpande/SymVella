import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { LIFE_STAGES } from "../data/healthKnowledge";
import { 
  User, 
  Settings, 
  Calendar, 
  Bell, 
  Trash2, 
  Save, 
  CheckCircle2, 
  Volume2, 
  Sparkles,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  LogOut
} from "lucide-react";
import confetti from "canvas-confetti";

export default function SettingsView() {
  const { 
    userProfile, 
    setUserProfile, 
    playChime, 
    setActiveTab,
    currentUser,
    setCurrentUser,
    logout
  } = useApp();

  // Form states
  const [name, setName] = useState(
    [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ").trim() || userProfile.name || "Dhanshri"
  );
  const [age, setAge] = useState(userProfile.age);
  const [lifeStage, setLifeStage] = useState(userProfile.lifeStage);
  const [cycleLength, setCycleLength] = useState(userProfile.cycleLength);
  const [periodDuration, setPeriodDuration] = useState(userProfile.periodDuration);
  const [checkInTime, setCheckInTime] = useState(userProfile.alarmSettings?.time || "20:30");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    const parts = trimmed.split(" ");
    const fName = parts[0] || trimmed;
    const lName = parts.slice(1).join(" ") || "";

    setCurrentUser(prev => ({
      ...prev,
      firstName: fName,
      lastName: lName,
      age: Number(age)
    }));

    setUserProfile(prev => ({
      ...prev,
      name: trimmed,
      age: Number(age),
      lifeStage,
      cycleLength: Number(cycleLength),
      periodDuration: Number(periodDuration),
      alarmSettings: {
        ...prev.alarmSettings,
        time: checkInTime
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
              {(currentUser?.firstName?.[0] || name[0] || "P")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">Patient Profile & Settings</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Verified Patient
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Manage your registered credentials, biological life stage, and cycle parameters
              </p>
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile and health preferences saved successfully!</span>
          </div>
        )}
      </div>

      {/* REGISTERED ACCOUNT & AUTHENTICATION DETAILS (First Name, Last Name, Mobile, Email, Location, DOB) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
              Registered Account & Identity Verification
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Verified through email OTP authentication (Adheres to age 13+ digital consent protocols)
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          {/* Name */}
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
            <span className="text-[11px] text-gray-400 block mb-0.5 flex items-center gap-1">
              <User className="w-3 h-3 text-[var(--color-primary)]" /> Registered Patient Name
            </span>
            <span className="font-bold text-gray-900 text-sm">
              {currentUser?.firstName || "Pooja"} {currentUser?.lastName || "Sharma"}
            </span>
          </div>

          {/* Mobile No */}
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
            <span className="text-[11px] text-gray-400 block mb-0.5 flex items-center gap-1">
              <Phone className="w-3 h-3 text-[var(--color-primary)]" /> Mobile Number
            </span>
            <span className="font-bold text-gray-900 font-mono text-sm">
              +91 {currentUser?.phone || "9876543210"}
            </span>
          </div>

          {/* Email for OTP */}
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
            <span className="text-[11px] text-gray-400 block mb-0.5 flex items-center gap-1">
              <Mail className="w-3 h-3 text-[var(--color-primary)]" /> Email (OTP Verified)
            </span>
            <span className="font-bold text-gray-900 text-sm truncate block" title={currentUser?.email}>
              {currentUser?.email || "pooja.sharma@healthmail.com"}
            </span>
          </div>

          {/* Location */}
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
            <span className="text-[11px] text-gray-400 block mb-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[var(--color-primary)]" /> Registered Location
            </span>
            <span className="font-bold text-gray-900 text-sm">
              {currentUser?.location || "Pune, Maharashtra"}
            </span>
          </div>

          {/* DOB & Age (13+ Validated) */}
          <div className="p-3.5 bg-purple-50/70 rounded-2xl border border-purple-200 sm:col-span-2">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] text-purple-900 font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[var(--color-primary)]" /> Date of Birth (DOB)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Age 13+ Verified
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-gray-900 font-mono text-sm">
                {currentUser?.dob || "1998-04-15"}
              </span>
              <span className="text-xs text-purple-700 font-medium">
                • {currentUser?.age || age} Years Old (Valid for reproductive care)
              </span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECTION 1: Personal Details */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)] space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--color-primary)]" /> Profile Display Name & Age
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Age in Years (Must be 13+)</label>
              <input
                type="number"
                min="13"
                max="90"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Life Stage */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)] space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--color-primary)]" /> Current Biological Life Stage
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Symvella adapts its clinical evaluations, dietary guidance, and reports based on your selected biological stage.
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
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
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
            <Calendar className="w-4 h-4 text-[var(--color-primary)]" /> Baseline Menstrual Parameters
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
              <span className="text-[10px] text-gray-400">Normal physiological range is between 28 and 35 days</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-700">Typical Bleeding Duration:</span>
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

        {/* SECTION 4: Daily Check-in Reminder Timing */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-600" /> Daily Clinical Check-in Reminders
            </h3>
            <button
              type="button"
              onClick={() => playChime("gentle")}
              className="text-xs text-[var(--color-primary)] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" /> Test Sound Chime
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Preferred Reminder Time</label>
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

        {/* SECTION 5: Data Privacy & Records */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Data Privacy & Medical Records
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                All health logs are stored locally on your device under strict DPDP Act privacy standards.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-bold text-gray-800">Clear All Health Records</p>
              <p className="text-[11px] text-gray-500">Permanently wipes all local symptom logs, cycles, and history</p>
            </div>
            <button
              type="button"
              onClick={handleClearData}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Wipe My Data
            </button>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[var(--color-primary)] hover:opacity-95 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Profile Preferences ✨
          </button>
        </div>

      </form>

    </div>
  );
}
