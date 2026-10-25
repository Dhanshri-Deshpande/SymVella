/**
 * Real-Time Menstrual Cycle & Ovulation Prediction Engine
 * Predicts next period date, days remaining, current cycle day,
 * fertile window, and hormonal phase dynamically from historical period logs.
 */

/**
 * Calculates historical average cycle length from period logs.
 */
export function calculateAverageCycleLength(periodHistory = [], defaultLength = 28) {
  if (!Array.isArray(periodHistory) || periodHistory.length === 0) {
    return defaultLength;
  }
  
  // Extract completed cycles with valid lengths (between 20 and 50 days)
  const validCycles = periodHistory
    .map(c => Number(c.cycleLength))
    .filter(len => !isNaN(len) && len >= 20 && len <= 50);

  if (validCycles.length === 0) {
    return defaultLength;
  }

  // If multiple cycles exist, compute weighted average favoring recent cycles
  if (validCycles.length >= 3) {
    const recent = validCycles.slice(-4);
    let totalWeight = 0;
    let weightedSum = 0;
    recent.forEach((len, idx) => {
      const weight = idx + 1; // 1, 2, 3, 4
      weightedSum += len * weight;
      totalWeight += weight;
    });
    return Math.round(weightedSum / totalWeight);
  }

  const sum = validCycles.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / validCycles.length);
}

/**
 * Calculates historical cycle length variance (standard deviation in days).
 */
export function calculateCycleVariance(periodHistory = []) {
  const validCycles = periodHistory
    .map(c => Number(c.cycleLength))
    .filter(len => !isNaN(len) && len >= 20 && len <= 50);

  if (validCycles.length < 2) return 2; // Baseline variance

  const mean = validCycles.reduce((a, b) => a + b, 0) / validCycles.length;
  const variance = validCycles.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / validCycles.length;
  return Math.max(1, Math.round(Math.sqrt(variance)));
}

/**
 * Determines current cycle phase based on cycle day, cycle length, and period duration.
 */
export function determineCyclePhase(cycleDay, cycleLength = 28, periodDuration = 5) {
  const ovulationDay = Math.max(periodDuration + 2, cycleLength - 14);

  if (cycleDay <= periodDuration) {
    return {
      key: "menstrual",
      name: "Menstrual Phase",
      tag: "Active Period",
      desc: "Uterine lining shedding. Rest, warmth, hydration, and light movement help soothe cramps.",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200"
    };
  }

  if (cycleDay < ovulationDay - 1) {
    return {
      key: "follicular",
      name: "Follicular Phase",
      tag: "Estrogen Rising",
      desc: "Follicles developing. Estrogen is climbing, boosting physical energy, focus, and mood.",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200"
    };
  }

  if (cycleDay <= ovulationDay + 1) {
    return {
      key: "ovulation",
      name: "Ovulation Window",
      tag: "Fertile Peak",
      desc: "Egg release occurs. Peak monthly vitality, metabolic rate, and fertile opportunity.",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
    };
  }

  if (cycleDay <= cycleLength - 5) {
    return {
      key: "early_luteal",
      name: "Early Luteal Phase",
      tag: "Progesterone Peak",
      desc: "Progesterone dominance creates steady calm, sustained endurance, and stable temperature.",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200"
    };
  }

  if (cycleDay <= cycleLength) {
    return {
      key: "late_luteal",
      name: "Late Luteal Phase",
      tag: "Premenstrual",
      desc: "Premenstrual phase. Progesterone declining; gentle stretching and sound rest recommended.",
      badgeColor: "bg-pink-100 text-pink-800 border-pink-200"
    };
  }

  return {
    key: "delayed",
    name: "Extended / Delayed Phase",
    tag: "Cycle Delayed",
    desc: "Cycle is running longer than average. Normal variations occur due to stress, travel, or sleep.",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200"
  };
}

/**
 * Main Real-Time Cycle Prediction Engine
 * Computes all cycle parameters dynamically from real timestamps and user history.
 */
