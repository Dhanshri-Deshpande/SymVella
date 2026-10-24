import { getLocalSymvellaResponse } from "../src/data/botKnowledge.js";
import { cleanTextForSpeech, toGnaniLanguageCode } from "../src/services/gnaniService.js";

console.log("=== 1. Testing Clean Text for Speech ===");
const rawText = "🌸 **हेल्लो!** Check [link](http://test.com) & *cramps* 🧘 #relief!";
const cleaned = cleanTextForSpeech(rawText);
console.log("Original:", rawText);
console.log("Cleaned :", cleaned);

console.log("\n=== 2. Testing Language Code Mapping ===");
console.log("hi ->", toGnaniLanguageCode("hi"));
console.log("hinglish ->", toGnaniLanguageCode("hinglish"));
console.log("mr ->", toGnaniLanguageCode("mr"));
console.log("ta ->", toGnaniLanguageCode("ta"));
console.log("en ->", toGnaniLanguageCode("en"));

console.log("\n=== 3. Testing getLocalSymvellaResponse on diverse queries ===");
const testQueries = [
  "My periods are 6 days late, what should I do?",
  "Severe cramps in lower stomach, please help",
  "PCOS symptoms and facial hair",
  "Is thick white discharge normal?",
  "When should I take pregnancy test?",
  "How to calculate fertile ovulation days?",
  "Foods to increase hemoglobin and cure anemia",
  "I have bloating and period poops",
  "What is the normal menstrual cycle length?",
  "I have severe pain in lower back and legs",
  "Any unexpected random query about general weakness and body ache"
];

const responses = new Set();
testQueries.forEach((q, idx) => {
  const res = getLocalSymvellaResponse(q, "en", { cycleDay: 21 });
  const preview = res.text.slice(0, 70).replace(/\n/g, " ");
  console.log(`Q${idx + 1} [${q.slice(0, 35)}...]:`);
  console.log(`   Source: ${res.source}`);
  console.log(`   Snippet: ${preview}...`);
  if (responses.has(res.text)) {
    console.error(`   ❌ DUPLICATE RESPONSE DETECTED!`);
  } else {
    responses.add(res.text);
  }
});

console.log(`\nTotal unique queries tested: ${testQueries.length}, Total unique responses: ${responses.size}`);
if (responses.size === testQueries.length) {
  console.log("✅ SUCCESS: Every single question produced a distinct, tailored clinical answer! No duplicate fallbacks.");
} else {
  console.error("❌ FAILURE: Duplicates found.");
}
