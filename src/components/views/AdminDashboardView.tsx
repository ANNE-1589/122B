import React, { useState } from 'react';
import { useApp, getRoleNameInVietnamese } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Users,
  Settings,
  Bell,
  Sparkles,
  BookOpen,
  Camera,
  Activity,
  Save,
  RotateCcw,
  CheckCircle2,
  Lock,
  UserPlus,
  AlertTriangle,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    users,
    updateUserRole,
    students,
    announcements,
    events,
    documents,
    albums,
    activityLogs,
    settings,
    updateSettings,
    resetToDefaults,
    currentUser,
    switchRole,
    addToast,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'users' | 'settings' | 'logs'>('overview');

  // Settings form
  const [settingsForm, setSettingsForm] = useState({
    graduationDate: settings.graduationDate,
    schoolName: settings.schoolName,
    className: settings.className,
    academicYear: settings.academicYear,
    classSlogan: settings.classSlogan,
    advisorName: settings.advisorName,
  });

  const isSuperAdmin = currentUser.role === 'super_admin';
  const isClassAdmin = currentUser.role === 'class_admin' || isSuperAdmin;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
  };

  const rolesAvailable: { role: UserRole; label: string }[] = [
    { role: 'super_admin', label: 'Super Admin' },
    { role: 'class_admin', label: 'Cán Sự Lớp' },
    { role: 'teacher', label: 'Giáo Viên' },
    { role: 'student', label: 'Học Sinh' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-[#172B4D] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#172B4D]" />
            Trung Tâm Quản Trị Hệ Thống 12/2B
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Bảng điều khiển phân quyền người dùng, cấu hình niên khóa và giám sát hoạt động
          </p>
        </div>

        {/* Admin Subtabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeAdminTab === 'overview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeAdminTab === 'users'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tài khoản & Phân quyền
          </button>
          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeAdminTab === 'settings'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cài đặt lớp
          </button>
          <button
            onClick={() => setActiveAdminTab('logs')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeAdminTab === 'logs'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Nhật ký hoạt động
          </button>
        </div>
      </div>

      {/* RBAC Notice Banner */}
      {!isSuperAdmin && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-amber-900">
              Bạn đang ở chế độ xem với vai trò: {getRoleNameInVietnamese(currentUser.role)}
            </span>
            <p className="text-amber-800 mt-0.5">
              Để quản lý đầy đủ các quyền hạn quản trị viên cao cấp, bạn có thể chuyển vai trò sang <strong>Super Admin</strong> trên thanh điều hướng phía trên.
            </p>
          </div>
        </div>
      )}

      {/* SUBTAB 1: OVERVIEW METRICS */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Tài khoản
              </span>
              <div className="text-2xl font-bold font-mono text-[#172B4D] mt-1">
                {users.length}
              </div>
              <span className="text-[10px] text-slate-400">Đã đăng ký</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Học sinh
              </span>
              <div className="text-2xl font-bold font-mono text-[#172B4D] mt-1">
                {students.length}
              </div>
              <span className="text-[10px] text-slate-400">Hồ sơ lớp</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Thông báo
              </span>
              <div className="text-2xl font-bold font-mono text-[#172B4D] mt-1">
                {announcements.length}
              </div>
              <span className="text-[10px] text-emerald-600">Đang hiển thị</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Sự kiện
              </span>
              <div className="text-2xl font-bold font-mono text-[#172B4D] mt-1">
                {events.length}
              </div>
              <span className="text-[10px] text-slate-400">Trong năm học</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Tài liệu
              </span>
              <div className="text-2xl font-bold font-mono text-[#172B4D] mt-1">
                {documents.length}
              </div>
              <span className="text-[10px] text-slate-400">File học tập</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Album ảnh
              </span>
              <div className="text-2xl font-bold font-mono text-[#172B4D] mt-1">
                {albums.length}
              </div>
              <span className="text-[10px] text-slate-400">Kỷ yếu lưu niệm</span>
            </div>
          </div>

          {/* Quick Role Capabilities Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#172B4D] mb-4 uppercase tracking-wider">
              Bảng Phân Quyền Vai Trò Hệ Thống (RBAC Matrix)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/70">
                    <th className="p-3">Tính năng / Quyền hạn</th>
                    <th className="p-3">Super Admin</th>
                    <th className="p-3">Class Admin</th>
                    <th className="p-3">Giáo Viên</th>
                    <th className="p-3">Học Sinh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-medium text-slate-900">Xem nội dung lớp</td>
                    <td className="p-3 text-emerald-600 font-bold">Toàn quyền</td>
                    <td className="p-3 text-emerald-600 font-bold">Toàn quyền</td>
                    <td className="p-3 text-emerald-600 font-bold">Toàn quyền</td>
                    <td className="p-3 text-emerald-600 font-bold">Đầy đủ</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-900">Đăng / Duyệt thông báo</td>
                    <td className="p-3 text-emerald-600 font-bold">Có</td>
                    <td className="p-3 text-emerald-600 font-bold">Có</td>
                    <td className="p-3 text-emerald-600 font-bold">Có</td>
                    <td className="p-3 text-slate-400">Chỉ đọc</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-900">Điều chỉnh Thời khóa biểu</td>
                    <td className="p-3 text-emerald-600 font-bold">Có</td>
                    <td className="p-3 text-emerald-600 font-bold">Có</td>
                    <td className="p-3 text-emerald-600 font-bold">Có</td>
                    <td className="p-3 text-slate-400">Chỉ đọc</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-900">Giao bài tập & Tải tài liệu</td>
                    <td className="p-3 text-emerald-600 font-bold">Có</td>
                    <td className="p-3 text-emerald-600 font-bold">Có</td>
                    <td className="p-3 text-emerald-600 font-bold">Có</td>
                    <td className="p-3 text-slate-600">Đánh dấu hoàn thành</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-900">Tạo & Khóa cuộc bình chọn</td>
                    <td className="p-3 text-emerald-600 font-bold">Có</td>
                    <td className="p-3 text-emerald-600 font-bold">Có</td>
                    <td className="p-3 text-emerald-600 font-bold">Có</td>
                    <td className="p-3 text-slate-600">Bỏ phiếu</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-900">Cấu hình hệ thống & Phân quyền user</td>
                    <td className="p-3 text-emerald-600 font-bold">Duy nhất</td>
                    <td className="p-3 text-slate-400">Không</td>
                    <td className="p-3 text-slate-400">Không</td>
                    <td className="p-3 text-slate-400">Không</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: USER & ROLE MANAGEMENT */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#172B4D]">
                Quản Lý Tài Khoản & Phân Quyền
              </h2>
              <p className="text-xs text-slate-500">
                Chỉ định vai trò Super Admin, Class Admin, Giáo Viên hoặc Học Sinh
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                  <th className="p-3">Họ và tên</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Chức vụ lớp</th>
                  <th className="p-3">Vai trò phân quyền</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#172B4D] text-white flex items-center justify-center text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <span>{user.name}</span>
                    </td>
                    <td className="p-3 text-slate-500">{user.email}</td>
                    <td className="p-3 text-slate-700 font-medium">{user.position}</td>
                    <td className="p-3">
                      <span className="font-semibold text-[#172B4D]">
                        {getRoleNameInVietnamese(user.role)}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {isSuperAdmin ? (
                        <select
                          value={user.role}
                          onChange={(e) =>
                            updateUserRole(user.id, e.target.value as UserRole)
                          }
                          className="px-2.5 py-1 text-xs border rounded-lg bg-white"
                        >
                          {rolesAvailable.map((r) => (
                            <option key={r.role} value={r.role}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-slate-400 italic">Cần quyền Super Admin</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: SETTINGS CONFIGURATION */}
      {activeAdminTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#172B4D]">
              Cấu Hình Hệ Thống Lớp Học
            </h2>
            <p className="text-xs text-slate-500">
              Thay đổi ngày tốt nghiệp (đếm ngược), khẩu hiệu và tên trường
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Thời điểm Lễ Tốt Nghiệp THPT (Đếm ngược Trang chủ) *
              </label>
              <input
                type="datetime-local"
                value={settingsForm.graduationDate.slice(0, 16)}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, graduationDate: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border rounded-xl"
                disabled={!isSuperAdmin}
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Thay đổi tại đây sẽ cập nhật trực tiếp đồng hồ đếm ngược trên Trang chủ.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên trường
                </label>
                <input
                  type="text"
                  value={settingsForm.schoolName}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, schoolName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 border rounded-xl"
                  disabled={!isSuperAdmin}
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên lớp
                </label>
                <input
                  type="text"
                  value={settingsForm.className}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, className: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 border rounded-xl"
                  disabled={!isSuperAdmin}
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Giáo viên chủ nhiệm
              </label>
              <input
                type="text"
                value={settingsForm.advisorName}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, advisorName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border rounded-xl"
                disabled={!isSuperAdmin}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Khẩu hiệu lớp (Slogan)
              </label>
              <input
                type="text"
                value={settingsForm.classSlogan}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, classSlogan: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border rounded-xl"
                disabled={!isSuperAdmin}
              />
            </div>

            {isSuperAdmin && (
              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#172B4D] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#172B4D]/90 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu cài đặt</span>
                </button>
              </div>
            )}
          </form>

          {/* Reset Database to Defaults */}
          {isSuperAdmin && (
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-xs font-bold text-rose-700 uppercase mb-1">
                Khu vực khôi phục dữ liệu
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Xóa tất cả các thay đổi cục bộ và khôi phục về trạng thái dữ liệu mẫu mặc định ban đầu của lớp 12/2B.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Khôi phục dữ liệu ban đầu cho toàn bộ hệ thống lớp 12/2B?')) {
                    resetToDefaults();
                  }
                }}
                className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục dữ liệu mặc định</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 4: ACTIVITY LOGS */}
      {activeAdminTab === 'logs' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#172B4D]">
                Nhật Ký Hoạt Động & Kiểm Toán Hệ Thống
              </h2>
              <p className="text-xs text-slate-500">
                Ghi lại các thao tác thay đổi dữ liệu, thông báo và bình chọn
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {activityLogs.length} bản ghi
            </span>
          </div>

          <div className="space-y-2">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium text-[10px]">
                    {log.category}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900">{log.userName}: </span>
                    <span className="text-slate-700">{log.action}</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0 ml-3">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
