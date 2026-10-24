// Multilingual Chatbot Knowledge and Clinical Dialogue Engine
// Supports English, Hindi, Hinglish, Marathi, Tamil, and connects to Local Ollama or Free Gemini if configured

export const SAKHI_LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "hinglish", label: "Hinglish", native: "Hinglish" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" }
];

export const SUGGESTED_QUESTIONS = {
  en: [
    "Why are my periods delayed this month?",
    "Natural ways to ease severe pelvic cramps?",
    "Could my acne and hair fall be signs of PCOS?",
    "How does sleep impact menstrual cycle regularity?"
  ],
  hi: [
    "पीरियड्स में असहनीय दर्द कम करने के उपाय क्या हैं?",
    "पीसीओएस (PCOS) के शुरुआती लक्षण क्या होते हैं?",
    "क्या हीमोग्लोबिन की कमी से ज्यादा थकान होती है?",
    "डॉक्टर को दिखाने के लिए क्लिनिकल रिपोर्ट कैसे मिलेगी?"
  ],
  hinglish: [
    "Period pain bohot zyada ho to kya karein?",
    "PCOS aur PCOD mein kya farak hota hai?",
    "Kya stress ki wajah se period late ho sakta hai?",
    "Mere recent symptoms ka XAI explanation kya hai?"
  ],
  mr: [
    "मासिक पाळीतील तीव्र पोटदुखीवर कोणते घरगुती उपाय आहेत?",
    "पीसीओडी (PCOD) चे मुख्य लक्षण काय आहेत?",
    "रक्तक्षय (Anemia) आणि थकवा कसा ओळखावा?"
  ],
  ta: [
    "மாதவிடாய் வலியை குறைக்க எளிய வழிகள் என்ன?",
    "PCOS அறிகுறிகள் என்னென்ன?",
    "மருத்துவரிடம் காட்ட வேண்டிய அறிக்கை எப்படி எடுப்பது?"
  ]
};

