import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  SYMVELLA_LANGUAGES, 
  SUGGESTED_QUESTIONS, 
  getLocalSymvellaResponse 
} from "../data/botKnowledge";
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Heart, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Settings, 
  MessageCircleHeart,
  ChevronDown,
  Minimize2,
  Zap,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Radio,
  Loader2,
  BookOpen,
  ExternalLink
} from "lucide-react";
import { 
  getSavedGnaniConfig, 
  saveGnaniConfig, 
  callGnaniLLM, 
  callGeminiGenerativeAI,
  synthesizeGnaniSpeech,
  stopSpeechPlayback,
  transcribeWithGnaniSTT,
  startMicrophoneRecording,
  stopMicrophoneRecording,
  testGnaniConnection, 
  GNANI_TOKEN_LIMIT, 
  resetTokenUsage 
} from "../services/gnaniService";
import { generateRAGResponse } from "../services/ragService";
import ChatFormattedMessage from "./ChatFormattedMessage";

export default function FloatingChatbot() {
  const { language, setLanguage, userProfile, speakText, isChatOpen, setIsChatOpen, t } = useApp();

  const [messages, setMessages] = useState([
    {
      id: "m_init",
      sender: "sakhi",
      text: t("chat.greeting", "Hello! I am Symvella, your multilingual health companion. Feel free to ask about your cycle, pain relief, PCOS, or recent symptoms in your preferred language."),
      timestamp: "Just now",
      source: "Clinical Companion Standard"
    }
  ]);

  // Dynamically update greeting when language changes
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === "m_init") {
        return [
          {
            id: "m_init",
            sender: "sakhi",
            text: t("chat.greeting", "Hello! I am Symvella, your multilingual health companion. Feel free to ask about your cycle, pain relief, PCOS, or recent symptoms in your preferred language."),
            timestamp: "Just now",
            source: "Clinical Companion Standard"
          }
        ];
      }
      return prev;
    });
  }, [language, t]);

  const [inputVal, setInputVal] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  
  // Exclusively Gnani.ai Model Configuration & Token Tracking
  const [gnaniApiKey, setGnaniApiKey] = useState(() => getSavedGnaniConfig().apiKey);
  const [gnaniModel, setGnaniModel] = useState(() => getSavedGnaniConfig().model || "Gnani Prisma V2.5");
  const [gnaniVoice, setGnaniVoice] = useState(() => getSavedGnaniConfig().voice || "Nalini");
  const [gnaniTokensUsed, setGnaniTokensUsed] = useState(() => getSavedGnaniConfig().tokensUsed);
  const [showGnaniKey, setShowGnaniKey] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  // Voice recording & transcription state
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [expandedSources, setExpandedSources] = useState({});

  const toggleSourceExpansion = (msgId) => {
    setExpandedSources(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleTestGnani = async () => {
    setTestStatus({ loading: true, message: "Verifying credentials with Gnani.ai..." });
    saveGnaniConfig({ apiKey: gnaniApiKey, model: gnaniModel, voice: gnaniVoice });
    const res = await testGnaniConnection(gnaniApiKey);
    setTestStatus({ loading: false, success: res.success, message: res.message });
    setTimeout(() => setTestStatus(null), 5000);
  };

  const handleResetTokens = () => {
    resetTokenUsage();
    setGnaniTokensUsed(0);
  };

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isChatOpen]);

  // Handle Speech-to-Text via Gnani Prisma STT (with fallback to browser Web Speech)
  const toggleSpeechRecognition = async () => {
    if (isListening) {
      // User tapped stop: finish microphone recording and send audio to Gnani STT
      setIsListening(false);
      setIsTranscribing(true);

      try {
        const audioBlob = await stopMicrophoneRecording();
        if (gnaniApiKey) {
          const sttRes = await transcribeWithGnaniSTT({
            audioBlob,
            apiKey: gnaniApiKey,
            language
          });
          if (sttRes && sttRes.transcript) {
            setInputVal(sttRes.transcript);
            handleSend(sttRes.transcript, true);
          }
        } else {
          // If no Gnani key, prompt user with link
          alert("💡 Please configure your Gnani API key from https://app.gnani.ai/voice/speech-to-text in chat settings ⚙️.");
        }
      } catch (sttErr) {
        console.warn("Gnani STT notice, trying browser recognition fallback:", sttErr);
        runBrowserSpeechFallback();
      } finally {
        setIsTranscribing(false);
      }
      return;
    }

    // Start Recording user microphone
    try {
      await startMicrophoneRecording();
      setIsListening(true);
    } catch (micErr) {
      console.warn("MediaRecorder mic access error, attempting browser speech:", micErr);
      runBrowserSpeechFallback();
    }
  };

  const runBrowserSpeechFallback = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Microphone recording error. Please allow microphone access or use Chrome/Edge.");
      setIsListening(false);
      setIsTranscribing(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      const langMap = { hi: "hi-IN", mr: "mr-IN", ta: "ta-IN", hinglish: "hi-IN", en: "en-IN" };
      recognition.lang = langMap[language] || "en-IN";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => {
        setIsListening(false);
        setIsTranscribing(false);
      };
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInputVal(transcript);
        handleSend(transcript, true);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Browser speech recognition failed:", err);
      setIsListening(false);
      setIsTranscribing(false);
    }
  };

  // Handle Text-to-Speech via Gnani Timbre TTS (with fallback)
  const handlePlaySpeech = async (text, messageId) => {
    if (playingMessageId === messageId) {
      stopSpeechPlayback();
      setPlayingMessageId(null);
      return;
    }

    setPlayingMessageId(messageId);
    try {
      await synthesizeGnaniSpeech({
        text,
        apiKey: gnaniApiKey,
        language,
        voice: gnaniVoice
      });
    } catch (err) {
      console.warn("TTS error:", err);
    } finally {
      const estimatedSec = Math.max(3, Math.min(25, text.split(" ").length / 2.5));
      setTimeout(() => {
        setPlayingMessageId(prev => prev === messageId ? null : prev);
      }, estimatedSec * 1000);
    }
  };

  const handleSend = async (queryText = inputVal, isVoiceInput = false) => {
    const query = queryText.trim();
    if (!query) return;

    const userMsg = {
      id: "u_" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoice: isVoiceInput
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    try {
      // Exclusively invoke Gnani Model with RAG grounding
      const ragRes = await generateRAGResponse({
        query,
        language,
        userProfile,
        gnaniApiKey,
        gnaniModel
      });

      if (ragRes.totalTokensUsed) {
        setGnaniTokensUsed(ragRes.totalTokensUsed);
      }

      const botReply = {
        id: "b_" + Date.now(),
        sender: "symvella",
        text: ragRes.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: ragRes.sources,
        retrievedDocs: ragRes.retrievedDocs,
        ragConfidence: ragRes.ragConfidence,
        isRAG: ragRes.isRAG
      };

      setMessages(prev => [...prev, botReply]);
    } catch (ragErr) {
      console.warn("RAG pipeline error, falling back to local clinical engine:", ragErr);
      const reply = getLocalSymvellaResponse(query, language, { userProfile });
      const botReply = {
        id: "b_" + Date.now(),
        sender: "symvella",
        text: reply.text,
        isAlert: reply.isAlert,
        source: reply.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botReply]);
    } finally {
      setIsTyping(false);
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
              <img 
                src="/logo.png" 
                alt="Symvella" 
                className="w-8 h-8 rounded-xl object-cover bg-white shadow-xs" 
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm leading-none">Symvella Companion</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowConfig(prev => !prev)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Gnani Model settings"
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

          {/* Gnani AI Model Configuration (Collapsible) */}
          {showConfig && (
            <div className="p-3 bg-gray-50 border-b border-gray-200 text-xs space-y-2.5 max-h-64 overflow-y-auto">
              <div className="p-2.5 bg-white rounded-xl border border-purple-200 space-y-2 animate-in fade-in">
                
                {/* Header & Dashboard Link */}
                <div className="flex items-center justify-between pb-1.5 border-b border-purple-100">
                  <span className="font-bold text-purple-950 text-[11px] flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-purple-600" /> Gnani.ai Model Configuration
                  </span>
                  <a
                    href="https://app.gnani.ai/voice/speech-to-text"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 text-[10px] font-semibold underline flex items-center gap-0.5 cursor-pointer"
                    title="Open app.gnani.ai Speech to Text dashboard"
                  >
                    app.gnani.ai/voice ↗
                  </a>
                </div>

                {/* Free Token Quota Tracker */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-semibold text-purple-900 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-purple-600" /> Free Token Quota:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-purple-800">
                        {gnaniTokensUsed.toLocaleString()} / {GNANI_TOKEN_LIMIT.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={handleResetTokens}
                        title="Reset local counter"
                        className="text-gray-400 hover:text-purple-600 cursor-pointer"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-purple-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        gnaniTokensUsed >= GNANI_TOKEN_LIMIT ? "bg-rose-500" : "bg-purple-600"
                      }`}
                      style={{ width: `${Math.min(100, (gnaniTokensUsed / GNANI_TOKEN_LIMIT) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Model specifications badge */}
                <div className="p-1.5 rounded-lg bg-purple-50/70 border border-purple-150 text-[10px] grid grid-cols-3 gap-1 text-purple-900">
                  <div>
                    <span className="text-gray-500 block text-[8px]">STT Model:</span>
                    <strong className="font-mono text-purple-800 text-[9px]">prisma-v2.5</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[8px]">TTS Model:</span>
                    <strong className="font-mono text-purple-800 text-[9px]">timbre-v2.5</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[8px]">LLM Model:</span>
                    <strong className="font-mono text-purple-800 text-[9px]">{gnaniModel}</strong>
                  </div>
                </div>

                {/* API Key Input */}
                <div>
                  <label className="text-[10px] font-bold text-gray-600 block mb-0.5">
                    Gnani API Key (X-API-Key-ID):
                  </label>
                  <div className="relative">
                    <input
                      type={showGnaniKey ? "text" : "password"}
                      value={gnaniApiKey}
                      onChange={(e) => {
                        setGnaniApiKey(e.target.value);
                        saveGnaniConfig({ apiKey: e.target.value });
                      }}
                      placeholder="Paste Gnani API key from app.gnani.ai"
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-600 rounded-lg pl-2 pr-7 py-1 text-[11px] font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGnaniKey(!showGnaniKey)}
                      className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showGnaniKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Voice & LLM Model Selectors */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-0.5">Gnani Timbre Voice:</label>
                    <select
                      value={gnaniVoice}
                      onChange={(e) => {
                        setGnaniVoice(e.target.value);
                        saveGnaniConfig({ voice: e.target.value });
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-purple-600"
                    >
                      <option value="Nalini">Nalini (Natural Female)</option>
                      <option value="Radhika">Radhika (Gentle Voice)</option>
                      <option value="Kavya">Kavya (Indic Pro)</option>
                      <option value="Aarav">Aarav (Warm Male)</option>
                    </select>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 p-2.5 rounded-xl border border-purple-200 shadow-2xs">
                    <label className="text-[11px] font-bold text-gray-800 block mb-1">Model</label>
                    <select
                      value={gnaniModel}
                      onChange={(e) => {
                        setGnaniModel(e.target.value);
                        saveGnaniConfig({ model: e.target.value });
                      }}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-gray-800 shadow-2xs focus:outline-none focus:border-purple-600 cursor-pointer"
                    >
                      <option value="Gnani Prisma V2.5">Gnani Prisma V2.5</option>
                      <option value="Gnani Timbre V2.5">Gnani Timbre V2.5</option>
                      <option value="Gnani Prisma + Timbre Suite">Gnani Prisma + Timbre Suite</option>
                    </select>
                    <p className="text-[10px] text-gray-500 mt-1 leading-snug">
                      Transforms speech into accurate text across Indian languages
                    </p>
                  </div>
                </div>

                {/* Test Key Button */}
                <button
                  type="button"
                  onClick={handleTestGnani}
                  disabled={testStatus?.loading}
                  className="w-full py-1.5 px-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-[10px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  {testStatus?.loading ? (
                    <span className="animate-spin text-xs">⏳</span>
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  )}
                  <span>Test Credentials</span>
                </button>

                {/* Capabilities Banner */}
                <div className="p-1.5 rounded-lg bg-purple-50/80 text-purple-900 text-[9px] flex items-center gap-1">
                  <Radio className="w-3 h-3 text-purple-600 shrink-0" />
                  <span>Exclusively powered by <strong>Gnani.ai</strong> (Prisma STT, Timbre TTS & Indic LLM).</span>
                </div>

                {/* Test Feedback Notice */}
                {testStatus && (
                  <div className={`p-1.5 rounded-lg text-[10px] flex items-center gap-1 ${
                    testStatus.success ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}>
                    {testStatus.success ? <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> : <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />}
                    <span className="truncate">{testStatus.message}</span>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[var(--color-bg-soft)]">
            {messages.map((m) => {
              const isUser = m.sender === "user";
              const isPlayingThis = playingMessageId === m.id;
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
                        : "bg-white text-gray-800 border border-purple-100 rounded-bl-xs"
                    }`}
                  >
                    <ChatFormattedMessage content={m.text} isUser={isUser} />

                    {!isUser && (
                      <div className="mt-2 pt-1.5 border-t border-black/5 flex items-center justify-end text-[10px] text-gray-500">
                        <button
                          onClick={() => handlePlaySpeech(m.text, m.id)}
                          className={`transition-colors flex items-center gap-1 font-semibold cursor-pointer ${
                            isPlayingThis ? "text-rose-600 animate-pulse font-bold" : "hover:text-[var(--color-primary)] text-purple-700"
                          }`}
                          title="Listen with Gnani Timbre voice"
                        >
                          {isPlayingThis ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5" /> Stop
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" /> Listen (Gnani Voice)
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 px-1">
                    <span className="text-[9px] text-gray-400 font-mono">
                      {m.timestamp}
                    </span>
                    {m.isVoice && (
                      <span className="text-[9px] text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.2 rounded-full flex items-center gap-0.5 font-medium">
                        <Mic className="w-2.5 h-2.5 text-purple-600" /> Gnani Prisma
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2.5 bg-white border border-gray-200 rounded-xl w-32 animate-pulse text-[11px] text-gray-500">
                <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>Symvella thinking...</span>
              </div>
            )}
            
            {isTranscribing && (
              <div className="flex items-center gap-1.5 p-2 bg-purple-50 border border-purple-200 rounded-xl w-44 animate-pulse text-[10px] text-purple-700 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                <span>Transcribing (Gnani STT)...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Live Recording / Transcribing Indicator Banner */}
          {isListening && (
            <div className="px-3 py-1.5 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs text-rose-700 animate-in fade-in">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                <span className="font-semibold text-[10px]">Gnani Prisma STT: Speak now...</span>
              </div>
              <button 
                onClick={toggleSpeechRecognition}
                className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700 cursor-pointer shadow-xs"
              >
                Stop & Transcribe ⏹️
              </button>
            </div>
          )}

          {isTranscribing && (
            <div className="px-3 py-1.5 bg-purple-50 border-t border-purple-200 flex items-center gap-1.5 text-xs text-purple-700">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
              <span className="text-[10px] font-medium">Gnani Prisma converting speech to text...</span>
            </div>
          )}

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
              disabled={isTranscribing}
              className={`p-2.5 rounded-xl transition-all ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse shadow-md"
                  : isTranscribing
                  ? "bg-purple-100 text-purple-600"
                  : "bg-pink-50 hover:bg-pink-100 text-[var(--color-primary)]"
              }`}
              title={isListening ? "Listening... Tap to send voice" : "Tap to speak with Gnani Prisma STT"}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : isTranscribing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                isListening 
                  ? t("chat.listening", "Listening to your voice... Tap mic to stop") 
                  : isTranscribing
                  ? t("chat.transcribing", "Gnani Prisma is transcribing...")
                  : t("chat.placeholder", "Ask Symvella anything about cycles or health...")
              }
              className="flex-1 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none"
            />

            <button
              onClick={() => handleSend()}
              disabled={!inputVal.trim() || isTranscribing}
              className="p-2.5 rounded-xl bg-[var(--color-primary)] text-white disabled:opacity-40 hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Floating Action Button (Small Logo) at Bottom-Right */}
      <button
        onClick={() => setIsChatOpen(prev => !prev)}
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white ring-4 ring-[var(--color-badge-bg)] relative group overflow-hidden"
        title="Chat with Symvella (Multilingual Voice Companion)"
      >
        {isChatOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <img src="/logo.png" alt="Symvella" className="w-10 h-10 rounded-xl object-cover bg-white" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-pulse" />
          </>
        )}
      </button>

    </div>
  );
}
