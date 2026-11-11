/**
 * Types for 12/2B - Our Last Chapter | THPT Phan Bội Châu
 */

export type UserRole = 'super_admin' | 'class_admin' | 'teacher' | 'student';

export type ClassPosition =
  | 'Giáo viên chủ nhiệm'
  | 'Lớp trưởng'
  | 'Lớp phó học tập'
  | 'Lớp phó phong trào'
  | 'Bí thư chi đoàn'
  | 'Tổ trưởng'
  | 'Thành viên';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  position: ClassPosition;
  avatar: string;
  bio?: string;
  phone?: string;
  motto?: string;
  favoriteSubjects?: string[];
  hobbies?: string[];
  gender?: 'Nam' | 'Nữ' | 'Khác';
}

export interface StudentProfile {
  id: string;
  fullName: string;
  position: ClassPosition;
  avatar: string;
  bio: string;
  favoriteSubjects: string[];
  hobbies: string[];
  motto: string;
  birthday?: string;
  gender?: 'Nam' | 'Nữ' | 'Khác';
  dreamCareer?: string;
  groupNumber?: number; // Tổ 1, Tổ 2, Tổ 3, Tổ 4
}

export interface TimetableLesson {
  id: string;
  dayOfWeek: number; // 2 to 7 (Thứ Hai = 2, Thứ Bảy = 7)
  period: number; // 1 to 5 (Sáng), 6 to 8 (Chiều)
  subject: string;
  teacher: string;
  room: string;
  session: 'morning' | 'afternoon';
  note?: string;
  color?: string;
}

export type SubjectCategory =
  | 'Toán'
  | 'Ngữ văn'
  | 'Tiếng Anh'
  | 'Vật lí'
  | 'Hóa học'
  | 'Sinh học'
  | 'Lịch sử'
  | 'Địa lí'
  | 'GDKT & PL'
  | 'Tin học'
  | 'Các môn khác';

export interface StudyDocument {
  id: string;
  title: string;
  subject: SubjectCategory;
  fileType: 'pdf' | 'docx' | 'pptx' | 'image' | 'link';
  fileUrl: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploaderRole: string;
  uploadedAt: string;
  downloadsCount: number;
  description?: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: SubjectCategory;
  description: string;
  deadline: string;
  assignedBy: string;
  status: 'pending' | 'completed';
  completedByUsers?: string[]; // IDs of users who marked completed
  attachmentName?: string;
  attachmentUrl?: string;
}

export interface KnowledgeTip {
  id: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  subject: SubjectCategory;
  content: string;
  createdAt: string;
  likes: number;
  commentsCount: number;
  tags: string[];
}

export type AnnouncementCategory =
  | 'Chung'
  | 'Học tập'
  | 'Lịch học'
  | 'Sự kiện'
  | 'Khẩn cấp';

export type PriorityLevel = 'Khẩn cấp' | 'Quan trọng' | 'Bình thường';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  category: AnnouncementCategory;
  priority: PriorityLevel;
  isPinned: boolean;
  imageUrl?: string;
  readByUsers: string[];
}

export type EventCategory =
  | 'Hoạt động học tập'
  | 'Văn nghệ'
  | 'Thể thao'
  | 'Hoạt động ngoại khóa'
  | 'Hoạt động tập thể'
  | 'Kỷ yếu và lễ trưởng thành';

export interface ClassEvent {
  id: string;
  name: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string;
  organizer: string;
  coverImage: string;
  category: EventCategory;
  registrationDeadline: string;
  registeredUserIds: string[];
}

export interface MemoryComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface MemoryItem {
  id: string;
  albumId: string;
  title: string;
  imageUrl: string;
  caption: string;
  date: string;
  location?: string;
  uploadedBy: string;
  likes: number;
  likedByUserIds: string[];
  comments: MemoryComment[];
}

export interface MemoryAlbum {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  createdAt: string;
  itemCount: number;
}

export interface TimelineMoment {
  id: string;
  date: string;
  title: string;
  quote: string;
  author: string;
  imageUrl: string;
  milestone: string;
}

export interface PollOption {
  id: string;
  text: string;
  votesCount: number;
  votedUserIds: string[];
}

export interface ClassPoll {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  deadline: string;
  isClosed: boolean;
  isAnonymous: boolean;
  isMultipleChoice: boolean;
  options: PollOption[];
  totalVotes: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  category: string;
}

export interface AppSettings {
  graduationDate: string; // e.g. "2027-06-25T08:00:00"
  schoolName: string;
  className: string;
  academicYear: string;
  classSlogan: string;
  advisorName: string;
}
