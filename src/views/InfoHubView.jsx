import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  INFO_HUB_ARTICLES, 
  MYTH_FACTS, 
  RECOMMENDED_BOOKS, 
  GOVERNMENT_HEALTH_SCHEMES 
} from "../data/healthKnowledge";
import { 
  BookOpen, 
  Search, 
  Volume2, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  BookMarked, 
  Landmark, 
  FileText, 
  Star, 
  ExternalLink, 
  HelpCircle,
  Phone,
  CheckCircle2,
  ChevronRight,
  Download
} from "lucide-react";

export default function InfoHubView() {
  const { speakText, language, t } = useApp();
  
  // 3 Primary Tabs in Info Hub
  const [hubTab, setHubTab] = useState("articles"); // "articles", "books", "schemes"
  
  // Search state across all resources
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticleCategory, setSelectedArticleCategory] = useState("all");
  
  // Modals for deep-dive
  const [activeArticle, setActiveArticle] = useState(null);
  const [activeBook, setActiveBook] = useState(null);
  const [activeScheme, setActiveScheme] = useState(null);

  // Filtered Articles
  const filteredArticles = INFO_HUB_ARTICLES.filter(art => {
    const matchesCat = selectedArticleCategory === "all" || art.category === selectedArticleCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          art.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filtered Books
  const filteredBooks = RECOMMENDED_BOOKS.filter(book => {
    return book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
           book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
           book.summary.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Filtered Schemes
  const filteredSchemes = GOVERNMENT_HEALTH_SCHEMES.filter(scheme => {
    return scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           scheme.financialBenefit.toLowerCase().includes(searchTerm.toLowerCase()) ||
           scheme.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
           scheme.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* View Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[var(--color-border)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-badge-bg)] text-[var(--color-primary)] flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">{t("info_hub.header_title", "Women's Health Knowledge & Resources")}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {t("info_hub.doctor_verified", "Doctor Verified")}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {t("info_hub.subtitle", "Medical articles, pregnancy & hormone books, and government maternity welfare schemes")}
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative mt-5">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("info_hub.search_placeholder", "Search pregnancy books, PCOS guides, PMMVY scheme, breast health, anemia...")}
            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none transition-colors"
          />
        </div>

        {/* 3 Dedicated Info Hub Tabs */}
        <div className="grid grid-cols-3 gap-2 mt-5 border-t border-gray-100 pt-4">
          <button
            onClick={() => setHubTab("articles")}
            className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
              hubTab === "articles"
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t("info_hub.tab_articles", "Clinical Articles")} ({INFO_HUB_ARTICLES.length})</span>
          </button>

          <button
            onClick={() => setHubTab("books")}
            className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
              hubTab === "books"
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>{t("info_hub.tab_books", "Recommended Books")} ({RECOMMENDED_BOOKS.length})</span>
          </button>

          <button
            onClick={() => setHubTab("schemes")}
            className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
              hubTab === "schemes"
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>{t("info_hub.tab_schemes", "Government Schemes")} ({GOVERNMENT_HEALTH_SCHEMES.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: WOMEN'S HEALTHCARE ARTICLES & MYTH BUSTERS */}
      {hubTab === "articles" && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Myth vs Fact Section */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> Myth Busters: What Women Are Told vs. Medical Science
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MYTH_FACTS.map((mf, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold shrink-0 mt-0.5">
                      MYTH
                    </span>
                    <p className="text-xs text-gray-700 italic font-medium">"{mf.myth}"</p>
                  </div>
                  <div className="flex items-start gap-2 pt-1 border-t border-gray-200">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0 mt-0.5">
                      FACT
                    </span>
                    <p className="text-xs text-gray-900 font-semibold">{mf.fact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Curated Medical Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map(art => (
              <div
                key={art.id}
                className="bg-white rounded-3xl p-6 shadow-xs border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-badge-bg)] text-[var(--color-primary-dark)]">
                      {art.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" /> {art.readTime}
                      </span>
                      <button
                        onClick={() => speakText(`${art.title}. ${art.summary}`, language)}
                        className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[var(--color-primary)] transition-colors"
                        title="Listen to summary"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                    {art.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    {art.summary}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-gray-400 border-t border-gray-100 pt-3 mb-3">
                    {art.reviewedBy}
                  </p>
                  <button
                    onClick={() => setActiveArticle(art)}
                    className="w-full py-2.5 rounded-xl bg-gray-50 hover:bg-[var(--color-badge-bg)] text-xs font-bold text-[var(--color-primary)] transition-colors text-center border border-gray-200"
                  >
                    Read Full Verified Guide
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: RECOMMENDED BOOKS FOR PREGNANCY & WOMEN'S HEALTH */}
      {hubTab === "books" && (
        <div className="space-y-5 animate-in fade-in">
          <div className="p-4 bg-[var(--color-badge-bg)] border border-[var(--color-border)] rounded-2xl text-xs text-[var(--color-primary-dark)] flex items-center justify-between">
            <span className="font-semibold">
              📚 Handpicked Reading Guides: Written by senior obstetricians, gynecologists & endocrinologists for pregnancy, PCOS & hormonal health.
            </span>
            <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded-lg border border-[var(--color-border)]">
              {filteredBooks.length} Books Curated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-6 shadow-xs border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-[var(--color-primary)] border border-purple-100">
                      {b.category}
                    </span>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {b.rating}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-xs text-[var(--color-primary-dark)] font-medium mt-0.5">
                    By {b.author}
                  </p>

                  <p className="text-xs text-gray-600 leading-relaxed mt-2.5 line-clamp-3">
                    {b.summary}
                  </p>

                  {/* Highlights Bullet points */}
                  <div className="mt-3.5 pt-3 border-t border-gray-100 space-y-1.5">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                      Core Topics Covered:
                    </span>
                    {b.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                      <p key={idx} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-mono">{b.pages}</span>
                  <button
                    onClick={() => setActiveBook(b)}
                    className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    View Key Takeaways <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GOVERNMENT HEALTHCARE SCHEMES & MATERNAL AID */}
      {hubTab === "schemes" && (
        <div className="space-y-5 animate-in fade-in">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-emerald-900 block">
                🏛️ Official Indian Government Healthcare Schemes for Women:
              </span>
              <span>Financial aid, free institutional delivery, free specialist scans, and cashless hospital insurance.</span>
            </div>
            <a
              href="tel:1075"
              className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 self-start sm:self-auto shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" /> National Helpline: 1075
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-3xl p-6 shadow-xs border border-[var(--color-border)] hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {scheme.category}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {scheme.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 leading-snug">
                    {scheme.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {scheme.ministry}
                  </p>

                  <div className="mt-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                      Direct Financial Benefit:
                    </span>
                    <p className="text-sm font-black text-emerald-900 mt-0.5">
                      {scheme.financialBenefit}
                    </p>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed mt-3">
                    {scheme.summary}
                  </p>

                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
                    <strong className="text-gray-800">Eligibility:</strong> {scheme.eligibility}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => speakText(`${scheme.name}. ${scheme.financialBenefit}. ${scheme.summary}`, language)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[var(--color-primary)] transition-colors flex items-center gap-1 text-xs"
                    title="Listen to scheme details"
                  >
                    <Volume2 className="w-4 h-4" /> Listen
                  </button>
                  <button
                    onClick={() => setActiveScheme(scheme)}
                    className="px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    How to Apply & Documents <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ARTICLE READER MODAL */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[var(--color-border)] animate-in fade-in my-auto max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-[var(--color-primary)] mb-1 block">
                  {activeArticle.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900">{activeArticle.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{activeArticle.reviewedBy}</p>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="prose prose-sm max-w-none text-gray-800 my-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {activeArticle.content}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => speakText(activeArticle.content.substring(0, 500), language)}
                className="px-4 py-2 rounded-xl bg-pink-50 text-[var(--color-primary)] font-medium text-xs flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" /> Listen to Explainer
              </button>
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 rounded-xl bg-gray-900 text-white font-medium text-xs hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOK TAKEAWAYS MODAL */}
      {activeBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-[var(--color-border)] animate-in fade-in my-auto max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-[var(--color-primary)] block mb-1">
                  📚 Recommended Reading • {activeBook.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900">{activeBook.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Author: <strong>{activeBook.author}</strong></p>
              </div>
              <button
                onClick={() => setActiveBook(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  "{activeBook.summary}"
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2.5">
                  Top Medical & Lifestyle Takeaways for You:
                </h4>
                <div className="space-y-2">
                  {activeBook.keyTakeaways.map((point, idx) => (
                    <div key={idx} className="p-3 bg-purple-50/50 rounded-xl border border-[var(--color-border)] flex items-start gap-2.5 text-xs text-gray-800">
                      <span className="font-bold text-[var(--color-primary)] font-mono">{idx + 1}.</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                <strong>Who should read this:</strong> {activeBook.targetAudience}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => speakText(`${activeBook.title} by ${activeBook.author}. ${activeBook.summary}`, language)}
                className="px-4 py-2 rounded-xl bg-pink-50 text-[var(--color-primary)] font-medium text-xs flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" /> Listen to Summary
              </button>
              <button
                onClick={() => setActiveBook(null)}
                className="px-5 py-2 rounded-xl bg-gray-900 text-white font-medium text-xs hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCHEME APPLICATION & DOCUMENTS MODAL */}
      {activeScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-emerald-300 animate-in fade-in my-auto max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-emerald-700 block mb-1">
                  🏛️ Government Maternity & Health Support
                </span>
                <h3 className="text-xl font-bold text-gray-900">{activeScheme.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{activeScheme.ministry}</p>
              </div>
              <button
                onClick={() => setActiveScheme(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Financial Assistance:</span>
                <p className="text-base font-black text-emerald-950 mt-0.5">{activeScheme.financialBenefit}</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
                  Benefit Breakdown / Installments:
                </h4>
                <div className="space-y-1.5">
                  {activeScheme.installments.map((inst, idx) => (
                    <div key={idx} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-800 flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{inst}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
                  Required Documents:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
                  {activeScheme.documentsRequired.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-[var(--color-border)] text-xs text-gray-800">
                <strong className="text-[var(--color-primary-dark)] block mb-1">How & Where to Apply:</strong>
                <p>{activeScheme.howToApply}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => speakText(`${activeScheme.name}. Benefit: ${activeScheme.financialBenefit}. How to apply: ${activeScheme.howToApply}`, language)}
                className="px-4 py-2 rounded-xl bg-pink-50 text-[var(--color-primary)] font-medium text-xs flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" /> Listen
              </button>
              <button
                onClick={() => setActiveScheme(null)}
                className="px-5 py-2 rounded-xl bg-gray-900 text-white font-medium text-xs hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
