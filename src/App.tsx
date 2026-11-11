import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';

// View modules
import { HomeView } from './components/views/HomeView';
import { OurClassView } from './components/views/OurClassView';
import { ScheduleView } from './components/views/ScheduleView';
import { StudyHubView } from './components/views/StudyHubView';
import { AnnouncementsView } from './components/views/AnnouncementsView';
import { EventsView } from './components/views/EventsView';
import { MemoryLaneView } from './components/views/MemoryLaneView';
import { PollsView } from './components/views/PollsView';
import { ProfileView } from './components/views/ProfileView';
import { AdminDashboardView } from './components/views/AdminDashboardView';

import {
  Home,
  Calendar,
  BookOpen,
  Camera,
  Menu,
  Heart,
  Sparkles,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, settings } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'students':
        return <OurClassView />;
      case 'schedule':
        return <ScheduleView />;
      case 'study':
        return <StudyHubView />;
      case 'announcements':
        return <AnnouncementsView />;
      case 'events':
        return <EventsView />;
      case 'memories':
        return <MemoryLaneView />;
      case 'polls':
        return <PollsView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminDashboardView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#252B36] flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 min-w-0 transition-all duration-200">
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto pb-24 lg:pb-12">
            {renderActiveView()}
          </div>

          {/* Footer as requested */}
          <footer className="mt-auto border-t border-slate-200/80 bg-white py-8 px-4 text-center text-xs text-slate-500">
            <div className="max-w-2xl mx-auto space-y-2">
              <div className="flex items-center justify-center gap-1.5 font-bold text-[#172B4D] text-sm">
                <span>12/2B – OUR LAST CHAPTER</span>
                <span className="text-slate-300">·</span>
                <span className="text-[#F2A65A]">THPT PHAN BỘI CHÂU</span>
                <span className="text-slate-300">·</span>
                <span>{settings.academicYear}</span>
              </div>
              <p className="italic text-slate-500">
                "Thanh xuân có thể khép lại, nhưng những kỷ niệm sẽ còn mãi."
              </p>
              <div className="text-[11px] text-slate-400 pt-1">
                Made with memories, built with friendship · Tập thể lớp 12/2B thân yêu
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Quick Navigation Bar for frequent features */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden px-3 py-2 flex items-center justify-around text-[10px] font-medium shadow-lg">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 p-1 transition-colors ${
            activeTab === 'home' ? 'text-[#172B4D] font-bold' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Trang chủ</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex flex-col items-center gap-1 p-1 transition-colors ${
            activeTab === 'schedule' ? 'text-[#172B4D] font-bold' : 'text-slate-500'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Lịch học</span>
        </button>

        <button
          onClick={() => setActiveTab('study')}
          className={`flex flex-col items-center gap-1 p-1 transition-colors ${
            activeTab === 'study' ? 'text-[#172B4D] font-bold' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Học tập</span>
        </button>

        <button
          onClick={() => setActiveTab('memories')}
          className={`flex flex-col items-center gap-1 p-1 transition-colors ${
            activeTab === 'memories' ? 'text-[#172B4D] font-bold' : 'text-slate-500'
          }`}
        >
          <Camera className="w-5 h-5" />
          <span>Kỷ niệm</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 p-1 text-slate-500 hover:text-slate-900"
        >
          <Menu className="w-5 h-5" />
          <span>Thêm</span>
        </button>
      </nav>

      {/* Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
