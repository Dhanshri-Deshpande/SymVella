// Realistic 30-day historical data for Symvella prototype demonstrations

export const INITIAL_USER_PROFILE = {
  name: "Pooja Sharma",
  age: 26,
  lifeStage: "regular", // "regular", "pcos", "ttc", "pregnancy", etc.
  cycleLength: 32,
  periodDuration: 5,
  lastPeriodDate: "2026-10-04",
  cycleVariance: 11, // High variance for PCOS demonstration
  hasWeightFluctuation: true,
  preferredLanguage: "en",
  discreetPin: "1234",
  isDiscreetMode: false,
  alarmSettings: {
    enabled: false,
    time: "",
    graceMinutes: 30,
    tone: "calm-bell",
    vibrate: true,
    autoNudge: true
  },
  emergencyContact: {
    name: "Dr. Kavita Verma (Gynaecologist)",
    phone: "+91 98765 43210",
    relation: "Physician"
  }
};

export const INITIAL_SYMPTOM_LOGS = [
  { date: "2026-10-10", cycleDay: 7, menstrual: { flow: "none", clotting: false }, pain: { location: "none", intensity: 1 }, mood: { level: 4, label: "Good" }, sleep: { hours: 7.5, fatigueLevel: 3 }, lifestyle: { waterLiters: 2.2, stress: 3 } },
  { date: "2026-10-11", cycleDay: 8, menstrual: { flow: "none", clotting: false }, pain: { location: "none", intensity: 1 }, mood: { level: 4, label: "Energetic" }, sleep: { hours: 8.0, fatigueLevel: 2 }, lifestyle: { waterLiters: 2.5, stress: 2 } },
  { date: "2026-10-12", cycleDay: 9, menstrual: { flow: "none", clotting: false }, pain: { location: "head", intensity: 2 }, mood: { level: 3, label: "Calm" }, sleep: { hours: 7.0, fatigueLevel: 3 }, lifestyle: { waterLiters: 2.0, stress: 4 } },
  { date: "2026-10-13", cycleDay: 10, menstrual: { flow: "none", clotting: false }, pain: { location: "none", intensity: 1 }, mood: { level: 4, label: "Focused" }, sleep: { hours: 7.5, fatigueLevel: 2 }, lifestyle: { waterLiters: 2.1, stress: 3 } },
  { date: "2026-10-14", cycleDay: 11, menstrual: { flow: "none", clotting: false }, pain: { location: "pelvic", intensity: 3 }, mood: { level: 3, label: "Normal" }, sleep: { hours: 6.8, fatigueLevel: 4 }, lifestyle: { waterLiters: 1.8, stress: 5 } },
  { date: "2026-10-15", cycleDay: 12, menstrual: { flow: "none", clotting: false }, pain: { location: "pelvic", intensity: 4 }, mood: { level: 4, label: "High Energy" }, sleep: { hours: 7.2, fatigueLevel: 3 }, lifestyle: { waterLiters: 2.3, stress: 3 } }, // Ovulation
  { date: "2026-10-16", cycleDay: 13, menstrual: { flow: "none", clotting: false }, pain: { location: "none", intensity: 2 }, mood: { level: 3, label: "Normal" }, sleep: { hours: 7.0, fatigueLevel: 3 }, lifestyle: { waterLiters: 2.0, stress: 4 } },
  { date: "2026-10-17", cycleDay: 14, menstrual: { flow: "none", clotting: false }, pain: { location: "none", intensity: 1 }, mood: { level: 4, label: "Good" }, sleep: { hours: 7.8, fatigueLevel: 2 }, lifestyle: { waterLiters: 2.4, stress: 3 } },
  { date: "2026-10-18", cycleDay: 15, menstrual: { flow: "none", clotting: false }, pain: { location: "none", intensity: 2 }, mood: { level: 3, label: "Normal" }, sleep: { hours: 6.5, fatigueLevel: 5 }, lifestyle: { waterLiters: 1.7, stress: 6 } },
  { date: "2026-10-19", cycleDay: 16, menstrual: { flow: "none", clotting: false }, pain: { location: "breasts", intensity: 3 }, mood: { level: 3, label: "Sensitive" }, sleep: { hours: 6.2, fatigueLevel: 5 }, lifestyle: { waterLiters: 1.9, stress: 6 } },
  { date: "2026-10-20", cycleDay: 17, menstrual: { flow: "none", clotting: false }, pain: { location: "breasts", intensity: 4 }, mood: { level: 2, label: "Irritable" }, sleep: { hours: 6.0, fatigueLevel: 6 }, lifestyle: { waterLiters: 1.6, stress: 7 } },
  { date: "2026-10-21", cycleDay: 18, menstrual: { flow: "none", clotting: false }, pain: { location: "lower_back", intensity: 5 }, mood: { level: 2, label: "Anxious" }, sleep: { hours: 5.8, fatigueLevel: 7 }, lifestyle: { waterLiters: 1.5, stress: 8 }, body: { acne: true } },
  { date: "2026-10-22", cycleDay: 19, menstrual: { flow: "none", clotting: false }, pain: { location: "pelvic", intensity: 6 }, mood: { level: 2, label: "Fatigued" }, sleep: { hours: 6.0, fatigueLevel: 7 }, lifestyle: { waterLiters: 1.8, stress: 7 }, body: { acne: true, hairFall: true } },
  { date: "2026-10-23", cycleDay: 20, menstrual: { flow: "none", clotting: false }, pain: { location: "pelvic", intensity: 5 }, mood: { level: 3, label: "Restless" }, sleep: { hours: 6.2, fatigueLevel: 6 }, lifestyle: { waterLiters: 1.9, stress: 6 }, body: { acne: true } },
  { date: "2026-10-24", cycleDay: 21, menstrual: { flow: "spotting", clotting: false }, pain: { location: "pelvic", intensity: 6 }, mood: { level: 2, label: "Low Energy" }, sleep: { hours: 5.9, fatigueLevel: 7 }, lifestyle: { waterLiters: 1.7, stress: 7 }, body: { bloating: true, acne: true } }
];

