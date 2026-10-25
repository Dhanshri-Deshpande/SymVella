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
  Loader2,
  BookOpen,
  ExternalLink
} from "lucide-react";
import { 
  getSavedGnaniConfig, 
  callGnaniLLM, 
  callGeminiGenerativeAI,
  synthesizeGnaniSpeech,
  stopSpeechPlayback,
  transcribeWithGnaniSTT,
  startMicrophoneRecording,
  stopMicrophoneRecording
} from "../services/gnaniService";
import { generateRAGResponse } from "../services/ragService";
import ChatFormattedMessage from "../components/ChatFormattedMessage";

export default function SymvellaChat() {
  const { language, setLanguage, userProfile, t } = useApp();

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
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [expandedSources, setExpandedSources] = useState({});

  const toggleSourceExpansion = (msgId) => {
    setExpandedSources(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };
  const [isTyping, setIsTyping] = useState(false);
  
  // Gnani.ai Model Configuration
  const [gnaniApiKey] = useState(() => getSavedGnaniConfig().apiKey);
  const [gnaniModel] = useState(() => getSavedGnaniConfig().model || "Gnani Prisma V2.5");
  const [gnaniVoice] = useState(() => getSavedGnaniConfig().voice || "Nalini");

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle Speech-to-Text via Gnani Prisma STT (with browser Web Speech fallback)
  const toggleSpeechRecognition = async () => {
    if (isListening) {
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
          runBrowserSpeechFallback();
        }
      } catch (sttErr) {
        console.warn("Gnani STT notice, trying browser recognition fallback:", sttErr);
        runBrowserSpeechFallback();
      } finally {
        setIsTranscribing(false);
      }
      return;
    }

    try {
      await startMicrophoneRecording();
      setIsListening(true);
    } catch (micErr) {
      console.warn("Microphone access error, falling back to browser SpeechRecognition:", micErr);
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

  // Text-to-Speech via Gnani Timbre TTS
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

      const botReply = {
        id: "b_" + Date.now(),
        sender: "sakhi",
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
        sender: "sakhi",
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
    <div className="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl shadow-md border border-[var(--color-border)] overflow-hidden">
      
      {/* Chat Header */}
      <div className="p-4 bg-[var(--color-badge-bg)] border-b border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Symvella" 
            className="w-10 h-10 rounded-2xl object-cover bg-white shadow-md border border-purple-100" 
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">Symvella Companion</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-semibold border border-purple-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600" /> AI Companion
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-600" /> Grounded in Verified Medical Literature (RAG: ACOG • WHO • FIGO • ICMR)
            </p>
          </div>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          const isPlayingThis = playingMessageId === m.id;
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
                    : "bg-white text-gray-800 border border-purple-100 rounded-bl-xs shadow-2xs"
                }`}
              >
                <ChatFormattedMessage content={m.text} isUser={isUser} />

                {/* Voice listen button for bot messages */}
                {!isUser && (
                  <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-end text-[11px] text-gray-500">
                    <button
                      onClick={() => handlePlaySpeech(m.text, m.id)}
                      className={`p-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                        isPlayingThis ? "text-rose-600 font-bold animate-pulse" : "text-purple-700 hover:text-[var(--color-primary)]"
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
              <div className="flex items-center gap-1.5 mt-1 px-1">
                <span className="text-[10px] text-gray-400">
                  {m.timestamp}
                </span>
                {m.isVoice && (
                  <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                    <Mic className="w-2.5 h-2.5 text-purple-600" /> Gnani Prisma
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-2xl w-32 animate-pulse text-xs text-gray-500">
            <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Symvella thinking...</span>
          </div>
        )}

        {isTranscribing && (
          <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-2xl w-48 animate-pulse text-xs text-purple-700 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
            <span>Transcribing (Gnani STT)...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Live Recording / Transcribing Indicator Banner */}
      {isListening && (
        <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs text-rose-700 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            <span className="font-semibold text-xs">Gnani Prisma STT: Speak now in Hindi, English, Marathi, or Tamil...</span>
          </div>
          <button 
            onClick={toggleSpeechRecognition}
            className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 cursor-pointer shadow-xs"
          >
            Stop & Transcribe ⏹️
          </button>
        </div>
      )}

      {isTranscribing && (
        <div className="px-4 py-2 bg-purple-50 border-t border-purple-200 flex items-center gap-2 text-xs text-purple-700">
          <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
          <span className="text-xs font-medium">Gnani Prisma model is converting audio to text...</span>
        </div>
      )}

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
        
        {/* Speech to Text Microphone (Gnani Prisma STT) */}
        <button
          onClick={toggleSpeechRecognition}
          disabled={isTranscribing}
          className={`p-3 rounded-2xl transition-all cursor-pointer ${
            isListening
              ? "bg-rose-600 text-white animate-pulse shadow-md"
              : isTranscribing
              ? "bg-purple-100 text-purple-600"
              : "bg-pink-50 hover:bg-pink-100 text-[var(--color-primary)]"
          }`}
          title={isListening ? "Listening... Tap to stop & transcribe" : "Tap to speak with Gnani Prisma STT"}
        >
          {isListening ? (
            <MicOff className="w-5 h-5" />
          ) : isTranscribing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            isListening 
              ? t("chat.listening", "Listening to your voice... Tap mic to transcribe") 
              : isTranscribing
              ? t("chat.transcribing", "Gnani Prisma is transcribing your speech...")
              : t("chat.placeholder", "Ask Symvella about symptoms, pain, cycles, or nutrition...")
          }
          className="flex-1 bg-gray-50 border border-gray-200 focus:border-[var(--color-primary)] focus:bg-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none transition-colors"
        />

        {/* Send Button */}
        <button
          onClick={() => handleSend()}
          disabled={!inputVal.trim() || isTranscribing}
          className="p-3 rounded-2xl bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-40 text-white shadow-sm transition-transform active:scale-95 cursor-pointer"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
