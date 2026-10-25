// Multilingual Chatbot Knowledge and Comprehensive Clinical Dialogue Engine
// Covers 30+ core women's health domains across English, Hindi, Hinglish, Marathi, and Tamil
// Built for high readability: Scannable 3-part clinical format (Quick Answer, Action Steps, Red Flags)

export const SYMVELLA_LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "hinglish", label: "Hinglish", native: "Hinglish" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" }
];

export const SAKHI_LANGUAGES = SYMVELLA_LANGUAGES;

export const SUGGESTED_QUESTIONS = {
  en: [
    "Why are my periods delayed this month?",
    "Natural ways to ease severe pelvic cramps?",
    "Could my acne and hair fall be signs of PCOS?",
    "What foods help boost hemoglobin and energy?",
    "Is thick white discharge normal before periods?",
    "How do I know my fertile ovulation window?"
  ],
  hi: [
    "पीरियड्स में असहनीय दर्द कम करने के घरेलू उपाय क्या हैं?",
    "पीरियड्स में देरी (Late Periods) होने के मुख्य कारण क्या हैं?",
    "पीसीओएस (PCOS) के शुरुआती लक्षण और सही डाइट क्या है?",
    "सफेद पानी (White Discharge) कब सामान्य और कब चिंताजनक है?",
    "हीमोग्लोबिन और खून बढ़ाने के लिए सबसे असरदार चीजें क्या हैं?",
    "ओव्यूलेशन (Ovulation) और गर्भधारण के सबसे सही दिन कौन से हैं?",
    "प्रेगनेंसी टेस्ट किट (UPT) से जांच करने का सही समय क्या है?",
    "पीरियड्स में कमर दर्द और पैरों में दर्द से कैसे बचें?",
    "पीरियड्स में बहुत ज्यादा ब्लीडिंग और बड़े थक्के क्यों आते हैं?",
    "अजवाइन और गुड़ का काढ़ा पीरियड्स में कैसे फायदा करता है?",
    "पीरियड आने से पहले बहुत ज्यादा मूड स्विंग्स और गुस्सा क्यों आता है?",
    "पीरियड्स में पेट फूलना (Bloating) और गैस की समस्या कैसे ठीक करें?",
    "पीरियड्स के दौरान कौन से योगासन करने से तुरंत राहत मिलती है?",
    "हल्की ब्लीडिंग और भूरे धब्बे (Brown Spotting) आना क्या सामान्य है?"
  ],
  hinglish: [
    "Period delay ho gaya hai, pregnancy ya stress?",
    "Period pain bohot zyada ho to kaunsa gharelu nuskha lein?",
    "PCOS aur PCOD mein kya farak hota hai?",
    "White discharge normal hai ya infection ka sign?",
    "Hemoglobin kaise badhayein naturally?",
    "Ovulation day calculate kaise karein?"
  ],
  mr: [
    "मासिक पाळी उशीरा येण्याची कारणे काय असू शकतात?",
    "मासिक पाळीतील तीव्र पोटदुखीवर कोणते घरगुती उपाय आहेत?",
    "पीसीओडी (PCOD) चे मुख्य लक्षण काय आहेत?",
    "पांढरा स्त्राव (White Discharge) कधी धोकादायक असतो?",
    "रक्तक्षय (Anemia) आणि थकवा कसा ओळखावा?"
  ],
  ta: [
    "மாதவிடாய் தள்ளிப்போக முக்கிய காரணங்கள் என்ன?",
    "மாதவிடாய் கடுமையான வலியை குறைக்க எளிய வழிகள் என்ன?",
    "PCOS அறிகுறிகள் என்னென்ன?",
    "வெள்ளைப்படுதல் எப்போது மருத்துவரிடம் காட்ட வேண்டும்?",
    "ஹீமோகுளோபின் அதிகரிக்க என்ன உணவுகள் சாப்பிட வேண்டும்?"
  ]
};

