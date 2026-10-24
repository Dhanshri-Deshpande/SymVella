import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  SAKHI_LANGUAGES, 
  SUGGESTED_QUESTIONS, 
  getLocalSakhiResponse 
} from "../data/botKnowledge";
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Heart, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  Settings, 
  RefreshCw,
  Cpu
} from "lucide-react";

export default function SakhiChat() {
  const { language, setLanguage, userProfile, speakText } = useApp();

  const [messages, setMessages] = useState([
    {
      id: "m_init",
      sender: "sakhi",
      text: language === "hi" 
        ? "नमस्ते! मैं आपकी स्वास्थ्य सखी (SakhiAI) हूँ। आप मुझसे माहवारी, पीरियड्स के दर्द, पीसीओएस (PCOS), नींद, या किसी भी स्वास्थ्य चिंता के बारे में अपनी भाषा में पूछ सकती हैं। मैं सिर्फ जानकारी और सहायता देती हूँ, चिकित्सीय पर्चा नहीं लिखती।"
        : language === "hinglish"
        ? "Namaste! Main aapki health companion SakhiAI hoon. Aap mujhse menstrual cycle, cramps, PCOS, ya kisi bhi symptom ke baare mein freely baat kar sakti hain. I'm here to support you with 100% privacy."
        : "Hello! I am SakhiAI, your multilingual health companion. You can ask me questions about menstrual health, cramps, PCOS, sleep, or request an explanation of your symptoms. I am here to guide and inform with complete privacy.",
      timestamp: "Just now",
      source: "Clinical Companion Standard"
    }
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  
  // Model engine configuration (Local Built-in vs Ollama vs Gemini Free)
  const [engineType, setEngineType] = useState("local-builtin"); // local-builtin, ollama, gemini-free
  const [ollamaEndpoint, setOllamaEndpoint] = useState("http://localhost:11434");
  const [ollamaModel, setOllamaModel] = useState("qwen2.5:1.5b");
  const [geminiKey, setGeminiKey] = useState("");

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Initialize Speech Recognition if supported
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      if (language === "hi") recognition.lang = "hi-IN";
      else if (language === "ta") recognition.lang = "ta-IN";
      else if (language === "mr") recognition.lang = "mr-IN";
      else recognition.lang = "en-IN";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInputVal(transcript);
        handleSend(transcript);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech Recognition Error:", err);
      setIsListening(false);
    }
  };

  const handleSend = async (queryText = inputVal) => {
    const query = queryText.trim();
    if (!query) return;

    const userMsg = {
      id: "u_" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    try {
      // Branch 1: Local Ollama (if configured and running)
      if (engineType === "ollama") {
        try {
          const res = await fetch(`${ollamaEndpoint}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: ollamaModel,
              prompt: `You are SakhiAI, a warm, supportive, multilingual women's health companion. Explain simply in ${language}. Never diagnose or prescribe medicines. User says: "${query}"`,
              stream: false
            })
          });
          const data = await res.json();
          const botReply = {
            id: "b_" + Date.now(),
            sender: "sakhi",
            text: data.response || "I could not generate a response.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: `Local Ollama (${ollamaModel})`
          };
          setMessages(prev => [...prev, botReply]);
          setIsTyping(false);
          return;
        } catch (e) {
          console.warn("Ollama connection failed, falling back to local clinical knowledge:", e);
        }
      }

      // Default & Failsafe: Built-in Clinical Multilingual Knowledge Engine (Zero-cost, 100% reliable)
      setTimeout(() => {
        const reply = getLocalSakhiResponse(query, language, { userProfile });
        const botReply = {
          id: "b_" + Date.now(),
          sender: "sakhi",
          text: reply.text,
          isAlert: reply.isAlert,
          source: reply.source,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botReply]);
        setIsTyping(false);
      }, 600);

    } catch (err) {
      setIsTyping(false);
      console.error(err);
    }
  };

  const currentSuggestions = SUGGESTED_QUESTIONS[language] || SUGGESTED_QUESTIONS.en;

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl shadow-md border border-[var(--color-border)] overflow-hidden">
      
      {/* Chat Header */}
      <div className="p-4 bg-[var(--color-badge-bg)] border-b border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-md">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">Sakhi Companion</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-gray-500">
                {engineType === "ollama" ? `Local Ollama (${ollamaModel})` : "Local Clinical Engine (Zero Token Cost)"}
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Voice & Text • Non-diagnostic supportive companion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Engine settings button */}
          <button
            onClick={() => setShowConfig(prev => !prev)}
            className="p-2 rounded-xl bg-white hover:bg-gray-50 border border-[var(--color-border)] text-gray-600 text-xs flex items-center gap-1 transition-colors"
            title="Chat Engine Settings (Local Model / Ollama / API)"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Engine</span>
          </button>
        </div>
      </div>

      {/* Model Engine Configuration Panel (Expandable) */}
      {showConfig && (
        <div className="p-4 bg-gray-50 border-b border-gray-200 text-xs space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-800 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-600" /> AI Execution Engine:
            </span>
            <button 
              onClick={() => setShowConfig(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer ${engineType === "local-builtin" ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] font-bold text-[var(--color-primary-dark)]" : "border-gray-200 bg-white"}`}>
              <input
                type="radio"
                name="engine"
                checked={engineType === "local-builtin"}
                onChange={() => setEngineType("local-builtin")}
                className="text-[var(--color-primary)]"
              />
              <div>
                <p>Built-in Clinical Engine (Recommended)</p>
                <p className="text-[10px] text-gray-500 font-normal">100% Free, zero tokens, instant response</p>
              </div>
            </label>

            <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer ${engineType === "ollama" ? "border-[var(--color-primary)] bg-[var(--color-badge-bg)] font-bold text-[var(--color-primary-dark)]" : "border-gray-200 bg-white"}`}>
              <input
                type="radio"
                name="engine"
                checked={engineType === "ollama"}
                onChange={() => setEngineType("ollama")}
                className="text-[var(--color-primary)]"
              />
              <div>
                <p>Local Ollama LLM</p>
                <p className="text-[10px] text-gray-500 font-normal">Runs on your laptop via localhost:11434</p>
              </div>
            </label>
          </div>

          {engineType === "ollama" && (
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={ollamaEndpoint}
                onChange={(e) => setOllamaEndpoint(e.target.value)}
                placeholder="http://localhost:11434"
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 bg-white"
              />
              <input
                type="text"
                value={ollamaModel}
                onChange={(e) => setOllamaModel(e.target.value)}
                placeholder="qwen2.5:1.5b"
                className="w-32 px-3 py-1.5 rounded-lg border border-gray-300 bg-white font-mono"
              />
            </div>
          )}
        </div>
      )}

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 shadow-xs text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-[var(--color-primary)] text-white rounded-br-xs"
                    : m.isAlert
                    ? "bg-rose-50 text-rose-950 border border-rose-300 rounded-bl-xs"
                    : "bg-gray-50 text-gray-800 border border-gray-200 rounded-bl-xs"
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                
                {/* Voice listen button for bot messages */}
                {!isUser && (
                  <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="italic">{m.source || "Clinical Guidelines Aligned"}</span>
                    <button
                      onClick={() => speakText(m.text, language)}
                      className="p-1 rounded-md hover:bg-black/5 text-gray-500 hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Listen
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">
                {m.timestamp}
              </span>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-2xl w-28 animate-pulse text-xs text-gray-500">
            <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Sakhi typing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-100 overflow-x-auto flex gap-2 no-scrollbar">
        {currentSuggestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] text-[11px] text-gray-600 transition-colors shadow-2xs shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-[var(--color-border)] flex items-center gap-2">
        
        {/* Speech to Text Microphone */}
        <button
          onClick={toggleSpeechRecognition}
          className={`p-3 rounded-2xl transition-all ${
            isListening
              ? "bg-rose-600 text-white animate-pulse"
              : "bg-pink-50 hover:bg-pink-100 text-[var(--color-primary)]"
          }`}
          title={isListening ? "Listening... Tap to stop" : "Tap to speak in your language"}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            language === "hi" 
              ? "अपनी समस्या या लक्षण यहाँ लिखें..." 
              : "Ask Sakhi about symptoms, pain, cycles, or nutrition..."
          }
          className="flex-1 bg-gray-50 border border-gray-200 focus:border-[var(--color-primary)] focus:bg-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none transition-colors"
        />

        {/* Send Button */}
        <button
          onClick={() => handleSend()}
          disabled={!inputVal.trim()}
          className="p-3 rounded-2xl bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-40 text-white shadow-sm transition-transform active:scale-95"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Clinical Disclaimer footer */}
      <div className="bg-gray-50 px-4 py-1.5 border-t border-gray-100 text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        <span>SakhiAI informs & guides; does not diagnose or prescribe. In emergencies, call 112.</span>
      </div>

    </div>
  );
}
