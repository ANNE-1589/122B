import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Menu,
  X,
  Shield,
  GraduationCap,
  Sparkles,
  ChevronDown,
  Check,
  Calendar,
  BookOpen,
  Image as ImageIcon,
  Vote,
  UserCheck,
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  isMobileMenuOpen,
}) => {
  const {
    currentUser,
    switchRole,
    activeTab,
    setActiveTab,
    announcements,
    markAnnouncementAsRead,
    settings,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadAnnouncements = announcements.filter(
    (a) => !a.readByUsers.includes(currentUser.id)
  );

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'home':
        return 'Trang chủ';
      case 'students':
        return 'Thành viên lớp';
      case 'schedule':
        return 'Thời khóa biểu';
      case 'study':
        return 'Học tập & Tài liệu';
      case 'announcements':
        return 'Bảng thông báo';
      case 'events':
        return 'Hoạt động & Sự kiện';
      case 'memories':
        return 'Góc kỷ niệm';
      case 'polls':
        return 'Bình chọn lớp';
      case 'profile':
        return 'Hồ sơ cá nhân';
      case 'admin':
        return 'Quản trị hệ thống';
      default:
        return '12/2B';
    }
  };

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'super_admin', label: 'Super Admin', desc: 'Toàn quyền quản trị & phân quyền' },
    { role: 'class_admin', label: 'Ban Cán Sự', desc: 'Quản lý thông báo, sự kiện, ảnh' },
    { role: 'teacher', label: 'Giáo Viên (GVCN)', desc: 'Đăng học vụ, tài liệu học tập' },
    { role: 'student', label: 'Học Sinh', desc: 'Xem bài tập, tham gia bình chọn' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Class Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div
            onClick={() => setActiveTab('home')}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#172B4D] text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:bg-[#7AAED6] transition-colors">
              12/2B
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#172B4D] text-base sm:text-lg tracking-tight">
                  OUR LAST CHAPTER
                </span>
                <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {settings.academicYear}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                THPT Phan Bội Châu
              </div>
            </div>
          </div>
        </div>

        {/* Center: Current Page Title (Desktop) */}
        <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
          <span className="w-2 h-2 rounded-full bg-[#F2A65A]"></span>
          <span>{getPageTitle(activeTab)}</span>
        </div>

        {/* Right: Role Switcher, Notification, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
              title="Chuyển đổi vai trò để thử nghiệm phân quyền"
            >
              <Shield className="w-3.5 h-3.5 text-[#F2A65A]" />
              <span className="hidden sm:inline">Vai trò:</span>
              <span className="font-semibold text-[#172B4D]">
                {currentUser.role === 'super_admin'
                  ? 'Admin'
                  : currentUser.role === 'class_admin'
                  ? 'Cán sự'
                  : currentUser.role === 'teacher'
                  ? 'Giáo viên'
                  : 'Học sinh'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Chuyển quyền thử nghiệm (RBAC)
                </div>
                {rolesList.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => {
                      switchRole(item.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      currentUser.role === item.role ? 'bg-blue-50 text-[#172B4D] font-bold' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-900">{item.label}</div>
                      <div className="text-[11px] text-slate-500">{item.desc}</div>
                    </div>
                    {currentUser.role === item.role && (
                      <Check className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowRoleMenu(false);
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Thông báo"
            >
              <Bell className="w-5 h-5" />
              {unreadAnnouncements.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-700">Thông báo mới nhất</div>
                  <span className="text-[11px] text-slate-500">
                    {unreadAnnouncements.length} chưa đọc
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {announcements.slice(0, 5).map((anc) => {
                    const isUnread = !anc.readByUsers.includes(currentUser.id);
                    return (
                      <div
                        key={anc.id}
                        onClick={() => {
                          markAnnouncementAsRead(anc.id);
                          setActiveTab('announcements');
                          setShowNotifMenu(false);
                        }}
                        className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                          isUnread ? 'bg-amber-50/40' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-900 truncate max-w-[200px]">
                            {anc.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{anc.date}</span>
                        </div>
                        <p className="text-slate-600 line-clamp-2 leading-relaxed">
                          {anc.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="p-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setActiveTab('announcements');
                      setShowNotifMenu(false);
                    }}
                    className="text-xs font-semibold text-[#172B4D] hover:underline"
                  >
                    Xem tất cả thông báo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Trigger */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <img
              src={currentUser.avatar || '/src/assets/images/class_hero_cover_1794386143480.jpg'}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-xs"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="hidden sm:block text-left pr-1">
              <div className="text-xs font-bold text-slate-900 max-w-[120px] truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500">{currentUser.position}</div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
