import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { StudentShell } from "@/components/StudentShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Sparkles,
  Target,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Brain,
  BookOpen,
} from "lucide-react";
import { LESSONS } from "@/lib/mock-data";

// Palette tươi sáng, đồng bộ design tokens (oklch)
const C = {
  primary: "oklch(0.72 0.18 45)",
  success: "oklch(0.7 0.16 150)",
  info: "oklch(0.68 0.15 240)",
  warning: "oklch(0.82 0.16 75)",
  fun: "oklch(0.72 0.2 320)",
  destructive: "oklch(0.65 0.22 25)",
  border: "oklch(0.91 0.02 80)",
  muted: "oklch(0.5 0.03 250)",
};

function masteryColor(m: number) {
  if (m >= 75) return C.success;
  if (m >= 60) return C.info;
  if (m >= 45) return C.warning;
  return C.destructive;
}

export const Route = createFileRoute("/student/competency")({
  head: () => ({ meta: [{ title: "Năng lực của tôi | Học sinh - NXBGDVN" }] }),
  component: CompetencyPage,
});

// ===== MOCK: Dữ liệu năng lực theo từng môn (Prototype - PA1) =====
type SubjectKey = "khtn" | "toan" | "tv" | "ls" | "ta";

type SubjectData = {
  key: SubjectKey;
  name: string;
  emoji: string;
  color: string;
  bloom: { level: string; short: string; correct: number; total: number }[];
  topics: { topic: string; mastery: number; weakLevel: string | null }[];
};

const SUBJECTS: SubjectData[] = [
  {
    key: "khtn",
    name: "Khoa học tự nhiên",
    emoji: "🔬",
    color: C.success,
    bloom: [
      { level: "Nhận biết", short: "NB", correct: 38, total: 42 },
      { level: "Thông hiểu", short: "TH", correct: 28, total: 36 },
      { level: "Vận dụng", short: "VD", correct: 14, total: 28 },
      { level: "Vận dụng cao", short: "VDC", correct: 4, total: 16 },
    ],
    topics: [
      { topic: "Tính chất của nước", mastery: 88, weakLevel: null },
      { topic: "Vòng tuần hoàn của nước", mastery: 52, weakLevel: "Vận dụng" },
      { topic: "Bảo vệ nguồn nước", mastery: 71, weakLevel: "Vận dụng cao" },
      { topic: "Không khí", mastery: 64, weakLevel: "Thông hiểu" },
      { topic: "Gió và bão", mastery: 45, weakLevel: "Vận dụng" },
      { topic: "Ánh sáng", mastery: 78, weakLevel: null },
    ],
  },
  {
    key: "toan",
    name: "Toán",
    emoji: "🔢",
    color: C.primary,
    bloom: [
      { level: "Nhận biết", short: "NB", correct: 45, total: 48 },
      { level: "Thông hiểu", short: "TH", correct: 32, total: 40 },
      { level: "Vận dụng", short: "VD", correct: 22, total: 36 },
      { level: "Vận dụng cao", short: "VDC", correct: 6, total: 20 },
    ],
    topics: [
      { topic: "Phép cộng & trừ", mastery: 92, weakLevel: null },
      { topic: "Phép nhân & chia", mastery: 81, weakLevel: null },
      { topic: "Phân số", mastery: 58, weakLevel: "Vận dụng" },
      { topic: "Hình học cơ bản", mastery: 67, weakLevel: "Thông hiểu" },
      { topic: "Đo lường", mastery: 49, weakLevel: "Vận dụng" },
      { topic: "Giải toán có lời văn", mastery: 41, weakLevel: "Vận dụng cao" },
    ],
  },
  {
    key: "tv",
    name: "Tiếng Việt",
    emoji: "📖",
    color: C.fun,
    bloom: [
      { level: "Nhận biết", short: "NB", correct: 40, total: 44 },
      { level: "Thông hiểu", short: "TH", correct: 30, total: 38 },
      { level: "Vận dụng", short: "VD", correct: 18, total: 30 },
      { level: "Vận dụng cao", short: "VDC", correct: 8, total: 18 },
    ],
    topics: [
      { topic: "Từ loại", mastery: 84, weakLevel: null },
      { topic: "Câu kể, câu hỏi", mastery: 76, weakLevel: null },
      { topic: "Đọc hiểu", mastery: 62, weakLevel: "Thông hiểu" },
      { topic: "Viết đoạn văn", mastery: 54, weakLevel: "Vận dụng" },
      { topic: "Chính tả", mastery: 70, weakLevel: null },
      { topic: "Tập làm văn", mastery: 44, weakLevel: "Vận dụng cao" },
    ],
  },
  {
    key: "ls",
    name: "Lịch sử & Địa lí",
    emoji: "🌏",
    color: C.info,
    bloom: [
      { level: "Nhận biết", short: "NB", correct: 32, total: 38 },
      { level: "Thông hiểu", short: "TH", correct: 22, total: 32 },
      { level: "Vận dụng", short: "VD", correct: 10, total: 24 },
      { level: "Vận dụng cao", short: "VDC", correct: 3, total: 14 },
    ],
    topics: [
      { topic: "Vua Hùng dựng nước", mastery: 80, weakLevel: null },
      {
        topic: "Khởi nghĩa Hai Bà Trưng",
        mastery: 66,
        weakLevel: "Thông hiểu",
      },
      { topic: "Bản đồ Việt Nam", mastery: 48, weakLevel: "Vận dụng" },
      { topic: "Khí hậu các vùng", mastery: 42, weakLevel: "Vận dụng" },
      { topic: "Dân cư & dân tộc", mastery: 58, weakLevel: "Thông hiểu" },
    ],
  },
  {
    key: "ta",
    name: "Tiếng Anh",
    emoji: "🇬🇧",
    color: C.warning,
    bloom: [
      { level: "Nhận biết", short: "NB", correct: 36, total: 40 },
      { level: "Thông hiểu", short: "TH", correct: 25, total: 34 },
      { level: "Vận dụng", short: "VD", correct: 12, total: 26 },
      { level: "Vận dụng cao", short: "VDC", correct: 5, total: 16 },
    ],
    topics: [
      { topic: "Từ vựng cơ bản", mastery: 86, weakLevel: null },
      { topic: "Ngữ pháp - Thì hiện tại", mastery: 72, weakLevel: null },
      { topic: "Đọc hiểu đoạn ngắn", mastery: 55, weakLevel: "Vận dụng" },
      { topic: "Nghe hiểu", mastery: 48, weakLevel: "Vận dụng" },
      { topic: "Viết câu", mastery: 40, weakLevel: "Vận dụng cao" },
    ],
  },
];

