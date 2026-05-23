import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  BookOpen,
  FileText,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Stepper, OptionCard, GRADES, CLASSES } from "./PaperWizardShared";
import {
  AssignModeSelector,
  ASSIGN_MODE_LABEL,
  type AssignMode,
} from "./PaperWizardShared";
import type { PaperKind } from "@/lib/mock-papers";
import { KIND_LABEL } from "@/lib/mock-papers";
import { cn } from "@/lib/utils";

const STEPS = ["Sách & Chủ đề", "Phiếu trong sách", "Giao lớp"];

type Lesson = { id: string; title: string };
type Topic = { id: string; title: string; lessons: Lesson[] };
type Sheet = { id: string; title: string; questionCount: number; type: string };
type Textbook = {
  title: string;
  subject: string;
  grade: string;
  cover: string;
  topics: Topic[];
};

// Khoa học 4
const KH4_TOPICS: Topic[] = [
  {
    id: "c1",
    title: "Chủ đề 1: Chất",
    lessons: [
      { id: "b1", title: "Bài 1: Tính chất của nước" },
      { id: "b2", title: "Bài 2: Sự chuyển thể của nước" },
      { id: "b3", title: "Bài 3: Vòng tuần hoàn của nước trong tự nhiên" },
    ],
  },
  {
    id: "c2",
    title: "Chủ đề 2: Năng lượng",
    lessons: [
      { id: "b4", title: "Bài 4: Không khí xung quanh ta" },
      { id: "b5", title: "Bài 5: Âm thanh và sự lan truyền âm thanh" },
      { id: "b6", title: "Bài 6: Ánh sáng và sự truyền ánh sáng" },
    ],
  },
];

// Toán 4 — VBT (theo file đính kèm)
const T4_TOPICS: Topic[] = [
  {
    id: "tc1",
    title: "Chủ đề 1: Ôn tập và bổ sung",
    lessons: [
      { id: "tb1", title: "Bài 1: Ôn tập các số đến 100 000" },
      { id: "tb2", title: "Bài 2: Ôn tập các phép tính trong phạm vi 100 000" },
      { id: "tb3", title: "Bài 3: Số chẵn, số lẻ" },
      { id: "tb4", title: "Bài 4: Biểu thức chứa chữ" },
    ],
  },
  {
    id: "tc2",
    title: "Chủ đề 2: Góc và đơn vị đo góc",
    lessons: [
      { id: "tb5", title: "Bài 5: Góc nhọn, góc tù, góc bẹt" },
      { id: "tb6", title: "Bài 6: Đo góc, đơn vị đo góc" },
    ],
  },
  {
    id: "tc3",
    title: "Chủ đề 3: Số có nhiều chữ số",
    lessons: [
      { id: "tb9", title: "Bài 9: Các số có sáu chữ số. Hàng và lớp" },
      { id: "tb11", title: "Bài 11: Hàng và lớp" },
      { id: "tb12", title: "Bài 12: Triệu — Lớp triệu" },
    ],
  },
];

// Tiếng Việt 4 (mẫu)
const TV4_TOPICS: Topic[] = [
  {
    id: "vc1",
    title: "Chủ đề 1: Mỗi người một vẻ",
    lessons: [
      { id: "vb1", title: "Bài 1: Tuổi Ngựa" },
      { id: "vb2", title: "Bài 2: Đoàn thuyền đánh cá" },
    ],
  },
  {
    id: "vc2",
    title: "Chủ đề 2: Mở rộng vốn từ",
    lessons: [{ id: "vb3", title: "Bài 3: Danh từ — Động từ — Tính từ" }],
  },
];

// TN&XH (Lớp 1–3)
const TNXH_TOPICS: Topic[] = [
  {
    id: "nc1",
    title: "Chủ đề 1: Gia đình",
    lessons: [
      { id: "nb1", title: "Bài 1: Các thành viên trong gia đình" },
      { id: "nb2", title: "Bài 2: Ngôi nhà của em" },
    ],
  },
];

// Lịch sử & Địa lý (Lớp 4–5)
const LSDL_TOPICS: Topic[] = [
  {
    id: "lc1",
    title: "Chủ đề 1: Địa phương em",
    lessons: [
      { id: "lb1", title: "Bài 1: Thiên nhiên và con người địa phương em" },
    ],
  },
];

