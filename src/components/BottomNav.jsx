import React from "react";
import { useApp } from "../context/AppContext";
import { 
  Home, 
  FileText, 
  BookOpen,
  Settings 
} from "lucide-react";

export default function BottomNav() {
  const { activeTab, setActiveTab, t } = useApp();

  const tabs = [
    { id: "home", label: t("bottom_nav.home", "Dashboard"), icon: Home },
    { id: "reports", label: t("bottom_nav.reports", "Reports"), icon: FileText },
    { id: "info", label: t("bottom_nav.info", "Info Hub"), icon: BookOpen },
    { id: "settings", label: t("bottom_nav.settings", "Settings"), icon: Settings }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[var(--color-border)] shadow-lg no-print">
      <div className="max-w-xl mx-auto px-6 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "text-[var(--color-primary)] font-bold scale-105"
                  : "text-gray-400 hover:text-gray-600 font-medium"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] tracking-tight">{tab.label}</span>
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
