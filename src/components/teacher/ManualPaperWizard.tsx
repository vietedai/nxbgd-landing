import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Database,
  Send,
  Building2,
  User,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import {
  Stepper,
  OptionCard,
  SUBJECTS,
  GRADES,
  FORMATS,
  CLASSES,
  type PaperFormat,
} from "./PaperWizardShared";
import {
  AssignModeSelector,
  ASSIGN_MODE_LABEL,
  type AssignMode,
} from "./PaperWizardShared";
import type { PaperKind } from "@/lib/mock-papers";
import { KIND_LABEL } from "@/lib/mock-papers";
import { cn } from "@/lib/utils";

const STEPS = ["Môn & Lớp", "Ma trận", "Giao lớp"];
const LEVELS = ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"] as const;

/* Cấu trúc nguồn câu hỏi đồng bộ với /teacher/bank:
   - NXBGDVN: Lớp → Môn → Chủ đề → Ngân hàng
   - Cá nhân: danh sách ngân hàng phẳng do GV tạo
   - AI sinh: danh sách ngân hàng AI đã sinh
*/
type Bank = { id: string; title: string; count: number };
type Topic = { id: string; title: string; banks: Bank[] };
type SourceKind = "nxb" | "personal" | "ai";

const NXB_TREE: Record<string, Record<string, Topic[]>> = {
  "Lớp 4": {
    "Khoa học": [
      {
        id: "t1",
        title: "Nước",
        banks: [
          { id: "nxb-n1", title: "NH cơ bản về Nước", count: 24 },
          { id: "nxb-n2", title: "NH nâng cao về Nước", count: 18 },
        ],
      },
      {
        id: "t2",
        title: "Vòng tuần hoàn",
        banks: [{ id: "nxb-v1", title: "NH Vòng tuần hoàn", count: 30 }],
      },
      {
        id: "t3",
        title: "Không khí",
        banks: [{ id: "nxb-k1", title: "NH Không khí", count: 20 }],
      },
    ],
    Toán: [
      {
        id: "tm1",
        title: "Phân số",
        banks: [{ id: "nxb-ps1", title: "NH Phân số cơ bản", count: 35 }],
      },
    ],
    "Tiếng Việt": [
      {
        id: "ttv1",
        title: "Từ loại",
        banks: [{ id: "nxb-tl1", title: "NH Danh từ - Động từ", count: 22 }],
      },
    ],
  },
  "Lớp 5": {
    "Khoa học": [
      {
        id: "t51",
        title: "Cơ thể người",
        banks: [{ id: "nxb-ct1", title: "NH Cơ thể người", count: 22 }],
      },
    ],
  },
};

// Ngân hàng cá nhân & AI: phẳng theo môn (đồng bộ ý tưởng /teacher/bank)
const PERSONAL_BANKS: Record<string, Bank[]> = {
  "Khoa học": [
    { id: "ps-1", title: "NH Cá nhân — Ôn tập chương 1", count: 12 },
    { id: "ps-2", title: "NH Cá nhân — Câu hỏi yêu thích", count: 8 },
  ],
  Toán: [{ id: "ps-3", title: "NH Cá nhân — Bài tập nâng cao", count: 15 }],
  "Tiếng Việt": [{ id: "ps-4", title: "NH Cá nhân — Tập làm văn", count: 10 }],
};

const AI_BANKS: Record<string, Bank[]> = {
  "Khoa học": [
    { id: "ai-1", title: "NH AI — Vòng tuần hoàn (sinh 12/04)", count: 20 },
    { id: "ai-2", title: "NH AI — Không khí (sinh 10/04)", count: 14 },
  ],
  Toán: [{ id: "ai-3", title: "NH AI — Phân số (sinh 08/04)", count: 18 }],
  "Tiếng Việt": [
    { id: "ai-4", title: "NH AI — Từ loại (sinh 05/04)", count: 12 },
  ],
};

const SOURCE_OPTIONS: {
  value: SourceKind;
  label: string;
  desc: string;
  icon: typeof Building2;
  tone: "primary" | "info" | "fun";
}[] = [
  {
    value: "nxb",
    label: "NXBGDVN",
    desc: "Ngân hàng chính thống từ NXB Giáo dục.",
    icon: Building2,
    tone: "primary",
  },
  {
    value: "personal",
    label: "Cá nhân",
    desc: "Câu hỏi do cô tự tạo & lưu trữ.",
    icon: User,
    tone: "info",
  },
  {
    value: "ai",
    label: "AI sinh",
    desc: "Ngân hàng đã được AI sinh sẵn.",
    icon: Bot,
    tone: "fun",
  },
];

