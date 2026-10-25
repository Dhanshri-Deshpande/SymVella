/**
 * Clinical Cycle Intelligence & Prediction Engine
 * Computes dynamic cycleDay, days remaining, predicted next period date,
 * and current physiological menstrual phase based on user's last period date and cycle length.
 */

export function calculateCycleStatus(lastPeriodDate, cycleLength = 32, periodDuration = 5) {
  const cLength = Math.max(20, Math.min(45, Number(cycleLength) || 32));
  const pDuration = Math.max(2, Math.min(10, Number(periodDuration) || 5));

  // Parse last period start date safely (avoid timezone off-by-one)
  let lastStart;
  if (lastPeriodDate) {
    if (typeof lastPeriodDate === "string" && lastPeriodDate.includes("-")) {
      const parts = lastPeriodDate.split("-").map(Number);
      if (parts.length === 3 && !isNaN(parts[0])) {
        lastStart = new Date(parts[0], parts[1] - 1, parts[2]);
      } else {
        lastStart = new Date(lastPeriodDate);
      }
    } else {
      lastStart = new Date(lastPeriodDate);
    }
  }

  // Fallback to default reference if missing or invalid
  if (!lastStart || isNaN(lastStart.getTime())) {
    lastStart = new Date(2026, 9, 4); // 2026-10-04
  }
  lastStart.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - lastStart.getTime();
  const daysElapsed = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let cycleDay;
  if (daysElapsed >= 0) {
    if (daysElapsed < cLength) {
      cycleDay = daysElapsed + 1;
    } else {
      cycleDay = (daysElapsed % cLength) + 1;
    }
  } else {
    // If future date logged, start at Day 1
    cycleDay = 1;
  }

  // Days until next expected period
  const daysUntilNext = Math.max(1, cLength - cycleDay);

  // Predicted Next Period Date
  const nextPeriodDate = new Date(lastStart);
  if (daysElapsed >= 0) {
    const cyclesPassed = Math.floor(daysElapsed / cLength);
    nextPeriodDate.setDate(lastStart.getDate() + (cyclesPassed + 1) * cLength);
  } else {
    nextPeriodDate.setDate(lastStart.getDate() + cLength);
  }

  const predictedNextPeriodFormatted = nextPeriodDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  // Calculate Menstrual Phase based on clinical standards
  // Ovulation typically occurs ~14 days before next period
  const estimatedOvulationDay = Math.max(10, cLength - 14);

  let phaseKey = "luteal";
  let phaseName = "Luteal Phase";
  let phaseDesc = "Progesterone is steady. Stay hydrated and prioritize restorative sleep.";

  if (cycleDay <= pDuration) {
    phaseKey = "menstrual";
    phaseName = "Menstrual Phase";
    phaseDesc = "Your period is active. Focus on rest, gentle warmth, and warm herbal teas.";
  } else if (cycleDay < estimatedOvulationDay - 1) {
    phaseKey = "follicular";
    phaseName = "Follicular Phase";
    phaseDesc = "Estrogen is rising. Your physical energy, focus, and mood are naturally climbing.";
  } else if (cycleDay <= estimatedOvulationDay + 1) {
    phaseKey = "ovulation";
    phaseName = "Ovulation Phase";
    phaseDesc = "Peak fertility window. Natural vitality, confidence, and energy are at their peak.";
  } else if (cycleDay > cLength - 6) {
    phaseKey = "late_luteal";
    phaseName = "Late Luteal Phase";
    phaseDesc = "Pre-menstrual hormone shifts. Prioritize good sleep, gentle walks, and low stress.";
  }

  return {
    cycleDay,
    cycleLength: cLength,
    periodDuration: pDuration,
    daysUntilNext,
    nextPeriodDate,
    predictedNextPeriodFormatted,
    phaseKey,
    phaseName,
    phaseDesc,
    progressFraction: Math.min(1, Math.max(0, cycleDay / cLength))
  };
}

/**
 * Given a target cycleDay (e.g. 5, 14, 21), calculate the corresponding startDate (YYYY-MM-DD)
 * assuming today is that cycleDay.
 */
export function getStartDateForCycleDay(targetDay = 1) {
  const dayOffset = Math.max(0, Number(targetDay) - 1);
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - dayOffset);
  const y = targetDate.getFullYear();
  const m = String(targetDate.getMonth() + 1).padStart(2, "0");
  const d = String(targetDate.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
