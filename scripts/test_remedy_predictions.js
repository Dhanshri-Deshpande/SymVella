import { generateDailyReport } from "./src/data/ghareluUpayEngine.js";

console.log("=================================================================");
console.log(" SakhiAI - ML-Driven Gharelu Upay Prediction Verification");
console.log("=================================================================");

// 1. SCENARIO A: Low Pain Check-in (Pain VAS = 1, healthy homeostasis)
const lowPainLog = {
  menstrual: { flow: "none", clotting: false },
  pain: { location: "pelvic", intensity: 1 },
  sleep: { hours: 7.5, fatigueLevel: 3 },
  body: { bloating: false, acne: false },
  lifestyle: { waterLiters: 1.8, stress: 3 }
};
const repLow = generateDailyReport(lowPainLog, "en");
console.log("\n[TEST 1] Patient logs Low Pain VAS = 1 (Mild / Minimal):");
console.log("Dysmenorrhea ML Risk Score:", repLow.mlMetrics.dysmenorrheaScore + "%");
console.log("Recommended Gharelu Upay (Ranked by ML Model):");
repLow.upayList.forEach((u, i) => {
  console.log(`  ${i+1}. ${u.title}`);
  console.log(`     -> Match: ${u.matchScore}% | Model Acc: ${u.accuracy}% | ${u.shapExplanation}`);
});

// 2. SCENARIO B: Severe Pelvic Cramps Check-in (Pain VAS = 8, heavy flow)
const highPainLog = {
  menstrual: { flow: "heavy", clotting: true },
  pain: { location: "pelvic", intensity: 8 },
  sleep: { hours: 5.5, fatigueLevel: 8 },
  body: { bloating: true, acne: false },
  lifestyle: { waterLiters: 1.5, stress: 7 }
};
const repHigh = generateDailyReport(highPainLog, "en");
console.log("\n[TEST 2] Patient logs Severe Pelvic Pain VAS = 8 (Dysmenorrhea Flare):");
console.log("Dysmenorrhea ML Risk Score:", repHigh.mlMetrics.dysmenorrheaScore + "%");
console.log("Recommended Gharelu Upay (Ranked by ML Model):");
repHigh.upayList.forEach((u, i) => {
  console.log(`  ${i+1}. ${u.title}`);
  console.log(`     -> Match: ${u.matchScore}% | Model Acc: ${u.accuracy}% | ${u.shapExplanation}`);
});

// 3. SCENARIO C: Bloating & Sleep Deficit (Pain VAS = 2, bloating = true, sleep = 5h)
const bloatingLog = {
  menstrual: { flow: "light", clotting: false },
  pain: { location: "none", intensity: 1 },
  sleep: { hours: 5.0, fatigueLevel: 7 },
  body: { bloating: true, acne: false },
  lifestyle: { waterLiters: 1.6, stress: 6 }
};
const repBloat = generateDailyReport(bloatingLog, "en");
console.log("\n[TEST 3] Patient logs Bloating & Sleep Deprivation (Pain VAS = 1):");
console.log("Recommended Gharelu Upay (Ranked by ML Model):");
repBloat.upayList.forEach((u, i) => {
  console.log(`  ${i+1}. ${u.title}`);
  console.log(`     -> Match: ${u.matchScore}% | Model Acc: ${u.accuracy}% | ${u.shapExplanation}`);
});

// 4. SCENARIO D: Hindi Localization Test
const repHi = generateDailyReport(lowPainLog, "hi");
console.log("\n[TEST 4] Hindi Localization Check:");
console.log("Hindi Reason:", repHi.reasons[0]);
console.log("Hindi Upay Title:", repHi.upayList[0]?.title);
console.log("Hindi Driver:", repHi.upayList[0]?.shapExplanation);
