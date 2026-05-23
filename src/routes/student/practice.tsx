import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { StudentShell } from "@/components/StudentShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LESSONS } from "@/lib/mock-data";
import {
  Dumbbell,
  Gamepad2,
  Award,
  BookOpen,
  Sparkles,
  ArrowRight,
  Library,
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/practice")({
  head: () => ({ meta: [{ title: "Luyện tập | NXBGDVN" }] }),
  component: Practice,
});

const SUBJECTS = [
  { key: "all", label: "Tất cả", emoji: "✨" },
  { key: "khtn", label: "Khoa học", emoji: "🔬" },
  { key: "toan", label: "Toán", emoji: "🔢" },
  { key: "tv", label: "Tiếng Việt", emoji: "📖" },
  { key: "ls", label: "Lịch sử & Địa lí", emoji: "🌏" },
  { key: "ta", label: "Tiếng Anh", emoji: "🇬🇧" },
] as const;

const MODES = [
  {
    id: "practice",
    label: "Luyện tập",
    icon: Dumbbell,
    desc: "Có gợi ý, không tính giờ",
    color: "bg-info/15 text-info",
  },
  {
    id: "game",
    label: "Chơi game",
    icon: Gamepad2,
    desc: "Vui nhộn, có XP & huy hiệu",
    color: "bg-fun/15 text-fun",
  },
  {
    id: "test",
    label: "Thi thử",
    icon: Award,
    desc: "Tính giờ, chấm điểm",
    color: "bg-warning/15 text-warning-foreground",
  },
] as const;

type ModeId = (typeof MODES)[number]["id"];
type SubjectKey = (typeof SUBJECTS)[number]["key"];

// ===== MOCK: Năng lực (gợi ý theo điểm yếu của học sinh) =====
interface CompetencyItem {
  id: string;
  skill: string;
  subject: SubjectKey;
  subjectLabel: string;
  mastery: number; // 0-100
  trend: "up" | "down" | "flat";
  recommendation: string;
  questionCount: number;
  lessonId: string;
  priority: "high" | "medium" | "low";
}

const COMPETENCIES: CompetencyItem[] = [
  {
    id: "c1",
    skill: "Phép cộng có nhớ trong phạm vi 100 000",
    subject: "toan",
    subjectLabel: "Toán",
    mastery: 42,
    trend: "down",
    recommendation: "Em cần luyện thêm 10 câu để vững kỹ năng đặt tính",
    questionCount: 10,
    lessonId: "toan-bai-1",
    priority: "high",
  },
  {
    id: "c2",
    skill: "Biểu thức chứa chữ",
    subject: "toan",
    subjectLabel: "Toán",
    mastery: 55,
    trend: "up",
    recommendation: "Tiến bộ tốt — luyện thêm 8 câu để đạt thành thạo",
    questionCount: 8,
    lessonId: "toan-bai-4",
    priority: "medium",
  },
  {
    id: "c3",
    skill: "Vòng tuần hoàn của nước",
    subject: "khtn",
    subjectLabel: "Khoa học",
    mastery: 38,
    trend: "flat",
    recommendation: "Còn lúng túng — ôn lại 12 câu lý thuyết & ứng dụng",
    questionCount: 12,
    lessonId: "bai-2",
    priority: "high",
  },
  {
    id: "c4",
    skill: "Tính chất của nước",
    subject: "khtn",
    subjectLabel: "Khoa học",
    mastery: 72,
    trend: "up",
    recommendation: "Khá vững — thử 6 câu nâng cao",
    questionCount: 6,
    lessonId: "bai-1",
    priority: "low",
  },
  {
    id: "c5",
    skill: "Đọc hiểu đoạn văn",
    subject: "tv",
    subjectLabel: "Tiếng Việt",
    mastery: 50,
    trend: "flat",
    recommendation: "Cần luyện thêm kỹ năng tìm ý chính — 8 câu",
    questionCount: 8,
    lessonId: "bai-1",
    priority: "medium",
  },
  {
    id: "c6",
    skill: "Từ vựng cơ bản (Family, School)",
    subject: "ta",
    subjectLabel: "Tiếng Anh",
    mastery: 60,
    trend: "up",
    recommendation: "Ôn flashcard 10 từ mới mỗi ngày",
    questionCount: 10,
    lessonId: "bai-1",
    priority: "medium",
  },
];

