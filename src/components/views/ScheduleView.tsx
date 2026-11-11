import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TimetableLesson } from '../../types';
import {
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  MapPin,
  User,
} from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const { timetable, addLesson, updateLesson, deleteLesson, currentUser } = useApp();

  const [selectedDay, setSelectedDay] = useState<number>(() => {
    const jsDay = new Date().getDay(); // 0 is Sunday
    return jsDay === 0 ? 2 : jsDay + 1; // default to today or Monday
  });

  const [viewMode, setViewMode] = useState<'grid' | 'day'>('grid');
  const [editingLesson, setEditingLesson] = useState<TimetableLesson | null>(null);
  const [isAddingLesson, setIsAddingLesson] = useState(false);

  // Lesson Form state
  const [lessonForm, setLessonForm] = useState<Omit<TimetableLesson, 'id'>>({
    dayOfWeek: 2,
    period: 1,
    subject: 'Toán học',
    teacher: 'Thầy Trần Văn Tuấn',
    room: 'Phòng 204',
    session: 'morning',
    note: '',
  });

  const daysOfWeek = [
    { day: 2, label: 'Thứ Hai', short: 'T2' },
    { day: 3, label: 'Thứ Ba', short: 'T3' },
    { day: 4, label: 'Thứ Tư', short: 'T4' },
    { day: 5, label: 'Thứ Năm', short: 'T5' },
    { day: 6, label: 'Thứ Sáu', short: 'T6' },
    { day: 7, label: 'Thứ Bảy', short: 'T7' },
  ];

  const morningPeriods = [1, 2, 3, 4, 5];
  const afternoonPeriods = [6, 7, 8];

  const canEdit =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'class_admin' ||
    currentUser.role === 'teacher';

  const getSubjectColor = (subject: string) => {
    if (subject.includes('Toán')) return 'bg-blue-50 border-blue-200 text-blue-900';
    if (subject.includes('Văn')) return 'bg-rose-50 border-rose-200 text-rose-900';
    if (subject.includes('Anh')) return 'bg-emerald-50 border-emerald-200 text-emerald-900';
    if (subject.includes('Lí') || subject.includes('Vật lí')) return 'bg-indigo-50 border-indigo-200 text-indigo-900';
    if (subject.includes('Hóa')) return 'bg-purple-50 border-purple-200 text-purple-900';
    if (subject.includes('Sinh')) return 'bg-teal-50 border-teal-200 text-teal-900';
    if (subject.includes('Tin')) return 'bg-sky-50 border-sky-200 text-sky-900';
    if (subject.includes('Sử') || subject.includes('Địa')) return 'bg-amber-50 border-amber-200 text-amber-900';
    if (subject.includes('Thể chất') || subject.includes('QP')) return 'bg-green-50 border-green-200 text-green-900';
    return 'bg-slate-50 border-slate-200 text-slate-800';
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLesson) {
      updateLesson(editingLesson.id, lessonForm);
      setEditingLesson(null);
    } else {
      addLesson(lessonForm);
      setIsAddingLesson(false);
    }
  };

  const openAddModalFor = (day: number, period: number, session: 'morning' | 'afternoon') => {
    setLessonForm({
      dayOfWeek: day,
      period,
      subject: 'Toán học',
      teacher: '',
      room: 'Phòng 204',
      session,
      note: '',
    });
    setEditingLesson(null);
    setIsAddingLesson(true);
  };

  const openEditModal = (lesson: TimetableLesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      dayOfWeek: lesson.dayOfWeek,
      period: lesson.period,
      subject: lesson.subject,
      teacher: lesson.teacher,
      room: lesson.room,
      session: lesson.session,
      note: lesson.note || '',
    });
    setIsAddingLesson(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-[#172B4D] flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#172B4D]" />
            Thời Khóa Biểu 12/2B
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Chương trình GDPT mới 2026–2027 · Áp dụng cho cả buổi sáng và buổi chiều
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lưới cả tuần
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                viewMode === 'day'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Theo từng ngày
            </button>
          </div>

          {canEdit && (
            <button
              onClick={() => {
                setEditingLesson(null);
                setLessonForm({
                  dayOfWeek: 2,
                  period: 1,
                  subject: '',
                  teacher: '',
                  room: 'Phòng 204',
                  session: 'morning',
                  note: '',
                });
                setIsAddingLesson(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#172B4D] text-white hover:bg-[#172B4D]/90 text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm tiết học</span>
            </button>
          )}
        </div>
      </div>

      {/* Temporary Schedule Change Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-amber-900">
            Lưu ý điều chỉnh lịch học tuần này:
          </span>{' '}
          <span className="text-amber-800">
            Tiết Tin học sáng thứ Năm chuyển sang phòng máy Lab 2; Thứ Bảy tiết 3 sinh hoạt lớp chủ đề Kỷ yếu "Our Last Chapter".
          </span>
        </div>
      </div>

      {/* Day Selector Buttons (Available in both, critical for mobile and Day view) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {daysOfWeek.map((item) => (
          <button
            key={item.day}
            onClick={() => setSelectedDay(item.day)}
            className={`flex-1 min-w-[70px] py-2.5 px-3 rounded-xl text-center border transition-all ${
              selectedDay === item.day
                ? 'bg-[#172B4D] border-[#172B4D] text-white shadow-xs font-bold'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
            }`}
          >
            <div className="text-xs">{item.label}</div>
          </button>
        ))}
      </div>

      {/* VIEW MODE: FULL WEEKLY GRID */}
      {viewMode === 'grid' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs min-w-[760px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-3 font-bold text-slate-500 w-16 text-center border-r border-slate-200">
                    Tiết
                  </th>
                  {daysOfWeek.map((d) => (
                    <th
                      key={d.day}
                      className={`p-3 font-bold text-slate-800 border-r border-slate-200 last:border-r-0 ${
                        selectedDay === d.day ? 'bg-blue-50/70 text-[#172B4D]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{d.label}</span>
                        {selectedDay === d.day && (
                          <span className="text-[10px] font-normal text-[#172B4D]">Hôm nay</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* Morning Session Divider Header */}
                <tr className="bg-slate-100/70">
                  <td
                    colSpan={7}
                    className="px-3 py-1.5 font-bold text-[11px] text-slate-600 uppercase tracking-wider"
                  >
                    Buổi Sáng (7h00 – 11h15)
                  </td>
                </tr>

                {morningPeriods.map((period) => (
                  <tr key={`m-${period}`} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-2 text-center font-bold text-slate-700 border-r border-slate-200 bg-slate-50/50">
                      Tiết {period}
                    </td>
                    {daysOfWeek.map((d) => {
                      const lesson = timetable.find(
                        (l) => l.dayOfWeek === d.day && l.period === period
                      );
                      const isCurrentDay = selectedDay === d.day;

                      return (
                        <td
                          key={`cell-${d.day}-${period}`}
                          className={`p-2 border-r border-slate-200 last:border-r-0 align-top h-20 ${
                            isCurrentDay ? 'bg-blue-50/20' : ''
                          }`}
                        >
                          {lesson ? (
                            <div
                              onClick={() => canEdit && openEditModal(lesson)}
                              className={`p-2.5 rounded-xl border h-full flex flex-col justify-between transition-all ${getSubjectColor(
                                lesson.subject
                              )} ${canEdit ? 'cursor-pointer hover:shadow-xs' : ''}`}
                            >
                              <div>
                                <div className="font-bold text-xs truncate">
                                  {lesson.subject}
                                </div>
                                <div className="text-[10px] opacity-80 truncate mt-0.5">
                                  {lesson.teacher}
                                </div>
                              </div>
                              <div className="text-[9px] opacity-70 mt-1 flex items-center justify-between">
                                <span>{lesson.room}</span>
                                {canEdit && <Edit2 className="w-3 h-3 opacity-50" />}
                              </div>
                            </div>
                          ) : (
                            canEdit && (
                              <button
                                onClick={() => openAddModalFor(d.day, period, 'morning')}
                                className="w-full h-full border border-dashed border-slate-200 rounded-xl text-slate-300 hover:text-slate-600 hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center transition-colors text-[10px]"
                              >
                                + Tiết
                              </button>
                            )
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Afternoon Session Divider Header */}
                <tr className="bg-slate-100/70">
                  <td
                    colSpan={7}
                    className="px-3 py-1.5 font-bold text-[11px] text-slate-600 uppercase tracking-wider"
                  >
                    Buổi Chiều (13h30 – 16h30)
                  </td>
                </tr>

                {afternoonPeriods.map((period) => (
                  <tr key={`a-${period}`} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-2 text-center font-bold text-slate-700 border-r border-slate-200 bg-slate-50/50">
                      Tiết {period}
                    </td>
                    {daysOfWeek.map((d) => {
                      const lesson = timetable.find(
                        (l) => l.dayOfWeek === d.day && l.period === period
                      );
                      const isCurrentDay = selectedDay === d.day;

                      return (
                        <td
                          key={`cell-a-${d.day}-${period}`}
                          className={`p-2 border-r border-slate-200 last:border-r-0 align-top h-20 ${
                            isCurrentDay ? 'bg-blue-50/20' : ''
                          }`}
                        >
                          {lesson ? (
                            <div
                              onClick={() => canEdit && openEditModal(lesson)}
                              className={`p-2.5 rounded-xl border h-full flex flex-col justify-between transition-all ${getSubjectColor(
                                lesson.subject
                              )} ${canEdit ? 'cursor-pointer hover:shadow-xs' : ''}`}
                            >
                              <div>
                                <div className="font-bold text-xs truncate">
                                  {lesson.subject}
                                </div>
                                <div className="text-[10px] opacity-80 truncate mt-0.5">
                                  {lesson.teacher}
                                </div>
                              </div>
                              <div className="text-[9px] opacity-70 mt-1 flex items-center justify-between">
                                <span>{lesson.room}</span>
                                {canEdit && <Edit2 className="w-3 h-3 opacity-50" />}
                              </div>
                            </div>
                          ) : (
                            canEdit && (
                              <button
                                onClick={() => openAddModalFor(d.day, period, 'afternoon')}
                                className="w-full h-full border border-dashed border-slate-200 rounded-xl text-slate-300 hover:text-slate-600 hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center transition-colors text-[10px]"
                              >
                                + Tiết
                              </button>
                            )
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE: DETAILED DAY VIEW (Perfect on Mobile & Quick Daily Focus) */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-[#172B4D]">
              Lịch học chi tiết: {daysOfWeek.find((d) => d.day === selectedDay)?.label}
            </h2>
            <span className="text-xs text-slate-500">
              Tổng số:{' '}
              {timetable.filter((l) => l.dayOfWeek === selectedDay).length} tiết
            </span>
          </div>

          <div className="space-y-3">
            {timetable
              .filter((l) => l.dayOfWeek === selectedDay)
              .sort((a, b) => a.period - b.period)
              .map((lesson) => (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-xl border flex items-center justify-between ${getSubjectColor(
                    lesson.subject
                  )}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-9 h-9 rounded-xl bg-white font-mono font-bold text-sm flex items-center justify-center shadow-xs">
                      {lesson.period}
                    </span>
                    <div>
                      <div className="text-sm font-bold">{lesson.subject}</div>
                      <div className="text-xs opacity-80 flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {lesson.teacher || 'Chưa phân công'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {lesson.room}
                        </span>
                        <span>
                          {lesson.session === 'morning' ? 'Buổi sáng' : 'Buổi chiều'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {canEdit && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(lesson)}
                        className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-slate-700"
                        title="Sửa tiết"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Xóa tiết học ${lesson.subject}?`)) {
                            deleteLesson(lesson.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-rose-600"
                        title="Xóa tiết"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}

            {timetable.filter((l) => l.dayOfWeek === selectedDay).length === 0 && (
              <div className="text-center py-10 text-slate-400 text-xs">
                Không có tiết học nào được xếp trong ngày này.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD / EDIT LESSON MODAL */}
      {isAddingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-[#172B4D]">
                {editingLesson ? 'Chỉnh Sửa Tiết Học' : 'Thêm Tiết Học Mới'}
              </h2>
              <button
                onClick={() => setIsAddingLesson(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Thứ trong tuần
                  </label>
                  <select
                    value={lessonForm.dayOfWeek}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, dayOfWeek: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    {daysOfWeek.map((d) => (
                      <option key={d.day} value={d.day}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tiết số
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    required
                    value={lessonForm.period}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        period: parseInt(e.target.value) || 1,
                        session: parseInt(e.target.value) > 5 ? 'afternoon' : 'morning',
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên môn học *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Toán học, Ngữ văn, Tiếng Anh..."
                  value={lessonForm.subject}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#7AAED6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Giáo viên phụ trách
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Thầy Long, Cô Mai..."
                    value={lessonForm.teacher}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, teacher: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phòng học
                  </label>
                  <input
                    type="text"
                    placeholder="Phòng 204, Lab 1..."
                    value={lessonForm.room}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, room: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ghi chú tiết học
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Kiểm tra 15 phút, mang sách bài tập..."
                  value={lessonForm.note || ''}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, note: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                {editingLesson && (
                  <button
                    type="button"
                    onClick={() => {
                      deleteLesson(editingLesson.id);
                      setIsAddingLesson(false);
                    }}
                    className="text-rose-600 hover:underline"
                  >
                    Xóa tiết này
                  </button>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsAddingLesson(false)}
                    className="px-4 py-2 border rounded-xl text-slate-600"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#172B4D] text-white rounded-xl font-semibold shadow-xs hover:bg-[#172B4D]/90"
                  >
                    {editingLesson ? 'Lưu thay đổi' : 'Thêm vào lịch'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
