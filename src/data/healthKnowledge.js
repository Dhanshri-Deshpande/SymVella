// Verified medical knowledge, books, government schemes, and guidelines for Symvella

export const EMERGENCY_RED_FLAGS = [
  {
    id: "severe_pelvic_pain",
    title: "Severe Acute Pelvic Pain",
    condition: "Pelvic pain score >= 8 or severe pain with fever/vomiting",
    description: "May indicate ectopic pregnancy, ovarian torsion, ruptured ovarian cyst, or acute pelvic inflammatory disease (PID).",
    urgency: "Immediate Clinical Evaluation Required",
    recommendation: "Visit nearest emergency department or contact your gynaecologist immediately."
  },
  {
    id: "heavy_bleeding",
    title: "Excessive Menstrual Bleeding (Menorrhagia)",
    condition: "Soaking two or more maxi pads per hour for two consecutive hours, or passing blood clots larger than a quarter",
    description: "Risk of acute hemorrhage or severe sudden-onset anemia.",
    urgency: "Urgent Care",
    recommendation: "Lie down, elevate legs, and seek immediate medical evaluation."
  },
  {
    id: "pregnancy_danger",
    title: "Pregnancy Danger Signs",
    condition: "Severe headache with vision blurring, sudden hand/face swelling, or reduced fetal movement",
    description: "Warning signs for pre-eclampsia or fetal distress.",
    urgency: "Critical Emergency",
    recommendation: "Reach your registered maternity hospital immediately."
  },
  {
    id: "mental_health_crisis",
    title: "Severe Mental Distress / Postpartum Crisis",
    condition: "Extreme overwhelming sadness, feelings of self-harm, or severe postpartum detachment",
    description: "Immediate mental health intervention needed.",
    urgency: "Immediate Support Available",
    recommendation: "Call Tele-MANAS 14416 or National Emergency 112 immediately."
  }
];

export const EMERGENCY_HELPLINES = [
  { name: "National Emergency Number", number: "112", description: "All-in-one emergency helpline (Police, Medical, Fire)" },
  { name: "Women Helpline (India)", number: "1091", description: "24/7 dedicated assistance for women in distress" },
  { name: "Tele-MANAS Mental Health", number: "14416", description: "Govt of India free 24/7 mental health counseling" },
  { name: "Women in Distress Helpline", number: "181", description: "Domestic violence, legal aid & emergency crisis rescue" },
  { name: "Maternal & Child Tracking", number: "1075", description: "National health portal and maternal health support" }
];

export const LIFE_STAGES = [
  { id: "adolescent", label: "Adolescent (Puberty & First Cycles)", desc: "Period awareness, cycle irregularity, hygiene, emotional changes" },
  { id: "regular", label: "Regular Menstrual Cycle", desc: "Ovulation tracking, PMS symptoms, hormonal balance, fertility awareness" },
  { id: "ttc", label: "Trying to Conceive", desc: "Fertile window predictions, basal temp patterns, preconception wellness" },
  { id: "pregnancy", label: "Pregnancy Care", desc: "Trimester milestones, fetal kicks, antenatal check-up reminders" },
  { id: "postpartum", label: "Postpartum & New Mother", desc: "Lochia tracking, postpartum depression screen, breastfeeding support" },
  { id: "perimenopause", label: "Perimenopause (Transition)", desc: "Hot flashes, sleep disturbances, cycle fluctuation, bone health" },
  { id: "menopause", label: "Menopause & Beyond", desc: "Hormonal changes, cardiovascular health, calcium and bone density" }
];

