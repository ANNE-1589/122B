import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AnnouncementCategory,
  PriorityLevel,
  Announcement,
} from '../../types';
import {
  Bell,
  Search,
  Filter,
  Plus,
  Pin,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  X,
  Share2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  const {
    announcements,
    addAnnouncement,
    togglePinAnnouncement,
    markAnnouncementAsRead,
    deleteAnnouncement,
    currentUser,
    addToast,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // New Announcement Form State
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Chung' as AnnouncementCategory,
    priority: 'Bình thường' as PriorityLevel,
    isPinned: false,
    imageUrl: '',
  });

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'Khẩn cấp', label: 'Khẩn cấp' },
    { key: 'Học tập', label: 'Học tập' },
    { key: 'Lịch học', label: 'Lịch học' },
    { key: 'Sự kiện', label: 'Sự kiện' },
    { key: 'Chung', label: 'Thông báo chung' },
  ];

  const filteredAnnouncements = announcements
    .filter((anc) => {
      const matchCat =
        selectedCategory === 'all' || anc.category === selectedCategory;
      const matchSearch =
        anc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anc.content.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      // Pinned first, then by date descending
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.date.localeCompare(a.date);
    });

  const canManage =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'class_admin' ||
    currentUser.role === 'teacher';

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    addAnnouncement({
      title: form.title,
      content: form.content,
      author: currentUser.name,
      authorRole: currentUser.position,
      authorAvatar: currentUser.avatar || '',
      category: form.category,
      priority: form.priority,
      isPinned: form.isPinned,
      imageUrl: form.imageUrl || undefined,
    });

    setIsCreating(false);
    setForm({
      title: '',
      content: '',
      category: 'Chung',
      priority: 'Bình thường',
      isPinned: false,
      imageUrl: '',
    });
  };

  const getPriorityStyle = (priority: PriorityLevel) => {
    switch (priority) {
      case 'Khẩn cấp':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Quan trọng':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-[#172B4D] flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#172B4D]" />
            Bảng Thông Báo Lớp 12/2B
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cập nhật tin tức học vụ, lịch sinh hoạt và các quyết định quan trọng của tập thể
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 rounded-xl bg-[#172B4D] text-white hover:bg-[#172B4D]/90 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng thông báo mới</span>
          </button>
        )}
      </div>

      {/* Search & Category Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm thông báo theo tiêu đề hoặc nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7AAED6]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-[#172B4D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((anc) => {
          const isRead = anc.readByUsers.includes(currentUser.id);

          return (
            <div
              key={anc.id}
              onClick={() => markAnnouncementAsRead(anc.id)}
              className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all shadow-xs ${
                anc.isPinned
                  ? 'border-amber-300 bg-gradient-to-r from-amber-50/20 via-white to-white'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getPriorityStyle(
                      anc.priority
                    )}`}
                  >
                    {anc.priority}
                  </span>
                  <span className="text-xs font-semibold text-[#172B4D]">
                    {anc.category}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-400">{anc.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  {anc.isPinned && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Pin className="w-3 h-3 fill-amber-700" />
                      Đã ghim
                    </span>
                  )}

                  {canManage && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinAnnouncement(anc.id);
                        }}
                        className="p-1 text-slate-400 hover:text-amber-600 rounded-md"
                        title={anc.isPinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Xóa thông báo "${anc.title}"?`)) {
                            deleteAnnouncement(anc.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Content */}
              <h2 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                {anc.title}
              </h2>

              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line mb-4">
                {anc.content}
              </p>

              {/* Optional Image */}
              {anc.imageUrl && (
                <div className="mb-4 rounded-xl overflow-hidden max-h-72 border border-slate-100">
                  <img
                    src={anc.imageUrl}
                    alt={anc.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Author & Footer info */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#172B4D] text-white text-[10px] font-bold flex items-center justify-center">
                    {anc.author.charAt(0)}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">{anc.author}</span>
                    <span className="text-[11px] text-slate-400"> ({anc.authorRole})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isRead ? (
                    <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đã đọc
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-600 font-medium">
                      Chưa đọc
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">
              Không có thông báo nào trong danh mục được chọn.
            </p>
          </div>
        )}
      </div>

      {/* CREATE ANNOUNCEMENT MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div>
                <h2 className="text-base font-bold text-[#172B4D]">
                  Đăng Thông Báo Mới
                </h2>
                <p className="text-xs text-slate-500">
                  Thông báo sẽ được gửi đến tất cả thành viên lớp 12/2B
                </p>
              </div>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tiêu đề thông báo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Kế hoạch tổ chức sinh hoạt chủ điểm tháng 11..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Danh mục
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as AnnouncementCategory })
                    }
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Chung">Thông báo chung</option>
                    <option value="Học tập">Học tập</option>
                    <option value="Lịch học">Lịch học</option>
                    <option value="Sự kiện">Sự kiện</option>
                    <option value="Khẩn cấp">Khẩn cấp</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Độ ưu tiên
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value as PriorityLevel })
                    }
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Bình thường">Bình thường</option>
                    <option value="Quan trọng">Quan trọng</option>
                    <option value="Khẩn cấp">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nội dung thông báo *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Viết đầy đủ chi tiết thời gian, địa điểm, yêu cầu đối với các bạn trong lớp..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ảnh đính kèm (URL)
                </label>
                <input
                  type="text"
                  placeholder="Nhập link ảnh minh họa hoặc chọn ảnh lớp..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={form.isPinned}
                  onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                  className="rounded text-[#172B4D] focus:ring-[#7AAED6]"
                />
                <label htmlFor="pinCheck" className="text-slate-700 font-medium">
                  Ghim thông báo này lên đầu bảng tin
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#172B4D] text-white rounded-xl font-semibold shadow-xs hover:bg-[#172B4D]/90"
                >
                  Đăng thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
