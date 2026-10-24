import React from "react";
import { useApp } from "../context/AppContext";
import { 
  Home, 
  ClipboardCheck, 
  BrainCircuit, 
  FileText, 
  BookOpen 
} from "lucide-react";

export default function BottomNav() {
  const { activeTab, setActiveTab, setIsCheckInOpen } = useApp();

  const tabs = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "xai", label: "XAI Insights", icon: BrainCircuit },
    { id: "checkin", label: "Log Day", icon: ClipboardCheck, isAction: true },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "info", label: "Info Hub", icon: BookOpen }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[var(--color-border)] shadow-lg no-print">
      <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                onClick={() => setIsCheckInOpen(true)}
                className="flex flex-col items-center justify-center -mt-6 transition-transform active:scale-95 group"
              >
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white shadow-lg flex items-center justify-center ring-4 ring-white group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold mt-1 text-[var(--color-primary)]">
                  Log Day
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? "text-[var(--color-primary)] font-bold scale-105"
                  : "text-gray-400 hover:text-gray-600 font-medium"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
