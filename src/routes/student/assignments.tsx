import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { StudentShell } from "@/components/StudentShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PAPERS } from "@/lib/mock-papers";
import {
  Calendar,
  Clock,
  CheckCircle2,
  ClipboardList,
  FileText,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/assignments")({
  head: () => ({ meta: [{ title: "Bài tập của tôi | NXBGDVN" }] }),
  component: Assignments,
});

type Status = "pending" | "doing" | "done";
const STATUS_LABEL: Record<Status, string> = {
  pending: "Chưa làm",
  doing: "Đang làm",
  done: "Hoàn thành",
};
const STATUS_COLOR: Record<Status, string> = {
  pending: "bg-warning/15 text-warning-foreground border-warning",
  doing: "bg-info/15 text-info border-info",
  done: "bg-success/15 text-success border-success",
};
const STATUS_ORDER: Status[] = ["pending", "doing", "done"];

type SubjectKey = "all" | "khtn" | "toan" | "tv" | "ls" | "ta";
const SUBJECTS: { key: SubjectKey; label: string; emoji: string }[] = [
  { key: "all", label: "Tất cả", emoji: "✨" },
  { key: "khtn", label: "Khoa học", emoji: "🔬" },
  { key: "toan", label: "Toán", emoji: "🔢" },
  { key: "tv", label: "Tiếng Việt", emoji: "📖" },
  { key: "ls", label: "Lịch sử & Địa lí", emoji: "🌏" },
  { key: "ta", label: "Tiếng Anh", emoji: "🇬🇧" },
];

type Kind = "worksheet" | "extra" | "exam";

interface StudentAssignment {
  id: string;
  paperId: string;
  lessonId?: string;
  title: string;
  topic: string;
  subject: Exclude<SubjectKey, "all">;
  questionCount: number;
  durationMin: number;
  due: string;
  assignedBy: string;
  status: Status;
}

// ===== Phiếu bài tập (Bắt buộc) =====
const WORKSHEETS: StudentAssignment[] = [
  {
    id: "sw0",
    paperId: "p-all-23",
    lessonId: "all-23",
    title: "Phiếu tổng hợp 23 dạng câu hỏi",
    topic: "Khoa học · Demo đầy đủ dạng",
    subject: "khtn",
    questionCount: 23,
    durationMin: 40,
    due: "30/04/2026",
    assignedBy: "Cô Lan",
    status: "pending",
  },
  {
    id: "sw1",
    paperId: "p3",
    title: "Phiếu bài tập Bài 1: Tính chất của nước",
    topic: "Khoa học · Bài 1",
    subject: "khtn",
    questionCount: 12,
    durationMin: 25,
    due: "20/04/2026",
    assignedBy: "Cô Lan",
    status: "doing",
  },
  {
    id: "sw2",
    paperId: "p5",
    title: "Phiếu bài tập Vòng tuần hoàn của nước",
    topic: "Khoa học · Bài 2",
    subject: "khtn",
    questionCount: 8,
    durationMin: 20,
    due: "22/04/2026",
    assignedBy: "Cô Lan",
    status: "pending",
  },
  {
    id: "sw3",
    paperId: "p4",
    title: "Phiếu ôn tập chương 1",
    topic: "Khoa học · Chương 1",
    subject: "khtn",
    questionCount: 30,
    durationMin: 45,
    due: "25/04/2026",
    assignedBy: "Cô Lan",
    status: "pending",
  },
  {
    id: "sw4",
    paperId: "p3",
    title: "Phiếu luyện tập Bài 1 (làm lại)",
    topic: "Khoa học · Bài 1",
    subject: "khtn",
    questionCount: 12,
    durationMin: 25,
    due: "10/04/2026",
    assignedBy: "Cô Lan",
    status: "done",
  },
  {
    id: "swt1",
    paperId: "pt1",
    lessonId: "toan-bai-1",
    title: "Phiếu bài tập Bài 1: Ôn tập các số đến 100 000",
    topic: "Toán · Bài 1",
    subject: "toan",
    questionCount: 8,
    durationMin: 20,
    due: "21/04/2026",
    assignedBy: "Thầy Minh",
    status: "pending",
  },
  {
    id: "swt2",
    paperId: "pt2",
    lessonId: "toan-bai-4",
    title: "Phiếu bài tập Bài 4: Biểu thức chứa chữ",
    topic: "Toán · Bài 4",
    subject: "toan",
    questionCount: 7,
    durationMin: 25,
    due: "23/04/2026",
    assignedBy: "Thầy Minh",
    status: "doing",
  },
  {
    id: "swt3",
    paperId: "pt3",
    lessonId: "toan-cd-3",
    title: "Phiếu ôn tập Chủ đề 3: Số có nhiều chữ số",
    topic: "Toán · Chủ đề 3",
    subject: "toan",
    questionCount: 8,
    durationMin: 35,
    due: "28/04/2026",
    assignedBy: "Thầy Minh",
    status: "pending",
  },
  {
    id: "swt4",
    paperId: "pt4",
    lessonId: "toan-bai-11",
    title: "Phiếu bài tập Hàng và lớp",
    topic: "Toán · Bài 11",
    subject: "toan",
    questionCount: 7,
    durationMin: 20,
    due: "12/04/2026",
    assignedBy: "Thầy Minh",
    status: "done",
  },
];

