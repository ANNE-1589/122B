import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassEvent, EventCategory } from '../../types';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Plus,
  CheckCircle2,
  Trash2,
  X,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const EventsView: React.FC = () => {
  const { events, toggleEventRegistration, addEvent, deleteEvent, currentUser } =
    useApp();

  const [filterType, setFilterType] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<ClassEvent | null>(null);

  // New Event Form
  const [form, setForm] = useState({
    name: '',
    description: '',
    date: '2026-11-25',
    time: '08:00 - 11:30',
    location: 'Sân trường THPT Phan Bội Châu',
    organizer: 'Ban Cán Sự 12/2B',
    coverImage: '/src/assets/images/class_hero_cover_1794386143480.jpg',
    category: 'Hoạt động tập thể' as EventCategory,
    registrationDeadline: '2026-11-23',
  });

  const categories: EventCategory[] = [
    'Hoạt động học tập',
    'Văn nghệ',
    'Thể thao',
    'Hoạt động ngoại khóa',
    'Hoạt động tập thể',
    'Kỷ yếu và lễ trưởng thành',
  ];

  const nowStr = new Date().toISOString().slice(0, 10);

  const filteredEvents = events.filter((evt) => {
    const isPast = evt.date < nowStr;
    const matchType = filterType === 'past' ? isPast : !isPast;
    const matchCat =
      selectedCategory === 'all' || evt.category === selectedCategory;
    return matchType && matchCat;
  });

  const canManage =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'class_admin' ||
    currentUser.role === 'teacher';

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    addEvent({
      name: form.name,
      description: form.description,
      date: form.date,
      time: form.time,
      location: form.location,
      organizer: form.organizer,
      coverImage: form.coverImage,
      category: form.category,
      registrationDeadline: form.registrationDeadline,
    });

    setIsCreating(false);
    setForm({
      name: '',
      description: '',
      date: '2026-11-25',
      time: '08:00 - 11:30',
      location: 'Sân trường THPT Phan Bội Châu',
      organizer: 'Ban Cán Sự 12/2B',
      coverImage: '/src/assets/images/class_hero_cover_1794386143480.jpg',
      category: 'Hoạt động tập thể',
      registrationDeadline: '2026-11-23',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-[#172B4D] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#F2A65A]" />
            Hoạt Động & Sự Kiện 12/2B
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ghi danh tham gia các giải thể thao, hội thi văn nghệ, dã ngoại và lễ kỷ yếu
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 rounded-xl bg-[#172B4D] text-white hover:bg-[#172B4D]/90 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo sự kiện mới</span>
          </button>
        )}
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Upcoming vs Past toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setFilterType('upcoming')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterType === 'upcoming'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sắp diễn ra
            </button>
            <button
              onClick={() => setFilterType('past')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterType === 'past'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đã diễn ra
            </button>
          </div>

          <div className="text-xs text-slate-500 self-end sm:self-auto">
            Tổng cộng: {filteredEvents.length} hoạt động
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#172B4D] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả hoạt động
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#172B4D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((evt) => {
          const isRegistered = evt.registeredUserIds.includes(currentUser.id);

          return (
            <div
              key={evt.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-[#7AAED6] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Event Cover Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={evt.coverImage}
                    alt={evt.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-[#172B4D]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                    {evt.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#172B4D]" />
                    <span>{evt.date}</span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-6">
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {evt.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {evt.description}
                  </p>

                  <div className="space-y-2 text-xs text-slate-500 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Thời gian: {evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Địa điểm: {evt.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Tổ chức: {evt.organizer}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Footer Actions */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <Users className="w-4 h-4 text-[#172B4D]" />
                  <span>
                    <strong>{evt.registeredUserIds.length}</strong> bạn tham gia
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {canManage && (
                    <button
                      onClick={() => {
                        if (confirm(`Xóa sự kiện "${evt.name}"?`)) {
                          deleteEvent(evt.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => toggleEventRegistration(evt.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs ${
                      isRegistered
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                        : 'bg-[#172B4D] text-white hover:bg-[#172B4D]/90'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Đã đăng ký (Huỷ)</span>
                      </>
                    ) : (
                      <>
                        <span>Tham gia ngay</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">
            Không có hoạt động nào trong mục này.
          </p>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <h2 className="text-base font-bold text-[#172B4D]">
                Tạo Sự Kiện / Hoạt Động Lớp
              </h2>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên sự kiện / Hoạt động *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Giải Cầu lông Giao hữu Khối 12..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Thể loại hoạt động
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as EventCategory })
                    }
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ngày diễn ra
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Khung giờ
                  </label>
                  <input
                    type="text"
                    placeholder="08:00 - 11:30"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hạn đăng ký
                  </label>
                  <input
                    type="date"
                    value={form.registrationDeadline}
                    onChange={(e) =>
                      setForm({ ...form, registrationDeadline: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Địa điểm tổ chức
                </label>
                <input
                  type="text"
                  placeholder="Nhà thi đấu, Sân trường, Phòng 204..."
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mô tả chi tiết hoạt động
                </label>
                <textarea
                  rows={4}
                  placeholder="Nêu rõ thể lệ, nội dung và các bạn cần chuẩn bị gì..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
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
                  Công bố sự kiện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