const TEXTBOOKS: Textbook[] = [
  {
    title: "VBT Toán {grade} — Bộ sách 2026",
    subject: "Toán",
    grade: "Lớp 4",
    cover: "📐",
    topics: T4_TOPICS,
  },
  {
    title: "SBT Khoa học {grade} — Bộ sách 2026",
    subject: "Khoa học",
    grade: "Lớp 4",
    cover: "📘",
    topics: KH4_TOPICS,
  },
  {
    title: "SBT Khoa học {grade} — Bộ sách 2026",
    subject: "Khoa học",
    grade: "Lớp 5",
    cover: "📗",
    topics: KH4_TOPICS,
  },
  {
    title: "VBT Tiếng Việt {grade} — Bộ sách 2026",
    subject: "Tiếng Việt",
    grade: "Lớp 4",
    cover: "📕",
    topics: TV4_TOPICS,
  },
  {
    title: "VBT Tiếng Việt {grade} — Bộ sách 2026",
    subject: "Tiếng Việt",
    grade: "Lớp 5",
    cover: "📕",
    topics: TV4_TOPICS,
  },
  {
    title: "SBT Tự nhiên & Xã hội {grade} — Bộ sách 2026",
    subject: "Tự nhiên & Xã hội",
    grade: "Lớp 1",
    cover: "🌿",
    topics: TNXH_TOPICS,
  },
  {
    title: "SBT Tự nhiên & Xã hội {grade} — Bộ sách 2026",
    subject: "Tự nhiên & Xã hội",
    grade: "Lớp 2",
    cover: "🌿",
    topics: TNXH_TOPICS,
  },
  {
    title: "SBT Tự nhiên & Xã hội {grade} — Bộ sách 2026",
    subject: "Tự nhiên & Xã hội",
    grade: "Lớp 3",
    cover: "🌿",
    topics: TNXH_TOPICS,
  },
  {
    title: "SBT Lịch sử & Địa lý {grade} — Bộ sách 2026",
    subject: "Lịch sử & Địa lý",
    grade: "Lớp 4",
    cover: "🗺️",
    topics: LSDL_TOPICS,
  },
  {
    title: "SBT Lịch sử & Địa lý {grade} — Bộ sách 2026",
    subject: "Lịch sử & Địa lý",
    grade: "Lớp 5",
    cover: "🗺️",
    topics: LSDL_TOPICS,
  },
];

// Subjects available for SBT picker
const TEXTBOOK_SUBJECTS = Array.from(new Set(TEXTBOOKS.map((t) => t.subject)));

function findTextbook(subject: string, grade: string): Textbook | undefined {
  const tb = TEXTBOOKS.find((t) => t.subject === subject && t.grade === grade);
  if (!tb) return undefined;
  return {
    ...tb,
    title: tb.title.replace("{grade}", grade.replace("Lớp ", "")),
  };
}

function defaultSheets(lessonId: string): Sheet[] {
  return [
    {
      id: `${lessonId}-s1`,
      title: `Phiếu ${lessonId} — Khởi động`,
      questionCount: 5,
      type: "Trắc nghiệm",
    },
    {
      id: `${lessonId}-s2`,
      title: `Phiếu ${lessonId} — Luyện tập`,
      questionCount: 8,
      type: "Hỗn hợp",
    },
    {
      id: `${lessonId}-s3`,
      title: `Phiếu ${lessonId} — Vận dụng`,
      questionCount: 6,
      type: "Tự luận",
    },
  ];
}

const SHEETS_BY_LESSON: Record<string, Sheet[]> = {
  b1: [
    {
      id: "s1",
      title: "Phiếu 1.1 — Khởi động",
      questionCount: 5,
      type: "Trắc nghiệm",
    },
    {
      id: "s2",
      title: "Phiếu 1.2 — Luyện tập",
      questionCount: 8,
      type: "Hỗn hợp",
    },
    {
      id: "s3",
      title: "Phiếu 1.3 — Vận dụng",
      questionCount: 6,
      type: "Tự luận",
    },
  ],
  b2: [
    {
      id: "s4",
      title: "Phiếu 2.1 — Khởi động",
      questionCount: 5,
      type: "Trắc nghiệm",
    },
    {
      id: "s5",
      title: "Phiếu 2.2 — Luyện tập",
      questionCount: 10,
      type: "Hỗn hợp",
    },
  ],
  b3: [
    {
      id: "s6",
      title: "Phiếu 3.1 — Khởi động",
      questionCount: 6,
      type: "Trắc nghiệm",
    },
    {
      id: "s7",
      title: "Phiếu 3.2 — Luyện tập",
      questionCount: 8,
      type: "Hỗn hợp",
    },
    {
      id: "s8",
      title: "Phiếu 3.3 — Vận dụng cao",
      questionCount: 5,
      type: "Tự luận",
    },
  ],
  b4: [
    {
      id: "s9",
      title: "Phiếu 4.1 — Luyện tập",
      questionCount: 8,
      type: "Hỗn hợp",
    },
  ],
  b5: [
    {
      id: "s10",
      title: "Phiếu 5.1 — Luyện tập",
      questionCount: 8,
      type: "Hỗn hợp",
    },
  ],
  b6: [
    {
      id: "s11",
      title: "Phiếu 6.1 — Luyện tập",
      questionCount: 8,
      type: "Hỗn hợp",
    },
  ],
  tb1: [
    {
      id: "ts1",
      title: "Phiếu Bài 1.1 — Đọc, viết số đến 100 000",
      questionCount: 6,
      type: "Trắc nghiệm",
    },
    {
      id: "ts2",
      title: "Phiếu Bài 1.2 — So sánh & sắp xếp",
      questionCount: 8,
      type: "Hỗn hợp",
    },
  ],
  tb4: [
    {
      id: "ts3",
      title: "Phiếu Bài 4.1 — Tính giá trị biểu thức",
      questionCount: 8,
      type: "Hỗn hợp",
    },
    {
      id: "ts4",
      title: "Phiếu Bài 4.2 — Vận dụng",
      questionCount: 6,
      type: "Tự luận",
    },
  ],
  tb11: [
    {
      id: "ts5",
      title: "Phiếu Bài 11 — Hàng và lớp",
      questionCount: 10,
      type: "Hỗn hợp",
    },
  ],
};