// ===== Cô giao thêm (không bắt buộc) =====
const EXTRAS: StudentAssignment[] = [
  {
    id: "sx1",
    paperId: "p3",
    lessonId: "bai-1",
    title: "Luyện thêm: Tính chất của nước",
    topic: "Khoa học · Bài 1",
    subject: "khtn",
    questionCount: 10,
    durationMin: 15,
    due: "Tự do",
    assignedBy: "Cô Lan",
    status: "pending",
  },
  {
    id: "sx2",
    paperId: "p5",
    lessonId: "bai-2",
    title: "Thử thách vòng tuần hoàn của nước",
    topic: "Khoa học · Bài 2",
    subject: "khtn",
    questionCount: 8,
    durationMin: 12,
    due: "Tự do",
    assignedBy: "Cô Lan",
    status: "pending",
  },
  {
    id: "sxt1",
    paperId: "pt2",
    lessonId: "toan-bai-4",
    title: "Ôn thêm: Biểu thức chứa chữ (nâng cao)",
    topic: "Toán · Bài 4",
    subject: "toan",
    questionCount: 6,
    durationMin: 15,
    due: "Tự do",
    assignedBy: "Thầy Minh",
    status: "doing",
  },
  {
    id: "sxt2",
    paperId: "pt4",
    lessonId: "toan-bai-11",
    title: "Luyện thêm: Hàng và lớp",
    topic: "Toán · Bài 11",
    subject: "toan",
    questionCount: 8,
    durationMin: 15,
    due: "Tự do",
    assignedBy: "Thầy Minh",
    status: "pending",
  },
  {
    id: "sxv1",
    paperId: "p3",
    lessonId: "bai-1",
    title: "Đọc hiểu đoạn văn ngắn",
    topic: "Tiếng Việt · Tuần 5",
    subject: "tv",
    questionCount: 6,
    durationMin: 10,
    due: "Tự do",
    assignedBy: "Cô Hương",
    status: "pending",
  },
  {
    id: "sxe1",
    paperId: "p3",
    lessonId: "bai-1",
    title: "Từ vựng chủ đề Family",
    topic: "Tiếng Anh · Unit 3",
    subject: "ta",
    questionCount: 10,
    durationMin: 15,
    due: "Tự do",
    assignedBy: "Cô Mai",
    status: "pending",
  },
];