const PRIORITY_COLOR = {
  high: "bg-destructive/15 text-destructive border-destructive/40",
  medium: "bg-warning/15 text-warning-foreground border-warning/40",
  low: "bg-success/15 text-success border-success/40",
} as const;
const PRIORITY_LABEL = {
  high: "Ưu tiên cao",
  medium: "Nên luyện",
  low: "Củng cố",
} as const;

// ===== MOCK: Thư viện SBT (bài có sẵn trên hệ thống) =====
interface LibraryItem {
  id: string;
  title: string;
  subject: SubjectKey;
  subjectLabel: string;
  topic: string;
  questionCount: number;
  difficulty: "easy" | "medium" | "hard";
  lessonId: string;
}

const DIFF_LABEL = { easy: "Dễ", medium: "TB", hard: "Khó" } as const;
const DIFF_COLOR = {
  easy: "bg-success/15 text-success",
  medium: "bg-info/15 text-info",
  hard: "bg-destructive/15 text-destructive",
} as const;

// Map 4 lessons có sẵn + thêm mock các môn khác
const LIBRARY: LibraryItem[] = [
  ...LESSONS.map<LibraryItem>((l, i) => {
    const isTV1 = l.id.startsWith("tv1-");
    return {
      id: `lib-${l.id}`,
      title: l.title,
      subject: isTV1 ? "tv" : "khtn",
      subjectLabel: isTV1 ? "Tiếng Việt" : "Khoa học",
      topic: l.topic,
      questionCount: l.questions.length,
      difficulty: (["easy", "medium", "medium", "hard"] as const)[i % 4],
      lessonId: l.id,
    };
  }),
  {
    id: "lib-t1",
    title: "Phép cộng & trừ trong phạm vi 1000",
    subject: "toan",
    subjectLabel: "Toán",
    topic: "Chương 1",
    questionCount: 15,
    difficulty: "easy",
    lessonId: "bai-1",
  },
  {
    id: "lib-t2",
    title: "Phép nhân với số có một chữ số",
    subject: "toan",
    subjectLabel: "Toán",
    topic: "Chương 1",
    questionCount: 12,
    difficulty: "medium",
    lessonId: "bai-1",
  },
  {
    id: "lib-t3",
    title: "Phân số - Khái niệm cơ bản",
    subject: "toan",
    subjectLabel: "Toán",
    topic: "Chương 2",
    questionCount: 10,
    difficulty: "medium",
    lessonId: "bai-1",
  },
  {
    id: "lib-t4",
    title: "Giải toán có lời văn",
    subject: "toan",
    subjectLabel: "Toán",
    topic: "Chương 3",
    questionCount: 8,
    difficulty: "hard",
    lessonId: "bai-1",
  },
  {
    id: "lib-tv1",
    title: "Từ loại - Danh từ, động từ, tính từ",
    subject: "tv",
    subjectLabel: "Tiếng Việt",
    topic: "Tuần 1-3",
    questionCount: 12,
    difficulty: "easy",
    lessonId: "bai-1",
  },
  {
    id: "lib-tv2",
    title: "Câu kể, câu hỏi, câu cảm",
    subject: "tv",
    subjectLabel: "Tiếng Việt",
    topic: "Tuần 4-6",
    questionCount: 10,
    difficulty: "medium",
    lessonId: "bai-1",
  },
  {
    id: "lib-tv3",
    title: "Viết đoạn văn tả cảnh",
    subject: "tv",
    subjectLabel: "Tiếng Việt",
    topic: "Tuần 7",
    questionCount: 5,
    difficulty: "hard",
    lessonId: "bai-1",
  },
  {
    id: "lib-ls1",
    title: "Vua Hùng dựng nước",
    subject: "ls",
    subjectLabel: "Lịch sử & Địa lí",
    topic: "Chủ đề 1",
    questionCount: 8,
    difficulty: "easy",
    lessonId: "bai-1",
  },
  {
    id: "lib-ls2",
    title: "Khởi nghĩa Hai Bà Trưng",
    subject: "ls",
    subjectLabel: "Lịch sử & Địa lí",
    topic: "Chủ đề 2",
    questionCount: 10,
    difficulty: "medium",
    lessonId: "bai-1",
  },
  {
    id: "lib-ta1",
    title: "Unit 1: Hello",
    subject: "ta",
    subjectLabel: "Tiếng Anh",
    topic: "Unit 1",
    questionCount: 10,
    difficulty: "easy",
    lessonId: "bai-1",
  },
  {
    id: "lib-ta2",
    title: "Unit 2: My school",
    subject: "ta",
    subjectLabel: "Tiếng Anh",
    topic: "Unit 2",
    questionCount: 12,
    difficulty: "medium",
    lessonId: "bai-1",
  },
];

