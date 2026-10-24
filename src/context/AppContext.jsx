import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_USER_PROFILE, INITIAL_SYMPTOM_LOGS } from "../data/sampleData";
import { generateDailyReport } from "../data/ghareluUpayEngine";
import { synthesizeGnaniSpeech, stopSpeechPlayback } from "../services/gnaniService";

const AppContext = createContext();

export function AppProvider({ children }) {
  const theme = "blossom-rows";
  const [activeTab, setActiveTab] = useState("home");
  // 1. Authentication & Registered Patient State (loaded from localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("symvella_current_user") || localStorage.getItem("sakhi_current_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.firstName || parsed.name)) {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      firstName: "Dhanshri",
      lastName: "",
      email: "dhanshri@healthmail.com",
      phone: "9876543210",
      location: "Pune, Maharashtra",
      dob: "1998-04-15",
      age: 28,
      isVerified: true
    };
  });

  // 2. User Profile state (dynamically synthesized with currentUser and saved profile)
  const [userProfile, setUserProfile] = useState(() => {
    let base = { ...INITIAL_USER_PROFILE };
    const savedProfile = localStorage.getItem("symvella_user_profile") || localStorage.getItem("sakhi_user_profile");
    if (savedProfile) {
      try {
        base = { ...base, ...JSON.parse(savedProfile) };
      } catch (e) {}
    }
    const savedUser = localStorage.getItem("symvella_current_user") || localStorage.getItem("sakhi_current_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        const fullName = [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || u.name || u.firstName;
        if (fullName) base.name = fullName;
        if (u.age) base.age = Number(u.age);
        if (u.location) base.location = u.location;
        if (u.email) base.email = u.email;
        if (u.phone) base.phone = u.phone;
        if (u.dob) base.dob = u.dob;
      } catch (e) {}
    } else {
      base.name = "Dhanshri";
    }
    return base;
  });

  const [language, setLanguage] = useState("en");
  const [symptomLogs, setSymptomLogs] = useState(INITIAL_SYMPTOM_LOGS);

  // Keep localStorage synced whenever userProfile or currentUser changes
  useEffect(() => {
    if (userProfile && userProfile.name) {
      localStorage.setItem("symvella_user_profile", JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    if (currentUser && (currentUser.firstName || currentUser.name)) {
      localStorage.setItem("symvella_current_user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Default to false so the user is greeted with the Login / Sign In page first!
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("symvella_authenticated") === "true" || sessionStorage.getItem("sakhi_authenticated") === "true";
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const login = ({ identifier, otp }) => {
    // Check if we have an existing registered user
    const savedUserStr = localStorage.getItem("symvella_current_user") || localStorage.getItem("sakhi_current_user");
    let userToUse = null;
    if (savedUserStr) {
      try {
        userToUse = JSON.parse(savedUserStr);
      } catch (e) {}
    }

    if (!userToUse || !userToUse.firstName) {
      const cleanIdent = (identifier || "").trim();
      const isEmail = cleanIdent.includes("@");
      const isPhone = /^\d+$/.test(cleanIdent);
      let derivedFirst = "Dhanshri";
      if (!isEmail && !isPhone && cleanIdent.length > 0) {
        derivedFirst = cleanIdent.split(" ")[0];
      } else if (isEmail) {
        derivedFirst = cleanIdent.split("@")[0].replace(/[._-]/g, " ");
        derivedFirst = derivedFirst.charAt(0).toUpperCase() + derivedFirst.slice(1);
      }
      userToUse = {
        firstName: derivedFirst,
        lastName: "",
        email: isEmail ? cleanIdent : "dhanshri@healthmail.com",
        phone: isPhone ? cleanIdent : "9876543210",
        location: "Pune, Maharashtra",
        dob: "1998-04-15",
        age: 28,
        isVerified: true
      };
      localStorage.setItem("symvella_current_user", JSON.stringify(userToUse));
    }

    const fullName = [userToUse.firstName, userToUse.lastName].filter(Boolean).join(" ").trim() || userToUse.name || userToUse.firstName;

    setCurrentUser(userToUse);
    setUserProfile(prev => {
      const updated = {
        ...prev,
        name: fullName,
        age: Number(userToUse.age) || prev.age,
        location: userToUse.location || prev.location,
        email: userToUse.email || prev.email,
        phone: userToUse.phone || prev.phone,
        dob: userToUse.dob || prev.dob
      };
      localStorage.setItem("symvella_user_profile", JSON.stringify(updated));
      return updated;
    });

    setIsAuthenticated(true);
    setActiveTab("home");
    sessionStorage.setItem("symvella_authenticated", "true");
    localStorage.setItem("symvella_authenticated", "true");
    setIsAuthModalOpen(false);
  };

  const signup = (userData) => {
    const fullName = [userData.firstName, userData.lastName].filter(Boolean).join(" ").trim() || userData.firstName;
    const registeredUser = {
      ...userData,
      name: fullName
    };

    setCurrentUser(registeredUser);
    localStorage.setItem("symvella_current_user", JSON.stringify(registeredUser));

    setUserProfile(prev => {
      const updated = {
        ...prev,
        name: fullName,
        age: Number(userData.age) || prev.age,
        location: userData.location || prev.location,
        email: userData.email || prev.email,
        phone: userData.phone || prev.phone,
        dob: userData.dob || prev.dob
      };
      localStorage.setItem("symvella_user_profile", JSON.stringify(updated));
      return updated;
    });

    setIsAuthenticated(true);
    setActiveTab("home");
    sessionStorage.setItem("symvella_authenticated", "true");
    localStorage.setItem("symvella_authenticated", "true");
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("symvella_authenticated");
    localStorage.removeItem("symvella_authenticated");
    sessionStorage.removeItem("sakhi_authenticated");
    localStorage.removeItem("sakhi_authenticated");
    setActiveTab("home");
    setIsAuthModalOpen(false);
  };
  
  // Modals & Overlays
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isDiscreetMode, setIsDiscreetMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false); // Period date entering modal

  // Daily Report Modal
  const [isDailyReportOpen, setIsDailyReportOpen] = useState(false);
  const [dailyReportData, setDailyReportData] = useState(() => {
    return generateDailyReport(INITIAL_SYMPTOM_LOGS[INITIAL_SYMPTOM_LOGS.length - 1], "en");
  });

  // Historical Period Dates Data (Dynamic state from starting to till date)
  const [periodHistory, setPeriodHistory] = useState([
    {
      id: "c1",
      cycleNum: "Cycle 1",
      startDate: "2026-05-12",
      endDate: "2026-05-17",
      displayRange: "12 May – 17 May",
      cycleLength: 30,
      bleedingDays: 5,
      flow: "Normal",
      status: "Regular",
      notes: "Mild cramping on Day 1-2"
    },
    {
      id: "c2",
      cycleNum: "Cycle 2",
      startDate: "2026-06-12",
      endDate: "2026-06-17",
      displayRange: "12 Jun – 17 Jun",
      cycleLength: 31,
      bleedingDays: 5,
      flow: "Normal",
      status: "Regular",
      notes: "Normal flow, good hydration"
    },
    {
      id: "c3",
      cycleNum: "Cycle 3",
      startDate: "2026-07-14",
      endDate: "2026-07-19",
      displayRange: "14 Jul – 19 Jul",
      cycleLength: 32,
      bleedingDays: 5,
      flow: "Heavy",
      status: "Slight Delay (+2d)",
      notes: "Heavy flow with fatigue"
    },
    {
      id: "c4",
      cycleNum: "Cycle 4",
      startDate: "2026-08-18",
      endDate: "2026-08-22",
      displayRange: "18 Aug – 22 Aug",
      cycleLength: 35,
      bleedingDays: 4,
      flow: "Moderate",
      status: "Irregular (+5d)",
      notes: "Work stress, delayed ovulation"
    },
    {
      id: "c5",
      cycleNum: "Cycle 5",
      startDate: "2026-09-22",
      endDate: "2026-09-27",
      displayRange: "22 Sep – 27 Sep",
      cycleLength: 35,
      bleedingDays: 5,
      flow: "Moderate",
      status: "Irregular (+5d)",
      notes: "Acne breakouts reported"
    },
    {
      id: "c6",
      cycleNum: "Cycle 6 (Current)",
      startDate: "2026-10-04",
      endDate: "2026-10-09",
      displayRange: "04 Oct – 09 Oct",
      cycleLength: 32,
      bleedingDays: 5,
      flow: "Light / Luteal",
      status: "Active (Day 21)",
      notes: "Next period expected in ~6 days"
    }
  ]);

  // Alarm & Escalation Simulation
  const [alarmEscalationStage, setAlarmEscalationStage] = useState("idle");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "blossom-rows");
  }, []);

  // Sync daily report language whenever user toggles between English & Hindi
  useEffect(() => {
    if (symptomLogs.length > 0) {
      setDailyReportData(generateDailyReport(symptomLogs[symptomLogs.length - 1], language, userProfile, periodHistory));
    }
  }, [language]);

  // Add a new period date entry from user input
  const addPeriodEntry = ({ startDate, endDate, flow, painLevel, notes }) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const bleedingDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    // Calculate cycle length compared to last entry
    const lastEntry = periodHistory[periodHistory.length - 1];
    let calculatedCycleLength = 30;
    if (lastEntry) {
      const prevStart = new Date(lastEntry.startDate);
      const cycleDiff = Math.abs(start - prevStart);
      calculatedCycleLength = Math.max(20, Math.min(45, Math.ceil(cycleDiff / (1000 * 60 * 60 * 24))));
    }

    const startMonth = start.toLocaleDateString("en-IN", { month: "short", day: "2-digit" });
    const endMonth = end.toLocaleDateString("en-IN", { month: "short", day: "2-digit" });
    const displayRange = `${startMonth} – ${endMonth}`;

    const newCycle = {
      id: `c_${Date.now()}`,
      cycleNum: `Cycle ${periodHistory.length + 1}`,
      startDate,
      endDate,
      displayRange,
      cycleLength: calculatedCycleLength,
      bleedingDays,
      flow: flow || "Normal",
      status: calculatedCycleLength > 34 ? "Irregular Delay" : "Regular",
      notes: notes || "Logged by user"
    };

    setPeriodHistory(prev => [...prev, newCycle]);
    setUserProfile(prev => ({
      ...prev,
      lastPeriodDate: startDate,
      cycleLength: calculatedCycleLength
    }));
  };

  // Add a new symptom log entry & generate daily report
  const addSymptomLog = (newLog) => {
    const formatted = {
      date: new Date().toISOString().split("T")[0],
      cycleDay: (symptomLogs.length % 28) + 1,
      ...newLog
    };
    setSymptomLogs(prev => [...prev, formatted]);

    const generated = generateDailyReport(formatted, language, userProfile, periodHistory);
    setDailyReportData(generated);
    setIsDailyReportOpen(true);
  };

  // Play a gentle web audio chime
  const playChime = (type = "gentle") => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "urgent") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch (e) {
      console.warn("Audio error:", e);
    }
  };

  // Text-to-Speech synthesizer (Gnani.ai Timbre TTS API with browser Web Speech fallback)
  const speakText = async (text, langCode = language) => {
    try {
      const res = await synthesizeGnaniSpeech({ text, language: langCode });
      return res;
    } catch (e) {
      console.warn("TTS error:", e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        signup,
        logout,
        activeTab,
        setActiveTab,
        userProfile,
        setUserProfile,
        language,
        setLanguage,
        symptomLogs,
        addSymptomLog,
        periodHistory,
        addPeriodEntry,
        isPeriodModalOpen,
        setIsPeriodModalOpen,
        isCheckInOpen,
        setIsCheckInOpen,
        isDailyReportOpen,
        setIsDailyReportOpen,
        dailyReportData,
        setDailyReportData,
        isSOSOpen,
        setIsSOSOpen,
        isDiscreetMode,
        setIsDiscreetMode,
        isChatOpen,
        setIsChatOpen,
        alarmEscalationStage,
        setAlarmEscalationStage,
        playChime,
        speakText,
        stopSpeechPlayback
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}
