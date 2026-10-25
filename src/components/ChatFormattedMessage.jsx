import React from "react";
import { AlertTriangle, Sparkles, CheckCircle2, HeartPulse, ChevronRight } from "lucide-react";

/**
 * Parses inline markdown: **bold**, *italic*, and `code`
 */
function renderInlineMarkdown(text) {
  if (!text) return null;

  // Split by **bold** first
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      const boldContent = part.slice(2, -2);
      return (
        <strong key={idx} className="font-bold text-gray-950">
          {boldContent}
        </strong>
      );
    }
    // Check for *italic*
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2 && !part.startsWith("**")) {
      return (
        <em key={idx} className="italic text-gray-800">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

/**
 * ChatFormattedMessage:
 * Transforms chatbot answers into readable, scannable, visually structured sections.
 * Automatically organizes:
 * - 💡 Quick Answer / Cause
 * - 🌿 What You Can Do / Action Steps / Remedies
 * - 🚨 When to See a Doctor / Red Flags
 * - Any standard markdown bullets or text
 */
export default function ChatFormattedMessage({ content, isUser = false }) {
  if (!content) return null;

  // If message is from user, render plain clean text
  if (isUser) {
    return <div className="whitespace-pre-wrap leading-relaxed">{content}</div>;
  }

  // Normalize line breaks
  const rawText = content.replace(/\r\n/g, "\n");
  const lines = rawText.split("\n");

  // Group lines into structured sections
  const sections = [];
  let currentSection = { type: "normal", lines: [] };

  const isDoctorAlertHeader = (line) => {
    const l = line.toLowerCase();
    return (
      line.includes("🚨") ||
      line.includes("⚠️") ||
      l.includes("when to see a doctor") ||
      l.includes("when to consult") ||
      l.includes("when to escalate") ||
      l.includes("doctor alert") ||
      l.includes("doctor consult") ||
      line.includes("डॉक्टर से कब मिलें") ||
      line.includes("आपातकालीन चेतावनी") ||
      line.includes("सावधानी") ||
      line.includes("डॉक्टरांचा सल्ला") ||
      line.includes("மருத்துவரை எப்போது அணுக")
    );
  };

  const isActionStepsHeader = (line) => {
    const l = line.toLowerCase();
    return (
      line.includes("🌿") ||
      line.includes("🧘") ||
      line.includes("🥗") ||
      line.includes("💊") ||
      line.includes("💨") ||
      line.includes("✨") ||
      line.includes("💧") ||
      l.includes("what you can do") ||
      l.includes("what to do") ||
      l.includes("action steps") ||
      l.includes("quick relief") ||
      l.includes("home remedies") ||
      l.includes("supportive steps") ||
      line.includes("राहत के उपाय") ||
      line.includes("घरेलू उपाय") ||
      line.includes("उपाय:") ||
      line.includes("வீட்டு வைத்தியம்") ||
      line.includes("घरगुती उपाय")
    );
  };

  const isQuickAnswerHeader = (line) => {
    const l = line.toLowerCase();
    return (
      line.includes("💡") ||
      line.includes("🌸") ||
      line.includes("🥚") ||
      line.includes("🩸") ||
      line.includes("🗓️") ||
      line.includes("🧠") ||
      l.includes("quick answer") ||
      l.includes("direct insight") ||
      l.includes("what's happening") ||
      line.includes("शरीर में क्या हो रहा") ||
      line.includes("कारण:") ||
      line.includes("मुख्य कारण")
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      if (currentSection.lines.length > 0) {
        sections.push(currentSection);
        currentSection = { type: "normal", lines: [] };
      }
      continue;
    }

    if (isDoctorAlertHeader(trimmed)) {
      if (currentSection.lines.length > 0) sections.push(currentSection);
      currentSection = { type: "doctor_alert", title: trimmed, lines: [] };
      continue;
    }

    if (isActionStepsHeader(trimmed) && !isDoctorAlertHeader(trimmed)) {
      if (currentSection.lines.length > 0) sections.push(currentSection);
      currentSection = { type: "action_steps", title: trimmed, lines: [] };
      continue;
    }

    if (isQuickAnswerHeader(trimmed) && !isDoctorAlertHeader(trimmed) && !isActionStepsHeader(trimmed)) {
      if (currentSection.lines.length > 0) sections.push(currentSection);
      currentSection = { type: "quick_answer", title: trimmed, lines: [] };
      continue;
    }

    currentSection.lines.push(trimmed);
  }

  if (currentSection.lines.length > 0) {
    sections.push(currentSection);
  }

  // Helper to render bullet points or text inside a section
  const renderLines = (itemLines) => {
    const listItems = [];
    const regularLines = [];

    itemLines.forEach((l) => {
      const bulletMatch = l.match(/^[•\-\*]\s*(.+)$/) || l.match(/^(\d+[\.\)])\s*(.+)$/);
      if (bulletMatch) {
        listItems.push(bulletMatch[2] || bulletMatch[1]);
      } else {
        regularLines.push(l);
      }
    });

    return (
      <div className="space-y-2">
        {regularLines.length > 0 && (
          <div className="space-y-1 text-gray-800 leading-relaxed">
            {regularLines.map((rl, rIdx) => (
              <p key={rIdx}>{renderInlineMarkdown(rl)}</p>
            ))}
          </div>
        )}
        {listItems.length > 0 && (
          <ul className="space-y-1.5 pt-0.5">
            {listItems.map((li, lIdx) => (
              <li key={lIdx} className="flex items-start gap-2 text-gray-800 leading-snug">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                <span className="flex-1">{renderInlineMarkdown(li)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3 text-xs sm:text-sm text-gray-800">
      {sections.map((sec, idx) => {
        // 1. Doctor Alert / Red Flag Section
        if (sec.type === "doctor_alert") {
          return (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1.5 shadow-2xs"
            >
              <div className="flex items-center gap-1.5 font-bold text-rose-900 text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{renderInlineMarkdown(sec.title)}</span>
              </div>
              <div className="space-y-1.5 pl-5 text-rose-900 text-xs sm:text-[13px]">
                {sec.lines.map((l, lIdx) => {
                  const cleaned = l.replace(/^[•\-\*]\s*/, "");
                  return (
                    <div key={lIdx} className="flex items-start gap-1.5 leading-snug">
                      <span className="text-rose-500 font-bold shrink-0">•</span>
                      <span>{renderInlineMarkdown(cleaned)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // 2. Action Steps / Remedies Section
        if (sec.type === "action_steps") {
          return (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2 shadow-2xs"
            >
              <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs sm:text-sm pb-1 border-b border-emerald-200/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{renderInlineMarkdown(sec.title)}</span>
              </div>
              <div className="space-y-1.5 text-gray-800 text-xs sm:text-[13px]">
                {sec.lines.map((l, lIdx) => {
                  const cleaned = l.replace(/^[•\-\*]\s*/, "").replace(/^(\d+[\.\)])\s*/, "");
                  return (
                    <div key={lIdx} className="flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                      <span className="flex-1">{renderInlineMarkdown(cleaned)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // 3. Quick Answer / Direct Insight Section
        if (sec.type === "quick_answer") {
          return (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-1.5 shadow-2xs"
            >
              <div className="flex items-center gap-1.5 font-bold text-purple-950 text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{renderInlineMarkdown(sec.title)}</span>
              </div>
              <div className="text-gray-800 text-xs sm:text-[13px] leading-relaxed">
                {sec.lines.map((l, lIdx) => (
                  <p key={lIdx} className="mb-1 last:mb-0">
                    {renderInlineMarkdown(l)}
                  </p>
                ))}
              </div>
            </div>
          );
        }

        // 4. Default / Normal Section (greetings, simple queries, etc.)
        return (
          <div key={idx} className="space-y-1 leading-relaxed">
            {renderLines(sec.lines)}
          </div>
        );
      })}
    </div>
  );
}