// ===== Bài kiểm tra =====
const EXAMS: StudentAssignment[] = [
  {
    id: "se1",
    paperId: "p1",
    title: "Đề kiểm tra 15 phút - Bài 2",
    topic: "Khoa học · Bài 2",
    subject: "khtn",
    questionCount: 10,
    durationMin: 15,
    due: "20/04/2026 - Tiết 2",
    assignedBy: "Cô Lan",
    status: "pending",
  },
  {
    id: "se2",
    paperId: "p6",
    title: "Quiz Kahoot Vòng tuần hoàn",
    topic: "Khoa học · Bài 2",
    subject: "khtn",
    questionCount: 15,
    durationMin: 10,
    due: "Đang diễn ra",
    assignedBy: "Cô Lan",
    status: "doing",
  },
  {
    id: "se3",
    paperId: "p2",
    title: "Đề KT giữa kỳ I - Khoa học 4",
    topic: "Khoa học · Giữa kỳ I",
    subject: "khtn",
    questionCount: 40,
    durationMin: 60,
    due: "15/04/2026",
    assignedBy: "Cô Lan",
    status: "done",
  },
  {
    id: "set1",
    paperId: "pt5",
    title: "Đề kiểm tra 15 phút - Số chẵn, số lẻ",
    topic: "Toán · Bài 3",
    subject: "toan",
    questionCount: 10,
    durationMin: 15,
    due: "22/04/2026 - Tiết 1",
    assignedBy: "Thầy Minh",
    status: "pending",
  },
  {
    id: "set2",
    paperId: "pt7",
    title: "Đề kiểm tra Chủ đề 2: Góc và đơn vị đo góc",
    topic: "Toán · Chủ đề 2",
    subject: "toan",
    questionCount: 15,
    durationMin: 30,
    due: "26/04/2026",
    assignedBy: "Thầy Minh",
    status: "pending",
  },
  {
    id: "set3",
    paperId: "pt6",
    title: "Đề KT giữa kỳ I - Toán 4",
    topic: "Toán · Giữa kỳ I",
    subject: "toan",
    questionCount: 30,
    durationMin: 45,
    due: "16/04/2026",
    assignedBy: "Thầy Minh",
    status: "done",
  },
];

function StatusFilter({
  selected,
  onToggle,
  counts,
}: {
  selected: Set<Status | "all">;
  onToggle: (s: Status | "all") => void;
  counts: Record<Status, number>;
}) {
  const all: Array<{ key: Status | "all"; label: string; count?: number }> = [
    {
      key: "all",
      label: "Tất cả",
      count: counts.pending + counts.doing + counts.done,
    },
    { key: "pending", label: "Chưa làm", count: counts.pending },
    { key: "doing", label: "Đang làm", count: counts.doing },
    { key: "done", label: "Hoàn thành", count: counts.done },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {all.map((f) => {
        const active = selected.has(f.key);
        return (
          <button
            key={f.key}
            onClick={() => onToggle(f.key)}
            className={cn(
              "text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all",
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/50",
            )}
          >
            {f.label} <span className="opacity-70">({f.count})</span>
          </button>
        );
      })}
    </div>
  );
}

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

const KIND_META: Record<
  Kind,
  { label: string; icon: typeof ClipboardList; chip: string }
> = {
  worksheet: {
    label: "Phiếu bài tập",
    icon: ClipboardList,
    chip: "bg-primary/15 text-primary",
  },
  extra: { label: "Cô giao thêm", icon: Gift, chip: "bg-fun/15 text-fun" },
  exam: {
    label: "Bài kiểm tra",
    icon: FileText,
    chip: "bg-warning/15 text-warning-foreground",
  },
};

function AssignmentCard({ a, kind }: { a: StudentAssignment; kind: Kind }) {
  const meta = KIND_META[kind];
  const Icon = meta.icon;
  return (
    <Card className="p-5 border-2 hover:border-primary transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
                meta.chip,
              )}
            >
              <Icon className="size-3" /> {meta.label}
            </span>
            <span
              className={cn(
                "text-xs font-bold px-2 py-1 rounded-full border",
                STATUS_COLOR[a.status],
              )}
            >
              {a.status === "done" && (
                <CheckCircle2 className="size-3 inline mr-1" />
              )}
              {STATUS_LABEL[a.status]}
            </span>
          </div>
          <div className="font-display font-bold mt-2">{a.title}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {a.topic} · {a.questionCount} câu · {a.assignedBy}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="size-3" /> Hạn: {a.due}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" /> ~{a.durationMin}'
            </span>
          </div>
        </div>
      </div>
      <Link
        to="/student/lesson/$lessonId"
        params={{ lessonId: a.lessonId ?? "bai-1" }}
        className="block mt-4"
      >
        <Button className="btn-pop w-full rounded-full">
          {a.status === "done"
            ? "Xem lại"
            : a.status === "doing"
              ? "Tiếp tục →"
              : "Bắt đầu →"}
        </Button>
      </Link>
    </Card>
  );
}

