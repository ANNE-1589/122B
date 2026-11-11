import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCircle,
  Mail,
  Phone,
  Shield,
  Award,
  BookOpen,
  Heart,
  Save,
  Clock,
  Sparkles,
  Camera,
  CheckCircle2,
  Bell,
} from 'lucide-react';
import { getRoleNameInVietnamese } from '../../context/AppContext';

export const ProfileView: React.FC = () => {
  const { currentUser, setCurrentUser, activityLogs, addToast, settings } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    bio: currentUser.bio || '',
    motto: currentUser.motto || '',
    phone: currentUser.phone || '',
    favoriteSubjects: currentUser.favoriteSubjects?.join(', ') || '',
    hobbies: currentUser.hobbies?.join(', ') || '',
    avatar: currentUser.avatar || '',
  });

  const [emailNotif, setEmailNotif] = useState(true);
  const [scheduleNotif, setScheduleNotif] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
      motto: formData.motto,
      phone: formData.phone,
      favoriteSubjects: formData.favoriteSubjects
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      hobbies: formData.hobbies
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      avatar: formData.avatar,
    });
    addToast('Đã lưu thông tin hồ sơ cá nhân thành công!');
  };

  const userLogs = activityLogs.filter((log) => log.userId === currentUser.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative">
            <img
              src={currentUser.avatar || '/src/assets/images/class_hero_cover_1794386143480.jpg'}
              alt={currentUser.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-[#7AAED6]/20 shadow-md"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span className="text-xs font-bold text-[#172B4D] px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                {currentUser.position}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {getRoleNameInVietnamese(currentUser.role)}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 truncate">
              {currentUser.name}
            </h1>

            <p className="text-xs text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-4">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {currentUser.email}
              </span>
              <span>Lớp {settings.className} – THPT Phan Bội Châu</span>
            </p>

            {currentUser.motto && (
              <p className="text-xs text-slate-600 italic bg-[#F8F7F2] p-3 rounded-xl border border-slate-100 mt-4 leading-relaxed">
                "{currentUser.motto}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Settings Form */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h2 className="text-base font-bold text-[#172B4D]">
              Chỉnh Sửa Thông Tin Cá Nhân
            </h2>
            <p className="text-xs text-slate-500">
              Cập nhật thông tin hiển thị trên danh sách thành viên lớp
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Họ và tên hiển thị *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#7AAED6]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Địa chỉ Email liên hệ *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#7AAED6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Số điện thoại (Tùy chọn)
              </label>
              <input
                type="text"
                placeholder="0912 xxx xxx"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ảnh đại diện (URL)
              </label>
              <input
                type="text"
                placeholder="Đường dẫn ảnh đại diện..."
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full px-3.5 py-2.5 border rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Châm ngôn sống (Motto của bạn)
            </label>
            <input
              type="text"
              placeholder="Châm ngôn yêu thích của bạn..."
              value={formData.motto}
              onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
              className="w-full px-3.5 py-2.5 border rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Môn học yêu thích (ngăn cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                placeholder="Toán, Tiếng Anh, Tin học..."
                value={formData.favoriteSubjects}
                onChange={(e) =>
                  setFormData({ ...formData, favoriteSubjects: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sở thích cá nhân (ngăn cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                placeholder="Bóng rổ, Đọc sách, Âm nhạc..."
                value={formData.hobbies}
                onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                className="w-full px-3.5 py-2.5 border rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Giới thiệu bản thân
            </label>
            <textarea
              rows={3}
              placeholder="Chia sẻ về tính cách, mục tiêu trường đại học kỳ vọng..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 border rounded-xl leading-relaxed"
            />
          </div>

          {/* Preferences */}
          <div className="pt-4 border-t space-y-3">
            <span className="font-bold text-slate-800 block">
              Tùy chọn thông báo hệ thống
            </span>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scheduleNotif}
                  onChange={(e) => setScheduleNotif(e.target.checked)}
                  className="rounded text-[#172B4D]"
                />
                <span className="text-slate-700">
                  Nhận thông báo khi có thay đổi thời khóa biểu hoặc phòng học
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  className="rounded text-[#172B4D]"
                />
                <span className="text-slate-700">
                  Nhắc nhở hạn nộp bài tập và các sự kiện ngoại khóa
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#172B4D] text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm hover:bg-[#172B4D]/90 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Lưu thay đổi hồ sơ</span>
            </button>
          </div>
        </form>
      </div>

      {/* Activity History Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-bold text-[#172B4D] mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#F2A65A]" />
          Lịch Sử Hoạt Động Của Bạn
        </h2>

        <div className="space-y-3">
          {userLogs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
            >
              <div>
                <span className="font-medium text-slate-900 block">{log.action}</span>
                <span className="text-[10px] text-slate-400">Danh mục: {log.category}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{log.timestamp}</span>
            </div>
          ))}

          {userLogs.length === 0 && (
            <p className="text-xs text-slate-400 italic py-4 text-center">
              Chưa có lịch sử hoạt động nào được ghi nhận cho tài khoản này.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