function SubjectChips({
  subject,
  onChange,
}: {
  subject: SubjectKey;
  onChange: (k: SubjectKey) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUBJECTS.map((s) => (
        <button
          key={s.key}
          onClick={() => onChange(s.key)}
          className={cn(
            "px-3 py-1.5 rounded-full border-2 text-xs font-bold transition-all",
            subject === s.key
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card hover:border-primary/60",
          )}
        >
          <span className="mr-1">{s.emoji}</span>
          {s.label}
        </button>
      ))}
    </div>
  );
}

function ModePicker({
  mode,
  onChange,
}: {
  mode: ModeId;
  onChange: (m: ModeId) => void;
}) {
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={cn(
            "text-left p-3 rounded-xl border-2 transition-all",
            mode === m.id
              ? "border-primary bg-primary/5 -translate-y-0.5 shadow-sm"
              : "border-border bg-card hover:border-primary/60",
          )}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "size-9 rounded-lg flex items-center justify-center",
                m.color,
              )}
            >
              <m.icon className="size-4" />
            </div>
            <div>
              <div className="font-bold text-sm">{m.label}</div>
              <div className="text-[11px] text-muted-foreground">{m.desc}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function Practice() {
  const [tab, setTab] = useState<"competency" | "library">("competency");
  const [subject, setSubject] = useState<SubjectKey>("all");
  const [mode, setMode] = useState<ModeId>("practice");

  const competencies = useMemo(
    () =>
      COMPETENCIES.filter(
        (a) => subject === "all" || a.subject === subject,
      ).sort((a, b) => {
        const order = { high: 0, medium: 1, low: 2 } as const;
        return order[a.priority] - order[b.priority];
      }),
    [subject],
  );
  const library = useMemo(
    () => LIBRARY.filter((a) => subject === "all" || a.subject === subject),
    [subject],
  );

  return (
    <StudentShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-5">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Dumbbell className="text-primary" /> Luyện tập
          </h1>
          <p className="text-muted-foreground">
            Luyện thêm bài cô giao không bắt buộc, hoặc khám phá kho sách bài
            tập của NXBGDVN — học theo ý em!
          </p>
        </div>

        {/* Mode picker */}
        <Card className="p-4 border-2">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-4 text-primary" />
            <div className="text-xs uppercase font-bold text-muted-foreground">
              Chọn chế độ luyện tập
            </div>
          </div>
          <ModePicker mode={mode} onChange={setMode} />
        </Card>

        {/* Subject filter */}
        <Card className="p-4 border-2">
          <div className="text-xs uppercase font-bold text-muted-foreground mb-2">
            Lọc theo môn
          </div>
          <SubjectChips subject={subject} onChange={setSubject} />
        </Card>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="grid grid-cols-2 w-full max-w-xl">
            <TabsTrigger value="competency" className="gap-2">
              <Brain className="size-4" />
              Theo năng lực
              <Badge variant="secondary" className="ml-1">
                {COMPETENCIES.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="library" className="gap-2">
              <Library className="size-4" />
              Thư viện SBT
              <Badge variant="secondary" className="ml-1">
                {LIBRARY.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Theo năng lực */}
          <TabsContent value="competency" className="mt-4">
            <Card className="p-4 border-2 border-primary/30 bg-primary/5 mb-4">
              <div className="flex items-start gap-3">
                <Brain className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm">
                  <b className="text-primary">AI gợi ý theo năng lực của em</b>{" "}
                  — phân tích từ kết quả bài tập gần đây. Tập trung những kỹ
                  năng còn yếu để tiến bộ nhanh nhất!
                </div>
              </div>
            </Card>

            {competencies.length === 0 ? (
              <EmptyState text="Chưa có dữ liệu năng lực ở môn này. Hãy luyện tập thêm để AI gợi ý nhé!" />
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {competencies.map((a) => (
                  <CompetencyCard key={a.id} item={a} mode={mode} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 2: Library */}
          <TabsContent value="library" className="mt-4">
            <Card className="p-4 border-2 border-info/30 bg-info/5 mb-4">
              <div className="flex items-start gap-3">
                <BookOpen className="size-5 text-info shrink-0 mt-0.5" />
                <div className="text-sm">
                  <b className="text-info">Kho sách bài tập NXBGDVN</b> — tất cả
                  bài trong chương trình em đang học. Tự chọn bài bất kỳ để
                  luyện thêm, không cần cô giao.
                </div>
              </div>
            </Card>

            {library.length === 0 ? (
              <EmptyState text="Không có bài nào trong môn này." />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {library.map((item) => (
                  <LibraryCard key={item.id} item={item} mode={mode} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </StudentShell>
  );
}

function CompetencyCard({
  item,
  mode,
}: {
  item: CompetencyItem;
  mode: ModeId;
}) {
  const modeObj = MODES.find((m) => m.id === mode)!;
  const TrendIcon =
    item.trend === "up"
      ? TrendingUp
      : item.trend === "down"
        ? TrendingDown
        : Target;
  const trendColor =
    item.trend === "up"
      ? "text-success"
      : item.trend === "down"
        ? "text-destructive"
        : "text-muted-foreground";
  return (
    <Card className="p-4 border-2 hover:border-primary transition-all hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase font-bold text-muted-foreground">
            {item.subjectLabel}
          </div>
          <div className="font-display font-bold mt-0.5">{item.skill}</div>
        </div>
        <span
          className={cn(
            "shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border",
            PRIORITY_COLOR[item.priority],
          )}
        >
          {PRIORITY_LABEL[item.priority]}
        </span>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Mức độ thành thạo</span>
          <span
            className={cn(
              "font-bold inline-flex items-center gap-1",
              trendColor,
            )}
          >
            <TrendIcon className="size-3.5" />
            {item.mastery}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              item.mastery < 50
                ? "bg-destructive"
                : item.mastery < 70
                  ? "bg-warning"
                  : "bg-success",
            )}
            style={{ width: `${item.mastery}%` }}
          />
        </div>
      </div>

      <div className="mt-3 text-xs text-muted-foreground italic">
        💡 {item.recommendation}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold",
            modeObj.color,
          )}
        >
          <modeObj.icon className="size-3" />
          {modeObj.label} · {item.questionCount} câu
        </span>
        <Link
          to="/student/lesson/$lessonId"
          params={{ lessonId: item.lessonId }}
        >
          <Button size="sm" className="btn-pop rounded-full">
            Luyện ngay
            <ArrowRight className="size-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

function LibraryCard({ item, mode }: { item: LibraryItem; mode: ModeId }) {
  const modeObj = MODES.find((m) => m.id === mode)!;
  return (
    <Card className="p-4 border-2 hover:border-primary transition-all hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="text-[11px] uppercase font-bold text-muted-foreground truncate">
          {item.subjectLabel} · {item.topic}
        </div>
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full",
            DIFF_COLOR[item.difficulty],
          )}
        >
          {DIFF_LABEL[item.difficulty]}
        </span>
      </div>
      <div className="font-display font-bold text-sm">{item.title}</div>
      <div className="mt-2 text-xs text-muted-foreground inline-flex items-center gap-1">
        <BookOpen className="size-3.5" />
        {item.questionCount} câu hỏi
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold",
            modeObj.color,
          )}
        >
          <modeObj.icon className="size-3" />
          {modeObj.label}
        </span>
        <Link
          to="/student/lesson/$lessonId"
          params={{ lessonId: item.lessonId }}
        >
          <Button size="sm" variant="secondary" className="rounded-full">
            Luyện
            <ArrowRight className="size-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <Card className="p-8 border-2 border-dashed text-center">
      <BookOpen className="size-10 text-muted-foreground mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </Card>
  );
}
