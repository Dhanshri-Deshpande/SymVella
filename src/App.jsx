import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import DiscreetModal from "./components/DiscreetModal";
import SOSModal from "./components/SOSModal";
import FloatingChatbot from "./components/FloatingChatbot";
import DailyReportModal from "./components/DailyReportModal";
import PeriodDateModal from "./components/PeriodDateModal";

import HomeDashboard from "./views/HomeDashboard";
import CheckInModal from "./views/CheckInModal";
import XAIInsights from "./views/XAIInsights";
import ReportsView from "./views/ReportsView";
import InfoHubView from "./views/InfoHubView";
import SettingsView from "./views/SettingsView";

function MainContent() {
  const { activeTab, isDailyReportOpen, setIsDailyReportOpen, dailyReportData } = useApp();

  return (
    <div className="min-h-screen bg-[var(--color-bg-soft)] text-[var(--color-text-main)]">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-28">
        {activeTab === "home" && <HomeDashboard />}
        {activeTab === "xai" && <XAIInsights />}
        {activeTab === "reports" && <ReportsView />}
        {activeTab === "info" && <InfoHubView />}
        {activeTab === "settings" && <SettingsView />}
      </main>

      <FloatingChatbot />
      <BottomNav />
      <CheckInModal />
      <PeriodDateModal />
      <DailyReportModal 
        reportData={dailyReportData}
        isOpen={isDailyReportOpen}
        onClose={() => setIsDailyReportOpen(false)}
      />
      <DiscreetModal />
      <SOSModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