export function TextbookPaperWizard({
  open,
  onOpenChange,
  kind,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  kind: PaperKind;
}) {
  const [step, setStep] = useState(0);
  const [subject, setSubject] = useState("Toán");
  const [grade, setGrade] = useState("Lớp 4");
  const [lessonId, setLessonId] = useState<string>("tb1");
  const [sheetIds, setSheetIds] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>(["4A"]);
  const [assignMode, setAssignMode] = useState<AssignMode>("required");

  const textbook = findTextbook(subject, grade);
  const topics = textbook?.topics ?? [];
  const allLessons = topics.flatMap((t) => t.lessons);
  const lesson = allLessons.find((l) => l.id === lessonId);
  const sheets = SHEETS_BY_LESSON[lessonId] ?? defaultSheets(lessonId);
  const selectedSheets = sheets.filter((s) => sheetIds.includes(s.id));
  const totalQ = selectedSheets.reduce((a, s) => a + s.questionCount, 0);

  // Available grades for the chosen subject
  const availableGrades = GRADES.filter((g) =>
    TEXTBOOKS.some((t) => t.subject === subject && t.grade === g),
  );

  // When subject changes, ensure grade & lesson are valid
  const handleSubjectChange = (s: string) => {
    setSubject(s);
    const grades = TEXTBOOKS.filter((t) => t.subject === s).map((t) => t.grade);
    const nextGrade = grades.includes(grade) ? grade : grades[0];
    if (nextGrade) setGrade(nextGrade);
    const nextTb = findTextbook(s, nextGrade ?? grade);
    const firstLesson = nextTb?.topics[0]?.lessons[0]?.id;
    setLessonId(firstLesson ?? "");
    setSheetIds([]);
  };

  const handleGradeChange = (g: string) => {
    setGrade(g);
    const nextTb = findTextbook(subject, g);
    const firstLesson = nextTb?.topics[0]?.lessons[0]?.id;
    setLessonId(firstLesson ?? "");
    setSheetIds([]);
  };

  const close = () => {
    onOpenChange(false);
    setTimeout(() => setStep(0), 200);
  };

  const submit = () => {
    toast.success(
      `📚 Đã giao phiếu từ sách bài tập (${ASSIGN_MODE_LABEL[assignMode]}) cho lớp ${classes.join(", ")}`,
      {
        description: `${selectedSheets.length} phiếu · ${totalQ} câu · ${lesson?.title}`,
      },
    );
    close();
  };

  const canNext = (() => {
    if (step === 0) return !!lessonId;
    if (step === 1) return sheetIds.length > 0;
    if (step === 2) return classes.length > 0;
    return true;
  })();

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) close();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <BookOpen className="size-5 text-info" />
            Tạo {KIND_LABEL[kind].toLowerCase()} theo sách bài tập
          </DialogTitle>
          <DialogDescription>
            Chọn phiếu có sẵn trong sách bài tập (SBT) và giao trực tiếp cho học
            sinh.
          </DialogDescription>
        </DialogHeader>

        <Stepper steps={STEPS} current={step} />

        {step === 0 && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Môn học</Label>
                <Select value={subject} onValueChange={handleSubjectChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEXTBOOK_SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Khối lớp</Label>
                <Select value={grade} onValueChange={handleGradeChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGrades.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {textbook ? (
              <div className="rounded-xl border-2 border-info bg-info/5 p-3 flex items-center gap-3">
                <div className="text-3xl">{textbook.cover}</div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{textbook.title}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {subject} · {grade} · Bộ sách chính thức từ 2026
                  </div>
                </div>
                <Check className="size-5 text-info" />
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 p-3 text-sm text-muted-foreground">
                Chưa có sách bài tập cho {subject} — {grade}.
              </div>
            )}

            <div>
              <Label className="mb-2 block">Chọn chủ đề & bài học</Label>
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {topics.length === 0 && (
                  <div className="text-xs text-muted-foreground italic">
                    Không có chủ đề.
                  </div>
                )}
                {topics.map((t) => (
                  <div key={t.id}>
                    <div className="text-xs font-bold text-info uppercase mb-1.5">
                      {t.title}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {t.lessons.map((l) => {
                        const active = lessonId === l.id;
                        const count = (
                          SHEETS_BY_LESSON[l.id] ?? defaultSheets(l.id)
                        ).length;
                        return (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => {
                              setLessonId(l.id);
                              setSheetIds([]);
                            }}
                            className={cn(
                              "rounded-xl border-2 p-3 text-left transition-all",
                              active
                                ? "border-info bg-info/10 shadow-sm"
                                : "border-border bg-background hover:border-info/40",
                            )}
                          >
                            <div className="font-semibold text-sm">
                              {l.title}
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">
                              {count} phiếu có sẵn
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <div className="text-sm">
              <span className="text-muted-foreground">Bài đã chọn: </span>
              <span className="font-bold">{lesson?.title}</span>
            </div>
            <div className="space-y-2">
              {sheets.map((s) => {
                const active = sheetIds.includes(s.id);
                return (
                  <label
                    key={s.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer transition-all",
                      active
                        ? "border-info bg-info/10"
                        : "border-border hover:border-info/40",
                    )}
                  >
                    <Checkbox
                      checked={active}
                      onCheckedChange={(v) =>
                        setSheetIds((arr) =>
                          v ? [...arr, s.id] : arr.filter((x) => x !== s.id),
                        )
                      }
                    />
                    <FileText className="size-5 text-info shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{s.title}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {s.questionCount} câu · {s.type}
                      </div>
                    </div>
                    {active && <Check className="size-4 text-info" />}
                  </label>
                );
              })}
            </div>
            {sheetIds.length > 0 && (
              <div className="rounded-lg bg-info/10 border border-info/40 p-2.5 text-xs">
                Đã chọn <strong>{sheetIds.length} phiếu</strong> · tổng{" "}
                <strong>{totalQ} câu</strong>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <Label className="block">Giao cho lớp</Label>
            <div className="grid grid-cols-3 gap-2">
              {CLASSES.filter((c) =>
                c.startsWith(grade.replace("Lớp ", "")),
              ).map((c) => {
                const active = classes.includes(c);
                return (
                  <OptionCard
                    key={c}
                    active={active}
                    onClick={() =>
                      setClasses((arr) =>
                        active ? arr.filter((x) => x !== c) : [...arr, c],
                      )
                    }
                    tone="info"
                  >
                    <div className="font-bold text-center">{c}</div>
                    <div className="text-[11px] text-muted-foreground text-center mt-0.5">
                      {active ? "✓ Đã chọn" : "Chọn"}
                    </div>
                  </OptionCard>
                );
              })}
            </div>
            <AssignModeSelector value={assignMode} onChange={setAssignMode} />
            <div className="rounded-lg bg-success/10 border border-success/40 p-3 text-sm">
              <div className="font-bold text-success">📋 Tóm tắt</div>
              <div className="mt-1 text-xs text-muted-foreground space-y-0.5">
                <div>• Sách: {textbook?.title ?? "—"}</div>
                <div>• Bài: {lesson?.title}</div>
                <div>
                  • {selectedSheets.length} phiếu · {totalQ} câu
                </div>
                <div>• Giao cho: {classes.join(", ") || "—"}</div>
                <div>
                  • Hình thức: <strong>{ASSIGN_MODE_LABEL[assignMode]}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-4 pt-3 border-t">
          <Button
            variant="outline"
            onClick={() => (step === 0 ? close() : setStep(step - 1))}
          >
            <ChevronLeft className="size-4" /> {step === 0 ? "Huỷ" : "Quay lại"}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canNext}
              className="bg-info hover:bg-info/90 text-info-foreground"
            >
              Tiếp tục <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              onClick={submit}
              disabled={!canNext}
              className="bg-info hover:bg-info/90 text-info-foreground"
            >
              <Send className="size-4 mr-1" /> Giao phiếu
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
