// Intelligent Gharelu Upay (Home Remedies) and Root-Cause Reason Generator
// Grounded in verified Ayurvedic care, ICMR women's nutrition, and gynecological science

export function generateDailyReport(logData, language = "en") {
  const menstrual = logData.menstrual || {};
  const pain = logData.pain || {};
  const sleep = logData.sleep || {};
  const mood = logData.mood || {};
  const body = logData.body || {};
  const custom = logData.customSymptoms || [];

  const reasons = [];
  const upayList = [];
  let isRedFlag = false;

  // 1. Menstrual & Flow Analysis
  if (menstrual.flow === "heavy") {
    reasons.push(
      language === "hi"
        ? "भारी रक्तस्राव (Heavy Flow) आमतौर पर एस्ट्रोजन और प्रोजेस्टेरोन के असंतुलन या गर्भाशय में प्रोस्टाग्लैंडीन की अधिकता के कारण होता है।"
        : "Heavy menstrual flow is commonly driven by relative estrogen dominance or elevated endometrial prostaglandins causing intense uterine shedding."
    );
    upayList.push({
      title: language === "hi" ? "मुनक्का और अनार का रस (Iron Booster)" : "Soaked Munakka (Raisins) & Pomegranate Juice",
      category: "Nutrition / रक्तवर्धक",
      desc: language === "hi"
        ? "रात भर 5-6 मुनक्का पानी में भिगोकर सुबह खाएं और अनार का ताजा रस पिएं। यह हीमोग्लोबिन गिरने से रोकता है।"
        : "Soak 5-6 black raisins (munakka) overnight and consume in the morning. Pair with fresh pomegranate juice to replenish iron and prevent anemia.",
      tag: "Ayurvedic Care"
    });
    if (menstrual.soakingPads) {
      isRedFlag = true;
    }
  }

  // 2. Pelvic / Cramp Pain Analysis
  if (pain.location === "pelvic" && pain.intensity >= 4) {
    reasons.push(
      language === "hi"
        ? "पेल्विक में ऐंठन और दर्द गर्भाशय की मांसपेशियों में संकुचन (Contractions) के कारण होता है, जिससे अस्थायी रूप से ऑक्सीजन का प्रवाह कम हो जाता है।"
        : "Pelvic cramping is triggered by prostaglandin release causing uterine muscle spasms and transient localized ischemia."
    );
    upayList.push({
      title: language === "hi" ? "अजवाइन और गुड़ का गर्म काढ़ा" : "Ajwain & Jaggery Warm Concoction",
      category: "Cramp Relief / गर्भाशय आराम",
      desc: language === "hi"
        ? "1 गिलास पानी में 1 छोटा चम्मच अजवाइन और थोड़ा सा गुड़ उबालें। इसे गुनगुना चाय की तरह पिएं। अजवाइन में मौजूद 'थाइमोल' मांसपेशियों की ऐंठन को शांत करता है।"
        : "Boil 1 tsp carom seeds (ajwain) with a small piece of organic jaggery (gud) in water. Sip warm. Thymol in ajwain acts as an antispasmodic for uterine muscles.",
      tag: "Top Home Remedy"
    });
    upayList.push({
      title: language === "hi" ? "तिल के तेल से सिकाई व हीटिंग पैड" : "Sesame Oil Massage & Warm Compresses",
      category: "External Care / बाह्य सिकाई",
      desc: language === "hi"
        ? "कमर और नाभि के नीचे गुनगुने तिल के तेल से हल्के हाथों से गोलाकार मालिश करें, फिर 15 मिनट गर्म पानी की थैली से सेकें।"
        : "Gently massage the lower pelvic and sacral area with warm sesame or mustard oil, followed by a hot water bag for 15-20 minutes to restore micro-circulation.",
      tag: "Immediate Relief"
    });
  }

  // 3. Lower Back Pain
  if (pain.location === "lower_back") {
    reasons.push(
      language === "hi"
        ? "कमर का दर्द पेल्विक नसों में सूजन और गर्भाशय से पीछे की ओर जाने वाले 'रेफर्ड पेन' (Referred Pain) के कारण होता है।"
        : "Lower back soreness is classic referred pain transmitting along the lumbosacral plexus due to pelvic congestion."
    );
    upayList.push({
      title: language === "hi" ? "मेथी दाना पानी व मार्जरी आसन" : "Methi (Fenugreek) Water & Cat-Cow Stretch",
      category: "Spine & Joint / कमर आराम",
      desc: language === "hi"
        ? "सुबह मेथी का पानी पिएं और बिस्तर पर 5 मिनट बिल्ली-गाय मुद्रा (Marjariasana) करें। यह रीढ़ की हड्डी के तनाव को दूर करता है।"
        : "Sip fenugreek seed water and perform 5 minutes of gentle Cat-Cow (Marjariasana) stretch on a soft mat to decompress the lumbar spine.",
      tag: "Gentle Movement"
    });
  }

  // 4. Bloating / Gut Issues
  if (body.bloating || body.constipation) {
    reasons.push(
      language === "hi"
        ? "माहवारी के दिनों में प्रोजेस्टेरोन हार्मोन पाचन तंत्र को धीमा कर देता है, जिससे पेट में गैस, भारीपन और कब्ज बनती है।"
        : "Progesterone relaxes smooth muscles throughout the gastrointestinal tract, leading to delayed gastric emptying, bloating, and water retention."
    );
    upayList.push({
      title: language === "hi" ? "नाभि पर हींग का लेप और सौंफ-जीरा पानी" : "Hing (Asafoetida) Navel Paste & Saunf Tea",
      category: "Digestion / पाचन",
      desc: language === "hi"
        ? "चुटकी भर हींग को गुनगुने पानी में घोलकर नाभि के चारों ओर लगाएं। साथ ही सौंफ और जीरे को उबालकर गुनगुना पिएं। गैस और पेट फूलना तुरंत कम होगा।"
        : "Mix a pinch of hing in a few drops of warm water and apply around the navel. Drink warm fennel (saunf) and cumin (jeera) water to dissipate trapped gas immediately.",
      tag: "Instant Digestive Relief"
    });
  }

  // 5. Fatigue & Low Sleep
  if (sleep.hours < 6.5 || sleep.fatigueLevel >= 6) {
    reasons.push(
      language === "hi"
        ? "नींद की कमी और थकान का कारण शरीर में कोर्टिसोल (तनाव हार्मोन) का बढ़ना और हीमोग्लोबिन का कम होना हो सकता है।"
        : "Low sleep duration coupled with hormonal fluctuations elevates systemic cortisol and strains cellular mitochondria."
    );
    upayList.push({
      title: language === "hi" ? "जायफल वाली हल्दी दूध (Golden Nutmeg Milk)" : "Nutmeg-Infused Golden Milk (Haldi Doodh)",
      category: "Restorative Sleep / गहरी नींद",
      desc: language === "hi"
        ? "रात को सोने से 30 मिनट पहले 1 कप गुनगुने दूध में 1/4 चम्मच हल्दी और एक चुटकी जायफल पाउडर मिलाकर पिएं। यह गहरी नींद लाता है।"
        : "Drink 1 cup of warm milk with 1/4 tsp organic turmeric and a tiny pinch of grated nutmeg (jaiphal) 30 minutes before bed to stimulate GABA and deep sleep.",
      tag: "Nighttime Elixir"
    });
  }

  // 6. Acne & Skin Breakouts
  if (body.acne) {
    reasons.push(
      language === "hi"
        ? "ल्यूटियल फेज में एंड्रोजेन हार्मोन का बढ़ना सीबम (तेल) का उत्पादन बढ़ा देता है, जिससे रोमछिद्र बंद होकर मुहांसे बनते हैं।"
        : "Luteal phase androgen dominance triggers hyperactive sebaceous glands, resulting in clogged pores and inflammatory cystic breakouts."
    );
    upayList.push({
      title: language === "hi" ? "नीम और तुलसी का पानी (Cooling Detox)" : "Neem-Tulsi Water & Mint Hydration",
      category: "Skin Detox / त्वचा सुरक्षा",
      desc: language === "hi"
        ? "चेहरे पर ठंडा गुलाब जल या नीम का पानी लगाएं। तले-भुने और अत्यधिक मीठे भोजन से परहेज करें।"
        : "Rinse face with diluted neem-tulsi water. Avoid processed sugar and dairy today to prevent androgenic insulin spikes.",
      tag: "Skin Healing"
    });
  }

  // 7. Custom Symptoms Handling
  if (custom.length > 0) {
    reasons.push(
      language === "hi"
        ? `आपके द्वारा दर्ज किए गए विशेष लक्षण: "${custom.join(', ')}"। यह आपके शरीर के व्यक्तिगत हार्मोनल सिग्नल हैं।`
        : `Your specific custom symptoms: "${custom.join(', ')}". These reflect individualized nervous and metabolic responses.`
    );
    if (custom.some(c => c.toLowerCase().includes("sweet") || c.toLowerCase().includes("craving"))) {
      upayList.push({
        title: language === "hi" ? "भुना मखाना और 70% डार्क चॉकलेट" : "Roasted Makhana & 70% Dark Chocolate",
        category: "Healthy Cravings / स्वस्थ विकल्प",
        desc: language === "hi"
          ? "चीनी की तलब होने पर 1 खजूर या भुने मखाने खाएं। 1 टुकड़ा डार्क चॉकलेट मैग्नीशियम की कमी को पूरा करता है।"
          : "When sugar cravings strike, eat roasted foxnuts (makhana) or 1 medjool date. A small square of 70% dark chocolate satisfies magnesium cravings.",
        tag: "Healthy Snack"
      });
    }
  }

  // Fallback remedy if symptoms are very mild / normal
  if (upayList.length === 0) {
    reasons.push(
      language === "hi"
        ? "आज आपके लक्षण काफी संतुलित हैं। आपका शरीर अपनी सामान्य लय में काम कर रहा है।"
        : "Your self-reported markers today are harmonious. Your autonomic system is maintaining balanced homeostasis."
    );
    upayList.push({
      title: language === "hi" ? "सौंफ-धनिया का ठंडा पानी" : "Coriander & Fennel Infused Water",
      category: "Daily Wellness / सामान्य स्वास्थ्य",
      desc: language === "hi"
        ? "1 चम्मच सौंफ और 1 चम्मच साबुत धनिया रात को 1 गिलास पानी में भिगोएं और सुबह छानकर पिएं। यह शरीर को शीतल रखता है।"
        : "Soak 1 tsp each of coriander seeds and fennel in water overnight; strain and drink in the morning for cellular hydration and cooling balance.",
      tag: "Daily Vitality"
    });
  }

  return {
    date: new Date().toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric"
    }),
    reasons,
    upayList,
    isRedFlag
  };
}
