import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassPoll, PollOption } from '../../types';
import {
  Vote,
  Plus,
  CheckCircle2,
  Clock,
  User,
  Trash2,
  Lock,
  Unlock,
  X,
  AlertCircle,
  BarChart2,
  Check,
} from 'lucide-react';

export const PollsView: React.FC = () => {
  const { polls, votePoll, addPoll, toggleClosePoll, deletePoll, currentUser } =
    useApp();

  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'closed'>('all');
  const [isCreating, setIsCreating] = useState(false);

  // New Poll Form
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '2026-11-20',
    isAnonymous: false,
    isMultipleChoice: false,
    options: [
      { id: '1', text: '' },
      { id: '2', text: '' },
      { id: '3', text: '' },
    ],
  });

  const filteredPolls = polls.filter((p) => {
    if (filterMode === 'active') return !p.isClosed;
    if (filterMode === 'closed') return p.isClosed;
    return true;
  });

  const canManage =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'class_admin' ||
    currentUser.role === 'teacher';

  const handleAddOptionField = () => {
    if (form.options.length >= 6) return;
    setForm({
      ...form,
      options: [
        ...form.options,
        { id: String(Date.now()), text: '' },
      ],
    });
  };

  const handleRemoveOptionField = (index: number) => {
    if (form.options.length <= 2) return;
    setForm({
      ...form,
      options: form.options.filter((_, i) => i !== index),
    });
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...form.options];
    updated[index].text = val;
    setForm({ ...form, options: updated });
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const validOptions: PollOption[] = form.options
      .filter((opt) => opt.text.trim())
      .map((opt, idx) => ({
        id: 'opt-' + Date.now() + '-' + idx,
        text: opt.text.trim(),
        votesCount: 0,
        votedUserIds: [],
      }));

    if (validOptions.length < 2) {
      alert('Vui lòng nhập ít nhất 2 phương án bình chọn.');
      return;
    }

    addPoll({
      title: form.title,
      description: form.description,
      createdBy: currentUser.name,
      deadline: form.deadline,
      isClosed: false,
      isAnonymous: form.isAnonymous,
      isMultipleChoice: form.isMultipleChoice,
      options: validOptions,
    });

    setIsCreating(false);
    setForm({
      title: '',
      description: '',
      deadline: '2026-11-20',
      isAnonymous: false,
      isMultipleChoice: false,
      options: [
        { id: '1', text: '' },
        { id: '2', text: '' },
        { id: '3', text: '' },
      ],
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-[#172B4D] flex items-center gap-2">
            <Vote className="w-6 h-6 text-[#F2A65A]" />
            Bình Chọn Ý Kiến Tập Thể 12/2B
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Biểu quyết dân chủ về mẫu áo lớp, địa điểm dã ngoại và các hoạt động chung
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 rounded-xl bg-[#172B4D] text-white hover:bg-[#172B4D]/90 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Mở cuộc bình chọn mới</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filterMode === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tất cả ({polls.length})
        </button>
        <button
          onClick={() => setFilterMode('active')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filterMode === 'active'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Đang diễn ra ({polls.filter((p) => !p.isClosed).length})
        </button>
        <button
          onClick={() => setFilterMode('closed')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filterMode === 'closed'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Đã kết thúc ({polls.filter((p) => p.isClosed).length})
        </button>
      </div>

      {/* Polls List */}
      <div className="space-y-6">
        {filteredPolls.map((poll) => {
          const hasVotedAny = poll.options.some((opt) =>
            opt.votedUserIds.includes(currentUser.id)
          );

          return (
            <div
              key={poll.id}
              className={`bg-white rounded-3xl border p-6 sm:p-7 transition-all shadow-xs ${
                poll.isClosed
                  ? 'border-slate-200 bg-slate-50/40'
                  : 'border-slate-200/90 hover:border-[#7AAED6]'
              }`}
            >
              {/* Poll Top Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`font-bold px-2.5 py-0.5 rounded-full ${
                      poll.isClosed
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {poll.isClosed ? 'Đã đóng bình chọn' : 'Đang mở bình chọn'}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">
                    {poll.isMultipleChoice ? 'Chọn nhiều' : 'Chọn 1 phương án'}
                  </span>
                  {poll.isAnonymous && (
                    <>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 font-medium">Bình chọn ẩn danh</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Hạn: {poll.deadline}
                  </span>

                  {canManage && (
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => toggleClosePoll(poll.id)}
                        className="p-1 text-slate-500 hover:text-slate-800 rounded-md"
                        title={poll.isClosed ? 'Mở lại bình chọn' : 'Khóa bình chọn'}
                      >
                        {poll.isClosed ? (
                          <Unlock className="w-3.5 h-3.5" />
                        ) : (
                          <Lock className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Xóa cuộc bình chọn "${poll.title}"?`)) {
                            deletePoll(poll.id);
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

              {/* Title & Description */}
              <h2 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
                {poll.title}
              </h2>

              {poll.description && (
                <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                  {poll.description}
                </p>
              )}

              {/* Options & Progress Bars */}
              <div className="space-y-3 mb-5">
                {poll.options.map((opt) => {
                  const isUserVote = opt.votedUserIds.includes(currentUser.id);
                  const percentage =
                    poll.totalVotes > 0
                      ? Math.round((opt.votesCount / poll.totalVotes) * 100)
                      : 0;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => !poll.isClosed && votePoll(poll.id, opt.id)}
                      className={`relative overflow-hidden p-4 rounded-2xl border transition-all ${
                        poll.isClosed
                          ? 'border-slate-200'
                          : 'cursor-pointer hover:border-[#172B4D]'
                      } ${
                        isUserVote
                          ? 'border-[#172B4D] ring-2 ring-[#172B4D]/20 bg-blue-50/20'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      {/* Percentage background fill bar */}
                      <div
                        className="absolute top-0 bottom-0 left-0 bg-[#7AAED6]/20 transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      />

                      <div className="relative z-10 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                              isUserVote
                                ? 'bg-[#172B4D] text-white'
                                : 'border border-slate-300'
                            }`}
                          >
                            {isUserVote && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span
                            className={`text-xs sm:text-sm font-semibold ${
                              isUserVote ? 'text-[#172B4D]' : 'text-slate-800'
                            }`}
                          >
                            {opt.text}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-right shrink-0">
                          <span className="text-xs font-bold font-mono text-slate-700">
                            {percentage}%
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            ({opt.votesCount} phiếu)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer info: Total votes and user status */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="font-medium">
                  Tổng số phiếu bầu: <strong>{poll.totalVotes}</strong> lượt
                </span>
                <span className="text-[11px]">
                  {hasVotedAny ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Bạn đã biểu quyết
                    </span>
                  ) : poll.isClosed ? (
                    'Cuộc bình chọn đã kết thúc'
                  ) : (
                    <span className="text-amber-600 font-medium">
                      Nhấp vào lựa chọn để biểu quyết
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        })}

        {filteredPolls.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Vote className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">
              Không có cuộc bình chọn nào trong mục này.
            </p>
          </div>
        )}
      </div>

      {/* CREATE POLL MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <h2 className="text-base font-bold text-[#172B4D]">
                Mở Cuộc Bình Chọn Mới
              </h2>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chủ đề bình chọn *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Chọn địa điểm chụp ngoại cảnh kỷ yếu..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mô tả / Hướng dẫn
                </label>
                <textarea
                  rows={2}
                  placeholder="Giải thích thêm về các phương án..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Thời hạn đóng bình chọn
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              {/* Dynamic options fields */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-700">
                    Các phương án bình chọn * (Tối thiểu 2)
                  </label>
                  {form.options.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddOptionField}
                      className="text-[#172B4D] hover:underline font-semibold"
                    >
                      + Thêm phương án
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {form.options.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <span className="w-5 text-slate-400 font-mono text-center">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        required
                        placeholder={`Phương án ${idx + 1}`}
                        value={opt.text}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-xl"
                      />
                      {form.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionField(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2 pt-2 border-t">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isMultipleChoice}
                    onChange={(e) =>
                      setForm({ ...form, isMultipleChoice: e.target.checked })
                    }
                    className="rounded text-[#172B4D]"
                  />
                  <span className="text-slate-700 font-medium">
                    Cho phép chọn nhiều phương án cùng lúc
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isAnonymous}
                    onChange={(e) =>
                      setForm({ ...form, isAnonymous: e.target.checked })
                    }
                    className="rounded text-[#172B4D]"
                  />
                  <span className="text-slate-700 font-medium">
                    Bình chọn ẩn danh (Không hiển thị ai đã bỏ phiếu)
                  </span>
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
                  className="px-4 py-2 bg-[#172B4D] text-white rounded-xl font-semibold shadow-xs"
                >
                  Mở bình chọn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
