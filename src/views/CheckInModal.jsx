import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { LIFE_STAGES } from "../data/healthKnowledge";
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  AlertTriangle, 
  Smile, 
  Moon, 
  Droplets, 
  Sparkles, 
  Mic, 
  MicOff, 
  Plus, 
  Pill, 
  Heart,
  Thermometer,
  Zap,
  Activity,
  Baby,
  Flower2,
  Calendar,
  Sun,
  ShieldAlert,
  ChevronDown
} from "lucide-react";
import confetti from "canvas-confetti";

export default function CheckInModal() {
  const { 
    isCheckInOpen, 
    setIsCheckInOpen, 
    addSymptomLog, 
    setIsSOSOpen, 
    language,
    userProfile,
    setUserProfile 
  } = useApp();

  // Active biological stage (syncs with userProfile.lifeStage)
  const [activeStage, setActiveStage] = useState(userProfile.lifeStage || "regular");
  const [isStageDropdownOpen, setIsStageDropdownOpen] = useState(false);

  useEffect(() => {
    if (userProfile.lifeStage) {
      setActiveStage(userProfile.lifeStage);
    }
  }, [userProfile.lifeStage]);

  // Synchronize stage changes back to userProfile
  const handleStageChange = (newStageId) => {
    setActiveStage(newStageId);
    setIsStageDropdownOpen(false);
    setUserProfile(prev => ({ ...prev, lifeStage: newStageId }));
  };

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // -------------------------------------------------------------
  // CYCLING STATE (Regular, Adolescent, TTC)
  // -------------------------------------------------------------
  // User explicitly selects if they are on periods or having a normal day
  const [isOnPeriod, setIsOnPeriod] = useState(false);
  const [menstrualFlow, setMenstrualFlow] = useState("medium");
  const [hasClots, setHasClots] = useState(false);
  const [soakingPads, setSoakingPads] = useState(false);
  const [padChanges, setPadChanges] = useState("3-4");
  const [cervicalFluid, setCervicalFluid] = useState("creamy");
  const [vaginalComfort, setVaginalComfort] = useState("comfortable");

  // Pain / Bodily Discomfort
  const [painLocation, setPainLocation] = useState("none");
  const [painIntensity, setPainIntensity] = useState(2);
  const [painType, setPainType] = useState("dull");
  const [hasFeverWithPain, setHasFeverWithPain] = useState(false);
  const [heatRelief, setHeatRelief] = useState(true);

  // -------------------------------------------------------------
  // PREGNANCY SPECIFIC STATE
  // -------------------------------------------------------------
  const [trimester, setTrimester] = useState("2nd");
  const [nauseaLevel, setNauseaLevel] = useState("mild");
  const [fetalMovement, setFetalMovement] = useState("active");
  const [abdominalSensation, setAbdominalSensation] = useState("normal_stretch");
  const [hasPregnancySpotting, setHasPregnancySpotting] = useState(false);
  const [hasPreeclampsiaSigns, setHasPreeclampsiaSigns] = useState(false); // severe headache / vision blur
  const [hasFootEdema, setHasFootEdema] = useState(false);
  const [hasHeartburn, setHasHeartburn] = useState(false);
  const [prenatalVitaminsTaken, setPrenatalVitaminsTaken] = useState(["IFA", "Calcium"]);

  // -------------------------------------------------------------
  // POSTPARTUM SPECIFIC STATE
  // -------------------------------------------------------------
  const [lochiaStage, setLochiaStage] = useState("serosa");
  const [lactationStatus, setLactationStatus] = useState("normal_latch");
  const [perinealHealing, setPerinealHealing] = useState("healing_well");

  // -------------------------------------------------------------
  // MENOPAUSE / PERIMENOPAUSE SPECIFIC STATE
  // -------------------------------------------------------------
  const [hotFlashesCount, setHotFlashesCount] = useState("1-2");
  const [hasNightSweats, setHasNightSweats] = useState(false);
  const [jointStiffness, setJointStiffness] = useState("mild");

  // -------------------------------------------------------------
  // COMMON MIND, SLEEP & HORMONAL STATE
  // -------------------------------------------------------------
  const [moodLevel, setMoodLevel] = useState(3);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState("restful");
  const [fatigueLevel, setFatigueLevel] = useState(3);

  const [bodyMarkers, setBodyMarkers] = useState({
    acne: false,
    hairFall: false,
    facialHair: false,
    bloating: false,
    constipation: false,
    looseStools: false,
    hotFlashes: false,
    dizziness: false,
    breastTenderness: false
  });

  const [waterLiters, setWaterLiters] = useState(2.2);
  const [stressScore, setStressScore] = useState(4);
  const [medications, setMedications] = useState([]);

  // Custom Symptoms / Voice input
  const [customSymptomInput, setCustomSymptomInput] = useState("");
  const [customSymptomsList, setCustomSymptomsList] = useState([]);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const recognitionRef = useRef(null);

  if (!isCheckInOpen) return null;

  const toggleBodyMarker = (key) => {
    setBodyMarkers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleEmotion = (emo) => {
    setSelectedEmotions(prev => 
      prev.includes(emo) ? prev.filter(e => e !== emo) : [...prev, emo]
    );
  };

  const toggleMedication = (med) => {
    setMedications(prev => 
      prev.includes(med) ? prev.filter(m => m !== med) : [...prev, med]
    );
  };

  const togglePrenatalVitamin = (vit) => {
    setPrenatalVitaminsTaken(prev =>
      prev.includes(vit) ? prev.filter(v => v !== vit) : [...prev, vit]
    );
  };

  const handleAddCustomSymptom = (text = customSymptomInput) => {
    const trimmed = text.trim();
    if (!trimmed || customSymptomsList.includes(trimmed)) return;
    setCustomSymptomsList(prev => [...prev, trimmed]);
    setCustomSymptomInput("");
  };

  const handleRemoveCustomSymptom = (sym) => {
    setCustomSymptomsList(prev => prev.filter(s => s !== sym));
  };

  // Voice speech-to-text for custom symptoms
  const toggleSpeechForCustom = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListeningMic) {
      recognitionRef.current?.stop();
      setIsListeningMic(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      if (language === "hi") recognition.lang = "hi-IN";
      else if (language === "ta") recognition.lang = "ta-IN";
      else recognition.lang = "en-IN";

      recognition.onstart = () => setIsListeningMic(true);
      recognition.onend = () => setIsListeningMic(false);
      recognition.onerror = () => setIsListeningMic(false);
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        handleAddCustomSymptom(transcript);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsListeningMic(false);
    }
  };

  const handleFinish = () => {
    const logData = {
      lifeStage: activeStage,
      isOnPeriod: (activeStage === "pregnancy" || activeStage === "postpartum" || activeStage === "menopause") ? false : isOnPeriod,
      pregnancy: activeStage === "pregnancy" ? {
        trimester,
        nauseaLevel,
        fetalMovement,
        abdominalSensation,
        hasSpotting: hasPregnancySpotting,
        preeclampsiaSigns: hasPreeclampsiaSigns,
        edema: hasFootEdema,
        heartburn: hasHeartburn,
        prenatalVitamins: prenatalVitaminsTaken
      } : null,
      postpartum: activeStage === "postpartum" ? {
        lochiaStage,
        lactationStatus,
        perinealHealing
      } : null,
      menopause: (activeStage === "perimenopause" || activeStage === "menopause") ? {
        hotFlashesCount,
        nightSweats: hasNightSweats,
        jointStiffness
      } : null,
      menstrual: {
        flow: isOnPeriod ? menstrualFlow : "none",
        clotting: isOnPeriod ? hasClots : false,
        soakingPads: isOnPeriod ? soakingPads : false,
        padChanges: isOnPeriod ? padChanges : "0",
        cervicalFluid: !isOnPeriod ? cervicalFluid : "none",
        vaginalComfort: !isOnPeriod ? vaginalComfort : "normal"
      },
      pain: {
        location: painLocation,
        intensity: Number(painIntensity),
        type: painType,
        hasFeverWithPain,
        heatRelief
      },
      mood: {
        level: Number(moodLevel),
        emotions: selectedEmotions
      },
      sleep: {
        hours: Number(sleepHours),
        quality: sleepQuality,
        fatigueLevel: Number(fatigueLevel)
      },
      body: {
        ...bodyMarkers,
        edema: hasFootEdema,
        heartburn: hasHeartburn
      },
      lifestyle: {
        waterLiters: Number(waterLiters),
        stress: Number(stressScore),
        medications
      },
      customSymptoms: customSymptomsList
    };

    addSymptomLog(logData);
    setIsCheckInOpen(false);
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#965293', '#EE9FE1', '#748DE3', '#3B2E58']
    });
  };

  // Stage display metadata helper
  const stageMeta = LIFE_STAGES.find(s => s.id === activeStage) || {
    id: activeStage,
    label: "Regular Menstrual Cycle"
  };

  // Helper for dynamic step headers based on biological stage
  const getStepTitle = () => {
    if (activeStage === "pregnancy") {
      switch (step) {
        case 1: return "Gestational Status & Morning Sickness";
        case 2: return "Fetal Movement & Abdominal Sensations";
        case 3: return "Maternal Rest, Sleep & Emotional Calm";
        case 4: return "Obstetric Health, Edema & Reflux";
        case 5: return "Antenatal Nutrition & Supplements";
        case 6: return "Pregnancy Journal & Custom Notes";
        default: return "Pregnancy Health Check-in";
      }
    } else if (activeStage === "postpartum") {
      switch (step) {
        case 1: return "Lochia Discharge & Uterine Healing";
        case 2: return "Lactation, Nursing & Breast Comfort";
        case 3: return "Maternal Sleep Deficit & Mental Health";
        case 4: return "Pelvic Floor & Wound Recovery";
        case 5: return "Postpartum Hydration & Galactagogues";
        case 6: return "Motherhood Journal & Notes";
        default: return "Postpartum Care Check-in";
      }
    } else if (activeStage === "perimenopause" || activeStage === "menopause") {
      switch (step) {
        case 1: return "Vasomotor Flushes & Night Sweats";
        case 2: return "Joint Mobility & Musculoskeletal Comfort";
        case 3: return "Sleep Architecture & Emotional Balance";
        case 4: return "Pelvic, Vaginal & Urinary Comfort";
        case 5: return "Bone Nutrition & Cooling Hydration";
        case 6: return "Menopause Journal & Custom Signs";
        default: return "Menopause Transition Check-in";
      }
    } else {
      // Regular, Adolescent, TTC
      if (isOnPeriod) {
        switch (step) {
          case 1: return "Menstrual Flow & Bleeding Assessment";
          case 2: return "Dysmenorrhea & Pelvic Cramp Severity";
          case 3: return "Menstrual Mood, Sleep & Fatigue";
          case 4: return "Prostaglandin Signs, Gut & Bloating";
          case 5: return "Hydration, Warmth & Pain Medicine";
          case 6: return "Add Custom Symptoms & Notes";
          default: return "Menstrual Cycle Check-in";
        }
      } else {
        switch (step) {
          case 1: return "Daily Homeostasis & Cervical Fluid Health";
          case 2: return "Bodily Comfort & Physical Vitality";
          case 3: return "Mental Clarity, Mood & Restorative Sleep";
          case 4: return "Metabolic, Skin & Digestive Regularity";
          case 5: return "Nutrition, Daily Movement & Hydration";
          case 6: return "Personal Wellness Notes & Custom Feelings";
          default: return "Daily Vitality Check-in";
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-[var(--color-border)] animate-in fade-in zoom-in duration-200 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)]">
                Step {step} of {totalSteps}
              </span>
              
              {/* Dynamic Stage Badge & Dropdown Switcher */}
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setIsStageDropdownOpen(!isStageDropdownOpen)}
                  className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-pink-50 hover:bg-pink-100 text-[var(--color-primary)] border border-pink-200 transition-colors"
                  title="Click to switch biological life stage"
                >
                  {activeStage === "pregnancy" && <Baby className="w-3.5 h-3.5" />}
                  {activeStage === "postpartum" && <Flower2 className="w-3.5 h-3.5" />}
                  {(activeStage === "perimenopause" || activeStage === "menopause") && <Sparkles className="w-3.5 h-3.5" />}
                  {(activeStage === "regular" || activeStage === "adolescent" || activeStage === "ttc") && <Calendar className="w-3.5 h-3.5" />}
                  <span>Stage: {stageMeta.label.split(" (")[0]}</span>
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                </button>

                {isStageDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <p className="text-[10px] uppercase font-bold text-gray-400 px-2 py-1">Select Biological Stage:</p>
                    {LIFE_STAGES.map((ls) => (
                      <button
                        key={ls.id}
                        type="button"
                        onClick={() => handleStageChange(ls.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          activeStage === ls.id
                            ? "bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span>{ls.label.split(" (")[0]}</span>
                        {activeStage === ls.id && <Check className="w-3.5 h-3.5 text-[var(--color-primary)]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              {getStepTitle()}
            </h3>
          </div>
          
          <button
            onClick={() => setIsCheckInOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1.5 rounded-full my-3.5 overflow-hidden">
          <div
            className="bg-[var(--color-primary)] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* ============================================================== */}
        {/* STEP 1: ADAPTS DYNAMICALLY BASED ON BIOLOGICAL STAGE */}
        {/* ============================================================== */}
        {step === 1 && (
          <div className="space-y-4 py-1 text-xs">
            
            {/* CASE 1: PREGNANCY CARE */}
            {activeStage === "pregnancy" ? (
              <div className="space-y-4">
                <div className="p-3 bg-pink-50 rounded-2xl border border-pink-200">
                  <span className="font-semibold text-pink-900 block mb-1.5">Current Gestational Trimester:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "1st", label: "1st Trimester", sub: "Weeks 1–12" },
                      { id: "2nd", label: "2nd Trimester", sub: "Weeks 13–27" },
                      { id: "3rd", label: "3rd Trimester", sub: "Weeks 28–40+" }
                    ].map(tri => (
                      <button
                        key={tri.id}
                        type="button"
                        onClick={() => setTrimester(tri.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          trimester === tri.id
                            ? "border-[var(--color-primary)] bg-white text-[var(--color-primary-dark)] font-bold shadow-xs ring-1 ring-[var(--color-primary)]"
                            : "border-pink-200 bg-white/70 text-gray-700 hover:bg-white"
                        }`}
                      >
                        <div className="text-xs font-bold">{tri.label}</div>
                        <div className="text-[10px] text-gray-500 font-normal">{tri.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Morning Sickness / Nausea Severity Today:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "none", label: "None / Calm", icon: "😊", sub: "Comfortable" },
                      { id: "mild", label: "Mild Nausea", icon: "🍵", sub: "Occasional" },
                      { id: "moderate", label: "Moderate Queasiness", icon: "🥣", sub: "Food aversions" },
                      { id: "severe", label: "Severe / Vomiting", icon: "🚨", sub: "Hyperemesis risk" }
                    ].map(n => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => setNauseaLevel(n.id)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          nauseaLevel === n.id
                            ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold shadow-xs"
                            : "border-gray-200 bg-white text-gray-700 hover:border-pink-300"
                        }`}
                      >
                        <span className="text-2xl block mb-1">{n.icon}</span>
                        <span className="text-[11px] block font-semibold">{n.label}</span>
                        <span className="text-[9px] text-gray-500">{n.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : 

            /* CASE 2: POSTPARTUM CARE */
            activeStage === "postpartum" ? (
              <div className="space-y-4">
                <p className="font-semibold text-gray-700 uppercase tracking-wider">
                  Lochia Vaginal Discharge Stage (Postpartum Recovery):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "rubra", label: "Lochia Rubra", icon: "🩸", desc: "Bright red (Days 1–4)" },
                    { id: "serosa", label: "Lochia Serosa", icon: "🌸", desc: "Pinkish-brown (Days 4–10)" },
                    { id: "alba", label: "Lochia Alba", icon: "🤍", desc: "Yellow-white (Days 10+)" },
                    { id: "ceased", label: "Ceased / Clean", icon: "✨", desc: "Fully resolved" }
                  ].map(l => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLochiaStage(l.id)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        lochiaStage === l.id
                          ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold shadow-xs"
                          : "border-gray-200 bg-white text-gray-700 hover:border-pink-300"
                      }`}
                    >
                      <span className="text-xl block mb-1">{l.icon}</span>
                      <span className="text-[11px] font-bold block">{l.label}</span>
                      <span className="text-[9px] text-gray-500">{l.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) :

            /* CASE 3: PERIMENOPAUSE / MENOPAUSE */
            (activeStage === "perimenopause" || activeStage === "menopause") ? (
              <div className="space-y-4">
                <p className="font-semibold text-gray-700 uppercase tracking-wider">
                  Hot Flashes Frequency Today (Vasomotor Flushes):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "none", label: "No Hot Flashes", icon: "❄️" },
                    { id: "1-2", label: "1 to 2 Episodes", icon: "🌤️" },
                    { id: "3-5", label: "3 to 5 Episodes", icon: "🌡️" },
                    { id: "6+", label: "6+ Intense Flushes", icon: "🔥" }
                  ].map(hf => (
                    <button
                      key={hf.id}
                      type="button"
                      onClick={() => setHotFlashesCount(hf.id)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        hotFlashesCount === hf.id
                          ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold shadow-xs"
                          : "border-gray-200 bg-white text-gray-700 hover:border-pink-300"
                      }`}
                    >
                      <span className="text-xl block mb-1">{hf.icon}</span>
                      <span className="text-[11px] font-bold">{hf.label}</span>
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-800 font-medium">
                  <input
                    type="checkbox"
                    checked={hasNightSweats}
                    onChange={(e) => setHasNightSweats(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--color-primary)]"
                  />
                  <span>Did you wake up drenched in nocturnal night sweats?</span>
                </label>
              </div>
            ) :

            /* CASE 4: CYCLING STAGES (Regular, Adolescent, TTC) -> PROMPT: ON PERIOD vs NORMAL SITUATION */
            (
              <div className="space-y-4">
                {/* User selection: On period vs Normal day */}
                <div className="p-3.5 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-200 space-y-2">
                  <span className="text-xs font-bold text-gray-900 block">
                    Are you currently having your period today?
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOnPeriod(true);
                        if (menstrualFlow === "none") setMenstrualFlow("medium");
                      }}
                      className={`p-3 rounded-xl border text-center flex items-center justify-center gap-2 font-bold transition-all ${
                        isOnPeriod
                          ? "border-rose-500 bg-rose-500 text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-rose-300"
                      }`}
                    >
                      <span>🔴</span>
                      <span className="text-xs">Yes, On Period</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsOnPeriod(false);
                        setMenstrualFlow("none");
                        setPainIntensity(0);
                      }}
                      className={`p-3 rounded-xl border text-center flex items-center justify-center gap-2 font-bold transition-all ${
                        !isOnPeriod
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
                      }`}
                    >
                      <span>✨</span>
                      <span className="text-xs">No, Normal Day</span>
                    </button>
                  </div>
                </div>

                {/* Sub-branch A: IF ON PERIOD -> ASK FLOW & BLEEDING */}
                {isOnPeriod ? (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <p className="font-semibold text-gray-700 uppercase tracking-wider">
                      Menstrual Bleeding Flow Level:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "spotting", label: "Spotting", icon: "💧" },
                        { id: "light", label: "Light", icon: "🩸" },
                        { id: "medium", label: "Medium", icon: "🩸🩸" },
                        { id: "heavy", label: "Heavy Flow", icon: "🩸🩸🩸" }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setMenstrualFlow(opt.id)}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            menstrualFlow === opt.id
                              ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold shadow-xs"
                              : "border-gray-200 hover:border-pink-300 bg-white text-gray-700"
                          }`}
                        >
                          <span className="text-xl block mb-1">{opt.icon}</span>
                          <span className="text-[11px]">{opt.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2.5">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-800">
                        <input
                          type="checkbox"
                          checked={hasClots}
                          onChange={(e) => setHasClots(e.target.checked)}
                          className="w-4 h-4 rounded text-[var(--color-primary)]"
                        />
                        <span>Did you notice significant blood clots today?</span>
                      </label>

                      {menstrualFlow === "heavy" && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5">
                          <label className="flex items-center gap-2 cursor-pointer text-xs text-rose-950 font-medium">
                            <input
                              type="checkbox"
                              checked={soakingPads}
                              onChange={(e) => setSoakingPads(e.target.checked)}
                              className="w-4 h-4 rounded text-rose-600"
                            />
                            <span>Soaking 2+ maxi pads/tampons per hour consecutively?</span>
                          </label>
                          {soakingPads && (
                            <p className="text-[11px] text-rose-700">
                              ⚠️ <strong>Urgent Warning:</strong> Risk of acute menorrhagia.{" "}
                              <button onClick={() => setIsSOSOpen(true)} className="underline font-bold">
                                Open SOS Modal
                              </button>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Sub-branch B: IF NORMAL SITUATION (NOT ON PERIOD) -> ASK CERVICAL FLUID & VITALITY */
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <p className="font-semibold text-gray-700 uppercase tracking-wider">
                      Cervical Fluid / Daily Discharge Consistency:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "dry", label: "Dry / None", icon: "☀️", desc: "Follicular baseline" },
                        { id: "sticky", label: "Sticky / Thick", icon: "🍯", desc: "Low fertility transition" },
                        { id: "creamy", label: "Creamy Lotion", icon: "🥛", desc: "Rising estrogen" },
                        { id: "eggwhite", label: "Egg-white (Fertile)", icon: "🥚", desc: "Peak fertile window" }
                      ].map(cf => (
                        <button
                          key={cf.id}
                          type="button"
                          onClick={() => setCervicalFluid(cf.id)}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            cervicalFluid === cf.id
                              ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold shadow-xs"
                              : "border-gray-200 bg-white text-gray-700 hover:border-pink-300"
                          }`}
                        >
                          <span className="block text-xl mb-1">{cf.icon}</span>
                          <span className="text-[11px] font-bold block">{cf.label}</span>
                          <span className="text-[9px] text-gray-500">{cf.desc}</span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-1">
                      <p className="font-semibold text-gray-700 mb-1.5">Vaginal Comfort & Hygiene:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "comfortable", label: "Comfortable / Normal", icon: "🌿" },
                          { id: "dryness", label: "Mild Dryness", icon: "🌵" },
                          { id: "irritation", label: "Itching / Irritation", icon: "⚠️" }
                        ].map(vc => (
                          <button
                            key={vc.id}
                            type="button"
                            onClick={() => setVaginalComfort(vc.id)}
                            className={`p-2 rounded-xl border text-center text-xs transition-all ${
                              vaginalComfort === vc.id
                                ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] font-bold text-[var(--color-primary-dark)]"
                                : "border-gray-200 bg-white text-gray-600"
                            }`}
                          >
                            <span>{vc.icon} {vc.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: PAIN / FETAL KICKS / LACTATION / MOBILITY */}
        {/* ============================================================== */}
        {step === 2 && (
          <div className="space-y-4 py-1 text-xs">
            {/* CASE 1: PREGNANCY CARE -> FETAL MOVEMENTS & ABDOMINAL SENSATIONS */}
            {activeStage === "pregnancy" ? (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Fetal Movement & Kick Count Today (Baby Activity):
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "active", label: "Active Kicks & Rolls", icon: "👶⚡", desc: ">10 movements recorded" },
                      { id: "flutters", label: "Gentle Flutters", icon: "🦋", desc: "Light subtle movements" },
                      { id: "quiet", label: "Quiet / Reduced Movement", icon: "⚠️", desc: "Noticeably fewer kicks" },
                      { id: "early", label: "Too Early (<18 Weeks)", icon: "🐣", desc: "First trimester" }
                    ].map(fm => (
                      <button
                        key={fm.id}
                        type="button"
                        onClick={() => setFetalMovement(fm.id)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          fetalMovement === fm.id
                            ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold shadow-xs"
                            : "border-gray-200 bg-white hover:border-pink-300 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{fm.icon}</span>
                          <span className="text-xs font-bold">{fm.label}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-normal">{fm.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Abdominal Sensations */}
                <div>
                  <p className="font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Abdominal & Pelvic Sensations:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "normal_stretch", label: "Mild Ligament Stretch", icon: "🌸" },
                      { id: "braxton_hicks", label: "Braxton Hicks (Tightening)", icon: "🥣" },
                      { id: "pelvic_heaviness", label: "Pelvic Heaviness", icon: "⚡" }
                    ].map(as => (
                      <button
                        key={as.id}
                        type="button"
                        onClick={() => setAbdominalSensation(as.id)}
                        className={`p-2 rounded-xl border text-center text-xs transition-all ${
                          abdominalSensation === as.id
                            ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] font-bold text-[var(--color-primary-dark)]"
                            : "border-gray-200 bg-white text-gray-700"
                        }`}
                      >
                        <span className="block text-base mb-0.5">{as.icon}</span>
                        <span className="text-[11px] font-medium">{as.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spotting Alert */}
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-amber-950 font-medium">
                    <input
                      type="checkbox"
                      checked={hasPregnancySpotting}
                      onChange={(e) => setHasPregnancySpotting(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600"
                    />
                    <span>Any vaginal bleeding, spotting, or amniotic fluid leaking today?</span>
                  </label>
                  {hasPregnancySpotting && (
                    <p className="text-[11px] text-rose-700 font-bold mt-1.5">
                      ⚠️ Please alert your obstetrician immediately for safe clinical evaluation.
                    </p>
                  )}
                </div>
              </div>
            ) : 

            /* CASE 2: POSTPARTUM CARE -> LACTATION & BREAST COMFORT */
            activeStage === "postpartum" ? (
              <div className="space-y-4">
                <p className="font-semibold text-gray-700 uppercase tracking-wider">
                  Lactation & Breast Nursing Comfort:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "normal_latch", label: "Comfortable Let-down / Good Latch", icon: "🍼", desc: "Normal milk flow" },
                    { id: "engorgement", label: "Breast Engorgement / Fullness", icon: "🌸", desc: "Firm or heavy breasts" },
                    { id: "sore_nipples", label: "Sore or Cracked Nipples", icon: "🩹", desc: "Latching discomfort" },
                    { id: "formula", label: "Formula / Mixed Feeding", icon: "🥣", desc: "Supplementary feeding" }
                  ].map(lact => (
                    <button
                      key={lact.id}
                      type="button"
                      onClick={() => setLactationStatus(lact.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        lactationStatus === lact.id
                          ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold shadow-xs"
                          : "border-gray-200 bg-white text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{lact.icon}</span>
                        <span className="text-xs font-bold">{lact.label}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-normal">{lact.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) :

            /* CASE 3 & 4: GENERAL PAIN EVALUATION (PERIOD CRAMPS OR DAILY NORMAL TENSION) */
            (
              <div className="space-y-4">
                <p className="font-semibold text-gray-700 uppercase tracking-wider">
                  {isOnPeriod ? "Where are your menstrual cramps located?" : "Any physical tension or discomfort today?"}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "none", label: "No Pain / Great", emoji: "🌿" },
                    { id: "pelvic", label: isOnPeriod ? "Pelvic / Uterus" : "Lower Pelvis", emoji: "⚡" },
                    { id: "lower_back", label: "Lower Back / Hips", emoji: "🦴" },
                    { id: "head", label: "Headache / Tension", emoji: "💆‍♀️" },
                    { id: "breasts", label: "Breast Tenderness", emoji: "🌸" },
                    { id: "joints", label: "Joints / Legs", emoji: "🦵" },
                    { id: "stomach", label: "Stomach / Digestion", emoji: "🥣" }
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPainLocation(p.id);
                        if (p.id === "none") setPainIntensity(0);
                        else if (painIntensity === 0) setPainIntensity(3);
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        painLocation === p.id
                          ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold shadow-xs"
                          : "border-gray-200 hover:border-pink-300 bg-white text-gray-700"
                      }`}
                    >
                      <span className="text-lg block mb-0.5">{p.emoji}</span>
                      <span className="text-[11px]">{p.label}</span>
                    </button>
                  ))}
                </div>

                {painLocation !== "none" && (
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3.5">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-semibold text-gray-800">Discomfort Intensity (VAS):</span>
                        <span className="font-bold text-[var(--color-primary)] px-2 py-0.5 rounded-md bg-white border border-gray-200 font-mono">
                          {painIntensity} / 10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={painIntensity}
                        onChange={(e) => setPainIntensity(e.target.value)}
                        className="w-full accent-[var(--color-primary)] cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Mild (0-3)</span>
                        <span>Moderate (4-6)</span>
                        <span>Severe (7-10)</span>
                      </div>
                    </div>

                    {/* Sensation Type */}
                    <div>
                      <span className="font-semibold text-gray-800 block mb-1.5">Sensation Quality:</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { id: "dull", label: "Dull Ache" },
                          { id: "spasmodic", label: "Spasmodic" },
                          { id: "sharp", label: "Sharp" },
                          { id: "throbbing", label: "Throbbing" }
                        ].map(t => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setPainType(t.id)}
                            className={`p-2 rounded-lg border text-[11px] text-center font-medium ${
                              painType === t.id
                                ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold"
                                : "border-gray-200 bg-white text-gray-600"
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {isOnPeriod && (
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 font-medium">
                        <input
                          type="checkbox"
                          checked={heatRelief}
                          onChange={(e) => setHeatRelief(e.target.checked)}
                          className="w-4 h-4 rounded text-[var(--color-primary)]"
                        />
                        <span>Does warm heating pad or hot water bottle relieve your cramps?</span>
                      </label>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 3: MOOD, SLEEP & EMOTIONAL WELL-BEING */}
        {/* ============================================================== */}
        {step === 3 && (
          <div className="space-y-4 py-1 text-xs">
            <div>
              <p className="font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Overall Emotional Energy Today:
              </p>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { level: 1, label: "Low", icon: "😞" },
                  { level: 2, label: "Sensitive", icon: "🥺" },
                  { level: 3, label: "Calm", icon: "😌" },
                  { level: 4, label: "Good", icon: "😊" },
                  { level: 5, label: "Energetic", icon: "🌟" }
                ].map(m => (
                  <button
                    key={m.level}
                    type="button"
                    onClick={() => setMoodLevel(m.level)}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      moodLevel === m.level
                        ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold shadow-xs scale-105"
                        : "border-gray-200 bg-white hover:border-pink-300"
                    }`}
                  >
                    <span className="text-xl block mb-0.5">{m.icon}</span>
                    <span className="text-[11px] font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Emotional Sensations Pills */}
            <div>
              <p className="font-semibold text-gray-700 uppercase tracking-wider mb-2">
                {activeStage === "pregnancy" ? "Maternal Mind & Feelings:" : "Mental & Cognitive Sensations:"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(activeStage === "pregnancy" ? [
                  "Joyful & Bonded",
                  "Antenatal Anxiety",
                  "Restless Mind",
                  "Nesting Instinct",
                  "Fatigued / Sleepy",
                  "Calm & Grounded"
                ] : [
                  "Sharp & Productive",
                  "Anxiety / Worry",
                  "Irritability",
                  "Brain Fog",
                  "Low Motivation",
                  "Content & Peaceful"
                ]).map(emo => (
                  <button
                    key={emo}
                    type="button"
                    onClick={() => toggleEmotion(emo)}
                    className={`px-3 py-1.5 rounded-full border text-[11px] transition-colors ${
                      selectedEmotions.includes(emo)
                        ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold"
                        : "border-gray-200 bg-white text-gray-600 hover:border-pink-200"
                    }`}
                  >
                    {emo} {selectedEmotions.includes(emo) ? "✓" : "+"}
                  </button>
                ))}
              </div>
            </div>

            {/* Sleep Box */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-purple-600" /> Nighttime Rest / Sleep Duration:
                </span>
                <span className="font-bold text-gray-900 font-mono">{sleepHours} Hours</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className="w-full accent-purple-600 cursor-pointer"
              />

              <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-200">
                <span className="font-semibold text-gray-800">Fatigue & Exhaustion Rating:</span>
                <span className="font-bold text-[var(--color-primary)] font-mono">{fatigueLevel} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={fatigueLevel}
                onChange={(e) => setFatigueLevel(e.target.value)}
                className="w-full accent-[var(--color-primary)] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 4: PHYSICAL SIGNS, GUT & HORMONAL MARKERS */}
        {/* ============================================================== */}
        {step === 4 && (
          <div className="space-y-4 py-1 text-xs">
            <p className="font-semibold text-gray-700 uppercase tracking-wider">
              {activeStage === "pregnancy" ? "Obstetric & Physical Markers Today:" : "Physical & Digestive Markers (Tap any you experienced):"}
            </p>

            {/* If Pregnancy: show pregnancy specific markers */}
            {activeStage === "pregnancy" ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "edema", state: hasFootEdema, set: setHasFootEdema, label: "Swollen Feet / Ankles (Edema)", icon: "🦶" },
                    { key: "heartburn", state: hasHeartburn, set: setHasHeartburn, label: "Acid Reflux / Heartburn", icon: "🔥" },
                    { key: "bloating", state: bodyMarkers.bloating, toggle: () => toggleBodyMarker("bloating"), label: "Abdominal Bloating", icon: "🎈" },
                    { key: "constipation", state: bodyMarkers.constipation, toggle: () => toggleBodyMarker("constipation"), label: "Sluggish Bowel / Constipation", icon: "🐢" }
                  ].map(m => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => (m.set ? m.set(!m.state) : m.toggle())}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        m.state
                          ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold shadow-xs"
                          : "border-gray-200 bg-white hover:border-pink-300 text-gray-700"
                      }`}
                    >
                      <span className="text-[11px] flex items-center gap-1.5">
                        <span>{m.icon}</span> {m.label}
                      </span>
                      {m.state && <Check className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />}
                    </button>
                  ))}
                </div>

                {/* Pre-eclampsia alert screen */}
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-rose-950 font-medium">
                    <input
                      type="checkbox"
                      checked={hasPreeclampsiaSigns}
                      onChange={(e) => setHasPreeclampsiaSigns(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600"
                    />
                    <span>Severe persistent headache with blurred vision or spots?</span>
                  </label>
                  {hasPreeclampsiaSigns && (
                    <p className="text-[11px] text-rose-700 font-bold mt-1.5">
                      ⚠️ Pre-eclampsia screening alert: Have your blood pressure checked by a doctor today.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Non-pregnancy: PCOS, Gut & Hormonal Markers */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { key: "acne", label: "Cystic Acne / Breakouts", icon: "🔴" },
                  { key: "hairFall", label: "Hair Shedding / Thinning", icon: "💇‍♀️" },
                  { key: "facialHair", label: "Facial Hair / Hirsutism", icon: "✨" },
                  { key: "bloating", label: "Abdominal Bloating", icon: "🎈" },
                  { key: "constipation", label: "Constipation / Sluggish Gut", icon: "🐢" },
                  { key: "looseStools", label: "Loose Stools / Diarrhea", icon: "💧" },
                  { key: "hotFlashes", label: "Hot Flashes or Chills", icon: "🌡️" },
                  { key: "dizziness", label: "Dizziness Upon Standing", icon: "💫" },
                  { key: "breastTenderness", label: "Breast Heaviness / Pain", icon: "🌸" }
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleBodyMarker(item.key)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      bodyMarkers[item.key]
                        ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold shadow-xs"
                        : "border-gray-200 bg-white hover:border-pink-300 text-gray-700"
                    }`}
                  >
                    <span className="text-[11px] flex items-center gap-1.5">
                      <span>{item.icon}</span> {item.label}
                    </span>
                    {bodyMarkers[item.key] && (
                      <Check className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}

            <p className="text-[11px] text-gray-400 italic">
              *Physical and digestive signs feed directly into your Explainable AI longitudinal evaluation.
            </p>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 5: HYDRATION, LIFESTYLE & SUPPLEMENTS */}
        {/* ============================================================== */}
        {step === 5 && (
          <div className="space-y-4 py-1 text-xs">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-blue-500" /> Daily Water Intake:
                  </span>
                  <span className="font-bold text-blue-700 font-mono">{waterLiters} Liters</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.25"
                  value={waterLiters}
                  onChange={(e) => setWaterLiters(e.target.value)}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-gray-800">Stress & Mental Workload:</span>
                  <span className="font-bold text-amber-700 font-mono">{stressScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={stressScore}
                  onChange={(e) => setStressScore(e.target.value)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Supplements / Medications */}
            <div>
              <p className="font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-purple-600" />
                {activeStage === "pregnancy" ? "Prenatal Supplements Taken Today:" : "Medications / Supplements Taken Today:"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(activeStage === "pregnancy" ? [
                  "Iron & Folic Acid (IFA)",
                  "Calcium + Vitamin D3",
                  "Prenatal DHA / Multivitamin",
                  "Thyroid Supplement",
                  "None"
                ] : [
                  "Iron / Folic Acid",
                  "Pain Reliever (Meftal/NSAID)",
                  "Multivitamins / B-Complex",
                  "Hormonal Contraceptive",
                  "Thyroid Tablet",
                  "Probiotics",
                  "None"
                ]).map(med => {
                  const isChecked = activeStage === "pregnancy" 
                    ? prenatalVitaminsTaken.includes(med) 
                    : medications.includes(med);
                  return (
                    <button
                      key={med}
                      type="button"
                      onClick={() => (activeStage === "pregnancy" ? togglePrenatalVitamin(med) : toggleMedication(med))}
                      className={`px-3 py-1.5 rounded-full border text-[11px] transition-colors ${
                        isChecked
                          ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold"
                          : "border-gray-200 bg-white text-gray-600 hover:border-pink-200"
                      }`}
                    >
                      {med} {isChecked ? "✓" : "+"}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 6: CUSTOM SYMPTOMS & VOICE INPUT */}
        {/* ============================================================== */}
        {step === 6 && (
          <div className="space-y-4 py-1 text-xs">
            <div className="p-3.5 bg-[var(--color-badge-bg)] rounded-2xl border border-[var(--color-border)]">
              <h4 className="font-bold text-[var(--color-primary-dark)] text-sm mb-1">
                {activeStage === "pregnancy" ? "Pregnancy Journal & Personal Sensations ✍️" : "Add From Your Side: Your Own Feelings & Symptoms ✍️"}
              </h4>
              <p className="text-gray-600 text-xs">
                {activeStage === "pregnancy"
                  ? "Every pregnancy journey is unique. Record baby movements, cravings, bodily changes or feelings you noticed today."
                  : "Type or speak any bodily change, specific food craving, localized twinge, or sensation you noticed today."}
              </p>
            </div>

            {/* Input & Voice Bar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSpeechForCustom}
                className={`p-3 rounded-2xl transition-all ${
                  isListeningMic
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-pink-50 hover:bg-pink-100 text-[var(--color-primary)]"
                }`}
                title="Speak your symptom in your language"
              >
                {isListeningMic ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={customSymptomInput}
                onChange={(e) => setCustomSymptomInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustomSymptom()}
                placeholder={activeStage === "pregnancy" ? "e.g. Strong baby kicks on right side, craving sour lemon..." : "e.g. Left pelvic twinge, craving roasted makhana..."}
                className="flex-1 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-2xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => handleAddCustomSymptom()}
                className="p-3 rounded-2xl bg-[var(--color-primary)] text-white hover:opacity-95 shadow-sm"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Popular Additions */}
            <div>
              <p className="font-semibold text-gray-600 mb-2">Tap to Quick-Add Common Sensations:</p>
              <div className="flex flex-wrap gap-1.5">
                {(activeStage === "pregnancy" ? [
                  "Craving Tender Coconut Water",
                  "Restless Legs at Night",
                  "Tender Gums",
                  "Mild Lower Back Strain",
                  "Vivid Dreams",
                  "Sweet Makhana Craving"
                ] : [
                  "Intense Sugar / Carb Cravings",
                  "Swollen Ankles / Feet",
                  "Night Sweats",
                  "Tender Gums",
                  "Pelvic Heaviness",
                  "Lower Back Spasms"
                ]).map((sugg) => (
                  <button
                    key={sugg}
                    type="button"
                    onClick={() => handleAddCustomSymptom(sugg)}
                    className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-pink-50 text-gray-700 hover:text-[var(--color-primary)] border border-gray-200 text-[11px] transition-colors"
                  >
                    + {sugg}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Added Symptoms List */}
            {customSymptomsList.length > 0 && (
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <span className="font-semibold text-gray-700 block">Logged Custom Symptoms:</span>
                <div className="flex flex-wrap gap-2">
                  {customSymptomsList.map((sym, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-xs font-medium flex items-center gap-1.5 shadow-2xs"
                    >
                      {sym}
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomSymptom(sym)}
                        className="hover:text-rose-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Navigation Buttons */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1 shadow-md"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-md"
            >
              Complete Check-in ✨
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