// ============================================================================
// COMPREHENSIVE CLINICAL INTENT ENGINE (30+ Domains)
// Always formatted into 3 scannable parts:
// 1. 💡 Quick Answer (1-2 sentences)
// 2. 🌿 What You Can Do (3-4 crisp bullet points)
// 3. 🚨 When to See a Doctor (1-2 clear red flags)
// ============================================================================
export function getLocalSymvellaResponse(query, language = "en", context = {}) {
  const q = (query || "").toLowerCase().trim();
  const userProfile = context.userProfile || {};
  const cycleDay = context.cycleDay || 21;
  const userName = userProfile.name ? userProfile.name.split(" ")[0] : "";

  // Exact word boundary matcher to prevent substrings (e.g. "calculate" triggering "late")
  const hasWord = (...words) => {
    return words.some(w => new RegExp(`(^|[^a-zA-Z0-9])${w}([^a-zA-Z0-9]|$)`, 'i').test(q));
  };

  // 1. SAFETY & CRISIS PROTOCOL
  if (
    hasWord("suicide", "self harm", "mar jana", "die", "end my life", "khudkushi", "jeena nahi") ||
    q.includes("आत्महत्या") || q.includes("मर जाना") || q.includes("खुदकुशी") || q.includes("जीना नहीं")
  ) {
    if (language === "hi") {
      return {
        text: "🌸 **आप अकेली नहीं हैं। आपकी ज़िंदगी अनमोल है।**\n\nकृपया तुरंत 24/7 निःशुल्क सरकारी **Tele-MANAS हेल्पलाइन: 14416** या आपातकालीन नंबर **112** पर कॉल करें। प्रशिक्षित काउंसलर्स तुरंत सहायता के लिए उपलब्ध हैं।",
        isAlert: true,
        isSpecificMatch: true,
        source: "National Tele-MANAS Crisis Protocol (Govt. of India)"
      };
    }
    return {
      text: "🌸 **Please hold on, you are not alone. Your life is deeply valued.**\n\nPlease connect immediately with the free 24/7 Government **Tele-MANAS helpline at 14416** or emergency services at **112**. Compassionate professional counseling is immediately available for you.",
      isAlert: true,
      isSpecificMatch: true,
      source: "National Mental Health Crisis Protocol"
    };
  }

  // 2. RED-FLAG CLINICAL EMERGENCIES (HEMORRHAGE, FAINTING)
  if (
    hasWord("severe bleeding", "soaking pads", "fainting", "unconscious", "huge clot", "behosh", "chakkar") ||
    q.includes("khoon bohot") || q.includes("chhathe pad") ||
    q.includes("बेहोश") || q.includes("चक्कर") || q.includes("बहुत ज्यादा खून") || q.includes("बड़े थक्के")
  ) {
    if (language === "hi") {
      return {
        text: "🚨 **आपातकालीन चेतावनी (Red Flag Medical Alert):**\n\n• लगातार 2 घंटे से हर घंटे 1-2 बड़े पैड पूरी तरह भीगना।\n• नींबू के आकार के बड़े खून के थक्के (clots) निकलना।\n• सिर चकराना, अत्यधिक कमजोरी या बेहोशी महसूस होना।\n\nयह गंभीर रक्तस्राव का संकेत है। **तुरंत नजदीकी अस्पताल या स्त्री रोग विशेषज्ञ से मिलें या 112 पर कॉल करें।**",
        isAlert: true,
        isSpecificMatch: true,
        source: "Emergency Obstetrics Triage Guidelines"
      };
    }
    return {
      text: "🚨 **Urgent Medical Red Flag Warning:**\n\n• Soaking through 2+ heavy sanitary pads per hour for consecutive hours.\n• Passing blood clots larger than a coin or lemon.\n• Severe dizziness, lightheadedness, or fainting.\n\nThese indicate acute hemorrhage. **Seek immediate emergency gynecological care at the nearest hospital or call 112.**",
      isAlert: true,
      isSpecificMatch: true,
      source: "Emergency Obstetrics Triage Guidelines"
    };
  }

  // 3. OVULATION & FERTILE WINDOW
  if (
    hasWord("ovulation", "ovulating", "fertile", "fertility", "egg release") ||
    q.includes("pregnant hone ke din") || q.includes("baby plan") ||
    q.includes("ओव्यूलेशन") || q.includes("फर्टाइल") || q.includes("अंडा बनना") || q.includes("उपजाऊ दिन")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (ओव्यूलेशन समय):**\nओव्यूलेशन आमतौर पर अगले पीरियड की तारीख से लगभग 14 दिन पहले होता है। यदि आपकी साइकल 28 दिन की है, तो पीरियड शुरू होने के **10वें से 16वें दिन** तक गर्भधारण के सबसे उपजाऊ (Fertile) दिन होते हैं।\n\n🌿 **पहचानने के मुख्य शारीरिक संकेत:**\n• कच्चे अंडे के सफेद भाग जैसा पारदर्शी और खिंचने वाला म्यूकस (Cervical mucus)।\n• पेट के एक तरफ हल्का मीठा दर्द (Mittelschmerz)।\n• ऊर्जा स्तर और कामेच्छा में वृद्धि।\n\n🚨 **डॉक्टर से कब मिलें:**\n• यदि पीरियड्स बहुत अनियमित हैं (20 दिन से कम या 45 दिन से ज्यादा) और गर्भधारण की योजना बना रही हैं।",
        isSpecificMatch: true,
        source: "ASRM Guidelines on Natural Fertility"
      };
    }
    if (language === "mr") {
      return {
        text: "💡 **थेट उत्तर (ओव्हुलेशन कालावधी):**\nपुढील पाळीच्या तारखेच्या १४ दिवस आधी ओव्हुलेशन होते. २८ दिवसांच्या सायकलमध्ये **१० वा ते १६ वा दिवस** गर्भधारणेसाठी सर्वात सुपीक मानला जातो.\n\n🌿 **महत्त्वाची लक्षणे:**\n• अंड्याच्या पांढऱ्या भागासारखा पारदर्शक व चिकट स्त्राव.\n• पोटाच्या एका बाजूला हलके दुखणे.\n• शरीराचे तापमान किंचित वाढणे.\n\n🚨 **डॉक्टरांचा सल्ला कधी घ्यावा:**\n• पाळी नियमित नसताना गर्भधारणेचा प्रयत्न करत असल्यास.",
        isSpecificMatch: true,
        source: "FOGSI Reproductive Guidelines"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nOvulation happens approximately 14 days before your next expected period. In a 28-day cycle, your peak fertile window is between **Cycle Days 10 and 16**.\n\n🌿 **Signs to Look For:**\n• **Cervical mucus:** Clear, stretchy fluid resembling raw egg white.\n• **Ovulation twinge:** Mild one-sided lower tummy ache (Mittelschmerz).\n• **Slight temperature rise:** A subtle 0.3°C increase after egg release.\n\n🚨 **When to See a Doctor:**\n• If your cycles fluctuate by more than 7-10 days month-to-month while trying to conceive.",
      isSpecificMatch: true,
      source: "ASRM Guidelines on Natural Fertility"
    };
  }

  // 4. DELAYED / LATE PERIODS (Amenorrhea / Delay)
  if (
    hasWord("late", "delayed", "delay", "missed", "ruk gaya", "ushira", "period late") ||
    q.includes("nahi aaya") || q.includes("date nikal gayi") ||
    q.includes("देरी") || q.includes("लेट") || q.includes("रुक गया") || q.includes("पीरियड नहीं आया") || q.includes("उशीरा")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (पीरियड्स में देरी के कारण):**\nपीरियड 2 से 5 दिन आगे-पीछे होना सामान्य है। मुख्य कारणों में मानसिक तनाव, यात्रा, अचानक वजन में बदलाव, थायरॉइड, पीसीओएस (PCOS) या गर्भावस्था शामिल हैं।\n\n🌿 **आप क्या कर सकती हैं:**\n• **सौंफ-दालचीनी का पानी:** 1 कप गुनगुने पानी में आधा चम्मच सौंफ उबालकर पिएं—यह पेल्विक मांसपेशियों को आराम देता है।\n• **प्रेगनेंसी टेस्ट (UPT):** यदि यौन रूप से सक्रिय हैं, तो पीरियड मिस होने के 5-7 दिन बाद सुबह के पहले यूरिन से जांच करें।\n• **7-8 घंटे की नींद:** तनाव हार्मोन (कोर्टिसोल) कम करने के लिए पर्याप्त आराम करें।\n\n🚨 **डॉक्टर से कब मिलें:**\n• पीरियड 10-14 दिन से ज्यादा लेट हो और प्रेगनेंसी टेस्ट नेगेटिव आए।\n• पेट के निचले हिस्से में तीव्र एकतरफा दर्द हो।",
        isSpecificMatch: true,
        source: "ACOG Practice Bulletin on Amenorrhea"
      };
    }
    if (language === "hinglish") {
      return {
        text: "💡 **Direct Answer (Period Late Kyu Hua):**\n2 se 5 din ki delay normal hai. Stress, routine change, travel, thyroid/PCOS shifts ya pregnancy iske main reasons ho sakte hain.\n\n🌿 **Quick Action Steps:**\n• Gungune paani mein adrak aur saunf ubaal kar piyein (pelvic tension relax hoti hai).\n• Agar sexually active hain, to missed date ke 5-7 din baad morning ke first urine se UPT check karein.\n• Stress kam karein aur 8 ghante ki restorative sleep lein.\n\n🚨 **When to Consult Doctor:**\n• Period 10-14 din se zyada delay ho chuka ho ya sharp lower stomach pain ho.",
        isSpecificMatch: true,
        source: "Clinical Menstrual Protocols"
      };
    }
    if (language === "mr") {
      return {
        text: "💡 **थेट उत्तर (पाळी उशीरा येण्याची कारणे):**\nताणतणाव, प्रवास, वजन बदल, हॉर्मोन्स असंतुलन (PCOS/थायरॉईड) किंवा गर्भधारणा यामुळे पाळी २ ते ५ दिवस लांबू शकते.\n\n🌿 **घरगुती उपाय व काळजी:**\n• बडीशेप आणि आल्याचे कोमट पाणी प्यावे.\n• पाळी चुकल्यानंतर ५-७ दिवसांनी युरिन प्रेग्नन्सी टेस्ट (UPT) करावी.\n• ताण कमी करा आणि ७-८ तास शांत झोप घ्या.\n\n🚨 **डॉक्टरांचा सल्ला कधी घ्यावा:**\n• पाळी १० दिवसांपेक्षा जास्त लांबल्यास आणि चाचणी निगेटिव्ह असल्यास.",
        isSpecificMatch: true,
        source: "FOGSI Guidelines on Amenorrhea"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nA variation of 2 to 5 days is very common. Stress, travel, illness, hormonal shifts (PCOS or thyroid), or pregnancy are the most frequent causes.\n\n🌿 **What You Can Do:**\n• **Fennel infusion:** Sip warm fennel (saunf) or ginger water to ease pelvic tension.\n• **Pregnancy test (UPT):** If sexually active, take a test 5–7 days after your missed date using first-morning urine.\n• **Lower cortisol:** Prioritize 7–8 hours of sound sleep and light walking.\n\n🚨 **When to See a Doctor:**\n• Your period is more than 10–14 days late and pregnancy tests are negative.\n• You experience sudden, sharp one-sided abdominal pain.",
      isSpecificMatch: true,
      source: "ACOG Practice Bulletin on Amenorrhea"
    };
  }

  // 5. LOWER BACK PAIN & RADIATING LEG PAIN
  if (
    (hasWord("back", "kamar", "lower back", "reedh", "backache", "legs", "thigh") &&
    hasWord("pain", "dard", "durd", "ache", "stiffness")) ||
    q.includes("कमर दर्द") || q.includes("पीठ दर्द") || q.includes("कंबरदुखी")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (कमर व पैरों में दर्द):**\nपीरियड्स के दौरान गर्भाशय में बनने वाले प्रोस्टाग्लैंडीन रसायन रीढ़ के निचले हिस्से और जांघों की नसों पर दबाव डालते हैं, जिससे कमर दर्द और भारीपन होता है।\n\n🌿 **तुरंत राहत के उपाय:**\n• **गर्म सिकाई (Hot Water Bag):** कमर के निचले हिस्से पर 15-20 मिनट सिकाई करें—मांसपेशियों की ऐंठन तुरंत घटती है।\n• **मार्जरी आसन (Cat-Cow Pose):** 5 मिनट यह आसन करने से रीढ़ की नसों का तनाव दूर होता है।\n• **घुटनों के नीचे तकिया:** पीठ के बल सोते समय घुटनों के नीचे तकिया रखें, इससे रीढ़ पर खिंचाव खत्म होता है।\n• **गुनगुना तिल का तेल:** कमर पर हल्के हाथों से गुनगुने तेल की मालिश करें।\n\n🚨 **डॉक्टर से कब मिलें:**\n• दर्द इतना तेज हो कि चलने या खड़े होने में भी कठिनाई हो।\n• पैरों में सुन्नपन या लगातार झनझनाहट महसूस हो।",
        isSpecificMatch: true,
        source: "Musculoskeletal & Pelvic Pain Protocols"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nUterine cramping chemicals (prostaglandins) refer pain to nearby nerves in your lower spine and upper thighs, causing dull aches and heaviness.\n\n🌿 **What You Can Do (Quick Relief):**\n• **Heat therapy:** Apply a hot water bag to your lower back for 15–20 minutes.\n• **Cat-Cow stretch (Marjaryasana):** Gently arch your back for 5 minutes to release spinal nerve compression.\n• **Pillow under knees:** Sleep on your back with a pillow tucked under your knees to decompress the lower spine.\n• **Gentle warm oil:** Lightly rub warm sesame or mustard oil over tight lower back muscles.\n\n🚨 **When to See a Doctor:**\n• Pain so severe you cannot stand or walk.\n• Numbness, tingling, or shooting pain radiating past your knees.",
      isSpecificMatch: true,
      source: "Orthopedic & Gynecological Pain Management"
    };
  }

  // 6. PERIOD PAIN & CRAMPS (Dysmenorrhea)
  if (
    hasWord("cramp", "cramps", "pain", "dard", "durd", "dysmenorrhea") ||
    q.includes("peth") || q.includes("pet me dard") || q.includes("poti dukhi") ||
    q.includes("दर्द") || q.includes("पेट दर्द") || q.includes("ऐंठन") || q.includes("क्रैम्प") || q.includes("पोटदुखी")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (क्रैम्प्स क्यों होते हैं):**\nपीरियड्स में गर्भाशय अपनी अंदरूनी परत को बाहर निकालने के लिए सिकुड़ता है। प्रोस्टाग्लैंडीन रसायन इस संकुचन को बढ़ाते हैं, जिससे पहले 1-2 दिन पेट व कमर में दर्द होता है।\n\n🌿 **तुरंत राहत के उपाय:**\n• **गर्म सिकाई (Heating Pad):** पेट के निचले हिस्से पर 15-20 मिनट हीटिंग पैड रखें—यह रक्त नलिकाओं को खोलकर दर्द 50% तक घटाता है।\n• **अजवाइन और गुड़ का काढ़ा:** 1 कप पानी में आधा चम्मच अजवाइन और छोटा टुकड़ा गुड़ उबालकर गुनगुना पिएं।\n• **अदरक की चाय:** अदरक प्राकृतिक रूप से दर्द पैदा करने वाले रसायनों को शांत करता है।\n• **बालासन (Child's Pose):** 5 मिनट इस मुद्रा में विश्राम करें, इससे पेल्विक खिंचाव तुरंत कम होता है।\n\n🚨 **डॉक्टर से कब मिलें:**\n• दर्द इतना असहनीय हो कि दवाइयों से भी न रुके।\n• दर्द के साथ लगातार उल्टियां, तेज बुखार या चक्कर आएं।",
        isSpecificMatch: true,
        source: "Evidence-Based Dysmenorrhea Management"
      };
    }
    if (language === "hinglish") {
      return {
        text: "💡 **Direct Answer (Why Cramps Happen):**\nPeriod cramps uterus ke contraction ki wajah se hote hain jo blood flow ke sath lining ko shed karta hai. Days 1-2 par moderate cramps aam baat hai.\n\n🌿 **Quick Relief Steps:**\n• **Heating Pad:** Lower belly par 15-20 minute warm heat lagayein (instant relief milta hai).\n• **Ajwain-Gud Kadha:** 1 cup paani mein thodi ajwain aur gud boil karke gunguna piyein.\n• **Ginger Tea:** Adrak prostaglandins ko natural tarike se block karta hai.\n• **Balasana (Child's Pose):** 5 minutes gentle resting stretch karein.\n\n🚨 **When to Consult Doctor:**\n• Pain level 8/10 ho jo medicines ke baad bhi control na ho, ya regular vomiting ho.",
        isSpecificMatch: true,
        source: "Evidence-Based Dysmenorrhea Management"
      };
    }
    if (language === "mr") {
      return {
        text: "💡 **थेट उत्तर (पोटदुखी का होते):**\nमासिक पाळीच्या वेळी गर्भाशयाचे स्नायू आकुंचन पावल्यामुळे पहिल्या १-२ दिवसांत पोटात व कंबरेत वेदना जाणवतात.\n\n🌿 **घरगुती उपाय व आराम:**\n• **कोमट पाण्याचा शेक:** पोटावर १५-२० मिनिटे गरम पाण्याच्या पिशवीने शेक द्यावा.\n• **बडीशेप किंवा आल्याचा काढा:** आल्यामध्ये नैसर्गिक वेदनाशामक गुणधर्म असतात.\n• **बालासन (Child's Pose):** ५ मिनिटे हलके स्ट्रेचिंग करून विश्रांती घ्या.\n• **भरपूर पाणी प्या:** शरीरातील डिहायड्रेशन कमी ठेवा.\n\n🚨 **डॉक्टरांचा सल्ला कधी घ्यावा:**\n• असह्य वेदनांमुळे दैनंदिन कामे करणे अशक्य झाल्यास किंवा चक्कर आल्यास.",
        isSpecificMatch: true,
        source: "FOGSI Dysmenorrhea Guidelines"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nPeriod cramps occur when uterine muscles contract to shed their lining. Prostaglandin chemicals cause these muscles to tighten, causing dull or sharp aches on days 1 and 2.\n\n🌿 **What You Can Do (Quick Relief):**\n• **Heat therapy:** Apply a heating pad to your lower abdomen for 15–20 minutes (relaxes muscle spasms immediately).\n• **Ginger or ajwain tea:** Fresh ginger naturally blocks inflammatory pain pathways.\n• **Child's pose (Balasana):** 5 minutes of restorative stretching unloads pelvic floor tension.\n• **Hydrate with warm water:** Keeps blood flowing smoothly and reduces bloating.\n\n🚨 **When to See a Doctor:**\n• Severe pain (8+/10) that does not respond to heat or standard OTC pain relief.\n• Cramps accompanied by persistent vomiting, high fever, or cyclical bowel pain.",
      isSpecificMatch: true,
      source: "ACOG & RCOG Dysmenorrhea Guidelines"
    };
  }

  // 7. PCOS / PCOD / CYSTIC OVARIES
  if (
    q.includes("pcos") || q.includes("pcod") || q.includes("polycystic") || q.includes("facial hair") || 
    q.includes("hirsutism") || q.includes("chin hair") || q.includes("irregular period") || q.includes("weight gain") ||
    q.includes("पीसीओएस") || q.includes("पीसीओडी") || q.includes("अनियमित माहवारी") || q.includes("चेहरे पर बाल")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (पीसीओएस/पीसीओडी क्या है):**\nयह एक हार्मोनल और मेटाबॉलिक स्थिति है जिसमें ओवरीज में छोटे-छोटे फॉलिकल्स जमा हो जाते हैं, जिससे ओव्यूलेशन रुक जाता है और पीरियड्स में देरी, मुहांसे या वजन बढ़ता है।\n\n🌿 **स्वस्थ जीवनशैली के उपाय:**\n• **कम चीनी और रिफाइंड कार्ब्स:** मैदा और पैकेज्ड फूड बंद करें; ज्वार, बाजरा, रागी, और हरी सब्जियां बढ़ाएं।\n• **भीगा मेथी दाना:** 1 चम्मच मेथी दाना रात में भिगोकर सुबह पानी पिएं—यह इंसुलिन स्तर सुधारता है।\n• **30 मिनट रोजाना वॉक:** नियमित ब्रिस्क वॉक से ओव्यूलेशन समय पर होने लगता है।\n• **7-8 घंटे की गहरी नींद:** हार्मोन संतुलन के लिए रात को समय पर सोएं।\n\n🚨 **डॉक्टर से कब मिलें:**\n• पीरियड 2-3 महीने से न आया हो या चेहरे पर तेजी से बाल बढ़ रहे हों।",
        isSpecificMatch: true,
        source: "FOGSI & ACOG PCOS Guidelines"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nPCOS is a common hormonal condition where ovaries develop small fluid-filled follicles and insulin levels run high, leading to delayed cycles, acne, and weight retention.\n\n🌿 **What You Can Do:**\n• **Low-GI whole foods:** Switch from refined flour and sugar to millets (ragi, jowar), lentils, and fresh greens.\n• **Soaked methi water:** Soak 1 tsp fenugreek seeds overnight and drink the water in the morning to improve insulin sensitivity.\n• **30-minute daily walk:** Consistent moderate movement restores regular ovulation.\n• **Restorative sleep:** 7–8 hours of consistent sleep keeps cortisol and androgens in check.\n\n🚨 **When to See a Doctor:**\n• Cycles regularly longer than 35–40 days, or periods absent for 3+ consecutive months.",
      isSpecificMatch: true,
      source: "Monash International Evidence-Based PCOS Guidelines"
    };
  }

  // 8. VAGINAL DISCHARGE (White, Yellow, Green, Clear)
  if (
    q.includes("discharge") || q.includes("safed pani") || q.includes("white water") || 
    q.includes("safed srav") || q.includes("white discharge") || q.includes("leukorrhea") || q.includes("likoria") ||
    q.includes("itching") || q.includes("khujli") ||
    q.includes("सफेद पानी") || q.includes("सफेद स्त्राव") || q.includes("डिस्चार्ज") || q.includes("खुजली") || q.includes("पांढरा स्त्राव")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (सफेद पानी सामान्य है या नहीं):**\nपारदर्शी, हल्का सफेद या क्रीमी डिस्चार्ज जिसमें कोई बदबू या खुजली न हो, 100% सामान्य और प्राकृतिक है। यह ओव्यूलेशन और पीरियड से पहले बदलता रहता है।\n\n🌿 **इन्फेक्शन के लक्षण (कब ध्यान दें):**\n• **फटे दूध/दही जैसा गाढ़ा सफेद + तेज खुजली:** यीस्ट इन्फेक्शन (Candidiasis)।\n• **पीला या हरा डिस्चार्ज + दुर्गंध:** बैक्टीरियल इन्फेक्शन (BV)।\n\n🌿 **स्वच्छता नियम:**\n• 100% सूती (Cotton) अंडरवियर पहनें।\n• केवल सादे गुनगुने पानी से आगे से पीछे की तरफ धोएं; सुगंधित साबुन या डियोड्रेंट से बचें।\n\n🚨 **डॉक्टर से कब मिलें:**\n• तीव्र खुजली, जलन, बदबूदार स्राव या पेल्विक हिस्से में दर्द हो।",
        isSpecificMatch: true,
        source: "Gynecological Health & Infection Protocols"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nClear, slippery, or milky white discharge without itching or foul odor is completely healthy and normal. It keeps the vaginal canal clean and self-balancing.\n\n🌿 **Healthy vs. Infection Signals:**\n• **Normal:** Clear & stretchy (during ovulation) or thin milky white (pre-period), non-irritating.\n• **Yeast infection:** Thick cottage cheese-like white clumps + intense itching.\n• **Bacterial infection:** Grayish, yellow, or greenish discharge with a distinct fishy odor.\n\n🌿 **Care Steps:**\n• Wear breathable 100% cotton underwear.\n• Cleanse gently with plain lukewarm water; never douche or use scented soaps.\n\n🚨 **When to See a Doctor:**\n• Discharge with severe burning, intense vulvar itch, foul odor, or pelvic discomfort.",
      isSpecificMatch: true,
      source: "CDC STI & Vaginitis Treatment Guidelines"
    };
  }

  // 9. PREGNANCY DOUBTS & TESTING TIMING
  if (
    q.includes("pregnant") || q.includes("pregnancy") || q.includes("garbh") || q.includes("conceive") || 
    q.includes("upt") || q.includes("pregnancy test") || q.includes("bacha") || q.includes("morning sickness") ||
    q.includes("vomiting morning") ||
    q.includes("प्रेगनेंसी") || q.includes("गर्भावस्था") || q.includes("गर्भधारण") || q.includes("बच्चा") || q.includes("उल्टी")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (गर्भावस्था की सही जांच):**\nमाहवारी मिस होना गर्भावस्था का सबसे प्रमुख शुरुआती संकेत है। इसके अलावा स्तनों में भारीपन, सुबह जी मिचलाना और अत्यधिक थकान महसूस हो सकती है।\n\n🌿 **जांच का सही तरीका व समय:**\n• **कब टेस्ट करें:** पीरियड की तारीख मिस होने के **5 से 7 दिन बाद**।\n• **सही नमूना:** सुबह का **पहला यूरिन (First Morning Urine)** इस्तेमाल करें, इसमें प्रेगनेंसी हार्मोन (hCG) सबसे अधिक गाढ़ा होता है।\n• **हल्का धब्बा (Spotting):** पीरियड की तारीख से 1-2 दिन पहले हल्का भूरा या गुलाबी धब्बा इम्प्लांटेशन का सामान्य संकेत हो सकता है।\n\n🚨 **डॉक्टर से कब मिलें:**\n• टेस्ट पॉजिटिव आने पर तुरंत फोलिक एसिड (Folic Acid) शुरू करने और सोनोग्राफी के लिए।\n• पेट में तेज एकतरफा दर्द या भारी रक्तस्राव हो।",
        isSpecificMatch: true,
        source: "ACOG Early Pregnancy Guidelines"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nA missed period is the earliest indicator of pregnancy, often joined by breast tenderness, morning nausea, tiredness, and frequent urination.\n\n🌿 **Testing Guidelines:**\n• **When to test:** Perform a home urine pregnancy test (UPT) **5 to 7 days after your missed date**.\n• **Best sample:** Use your **first-morning urine**, which holds the highest concentration of the hCG hormone.\n• **Implantation spotting:** Light pink or brownish spotting 6–10 days post-ovulation lasting 1–2 days is often harmless.\n\n🚨 **When to See a Doctor:**\n• If your test shows a faint or clear positive line to start daily 400 mcg Folic Acid.\n• Sudden sharp unilateral abdominal pain or abnormal bleeding.",
      isSpecificMatch: true,
      source: "ACOG Early Pregnancy Guidelines"
    };
  }

  // 10. HEAVY BLEEDING & CLOTS (Menorrhagia)
  if (
    q.includes("heavy bleeding") || q.includes("heavy flow") || q.includes("clots") || q.includes("bahut jyada khoon") ||
    q.includes("thakke") || q.includes("raktasrav") || q.includes("over bleeding") ||
    q.includes("भारी रक्तस्राव") || q.includes("ज्यादा खून") || q.includes("थक्के") || q.includes("रक्तस्राव")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (भारी ब्लीडिंग और थक्के):**\nजब रक्त प्रवाह बहुत तेज होता है, तो शरीर के एंटी-क्लॉटिंग एंजाइम उसे पतला नहीं कर पाते, जिससे छोटे थक्के बनते हैं। 1-2 छोटे सिक्के के आकार के थक्के सामान्य हैं।\n\n🌿 **आप क्या कर सकती हैं:**\n• **आयरन युक्त आहार:** खून की कमी से बचने के लिए पालक, भुना चना + गुड़, चुकंदर और अनार खाएं।\n• **विटामिन सी जोड़ें:** भोजन पर नींबू निचोड़ें, इससे आयरन 3 गुना तेजी से शरीर में सोखता है।\n• **धनिया बीज का काढ़ा:** 1 चम्मच धनिया बीज पानी में उबालकर पिएं—यह अत्यधिक फ्लो को संतुलित करने में मदद करता है।\n\n🚨 **आपातकालीन रेड फ्लैग्स (तुरंत अस्पताल जाएं):**\n• लगातार 2 घंटे से हर घंटे 1-2 बड़े पैड पूरी तरह भीगना।\n• नींबू के आकार के बड़े थक्के निकलना या चक्कर आकर बेहोशी होना।",
        isSpecificMatch: true,
        source: "FIGO PALM-COEIN Classification for AUB"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nHeavy bleeding happens when rapid blood flow temporarily exceeds the body's natural anti-clotting enzymes, causing small dark clots. Small coin-sized clots on peak flow days can be normal.\n\n🌿 **What You Can Do:**\n• **Rest & avoid heavy exertion:** Elevate your legs and take extra rest on heavy days.\n• **Iron-rich nutrition:** Eat spinach, lentils, roasted chickpeas with jaggery, and beetroot.\n• **Add Vitamin C:** Squeeze fresh lemon over meals to triple iron absorption.\n• **Coriander decoction:** Boil 1 tsp coriander seeds in water and sip warm twice daily.\n\n🚨 **Emergency Red Flags (Seek Immediate Care):**\n• Soaking through 1–2 large pads every hour for 2 consecutive hours.\n• Passing clots larger than a lemon or coin (2.5 cm).\n• Feeling dizzy, breathless, pale, or fainting.",
      isSpecificMatch: true,
      source: "FIGO PALM-COEIN Classification for AUB"
    };
  }

  // 11. LIGHT BLEEDING / SPOTTING / SCANTY FLOW
  if (
    q.includes("light period") || q.includes("spotting") || q.includes("kam bleeding") || 
    q.includes("scanty") || q.includes("sirf daag") || q.includes("brown blood") || q.includes("dhabbe") ||
    q.includes("हल्की ब्लीडिंग") || q.includes("कम पीरियड") || q.includes("भूरा खून") || q.includes("धब्बे")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (हल्की ब्लीडिंग या भूरा खून):**\nभूरा खून पुराना ऑक्सिडाइज्ड खून होता है जो गर्भाशय से धीरे निकलता है—पीरियड के पहले या आखिरी दिन यह 100% सामान्य है। बहुत कम ब्लीडिंग हीमोग्लोबिन की कमी (एनीमिया) या तनाव के कारण हो सकती है।\n\n🌿 **घरेलू उपाय व पोषण:**\n• **हल्दी वाला गुनगुना दूध:** रात को सोने से पहले आधा चम्मच हल्दी मिलाकर पिएं।\n• **तिल और गुड़:** रोज थोड़ा तिल और गुड़ खाएं, यह पेल्विक ब्लड फ्लो को प्राकृतिक रूप से नियमित करता है।\n• **हीमोग्लोबिन सुरक्षित रखें:** अनार, पालक, खजूर और भुना चना खाएं।\n\n🚨 **डॉक्टर से कब मिलें:**\n• यदि सामान्य ब्लीडिंग की जगह सिर्फ 1 दिन स्पॉटिंग हो और गर्भधारण की संभावना हो।",
        isSpecificMatch: true,
        source: "ACOG Guidelines on Hypomenorrhea"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nBrown blood is simply older, oxidized blood that took longer to leave the uterus—completely normal on days 1 and 5. Scanty flow can also be linked to low hemoglobin (anemia) or stress.\n\n🌿 **What You Can Do:**\n• **Sesame & jaggery:** Eat a small portion of roasted sesame seeds with jaggery daily to encourage healthy uterine blood flow.\n• **Golden turmeric milk:** Sip warm milk with a pinch of turmeric before bed.\n• **Nourish hemoglobin:** Increase intake of lentils, dark leafy greens, and dried figs.\n\n🚨 **When to See a Doctor:**\n• Spotting replaces your regular period and there is a possibility of pregnancy.",
      isSpecificMatch: true,
      source: "ACOG Guidelines on Hypomenorrhea"
    };
  }

  // 12. PMS, PMDD, MOOD SWINGS & IRRITABILITY
  if (
    q.includes("pms") || q.includes("pmdd") || q.includes("mood") || q.includes("chidchidapan") || 
    q.includes("rona") || q.includes("anger") || q.includes("anxiety") || q.includes("gussa") ||
    q.includes("depression") || q.includes("crying") ||
    q.includes("मूड") || q.includes("चिड़चिड़ापन") || q.includes("गुस्सा") || q.includes("रोना") || q.includes("तनाव")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (मूड स्विंग्स क्यों होते हैं):**\nपीरियड से 5-7 दिन पहले एस्ट्रोजन और प्रोजेस्टेरोन में अचानक गिरावट आती है, जिससे दिमाग में 'खुशी वाला हार्मोन' (Serotonin) कम हो जाता है और चिड़चिड़ापन या गुस्सा बढ़ जाता है।\n\n🌿 **राहत के तरीके:**\n• **मैग्नीशियम वाले खाद्य पदार्थ:** डार्क चॉकलेट, कद्दू के बीज और बादाम खाएं—ये नसों को शांत रखते हैं।\n• **चाय-कॉफी कम करें:** ज्यादा कैफीन घबराहट और गुस्सा बढ़ाता है।\n• **10 मिनट गहरी सांसें (अनुलोम-विलोम):** सुबह शांत बैठकर गहरी सांसें लें।\n• **कैमोमाइल या पुदीने की चाय:** शाम को यह चाय पीने से तनाव और अनिद्रा दूर होती है।\n\n🚨 **डॉक्टर से कब मिलें:**\n• यदि अत्यधिक अवसाद या निराशा की भावना दैनिक जीवन और रिश्तों को प्रभावित करने लगे (PMDD)।",
        isSpecificMatch: true,
        source: "ISPMD Consensus Guidelines on PMDD"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nIn the week before your period, dropping estrogen and progesterone levels temporarily reduce serotonin (the brain's mood-stabilizing chemical), causing irritability or weepiness.\n\n🌿 **What You Can Do (Quick Relief):**\n• **Magnesium boost:** Snack on pumpkin seeds, almonds, or a square of dark chocolate to ease nervous tension.\n• **Cut back on caffeine:** Taper coffee and soda, which amplify jitteriness and anxiety.\n• **10-minute deep breathing:** Practice slow abdominal breathing or gentle yoga.\n• **Chamomile or peppermint tea:** Calms irritability and supports restful sleep.\n\n🚨 **When to See a Doctor:**\n• Severe premenstrual dysphoria (PMDD) interfering with work, studies, or daily relationships.",
      isSpecificMatch: true,
      source: "ISPMD Consensus Guidelines on PMDD"
    };
  }

  // 13. DIET, NUTRITION, ANEMIA & HEMOGLOBIN
  if (
    hasWord("diet", "nutrition", "food", "khana", "anemia", "hemoglobin", "iron", "kya khaye") ||
    q.includes("आहार") || q.includes("खाना") || q.includes("एनीमिया") || q.includes("हीमोग्लोबिन") || q.includes("कमजोरी") || q.includes("खून की कमी")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (खून और हीमोग्लोबिन बढ़ाने के नियम):**\nमहिलाओं में 12 g/dL से कम हीमोग्लोबिन होने पर अत्यधिक थकान, चक्कर और कमजोरी होती है। सही भोजन से हीमोग्लोबिन 3-4 हफ्तों में तेजी से सुधारा जा सकता है।\n\n🌿 **सर्वोत्तम आहार सूत्र:**\n• **पावर कॉम्बो:** भुना चना + थोड़ा गुड़ रोज शाम को नाश्ते में खाएं।\n• **हरी पत्तेदार सब्जियां:** पालक, मेथी, सहजन (मोरिंगा), चुकंदर और अनार।\n• **नींबू का जादुई नियम:** जब भी दाल या पत्तेदार सब्जी खाएं, उस पर नींबू निचोड़ें—विटामिन C आयरन का अवशोषण 3 गुना बढ़ा देता है!\n• **भोजन के बाद चाय न पिएं:** खाने के 1 घंटे पहले और बाद में चाय-कॉफी न पिएं (टैनिन आयरन को सोखने से रोकता है)।\n\n🚨 **डॉक्टर से कब मिलें:**\n• हीमोग्लोबिन 8 से कम हो, या चलने में लगातार सांस फूलती हो और नाखून सफेद पड़ रहे हों।",
        isSpecificMatch: true,
        source: "ICMR & WHO Nutritional Anemia Guidelines"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nA healthy hemoglobin level (12+ g/dL) is essential to prevent period fatigue, brain fog, and dizziness. Plant-based iron works best when paired with vitamin C.\n\n🌿 **Top Dietary Rules:**\n• **Power combo:** Roasted black chickpeas (chana) + jaggery (gur) daily.\n• **Iron-rich greens:** Spinach, drumstick leaves (moringa), beetroot, and lentils.\n• **The Lemon Rule:** Always squeeze fresh lemon over your meals—Vitamin C triples iron uptake!\n• **The 1-Hour Tea Rule:** Avoid tea or coffee within 60 minutes of meals, as tannins block iron absorption.\n\n🚨 **When to See a Doctor:**\n• Constant exhaustion, brittle pale nails, or hemoglobin below 9 g/dL.",
      isSpecificMatch: true,
      source: "ICMR Guidelines for Dietary Management"
    };
  }

  // 14. GHARELU UPAY / AYURVEDIC HOME REMEDIES
  if (
    q.includes("gharelu") || q.includes("upay") || q.includes("nuskha") || q.includes("ayurvedic") || 
    q.includes("home remedy") || q.includes("ajwain") || q.includes("adrak") || q.includes("haldi") ||
    q.includes("घरेलू उपाय") || q.includes("नुस्खा") || q.includes("नुस्खे") || q.includes("उपाय") || q.includes("काढ़ा")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (सुरक्षित व प्रमाणित घरेलू नुस्खे):**\nआयुर्वेदिक नुस्खे गर्भाशय की ऐंठन को शांत करते हैं, सूजन घटाते हैं और गैस की समस्या दूर करते हैं।\n\n🌿 **चार सबसे असरदार नुस्खे:**\n• **अजवाइन-गुड़ का काढ़ा (क्रैम्प्स के लिए):** 1 कप पानी में आधा चम्मच अजवाइन और छोटा टुकड़ा गुड़ उबालकर गुनगुना पिएं।\n• **अदरक-नींबू की चाय (मतली व दर्द के लिए):** कद्दूकस अदरक 5 मिनट उबालें, थोड़ा शहद और नींबू मिलाएं।\n• **हल्दी वाला दूध (रात के आराम के लिए):** सोने से पहले 1 कप गुनगुने दूध में चुटकी भर हल्दी पिएं।\n• **मेथी दाना पानी (हार्मोन व गैस के लिए):** रात में 1 चम्मच मेथी पानी में भिगोकर सुबह खाली पेट पिएं।",
        isSpecificMatch: true,
        source: "Ayush Clinical Protocols for Stree Rog"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nTraditional botanical remedies provide gentle antispasmodic and anti-inflammatory relief to smooth uterine muscles without harsh side effects.\n\n🌿 **Top 4 Proven Home Remedies:**\n• **Ajwain-Jaggery Warm Decoction (Cramps):** Boil 1/2 tsp carom seeds + a small piece of jaggery in 1 cup of water. Sip warm.\n• **Ginger-Lemon Infusion (Pain & Nausea):** Boil fresh crushed ginger for 5 minutes; add honey and lemon.\n• **Golden Turmeric Milk (Night Rest):** Sip warm milk with a pinch of turmeric and black pepper before bed.\n• **Soaked Methi Water (Hormones & Bloating):** Soak 1 tsp fenugreek seeds overnight and drink the water in the morning.",
      isSpecificMatch: true,
      source: "Evidence-Based Complementary Integrative Medicine"
    };
  }

  // 15. BLOATING, DIGESTION & PERIOD POOPS
  if (
    q.includes("bloat") || q.includes("gas") || q.includes("pet phoolna") || q.includes("constipation") || 
    q.includes("kabz") || q.includes("dast") || q.includes("diarrhea") || q.includes("period poop")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (पेट फूलना और पाचन समस्याएं):**\nपीरियड से पहले प्रोजेस्टेरोन आंतों की गति धीमी कर देता है (कब्ज व गैस), जबकि ब्लीडिंग शुरू होने पर प्रोस्टाग्लैंडीन आंतों को उत्तेजित करते हैं (दस्त या बार-बार शौच आना)।\n\n🌿 **राहत के आसान कदम:**\n• **गुनगुना पानी:** दिन भर में 2.5 लीटर गुनगुना पानी पिएं।\n• **सौंफ चबाएं:** भोजन के बाद आधा चम्मच सौंफ चबाने से गैस शांत होती है।\n• **जीरा छाछ:** दोपहर के भोजन में भुना जीरा और काला नमक वाली छाछ पिएं।\n• **नमक कम करें:** चिप्स और अचार से बचें ताकि शरीर में पानी जमा (Water retention) न हो।",
        isSpecificMatch: true,
        source: "Gastrointestinal Gynecology Guidelines"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nHigh progesterone slows your digestive tract before periods (causing gas and constipation), while prostaglandins during bleeding stimulate bowel contractions ('period poops').\n\n🌿 **What You Can Do:**\n• **Warm hydration:** Drink 2.5 liters of warm water throughout the day.\n• **Chew fennel seeds (Saunf):** 1/2 tsp after meals relieves abdominal gas.\n• **Spiced buttermilk:** Enjoy fresh chaas with roasted cumin and rock salt.\n• **Limit excess sodium:** Cut down on chips and packaged snacks to prevent water retention.",
      isSpecificMatch: true,
      source: "Clinical Gastroenterology Guidelines"
    };
  }

  // 16. BREAST PAIN & MASTALGIA
  if (
    q.includes("breast") || q.includes("stan") || q.includes("chhati me dard") || q.includes("nipple") || 
    q.includes("mastalgia") || q.includes("breast soreness")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (स्तनों में भारीपन व दर्द):**\nपीरियड से पहले एस्ट्रोजन और प्रोजेस्टेरोन बढ़ने से स्तनों के ऊतकों में पानी भर जाता है। ब्लीडिंग शुरू होते ही यह दर्द अपने आप गायब हो जाता है।\n\n🌿 **राहत के तरीके:**\n• **आरामदायक ब्रा:** बिना तार (Wire-free) वाली मुलायम सूती ब्रा पहनें।\n• **कैफीन कम करें:** पीरियड से 3-4 दिन पहले कॉफी और तेज चाय कम पिएं।\n• **अलसी के बीज (Flaxseeds):** रोज 1 चम्मच अलसी चूर्ण दही में मिलाकर खाएं।\n\n🚨 **डॉक्टर से कब मिलें:**\n• यदि स्तन में कोई सख्त गांठ, निप्पल से स्राव या ऐसा दर्द हो जो पीरियड के बाद भी न जाए।",
        isSpecificMatch: true,
        source: "RCOG Clinical Guidelines on Benign Breast Pain"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nRising progesterone before your period causes breast glands and tissue to retain fluid, leading to soreness and fullness that disappears within 1–2 days of bleeding.\n\n🌿 **What You Can Do:**\n• **Wire-free cotton bra:** Wear comfortable, non-wired support.\n• **Cut back on caffeine:** Taper coffee, soda, and strong tea in the pre-period week.\n• **Ground flaxseed:** 1 tablespoon daily in curd helps naturally balance estrogen.\n\n🚨 **When to See a Doctor:**\n• A distinct hard lump, skin changes, nipple discharge, or pain persisting past your cycle.",
      isSpecificMatch: true,
      source: "RCOG Clinical Guidelines on Benign Breast Pain"
    };
  }

  // 17. HORMONAL HEADACHES & MIGRAINE
  if (
    q.includes("headache") || q.includes("sir dard") || q.includes("sar dard") || q.includes("migraine") || 
    q.includes("adha sirdard")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (पीरियड सिरदर्द व माइग्रेन):**\nपीरियड शुरू होने से ठीक पहले एस्ट्रोजन हार्मोन में अचानक गिरावट आने से मस्तिष्क की रक्त नलिकाओं में संकुचन होता है, जिससे सिरदर्द ट्रिगर होता है।\n\n🌿 **तुरंत राहत के उपाय:**\n• **ठंडी सिकाई (Cold Pack):** माथे और गर्दन के पीछे 15 मिनट ठंडी पट्टी या आइस पैक रखें।\n• **शांत अंधेरा कमरा:** फोन स्क्रीन बंद करके 20-30 मिनट शांत कमरे में लेटें।\n• **इलेक्ट्रोलाइट्स:** नारियल पानी या ओआरएस पिएं (डिहाइड्रेशन सिरदर्द को बढ़ाता है)।\n• **कद्दू के बीज व बादाम:** मैग्नीशियम से भरपूर स्नैक्स खाएं।\n\n🚨 **डॉक्टर से कब मिलें:**\n• अचानक असहनीय तीव्र सिरदर्द (Thunderclap), धुंधला दिखना या उल्टी आना।",
        isSpecificMatch: true,
        source: "International Headache Society (IHS) Guidelines"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nThe sharp drop in estrogen right before your period causes blood vessels in the brain to constrict, triggering menstrual headaches or migraines.\n\n🌿 **What You Can Do (Quick Relief):**\n• **Cold compress:** Place an ice pack or cool wet towel on your forehead and neck.\n• **Quiet, dim room:** Rest your eyes away from phone screens for 20–30 minutes.\n• **Hydrate with electrolytes:** Sip tender coconut water or lemon-salt water.\n• **Magnesium snacks:** Enjoy a handful of pumpkin seeds or soaked almonds.\n\n🚨 **When to See a Doctor:**\n• Sudden 'thunderclap' headache, blurred vision, or migraines unresponsive to rest.",
      isSpecificMatch: true,
      source: "International Headache Society (IHS) Guidelines"
    };
  }

  // 18. HORMONAL ACNE & SKIN
  if (
    q.includes("acne") || q.includes("pimples") || q.includes("muhase") || q.includes("phunsi") || 
    q.includes("skin") || q.includes("jawline") || q.includes("chin")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (पीरियड में मुहांसे):**\nपीरियड से 7 दिन पहले टेस्टोस्टेरोन का असर बढ़ जाता है, जिससे त्वचा की ग्रंथियां अतिरिक्त तेल बनाती हैं और ठोड़ी/जबड़े पर मुहांसे निकलते हैं।\n\n🌿 **स्किन केयर नियम:**\n• **माइल्ड फेस वॉश:** चेहरे को दिन में दो बार सैलिसिलिक एसिड या नीम वाले फेसवॉश से धोएं।\n• **मुहांसों को कभी न फोड़ें:** इससे बैक्टीरिया फैलते हैं और जिद्दी दाग बनते हैं।\n• **चीनी व तला-भुना कम करें:** मीठा और पैकेज्ड स्नैक्स तेल उत्पादन बढ़ाते हैं।\n• **पुदीने की चाय (Spearmint tea):** यह प्राकृतिक रूप से एंड्रोजन को संतुलित करने में मदद करती है।",
        isSpecificMatch: true,
        source: "AAD Guidelines on Hormonal Acne"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nBefore periods, a relative rise in androgens triggers skin oil glands to produce excess sebum, clogging pores along your chin and jawline.\n\n🌿 **What You Can Do:**\n• **Gentle cleanser:** Wash your face twice daily with a salicylic acid or zinc-based cleanser.\n• **Never pop pimples:** Squeezing drives inflammation deeper and causes dark hyperpigmentation.\n• **Taper dairy treats & sugar:** High-glycemic sweets trigger skin oil surges.\n• **Spearmint tea:** Sipping 1 cup daily gently balances skin androgens.",
      isSpecificMatch: true,
      source: "AAD Guidelines on Hormonal Acne"
    };
  }

  // 19. EXERCISE, YOGA & REST DURING CYCLES
  if (
    q.includes("exercise") || q.includes("yoga") || q.includes("gym") || q.includes("workout") || 
    q.includes("kasrat") || q.includes("chalna") || q.includes("running")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (पीरियड्स में कसरत व योग):**\nपीरियड्स के दौरान हल्की कसरत से एंडोर्फिन (प्राकृतिक दर्द निवारक) निकलते हैं और पेल्विक ब्लड सर्कुलेशन सुधरता है।\n\n🌿 **सुरक्षित व्यायाम गाइड:**\n• **दिन 1-2:** भारी जिम वजन न उठाएं। 20 मिनट की हल्की सैर, बालासन (Child's Pose) और तितली आसन (Butterfly Pose) करें।\n• **दिन 3-5:** हल्का स्ट्रेचिंग, योग और सामान्य बॉडीवेट एक्सरसाइज कर सकती हैं।\n• **क्या न करें:** उल्टे होने वाले आसन (शीर्षासन/सर्वांगासन) या भारी वजन उठाना टालें।",
        isSpecificMatch: true,
        source: "ACSM Sports Medicine Guidelines"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nLight to moderate movement during your period releases endorphins (natural pain relievers) and increases pelvic blood flow to ease cramps.\n\n🌿 **Phase-by-Phase Movement:**\n• **Days 1–2 (Restorative):** Gentle 20-min walking, Child's Pose (Balasana), and Butterfly Pose (Baddha Konasana).\n• **Days 3–5 (Moderate):** Light stretching, yoga flow, and light bodyweight exercises.\n• **What to avoid:** Heavy deadlifts, intense HIIT, and inverted poses (headstands / Sirsasana).",
      isSpecificMatch: true,
      source: "ACSM Sports Medicine Guidelines"
    };
  }

  // 20. NORMAL CYCLE LENGTH & PHYSIOLOGY
  if (
    q.includes("normal cycle") || q.includes("kitne din") || q.includes("how many days") || 
    q.includes("cycle length") || q.includes("samanya") || q.includes("regular period")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (सामान्य माहवारी के मानक):**\nएक पीरियड के पहले दिन से अगले पीरियड के पहले दिन के बीच **21 से 35 दिन** का समय पूरी तरह सामान्य और स्वस्थ माना जाता है (औसत: 28 दिन)।\n\n🌿 **सामान्य स्वास्थ्य मानक:**\n• **ब्लीडिंग के दिन:** 2 से 7 दिन तक रक्तस्राव।\n• **पैड बदलना:** दिन में 3 से 5 सामान्य पैड (लगभग 30–50 मिलीलीटर कुल रक्तस्राव)।\n• **महीने-दर-महीने बदलाव:** 2-4 दिन आगे-पीछे होना स्वाभाविक है।\n\n🚨 **डॉक्टर से कब मिलें:**\n• साइकल 21 दिन से छोटी या 35 दिन से बड़ी हो, या फ्लो 8 दिन से ज्यादा चले।",
        isSpecificMatch: true,
        source: "FIGO Menstrual Health Standards"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nA healthy menstrual cycle lasts between **21 and 35 days** (average 28 days), calculated from the first day of one bleed to the first day of the next.\n\n🌿 **Healthy Benchmarks:**\n• **Flow duration:** 2 to 7 days of bleeding.\n• **Absorbency:** Changing 3–5 regular pads per day (approx. 30–50 mL total blood loss).\n• **Normal variability:** Cycles varying by 2–4 days month-to-month is completely healthy.\n\n🚨 **When to See a Doctor:**\n• Cycles consistently shorter than 21 days or longer than 35 days.\n• Bleeding exceeding 8 days or bleeding occurring between cycles.",
      isSpecificMatch: true,
      source: "FIGO Menstrual Health Standards"
    };
  }

  // 21. CONTRACEPTION, BIRTH CONTROL & PILLS
  if (
    q.includes("pill") || q.includes("contraceptive") || q.includes("i-pill") || q.includes("saheli") || 
    q.includes("emergency") || q.includes("condom") || q.includes("garbhavastha rokne") || q.includes("mala-d")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (गर्भनिरोधक और इमरजेंसी पिल्स):**\nइमरजेंसी पिल (जैसे i-pill) केवल असुरक्षित संबंध के 72 घंटों के भीतर ली जाती है। यह ओव्यूलेशन को रोककर काम करती है।\n\n🌿 **महत्वपूर्ण तथ्य:**\n• **नियमित इस्तेमाल न करें:** इमरजेंसी पिल में भारी हार्मोनल डोज होती है; बार-बार लेने से आगे की 2-3 साइकल अनियमित हो जाती हैं।\n• **संभावित साइड इफेक्ट्स:** हल्की मतली, सिरदर्द, या अगला पीरियड कुछ दिन पहले/बाद में आना।\n• **नियमित गर्भनिरोध:** नियमित सुरक्षा के लिए डॉक्टर की सलाह से सहेली (Centchroman) या बैरियर तरीकों का उपयोग करें।",
        isSpecificMatch: true,
        source: "WHO Family Planning Guidelines"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nEmergency contraceptive pills (such as i-pill) work primarily by delaying ovulation and must be taken within 72 hours of unprotected intercourse.\n\n🌿 **Key Facts to Know:**\n• **Not for regular use:** ECPs contain high hormone doses; frequent use disrupts your cycle for months.\n• **Expected side effects:** Mild nausea, headache, or your next period arriving 2–7 days early or late.\n• **Ongoing contraception:** Consult a gynecologist for non-steroidal regular oral pills (e.g. Saheli) or barrier methods.",
      isSpecificMatch: true,
      source: "WHO Family Planning Guidelines"
    };
  }

  // 22. PERIMENOPAUSE & MENOPAUSE (Hot Flashes, Night Sweats)
  if (
    q.includes("menopause") || q.includes("perimenopause") || q.includes("hot flash") || 
    q.includes("garmi lagna") || q.includes("pasina") || q.includes("rajonivritti") || q.includes("age 40")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (पेरीमेनोपॉज क्या है):**\n40-45 वर्ष की आयु के बाद एस्ट्रोजन हार्मोन में उतार-चढ़ाव शुरू होता है, जिससे अचानक गर्मी लगना (Hot Flashes), रात में पसीना और पीरियड्स में अनियमितता आती है।\n\n🌿 **राहत के तरीके:**\n• **हल्के सूती कपड़े:** अचानक गर्मी लगने पर ठंडा पानी पिएं।\n• **सोया और अलसी (Flaxseeds):** इनमें प्राकृतिक फाइटोएस्ट्रोजन होते हैं जो हार्मोनल उतार-चढ़ाव को संतुलित करते हैं।\n• **हड्डियों की मजबूती:** कैल्शियम के लिए दूध, दही, मखाना और तिल का सेवन करें।",
        isSpecificMatch: true,
        source: "Indian Menopause Society (IMS) Guidelines"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nPerimenopause typically begins in the 40s when fluctuating estrogen levels cause sudden warmth (hot flashes), night sweats, and cycle irregularity.\n\n🌿 **What You Can Do:**\n• **Hot flashes relief:** Dress in breathable cotton layers and keep cool drinking water handy.\n• **Flaxseeds (Alsi):** 1 tablespoon daily provides gentle plant phytoestrogens.\n• **Bone protection:** Support bone density with calcium-rich sesame seeds, yogurt, and makhana.",
      isSpecificMatch: true,
      source: "North American Menopause Society (NAMS) Guidelines"
    };
  }

  // 23. THYROID AND MENSTRUAL HEALTH
  if (
    q.includes("thyroid") || q.includes("tsh") || q.includes("gale me sujan") || q.includes("hypothyroid")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (थायरॉइड और माहवारी का संबंध):**\nथायरॉइड ग्रंथि शरीर के मेटाबॉलिज्म और अंडाशय के हार्मोन्स को नियंत्रित करती है। थायरॉइड असंतुलित होने पर पीरियड्स का समय और फ्लो दोनों प्रभावित होते हैं।\n\n🌿 **लक्षण:**\n• **हाइपोथायरॉइड (कम थायरॉइड):** भारी ब्लीडिंग, वजन बढ़ना, थकान और अत्यधिक ठंड लगना।\n• **हाइपरथायरॉइड (ज्यादा थायरॉइड):** बहुत कम ब्लीडिंग या कई महीनों तक पीरियड मिस होना।\n\n🚨 **जांच की सलाह:**\n• डॉक्टर की सलाह से खाली पेट **TSH, Free T3, और Free T4** ब्लड टेस्ट कराएं।",
        isSpecificMatch: true,
        source: "Endocrine Society Clinical Practice Guidelines"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nYour thyroid gland regulates metabolism and interacts with reproductive hormones. An underactive or overactive thyroid directly alters cycle timing and flow.\n\n🌿 **Key Symptoms:**\n• **Hypothyroid (Low thyroid):** Heavy prolonged bleeding, weight gain, fatigue, and cold sensitivity.\n• **Hyperthyroid (High thyroid):** Very light, scanty menses or missed periods.\n\n🚨 **Recommended Action:**\n• Request a fasting morning **TSH, Free T3, and Free T4** blood test from your doctor.",
      isSpecificMatch: true,
      source: "Endocrine Society Clinical Practice Guidelines"
    };
  }

  // 24. APP GUIDANCE & REPORTS (How to use Symvella)
  if (
    q.includes("report") || q.includes("doctor report") || q.includes("pdf") || q.includes("app") || 
    q.includes("check in") || q.includes("how to use") || q.includes("kese use kare") || q.includes("report download")
  ) {
    if (language === "hi") {
      return {
        text: "💡 **सीधा उत्तर (Symvella ऐप का उपयोग):**\nSymvella आपका निजी डिजिटल स्वास्थ्य साथी है जो आपके चक्र के अनुसार सुरक्षित क्लिनिकल मार्गदर्शन प्रदान करता है।\n\n🌿 **आसान उपयोग के कदम:**\n• **1-मिनट चेक-इन:** होम स्क्रीन पर 'Start 1-Min Check-in' पर टैप करके रोज़ 60 सेकंड में दर्द, फ्लो और ऊर्जा दर्ज करें।\n• **आज का घरेलू उपाय:** होमपेज पर अपनी वर्तमान साइकल के अनुसार आज का कस्टमाइज्ड नुस्खा देखें।\n• **डॉक्टर रिपोर्ट PDF:** 'Reports' टैब में जाएं और एक क्लिक में 'Weekly Report' या 'Monthly Report' PDF डाउनलोड करें।",
        isSpecificMatch: true,
        source: "Symvella Companion Guide"
      };
    }
    return {
      text: "💡 **Quick Answer:**\nSymvella is your private cycle tracker and clinical assistant. Here is how to get the most out of your features:\n\n🌿 **Easy Steps:**\n• **1-Min Daily Check-in:** Tap 'Start 1-Min Check-in' on Home to record pain, flow, and energy in 60 seconds.\n• **Today's Gharelu Upay:** View evidence-grounded herbal recipes tailored to your current cycle day.\n• **Download Doctor PDF:** Head to the 'Reports' tab and tap 'Download Weekly Report' or 'Download Monthly Report' to save an instant PDF for your doctor.",
      isSpecificMatch: true,
      source: "Symvella Companion Guide"
    };
  }

  // 25. GREETINGS & INTRODUCTIONS
  if (
    q === "hi" || q === "hello" || q === "hey" || q === "namaste" || q === "kaise ho" || 
    q === "who are you" || q === "kya karti ho" || q === "namaskar" ||
    q === "नमस्ते" || q === "प्रणाम" || q === "हेलो" || q === "हाय" || q === "कैसी हो" || q === "आप कौन हो" || q === "सखी"
  ) {
    if (language === "hi") {
      return {
        text: `🌸 नमस्ते ${userName || "सखी"}! मैं आपकी डिजिटल स्वास्थ्य साथी **Symvella** हूँ।\n\n💡 **मैं आपकी क्या मदद कर सकती हूँ:**\n• पीरियड्स के दर्द और ऐंठन से तुरंत राहत\n• देरी, पीसीओएस (PCOS) और हार्मोनल संतुलन\n• ओव्यूलेशन और गर्भधारण की सही जानकारी\n• सुरक्षित घरेलू उपाय और आहार\n\nआप मुझसे बेझिझक अपनी भाषा में पूछ सकती हैं। आज आपकी सेहत कैसी है?`,
        isSpecificMatch: true,
        source: "Symvella Companion Standard"
      };
    }
    if (language === "hinglish") {
      return {
        text: `🌸 Namaste ${userName || "Sakhi"}! Main aapki digital health companion **Symvella** hoon.\n\n💡 **How I Can Help You:**\n• Period cramps aur body pain se quick relief\n• Late period, cycle tracking aur PCOS guidance\n• Ovulation aur fertile window calculation\n• Authentic gharelu nuskhe aur diet tips\n\nAap bina kisi jhijhak ke kuch bhi pooch sakti hain! Today aap kaisa feel kar rahi hain?`,
        isSpecificMatch: true,
        source: "Symvella Companion Standard"
      };
    }
    if (language === "mr") {
      return {
        text: `🌸 नमस्कार ${userName || "सखी"}! मी आपली डिजिटल आरोग्य साथी **Symvella** आहे.\n\n💡 **मी तुम्हाला काय मदत करू शकते:**\n• मासिक पाळीतील पोटदुखीवर सोपे उपाय\n• पाळी उशीरा येणे, पीसीओडी (PCOD) चे मार्गदर्शन\n• ओव्हुलेशन व गर्भधारणेची माहिती\n• पोषक आहार व घरगुती उपाय\n\nआज तुमची तब्येत कशी आहे? मोकळेपणाने विचारा!`,
        isSpecificMatch: true,
        source: "Symvella Companion Standard"
      };
    }
    if (language === "ta") {
      return {
        text: `🌸 வணக்கம் ${userName || "தோழி"}! நான் உங்கள் டிஜிட்டல் நலத் தோழி **Symvella**.\n\n💡 **நான் உங்களுக்கு எவ்வாறு உதவ முடியும்:**\n• மாதவிடாய் வலிக்கு எளிய தீர்வுகள்\n• சுழற்சி தாமதம் மற்றும் PCOS வழிகாட்டுதல்\n• கருத்தரிப்பு மற்றும் அண்டவிடுப்பு கணக்கீடு\n• ஆரோக்கியமான உணவு முறைகள்\n\nஇன்று உங்கள் உடல்நிலை எப்படி இருக்கிறது? தயக்கமின்றி கேளுங்கள்!`,
        isSpecificMatch: true,
        source: "Symvella Companion Standard"
      };
    }
    return {
      text: `🌸 Hello ${userName || "friend"}! I am **Symvella**, your clinical health companion powered by Gnani Prisma V2.5.\n\n💡 **How I Can Help You:**\n• Period pain & cramp relief\n• Delayed cycles, irregular flow & PCOS guidance\n• Ovulation & fertility window tracking\n• Safe home remedies (Gharelu Upay) & nutrition\n\nFeel free to ask me anything about your cycle or symptoms today! How are you feeling?`,
      isSpecificMatch: true,
      source: "Symvella Companion Standard"
    };
  }

  // ============================================================================
  // 26. INTELLIGENT DYNAMIC CONTEXTUAL GENERATOR FOR ALL OTHER QUERIES
  // (Ensures the chatbot always gives crisp, 3-part scannable advice)
  // ============================================================================
  return generateDynamicClinicalGuidance(q, language, userProfile, cycleDay);
}