// Curated Books for Women's Healthcare, Pregnancy & Motherhood
export const RECOMMENDED_BOOKS = [
  {
    id: "book_passport_pregnancy",
    title: "Passport to a Healthy Pregnancy",
    author: "Dr. Gita Arjun, MD (Senior Obstetrician)",
    category: "Pregnancy & Antenatal Care",
    rating: "4.9 / 5",
    targetAudience: "Expectant mothers, partners & families",
    coverTag: "Essential Indian Pregnancy Guide",
    summary: "A culturally grounded, medically authoritative masterpiece specifically written for Indian women. Dispels myths about pregnancy diet (like eating saffron for complexion), explains trimester ultrasound tests, and guides labor preparation.",
    keyTakeaways: [
      "Exact dietary guide for vegetarian & non-vegetarian Indian mothers to avoid anemia and gestational diabetes.",
      "Demystifies safe physical exercise and prenatal yoga during each trimester.",
      "Detailed checklist of warning signs: sudden high BP, blurred vision, and water breakage.",
      "Practical advice on normal vs Cesarean delivery and emotional postpartum recovery."
    ],
    pages: "448 Pages",
    readLink: "Available in bookstores & libraries"
  },
  {
    id: "book_what_to_expect",
    title: "What to Expect When You're Expecting",
    author: "Heidi Murkoff",
    category: "Pregnancy & Fetal Development",
    rating: "4.8 / 5",
    targetAudience: "Conception to 40 weeks of pregnancy",
    coverTag: "Global Bestseller (#1 Guide)",
    summary: "The world's most widely read pregnancy companion. Provides reassuring, month-by-month and week-by-week growth milestones of the baby, coping with morning sickness, and navigating hospital birth plans.",
    keyTakeaways: [
      "Week-by-week fetal anatomical development illustrated with fruit and vegetable size comparisons.",
      "Clear guidance on managing first-trimester nausea, fatigue, and food aversions.",
      "Medical tests explained simply: Double marker, Quadruple marker, TIFFA anomaly scan.",
      "Partner support strategies and building a calm birthing environment."
    ],
    pages: "656 Pages",
    readLink: "Global Reference Standard"
  },
  {
    id: "book_period_repair",
    title: "Period Repair Manual: Natural Treatment for Better Periods",
    author: "Dr. Lara Briden, ND (Naturopathic Doctor)",
    category: "Menstrual Health & Hormones",
    rating: "4.9 / 5",
    targetAudience: "Women with painful, irregular periods or coming off birth control",
    coverTag: "Hormone & Period Health",
    summary: "A revolutionary, science-backed manual explaining why your menstrual cycle is your fifth vital sign. Provides natural protocols for heavy bleeding, severe cramps, missing periods, and post-pill recovery.",
    keyTakeaways: [
      "Why ovulatory cycles produce progesterone—the natural calming hormone for mood and sleep.",
      "Targeted natural supplements for dysmenorrhea: Magnesium glycinate, Zinc, and Vitamin B6.",
      "Diagnosing the 4 different types of PCOS: Insulin-resistant, Post-pill, Inflammatory, and Adrenal.",
      "Distinguishing normal period cramping from potential endometriosis."
    ],
    pages: "410 Pages",
    readLink: "Recommended by Gynaecologists"
  },
  {
    id: "book_pcos_plan",
    title: "The PCOS Plan: Prevent and Reverse Polycystic Ovary Syndrome",
    author: "Dr. Nadia Pateguana & Dr. Jason Fung, MD",
    category: "PCOS & Metabolic Health",
    rating: "4.7 / 5",
    targetAudience: "Women navigating PCOS, insulin resistance & fertility challenges",
    coverTag: "PCOS Reversal & Diet",
    summary: "Demystifies the hormonal root cause of PCOS—hyperinsulinemia (excess insulin). Shows how therapeutic nutrition, balanced meal timing, and low-glycemic foods help restore natural regular ovulation without relying solely on medications.",
    keyTakeaways: [
      "Insulin is the master hormone triggering the ovaries to overproduce male hormones (androgens).",
      "Why calorie restriction fails, but lowering insulin spikes restores ovulatory cycles.",
      "Delicious meal plans with low-glycemic Indian staples: millets, lentils, vegetables, and healthy fats.",
      "Proven lifestyle strategies for stubborn weight loss and clearing hormonal acne."
    ],
    pages: "288 Pages",
    readLink: "Metabolic Endocrinology Guide"
  },
  {
    id: "book_womancode",
    title: "WomanCode: Perfect Your Cycle & Amplify Your Energy",
    author: "Alisa Vitti, HHC",
    category: "Cycle Syncing & Biohacking",
    rating: "4.6 / 5",
    targetAudience: "Women seeking hormonal balance and energy alignment",
    coverTag: "Cycle Syncing Protocol",
    summary: "Introduces the concept of 'Cycle Syncing'—adapting your nutrition, work commitments, and workouts to the four distinct phases of your monthly hormonal cycle (Follicular, Ovulatory, Luteal, Menstrual).",
    keyTakeaways: [
      "The 4 phases of your monthly endocrine rhythm and how your brain chemistry changes.",
      "High-intensity workouts are best during the follicular phase, while restorative yoga suits the luteal phase.",
      "How supporting liver detoxification helps clear spent estrogen and reduces breast tenderness.",
      "Balancing blood sugar as the foundation for smooth, pain-free menstrual cycles."
    ],
    pages: "336 Pages",
    readLink: "Holistic Endocrinology"
  },
  {
    id: "book_pregnancy_indian_guide",
    title: "Pregnancy: The Complete Indian Guide",
    author: "Dr. Suman Sardesai, MBBS, DGO",
    category: "Indian Maternal Health",
    rating: "4.8 / 5",
    targetAudience: "New mothers, elders & caregivers in Indian households",
    coverTag: "Traditional Care & Modern Science",
    summary: "Harmonizes traditional Indian prenatal and postpartum customs (like maalish, panjiri, confinement) with modern clinical obstetrics, ensuring the safety of mother and baby while respecting cultural heritage.",
    keyTakeaways: [
      "Safe vs harmful traditional Indian beliefs during pregnancy and lactation.",
      "Nutritious postpartum foods: Panjiri, gond ke laddu, cumin water, and fenugreek for milk production.",
      "Careful newborn hygiene and breastfeeding latching techniques.",
      "Recognizing postpartum blues versus clinical Postpartum Depression (PPD)."
    ],
    pages: "320 Pages",
    readLink: "Indian Household Standard"
  }
];