export function ManualPaperWizard({
  open,
  onOpenChange,
  kind,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  kind: PaperKind;
}) {
  const [step, setStep] = useState(0);
  // B1 — Môn & Lớp + Số câu/Thời gian
  const [subject, setSubject] = useState("Khoa học");
  const [grade, setGrade] = useState("Lớp 4");
  const [formats, setFormats] = useState<PaperFormat[]>(["quiz"]);
  const [count, setCount] = useState(10);
  const [duration, setDuration] = useState(20);
  // B2 — Ma trận + Nguồn câu hỏi (lấy từ /teacher/bank)
  const [matrix, setMatrix] = useState<number[]>([30, 30, 25, 15]);
  const [source, setSource] = useState<SourceKind>("nxb");
  const [bankIds, setBankIds] = useState<string[]>([]);
  // B3 — Giao lớp
  const [classes, setClasses] = useState<string[]>(["4A"]);
  const [assignMode, setAssignMode] = useState<AssignMode>("required");

  const matrixSum = matrix.reduce((a, b) => a + b, 0);
  const nxbTopics: Topic[] = NXB_TREE[grade]?.[subject] ?? [];
  const personalBanks: Bank[] = PERSONAL_BANKS[subject] ?? [];
  const aiBanks: Bank[] = AI_BANKS[subject] ?? [];
  const allBanksForSource: Bank[] =
    source === "nxb"
      ? nxbTopics.flatMap((t) => t.banks)
      : source === "personal"
        ? personalBanks
        : aiBanks;
  const selectedBanks = allBanksForSource.filter((b) => bankIds.includes(b.id));
  const totalBankQ = selectedBanks.reduce((a, b) => a + b.count, 0);
  const sourceLabel =
    SOURCE_OPTIONS.find((s) => s.value === source)?.label ?? "";

  const close = () => {
    onOpenChange(false);
    setTimeout(() => setStep(0), 200);
  };

  const submit = () => {
    toast.success(
      `Đã tạo & giao ${KIND_LABEL[kind].toLowerCase()} (${ASSIGN_MODE_LABEL[assignMode]}) cho lớp ${classes.join(", ")}`,
      {
        description: `${subject} · ${grade} · ${count} câu · ${duration} phút`,
      },
    );
    close();
  };

  const canNext = (() => {
    if (step === 0) return !!subject && !!grade;
    if (step === 1)
      return matrixSum === 100 && (source === "ai" || bankIds.length > 0);
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
          <DialogTitle className="font-display text-xl">
            ➕ Thêm thủ công – {KIND_LABEL[kind]}
          </DialogTitle>
          <DialogDescription>
            Hoàn thành 3 bước để tạo và giao phiếu cho học sinh.
          </DialogDescription>
        </DialogHeader>

        <Stepper steps={STEPS} current={step} />

        {step === 0 && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Môn học</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Khối lớp</Label>
                <Select
                  value={grade}
                  onValueChange={(g) => {
                    setGrade(g);
                    setClasses([]);
                    setBankIds([]);
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="mb-2 block">
                Hình thức câu hỏi{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  (chọn 1 hoặc cả 2)
                </span>
              </Label>
              <div className="grid sm:grid-cols-2 gap-2">
                {FORMATS.map((f) => {
                  const active = formats.includes(f.value);
                  return (
                    <OptionCard
                      key={f.value}
                      active={active}
                      onClick={() =>
                        setFormats((arr) => {
                          if (active) {
                            // không cho bỏ hết — phải còn ít nhất 1
                            return arr.length > 1
                              ? arr.filter((x) => x !== f.value)
                              : arr;
                          }
                          return [...arr, f.value];
                        })
                      }
                      tone={f.value === "gamification" ? "warning" : "primary"}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        {f.emoji} {f.label}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {f.desc}
                      </div>
                    </OptionCard>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t">
              <Label className="mb-2 block">Số câu / Thời gian</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Số câu hỏi</Label>
                  <Input
                    type="number"
                    min={1}
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Thời gian (phút)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">
                Ma trận theo mức độ nhận thức
              </Label>
              <div className="text-xs text-muted-foreground mb-2">
                Tổng phải bằng 100%.
              </div>
              <div className="space-y-2">
                {LEVELS.map((l, i) => (
                  <div key={l} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{l}</span>
                      <span className="font-bold text-primary">
                        {matrix[i]}%
                      </span>
                    </div>
                    <Slider
                      value={[matrix[i]]}
                      max={100}
                      step={5}
                      onValueChange={(v) =>
                        setMatrix((m) =>
                          m.map((x, idx) => (idx === i ? v[0] : x)),
                        )
                      }
                    />
                  </div>
                ))}
              </div>
              <div
                className={`mt-2 p-2 rounded-lg text-sm font-bold flex justify-between ${
                  matrixSum === 100
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                <span>Tổng</span>
                <span>
                  {matrixSum}% {matrixSum === 100 ? "✓" : "(cần = 100%)"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t">
              <Label className="mb-2 block">
                Nguồn câu hỏi{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  (lấy từ Ngân hàng câu hỏi)
                </span>
              </Label>
              <div className="grid sm:grid-cols-3 gap-2">
                {SOURCE_OPTIONS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <OptionCard
                      key={s.value}
                      active={source === s.value}
                      onClick={() => {
                        setSource(s.value);
                        setBankIds([]);
                      }}
                      tone={s.tone}
                    >
                      <div className="font-bold text-sm flex items-center gap-1.5">
                        <Icon className="size-4" /> {s.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {s.desc}
                      </div>
                    </OptionCard>
                  );
                })}
              </div>
            </div>

            <div>
              <Label className="mb-2 block flex items-center gap-1.5">
                <Database className="size-4 text-info" />
                Chọn ngân hàng —{" "}
                <span className="text-primary">{sourceLabel}</span>
                <span className="text-xs text-muted-foreground font-normal">
                  ({source === "nxb" ? `${grade} · ${subject}` : subject})
                </span>
              </Label>

              {source === "nxb" ? (
                nxbTopics.length === 0 ? (
                  <div className="text-xs text-muted-foreground bg-muted/40 rounded-lg p-3">
                    Chưa có ngân hàng NXBGDVN cho {subject} – {grade}.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[280px] overflow-y-auto rounded-lg border p-2">
                    {nxbTopics.map((t) => (
                      <div key={t.id}>
                        <div className="text-[11px] font-bold text-info uppercase mb-1.5 px-1">
                          {t.title}
                        </div>
                        <div className="space-y-1">
                          {t.banks.map((b) => (
                            <BankRow
                              key={b.id}
                              bank={b}
                              active={bankIds.includes(b.id)}
                              onToggle={(v) =>
                                setBankIds((arr) =>
                                  v
                                    ? [...arr, b.id]
                                    : arr.filter((x) => x !== b.id),
                                )
                              }
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                (() => {
                  const banks = source === "personal" ? personalBanks : aiBanks;
                  if (banks.length === 0) {
                    return (
                      <div className="text-xs text-muted-foreground bg-muted/40 rounded-lg p-3">
                        Chưa có ngân hàng {sourceLabel.toLowerCase()} cho{" "}
                        {subject}.
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-1 max-h-[280px] overflow-y-auto rounded-lg border p-2">
                      {banks.map((b) => (
                        <BankRow
                          key={b.id}
                          bank={b}
                          active={bankIds.includes(b.id)}
                          onToggle={(v) =>
                            setBankIds((arr) =>
                              v
                                ? [...arr, b.id]
                                : arr.filter((x) => x !== b.id),
                            )
                          }
                        />
                      ))}
                    </div>
                  );
                })()
              )}

              {bankIds.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2 flex gap-2">
                  <Database className="size-4 shrink-0 mt-0.5" />
                  <span>
                    Đã chọn <strong>{bankIds.length} ngân hàng</strong> · tổng{" "}
                    <strong>{totalBankQ} câu</strong> sẵn có. Sẽ lấy{" "}
                    <strong>{count} câu</strong> phù hợp ma trận.
                  </span>
                </div>
              )}
              {source === "ai" && (
                <div className="mt-2 text-xs text-muted-foreground bg-fun/10 rounded-lg p-2 flex gap-2">
                  <Sparkles className="size-4 shrink-0 mt-0.5 text-fun" />
                  <span>
                    Bạn có thể vào <strong>/teacher/bank → AI sinh</strong> để
                    tạo thêm ngân hàng AI mới.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <Label className="block">
              Giao cho lớp{" "}
              <span className="text-xs text-muted-foreground font-normal">
                ({grade})
              </span>
            </Label>
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
                <div>
                  • {subject} · {grade} ·{" "}
                  {formats
                    .map((f) => FORMATS.find((x) => x.value === f)?.label)
                    .join(" + ")}
                </div>
                <div>
                  • {count} câu · {duration} phút
                </div>
                <div>
                  • Nguồn: {sourceLabel}
                  {bankIds.length > 0 &&
                    ` · ${bankIds.length} ngân hàng · ${totalBankQ} câu sẵn có`}
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
            <Button onClick={() => setStep(step + 1)} disabled={!canNext}>
              Tiếp tục <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              onClick={submit}
              disabled={!canNext}
              className="bg-success hover:bg-success/90"
            >
              <Send className="size-4 mr-1" /> Tạo & Giao phiếu
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BankRow({
  bank,
  active,
  onToggle,
}: {
  bank: Bank;
  active: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg border-2 transition-all",
        active
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary/40",
      )}
    >
      <Checkbox checked={active} onCheckedChange={(v) => onToggle(!!v)} />
      <Database className="size-4 text-info shrink-0" />
      <span className="flex-1 font-medium">{bank.title}</span>
      <span className="text-[11px] text-muted-foreground">
        {bank.count} câu
      </span>
    </label>
  );
}
