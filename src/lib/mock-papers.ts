// Shared mock data for "Đề kiểm tra" và "Phiếu bài tập"
// Used by: teacher/exam (creator), teacher/test (test scheduling), teacher/assign (homework assignment).

export type PaperKind = "exam" | "worksheet";

export interface Paper {
  id: string;
  kind: PaperKind;
  title: string;
  subject: string;
  grade: string;
  questionCount: number;
  durationMin: number;
  createdAt: string;
  source: "ai" | "matrix" | "manual";
  // Difficulty distribution
  easy: number;
  medium: number;
  hard: number;
}

export const PAPERS: Paper[] = [
  {
    id: "p1",
    kind: "exam",
    title: "Đề kiểm tra 15 phút - Bài 2",
    subject: "Khoa học",
    grade: "Lớp 4",
    questionCount: 10,
    durationMin: 15,
    createdAt: "Hôm nay",
    source: "ai",
    easy: 4,
    medium: 4,
    hard: 2,
  },
  {
    id: "p2",
    kind: "exam",
    title: "Đề KT giữa kỳ I - Khoa học 4",
    subject: "Khoa học",
    grade: "Lớp 4",
    questionCount: 40,
    durationMin: 60,
    createdAt: "3 ngày trước",
    source: "matrix",
    easy: 16,
    medium: 16,
    hard: 8,
  },
  {
    id: "p3",
    kind: "worksheet",
    title: "Phiếu bài tập Bài 1: Tính chất của nước",
    subject: "Khoa học",
    grade: "Lớp 4",
    questionCount: 12,
    durationMin: 25,
    createdAt: "Hôm qua",
    source: "matrix",
    easy: 6,
    medium: 4,
    hard: 2,
  },
  {
    id: "p4",
    kind: "worksheet",
    title: "Phiếu ôn tập chương 1",
    subject: "Khoa học",
    grade: "Lớp 4",
    questionCount: 30,
    durationMin: 45,
    createdAt: "Hôm qua",
    source: "ai",
    easy: 12,
    medium: 12,
    hard: 6,
  },
  {
    id: "p5",
    kind: "worksheet",
    title: "Phiếu bài tập Vòng tuần hoàn của nước",
    subject: "Khoa học",
    grade: "Lớp 4",
    questionCount: 8,
    durationMin: 20,
    createdAt: "Tuần trước",
    source: "manual",
    easy: 3,
    medium: 3,
    hard: 2,
  },
  {
    id: "p6",
    kind: "exam",
    title: "Quiz Kahoot Vòng tuần hoàn",
    subject: "Khoa học",
    grade: "Lớp 4",
    questionCount: 15,
    durationMin: 10,
    createdAt: "Tuần trước",
    source: "ai",
    easy: 8,
    medium: 5,
    hard: 2,
  },
  // ===== Toán 4 =====
  {
    id: "pt1",
    kind: "worksheet",
    title: "Phiếu bài tập Bài 1: Ôn tập các số đến 100 000",
    subject: "Toán",
    grade: "Lớp 4",
    questionCount: 10,
    durationMin: 20,
    createdAt: "Hôm nay",
    source: "matrix",
    easy: 5,
    medium: 3,
    hard: 2,
  },
  {
    id: "pt2",
    kind: "worksheet",
    title: "Phiếu bài tập Bài 4: Biểu thức chứa chữ",
    subject: "Toán",
    grade: "Lớp 4",
    questionCount: 12,
    durationMin: 25,
    createdAt: "Hôm qua",
    source: "matrix",
    easy: 5,
    medium: 5,
    hard: 2,
  },
  {
    id: "pt3",
    kind: "worksheet",
    title: "Phiếu ôn tập Chủ đề 3: Số có nhiều chữ số",
    subject: "Toán",
    grade: "Lớp 4",
    questionCount: 20,
    durationMin: 35,
    createdAt: "2 ngày trước",
    source: "ai",
    easy: 8,
    medium: 8,
    hard: 4,
  },
  {
    id: "pt4",
    kind: "worksheet",
    title: "Phiếu bài tập Hàng và lớp",
    subject: "Toán",
    grade: "Lớp 4",
    questionCount: 10,
    durationMin: 20,
    createdAt: "Tuần trước",
    source: "manual",
    easy: 4,
    medium: 4,
    hard: 2,
  },
  {
    id: "pt5",
    kind: "exam",
    title: "Đề kiểm tra 15 phút - Số chẵn, số lẻ",
    subject: "Toán",
    grade: "Lớp 4",
    questionCount: 10,
    durationMin: 15,
    createdAt: "Hôm nay",
    source: "ai",
    easy: 4,
    medium: 4,
    hard: 2,
  },
  {
    id: "pt6",
    kind: "exam",
    title: "Đề KT giữa kỳ I - Toán 4",
    subject: "Toán",
    grade: "Lớp 4",
    questionCount: 30,
    durationMin: 45,
    createdAt: "3 ngày trước",
    source: "matrix",
    easy: 12,
    medium: 12,
    hard: 6,
  },
  {
    id: "pt7",
    kind: "exam",
    title: "Đề kiểm tra Chủ đề 2: Góc và đơn vị đo góc",
    subject: "Toán",
    grade: "Lớp 4",
    questionCount: 15,
    durationMin: 30,
    createdAt: "Tuần trước",
    source: "ai",
    easy: 6,
    medium: 6,
    hard: 3,
  },
];

export const KIND_LABEL: Record<PaperKind, string> = {
  exam: "Đề kiểm tra",
  worksheet: "Phiếu bài tập",
};

export const SOURCE_LABEL: Record<Paper["source"], string> = {
  ai: "AI sinh",
  matrix: "Theo SBT",
  manual: "Thủ công",
};

export const SOURCE_BADGE_CLASS: Record<Paper["source"], string> = {
  matrix: "bg-info/15 text-info",
  manual: "bg-warning/20 text-warning-foreground",
  ai: "bg-fun/15 text-fun",
};

// Test/exam schedules (drawn from PAPERS where kind === "exam")
export interface TestSchedule {
  id: string;
  paperId: string;
  className: string;
  date: string;
  status: "scheduled" | "ongoing" | "done";
  submitted?: number;
  total?: number;
}

export const TEST_SCHEDULES: TestSchedule[] = [
  {
    id: "t1",
    paperId: "p1",
    className: "4A",
    date: "20/04/2026 - Tiết 2",
    status: "scheduled",
    total: 32,
  },
  {
    id: "t2",
    paperId: "p2",
    className: "4A",
    date: "15/04/2026 - Tiết 3",
    status: "done",
    submitted: 32,
    total: 32,
  },
  {
    id: "t3",
    paperId: "p6",
    className: "4B",
    date: "Đang diễn ra",
    status: "ongoing",
    submitted: 18,
    total: 30,
  },
];
