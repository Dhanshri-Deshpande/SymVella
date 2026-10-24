import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import SOSModal from "./components/SOSModal";
import FloatingChatbot from "./components/FloatingChatbot";
import DailyReportModal from "./components/DailyReportModal";
import PeriodDateModal from "./components/PeriodDateModal";
import AuthModal from "./views/AuthModal";

import HomeDashboard from "./views/HomeDashboard";
import CheckInModal from "./views/CheckInModal";
import ReportsView from "./views/ReportsView";
import InfoHubView from "./views/InfoHubView";
import SettingsView from "./views/SettingsView";

function MainContent() {
  const { 
    activeTab, 
    isDailyReportOpen, 
    setIsDailyReportOpen, 
    dailyReportData,
    isAuthenticated,
    isAuthModalOpen,
    setIsAuthModalOpen
  } = useApp();

  // 1. If not authenticated, open the Login / Sign Up screen FIRST
  if (!isAuthenticated) {
    return (
      <AuthModal 
        isOpen={true} 
        isFullScreen={true}
      />
    );
  }

  // 2. Once authenticated, go DIRECTLY to Homepage Dashboard!
  return (
    <div className="min-h-screen bg-[var(--color-bg-soft)] text-[var(--color-text-main)]">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-28">
        {activeTab === "home" && <HomeDashboard />}
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
      <SOSModal />
      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen}
          isFullScreen={false}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
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
