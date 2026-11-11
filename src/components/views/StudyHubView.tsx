import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  SubjectCategory,
  StudyDocument,
  Assignment,
  KnowledgeTip,
} from '../../types';
import {
  BookOpen,
  FileText,
  Download,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  Heart,
  MessageSquare,
  Clock,
  ExternalLink,
  X,
  FileDown,
  Eye,
  Trash2,
} from 'lucide-react';

export const StudyHubView: React.FC = () => {
  const {
    documents,
    addDocument,
    deleteDocument,
    incrementDocDownloads,
    assignments,
    toggleAssignmentComplete,
    addAssignment,
    deleteAssignment,
    knowledgeTips,
    addKnowledgeTip,
    likeKnowledgeTip,
    currentUser,
    settings,
    addToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'docs' | 'assignments' | 'tips' | 'examCountdown'>('docs');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchDocTerm, setSearchDocTerm] = useState('');

  // Modals state
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isAddingAsg, setIsAddingAsg] = useState(false);
  const [isAddingTip, setIsAddingTip] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<StudyDocument | null>(null);

  // New Doc Form
  const [docForm, setDocForm] = useState({
    title: '',
    subject: 'Toán' as SubjectCategory,
    fileType: 'pdf' as 'pdf' | 'docx' | 'pptx' | 'image' | 'link',
    fileName: '',
    fileSize: '2.5 MB',
    fileUrl: '#',
    description: '',
  });

  // New Assignment Form
  const [asgForm, setAsgForm] = useState({
    title: '',
    subject: 'Toán' as SubjectCategory,
    description: '',
    deadline: '2026-11-20T23:59:00',
    attachmentName: '',
  });

  // New Tip Form
  const [tipForm, setTipForm] = useState({
    title: '',
    subject: 'Toán' as SubjectCategory,
    content: '',
    tags: 'Mẹo học, Ôn thi',
  });

  const subjectsList: SubjectCategory[] = [
    'Toán',
    'Ngữ văn',
    'Tiếng Anh',
    'Vật lí',
    'Hóa học',
    'Sinh học',
    'Lịch sử',
    'Địa lí',
    'GDKT & PL',
    'Tin học',
    'Các môn khác',
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchSubject = selectedSubject === 'all' || doc.subject === selectedSubject;
    const matchSearch = doc.title.toLowerCase().includes(searchDocTerm.toLowerCase());
    return matchSubject && matchSearch;
  });

  const canManage =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'class_admin' ||
    currentUser.role === 'teacher';

  const handleDownload = (doc: StudyDocument) => {
    incrementDocDownloads(doc.id);
    addToast(`Đang tải xuống tài liệu: ${doc.fileName}`);
  };

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title.trim()) return;
    addDocument({
      title: docForm.title,
      subject: docForm.subject,
      fileType: docForm.fileType,
      fileUrl: docForm.fileUrl,
      fileName: docForm.fileName || `${docForm.title.replace(/\s+/g, '_')}.${docForm.fileType}`,
      fileSize: docForm.fileSize || '1.8 MB',
      uploadedBy: currentUser.name,
      uploaderRole: currentUser.position,
      description: docForm.description,
    });
    setIsUploadingDoc(false);
    setDocForm({
      title: '',
      subject: 'Toán',
      fileType: 'pdf',
      fileName: '',
      fileSize: '2.5 MB',
      fileUrl: '#',
      description: '',
    });
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgForm.title.trim()) return;
    addAssignment({
      title: asgForm.title,
      subject: asgForm.subject,
      description: asgForm.description,
      deadline: asgForm.deadline,
      assignedBy: currentUser.name,
      status: 'pending',
      attachmentName: asgForm.attachmentName || undefined,
    });
    setIsAddingAsg(false);
    setAsgForm({
      title: '',
      subject: 'Toán',
      description: '',
      deadline: '2026-11-20T23:59:00',
      attachmentName: '',
    });
  };

  const handleCreateTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipForm.title.trim()) return;
    addKnowledgeTip({
      title: tipForm.title,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar || '',
      subject: tipForm.subject,
      content: tipForm.content,
      tags: tipForm.tags.split(',').map((t) => t.trim()),
    });
    setIsAddingTip(false);
    setTipForm({
      title: '',
      subject: 'Toán',
      content: '',
      tags: 'Mẹo học, Ôn thi',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-[#172B4D] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#172B4D]" />
            Góc Học Tập & Học Liệu 12/2B
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Không gian chia sẻ tài liệu, quản lý bài tập và bí quyết ôn thi THPT Quốc gia 2027
          </p>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('docs')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
              activeSubTab === 'docs'
                ? 'bg-white text-[#172B4D] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tài liệu học tập
          </button>
          <button
            onClick={() => setActiveSubTab('assignments')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
              activeSubTab === 'assignments'
                ? 'bg-white text-[#172B4D] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bài tập & Nhiệm vụ
          </button>
          <button
            onClick={() => setActiveSubTab('tips')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
              activeSubTab === 'tips'
                ? 'bg-white text-[#172B4D] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chia sẻ kiến thức
          </button>
          <button
            onClick={() => setActiveSubTab('examCountdown')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
              activeSubTab === 'examCountdown'
                ? 'bg-white text-[#172B4D] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đếm ngược kỳ thi
          </button>
        </div>
      </div>

      {/* SECTION A: TÀI LIỆU HỌC TẬP */}
      {activeSubTab === 'docs' && (
        <div className="space-y-5">
          {/* Controls: Search, Subject Filters, Upload Button */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm tài liệu theo tiêu đề..."
                  value={searchDocTerm}
                  onChange={(e) => setSearchDocTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7AAED6]"
                />
              </div>

              {canManage && (
                <button
                  onClick={() => setIsUploadingDoc(true)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#172B4D] text-white hover:bg-[#172B4D]/90 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tải lên tài liệu mới</span>
                </button>
              )}
            </div>

            {/* Subject Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setSelectedSubject('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedSubject === 'all'
                    ? 'bg-[#172B4D] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả môn ({documents.length})
              </button>
              {subjectsList.map((subj) => {
                const count = documents.filter((d) => d.subject === subj).length;
                return (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubject(subj)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                      selectedSubject === subj
                        ? 'bg-[#172B4D] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {subj} {count > 0 && `(${count})`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#7AAED6] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-[#172B4D]">{doc.subject}</span>
                    <span className="text-slate-400 text-[11px] uppercase tracking-wider">
                      {doc.fileType} · {doc.fileSize}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                    {doc.title}
                  </h3>

                  {doc.description && (
                    <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">
                      {doc.description}
                    </p>
                  )}

                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>Đăng bởi: {doc.uploadedBy}</span>
                    <span aria-hidden="true">·</span>
                    <span>{doc.uploadedAt}</span>
                    <span aria-hidden="true">·</span>
                    <span>{doc.downloadsCount} lượt tải</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem chi tiết</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {canManage && (
                      <button
                        onClick={() => {
                          if (confirm(`Gỡ tài liệu "${doc.title}"?`)) {
                            deleteDocument(doc.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(doc)}
                      className="px-3 py-1.5 rounded-lg bg-[#172B4D] text-white hover:bg-[#172B4D]/90 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải về</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDocs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                Không tìm thấy tài liệu nào trong danh mục này.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SECTION B: BÀI TẬP VÀ NHIỆM VỤ */}
      {activeSubTab === 'assignments' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="text-base font-bold text-[#172B4D]">
                Danh sách Bài tập & Nhiệm vụ học tập
              </h2>
              <p className="text-xs text-slate-500">
                Theo dõi hạn nộp bài tập và đánh dấu hoàn thành cá nhân
              </p>
            </div>
            {canManage && (
              <button
                onClick={() => setIsAddingAsg(true)}
                className="px-4 py-2 rounded-xl bg-[#172B4D] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Giao bài tập mới</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {assignments.map((asg) => {
              const isDone = asg.completedByUsers?.includes(currentUser.id);
              return (
                <div
                  key={asg.id}
                  className={`bg-white p-5 rounded-2xl border transition-all ${
                    isDone
                      ? 'border-slate-200 bg-slate-50/40 opacity-70'
                      : 'border-slate-200/90 shadow-xs hover:border-[#7AAED6]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleAssignmentComplete(asg.id)}
                        className={`mt-1 w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'border-2 border-slate-300 hover:border-[#172B4D]'
                        }`}
                        title={isDone ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-[#172B4D]">
                            {asg.subject}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-500">
                            Người giao: {asg.assignedBy}
                          </span>
                        </div>
                        <h3
                          className={`text-sm font-bold ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {asg.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {asg.description}
                        </p>
                        {asg.attachmentName && (
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-medium text-slate-700">
                            <FileDown className="w-3.5 h-3.5 text-[#172B4D]" />
                            <span>{asg.attachmentName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-rose-600 flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Hạn: {asg.deadline.replace('T', ' ')}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {asg.completedByUsers?.length || 0} bạn đã hoàn thành
                      </div>

                      {canManage && (
                        <button
                          onClick={() => {
                            if (confirm(`Xóa bài tập "${asg.title}"?`)) {
                              deleteAssignment(asg.id);
                            }
                          }}
                          className="mt-3 text-[11px] text-slate-400 hover:text-rose-600"
                        >
                          Xóa nhiệm vụ
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION C: GÓC CHIA SẺ KIẾN THỨC */}
      {activeSubTab === 'tips' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="text-base font-bold text-[#172B4D]">
                Góc Chia Sẻ Kiến Thức & Kinh Nghiệm Ôn Thi
              </h2>
              <p className="text-xs text-slate-500">
                Các phương pháp học, câu thần chú, mẹo giải nhanh từ thành viên 12/2B
              </p>
            </div>
            <button
              onClick={() => setIsAddingTip(true)}
              className="px-4 py-2 rounded-xl bg-[#172B4D] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Đăng mẹo học tập</span>
            </button>
          </div>

          <div className="space-y-4">
            {knowledgeTips.map((tip) => (
              <div
                key={tip.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#172B4D] text-white text-xs font-bold flex items-center justify-center">
                      {tip.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {tip.authorName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {tip.createdAt} · Môn: {tip.subject}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {tip.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#172B4D]">{tip.title}</h3>

                <p className="text-xs text-slate-700 leading-relaxed bg-[#F8F7F2] p-3.5 rounded-xl border border-slate-100">
                  {tip.content}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <button
                    onClick={() => likeKnowledgeTip(tip.id)}
                    className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-semibold"
                  >
                    <Heart className="w-4 h-4 fill-rose-100" />
                    <span>{tip.likes} Hữu ích</span>
                  </button>
                  <span className="flex items-center gap-1 text-slate-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{tip.commentsCount} thảo luận</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION D: EXAM COUNTDOWN */}
      {activeSubTab === 'examCountdown' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#172B4D] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
            <span className="text-xs font-bold text-[#F2A65A] uppercase tracking-wider block mb-2">
              Mục tiêu học tập lớn nhất
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold mb-3">
              Kỳ Thi Tốt Nghiệp THPT Quốc Gia Năm 2027
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mb-6">
              Kỳ thi quyết định tương lai của tuổi 18. Hãy vững vàng niềm tin, kỷ luật với từng giờ học để viết nên một kết thúc trọn vẹn nhất cho tập thể 12/2B!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-3xl font-extrabold font-mono text-[#F2A65A]">
                  226
                </span>
                <span className="block text-xs text-slate-300 mt-1 uppercase">
                  Ngày còn lại
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-3xl font-extrabold font-mono text-white">04</span>
                <span className="block text-xs text-slate-300 mt-1 uppercase">
                  Bài thi bắt buộc
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-3xl font-extrabold font-mono text-[#7AAED6]">100%</span>
                <span className="block text-xs text-slate-300 mt-1 uppercase">
                  Mục tiêu đỗ NV1
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-3xl font-extrabold font-mono text-emerald-400">
                  Phan Bội Châu
                </span>
                <span className="block text-xs text-slate-300 mt-1 uppercase">
                  Tự hào truyền thống
                </span>
              </div>
            </div>
          </div>

          {/* Academic Milestones */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wider">
              Các mốc thời gian học vụ trọng điểm (2026–2027)
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Thi Khảo sát chất lượng Giữa Học kỳ I
                  </span>
                  <span className="text-slate-500">Môn Toán, Văn, Anh và Tổ hợp KHTN/KHXH</span>
                </div>
                <span className="font-semibold text-[#172B4D] bg-white px-2.5 py-1 rounded-lg border">
                  25/11/2026
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Thi Học kỳ I Năm học 2026–2027
                  </span>
                  <span className="text-slate-500">Đánh giá kết quả giai đoạn 1</span>
                </div>
                <span className="font-semibold text-[#172B4D] bg-white px-2.5 py-1 rounded-lg border">
                  20/12/2026
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Thi Thử Tốt Nghiệp THPT Cấp Tỉnh lần 1
                  </span>
                  <span className="text-slate-500">Cọ xát toàn diện ma trận đề thi</span>
                </div>
                <span className="font-semibold text-[#172B4D] bg-white px-2.5 py-1 rounded-lg border">
                  15/03/2027
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div>
                  <span className="font-bold text-amber-900 block">
                    Lễ Tri Ân & Trưởng Thành "Our Last Chapter" 12/2B
                  </span>
                  <span className="text-amber-800">Chia tay mái trường THPT Phan Bội Châu</span>
                </div>
                <span className="font-bold text-amber-900 bg-white px-2.5 py-1 rounded-lg border border-amber-300">
                  25/05/2027
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {isUploadingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <h2 className="text-base font-bold text-[#172B4D]">
                Tải Lên Tài Liệu Học Tập
              </h2>
              <button
                onClick={() => setIsUploadingDoc(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDoc} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tiêu đề tài liệu *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đề cương ôn tập Toán 12 chương Oxyz"
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Môn học
                  </label>
                  <select
                    value={docForm.subject}
                    onChange={(e) =>
                      setDocForm({ ...docForm, subject: e.target.value as SubjectCategory })
                    }
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    {subjectsList.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Định dạng file
                  </label>
                  <select
                    value={docForm.fileType}
                    onChange={(e) =>
                      setDocForm({
                        ...docForm,
                        fileType: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="docx">Word (.docx)</option>
                    <option value="pptx">PowerPoint (.pptx)</option>
                    <option value="image">Hình ảnh (.png, .jpg)</option>
                    <option value="link">Liên kết trực tuyến</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mô tả nội dung tóm tắt
                </label>
                <textarea
                  rows={3}
                  placeholder="Nêu ngắn gọn nội dung kiến thức, số lượng trang..."
                  value={docForm.description}
                  onChange={(e) =>
                    setDocForm({ ...docForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsUploadingDoc(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#172B4D] text-white rounded-xl font-semibold"
                >
                  Tải lên ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ASSIGNMENT MODAL */}
      {isAddingAsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <h2 className="text-base font-bold text-[#172B4D]">
                Giao Bài Tập Mới
              </h2>
              <button
                onClick={() => setIsAddingAsg(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên bài tập / Nhiệm vụ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàn thành bài tập trắc nghiệm chương 3"
                  value={asgForm.title}
                  onChange={(e) => setAsgForm({ ...asgForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Môn học
                  </label>
                  <select
                    value={asgForm.subject}
                    onChange={(e) =>
                      setAsgForm({ ...asgForm, subject: e.target.value as SubjectCategory })
                    }
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    {subjectsList.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hạn chót nộp
                  </label>
                  <input
                    type="datetime-local"
                    value={asgForm.deadline}
                    onChange={(e) =>
                      setAsgForm({ ...asgForm, deadline: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Yêu cầu chi tiết
                </label>
                <textarea
                  rows={3}
                  placeholder="Trình bày tự luận, làm vào vở hay nộp file..."
                  value={asgForm.description}
                  onChange={(e) =>
                    setAsgForm({ ...asgForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingAsg(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#172B4D] text-white rounded-xl font-semibold"
                >
                  Tạo nhiệm vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD KNOWLEDGE TIP MODAL */}
      {isAddingTip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <h2 className="text-base font-bold text-[#172B4D]">
                Chia Sẻ Kinh Nghiệm Học Tập
              </h2>
              <button
                onClick={() => setIsAddingTip(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTip} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tiêu đề kinh nghiệm *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cách ghi nhớ nhanh công thức..."
                  value={tipForm.title}
                  onChange={(e) => setTipForm({ ...tipForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Môn áp dụng
                  </label>
                  <select
                    value={tipForm.subject}
                    onChange={(e) =>
                      setTipForm({ ...tipForm, subject: e.target.value as SubjectCategory })
                    }
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    {subjectsList.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Thẻ từ khóa
                  </label>
                  <input
                    type="text"
                    placeholder="Mẹo, Ôn thi, Công thức"
                    value={tipForm.tags}
                    onChange={(e) => setTipForm({ ...tipForm, tags: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nội dung chia sẻ
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Viết chi tiết bí quyết của bạn..."
                  value={tipForm.content}
                  onChange={(e) => setTipForm({ ...tipForm, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingTip(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#172B4D] text-white rounded-xl font-semibold"
                >
                  Đăng chia sẻ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#172B4D] uppercase">
                  {previewDoc.subject}
                </span>
                <span className="text-xs text-slate-400">· {previewDoc.fileType}</span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {previewDoc.title}
              </h3>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tên file:</span>
                  <span className="font-mono font-medium">{previewDoc.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dung lượng:</span>
                  <span>{previewDoc.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Người chia sẻ:</span>
                  <span>{previewDoc.uploadedBy} ({previewDoc.uploaderRole})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngày đăng:</span>
                  <span>{previewDoc.uploadedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lượt tải:</span>
                  <span>{previewDoc.downloadsCount} lượt</span>
                </div>
              </div>

              {previewDoc.description && (
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block mb-1">
                    Ghi chú nội dung:
                  </span>
                  <p className="text-slate-600 bg-[#F8F7F2] p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {previewDoc.description}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t flex justify-end gap-2">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 border rounded-xl text-xs text-slate-600"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    handleDownload(previewDoc);
                    setPreviewDoc(null);
                  }}
                  className="px-4 py-2 bg-[#172B4D] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải tài liệu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