function subjectOverall(s: SubjectData) {
  const c = s.bloom.reduce((sum, b) => sum + b.correct, 0);
  const t = s.bloom.reduce((sum, b) => sum + b.total, 0);
  return Math.round((c / t) * 100);
}

function CompetencyPage() {
  const [selectedKey, setSelectedKey] = useState<SubjectKey>(SUBJECTS[0].key);
  const selected = SUBJECTS.find((s) => s.key === selectedKey)!;

  return (
    <StudentShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Brain className="text-primary" /> Năng lực của em
          </h1>
          <p className="text-muted-foreground">
            Đang xem môn: {selected.emoji} {selected.name}
          </p>
        </div>

        {/* Subject Picker */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="size-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Các môn học</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {SUBJECTS.map((s) => {
              const overall = subjectOverall(s);
              const isActive = selectedKey === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setSelectedKey(s.key)}
                  className={`text-left rounded-xl border-2 p-4 transition-all hover:-translate-y-0.5 ${
                    isActive
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="text-3xl">{s.emoji}</div>
                  <div className="font-display font-bold mt-1 text-sm">
                    {s.name}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className="font-display text-lg font-bold"
                      style={{ color: masteryColor(overall) }}
                    >
                      {overall}%
                    </span>
                    {isActive && (
                      <Badge variant="secondary" className="text-[10px]">
                        Đang xem
                      </Badge>
                    )}
                  </div>
                  <Progress value={overall} className="mt-2 h-1.5" />
                </button>
              );
            })}
          </div>
        </div>

        <SubjectDetail subject={selected} />

        {/* Legend / explainer */}
        <Card className="p-5 border-2 bg-muted/30">
          <div className="font-display font-bold mb-2">📘 Cách đọc biểu đồ</div>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <div>
              • <b>Nhận biết:</b> nhớ và nhận ra kiến thức đã học.
            </div>
            <div>
              • <b>Thông hiểu:</b> giải thích, mô tả ý nghĩa.
            </div>
            <div>
              • <b>Vận dụng:</b> áp dụng vào tình huống quen thuộc.
            </div>
            <div>
              • <b>Vận dụng cao:</b> giải quyết tình huống mới, sáng tạo.
            </div>
          </div>
        </Card>
      </div>
    </StudentShell>
  );
}

function SubjectDetail({ subject }: { subject: SubjectData }) {
  const radarData = subject.bloom.map((b) => ({
    level: b.short,
    fullName: b.level,
    score: Math.round((b.correct / b.total) * 100),
    target: 75,
  }));

  const overall = subjectOverall(subject);

  const weakLessons = subject.topics
    .filter((t) => t.mastery < 70)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 3)
    .map((t, i) => ({
      ...t,
      lesson: LESSONS[i % LESSONS.length],
    }));

  const weakestBloom = [...subject.bloom].sort(
    (a, b) => a.correct / a.total - b.correct / b.total,
  )[0];

  return (
    <>
      {/* Bloom 4 levels in one row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {subject.bloom.map((b) => {
          const pct = Math.round((b.correct / b.total) * 100);
          return (
            <Card key={b.level} className="p-4 border-2">
              <div className="text-xs text-muted-foreground">{b.level}</div>
              <div className="font-display text-2xl font-bold">{pct}%</div>
              <div className="text-xs text-muted-foreground">
                {b.correct}/{b.total} câu đúng
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5 border-2">
          <div className="flex items-center gap-2 mb-2">
            <Target className="size-5 text-primary" />
            <div className="font-display font-bold">Biểu đồ năng lực Bloom</div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Đường nét đứt = mục tiêu 75% · Vùng tô = năng lực hiện tại
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <defs>
                  <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={C.primary} stopOpacity={0.7} />
                    <stop offset="100%" stopColor={C.fun} stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <PolarGrid stroke={C.border} />
                <PolarAngleAxis
                  dataKey="level"
                  tick={{ fill: "currentColor", fontSize: 13, fontWeight: 700 }}
                  className="text-foreground"
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: C.muted }}
                  stroke={C.border}
                />
                <Radar
                  name="Hiện tại"
                  dataKey="score"
                  stroke={C.primary}
                  strokeWidth={2.5}
                  fill="url(#radarFill)"
                  fillOpacity={1}
                  dot={{
                    r: 5,
                    fill: C.primary,
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
                <Radar
                  name="Mục tiêu 75%"
                  dataKey="target"
                  stroke={C.success}
                  strokeWidth={2}
                  fill="transparent"
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--background)",
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    boxShadow: "0 6px 20px -8px rgba(0,0,0,0.15)",
                  }}
                  formatter={(v: number, _n, p) => [
                    `${v}%`,
                    p.payload.fullName,
                  ]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 border-2">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="size-5 text-info" />
            <div className="font-display font-bold">
              Mức thành thạo theo chủ đề
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            🟢 ≥75% Giỏi · 🔵 ≥60% Khá · 🟡 ≥45% TB · 🔴 Yếu
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subject.topics}
                layout="vertical"
                margin={{ left: 20, right: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={C.border}
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: C.muted }}
                  stroke={C.border}
                />
                <YAxis
                  type="category"
                  dataKey="topic"
                  width={140}
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  className="text-foreground"
                  stroke={C.border}
                />
                <Tooltip
                  cursor={{ fill: C.border, opacity: 0.3 }}
                  contentStyle={{
                    background: "var(--background)",
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    boxShadow: "0 6px 20px -8px rgba(0,0,0,0.15)",
                  }}
                  formatter={(v: number) => [`${v}%`, "Thành thạo"]}
                />
                <Bar dataKey="mastery" radius={[0, 8, 8, 0]} barSize={22}>
                  {subject.topics.map((t, i) => (
                    <Cell key={i} fill={masteryColor(t.mastery)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* AI suggestion banner */}
      <Card className="p-5 border-2 border-fun bg-gradient-to-br from-fun/10 to-primary/5">
        <div className="flex gap-4">
          <Sparkles className="text-fun size-8 shrink-0 mt-1" />
          <div className="flex-1">
            <div className="font-display font-bold text-fun text-lg">
              Ong Chăm Chỉ phân tích
            </div>
            <p className="text-sm mt-1">
              Ở môn <b>{subject.name}</b>, em đang yếu nhất ở mức{" "}
              <b>{weakestBloom.level}</b> (chỉ{" "}
              {Math.round((weakestBloom.correct / weakestBloom.total) * 100)}%
              đúng). Hãy luyện tập thêm các bài bên dưới để củng cố nhé!
            </p>
          </div>
        </div>
      </Card>

      {/* Weak lessons */}
      {weakLessons.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="size-5 text-warning" />
            <h2 className="font-display text-xl font-bold">
              Bài cần luyện thêm
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {weakLessons.map((w) => (
              <Card
                key={w.topic}
                className="p-4 border-2 hover:border-primary transition-all hover:-translate-y-0.5"
              >
                <div className="text-xs uppercase font-bold text-warning">
                  {w.topic}
                </div>
                <div className="font-display font-bold mt-1">
                  {w.lesson.title}
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Mức thành thạo:{" "}
                  <b className="text-foreground">{w.mastery}%</b>
                  {w.weakLevel && (
                    <>
                      {" "}
                      · Yếu ở{" "}
                      <Badge variant="secondary" className="ml-1">
                        {w.weakLevel}
                      </Badge>
                    </>
                  )}
                </div>
                <Progress value={w.mastery} className="mt-2" />
                <Link
                  to="/student/lesson/$lessonId"
                  params={{ lessonId: w.lesson.id }}
                  className="block mt-3"
                >
                  <Button size="sm" className="btn-pop rounded-full w-full">
                    Luyện tập ngay <ArrowRight className="size-4 ml-1" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