export function predictCycleState({
  periodHistory = [],
  userProfile = {},
  currentDate = new Date()
}) {
  // 1. Determine latest period start date
  let lastPeriodDateStr = userProfile.lastPeriodDate;

  // If periodHistory has entries, take the chronologically latest start date
  if (Array.isArray(periodHistory) && periodHistory.length > 0) {
    const sorted = [...periodHistory].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    const latest = sorted[sorted.length - 1];
    if (latest && latest.startDate) {
      lastPeriodDateStr = latest.startDate;
    }
  }

  if (!lastPeriodDateStr) {
    // Fallback default: 21 days ago
    const fallbackDate = new Date(currentDate);
    fallbackDate.setDate(fallbackDate.getDate() - 21);
    lastPeriodDateStr = fallbackDate.toISOString().split("T")[0];
  }

  // 2. Determine predicted cycle length based on previous history
  const historicalAvg = calculateAverageCycleLength(periodHistory, userProfile.cycleLength || 28);
  const predictedCycleLength = historicalAvg || userProfile.cycleLength || 28;
  const cycleVariance = calculateCycleVariance(periodHistory);
  const periodDuration = Number(userProfile.periodDuration) || 5;

  // 3. Calculate current Cycle Day
  const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const [lYear, lMonth, lDay] = lastPeriodDateStr.split("-").map(Number);
  const lastStart = new Date(lYear, lMonth - 1, lDay);

  const diffMs = today.getTime() - lastStart.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const currentCycleDay = diffDays >= 0 ? diffDays + 1 : 1;

  // 4. Calculate Predicted Next Period Date
  const nextPeriodDate = new Date(lastStart.getTime() + predictedCycleLength * 24 * 60 * 60 * 1000);
  const nextPeriodFormatted = nextPeriodDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  // 5. Calculate Days Remaining
  const remainingMs = nextPeriodDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

  let countdownLabel = "";
  let countdownHeadline = "";
  let isDelayed = false;

  if (daysRemaining > 1) {
    countdownLabel = `~${daysRemaining} Days`;
    countdownHeadline = `Next Period expected in ~${daysRemaining} Days`;
  } else if (daysRemaining === 1) {
    countdownLabel = "Tomorrow";
    countdownHeadline = "Next Period expected tomorrow";
  } else if (daysRemaining === 0) {
    countdownLabel = "Today";
    countdownHeadline = "Period expected today";
  } else {
    isDelayed = true;
    const overdueDays = Math.abs(daysRemaining);
    countdownLabel = `${overdueDays}d Late`;
    countdownHeadline = `Period delayed by ${overdueDays} Day${overdueDays > 1 ? "s" : ""}`;
  }

  // 6. Current Hormonal Phase
  const currentPhase = determineCyclePhase(currentCycleDay, predictedCycleLength, periodDuration);

  // 7. Ovulation & Fertile Window
  const ovulationDay = Math.max(periodDuration + 2, predictedCycleLength - 14);
  const fertileStartDate = new Date(lastStart.getTime() + (ovulationDay - 5) * 24 * 60 * 60 * 1000);
  const fertileEndDate = new Date(lastStart.getTime() + (ovulationDay + 1) * 24 * 60 * 60 * 1000);

  const fertileStartFormatted = fertileStartDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const fertileEndFormatted = fertileEndDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const fertileWindowText = `${fertileStartFormatted} – ${fertileEndFormatted}`;

  // 8. Progress Ring percentage
  const progressRatio = Math.min(1, currentCycleDay / predictedCycleLength);
  const progressPercent = Math.min(100, Math.max(1, Math.round(progressRatio * 100)));
  const strokeDashoffset = 251.2 * (1 - progressRatio);

  return {
    lastPeriodDateStr,
    lastPeriodFormatted: lastStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    currentCycleDay,
    predictedCycleLength,
    cycleVariance,
    periodDuration,
    nextPeriodDate,
    predictedNextPeriodFormatted: nextPeriodFormatted,
    daysRemaining,
    countdownLabel,
    countdownHeadline,
    isDelayed,
    currentPhase,
    ovulationDay,
    fertileWindowText,
    progressPercent,
    strokeDashoffset,
    totalCompletedCycles: periodHistory.length
  };
}
