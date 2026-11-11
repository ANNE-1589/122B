import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentProfile, ClassPosition } from '../../types';
import {
  Search,
  Filter,
  Plus,
  User,
  GraduationCap,
  Heart,
  Award,
  Sparkles,
  BookOpen,
  X,
  Edit3,
  Trash2,
  Check,
} from 'lucide-react';

export const OurClassView: React.FC = () => {
  const { students, updateStudent, addStudent, deleteStudent, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals state
  const [viewingStudent, setViewingStudent] = useState<StudentProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New student form state (empty editable record)
  const [newStudentForm, setNewStudentForm] = useState<Omit<StudentProfile, 'id'>>({
    fullName: '',
    position: 'Thành viên',
    avatar: '',
    bio: '',
    favoriteSubjects: ['Toán'],
    hobbies: [],
    motto: '',
    gender: 'Nam',
    dreamCareer: '',
    groupNumber: 1,
  });

  const positions: { key: string; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'Giáo viên chủ nhiệm', label: 'GVCN' },
    { key: 'Lớp trưởng', label: 'Lớp trưởng' },
    { key: 'Lớp phó học tập', label: 'Lớp phó học tập' },
    { key: 'Lớp phó phong trào', label: 'Lớp phó phong trào' },
    { key: 'Bí thư chi đoàn', label: 'Bí thư' },
    { key: 'Tổ trưởng', label: 'Tổ trưởng' },
    { key: 'Thành viên', label: 'Thành viên' },
  ];

  const filteredStudents = students
    .filter((student) => {
      const matchName = student.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchPos =
        selectedPosition === 'all' || student.position === selectedPosition;
      const matchGender =
        selectedGender === 'all' || student.gender === selectedGender;
      return matchName && matchPos && matchGender;
    })
    .sort((a, b) => {
      const nameA = a.fullName.split(' ').pop() || a.fullName;
      const nameB = b.fullName.split(' ').pop() || b.fullName;
      return sortOrder === 'asc'
        ? nameA.localeCompare(nameB, 'vi')
        : nameB.localeCompare(nameA, 'vi');
    });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateStudent(editingStudent.id, editingStudent);
    setViewingStudent(editingStudent);
    setIsEditing(false);
  };

  const handleAddNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.fullName.trim()) return;
    addStudent(newStudentForm);
    setIsAddingNew(false);
    setNewStudentForm({
      fullName: '',
      position: 'Thành viên',
      avatar: '',
      bio: '',
      favoriteSubjects: ['Toán'],
      hobbies: [],
      motto: '',
      gender: 'Nam',
      dreamCareer: '',
      groupNumber: 1,
    });
  };

  const canManage =
    currentUser.role === 'super_admin' || currentUser.role === 'class_admin';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-[#172B4D]">
            Thành Viên 12/2B
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Danh sách và hồ sơ tập thể học sinh lớp 12/2B – THPT Phan Bội Châu (Niên khóa 2026–2027)
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-[#172B4D] hover:bg-[#172B4D]/90 text-white font-medium text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm hồ sơ thành viên</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm thành viên theo họ tên..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7AAED6] focus:border-transparent"
            />
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7AAED6]"
            >
              <option value="all">Tất cả giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>

            {/* Sort */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition-colors"
              title="Đổi thứ tự sắp xếp"
            >
              Xếp tên: {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
            </button>
          </div>
        </div>

        {/* Position Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {positions.map((pos) => (
            <button
              key={pos.key}
              onClick={() => setSelectedPosition(pos.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedPosition === pos.key
                  ? 'bg-[#172B4D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {pos.label}
            </button>
          ))}
        </div>
      </div>

      {/* Student Cards Grid (3 in a row on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.map((student) => {
          const isGVCN = student.position === 'Giáo viên chủ nhiệm';
          return (
            <div
              key={student.id}
              onClick={() => {
                setViewingStudent(student);
                setIsEditing(false);
              }}
              className={`group bg-white rounded-2xl border p-5 cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                isGVCN
                  ? 'border-amber-200/80 bg-gradient-to-b from-amber-50/20 to-white'
                  : 'border-slate-200/80 hover:border-[#7AAED6]'
              }`}
            >
              <div>
                {/* Top Avatar & Position Info */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="relative">
                    <img
                      src={student.avatar || '/src/assets/images/class_hero_cover_1794386143480.jpg'}
                      alt={student.fullName}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[11px] font-semibold text-[#172B4D]">
                        {student.position}
                      </span>
                      {student.groupNumber && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="text-[10px] text-slate-500">
                            Tổ {student.groupNumber}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#172B4D] transition-colors truncate">
                      {student.fullName}
                    </h3>
                    {student.dreamCareer && (
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        Ước mơ: {student.dreamCareer}
                      </p>
                    )}
                  </div>
                </div>

                {/* Personal Motto */}
                {student.motto && (
                  <p className="text-xs text-slate-600 italic bg-[#F8F7F2] p-2.5 rounded-xl border border-slate-100 line-clamp-2 mb-3">
                    "{student.motto}"
                  </p>
                )}

                {/* Favorite subjects & Hobbies unboxed info */}
                <div className="space-y-1 text-[11px] text-slate-500">
                  {student.favoriteSubjects && student.favoriteSubjects.length > 0 && (
                    <div className="truncate">
                      <span className="font-medium text-slate-700">Môn yêu thích:</span>{' '}
                      {student.favoriteSubjects.join(', ')}
                    </div>
                  )}
                  {student.hobbies && student.hobbies.length > 0 && (
                    <div className="truncate">
                      <span className="font-medium text-slate-700">Sở thích:</span>{' '}
                      {student.hobbies.join(', ')}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#172B4D] font-semibold">
                <span className="group-hover:underline">Xem hồ sơ chi tiết</span>
                <span className="text-slate-400 text-[11px]">{student.gender || 'Bảo mật'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-500">
            Không tìm thấy thành viên nào khớp với bộ lọc tìm kiếm.
          </p>
        </div>
      )}

      {/* STUDENT PROFILE DETAIL MODAL */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
                  Hồ sơ học sinh 12/2B
                </span>
              </div>
              <div className="flex items-center gap-1">
                {canManage && (
                  <button
                    onClick={() => {
                      setEditingStudent(viewingStudent);
                      setIsEditing(!isEditing);
                    }}
                    className="p-1.5 text-slate-500 hover:text-[#172B4D] rounded-lg hover:bg-slate-100 transition-colors"
                    title="Chỉnh sửa hồ sơ"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setViewingStudent(null);
                    setIsEditing(false);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            {isEditing && editingStudent ? (
              <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={editingStudent.fullName}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Chức vụ / Trách nhiệm
                    </label>
                    <select
                      value={editingStudent.position}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          position: e.target.value as ClassPosition,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-white"
                    >
                      <option value="Giáo viên chủ nhiệm">Giáo viên chủ nhiệm</option>
                      <option value="Lớp trưởng">Lớp trưởng</option>
                      <option value="Lớp phó học tập">Lớp phó học tập</option>
                      <option value="Lớp phó phong trào">Lớp phó phong trào</option>
                      <option value="Bí thư chi đoàn">Bí thư chi đoàn</option>
                      <option value="Tổ trưởng">Tổ trưởng</option>
                      <option value="Thành viên">Thành viên</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tổ sinh hoạt
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={4}
                      value={editingStudent.groupNumber || 1}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          groupNumber: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Châm ngôn sống (Motto)
                  </label>
                  <input
                    type="text"
                    value={editingStudent.motto}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, motto: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ước mơ nghề nghiệp
                  </label>
                  <input
                    type="text"
                    value={editingStudent.dreamCareer || ''}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, dreamCareer: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Giới thiệu bản thân
                  </label>
                  <textarea
                    rows={3}
                    value={editingStudent.bio}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, bio: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border rounded-xl text-slate-600"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#172B4D] text-white rounded-xl font-semibold"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={viewingStudent.avatar || '/src/assets/images/class_hero_cover_1794386143480.jpg'}
                    alt={viewingStudent.fullName}
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#7AAED6]/30 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#172B4D]">
                        {viewingStudent.position}
                      </span>
                      {viewingStudent.groupNumber && (
                        <span className="text-xs text-slate-400">
                          · Tổ {viewingStudent.groupNumber}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {viewingStudent.fullName}
                    </h2>
                    {viewingStudent.dreamCareer && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        Mục tiêu: {viewingStudent.dreamCareer}
                      </p>
                    )}
                  </div>
                </div>

                {viewingStudent.motto && (
                  <div className="bg-[#F8F7F2] p-4 rounded-2xl border border-slate-200/80">
                    <span className="text-[11px] font-bold text-[#172B4D] block mb-1 uppercase tracking-wider">
                      Châm ngôn thanh xuân
                    </span>
                    <p className="text-xs text-slate-700 italic">
                      "{viewingStudent.motto}"
                    </p>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">
                      Đôi nét giới thiệu:
                    </span>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {viewingStudent.bio || 'Chưa cập nhật phần giới thiệu cá nhân.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="font-semibold text-slate-500 block text-[10px] uppercase">
                        Môn học yêu thích
                      </span>
                      <span className="text-slate-900 font-medium mt-1 block">
                        {viewingStudent.favoriteSubjects?.join(', ') || 'Chưa điền'}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="font-semibold text-slate-500 block text-[10px] uppercase">
                        Sở thích cá nhân
                      </span>
                      <span className="text-slate-900 font-medium mt-1 block">
                        {viewingStudent.hobbies?.join(', ') || 'Chưa điền'}
                      </span>
                    </div>
                  </div>
                </div>

                {canManage && viewingStudent.position !== 'Giáo viên chủ nhiệm' && (
                  <div className="pt-4 border-t flex justify-end">
                    <button
                      onClick={() => {
                        if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ ${viewingStudent.fullName}?`)) {
                          deleteStudent(viewingStudent.id);
                          setViewingStudent(null);
                        }
                      }}
                      className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa hồ sơ này</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD NEW STUDENT MODAL (EMPTY EDITABLE RECORD) */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#172B4D]">
                  Thêm Hồ Sơ Thành Viên 12/2B
                </h2>
                <p className="text-xs text-slate-500">
                  Tạo bản ghi trống để thành viên tự cập nhật thông tin
                </p>
              </div>
              <button
                onClick={() => setIsAddingNew(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewStudent} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Họ và tên học sinh *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Học sinh 13"
                  value={newStudentForm.fullName}
                  onChange={(e) =>
                    setNewStudentForm({ ...newStudentForm, fullName: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#7AAED6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Vị trí trong lớp
                  </label>
                  <select
                    value={newStudentForm.position}
                    onChange={(e) =>
                      setNewStudentForm({
                        ...newStudentForm,
                        position: e.target.value as ClassPosition,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Thành viên">Thành viên</option>
                    <option value="Tổ trưởng">Tổ trưởng</option>
                    <option value="Lớp phó phong trào">Lớp phó phong trào</option>
                    <option value="Lớp phó học tập">Lớp phó học tập</option>
                    <option value="Bí thư chi đoàn">Bí thư chi đoàn</option>
                    <option value="Lớp trưởng">Lớp trưởng</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tổ sinh hoạt
                  </label>
                  <select
                    value={newStudentForm.groupNumber || 1}
                    onChange={(e) =>
                      setNewStudentForm({
                        ...newStudentForm,
                        groupNumber: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value={1}>Tổ 1</option>
                    <option value={2}>Tổ 2</option>
                    <option value={3}>Tổ 3</option>
                    <option value={4}>Tổ 4</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Châm ngôn cá nhân
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cố gắng hết mình vì ước mơ tuổi 18"
                  value={newStudentForm.motto}
                  onChange={(e) =>
                    setNewStudentForm({ ...newStudentForm, motto: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Giới thiệu ngắn
                </label>
                <textarea
                  rows={3}
                  placeholder="Sở thích, định hướng thi khối A/D/B..."
                  value={newStudentForm.bio}
                  onChange={(e) =>
                    setNewStudentForm({ ...newStudentForm, bio: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#172B4D] text-white rounded-xl font-semibold shadow-xs hover:bg-[#172B4D]/90"
                >
                  Tạo bản ghi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
