import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  BookOpen,
  Bell,
  Camera,
  Users,
  Vote,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Heart,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    students,
    events,
    announcements,
    timetable,
    assignments,
    memories,
    settings,
    currentUser,
    setActiveTab,
    toggleAssignmentComplete,
  } = useApp();

  // Dynamic greeting based on current time
  const [greeting, setGreeting] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 12) setGreeting('Chào buổi sáng');
      else if (hour < 18) setGreeting('Chào buổi chiều');
      else setGreeting('Chào buổi tối');

      const daysOfWeek = [
        'Chủ Nhật',
        'Thứ Hai',
        'Thứ Ba',
        'Thứ Tư',
        'Thứ Năm',
        'Thứ Sáu',
        'Thứ Bảy',
      ];
      const dayName = daysOfWeek[now.getDay()];
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      setCurrentDateStr(`${dayName}, ngày ${day}/${month}/${year}`);

      // Calculate countdown to graduation
      const targetDate = new Date(settings.graduationDate).getTime();
      const difference = targetDate - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.graduationDate]);

  // Today's lessons calculation
  const now = new Date();
  // Map JS getDay() (0=Sun, 1=Mon, ..., 6=Sat) to Vietnamese timetable dayOfWeek (2=Thứ 2... 7=Thứ 7)
  const currentJsDay = now.getDay();
  const currentSchoolDay = currentJsDay === 0 ? 2 : currentJsDay + 1; // default to Monday if Sunday
  const todayLessons = timetable
    .filter((l) => l.dayOfWeek === currentSchoolDay)
    .sort((a, b) => a.period - b.period);

  const pendingAssignments = assignments.filter((a) => {
    const isCompleted = a.completedByUsers?.includes(currentUser.id);
    return !isCompleted;
  });

  const latestAnnouncements = announcements.slice(0, 3);
  const nextEvent = events[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HERO SECTION */}
      <div className="relative rounded-3xl overflow-hidden bg-[#172B4D] text-white shadow-xl">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/class_hero_cover_1794386143480.jpg"
            alt="12/2B THPT Phan Bội Châu"
            className="w-full h-full object-cover opacity-25 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#172B4D] via-[#172B4D]/90 to-transparent"></div>
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-4xl">
          {/* School & Academic year unboxed kicker */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider text-[#7AAED6] mb-3">
            <span>THPT PHAN BỘI CHÂU</span>
            <span aria-hidden="true">·</span>
            <span>NIÊN KHÓA {settings.academicYear}</span>
            <span aria-hidden="true">·</span>
            <span>PHÒNG 204</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-balance leading-tight">
            12/2B – OUR LAST CHAPTER
          </h1>

          <p className="text-base sm:text-lg text-slate-200 font-light italic mb-6 max-w-2xl leading-relaxed">
            "Thanh xuân có thể khép lại, nhưng những kỷ niệm sẽ còn mãi."
          </p>

          {/* Dynamic Welcome Greeting */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 pb-6 border-b border-white/10">
            <span className="font-medium text-[#F2A65A]">
              {greeting}, {currentUser.name}!
            </span>
            <span aria-hidden="true">·</span>
            <span>{currentDateStr}</span>
          </div>

          {/* Graduation Countdown Widget */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#7AAED6] font-semibold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#F2A65A]" />
                Đếm ngược đến Lễ Tốt Nghiệp & Ra Trường (2027)
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                <div className="bg-white/10 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-white/15">
                  <span className="block text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                    {timeLeft.days}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider">
                    Ngày
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-white/15">
                  <span className="block text-2xl sm:text-3xl font-extrabold text-[#F2A65A] font-mono tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider">
                    Giờ
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-white/15">
                  <span className="block text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider">
                    Phút
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-white/15">
                  <span className="block text-2xl sm:text-3xl font-extrabold text-[#7AAED6] font-mono tabular-nums">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider">
                    Giây
                  </span>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap sm:flex-col gap-2">
              <button
                onClick={() => setActiveTab('schedule')}
                className="px-4 py-2.5 rounded-xl bg-white text-[#172B4D] hover:bg-slate-100 font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
              >
                <Calendar className="w-4 h-4 text-[#172B4D]" />
                <span>Xem Thời khóa biểu</span>
              </button>
              <button
                onClick={() => setActiveTab('memories')}
                className="px-4 py-2.5 rounded-xl bg-[#F2A65A] text-slate-900 hover:bg-[#F2A65A]/90 font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
              >
                <Camera className="w-4 h-4 text-slate-900" />
                <span>Kỷ yếu "Before We Say Goodbye"</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD STATISTICS KPI ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('students')}
          className="cursor-pointer p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#7AAED6] transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-[#172B4D] transition-colors mb-2">
            <span className="text-xs font-semibold text-slate-500">Sĩ số lớp 12/2B</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] font-mono tabular-nums">
            {students.length} <span className="text-xs font-normal text-slate-500">thành viên</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <span>GVCN: {settings.advisorName}</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('announcements')}
          className="cursor-pointer p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#7AAED6] transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-[#172B4D] transition-colors mb-2">
            <span className="text-xs font-semibold text-slate-500">Thông báo mới</span>
            <Bell className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] font-mono tabular-nums">
            {announcements.length} <span className="text-xs font-normal text-slate-500">tin bài</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium">
            {announcements.filter((a) => a.isPinned).length} thông báo được ghim
          </div>
        </div>

        <div
          onClick={() => setActiveTab('study')}
          className="cursor-pointer p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#7AAED6] transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-[#172B4D] transition-colors mb-2">
            <span className="text-xs font-semibold text-slate-500">Nhiệm vụ & Bài tập</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] font-mono tabular-nums">
            {pendingAssignments.length} <span className="text-xs font-normal text-slate-500">cần làm</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-600 font-medium">
            Ưu tiên hoàn thành trong tuần
          </div>
        </div>

        <div
          onClick={() => setActiveTab('memories')}
          className="cursor-pointer p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#7AAED6] transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-[#172B4D] transition-colors mb-2">
            <span className="text-xs font-semibold text-slate-500">Khoảnh khắc lưu giữ</span>
            <Camera className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] font-mono tabular-nums">
            {memories.length} <span className="text-xs font-normal text-slate-500">bức ảnh</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Album Kỷ yếu 12/2B đang mở
          </div>
        </div>
      </div>

      {/* TWO-COLUMN GRID: TIMETABLE OF THE DAY & LATEST ANNOUNCEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Today's Timetable */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#172B4D] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F2A65A]" />
                Thời khóa biểu hôm nay ({currentDateStr.split(',')[0]})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Các tiết học tại phòng 204 & phòng bộ môn
              </p>
            </div>
            <button
              onClick={() => setActiveTab('schedule')}
              className="text-xs font-semibold text-[#172B4D] hover:text-[#7AAED6] transition-colors flex items-center gap-1"
            >
              <span>Xem cả tuần</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayLessons.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              Hôm nay không có tiết học theo lịch cố định (hoặc ngày nghỉ).
            </div>
          ) : (
            <div className="space-y-2.5">
              {todayLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#172B4D] text-white flex items-center justify-center text-xs font-bold font-mono">
                      {lesson.period}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {lesson.subject}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span>GV: {lesson.teacher}</span>
                        <span aria-hidden="true">·</span>
                        <span>{lesson.room}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200">
                    {lesson.session === 'morning' ? 'Buổi Sáng' : 'Buổi Chiều'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Latest Announcements & Upcoming Event */}
        <div className="lg:col-span-5 space-y-6">
          {/* Announcements Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#172B4D] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#F2A65A]" />
                Thông báo quan trọng
              </h2>
              <button
                onClick={() => setActiveTab('announcements')}
                className="text-xs font-semibold text-[#172B4D] hover:text-[#7AAED6] transition-colors"
              >
                Tất cả
              </button>
            </div>

            <div className="space-y-3">
              {latestAnnouncements.map((anc) => (
                <div
                  key={anc.id}
                  onClick={() => setActiveTab('announcements')}
                  className="p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-[#172B4D]">{anc.author}</span>
                    <span>{anc.date}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mb-1 line-clamp-1">
                    {anc.title}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {anc.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Next Event Spotlight */}
          {nextEvent && (
            <div className="bg-gradient-to-br from-blue-50/80 to-amber-50/60 rounded-2xl p-6 border border-blue-100 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F2A65A]" />
                  Sự kiện sắp diễn ra
                </span>
                <span className="text-xs font-semibold text-slate-700">{nextEvent.date}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                {nextEvent.name}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                {nextEvent.description}
              </p>
              <div className="flex items-center justify-between text-xs pt-3 border-t border-blue-200/50">
                <span className="text-slate-600">
                  {nextEvent.registeredUserIds.length} bạn đã đăng ký
                </span>
                <button
                  onClick={() => setActiveTab('events')}
                  className="font-bold text-[#172B4D] hover:underline flex items-center gap-1"
                >
                  Chi tiết sự kiện <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RECENT MEMORIES & ASSIGNMENTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left (8 cols): Photo Memories Snapshot */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#172B4D] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#F2A65A]" />
                Kỷ niệm gần đây – Our Last Chapter
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Những thước phim thanh xuân được ghi lại bởi các thành viên 12/2B
              </p>
            </div>
            <button
              onClick={() => setActiveTab('memories')}
              className="text-xs font-semibold text-[#172B4D] hover:text-[#7AAED6] transition-colors flex items-center gap-1"
            >
              <span>Xem toàn bộ album</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memories.slice(0, 2).map((mem) => (
              <div
                key={mem.id}
                onClick={() => setActiveTab('memories')}
                className="group relative rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-xs"
              >
                <div className="aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3.5 bg-white">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>{mem.date}</span>
                    <span className="flex items-center gap-1 text-rose-500">
                      <Heart className="w-3 h-3 fill-rose-500" />
                      {mem.likes}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#172B4D] transition-colors line-clamp-1">
                    {mem.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {mem.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (4 cols): Pending Assignments checklist */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-[#172B4D] flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#F2A65A]" />
              Bài tập cần nộp
            </h2>
            <button
              onClick={() => setActiveTab('study')}
              className="text-xs font-semibold text-[#172B4D] hover:underline"
            >
              Xem tất cả
            </button>
          </div>

          <div className="space-y-3">
            {assignments.slice(0, 3).map((asg) => {
              const isCompleted = asg.completedByUsers?.includes(currentUser.id);
              return (
                <div
                  key={asg.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-slate-50/50 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() => toggleAssignmentComplete(asg.id)}
                      className={`mt-0.5 w-4 h-4 rounded-md flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'border border-slate-300 hover:border-[#172B4D]'
                      }`}
                      aria-label="Toggle completed"
                    >
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-[#172B4D]">
                          {asg.subject}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {asg.deadline.split('T')[0]}
                        </span>
                      </div>
                      <h4
                        className={`text-xs font-medium leading-snug ${
                          isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {asg.title}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