// Intent matcher & knowledge base for zero-cost, fail-safe multilingual responses
export function getLocalSakhiResponse(query, language = "en", context = {}) {
  const q = query.toLowerCase();

  // Safety / Crisis trigger check
  if (
    q.includes("suicide") || q.includes("self harm") || q.includes("mar jana") || 
    q.includes("die") || q.includes("end my life") || q.includes("khudkushi")
  ) {
    if (language === "hi") {
      return {
        text: "कृपया रुकिए, आप अकेली नहीं हैं। आपकी ज़िंदगी बहुत कीमती है। कृपया तुरंत 24/7 मुफ्त सरकारी टेली-मानस (Tele-MANAS) हेल्पलाइन 14416 या आपातकालीन नंबर 112 पर कॉल करें। हमारे विशेषज्ञ आपसे बात करने के लिए हमेशा मौजूद हैं।",
        isAlert: true,
        source: "Tele-MANAS Crisis Protocol"
      };
    }
    return {
      text: "Please hold on, you are not alone. Your life matters deeply. Please connect immediately with the 24/7 free Tele-MANAS helpline at 14416 or call National Emergency 112. Loving and trained support is right there for you.",
      isAlert: true,
      source: "National Mental Health Crisis Protocol"
    };
  }

  // Red-flag emergency symptoms
  if (
    q.includes("severe bleeding") || q.includes("soaking pads") || q.includes("khoon bohot") || 
    q.includes("fainting") || q.includes("unconscious") || q.includes("chhathe pad")
  ) {
    return {
      text: language === "hi" 
        ? "⚠️ **चेतावनी (Red Flag Alert)**: यदि आपको हर घंटे 2 या अधिक पैड बदलने पड़ रहे हैं या चक्कर खाकर बेहोशी महसूस हो रही है, तो यह अत्यधिक रक्तस्राव (Menorrhagia) हो सकता है। कृपया तुरंत नजदीकी अस्पताल के इमरजेंसी वार्ड में जाएं।"
        : "⚠️ **Urgent Medical Red Flag**: Soaking through 2+ pads per hour for consecutive hours or feeling faint indicates abnormal hemorrhage. Please seek immediate emergency medical care or call 112.",
      isAlert: true,
      source: "Emergency Obstetrics Triage Guidelines"
    };
  }

  // PCOS / PCOD queries
  if (q.includes("pcos") || q.includes("pcod") || q.includes("cystic") || q.includes("irregular period")) {
    if (language === "hi") {
      return {
        text: "🌸 **पीसीओएस (PCOS) के बारे में समझना:**\n\n1. **शुरुआती लक्षण:** अनियमित माहवारी, चेहरे पर अनचाहे बाल (Hirsutism), जिद्दी मुहांसे, और लगातार वजन बढ़ना।\n2. **कारण:** यह हार्मोनल असंतुलन और इंसुलिन प्रतिरोध (Insulin Resistance) से जुड़ा होता है।\n3. **क्या मदद करता है:** साबुत अनाज (ज्वार, बाजरा, रागी), कम चीनी, रोज़ाना 30 मिनट पैदल चलना या योग।\n\n💡 *सखी टिप:* सखीएआई (SakhiAI) के 'Insights' टैब में जाकर अपना XAI स्कोर देखें और डॉक्टर के लिए क्लिनिकल समरी डाउनलोड करें।",
        source: "FOGSI Clinical Guidelines"
      };
    }
    if (language === "hinglish") {
      return {
        text: "🌸 **PCOS / PCOD Guide:**\n\nPCOS ek hormonal condition hai jisme ovaries mein immature follicles jama ho jaate hain aur periods irregular ho jaate hain.\n\n- **Main Symptoms:** Periods delay hona, chin/jawline par acne ya hair growth, weight gain aur energy crash.\n- **Actionable Steps:** Fiber-rich foods lijiye (lentils, sabziyan), refined sugar kam karein, aur daily 30 mins gentle walk karein.\n- **Doctor Check:** Ek pelvic ultrasound aur Day-3 hormone test karwana best rehta hai. Aap apna Doctor Report PDF yahan se print kar sakti hain!",
        source: "ACOG & FOGSI Guidance"
      };
    }
    return {
      text: "🌸 **Understanding PCOS / PCOD:**\n\nPCOS is a hormonal condition affecting 1 in 5 women. It involves ovulatory irregularity and elevated androgen markers.\n\n• **Hallmark Signs**: Cycles longer than 35 days, cystic acne along the jawline, hair thinning, and insulin-related fatigue.\n• **Evidence-Based Support**: Low-GI whole grains (millets), daily brisk walking, and prioritizing 7+ hours of quality sleep to lower cortisol.\n• **Next Step**: Review the XAI attribution chart in your 'Insights' tab to see which specific factors are elevating your pattern score.",
      source: "ACOG Practice Bulletin No. 194"
    };
  }

  // Pain / Cramps / Dysmenorrhea
  if (q.includes("cramp") || q.includes("pain") || q.includes("dard") || q.includes("durd") || q.includes("peth")) {
    if (language === "hi") {
      return {
        text: "🌿 **पीरियड दर्द (Cramps) से राहत के सुरक्षित उपाय:**\n\n1. **गर्म सिकाई (Heating Pad):** पेल्विक और कमर के निचले हिस्से पर 15-20 मिनट गर्म सेक लगाने से गर्भाशय की मांसपेशियों को तुरंत आराम मिलता है।\n2. **मैग्नीशियम और हर्बल चाय:** अदरक और कैमोमाइल चाय प्रोस्टाग्लैंडीन (दर्द पैदा करने वाले रसायन) को कम करती है।\n3. **हल्का व्यायाम:** तितली आसन (Baddha Konasana) और बाल आसन (Child's Pose) पेल्विक ब्लड फ्लो को सुधारते हैं।\n\n⚠️ *नोट:* यदि दर्द 8/10 से ज्यादा है और उल्टी या बुखार हो, तो तुरंत डॉक्टर से संपर्क करें।",
        source: "Evidence-Based Dysmenorrhea Management"
      };
    }
    if (language === "hinglish") {
      return {
        text: "🌿 **Period Cramps Relieve Karne Ke Tarike:**\n\n1. **Heat Therapy:** Lower abdomen par heating pad ya hot water bottle lagayein—yeh uterus muscles ko relax karta hai.\n2. **Hydration & Ginger Tea:** Adrak wali chai prostaglandins ko kam karti hai jisse dard kam hota hai.\n3. **Gentle Yoga:** Butterfly pose (Baddha Konasana) aur Child's pose pelvis ke blood circulation ko improve karte hain.\n\n*Note:* Agar pain 8/10 se upar hai aur regular medicines se bhi nahi ruk raha, to endometriosis check ke liye doctor se milein.",
        source: "Clinical Women's Health Protocols"
      };
    }
    return {
      text: "🌿 **Relief for Menstrual Cramps (Dysmenorrhea):**\n\n1. **Localized Heat**: A heating pad on the lower abdomen is clinically proven to be as effective as mild analgesics by increasing local pelvic blood flow.\n2. **Anti-inflammatory Support**: Warm ginger or chamomile infusions inhibit excessive uterine prostaglandins.\n3. **Gentle Stretches**: Child's pose (Balasana) and Supta Baddha Konasana release pelvic floor tension.\n\n⚠️ *Clinical Rule:* If pain incapacitates you or radiates severely into your thighs with dizziness, log it in today's check-in so your Doctor Summary flags it.",
      source: "RCOG Clinical Guidelines"
    };
  }

  // Anemia / Fatigue
  if (q.includes("fatigue") || q.includes("tired") || q.includes("thakan") || q.includes("anemia") || q.includes("iron")) {
    return {
      text: language === "hi"
        ? "🩸 **थकान और आयरन की कमी (Anemia):**\n\nमहिलाओं में भारी रक्तस्राव के कारण हीमोग्लोबिन और फेरिटिन (आयरन स्टोर) कम हो जाते हैं।\n- **आहार:** पालक, मेथी, भुना चना, गुड़ और सहजन (Moringa) का सेवन करें।\n- **नींबू का महत्व:** भोजन में नींबू निचोड़ने से आयरन का अवशोषण 3 गुना बढ़ जाता है!\n- **चाय से दूरी:** खाने के तुरंत बाद चाय या कॉफी न पिएं, क्योंकि यह आयरन को सोखने से रोकती है।"
        : "🩸 **Combating Fatigue & Iron Depletion:**\n\nPersistent low energy—especially when coupled with heavy periods—often stems from low ferritin (stored iron).\n• **Nutritional Powerhouses**: Dark leafy greens, roasted black chana, jaggery, beetroot, and lentils.\n• **The Vitamin C Hack**: Squeeze fresh lemon juice over iron-rich meals to boost non-heme iron absorption by up to 300%.\n• **Timing Rule**: Avoid drinking tea or coffee within 60 minutes of meals, as tannins block iron uptake.",
      source: "ICMR & WHO Nutritional Anemia Guidelines"
    };
  }

  // Default intelligent empathetic companion answer
  if (language === "hi") {
    return {
      text: "नमस्ते! मैं आपकी स्वास्थ्य सखी (Sakhi) हूँ। मैंने आपका प्रश्न समझ लिया है। आपकी सेहत का ध्यान रखना मेरी प्राथमिकता है। क्या आप आज के दैनिक चेक-इन को पूरा करना चाहती हैं, या किसी विशेष लक्षण (जैसे माहवारी, दर्द, नींद, या मानसिक तनाव) के बारे में और जानकारी चाहिए? आप बेझिझक मुझसे अपनी भाषा में बात कर सकती हैं।",
      source: "SakhiAI Clinical Companion Engine"
    };
  }
  if (language === "hinglish") {
    return {
      text: "Namaste! Main aapki health Sakhi hoon. Maine aapka message dekha. Aapke health journey ko aasan aur transparent banana mera maqsad hai. Kya aap aaj ka 1-minute daily check-in complete karna chahti hain, ya fir kisi specific symptom (jaise period date, cramps, sleep, ya mood) ke baare mein baat karna chahti hain? Main yahan sunne ke liye tayar hoon!",
      source: "SakhiAI Companion Engine"
    };
  }
  return {
    text: "Hello! I am your SakhiAI health companion. I am here to listen, explain, and guide you through your health journey with complete privacy and zero judgment. You can ask me about menstrual cycles, pain relief, PCOS, nutrition, or request an explanation of your recent symptom trends. How can I support you today?",
    source: "SakhiAI Evidence-Based Assistant"
  };
}