function AssignmentList({
  items,
  kind,
  subject,
}: {
  items: StudentAssignment[];
  kind: Kind;
  subject: SubjectKey;
}) {
  const [selected, setSelected] = useState<Set<Status | "all">>(
    new Set<Status | "all">(["pending", "doing"]),
  );

  const subjectFiltered = useMemo(
    () => items.filter((i) => subject === "all" || i.subject === subject),
    [items, subject],
  );

  const counts = useMemo(() => {
    const c: Record<Status, number> = { pending: 0, doing: 0, done: 0 };
    subjectFiltered.forEach((i) => {
      c[i.status]++;
    });
    return c;
  }, [subjectFiltered]);

  const toggle = (s: Status | "all") => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (s === "all") {
        const allOn = STATUS_ORDER.every((x) => next.has(x));
        if (allOn) return new Set();
        return new Set<Status | "all">(["all", ...STATUS_ORDER]);
      }
      if (next.has(s)) next.delete(s);
      else next.add(s);
      const allOn = STATUS_ORDER.every((x) => next.has(x));
      if (allOn) next.add("all");
      else next.delete("all");
      return next;
    });
  };

  const filtered = useMemo(() => {
    const active = STATUS_ORDER.filter(
      (s) => selected.has(s) || selected.has("all"),
    );
    if (active.length === 0) return [];
    return subjectFiltered.filter((i) => active.includes(i.status));
  }, [subjectFiltered, selected]);

  return (
    <div className="space-y-4">
      <StatusFilter selected={selected} onToggle={toggle} counts={counts} />
      {filtered.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground border-2 border-dashed">
          Không có bài nào phù hợp bộ lọc.
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((a) => (
            <AssignmentCard key={a.id} a={a} kind={kind} />
          ))}
        </div>
      )}
    </div>
  );
}

function countBySubject(items: StudentAssignment[], subject: SubjectKey) {
  return items.filter((i) => subject === "all" || i.subject === subject).length;
}

function Assignments() {
  void PAPERS;
  const [subject, setSubject] = useState<SubjectKey>("all");

  return (
    <StudentShell>
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <h1 className="font-display text-3xl font-bold mb-1">
          📝 Bài tập của tôi
        </h1>
        <p className="text-muted-foreground mb-5">
          Phiếu bài tập, bài cô giao thêm và bài kiểm tra
        </p>

        <Card className="p-4 border-2 mb-5">
          <div className="text-xs uppercase font-bold text-muted-foreground mb-2">
            Lọc theo môn
          </div>
          <SubjectChips subject={subject} onChange={setSubject} />
        </Card>

        <Tabs defaultValue="worksheet" className="w-full">
          <TabsList className="h-11 p-1">
            <TabsTrigger value="worksheet" className="px-4 py-2">
              <ClipboardList className="size-4 mr-1" /> Phiếu bài tập (
              {countBySubject(WORKSHEETS, subject)})
            </TabsTrigger>
            <TabsTrigger value="extra" className="px-4 py-2">
              <Gift className="size-4 mr-1" /> Cô giao thêm (
              {countBySubject(EXTRAS, subject)})
            </TabsTrigger>
            <TabsTrigger value="exam" className="px-4 py-2">
              <FileText className="size-4 mr-1" /> Bài kiểm tra (
              {countBySubject(EXAMS, subject)})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="worksheet" className="mt-5">
            <AssignmentList
              items={WORKSHEETS}
              kind="worksheet"
              subject={subject}
            />
          </TabsContent>
          <TabsContent value="extra" className="mt-5">
            <Card className="p-4 border-2 border-fun/30 bg-fun/5 mb-4">
              <div className="text-sm">
                <b className="text-fun">Bài cô gợi ý làm thêm</b> — không bắt
                buộc. Hoàn thành sẽ được cộng XP và mở khoá huy hiệu!
              </div>
            </Card>
            <AssignmentList items={EXTRAS} kind="extra" subject={subject} />
          </TabsContent>
          <TabsContent value="exam" className="mt-5">
            <AssignmentList items={EXAMS} kind="exam" subject={subject} />
          </TabsContent>
        </Tabs>
      </div>
    </StudentShell>
  );
}