// Generates dynamic, informative, specific clinical guidance grounded in user context
function generateDynamicClinicalGuidance(query, language, userProfile, cycleDay) {
  const q = query.toLowerCase();
  const friendNameMap = { hi: "सखी", mr: "मैत्रीण", ta: "தோழி", hinglish: "Sakhi", en: "Friend" };
  const name = userProfile.name ? userProfile.name.split(" ")[0] : (friendNameMap[language] || "Friend");

  let focusEn = "Hormonal & cycle health";
  let focusHi = "हार्मोनल और चक्र स्वास्थ्य";

  if (q.includes("pain") || q.includes("hurt") || q.includes("dard") || q.includes("दर्द") || q.includes("ऐंठन") || q.includes("त्रास")) {
    focusEn = "Pelvic comfort & muscle relaxation";
    focusHi = "पेल्विक आराम और मांसपेशियों की ऐंठन";
  } else if (q.includes("blood") || q.includes("flow") || q.includes("bleed") || q.includes("खून") || q.includes("रक्त") || q.includes("स्राव")) {
    focusEn = "Vascular flow & healthy circulation";
    focusHi = "रक्त प्रवाह और संचलन संतुलन";
  } else if (q.includes("sleep") || q.includes("neend") || q.includes("insomnia") || q.includes("नींद") || q.includes("अनिद्रा")) {
    focusEn = "Sleep rhythm & nervous system calming";
    focusHi = "नींद और तंत्रिका तंत्र को शांति";
  } else if (q.includes("mood") || q.includes("stress") || q.includes("anxious") || q.includes("तनाव") || q.includes("चिड़चिड़ापन") || q.includes("गुस्सा")) {
    focusEn = "Stress reduction & mood balance";
    focusHi = "तनाव मुक्ति और मानसिक शांति";
  } else if (q.includes("food") || q.includes("eat") || q.includes("diet") || q.includes("खाना") || q.includes("आहार") || q.includes("पोषण")) {
    focusEn = "Nutritional replenishment & iron support";
    focusHi = "पोषण और हीमोग्लोबिन संवर्धन";
  }

  if (language === "hi") {
    return {
      text: `💡 **सीधा उत्तर (${focusHi} • दिन ${cycleDay}):**\nमाहवारी चक्र के दौरान एस्ट्रोजन और प्रोजेस्टेरोन के उतार-चढ़ाव से यह शारीरिक अनुभव प्रभावित होता है।\n\n🌿 **राहत के तुरंत कदम:**\n• **गुनगुना पानी:** दिन भर में पर्याप्त गुनगुना पानी पिएं (डिहाइड्रेशन कम करें)।\n• **अदरक या अजवाइन का काढ़ा:** हल्का गुनगुना पेय गर्भाशय और पाचन तंत्र को आराम देता है।\n• **विश्राम:** 7-8 घंटे की गहरी नींद लें और तनाव कम करने के लिए डीप ब्रीदिंग करें।\n\n🚨 **डॉक्टर से कब मिलें:**\n• यदि यह लक्षण 3 दिन से अधिक लगातार परेशान करे या दैनिक काम में रुकावट डाले।`,
      isSpecificMatch: false,
      source: "Symvella Clinical Reasoning Engine"
    };
  }

  if (language === "mr") {
    return {
      text: `💡 **थेट उत्तर (पाळी दिवस ${cycleDay}):**\nशरीरातील हॉर्मोन्सच्या नैसर्गिक बदलांमुळे हा शारीरिक बदल जाणवू शकतो.\n\n🌿 **घरगुती उपाय व काळजी:**\n• भरपूर कोमट पाणी प्या आणि हलका व्यायाम करा.\n• बडीशेप किंवा आल्याचा काढा स्नायूंना त्वरित आराम देतो.\n• ७-८ तास शांत झोप घ्या आणि हलका आहार ठेवा.\n\n🚨 **डॉक्टरांचा सल्ला कधी घ्यावा:**\n• त्रास ३ दिवसांपेक्षा जास्त काळ सतत वाढत राहिल्यास.`,
      isSpecificMatch: false,
      source: "Symvella Clinical Reasoning Engine"
    };
  }

  if (language === "ta") {
    return {
      text: `💡 **நேரடி விளக்கம் (சுழற்சி நாள் ${cycleDay}):**\nஹார்மோன் மாற்றங்களால் உடலில் இத்தகைய அறிகுறிகள் பொதுவாக ஏற்படுகின்றன.\n\n🌿 **எளிய பராமரிப்பு வழிகள்:**\n• போதுமான அளவு வெந்நீர் அருந்துங்கள்.\n• இஞ்சி அல்லது சீரகத் தண்ணீர் தசை வலியை குறைக்கும்.\n• போதுமான தூக்கம் மற்றும் ஓய்வு எடுங்கள்.\n\n🚨 **மருத்துவரை அணுக வேண்டிய நிலை:**\n• இந்த அறிகுறி 3 நாட்களுக்கு மேல் தொடர்ந்து தொந்தரவு செய்தால்.`,
      isSpecificMatch: false,
      source: "Symvella Clinical Reasoning Engine"
    };
  }

  if (language === "hinglish") {
    return {
      text: `💡 **Direct Answer (${focusEn} • Day ${cycleDay}):**\nMenstrual cycle mein hormones ke natural shifts ke dauran yeh symptoms directly interconnected hote hain.\n\n🌿 **Quick Action Steps:**\n• Minimum 2.5 litres warm water maintain karein body ko hydrated rakhne ke liye.\n• Adrak ya saunf ki herbal tea lein jo pelvic blood flow ko naturally support karti hai.\n• Restorative sleep lein aur Symvella ke daily check-in mein is symptom ko log karein.\n\n🚨 **When to Consult Doctor:**\n• Agar symptom 3 din se zyada लगातार bother kare ya daily routine interrupt kare.`,
      isSpecificMatch: false,
      source: "Symvella Clinical Reasoning Engine"
    };
  }

  return {
    text: `💡 **Quick Answer (${focusEn} • Day ${cycleDay}):**\nThis symptom is tied to natural hormonal fluctuations during your current cycle phase as your body balances estrogen and progesterone.\n\n🌿 **What You Can Do (Quick Relief):**\n• **Therapeutic hydration:** Drink warm water or electrolyte-balanced infusions (coconut water/fennel) to keep circulation smooth.\n• **Warm botanical tea:** Sip fresh ginger or chamomile tea to soothe muscle tightness.\n• **Restorative rest:** Prioritize 7–8 hours of restorative sleep to lower stress cortisol.\n\n🚨 **When to See a Doctor:**\n• If this symptom persists for more than 3 consecutive days or interferes with normal daily activities.`,
    isSpecificMatch: false,
    source: "Symvella Evidence-Based Companion Engine"
  };
}

export const getLocalSakhiResponse = getLocalSymvellaResponse;
