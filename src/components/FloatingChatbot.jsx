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
  Heart, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Settings, 
  MessageCircleHeart,
  ChevronDown,
  Minimize2
} from "lucide-react";

export default function FloatingChatbot() {
  const { language, setLanguage, userProfile, speakText, isChatOpen, setIsChatOpen } = useApp();

  const [messages, setMessages] = useState([
    {
      id: "m_init",
      sender: "sakhi",
      text: language === "hi" 
        ? "नमस्ते! मैं आपकी स्वास्थ्य सखी (SakhiAI) हूँ। आप मुझसे माहवारी, पीरियड्स के दर्द, पीसीओएस (PCOS), नींद, या किसी भी स्वास्थ्य चिंता के बारे में अपनी भाषा में पूछ सकती हैं।"
        : language === "hinglish"
        ? "Namaste! Main aapki health companion SakhiAI hoon. Period pain, cycle dates, PCOS ya mood swings ke baare mein freely pooch sakti hain. I'm here to help!"
        : "Hello! I am SakhiAI, your multilingual health companion. Feel free to ask about your cycle, pain relief, PCOS, or recent symptoms in your preferred language.",
      timestamp: "Just now",
      source: "Clinical Companion Standard"
    }
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  
  // Model engine configuration (Local Built-in vs Ollama)
  const [engineType, setEngineType] = useState("local-builtin");
  const [ollamaEndpoint, setOllamaEndpoint] = useState("http://localhost:11434");
  const [ollamaModel, setOllamaModel] = useState("qwen2.5:1.5b");

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isChatOpen]);

  // Speech Recognition
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
          console.warn("Ollama fallback:", e);
        }
      }

      // Default local engine (zero-token cost)
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
      }, 500);

    } catch (err) {
      setIsTyping(false);
      console.error(err);
    }
  };

  const currentSuggestions = SUGGESTED_QUESTIONS[language] || SUGGESTED_QUESTIONS.en;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 no-print flex flex-col items-end">
      
      {/* Floating Chat Popup Window */}
      {isChatOpen && (
        <div className="mb-3 w-[calc(100vw-32px)] sm:w-[410px] h-[580px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border-2 border-[var(--color-border)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Chat Window Header */}
          <div className="p-3.5 bg-[var(--color-primary)] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm leading-none">Sakhi AI Companion</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-[10px] text-pink-200">Multilingual & Voice Enabled</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowConfig(prev => !prev)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Model settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
                title="Minimize chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Engine Config (Collapsible) */}
          {showConfig && (
            <div className="p-3 bg-gray-50 border-b border-gray-200 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Inference Engine:</span>
                <span className="text-[10px] text-gray-500 font-mono">Zero API Cost</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEngineType("local-builtin")}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                    engineType === "local-builtin"
                      ? "bg-[var(--color-badge-bg)] border-[var(--color-primary)] text-[var(--color-primary)]"
                      : "bg-white border-gray-200 text-gray-600"
                  }`}
                >
                  Built-in Engine
                </button>
                <button
                  onClick={() => setEngineType("ollama")}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                    engineType === "ollama"
                      ? "bg-[var(--color-badge-bg)] border-[var(--color-primary)] text-[var(--color-primary)]"
                      : "bg-white border-gray-200 text-gray-600"
                  }`}
                >
                  Local Ollama
                </button>
              </div>
              {engineType === "ollama" && (
                <input
                  type="text"
                  value={ollamaModel}
                  onChange={(e) => setOllamaModel(e.target.value)}
                  placeholder="qwen2.5:1.5b"
                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-mono"
                />
              )}
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[var(--color-bg-soft)]">
            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-2xs text-xs leading-relaxed ${
                      isUser
                        ? "bg-[var(--color-primary)] text-white rounded-br-xs"
                        : m.isAlert
                        ? "bg-rose-50 text-rose-950 border border-rose-300 rounded-bl-xs"
                        : "bg-white text-gray-800 border border-[var(--color-border)] rounded-bl-xs"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    
                    {!isUser && (
                      <div className="mt-2 pt-1.5 border-t border-black/5 flex items-center justify-between text-[10px] text-gray-400">
                        <span className="italic">{m.source || "Clinical Companion"}</span>
                        <button
                          onClick={() => speakText(m.text, language)}
                          className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1 font-semibold"
                        >
                          <Volume2 className="w-3 h-3" /> Speak
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-0.5 px-1 font-mono">
                    {m.timestamp}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2.5 bg-white border border-gray-200 rounded-xl w-24 animate-pulse text-[11px] text-gray-500">
                <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>Sakhi typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-3 py-1.5 bg-white border-t border-gray-100 overflow-x-auto flex gap-1.5 no-scrollbar">
            {currentSuggestions.slice(0, 3).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)] text-[10px] font-medium transition-colors shrink-0 hover:bg-pink-100"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-2.5 bg-white border-t border-[var(--color-border)] flex items-center gap-2">
            <button
              onClick={toggleSpeechRecognition}
              className={`p-2.5 rounded-xl transition-all ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse"
                  : "bg-pink-50 hover:bg-pink-100 text-[var(--color-primary)]"
              }`}
              title="Speak in your language"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={language === "hi" ? "लक्षण या सवाल पूछें..." : "Ask Sakhi in English or Hindi..."}
              className="flex-1 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none"
            />

            <button
              onClick={() => handleSend()}
              disabled={!inputVal.trim()}
              className="p-2.5 rounded-xl bg-[var(--color-primary)] text-white disabled:opacity-40 hover:opacity-90 transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 px-3 py-1 text-[9px] text-gray-400 text-center border-t border-gray-100 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>SakhiAI guides & informs; does not prescribe. Emergency: 112.</span>
          </div>

        </div>
      )}

      {/* Floating Action Button (Small Logo) at Bottom-Right */}
      <button
        onClick={() => setIsChatOpen(prev => !prev)}
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white ring-4 ring-[var(--color-badge-bg)] relative group"
        title="Chat with SakhiAI (Multilingual Voice Companion)"
      >
        {isChatOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <span className="text-2xl animate-bounce">🌸</span>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-pulse" />
          </>
        )}
      </button>

    </div>
  );
}
