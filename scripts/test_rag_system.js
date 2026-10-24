// Test suite for Symvella RAG (Retrieval-Augmented Generation) System
import { retrieveRelevantMedicalDocs, synthesizeLocalRAGAnswer, generateRAGResponse, tokenizeQuery, expandQueryTokens } from "../src/services/ragService.js";

console.log("=== 1. Testing Query Tokenization & Concept Expansion ===");
const query1 = "I have severe cramps in my lower stomach during periods, what helps?";
const tokens1 = tokenizeQuery(query1);
const expanded1 = expandQueryTokens(tokens1);
console.log("Raw Tokens     :", tokens1);
console.log("Expanded Tokens:", expanded1.slice(0, 10));

console.log("\n=== 2. Testing Medical Retrieval Accuracy across Clinical Scenarios ===");

const testCases = [
  {
    query: "My periods are 8 days late and I'm stressed. When should I test for pregnancy?",
    expectedOrg: "American College of Obstetricians and Gynecologists (ACOG)",
    expectedTopic: "Secondary Amenorrhea"
  },
  {
    query: "Severe dysmenorrhea cramps and back pain during menstrual cycle",
    expectedOrg: "American College of Obstetricians and Gynecologists (ACOG)",
    expectedTopic: "Dysmenorrhea"
  },
  {
    query: "PCOS facial hair, irregular periods, and insulin resistance diet",
    expectedOrg: "Monash University & International PCOS Network (ASRM / ESHRE)",
    expectedTopic: "PCOS"
  },
  {
    query: "Heavy menstrual bleeding with large clots soaking 2 pads an hour",
    expectedOrg: "International Federation of Gynecology and Obstetrics (FIGO)",
    expectedTopic: "PALM-COEIN"
  },
  {
    query: "Thick curdy white discharge and intense itching down there",
    expectedOrg: "Centers for Disease Control and Prevention (CDC)",
    expectedTopic: "Vaginal Infections"
  },
  {
    query: "Low hemoglobin, severe fatigue, dizziness, and iron rich foods",
    expectedOrg: "Anemia",
    expectedTopic: "Anemia"
  },
  {
    query: "Pregnancy care in second trimester, tifffa scan, and fetal kicks",
    expectedOrg: "World Health Organization (WHO)",
    expectedTopic: "Antenatal Care"
  },
  {
    query: "Severe pain during sex, bowel movements, and chronic pelvic pain endometriosis",
    expectedOrg: "European Society of Human Reproduction and Embryology (ESHRE) & NHS UK",
    expectedTopic: "Endometriosis"
  },
  {
    query: "Hot flashes, night sweats, and bone density ragi calcium perimenopause",
    expectedOrg: "The Menopause Society (formerly NAMS) & International Menopause Society (IMS)",
    expectedTopic: "Menopause"
  },
  {
    query: "Ayurvedic gharelu upay with ginger, ajwain, and saunf for period cramps",
    expectedOrg: "Ministry of AYUSH, Govt of India & Central Council for Research in Ayurvedic Sciences (CCRAS)",
    expectedTopic: "Ayurvedic"
  },
  {
    query: "Pradhan Mantri Matru Vandana Yojana cash benefit maternity 5000",
    expectedOrg: "Ministry of Women & Child Development, Govt of India",
    expectedTopic: "Scheme"
  }
];

let passed = 0;

testCases.forEach((tc, idx) => {
  const docs = retrieveRelevantMedicalDocs(tc.query, { topK: 3 });
  const topDoc = docs[0];
  const isMatch = topDoc && (topDoc.organization.includes(tc.expectedOrg) || topDoc.title.includes(tc.expectedTopic));
  
  console.log(`\nCase ${idx + 1}: "${tc.query.slice(0, 45)}..."`);
  console.log(`   Top Retrieved: [${topDoc?.organization}] - "${topDoc?.title}"`);
  console.log(`   Confidence   : ${topDoc?.confidencePct}% match`);
  console.log(`   Citation     : ${topDoc?.citation}`);
  
  if (isMatch) {
    passed++;
    console.log(`   Result       : ✅ PASSED`);
  } else {
    console.log(`   Result       : ⚠️ REVIEW (Expected ${tc.expectedOrg})`);
  }
});

console.log(`\n=== 3. Testing Local RAG Answer Synthesis ===`);
const sampleAnswer = synthesizeLocalRAGAnswer(
  "How to relieve severe period cramps at home?",
  retrieveRelevantMedicalDocs("severe period cramps at home", { topK: 3 }),
  { language: "en", userProfile: { name: "Ananya", lifeStage: "regular" } }
);

console.log("Synthesized Output Snippet:\n", sampleAnswer.text.slice(0, 400), "...");
console.log("\nSources Tag:", sampleAnswer.sources);

console.log(`\n=== 4. Testing Exclusive Gnani Model Orchestrator ===`);
const gnaniRagRes = await generateRAGResponse({
  query: "What are the earliest signs of pregnancy?",
  language: "hi",
  userProfile: { name: "Pooja", lifeStage: "pregnancy" }
});
console.log("Gnani RAG Source:", gnaniRagRes.sources);
console.log("Retrieved Docs Count:", gnaniRagRes.retrievedDocs.length);
console.log("Output Snippet:", gnaniRagRes.text.slice(0, 250), "...");

console.log(`\nTest Summary: ${passed} / ${testCases.length} Passed (${Math.round((passed / testCases.length) * 100)}%)`);
