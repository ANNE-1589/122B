import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MemoryItem, MemoryAlbum, TimelineMoment } from '../../types';
import {
  Camera,
  Heart,
  MessageCircle,
  Plus,
  Calendar,
  MapPin,
  Share2,
  X,
  Send,
  BookOpen,
  Sparkles,
  ChevronRight,
  Trash2,
  Clock,
  Quote,
} from 'lucide-react';

export const MemoryLaneView: React.FC = () => {
  const {
    albums,
    memories,
    timelineMoments,
    addAlbum,
    addMemory,
    toggleLikeMemory,
    addCommentToMemory,
    deleteMemory,
    currentUser,
    addTimelineMoment,
  } = useApp();

  const [activeTabMode, setActiveTabMode] = useState<'gallery' | 'scrapbook'>('gallery');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('all');
  const [activeLightboxMemory, setActiveLightboxMemory] = useState<MemoryItem | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Modals state
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [isAddingScrapbook, setIsAddingScrapbook] = useState(false);

  // New Memory Form
  const [memForm, setMemForm] = useState({
    title: '',
    albumId: albums[0]?.id || 'alb-1',
    imageUrl: '',
    caption: '',
    date: '2026-11-10',
    location: 'THPT Phan Bội Châu',
  });

  // New Album Form
  const [albumForm, setAlbumForm] = useState({
    name: '',
    description: '',
    coverImage: '/src/assets/images/class_hero_cover_1794386143480.jpg',
  });

  // New Scrapbook Timeline Form
  const [scrapbookForm, setScrapbookForm] = useState({
    title: '',
    date: '15/11/2026',
    milestone: 'Cột mốc đáng nhớ',
    quote: '',
    author: currentUser.name,
    imageUrl: '/src/assets/images/class_hero_cover_1794386143480.jpg',
  });

  const filteredMemories =
    selectedAlbumId === 'all'
      ? memories
      : memories.filter((m) => m.albumId === selectedAlbumId);

  const canUpload = true; // All authenticated members can contribute memories!
  const canDelete =
    currentUser.role === 'super_admin' || currentUser.role === 'class_admin';

  const handleUploadMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memForm.title.trim()) return;

    addMemory({
      albumId: memForm.albumId,
      title: memForm.title,
      imageUrl:
        memForm.imageUrl.trim() ||
        '/src/assets/images/class_hero_cover_1794386143480.jpg',
      caption: memForm.caption,
      date: memForm.date,
      location: memForm.location,
      uploadedBy: currentUser.name,
    });

    setIsUploadingPhoto(false);
    setMemForm({
      title: '',
      albumId: albums[0]?.id || 'alb-1',
      imageUrl: '',
      caption: '',
      date: '2026-11-10',
      location: 'THPT Phan Bội Châu',
    });
  };

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumForm.name.trim()) return;

    addAlbum({
      name: albumForm.name,
      description: albumForm.description,
      coverImage: albumForm.coverImage,
    });

    setIsCreatingAlbum(false);
    setAlbumForm({
      name: '',
      description: '',
      coverImage: '/src/assets/images/class_hero_cover_1794386143480.jpg',
    });
  };

  const handleCreateScrapbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrapbookForm.title.trim()) return;

    addTimelineMoment({
      title: scrapbookForm.title,
      date: scrapbookForm.date,
      milestone: scrapbookForm.milestone,
      quote: scrapbookForm.quote,
      author: scrapbookForm.author,
      imageUrl: scrapbookForm.imageUrl,
    });

    setIsAddingScrapbook(false);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeLightboxMemory) return;

    addCommentToMemory(activeLightboxMemory.id, commentInput);
    setCommentInput('');

    // Keep active lightbox in sync
    const updated = memories.find((m) => m.id === activeLightboxMemory.id);
    if (updated) {
      setActiveLightboxMemory(updated);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-[#172B4D] flex items-center gap-2">
            <Camera className="w-6 h-6 text-[#172B4D]" />
            Góc Kỷ Niệm 12/2B – Our Last Chapter
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            "Thanh xuân có thể khép lại, nhưng những kỷ niệm dưới mái trường Phan Bội Châu sẽ còn mãi"
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Gallery vs Scrapbook Timeline Mode */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTabMode('gallery')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTabMode === 'gallery'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Album ảnh
            </button>
            <button
              onClick={() => setActiveTabMode('scrapbook')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                activeTabMode === 'scrapbook'
                  ? 'bg-[#172B4D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F2A65A]" />
              <span>Before We Say Goodbye</span>
            </button>
          </div>

          {activeTabMode === 'gallery' && (
            <button
              onClick={() => setIsUploadingPhoto(true)}
              className="px-3.5 py-2 rounded-xl bg-[#172B4D] text-white hover:bg-[#172B4D]/90 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Gửi ảnh kỷ niệm</span>
            </button>
          )}

          {activeTabMode === 'scrapbook' && canDelete && (
            <button
              onClick={() => setIsAddingScrapbook(true)}
              className="px-3.5 py-2 rounded-xl bg-[#F2A65A] text-slate-900 hover:bg-[#F2A65A]/90 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm cột mốc thanh xuân</span>
            </button>
          )}
        </div>
      </div>

      {/* MODE 1: ALBUM GALLERY */}
      {activeTabMode === 'gallery' && (
        <div className="space-y-6">
          {/* Albums Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Các Album Kỷ Yếu & Kỷ Niệm ({albums.length})</span>
              {canDelete && (
                <button
                  onClick={() => setIsCreatingAlbum(true)}
                  className="text-xs text-[#172B4D] hover:underline font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Tạo album mới
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => setSelectedAlbumId('all')}
                className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-colors border ${
                  selectedAlbumId === 'all'
                    ? 'bg-[#172B4D] text-white border-[#172B4D] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Tất cả hình ảnh ({memories.length})
              </button>
              {albums.map((alb) => (
                <button
                  key={alb.id}
                  onClick={() => setSelectedAlbumId(alb.id)}
                  className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-colors border ${
                    selectedAlbumId === alb.id
                      ? 'bg-[#172B4D] text-white border-[#172B4D] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {alb.name}
                </button>
              ))}
            </div>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((mem) => {
              const hasLiked = mem.likedByUserIds.includes(currentUser.id);

              return (
                <div
                  key={mem.id}
                  className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-[#7AAED6] transition-all flex flex-col justify-between"
                >
                  {/* Photo Container */}
                  <div
                    onClick={() => setActiveLightboxMemory(mem)}
                    className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
                  >
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-xs text-white font-medium flex items-center gap-1.5">
                        Nhấn để xem ảnh phóng to & bình luận
                      </span>
                    </div>
                  </div>

                  {/* Caption & Metadata */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {mem.date}
                        </span>
                        {mem.location && (
                          <span className="flex items-center gap-1 truncate max-w-[140px]">
                            <MapPin className="w-3 h-3" /> {mem.location}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                        {mem.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 italic">
                        "{mem.caption}"
                      </p>
                    </div>

                    {/* Actions: Like, Comment count, Delete */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleLikeMemory(mem.id)}
                          className={`flex items-center gap-1.5 font-semibold transition-colors ${
                            hasLiked
                              ? 'text-rose-600'
                              : 'text-slate-500 hover:text-rose-600'
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${hasLiked ? 'fill-rose-600' : ''}`}
                          />
                          <span>{mem.likes}</span>
                        </button>

                        <button
                          onClick={() => setActiveLightboxMemory(mem)}
                          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{mem.comments.length}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>Đăng bởi: {mem.uploadedBy}</span>
                        {canDelete && (
                          <button
                            onClick={() => {
                              if (confirm(`Xóa bức ảnh này?`)) {
                                deleteMemory(mem.id);
                              }
                            }}
                            className="text-slate-300 hover:text-rose-600 ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMemories.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Camera className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                Chưa có hình ảnh nào trong album này.
              </p>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: "BEFORE WE SAY GOODBYE" SCRAPBOOK TIMELINE */}
      {activeTabMode === 'scrapbook' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Scrapbook Header Card */}
          <div className="bg-[#172B4D] text-white p-6 sm:p-10 rounded-3xl text-center relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-xl mx-auto">
              <span className="text-xs uppercase font-bold tracking-widest text-[#F2A65A] mb-2 block">
                Cuốn Sổ Tay Kỷ Niệm 12/2B
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
                BEFORE WE SAY GOODBYE
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light italic">
                "Ba năm cấp ba trôi qua nhanh như một cái chớp mắt. Nhưng từng khoảnh khắc chúng ta cùng nhau cười, cùng nhau khóc, cùng nhau nỗ lực dưới mái trường Phan Bội Châu sẽ là hành trang đi cùng suốt cuộc đời."
              </p>
            </div>
          </div>

          {/* Chronological Timeline Stream */}
          <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
            {timelineMoments.map((moment, idx) => (
              <div key={moment.id} className="relative group">
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-6 h-6 rounded-full bg-[#172B4D] text-[#F2A65A] flex items-center justify-center text-xs font-bold ring-4 ring-[#F8F7F2] shadow-xs">
                  {idx + 1}
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-[#7AAED6] transition-all p-6 sm:p-8 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-[#F2A65A] uppercase tracking-wider">
                      {moment.milestone}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Thời gian: {moment.date}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {moment.title}
                  </h3>

                  {/* Photo with vintage polaroid / scrapbook styling */}
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-video max-h-80 w-full">
                    <img
                      src={moment.imageUrl}
                      alt={moment.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>

                  {/* Heartfelt Quote */}
                  <div className="p-4 rounded-2xl bg-[#F8F7F2] border border-slate-200/80 relative">
                    <Quote className="w-5 h-5 text-[#7AAED6]/40 absolute top-3 right-3" />
                    <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                      {moment.quote}
                    </p>
                    <span className="block text-right text-xs font-bold text-[#172B4D] mt-2">
                      — {moment.author}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL WITH REAL COMMENTS THREAD */}
      {activeLightboxMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col md:flex-row animate-in fade-in zoom-in-95">
            {/* Left: Big Photo */}
            <div className="md:w-3/5 bg-slate-950 flex items-center justify-center relative min-h-[300px]">
              <img
                src={activeLightboxMemory.imageUrl}
                alt={activeLightboxMemory.title}
                className="max-h-[85vh] w-full object-contain"
              />
              <button
                onClick={() => setActiveLightboxMemory(null)}
                className="absolute top-4 left-4 p-2 rounded-full bg-black/60 text-white hover:bg-black md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Right: Info, Likes, Comments list */}
            <div className="md:w-2/5 flex flex-col justify-between max-h-[85vh] p-6 bg-white overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {activeLightboxMemory.title}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {activeLightboxMemory.date} · {activeLightboxMemory.location}
                  </div>
                </div>
                <button
                  onClick={() => setActiveLightboxMemory(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 hidden md:block"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Caption & Comments List */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 italic">
                  "{activeLightboxMemory.caption}"
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700">
                    Bình luận ({activeLightboxMemory.comments.length})
                  </div>

                  {activeLightboxMemory.comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-2.5 text-xs">
                      <div className="w-6 h-6 rounded-full bg-[#172B4D] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {c.authorName.charAt(0)}
                      </div>
                      <div className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">{c.authorName}</span>
                          <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{c.content}</p>
                      </div>
                    </div>
                  ))}

                  {activeLightboxMemory.comments.length === 0 && (
                    <p className="text-xs text-slate-400 italic">
                      Chưa có bình luận nào. Hãy là người đầu tiên để lại lời nhắn!
                    </p>
                  )}
                </div>
              </div>

              {/* Comment Input & Like Bar */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      toggleLikeMemory(activeLightboxMemory.id);
                      const updated = memories.find((m) => m.id === activeLightboxMemory.id);
                      if (updated) setActiveLightboxMemory(updated);
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700"
                  >
                    <Heart className="w-4 h-4 fill-rose-600" />
                    <span>{activeLightboxMemory.likes} lượt thích</span>
                  </button>
                  <span className="text-xs text-slate-400">
                    Đăng bởi: {activeLightboxMemory.uploadedBy}
                  </span>
                </div>

                <form onSubmit={handleSendComment} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Viết lời nhắn cho bức ảnh..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-[#7AAED6]"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-[#172B4D] text-white rounded-xl hover:bg-[#172B4D]/90"
                    title="Gửi"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MEMORY MODAL */}
      {isUploadingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <h2 className="text-base font-bold text-[#172B4D]">
                Gửi Hình Ảnh Kỷ Niệm 12/2B
              </h2>
              <button
                onClick={() => setIsUploadingPhoto(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadMemory} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tiêu đề bức ảnh *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Giờ sinh hoạt cuối tuần cùng cô Mai"
                  value={memForm.title}
                  onChange={(e) => setMemForm({ ...memForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chọn Album
                </label>
                <select
                  value={memForm.albumId}
                  onChange={(e) => setMemForm({ ...memForm, albumId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Đường dẫn ảnh (URL hoặc hình ảnh sẵn có)
                </label>
                <input
                  type="text"
                  placeholder="Nhập link ảnh (mặc định sẽ dùng ảnh bìa lớp)"
                  value={memForm.imageUrl}
                  onChange={(e) => setMemForm({ ...memForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ngày chụp
                  </label>
                  <input
                    type="date"
                    value={memForm.date}
                    onChange={(e) => setMemForm({ ...memForm, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Địa điểm
                  </label>
                  <input
                    type="text"
                    placeholder="Sân trường, Phòng 204..."
                    value={memForm.location}
                    onChange={(e) =>
                      setMemForm({ ...memForm, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lời tâm sự / Chú thích ảnh
                </label>
                <textarea
                  rows={3}
                  placeholder="Viết vài dòng cảm xúc về khoảnh khắc này..."
                  value={memForm.caption}
                  onChange={(e) => setMemForm({ ...memForm, caption: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsUploadingPhoto(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#172B4D] text-white rounded-xl font-semibold shadow-xs"
                >
                  Lưu kỷ niệm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ALBUM MODAL */}
      {isCreatingAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <h2 className="text-base font-bold text-[#172B4D]">Tạo Album Mới</h2>
              <button
                onClick={() => setIsCreatingAlbum(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên Album *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lễ trưởng thành tuổi 18..."
                  value={albumForm.name}
                  onChange={(e) =>
                    setAlbumForm({ ...albumForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mô tả Album
                </label>
                <textarea
                  rows={3}
                  placeholder="Ý nghĩa của album..."
                  value={albumForm.description}
                  onChange={(e) =>
                    setAlbumForm({ ...albumForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreatingAlbum(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#172B4D] text-white rounded-xl font-semibold"
                >
                  Tạo Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SCRAPBOOK MOMENT MODAL */}
      {isAddingScrapbook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <h2 className="text-base font-bold text-[#172B4D]">
                Thêm Cột Mốc Before We Say Goodbye
              </h2>
              <button
                onClick={() => setIsAddingScrapbook(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateScrapbook} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tiêu đề cột mốc *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Chuyến đi dã ngoại đầu tiên..."
                  value={scrapbookForm.title}
                  onChange={(e) =>
                    setScrapbookForm({ ...scrapbookForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ngày diễn ra
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 15/11/2026"
                    value={scrapbookForm.date}
                    onChange={(e) =>
                      setScrapbookForm({ ...scrapbookForm, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Cột mốc thứ mấy
                  </label>
                  <input
                    type="text"
                    placeholder="Cột mốc 5: ..."
                    value={scrapbookForm.milestone}
                    onChange={(e) =>
                      setScrapbookForm({ ...scrapbookForm, milestone: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lời tâm sự / Trích dẫn ý nghĩa *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Cảm nghĩ chân thành gửi lại cho những người bạn 12/2B..."
                  value={scrapbookForm.quote}
                  onChange={(e) =>
                    setScrapbookForm({ ...scrapbookForm, quote: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingScrapbook(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#172B4D] text-white rounded-xl font-semibold"
                >
                  Thêm vào dòng thời gian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