// Government Healthcare Schemes for Women, Maternity & Family Welfare
export const GOVERNMENT_HEALTH_SCHEMES = [
  {
    id: "scheme_pmmvy",
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    ministry: "Ministry of Women & Child Development, Govt of India",
    category: "Maternal Cash Benefit",
    financialBenefit: "Direct Cash Benefit of up to ₹5,000 to ₹6,000",
    badge: "Direct Benefit Transfer (DBT)",
    eligibility: "Pregnant women and lactating mothers for the first live birth (and ₹6,000 for second child if girl child). Age ≥ 19 years.",
    summary: "A conditional cash transfer maternity benefit scheme providing wage compensation during advanced pregnancy and institutional delivery, ensuring proper nutrition for mother and infant.",
    installments: [
      "1st Installment (₹3,000): On early registration of pregnancy at Anganwadi/Health Centre within 150 days.",
      "2nd Installment (₹2,000): After institutional delivery and child receives first cycle of vaccinations (BCG, OPV, DPT)."
    ],
    documentsRequired: [
      "Mother and Father's Aadhaar Card",
      "Mother and Child Protection (MCP) Card",
      "Bank/Post Office Account linked with Aadhaar"
    ],
    howToApply: "Register at the nearest Anganwadi Centre (AWC) or Government Primary Health Centre (PHC), or apply online via the official PMMVY portal (pmmvy.wcd.gov.in)."
  },
  {
    id: "scheme_pmjay",
    name: "Ayushman Bharat - PM-JAY (Pradhan Mantri Jan Arogya Yojana)",
    ministry: "National Health Authority (NHA), Ministry of Health",
    category: "Health Insurance & Hospitalization",
    financialBenefit: "Up to ₹5,00,000 per family per year",
    badge: "Cashless Hospitalization",
    eligibility: "Deprived rural families and designated occupational categories of urban workers based on SECC 2011 database. All senior citizens aged 70+ now eligible regardless of income.",
    summary: "The world's largest government-funded healthcare assurance scheme. Provides secondary and tertiary care hospitalization in over 27,000 empanelled public and private hospitals across India.",
    installments: [
      "Covers 1,949 medical packages including high-risk maternity, Cesarean sections, hysterectomy, ovarian cyst surgeries, cancer treatment, and neonatal care.",
      "100% cashless and paperless at the point of care."
    ],
    documentsRequired: [
      "Aadhaar Card or Ration Card for beneficiary verification",
      "Ayushman Golden Card (generated instantly at any empanelled hospital or CSC)"
    ],
    howToApply: "Check eligibility on mera.pmjay.gov.in or visit any Ayushman Mitra desk at your district government hospital or Common Service Centre (CSC)."
  },
  {
    id: "scheme_jsy",
    name: "Janani Suraksha Yojana (JSY)",
    ministry: "National Health Mission (NHM), Govt of India",
    category: "Safe Institutional Delivery",
    financialBenefit: "₹1,400 (Rural) / ₹1,000 (Urban) Cash Assistance",
    badge: "Zero Maternal Mortality Mission",
    eligibility: "All pregnant women delivering in government health facilities or accredited private hospitals, with focus on low-performing states (LPS).",
    summary: "A safe motherhood intervention under the National Health Mission to reduce maternal and neonatal mortality by promoting institutional deliveries instead of high-risk home births.",
    installments: [
      "Cash incentive disbursed directly at the time of discharge after institutional delivery.",
      "ASHA workers receive incentive for escorting the mother to the health center."
    ],
    documentsRequired: [
      "MCP Card / ANC checkup record",
      "Aadhaar Card",
      "Bank Account details"
    ],
    howToApply: "Facilitated automatically by your local village ASHA or ANM worker when you register your pregnancy at the Sub-Centre or PHC."
  },
  {
    id: "scheme_jssk",
    name: "Janani Shishu Suraksha Karyakram (JSSK)",
    ministry: "Ministry of Health & Family Welfare",
    category: "Zero Out-of-Pocket Expenses",
    financialBenefit: "100% Completely Free Delivery & Newborn Care",
    badge: "Zero Out-of-Pocket Cost",
    eligibility: "All pregnant women delivering in public health institutions, and all sick infants up to 1 year of age.",
    summary: "Guarantees zero out-of-pocket expenditure for pregnant women. Entitles free and cashless delivery (including C-sections), free drugs, diagnostics, free blood, and free transport from home to facility and back.",
    installments: [
      "Free Normal Delivery & Free Cesarean Section.",
      "Free medicines, consumables, and essential lab tests (CBC, ultrasound, blood grouping).",
      "Free provision of blood and free diet during hospital stay.",
      "Free transport from home to hospital and drop-back home (call 102/108 ambulance)."
    ],
    documentsRequired: [
      "No complex documents required; admission in any government maternity hospital automatically entitles the mother to JSSK benefits."
    ],
    howToApply: "Walk into any government Community Health Centre (CHC), District Hospital, or Medical College Hospital."
  },
  {
    id: "scheme_pmsma",
    name: "Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)",
    ministry: "Ministry of Health & Family Welfare",
    category: "Free Specialist Antenatal Checkups",
    financialBenefit: "Free comprehensive specialist checkups on the 9th of every month",
    badge: "High-Risk Pregnancy Detection",
    eligibility: "All pregnant women in their 2nd and 3rd trimesters (from 4th month onwards).",
    summary: "Ensures comprehensive antenatal care by qualified OB-GYN specialists on the 9th of every month across all government health centres. Identifies and flags high-risk pregnancies (anemia, gestational hypertension, diabetes).",
    installments: [
      "Free blood tests, hemoglobin screening, urine examination, and ultrasound.",
      "Color-coded 'High Risk Pregnancy' stickers on MCP cards for priority emergency handling."
    ],
    documentsRequired: [
      "Mother-Child Protection (MCP) Card",
      "Aadhaar Card"
    ],
    howToApply: "Visit any government hospital, CHC, or designated PHC on the 9th of any month."
  },
  {
    id: "scheme_wifs",
    name: "Weekly Iron and Folic Acid Supplementation (WIFS)",
    ministry: "National Health Mission & Ministry of Education",
    category: "Adolescent Anemia Eradication",
    financialBenefit: "Free weekly IFA tablets & deworming tablets",
    badge: "Anemia Mukt Bharat",
    eligibility: "Adolescent girls (aged 10-19 years) enrolled in schools, Anganwadi centres, and non-school going adolescent girls.",
    summary: "Targeted program to break the intergenerational cycle of nutritional anemia. Distributes weekly supervised Iron and Folic Acid (blue tablet) and bi-annual Albendazole deworming tablets.",
    installments: [
      "1 IFA tablet weekly (100mg elemental iron + 500mcg folic acid).",
      "Bi-annual deworming (Albendazole 400mg) to ensure maximum iron absorption."
    ],
    documentsRequired: [
      "No documents required; distributed directly through schools and Anganwadi centres."
    ],
    howToApply: "Available every week at all government schools and village Anganwadi centres."
  }
];

