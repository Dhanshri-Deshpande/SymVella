import React from "react";
import { useApp } from "../context/AppContext";
import { SYMVELLA_LANGUAGES } from "../data/botKnowledge";
import { 
  Heart, 
  ShieldAlert, 
  Globe
} from "lucide-react";

export default function Navbar() {
  const { 
    language, 
    setLanguage, 
    setIsSOSOpen,
    setActiveTab,
    activeTab,
    t
  } = useApp();

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[var(--color-border)] shadow-xs no-print">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2">
          
          {/* Logo & Subtitle */}
          <button 
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-2.5 sm:gap-3 text-left group min-w-0"
          >
            <img 
              src="/logo.png" 
              alt="Symvella" 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform border border-purple-100 bg-white shrink-0" 
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-[var(--color-primary-dark)]">
                  Sym<span className="text-[var(--color-primary)]">vella</span>
                </h1>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-[var(--color-badge-bg)] text-[var(--color-primary)] uppercase tracking-wide shrink-0">
                  {t("nav.brand_sub", "Women's Health")}
                </span>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] hidden sm:block truncate">
                {t("nav.tagline", "Multilingual Clinical Companion & Cycle Intelligence")}
              </p>
            </div>
          </button>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Language Selector */}
            <div className="flex items-center bg-[var(--color-badge-bg)] border border-[var(--color-border)] rounded-xl px-2 py-1 gap-1 text-xs text-gray-700">
              <Globe className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent font-medium focus:outline-none cursor-pointer text-[var(--color-primary-dark)] text-xs"
              >
                {SYMVELLA_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.native}</option>
                ))}
              </select>
            </div>

            {/* SOS Emergency Button */}
            <button
              onClick={() => setIsSOSOpen(true)}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-transform active:scale-95 animate-soft-pulse shrink-0 cursor-pointer"
              title={t("nav.sos", "Emergency SOS Red-Flag")}
            >
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{t("nav.sos", "SOS")}</span>
            </button>

          </div>
        </div>
      </header>
    </>
  );
}
