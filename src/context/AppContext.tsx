import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  StudentProfile,
  TimetableLesson,
  StudyDocument,
  Assignment,
  KnowledgeTip,
  Announcement,
  ClassEvent,
  MemoryAlbum,
  MemoryItem,
  TimelineMoment,
  ClassPoll,
  ActivityLog,
  AppSettings,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_CURRENT_USER,
  DEMO_USERS,
  INITIAL_STUDENTS,
  INITIAL_TIMETABLE,
  INITIAL_DOCUMENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_KNOWLEDGE_TIPS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_EVENTS,
  INITIAL_ALBUMS,
  INITIAL_MEMORIES,
  INITIAL_TIMELINE_MOMENTS,
  INITIAL_POLLS,
  INITIAL_ACTIVITY_LOGS,
} from '../data/initialData';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  activeRole: UserRole;
  switchRole: (role: UserRole) => void;
  users: User[];
  updateUserRole: (userId: string, newRole: UserRole) => void;
  students: StudentProfile[];
  updateStudent: (id: string, updated: Partial<StudentProfile>) => void;
  addStudent: (student: Omit<StudentProfile, 'id'>) => void;
  deleteStudent: (id: string) => void;
  timetable: TimetableLesson[];
  addLesson: (lesson: Omit<TimetableLesson, 'id'>) => void;
  updateLesson: (id: string, lesson: Partial<TimetableLesson>) => void;
  deleteLesson: (id: string) => void;
  documents: StudyDocument[];
  addDocument: (doc: Omit<StudyDocument, 'id' | 'downloadsCount' | 'uploadedAt'>) => void;
  deleteDocument: (id: string) => void;
  incrementDocDownloads: (id: string) => void;
  assignments: Assignment[];
  toggleAssignmentComplete: (id: string) => void;
  addAssignment: (asg: Omit<Assignment, 'id' | 'completedByUsers'>) => void;
  deleteAssignment: (id: string) => void;
  knowledgeTips: KnowledgeTip[];
  addKnowledgeTip: (tip: Omit<KnowledgeTip, 'id' | 'createdAt' | 'likes' | 'commentsCount'>) => void;
  likeKnowledgeTip: (id: string) => void;
  announcements: Announcement[];
  addAnnouncement: (anc: Omit<Announcement, 'id' | 'date' | 'readByUsers'>) => void;
  togglePinAnnouncement: (id: string) => void;
  markAnnouncementAsRead: (id: string) => void;
  deleteAnnouncement: (id: string) => void;
  events: ClassEvent[];
  toggleEventRegistration: (id: string) => void;
  addEvent: (evt: Omit<ClassEvent, 'id' | 'registeredUserIds'>) => void;
  deleteEvent: (id: string) => void;
  albums: MemoryAlbum[];
  addAlbum: (album: Omit<MemoryAlbum, 'id' | 'createdAt' | 'itemCount'>) => void;
  memories: MemoryItem[];
  addMemory: (mem: Omit<MemoryItem, 'id' | 'likes' | 'likedByUserIds' | 'comments'>) => void;
  toggleLikeMemory: (id: string) => void;
  addCommentToMemory: (memoryId: string, content: string) => void;
  deleteMemory: (id: string) => void;
  timelineMoments: TimelineMoment[];
  addTimelineMoment: (tm: Omit<TimelineMoment, 'id'>) => void;
  polls: ClassPoll[];
  votePoll: (pollId: string, optionId: string) => void;
  addPoll: (poll: Omit<ClassPoll, 'id' | 'createdAt' | 'totalVotes'>) => void;
  toggleClosePoll: (pollId: string) => void;
  deletePoll: (pollId: string) => void;
  activityLogs: ActivityLog[];
  addActivityLog: (action: string, category: string) => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetToDefaults: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = '122b_chapter_';

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error reading localStorage for key', key, e);
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing to localStorage for key', key, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [settings, setSettings] = useState<AppSettings>(() => getStorage('settings', INITIAL_SETTINGS));
  const [currentUser, setCurrentUser] = useState<User>(() => getStorage('currentUser', INITIAL_CURRENT_USER));
  const [users, setUsers] = useState<User[]>(() => getStorage('users', DEMO_USERS));
  const [students, setStudents] = useState<StudentProfile[]>(() => getStorage('students', INITIAL_STUDENTS));
  const [timetable, setTimetable] = useState<TimetableLesson[]>(() => getStorage('timetable', INITIAL_TIMETABLE));
  const [documents, setDocuments] = useState<StudyDocument[]>(() => getStorage('documents', INITIAL_DOCUMENTS));
  const [assignments, setAssignments] = useState<Assignment[]>(() => getStorage('assignments', INITIAL_ASSIGNMENTS));
  const [knowledgeTips, setKnowledgeTips] = useState<KnowledgeTip[]>(() => getStorage('knowledgeTips', INITIAL_KNOWLEDGE_TIPS));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => getStorage('announcements', INITIAL_ANNOUNCEMENTS));
  const [events, setEvents] = useState<ClassEvent[]>(() => getStorage('events', INITIAL_EVENTS));
  const [albums, setAlbums] = useState<MemoryAlbum[]>(() => getStorage('albums', INITIAL_ALBUMS));
  const [memories, setMemories] = useState<MemoryItem[]>(() => getStorage('memories', INITIAL_MEMORIES));
  const [timelineMoments, setTimelineMoments] = useState<TimelineMoment[]>(() => getStorage('timelineMoments', INITIAL_TIMELINE_MOMENTS));
  const [polls, setPolls] = useState<ClassPoll[]>(() => getStorage('polls', INITIAL_POLLS));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => getStorage('activityLogs', INITIAL_ACTIVITY_LOGS));

  // Sync to localStorage
  useEffect(() => setStorage('settings', settings), [settings]);
  useEffect(() => setStorage('currentUser', currentUser), [currentUser]);
  useEffect(() => setStorage('users', users), [users]);
  useEffect(() => setStorage('students', students), [students]);
  useEffect(() => setStorage('timetable', timetable), [timetable]);
  useEffect(() => setStorage('documents', documents), [documents]);
  useEffect(() => setStorage('assignments', assignments), [assignments]);
  useEffect(() => setStorage('knowledgeTips', knowledgeTips), [knowledgeTips]);
  useEffect(() => setStorage('announcements', announcements), [announcements]);
  useEffect(() => setStorage('events', events), [events]);
  useEffect(() => setStorage('albums', albums), [albums]);
  useEffect(() => setStorage('memories', memories), [memories]);
  useEffect(() => setStorage('timelineMoments', timelineMoments), [timelineMoments]);
  useEffect(() => setStorage('polls', polls), [polls]);
  useEffect(() => setStorage('activityLogs', activityLogs), [activityLogs]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addActivityLog = (action: string, category: string) => {
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      category,
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const switchRole = (role: UserRole) => {
    const foundUser = users.find((u) => u.role === role);
    if (foundUser) {
      setCurrentUser(foundUser);
      addToast(`Đã chuyển vai trò sang: ${getRoleNameInVietnamese(role)}`, 'info');
      addActivityLog(`Đã chuyển phiên đăng nhập sang vai trò ${getRoleNameInVietnamese(role)}`, 'Tài khoản');
    } else {
      setCurrentUser((prev) => ({ ...prev, role }));
      addToast(`Đã chuyển vai trò sang: ${getRoleNameInVietnamese(role)}`, 'info');
    }
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, role: newRole }));
    }
    addToast('Đã cập nhật quyền hạn người dùng thành công');
    addActivityLog(`Cập nhật quyền hạn thành viên ID ${userId} thành ${getRoleNameInVietnamese(newRole)}`, 'Quản trị');
  };

  // Student actions
  const updateStudent = (id: string, updated: Partial<StudentProfile>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
    addToast('Hồ sơ học sinh đã được cập nhật');
    addActivityLog(`Cập nhật thông tin học sinh: ${updated.fullName || id}`, 'Thành viên');
  };

  const addStudent = (studentData: Omit<StudentProfile, 'id'>) => {
    const newStudent: StudentProfile = {
      ...studentData,
      id: 'std-' + Date.now(),
    };
    setStudents((prev) => [...prev, newStudent]);
    addToast('Đã thêm hồ sơ học sinh mới');
    addActivityLog(`Thêm mới thành viên lớp: ${studentData.fullName}`, 'Thành viên');
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    addToast('Đã xóa hồ sơ học sinh');
    addActivityLog(`Xóa hồ sơ thành viên ID ${id}`, 'Thành viên');
  };

  // Timetable actions
  const addLesson = (lesson: Omit<TimetableLesson, 'id'>) => {
    const newLesson: TimetableLesson = {
      ...lesson,
      id: 'tt-' + Date.now(),
    };
    setTimetable((prev) => [...prev, newLesson]);
    addToast(`Đã thêm tiết học ${lesson.subject}`);
    addActivityLog(`Thêm tiết học ${lesson.subject} vào Thời khóa biểu`, 'Thời khóa biểu');
  };

  const updateLesson = (id: string, updated: Partial<TimetableLesson>) => {
    setTimetable((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updated } : l))
    );
    addToast('Đã cập nhật thời khóa biểu');
    addActivityLog(`Cập nhật tiết học ID ${id}`, 'Thời khóa biểu');
  };

  const deleteLesson = (id: string) => {
    setTimetable((prev) => prev.filter((l) => l.id !== id));
    addToast('Đã xóa tiết học');
    addActivityLog(`Xóa tiết học ID ${id}`, 'Thời khóa biểu');
  };

  // Documents
  const addDocument = (doc: Omit<StudyDocument, 'id' | 'downloadsCount' | 'uploadedAt'>) => {
    const newDoc: StudyDocument = {
      ...doc,
      id: 'doc-' + Date.now(),
      downloadsCount: 0,
      uploadedAt: new Date().toISOString().slice(0, 10),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    addToast('Đã chia sẻ tài liệu học tập mới');
    addActivityLog(`Đăng tải tài liệu: ${doc.title}`, 'Học tập');
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    addToast('Đã gỡ tài liệu');
    addActivityLog(`Xóa tài liệu học tập ID ${id}`, 'Học tập');
  };

  const incrementDocDownloads = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, downloadsCount: d.downloadsCount + 1 } : d))
    );
  };

  // Assignments
  const toggleAssignmentComplete = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const completed = a.completedByUsers || [];
          const isDone = completed.includes(currentUser.id);
          const nextCompleted = isDone
            ? completed.filter((uid) => uid !== currentUser.id)
            : [...completed, currentUser.id];
          return {
            ...a,
            completedByUsers: nextCompleted,
            status: nextCompleted.length > 0 ? 'completed' : 'pending',
          };
        }
        return a;
      })
    );
    addToast('Đã cập nhật trạng thái bài tập');
  };

  const addAssignment = (asg: Omit<Assignment, 'id' | 'completedByUsers'>) => {
    const newAsg: Assignment = {
      ...asg,
      id: 'asg-' + Date.now(),
      completedByUsers: [],
    };
    setAssignments((prev) => [newAsg, ...prev]);
    addToast('Đã giao bài tập mới');
    addActivityLog(`Giao bài tập mới: ${asg.title}`, 'Học tập');
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    addToast('Đã xóa bài tập');
  };

  // Knowledge sharing
  const addKnowledgeTip = (tip: Omit<KnowledgeTip, 'id' | 'createdAt' | 'likes' | 'commentsCount'>) => {
    const newTip: KnowledgeTip = {
      ...tip,
      id: 'tip-' + Date.now(),
      createdAt: new Date().toISOString().slice(0, 10),
      likes: 1,
      commentsCount: 0,
    };
    setKnowledgeTips((prev) => [newTip, ...prev]);
    addToast('Đã chia sẻ kinh nghiệm học tập');
    addActivityLog(`Chia sẻ mẹo học tập: ${tip.title}`, 'Học tập');
  };

  const likeKnowledgeTip = (id: string) => {
    setKnowledgeTips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, likes: t.likes + 1 } : t))
    );
  };

  // Announcements
  const addAnnouncement = (anc: Omit<Announcement, 'id' | 'date' | 'readByUsers'>) => {
    const newAnc: Announcement = {
      ...anc,
      id: 'anc-' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      readByUsers: [currentUser.id],
    };
    setAnnouncements((prev) => [newAnc, ...prev]);
    addToast('Đã đăng thông báo mới thành công');
    addActivityLog(`Đăng thông báo: ${anc.title}`, 'Thông báo');
  };

  const togglePinAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
    addToast('Đã cập nhật trạng thái ghim thông báo');
  };

  const markAnnouncementAsRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => {
        if (a.id === id && !a.readByUsers.includes(currentUser.id)) {
          return { ...a, readByUsers: [...a.readByUsers, currentUser.id] };
        }
        return a;
      })
    );
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    addToast('Đã xóa thông báo');
    addActivityLog(`Xóa thông báo ID ${id}`, 'Thông báo');
  };

  // Events
  const toggleEventRegistration = (id: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === id) {
          const registered = evt.registeredUserIds.includes(currentUser.id);
          const nextList = registered
            ? evt.registeredUserIds.filter((uid) => uid !== currentUser.id)
            : [...evt.registeredUserIds, currentUser.id];
          return { ...evt, registeredUserIds: nextList };
        }
        return evt;
      })
    );
    addToast('Đã cập nhật danh sách tham gia hoạt động');
  };

  const addEvent = (evt: Omit<ClassEvent, 'id' | 'registeredUserIds'>) => {
    const newEvt: ClassEvent = {
      ...evt,
      id: 'evt-' + Date.now(),
      registeredUserIds: [currentUser.id],
    };
    setEvents((prev) => [newEvt, ...prev]);
    addToast('Đã tạo sự kiện mới');
    addActivityLog(`Tạo sự kiện mới: ${evt.name}`, 'Hoạt động');
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    addToast('Đã xóa sự kiện');
    addActivityLog(`Xóa sự kiện ID ${id}`, 'Hoạt động');
  };

  // Memory Lane
  const addAlbum = (album: Omit<MemoryAlbum, 'id' | 'createdAt' | 'itemCount'>) => {
    const newAlb: MemoryAlbum = {
      ...album,
      id: 'alb-' + Date.now(),
      createdAt: new Date().toISOString().slice(0, 10),
      itemCount: 0,
    };
    setAlbums((prev) => [...prev, newAlb]);
    addToast('Đã tạo album ảnh mới');
    addActivityLog(`Tạo album ảnh: ${album.name}`, 'Góc kỷ niệm');
  };

  const addMemory = (mem: Omit<MemoryItem, 'id' | 'likes' | 'likedByUserIds' | 'comments'>) => {
    const newMem: MemoryItem = {
      ...mem,
      id: 'mem-' + Date.now(),
      likes: 1,
      likedByUserIds: [currentUser.id],
      comments: [],
    };
    setMemories((prev) => [newMem, ...prev]);
    setAlbums((prev) =>
      prev.map((a) => (a.id === mem.albumId ? { ...a, itemCount: a.itemCount + 1 } : a))
    );
    addToast('Đã lưu giữ thêm một khoảnh khắc kỷ niệm');
    addActivityLog(`Đăng tải kỷ niệm: ${mem.title}`, 'Góc kỷ niệm');
  };

  const toggleLikeMemory = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const hasLiked = m.likedByUserIds.includes(currentUser.id);
          const nextLiked = hasLiked
            ? m.likedByUserIds.filter((uid) => uid !== currentUser.id)
            : [...m.likedByUserIds, currentUser.id];
          return {
            ...m,
            likedByUserIds: nextLiked,
            likes: nextLiked.length,
          };
        }
        return m;
      })
    );
  };

  const addCommentToMemory = (memoryId: string, content: string) => {
    if (!content.trim()) return;
    const newComment = {
      id: 'c-' + Date.now(),
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar || '',
      content: content.trim(),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setMemories((prev) =>
      prev.map((m) =>
        m.id === memoryId ? { ...m, comments: [...m.comments, newComment] } : m
      )
    );
    addToast('Đã để lại bình luận');
  };

  const deleteMemory = (id: string) => {
    const memory = memories.find((m) => m.id === id);
    if (memory) {
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === memory.albumId ? { ...a, itemCount: Math.max(0, a.itemCount - 1) } : a
        )
      );
    }
    setMemories((prev) => prev.filter((m) => m.id !== id));
    addToast('Đã gỡ kỷ niệm');
    addActivityLog(`Gỡ kỷ niệm ID ${id}`, 'Góc kỷ niệm');
  };

  // Timeline
  const addTimelineMoment = (tm: Omit<TimelineMoment, 'id'>) => {
    const newTm: TimelineMoment = {
      ...tm,
      id: 'tm-' + Date.now(),
    };
    setTimelineMoments((prev) => [...prev, newTm]);
    addToast('Đã thêm cột mốc vào dòng thời gian thanh xuân');
  };

  // Polls
  const votePoll = (pollId: string, optionId: string) => {
    setPolls((prev) =>
      prev.map((p) => {
        if (p.id === pollId) {
          if (p.isClosed) return p;

          // Check if already voted
          const hasVotedAny = p.options.some((opt) => opt.votedUserIds.includes(currentUser.id));
          if (!p.isMultipleChoice && hasVotedAny) {
            // Already voted on single-choice poll
            // switch vote to this option
            const updatedOptions = p.options.map((opt) => {
              const cleaned = opt.votedUserIds.filter((uid) => uid !== currentUser.id);
              if (opt.id === optionId) {
                return {
                  ...opt,
                  votedUserIds: [...cleaned, currentUser.id],
                  votesCount: cleaned.length + 1,
                };
              }
              return {
                ...opt,
                votedUserIds: cleaned,
                votesCount: cleaned.length,
              };
            });
            return {
              ...p,
              options: updatedOptions,
              totalVotes: updatedOptions.reduce((sum, opt) => sum + opt.votesCount, 0),
            };
          }

          // Multiple choice or first vote
          const updatedOptions = p.options.map((opt) => {
            if (opt.id === optionId) {
              const already = opt.votedUserIds.includes(currentUser.id);
              const nextUsers = already
                ? opt.votedUserIds.filter((uid) => uid !== currentUser.id)
                : [...opt.votedUserIds, currentUser.id];
              return {
                ...opt,
                votedUserIds: nextUsers,
                votesCount: nextUsers.length,
              };
            }
            return opt;
          });

          return {
            ...p,
            options: updatedOptions,
            totalVotes: updatedOptions.reduce((sum, opt) => sum + opt.votesCount, 0),
          };
        }
        return p;
      })
    );
    addToast('Đã ghi nhận bình chọn của bạn');
  };

  const addPoll = (pollData: Omit<ClassPoll, 'id' | 'createdAt' | 'totalVotes'>) => {
    const newPoll: ClassPoll = {
      ...pollData,
      id: 'poll-' + Date.now(),
      createdAt: new Date().toISOString().slice(0, 10),
      totalVotes: 0,
    };
    setPolls((prev) => [newPoll, ...prev]);
    addToast('Đã mở cuộc bình chọn mới');
    addActivityLog(`Tạo cuộc bình chọn: ${pollData.title}`, 'Bình chọn');
  };

  const toggleClosePoll = (pollId: string) => {
    setPolls((prev) =>
      prev.map((p) => (p.id === pollId ? { ...p, isClosed: !p.isClosed } : p))
    );
    addToast('Đã thay đổi trạng thái cuộc bình chọn');
  };

  const deletePoll = (pollId: string) => {
    setPolls((prev) => prev.filter((p) => p.id !== pollId));
    addToast('Đã xóa cuộc bình chọn');
    addActivityLog(`Xóa cuộc bình chọn ID ${pollId}`, 'Bình chọn');
  };

  // Settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Cài đặt lớp học đã được cập nhật');
    addActivityLog('Cập nhật cấu hình hệ thống lớp học', 'Cài đặt');
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setSettings(INITIAL_SETTINGS);
    setCurrentUser(INITIAL_CURRENT_USER);
    setUsers(DEMO_USERS);
    setStudents(INITIAL_STUDENTS);
    setTimetable(INITIAL_TIMETABLE);
    setDocuments(INITIAL_DOCUMENTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setKnowledgeTips(INITIAL_KNOWLEDGE_TIPS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setEvents(INITIAL_EVENTS);
    setAlbums(INITIAL_ALBUMS);
    setMemories(INITIAL_MEMORIES);
    setTimelineMoments(INITIAL_TIMELINE_MOMENTS);
    setPolls(INITIAL_POLLS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    addToast('Đã khôi phục dữ liệu ban đầu của lớp 12/2B', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeRole: currentUser.role,
        switchRole,
        users,
        updateUserRole,
        students,
        updateStudent,
        addStudent,
        deleteStudent,
        timetable,
        addLesson,
        updateLesson,
        deleteLesson,
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
        announcements,
        addAnnouncement,
        togglePinAnnouncement,
        markAnnouncementAsRead,
        deleteAnnouncement,
        events,
        toggleEventRegistration,
        addEvent,
        deleteEvent,
        albums,
        addAlbum,
        memories,
        addMemory,
        toggleLikeMemory,
        addCommentToMemory,
        deleteMemory,
        timelineMoments,
        addTimelineMoment,
        polls,
        votePoll,
        addPoll,
        toggleClosePoll,
        deletePoll,
        activityLogs,
        addActivityLog,
        settings,
        updateSettings,
        resetToDefaults,
        activeTab,
        setActiveTab,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export function getRoleNameInVietnamese(role: UserRole): string {
  switch (role) {
    case 'super_admin':
      return 'Quản trị viên Cấp cao (Super Admin)';
    case 'class_admin':
      return 'Ban Cán Sự Lớp (Class Admin)';
    case 'teacher':
      return 'Giáo Viên (Teacher)';
    case 'student':
      return 'Học Sinh (Student)';
    default:
      return role;
  }
}