export const INFO_HUB_ARTICLES = [
  {
    id: "pcos_explained",
    title: "Understanding PCOS / PCOD: Symptoms, Causes & What Really Helps",
    category: "Hormonal Health",
    readTime: "3 min read",
    reviewedBy: "Dr. Ananya Sharma, MD (OB-GYN) • Medically Reviewed Oct 2026",
    summary: "Polycystic Ovary Syndrome affects 1 in 5 Indian women. Learn how to identify early signs like irregular cycles, acne, and stubborn weight gain.",
    content: `
### What is PCOS?
Polycystic Ovary Syndrome (PCOS) is a hormonal disorder common among women of reproductive age. Women with PCOS may have infrequent or prolonged menstrual periods or excess male hormone (androgen) levels. The ovaries may develop numerous small collections of fluid (follicles) and fail to regularly release eggs.

### Key Symptoms to Track:
- **Irregular periods**: Infrequent, irregular or prolonged menstrual cycles are the most common sign.
- **Excess androgen**: Elevated levels of male hormones may result in facial hair (hirsutism), severe acne, and male-pattern baldness.
- **Polycystic ovaries**: Enlarged ovaries containing follicles that surround the eggs.
- **Metabolic signs**: Insulin resistance, abdominal weight gain, and persistent fatigue.

### What You Can Do:
1. **Low-Glycemic Diet**: Emphasize fiber-rich lentils, whole grains (millets, bajra, ragi), and plenty of leafy greens to manage insulin resistance.
2. **Resistance & Movement**: 30 minutes of brisk walking, yoga, or strength training improves insulin sensitivity.
3. **Clinical Check**: Consult a gynaecologist for an ultrasound scan and hormonal panel (FSH, LH, Fasting Insulin, AMH).
    `,
    tags: ["PCOS", "Hormones", "Irregular Periods"]
  },
  {
    id: "breast_cervical_screening",
    title: "Breast Self-Examination & Cervical Cancer Screening: A Life-Saving Guide",
    category: "Preventive Care & Screening",
    readTime: "4 min read",
    reviewedBy: "Dr. Sunita Kapoor, Surgical Oncologist • Medically Reviewed Oct 2026",
    summary: "Cervical cancer is almost 100% preventable with HPV vaccination and Pap tests. Learn the 5-minute monthly breast self-exam technique.",
    content: `
### 1. Monthly Breast Self-Examination (BSE):
Perform this 3 to 5 days AFTER your period ends, when breast tissue is least tender.
- **In Front of Mirror**: Inspect breasts with arms at sides, then raised high. Look for skin dimpling, nipple retraction, or spontaneous discharge.
- **Lying Down / In Shower**: Use the flat pads of your 3 middle fingers in circular motions from the collarbone to the armpit. Check for any hard, painless, non-mobile lump.

### 2. Cervical Cancer Screening & HPV Vaccine:
- **HPV Vaccination**: Highly effective when given between ages 9 and 26.
- **Pap Smear & HPV DNA Test**: Recommended for all sexually active women aged 25 to 65 every 3 to 5 years. Detects precancerous changes a decade before cancer develops.
- Free screenings are conducted at all government Primary Health Centres (PHCs).
    `,
    tags: ["Breast Health", "Cervical Cancer", "Pap Smear", "HPV Vaccine"]
  },
  {
    id: "pregnancy_trimesters",
    title: "Pregnancy Care Across the 3 Trimesters: Essential Nutrition & Tests",
    category: "Maternity & Prenatal Care",
    readTime: "4 min read",
    reviewedBy: "Dr. Gita Rao, Senior Consultant Obstetrician • Medically Reviewed Sep 2026",
    summary: "A week-by-week medical roadmap covering folic acid timing, mandatory scans, ultrasound milestones, and fetal kick monitoring.",
    content: `
### First Trimester (Weeks 1 to 12):
- **Crucial Nutrient**: 5mg Folic Acid daily to prevent neural tube defects.
- **Ultrasound**: Dating scan (Week 7-8) and NT (Nuchal Translucency) scan + Double Marker blood test (Week 11-13).

### Second Trimester (Weeks 13 to 27):
- **TIFFA Scan (Targeted Anomaly Scan)** at 18-20 weeks to evaluate fetal organ anatomy.
- Start Iron & Folic Acid (IFA) and Calcium supplements (take iron with lemon water; never with milk or tea).
- Screening for Gestational Diabetes with Glucose Tolerance Test (OGTT).

### Third Trimester (Weeks 28 to 40):
- Count fetal kick counts daily (at least 10 active movements in 2 hours after meals).
- Growth ultrasound with Doppler around 32-34 weeks.
- Prepare hospital birth bag with MCP card, Aadhaar, and clean baby clothing.
    `,
    tags: ["Pregnancy", "Trimesters", "Ultrasound", "Prenatal Diet"]
  },
  {
    id: "endometriosis_signs",
    title: "Endometriosis: Why 'Severe Period Pain' Is Never Just in Your Head",
    category: "Menstrual Health",
    readTime: "4 min read",
    reviewedBy: "Dr. Rekha Rao, DGO, Senior Consultant • Medically Reviewed Sep 2026",
    summary: "Painful periods that stop your daily life are not normal. Understand the difference between standard dysmenorrhea and endometriosis.",
    content: `
### Period Pain vs. Endometriosis
While mild cramping during menstruation is common, severe pain that leaves you incapacitated, causes nausea, or radiates into the lower back and thighs could be a sign of endometriosis.

### The Hallmark Triad:
1. **Dysmenorrhea (Painful periods)**: Pelvic pain and cramping may begin before and extend several days into a menstrual period.
2. **Pain with intercourse or bowel movements**: Especially around cycle days.
3. **Chronic pelvic pain & fatigue**: Ongoing dull ache in the pelvis even between periods.

### Why Early Logging Matters:
Because symptoms are often dismissed as 'normal cramps', global diagnosis takes an average of 7 to 9 years. By recording your pain severity score (0-10) and relation to cycle days inside Symvella, you provide doctors with clear, undeniable longitudinal proof.
    `,
    tags: ["Endometriosis", "Pain Management", "Doctor Discussion"]
  },
  {
    id: "menopause_bone_health",
    title: "Perimenopause, Menopause & Bone Health: Protecting Your Density",
    category: "Menopause & Longevity",
    readTime: "3 min read",
    reviewedBy: "Dr. Meera Nambiar, Geriatric & Women's Health • Medically Reviewed Oct 2026",
    summary: "After menopause, declining estrogen causes rapid bone calcium loss. Learn how to prevent osteoporosis and navigate hot flashes naturally.",
    content: `
### Understanding the Transition:
- **Perimenopause**: Begins 4-8 years before menopause. Cycle length becomes unpredictable, accompanied by night sweats, mood swings, and insomnia.
- **Menopause**: Clinically defined after 12 consecutive months without a period (average age 46-51 in Indian women).

### Bone Health & Osteoporosis Defense:
- Estrogen protects bone density. After menopause, women can lose up to 20% of bone mass in the first 5-7 years.
- **Dietary Calcium**: Sesame seeds (til), ragi (finger millet), curd/paneer, drumstick leaves.
- **Vitamin D3**: 15-20 minutes of morning sunlight exposure; check 25-OH Vitamin D serum level annually.
- **DEXA Scan**: Baseline bone mineral density scan recommended at age 50 or earlier if family history of fractures exists.
    `,
    tags: ["Menopause", "Perimenopause", "Bone Density", "Calcium", "Ragi"]
  },
  {
    id: "anemia_nutrition",
    title: "Iron Deficiency Anemia in Women: Recognizing the Hidden Fatigue",
    category: "Nutrition & Blood Health",
    readTime: "3 min read",
    reviewedBy: "Clinical Nutritionist S. Meenakshi, RD • Medically Reviewed Oct 2026",
    summary: "Over 50% of women in India experience iron deficiency. Learn how to spot the signs before your hemoglobin drops critically low.",
    content: `
### Symptoms of Low Iron:
- Unexplained exhaustion even after 8 hours of sleep
- Dizziness when standing quickly, or cold hands and feet
- Brittle nails, hair fall, and pale inner lower eyelids
- Shortness of breath when climbing one flight of stairs

### Food Pairing for Better Iron Absorption:
- **Eat**: Spinach, beetroot, moringa (drumstick leaves), black chana, jaggery, and sesame seeds.
- **Pair with Vitamin C**: Squeeze fresh lemon juice or eat an amla (Indian gooseberry) with your meals to multiply non-heme iron absorption by up to 300%.
- **Avoid with Meals**: Do not drink chai or coffee within 1 hour of an iron-rich meal, as tannins inhibit iron absorption.
    `,
    tags: ["Anemia", "Iron", "Fatigue", "Nutrition"]
  }
];

