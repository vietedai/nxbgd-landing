import { createFileRoute } from "@tanstack/react-router";
import { TeacherShell } from "@/components/TeacherShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  Check,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  FolderOpen,
  Library,
  Building2,
  User,
  Bot,
  Loader2,
} from "lucide-react";
import { TYPE_LABELS } from "@/components/interactions/QuestionRenderer";
import type { Question } from "@/lib/types";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/teacher/bank")({
  head: () => ({
    meta: [{ title: "Ngân hàng câu hỏi | Giáo viên - NXBGDVN" }],
  }),
  component: BankPage,
});

/* ============================================================ */
/* Types & mock data                                            */
/* ============================================================ */

type BankItem = {
  id: string;
  topic: string;
  subject: string;
  type: Question["type"];
  text: string;
  level: "Dễ" | "TB" | "Khó";
  options?: string[];
  correctIndex?: number[];
  explanation?: string;
};

type NxbBank = {
  id: string;
  name: string;
  questions: BankItem[];
};
type NxbTopic = { id: string; name: string; banks: NxbBank[] };
type NxbSubject = {
  id: string;
  name: string;
  emoji: string;
  topics: NxbTopic[];
};
type NxbGrade = { id: string; name: string; subjects: NxbSubject[] };

const mkQ = (
  id: string,
  topic: string,
  subject: string,
  type: Question["type"],
  text: string,
  level: BankItem["level"],
): BankItem => ({ id, topic, subject, type, text, level });