export const COLOR_PALETTES = [
  {
    id: "raspberry-cream",
    name: "Raspberry Cream",
    description: "Lilac, rich berry & dark plum",
    swatches: ["#E59BE5", "#FFFFFF", "#8C1352", "#4A214C"],
    themeAttr: "raspberry-cream"
  },
  {
    id: "strawberry-cream-jar",
    name: "Strawberry Cream Jar",
    description: "Rose crimson, wine & soft blush",
    swatches: ["#F6BAC5", "#A73344", "#FFFFFF", "#E9242A", "#54282F"],
    themeAttr: "strawberry-cream-jar"
  },
  {
    id: "blossom-rows",
    name: "Blossom Rows",
    description: "Plum, deep indigo & periwinkle",
    swatches: ["#965293", "#FFFFFF", "#EE9FE1", "#3B2E58", "#748DE3"],
    themeAttr: "blossom-rows"
  },
  {
    id: "strawberry-froth",
    name: "Strawberry Froth",
    description: "Coral rose, soft blush & slate grey",
    swatches: ["#F5ACB4", "#FFFFFF", "#EC4F65", "#7A7B7F", "#F7B9C1"],
    themeAttr: "strawberry-froth"
  },
  {
    id: "pops-of-blush",
    name: "Pops of Blush",
    description: "Royal blue, sunny yellow & hot rose",
    swatches: ["#2955D5", "#F4DA59", "#FFFFFF", "#F49DBF", "#E83674"],
    themeAttr: "pops-of-blush"
  },
  {
    id: "center-of-life",
    name: "Center of Life",
    description: "Poppy red, charcoal & warm gold",
    swatches: ["#DD3E47", "#3D3033", "#EAAF43", "#EB97B7", "#CC4583", "#FFFFFF"],
    themeAttr: "center-of-life"
  }
];