export const MYTH_FACTS = [
  {
    myth: "Severe, bed-ridden period pain is just a normal part of being a woman.",
    fact: "False. While mild cramping is normal, debilitating pain that disrupts daily activities may indicate endometriosis, adenomyosis, or fibroids, and deserves clinical investigation.",
    category: "Pain"
  },
  {
    myth: "Eating saffron (kesar) or coconut during pregnancy guarantees a fair-skinned baby.",
    fact: "False. Skin color is entirely determined by genetics and melanin. Kesar provides mild antioxidants, but does not alter genetic skin pigmentation.",
    category: "Pregnancy Myth"
  },
  {
    myth: "You cannot get pregnant if you have PCOS.",
    fact: "False. PCOS causes irregular ovulation, which makes conception harder to time, but most women with PCOS can conceive naturally or with simple lifestyle and medical guidance.",
    category: "Fertility"
  },
  {
    myth: "PMS (Premenstrual Syndrome) is purely emotional and imaginary.",
    fact: "False. PMS and PMDD (Premenstrual Dysphoric Disorder) are caused by dramatic shifts in estrogen and progesterone impacting serotonin levels in the brain. They are biological.",
    category: "Mental Health"
  },
  {
    myth: "Women must eat for two during pregnancy and double their food intake.",
    fact: "False. In the 1st trimester, extra calories are not required. In the 2nd and 3rd trimesters, mothers only need ~300 to 450 extra nutrient-dense calories per day (equivalent to 1 bowl of curd and a handful of nuts).",
    category: "Pregnancy Diet"
  }
];