const NXB_TREE: NxbGrade[] = [
  {
    id: "g4",
    name: "Lớp 4",
    subjects: [
      {
        id: "kh4",
        name: "Khoa học 4",
        emoji: "🔬",
        topics: [
          {
            id: "nuoc",
            name: "Nước",
            banks: [
              {
                id: "nuoc-co-ban",
                name: "NH cơ bản về Nước",
                questions: [
                  mkQ(
                    "n1",
                    "Nước",
                    "Khoa học 4",
                    "single_choice",
                    "Nước có thể tồn tại ở mấy thể?",
                    "Dễ",
                  ),
                  mkQ(
                    "n2",
                    "Nước",
                    "Khoa học 4",
                    "true_false",
                    "Nước sôi ở 100°C ở áp suất khí quyển.",
                    "Dễ",
                  ),
                  mkQ(
                    "n3",
                    "Nước",
                    "Khoa học 4",
                    "image_hotspot",
                    "Chỉ ra phần thể rắn trong hình.",
                    "TB",
                  ),
                ],
              },
              {
                id: "nuoc-nang-cao",
                name: "NH nâng cao về Nước",
                questions: [
                  mkQ(
                    "n4",
                    "Nước",
                    "Khoa học 4",
                    "essay",
                    "Vì sao nước biển mặn?",
                    "Khó",
                  ),
                ],
              },
            ],
          },
          {
            id: "vong-th",
            name: "Vòng tuần hoàn",
            banks: [
              {
                id: "vth-1",
                name: "NH Vòng tuần hoàn",
                questions: [
                  mkQ(
                    "v1",
                    "Vòng tuần hoàn",
                    "Khoa học 4",
                    "drag_drop",
                    "Sắp xếp các giai đoạn của vòng tuần hoàn.",
                    "TB",
                  ),
                  mkQ(
                    "v2",
                    "Vòng tuần hoàn",
                    "Khoa học 4",
                    "essay",
                    "Em hãy giải thích tại sao trời mưa.",
                    "Khó",
                  ),
                ],
              },
            ],
          },
          {
            id: "kk",
            name: "Không khí",
            banks: [
              {
                id: "kk-1",
                name: "NH Không khí",
                questions: [
                  mkQ(
                    "k1",
                    "Không khí",
                    "Khoa học 4",
                    "fill_blank",
                    "Không khí gồm: ___, ___ và hơi nước.",
                    "TB",
                  ),
                ],
              },
            ],
          },
        ],
      },
      {
        id: "t4",
        name: "Toán 4",
        emoji: "🧮",
        topics: [
          {
            id: "phan-so",
            name: "Phân số",
            banks: [
              {
                id: "ps-1",
                name: "NH Phân số cơ bản",
                questions: [
                  mkQ(
                    "p1",
                    "Phân số",
                    "Toán 4",
                    "single_choice",
                    "1/2 + 1/4 = ?",
                    "Dễ",
                  ),
                  mkQ(
                    "p2",
                    "Phân số",
                    "Toán 4",
                    "fill_blank",
                    "Rút gọn 6/8 = ___",
                    "TB",
                  ),
                ],
              },
            ],
          },
        ],
      },
      {
        id: "tv4",
        name: "Tiếng Việt 4",
        emoji: "📖",
        topics: [
          {
            id: "tu-loai",
            name: "Từ loại",
            banks: [
              {
                id: "tl-1",
                name: "NH Danh từ - Động từ",
                questions: [
                  mkQ(
                    "tl1",
                    "Từ loại",
                    "Tiếng Việt 4",
                    "single_choice",
                    "Từ nào là động từ?",
                    "Dễ",
                  ),
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "g5",
    name: "Lớp 5",
    subjects: [
      {
        id: "kh5",
        name: "Khoa học 5",
        emoji: "🔬",
        topics: [
          {
            id: "co-the",
            name: "Cơ thể người",
            banks: [
              {
                id: "ct-1",
                name: "NH Cơ thể người",
                questions: [
                  mkQ(
                    "ct1",
                    "Cơ thể người",
                    "Khoa học 5",
                    "single_choice",
                    "Tim có mấy ngăn?",
                    "Dễ",
                  ),
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const PERSONAL_INIT: BankItem[] = [
  mkQ(
    "pq1",
    "Nước",
    "Khoa học 4",
    "single_choice",
    "Nước có thể tồn tại ở mấy thể?",
    "Dễ",
  ),
  mkQ(
    "pq2",
    "Vòng tuần hoàn",
    "Khoa học 4",
    "essay",
    "Em hãy giải thích tại sao trời mưa.",
    "Khó",
  ),
];

const AI_INIT: BankItem[] = [
  mkQ(
    "aq1",
    "Không khí",
    "Khoa học 4",
    "fill_blank",
    "Không khí gồm: ___, ___ và hơi nước.",
    "TB",
  ),
  mkQ(
    "aq2",
    "Phân số",
    "Toán 4",
    "single_choice",
    "1/2 + 1/4 bằng bao nhiêu?",
    "Dễ",
  ),
];

/* ============================================================ */
/* Page                                                          */
/* ============================================================ */

function BankPage() {
  const [personal, setPersonal] = useState<BankItem[]>(PERSONAL_INIT);
  const [aiBank, setAiBank] = useState<BankItem[]>(AI_INIT);
  const [openAdd, setOpenAdd] = useState(false);
  const [openAi, setOpenAi] = useState(false);

  const totalNxb = useMemo(
    () =>
      NXB_TREE.reduce(
        (s, g) =>
          s +
          g.subjects.reduce(
            (s2, sub) =>
              s2 +
              sub.topics.reduce(
                (s3, t) =>
                  s3 + t.banks.reduce((s4, b) => s4 + b.questions.length, 0),
                0,
              ),
            0,
          ),
        0,
      ),
    [],
  );

  return (
    <TeacherShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-5">
        <div>
          <h1 className="font-display text-3xl font-bold">
            📚 Ngân hàng câu hỏi
          </h1>
          <p className="text-muted-foreground">
            Tổng hợp câu hỏi từ NXBGDVN, ngân hàng cá nhân của cô và AI sinh tự
            động.
          </p>
        </div>

        <Tabs defaultValue="nxb" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="nxb" className="py-2.5 gap-2">
              <Building2 className="size-4" />
              <span className="hidden sm:inline">NXBGDVN</span>
              <span className="sm:hidden">NXB</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                {totalNxb}
              </span>
            </TabsTrigger>
            <TabsTrigger value="personal" className="py-2.5 gap-2">
              <User className="size-4" />
              <span className="hidden sm:inline">Cá nhân</span>
              <span className="sm:hidden">Cá nhân</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                {personal.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="py-2.5 gap-2">
              <Bot className="size-4" />
              <span className="hidden sm:inline">AI sinh</span>
              <span className="sm:hidden">AI</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-fun/15 text-fun">
                {aiBank.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nxb" className="mt-4">
            <NxbBrowser />
          </TabsContent>

          <TabsContent value="personal" className="mt-4">
            <FlatBank
              title="Ngân hàng cá nhân"
              description="Câu hỏi do cô tự tạo. Có thể chỉnh sửa, xoá thoải mái."
              items={personal}
              onDelete={(id) => {
                setPersonal((prev) => prev.filter((q) => q.id !== id));
                toast("Đã xoá câu hỏi");
              }}
              actionLabel="Thêm thủ công"
              actionIcon={<Plus className="size-4 mr-1" />}
              onAction={() => setOpenAdd(true)}
            />
          </TabsContent>

          <TabsContent value="ai" className="mt-4">
            <FlatBank
              title="Ngân hàng AI sinh"
              description="Câu hỏi sinh tự động bởi AI. Cô có thể duyệt và chuyển sang ngân hàng cá nhân."
              items={aiBank}
              onDelete={(id) => {
                setAiBank((prev) => prev.filter((q) => q.id !== id));
                toast("Đã xoá câu hỏi");
              }}
              actionLabel="AI sinh câu hỏi"
              actionIcon={<Sparkles className="size-4 mr-1 text-fun" />}
              actionVariant="outline"
              onAction={() => setOpenAi(true)}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AddQuestionDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        onAdd={(q) => {
          setPersonal((prev) => [q, ...prev]);
          toast.success("Đã thêm câu hỏi vào ngân hàng cá nhân", {
            description: `${q.subject} · ${q.topic} · ${TYPE_LABELS[q.type]}`,
          });
        }}
      />
      <AiGenerateDialog
        open={openAi}
        onOpenChange={setOpenAi}
        onGenerate={(qs) => {
          setAiBank((prev) => [...qs, ...prev]);
          toast.success(`AI đã sinh ${qs.length} câu hỏi`);
        }}
      />
    </TeacherShell>
  );
}

/* ============================================================ */
/* NXB Browser: Lớp -> Môn -> Chủ đề -> Ngân hàng -> Câu hỏi    */
/* ============================================================ */

type NxbCrumb =
  | { level: "grade" }
  | { level: "subject"; gradeId: string }
  | { level: "topic"; gradeId: string; subjectId: string }
  | { level: "bank"; gradeId: string; subjectId: string; topicId: string }
  | {
      level: "question";
      gradeId: string;
      subjectId: string;
      topicId: string;
      bankId: string;
    };

function NxbBrowser() {
  const [path, setPath] = useState<NxbCrumb>({ level: "grade" });

  const grade =
    "gradeId" in path ? NXB_TREE.find((g) => g.id === path.gradeId) : undefined;
  const subject =
    grade && "subjectId" in path
      ? grade.subjects.find((s) => s.id === path.subjectId)
      : undefined;
  const topic =
    subject && "topicId" in path
      ? subject.topics.find((t) => t.id === path.topicId)
      : undefined;
  const bank =
    topic && "bankId" in path
      ? topic.banks.find((b) => b.id === path.bankId)
      : undefined;

  return (
    <div className="space-y-3">
      {/* Breadcrumb */}
      <div className="flex items-center flex-wrap gap-1 text-sm">
        <button
          className="font-bold text-primary hover:underline"
          onClick={() => setPath({ level: "grade" })}
        >
          Tất cả lớp
        </button>
        {grade && (
          <>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <button
              className="font-bold text-primary hover:underline"
              onClick={() => setPath({ level: "subject", gradeId: grade.id })}
            >
              {grade.name}
            </button>
          </>
        )}
        {grade && subject && (
          <>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <button
              className="font-bold text-primary hover:underline"
              onClick={() =>
                setPath({
                  level: "topic",
                  gradeId: grade.id,
                  subjectId: subject.id,
                })
              }
            >
              {subject.name}
            </button>
          </>
        )}
        {grade && subject && topic && (
          <>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <button
              className="font-bold text-primary hover:underline"
              onClick={() =>
                setPath({
                  level: "bank",
                  gradeId: grade.id,
                  subjectId: subject.id,
                  topicId: topic.id,
                })
              }
            >
              {topic.name}
            </button>
          </>
        )}
        {grade && subject && topic && bank && (
          <>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <span className="font-bold">{bank.name}</span>
          </>
        )}
      </div>

      {/* Back button (shown beyond grade) */}
      {path.level !== "grade" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (path.level === "subject") setPath({ level: "grade" });
            else if (path.level === "topic")
              setPath({ level: "subject", gradeId: path.gradeId });
            else if (path.level === "bank")
              setPath({
                level: "topic",
                gradeId: path.gradeId,
                subjectId: path.subjectId,
              });
            else if (path.level === "question")
              setPath({
                level: "bank",
                gradeId: path.gradeId,
                subjectId: path.subjectId,
                topicId: path.topicId,
              });
          }}
        >
          <ArrowLeft className="size-4 mr-1" /> Quay lại
        </Button>
      )}

      {/* Levels */}
      {path.level === "grade" && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {NXB_TREE.map((g) => {
            const count = g.subjects.reduce(
              (s, sub) =>
                s +
                sub.topics.reduce(
                  (s2, t) =>
                    s2 + t.banks.reduce((s3, b) => s3 + b.questions.length, 0),
                  0,
                ),
              0,
            );
            return (
              <NxbCard
                key={g.id}
                emoji="🎓"
                title={g.name}
                meta={`${g.subjects.length} môn · ${count} câu hỏi`}
                onClick={() => setPath({ level: "subject", gradeId: g.id })}
              />
            );
          })}
        </div>
      )}

      {path.level === "subject" && grade && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {grade.subjects.map((s) => {
            const count = s.topics.reduce(
              (acc, t) =>
                acc + t.banks.reduce((a, b) => a + b.questions.length, 0),
              0,
            );
            return (
              <NxbCard
                key={s.id}
                emoji={s.emoji}
                title={s.name}
                meta={`${s.topics.length} chủ đề · ${count} câu hỏi`}
                onClick={() =>
                  setPath({
                    level: "topic",
                    gradeId: grade.id,
                    subjectId: s.id,
                  })
                }
              />
            );
          })}
        </div>
      )}

      {path.level === "topic" && grade && subject && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {subject.topics.map((t) => {
            const count = t.banks.reduce((a, b) => a + b.questions.length, 0);
            return (
              <NxbCard
                key={t.id}
                icon={<FolderOpen className="size-5 text-primary" />}
                title={t.name}
                meta={`${t.banks.length} ngân hàng · ${count} câu hỏi`}
                onClick={() =>
                  setPath({
                    level: "bank",
                    gradeId: grade.id,
                    subjectId: subject.id,
                    topicId: t.id,
                  })
                }
              />
            );
          })}
        </div>
      )}

      {path.level === "bank" && grade && subject && topic && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {topic.banks.map((b) => (
            <NxbCard
              key={b.id}
              icon={<Library className="size-5 text-fun" />}
              title={b.name}
              meta={`${b.questions.length} câu hỏi`}
              onClick={() =>
                setPath({
                  level: "question",
                  gradeId: grade.id,
                  subjectId: subject.id,
                  topicId: topic.id,
                  bankId: b.id,
                })
              }
            />
          ))}
        </div>
      )}

      {path.level === "question" && bank && (
        <QuestionList items={bank.questions} readOnly />
      )}
    </div>
  );
}

function NxbCard({
  emoji,
  icon,
  title,
  meta,
  onClick,
}: {
  emoji?: string;
  icon?: React.ReactNode;
  title: string;
  meta: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl border-2 bg-card p-4 hover:border-primary hover:shadow-md transition-all flex items-start gap-3"
    >
      <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
        {emoji ?? icon ?? <BookOpen className="size-5 text-primary" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold truncate">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{meta}</div>
      </div>
      <ChevronRight className="size-4 text-muted-foreground mt-3 shrink-0" />
    </button>
  );
}

/* ============================================================ */
/* Flat bank (Personal / AI)                                    */
/* ============================================================ */

function FlatBank({
  title,
  description,
  items,
  onDelete,
  actionLabel,
  actionIcon,
  actionVariant = "default",
  onAction,
}: {
  title: string;
  description: string;
  items: BankItem[];
  onDelete: (id: string) => void;
  actionLabel: string;
  actionIcon: React.ReactNode;
  actionVariant?: "default" | "outline";
  onAction: () => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.text.toLowerCase().includes(q) ||
        it.topic.toLowerCase().includes(q) ||
        it.subject.toLowerCase().includes(q),
    );
  }, [items, search]);

  return (
    <div className="space-y-3">
      <Card className="p-4 border-2 flex flex-wrap gap-3 items-center justify-between">
        <div className="min-w-0">
          <div className="font-bold flex items-center gap-2">
            <Library className="size-4 text-primary" /> {title}
          </div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
        <Button
          variant={actionVariant}
          className={
            actionVariant === "default"
              ? "btn-pop rounded-full"
              : "rounded-full"
          }
          onClick={onAction}
        >
          {actionIcon}
          {actionLabel}
        </Button>
      </Card>

      <div className="relative">
        <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Tìm câu hỏi theo từ khoá, chủ đề, môn học..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <QuestionList items={filtered} onDelete={onDelete} />
    </div>
  );
}

function QuestionList({
  items,
  onDelete,
  readOnly,
}: {
  items: BankItem[];
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}) {
  if (items.length === 0) {
    return (
      <Card className="p-10 text-center border-2 border-dashed">
        <p className="text-muted-foreground">Chưa có câu hỏi nào.</p>
      </Card>
    );
  }
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {items.map((q) => (
        <Card
          key={q.id}
          className="p-4 border-2 hover:border-primary transition-all"
        >
          <div className="flex justify-between items-start gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase text-primary">
              {q.subject} · {q.topic}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-fun/15 text-fun">
              {TYPE_LABELS[q.type] ?? q.type}
            </span>
          </div>
          <div className="font-medium text-sm">{q.text}</div>
          <div className="mt-3 flex justify-between items-center">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                q.level === "Dễ"
                  ? "bg-success/15 text-success"
                  : q.level === "TB"
                    ? "bg-warning/20 text-warning-foreground"
                    : "bg-destructive/15 text-destructive"
              }`}
            >
              {q.level}
            </span>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost">
                Xem
              </Button>

              {!readOnly && onDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(q.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ============================================================ */
/* Dialog: Thêm câu hỏi thủ công                                */
/* ============================================================ */

const SUBJECT_OPTIONS = ["Khoa học 4", "Toán 4", "Tiếng Việt 4", "Lịch sử"];
const LEVEL_OPTIONS: BankItem["level"][] = ["Dễ", "TB", "Khó"];

const QUICK_TYPES: { value: Question["type"]; label: string; emoji: string }[] =
  [
    { value: "single_choice", label: "Trắc nghiệm 1 đáp án", emoji: "🔘" },
    { value: "multiple_choice", label: "Nhiều đáp án", emoji: "☑️" },
    { value: "true_false", label: "Đúng / Sai", emoji: "✅" },
    { value: "fill_blank", label: "Điền khuyết", emoji: "✍️" },
    { value: "short_answer", label: "Tự luận ngắn", emoji: "📝" },
    { value: "essay", label: "Tự luận dài", emoji: "📄" },
  ];

function AddQuestionDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (q: BankItem) => void;
}) {
  const [type, setType] = useState<Question["type"]>("single_choice");
  const [subject, setSubject] = useState("Khoa học 4");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<BankItem["level"]>("Dễ");
  const [text, setText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState<number[]>([0]);
  const [tfAnswer, setTfAnswer] = useState<"true" | "false">("true");

  const reset = () => {
    setType("single_choice");
    setSubject("Khoa học 4");
    setTopic("");
    setLevel("Dễ");
    setText("");
    setExplanation("");
    setOptions(["", "", "", ""]);
    setCorrectIndex([0]);
    setTfAnswer("true");
  };

  const close = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const isChoice = type === "single_choice" || type === "multiple_choice";

  const updateOption = (i: number, v: string) =>
    setOptions((arr) => arr.map((o, idx) => (idx === i ? v : o)));
  const removeOption = (i: number) => {
    if (options.length <= 2) return;
    setOptions((arr) => arr.filter((_, idx) => idx !== i));
    setCorrectIndex((ci) =>
      ci.filter((c) => c !== i).map((c) => (c > i ? c - 1 : c)),
    );
  };
  const addOption = () => {
    if (options.length >= 6) return;
    setOptions((arr) => [...arr, ""]);
  };
  const toggleCorrect = (i: number) => {
    if (type === "single_choice") setCorrectIndex([i]);
    else
      setCorrectIndex((ci) =>
        ci.includes(i) ? ci.filter((c) => c !== i) : [...ci, i],
      );
  };

  const validate = (): string | null => {
    if (!topic.trim()) return "Vui lòng nhập chủ đề";
    if (!text.trim()) return "Vui lòng nhập nội dung câu hỏi";
    if (isChoice) {
      const filled = options.filter((o) => o.trim()).length;
      if (filled < 2) return "Cần ít nhất 2 phương án";
      if (correctIndex.length === 0) return "Chọn ít nhất 1 đáp án đúng";
      if (correctIndex.some((i) => !options[i]?.trim()))
        return "Đáp án đúng đang trống";
    }
    return null;
  };

  const submit = () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    const q: BankItem = {
      id: `q_${Date.now()}`,
      topic: topic.trim(),
      subject,
      type,
      text: text.trim(),
      level,
      explanation: explanation.trim() || undefined,
      ...(isChoice
        ? {
            options: options.map((o) => o.trim()).filter(Boolean),
            correctIndex,
          }
        : {}),
      ...(type === "true_false"
        ? { correctIndex: tfAnswer === "true" ? [1] : [0] }
        : {}),
    };
    onAdd(q);
    close(false);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            ➕ Thêm câu hỏi thủ công
          </DialogTitle>
          <DialogDescription>
            Tạo câu hỏi mới trong ngân hàng cá nhân. Bạn có thể chọn 1 trong các
            kiểu phổ biến.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-xs font-bold mb-1.5 block">
              Kiểu câu hỏi
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {QUICK_TYPES.map((t) => {
                const active = type === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`rounded-xl border-2 p-2.5 text-left transition-all ${
                      active
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    <div className="text-base">{t.emoji}</div>
                    <div className="font-bold text-xs mt-0.5">{t.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-bold">Môn học</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECT_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold">Chủ đề</Label>
              <Input
                placeholder="VD: Vòng tuần hoàn"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs font-bold">Mức độ</Label>
              <Select
                value={level}
                onValueChange={(v) => setLevel(v as BankItem["level"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVEL_OPTIONS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs font-bold">Nội dung câu hỏi</Label>
            <Textarea
              rows={3}
              placeholder={
                type === "fill_blank"
                  ? "Dùng ___ cho chỗ trống. VD: Nước sôi ở ___ độ C."
                  : "Nhập nội dung câu hỏi..."
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {isChoice && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-xs font-bold">
                  Phương án{" "}
                  {type === "multiple_choice" && "(chọn nhiều đáp án đúng)"}
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={addOption}
                  disabled={options.length >= 6}
                >
                  <Plus className="size-3.5 mr-1" />
                  Thêm phương án
                </Button>
              </div>
              <div className="space-y-2">
                {options.map((opt, i) => {
                  const checked = correctIndex.includes(i);
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleCorrect(i)}
                        className={`size-8 shrink-0 rounded-lg border-2 flex items-center justify-center transition-colors ${
                          checked
                            ? "bg-success border-success text-success-foreground"
                            : "bg-background border-border hover:border-success"
                        }`}
                        title="Đánh dấu đáp án đúng"
                      >
                        {checked && <Check className="size-4" />}
                      </button>
                      <Input
                        placeholder={`Phương án ${String.fromCharCode(65 + i)}`}
                        value={opt}
                        onChange={(e) => updateOption(i, e.target.value)}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeOption(i)}
                        disabled={options.length <= 2}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {type === "true_false" && (
            <div>
              <Label className="text-xs font-bold mb-1.5 block">
                Đáp án đúng
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(["true", "false"] as const).map((v) => {
                  const active = tfAnswer === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setTfAnswer(v)}
                      className={`rounded-xl border-2 p-3 font-bold transition-all ${
                        active
                          ? v === "true"
                            ? "border-success bg-success/15 text-success"
                            : "border-destructive bg-destructive/15 text-destructive"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      {v === "true" ? "✅ Đúng" : "❌ Sai"}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <Label className="text-xs font-bold">Giải thích (tuỳ chọn)</Label>
            <Textarea
              rows={2}
              placeholder="Giải thích sẽ hiển thị cho học sinh sau khi trả lời."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => close(false)}>
            Huỷ
          </Button>
          <Button className="btn-pop" onClick={submit}>
            <Plus className="size-4 mr-1" />
            Thêm vào ngân hàng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================ */
/* Dialog: AI sinh câu hỏi                                      */
/* ============================================================ */

function AiGenerateDialog({
  open,
  onOpenChange,
  onGenerate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onGenerate: (qs: BankItem[]) => void;
}) {
  const [subject, setSubject] = useState("Khoa học 4");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<BankItem["level"]>("TB");
  const [count, setCount] = useState(5);
  const [type, setType] = useState<Question["type"]>("single_choice");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!topic.trim()) {
      toast.error("Vui lòng nhập chủ đề");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const qs: BankItem[] = Array.from({ length: count }, (_, i) => ({
      id: `ai_${Date.now()}_${i}`,
      topic: topic.trim(),
      subject,
      type,
      level,
      text: `[AI] Câu ${i + 1} về ${topic.trim()} (${TYPE_LABELS[type] ?? type}).`,
    }));
    setLoading(false);
    onGenerate(qs);
    onOpenChange(false);
    setTopic("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Sparkles className="size-5 text-fun" /> AI sinh câu hỏi
          </DialogTitle>
          <DialogDescription>
            Mô tả chủ đề, mức độ và số lượng — AI sẽ sinh câu hỏi vào ngân hàng
            AI.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-bold">Môn học</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECT_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold">Mức độ</Label>
              <Select
                value={level}
                onValueChange={(v) => setLevel(v as BankItem["level"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVEL_OPTIONS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs font-bold">Chủ đề</Label>
            <Input
              placeholder="VD: Vòng tuần hoàn của nước"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-bold">Kiểu câu hỏi</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as Question["type"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUICK_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.emoji} {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold">Số câu ({count})</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={count}
                onChange={(e) =>
                  setCount(
                    Math.max(1, Math.min(20, Number(e.target.value) || 1)),
                  )
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Huỷ
          </Button>
          <Button className="btn-pop" onClick={submit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 mr-1 animate-spin" /> Đang sinh...
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-1" /> Sinh câu hỏi
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
