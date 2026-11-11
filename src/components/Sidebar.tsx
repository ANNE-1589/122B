import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Users,
  Calendar,
  BookOpen,
  Bell,
  Sparkles,
  Camera,
  Vote,
  UserCircle,
  ShieldCheck,
  Heart,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    announcements,
    currentUser,
    events,
    polls,
    settings,
  } = useApp();

  const unreadCount = announcements.filter(
    (a) => !a.readByUsers.includes(currentUser.id)
  ).length;

  const activePollsCount = polls.filter((p) => !p.isClosed).length;
  const upcomingEventsCount = events.length;

  const navigationItems = [
    {
      id: 'home',
      name: 'Trang chủ',
      icon: Home,
      badge: null,
    },
    {
      id: 'students',
      name: 'Thành viên 12/2B',
      icon: Users,
      badge: '40+',
    },
    {
      id: 'schedule',
      name: 'Thời khóa biểu',
      icon: Calendar,
      badge: 'Tuần này',
    },
    {
      id: 'study',
      name: 'Học tập & Tài liệu',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'announcements',
      name: 'Thông báo lớp',
      icon: Bell,
      badge: unreadCount > 0 ? `${unreadCount} mới` : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'events',
      name: 'Hoạt động & Sự kiện',
      icon: Sparkles,
      badge: `${upcomingEventsCount}`,
    },
    {
      id: 'memories',
      name: 'Góc kỷ niệm',
      icon: Camera,
      badge: 'Kỷ yếu',
    },
    {
      id: 'polls',
      name: 'Bình chọn lớp',
      icon: Vote,
      badge: activePollsCount > 0 ? `${activePollsCount} đang mở` : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'profile',
      name: 'Hồ sơ cá nhân',
      icon: UserCircle,
      badge: null,
    },
    {
      id: 'admin',
      name: 'Quản trị hệ thống',
      icon: ShieldCheck,
      badge: currentUser.role === 'super_admin' ? 'Admin' : null,
      badgeColor: 'bg-[#172B4D] text-white',
    },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Không gian lớp học
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#172B4D] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#F2A65A]' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.badgeColor
                          ? item.badgeColor
                          : isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Class Card / Quote */}
        <div className="p-3 border-t border-slate-100 bg-[#F8F7F2]/60">
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-[#172B4D]">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>12/2B THPT Phan Bội Châu</span>
            </div>
            <p className="text-[11px] text-slate-500 italic leading-relaxed">
              "{settings.classSlogan}"
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
