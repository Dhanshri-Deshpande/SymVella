import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
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
  Activity
} from "lucide-react";
import confetti from "canvas-confetti";

export default function CheckInModal() {
  const { isCheckInOpen, setIsCheckInOpen, addSymptomLog, setIsSOSOpen, language } = useApp();

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Step 1: Menstrual & Cervical Fluid
  const [menstrualFlow, setMenstrualFlow] = useState("none");
  const [hasClots, setHasClots] = useState(false);
  const [soakingPads, setSoakingPads] = useState(false);
  const [cervicalFluid, setCervicalFluid] = useState("dry");

  // Step 2: Pain & Sensation
  const [painLocation, setPainLocation] = useState("none");
  const [painIntensity, setPainIntensity] = useState(2);
  const [painType, setPainType] = useState("dull");
  const [hasFeverWithPain, setHasFeverWithPain] = useState(false);

  // Step 3: Mood & Sleep
  const [moodLevel, setMoodLevel] = useState(3);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState("restful");
  const [fatigueLevel, setFatigueLevel] = useState(3);

  // Step 4: Hormones & Digestion
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

  // Step 5: Lifestyle & Medications
  const [waterLiters, setWaterLiters] = useState(2.0);
  const [stressScore, setStressScore] = useState(4);
  const [medications, setMedications] = useState([]);

  // Step 6: Custom Symptoms (Add from your side)
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
      alert("Speech recognition is not supported in this browser. Please use Chrome/Edge.");
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
      menstrual: {
        flow: menstrualFlow,
        clotting: hasClots,
        soakingPads,
        cervicalFluid
      },
      pain: {
        location: painLocation,
        intensity: Number(painIntensity),
        type: painType,
        hasFeverWithPain
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
      body: bodyMarkers,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-[var(--color-border)] animate-in fade-in zoom-in duration-200 my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)]">
                Step {step} of {totalSteps}
              </span>
              <span className="text-xs text-gray-400">Comprehensive Check-in</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              {step === 1 && "Menstrual Flow & Cervical Fluid"}
              {step === 2 && "Pain Location, Type & Intensity"}
              {step === 3 && "Mood, Mind, Sleep & Fatigue"}
              {step === 4 && "Hormonal, Gut & Physical Signs"}
              {step === 5 && "Hydration, Lifestyle & Medicine"}
              {step === 6 && "Add Your Own Custom Symptoms"}
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

        {/* Step 1: Menstrual & Cervical Fluid */}
        {step === 1 && (
          <div className="space-y-4 py-1 text-xs">
            <p className="font-semibold text-gray-700 uppercase tracking-wider">
              Menstrual Flow Level:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: "none", label: "No Flow", icon: "✨" },
                { id: "spotting", label: "Spotting", icon: "💧" },
                { id: "light", label: "Light", icon: "🩸" },
                { id: "medium", label: "Medium", icon: "🩸🩸" },
                { id: "heavy", label: "Heavy", icon: "🩸🩸🩸" }
              ].map(opt => (
                <button
                  key={opt.id}
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

            {/* Cervical Fluid Tracking */}
            <div className="pt-2">
              <p className="font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Cervical Fluid / Discharge Consistency:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "dry", label: "Dry / None", icon: "☀️" },
                  { id: "sticky", label: "Sticky / Thick", icon: "🍯" },
                  { id: "creamy", label: "Creamy / Lotion", icon: "🥛" },
                  { id: "eggwhite", label: "Egg-white (Fertile)", icon: "🥚" }
                ].map(cf => (
                  <button
                    key={cf.id}
                    onClick={() => setCervicalFluid(cf.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      cervicalFluid === cf.id
                        ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold shadow-xs"
                        : "border-gray-200 bg-white text-gray-600 hover:border-pink-200"
                    }`}
                  >
                    <span className="block text-base mb-0.5">{cf.icon}</span>
                    <span className="text-[11px]">{cf.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {menstrualFlow !== "none" && (
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2.5">
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
                      <span>Soaking 2+ maxi pads per hour consecutively?</span>
                    </label>
                    {soakingPads && (
                      <p className="text-[11px] text-rose-700">
                        ⚠️ <strong>Warning:</strong> Risk of acute menorrhagia.{" "}
                        <button onClick={() => setIsSOSOpen(true)} className="underline font-bold">
                          Open SOS Modal
                        </button>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Pain Location, Sensation & Intensity */}
        {step === 2 && (
          <div className="space-y-4 py-1 text-xs">
            <p className="font-semibold text-gray-700 uppercase tracking-wider">
              Where is the pain located?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "none", label: "No Pain", emoji: "🌿" },
                { id: "pelvic", label: "Pelvic / Uterus", emoji: "⚡" },
                { id: "lower_back", label: "Lower Back / Hips", emoji: "🦴" },
                { id: "head", label: "Headache / Migraine", emoji: "💆‍♀️" },
                { id: "breasts", label: "Breast Tenderness", emoji: "🌸" },
                { id: "joints", label: "Joints / Legs", emoji: "🦵" },
                { id: "stomach", label: "Stomach Cramps", emoji: "🥣" }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPainLocation(p.id)}
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
                    <span className="font-semibold text-gray-800">Pain Intensity:</span>
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
                  <span className="font-semibold text-gray-800 block mb-1.5">Pain Sensation Quality:</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: "dull", label: "Dull Ache" },
                      { id: "sharp", label: "Sharp / Stabbing" },
                      { id: "burning", label: "Burning" },
                      { id: "throbbing", label: "Throbbing" }
                    ].map(t => (
                      <button
                        key={t.id}
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

                {Number(painIntensity) >= 7 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-amber-950 font-medium">
                      <input
                        type="checkbox"
                        checked={hasFeverWithPain}
                        onChange={(e) => setHasFeverWithPain(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600"
                      />
                      <span>Accompanied by fever, vomiting or chills?</span>
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Mood, Emotions, Sleep & Fatigue */}
        {step === 3 && (
          <div className="space-y-4 py-1 text-xs">
            <div>
              <p className="font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Overall Mood:
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

            {/* Emotional Symptoms Pills */}
            <div>
              <p className="font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Mental & Emotional Sensations:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Anxiety / Worry",
                  "Irritability",
                  "Brain Fog",
                  "Low Motivation",
                  "Crying Spells",
                  "Restless Mind",
                  "Content & Peaceful"
                ].map(emo => (
                  <button
                    key={emo}
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

            {/* Sleep & Fatigue Box */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-purple-600" /> Sleep Duration:
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
                <span className="font-semibold text-gray-800">Fatigue Rating:</span>
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

        {/* Step 4: Hormones, Gut & Physical Signs */}
        {step === 4 && (
          <div className="space-y-4 py-1 text-xs">
            <p className="font-semibold text-gray-700 uppercase tracking-wider">
              Physical & Hormonal Markers (Tap any you experienced):
            </p>
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
            <p className="text-[11px] text-gray-400 italic">
              *These physical markers feed directly into your Explainable AI pattern screen for PCOS and metabolic health.
            </p>
          </div>
        )}

        {/* Step 5: Lifestyle, Hydration & Medication */}
        {step === 5 && (
          <div className="space-y-4 py-1 text-xs">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-blue-500" /> Water Intake:
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
                  <span className="font-semibold text-gray-800">Stress & Work Pressure:</span>
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
                <Pill className="w-4 h-4 text-purple-600" /> Medications / Supplements Taken Today:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Iron / Folic Acid",
                  "Pain Reliever (Meftal/NSAID)",
                  "Multivitamins / B-Complex",
                  "Hormonal Contraceptive / Pill",
                  "Thyroid Tablet (Thyroxine)",
                  "Probiotics",
                  "None"
                ].map(med => (
                  <button
                    key={med}
                    onClick={() => toggleMedication(med)}
                    className={`px-3 py-1.5 rounded-full border text-[11px] transition-colors ${
                      medications.includes(med)
                        ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] font-bold"
                        : "border-gray-200 bg-white text-gray-600 hover:border-pink-200"
                    }`}
                  >
                    {med} {medications.includes(med) ? "✓" : "+"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Custom Symptoms (Add From Your Side) */}
        {step === 6 && (
          <div className="space-y-4 py-1 text-xs">
            <div className="p-3.5 bg-[var(--color-badge-bg)] rounded-2xl border border-[var(--color-border)]">
              <h4 className="font-bold text-[var(--color-primary-dark)] text-sm mb-1">
                Add From Your Side: Your Own Symptoms & Notes ✍️
              </h4>
              <p className="text-gray-600 text-xs">
                Every woman's body is unique. Type or speak any other symptom, craving, bodily change, or feeling you noticed today.
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
                placeholder="e.g. Sharp left pelvic twinge, severe sugar cravings..."
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

            {/* Quick Popular Custom Additions */}
            <div>
              <p className="font-semibold text-gray-600 mb-2">Tap to Quick-Add Common Feelings:</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Intense Sugar / Carb Cravings",
                  "Swollen Ankles / Feet",
                  "Night Sweats",
                  "Tender Gums",
                  "Pelvic Heaviness",
                  "Restless Legs at Night",
                  "Lower Back Spasms",
                  "Metallic Taste in Mouth"
                ].map((sugg) => (
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
