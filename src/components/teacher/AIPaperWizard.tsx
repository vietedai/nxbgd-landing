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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Send,
  Users,
  Brain,
} from "lucide-react";
import { toast } from "sonner";
import {
  Stepper,
  OptionCard,
  SUBJECTS,
  GRADES,
  FORMATS,
  COMPETENCY_GROUPS,
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

const STEPS = ["Môn & Lớp", "Năng lực HS", "Giao lớp"];

export function AIPaperWizard({
  open,
  onOpenChange,
  kind,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  kind: PaperKind;
}) {
  const [step, setStep] = useState(0);
  const [subject, setSubject] = useState("Khoa học");
  const [grade, setGrade] = useState("Lớp 4");
  const [formats, setFormats] = useState<PaperFormat[]>(["gamification"]);
  const [questionCount, setQuestionCount] = useState(10);
  const [duration, setDuration] = useState(20);
  const [competency, setCompetency] = useState<
    "all" | "by-level" | "personalized"
  >("by-level");
  const [classIds, setClassIds] = useState<string[]>([]);
  const [assignMode, setAssignMode] = useState<AssignMode>("required");

  const gradeNum = grade.replace("Lớp ", "");
  const availableClasses = CLASSES.filter((c) => c.startsWith(gradeNum));

  const close = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(0);
      setClassIds([]);
    }, 200);
  };

  const toggleClass = (c: string) =>
    setClassIds((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  const submit = () => {
    if (classIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 lớp để giao");
      return;
    }
    const groups =
      competency === "all"
        ? "1 phiếu chung"
        : competency === "by-level"
          ? "3 phiếu (Giỏi / Khá / Cần hỗ trợ)"
          : "phiếu cá nhân hoá";
    toast.success(
      `✨ AI đã sinh & giao ${KIND_LABEL[kind].toLowerCase()} thành công`,
      {
        description: `${ASSIGN_MODE_LABEL[assignMode]} · ${subject} · ${grade} · ${groups} · ${classIds.join(", ")}`,
      },
    );
    close();
  };

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
            <Sparkles className="size-5 text-fun" />
            AI sinh {KIND_LABEL[kind].toLowerCase()}
          </DialogTitle>
          <DialogDescription>
            AI sẽ tự phân tích năng lực học sinh và sinh phiếu phù hợp.
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
                  onValueChange={(v) => {
                    setGrade(v);
                    setClassIds([]);
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
                Hình thức{" "}
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
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Số câu hỏi</Label>
                <Input
                  type="number"
                  min={1}
                  className="mt-1"
                  value={questionCount}
                  onChange={(e) =>
                    setQuestionCount(Number(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <Label>Thời gian (phút)</Label>
                <Input
                  type="number"
                  min={1}
                  className="mt-1"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground flex items-start gap-2">
              <Brain className="size-4 mt-0.5 text-info shrink-0" />
              <span>
                AI phân tích lịch sử học tập để đề xuất câu hỏi phù hợp năng lực
                từng học sinh.
              </span>
            </div>
            <div className="grid gap-2">
              {COMPETENCY_GROUPS.map((c) => (
                <OptionCard
                  key={c.value}
                  active={competency === c.value}
                  onClick={() => setCompetency(c.value)}
                  tone={
                    c.value === "personalized"
                      ? "fun"
                      : c.value === "by-level"
                        ? "info"
                        : "primary"
                  }
                >
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    <Users className="size-4" /> {c.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {c.desc}
                  </div>
                </OptionCard>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label className="block mb-2">Nguồn câu hỏi</Label>
              <OptionCard active onClick={() => {}} tone="fun">
                <div className="font-bold text-sm">✨ AI tự sinh</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  AI sinh câu hỏi mới, tự cân bằng độ khó & ma trận theo năng
                  lực HS.
                </div>
              </OptionCard>
            </div>

            <div>
              <Label className="block mb-2">Giao cho lớp ({grade})</Label>
              {availableClasses.length === 0 ? (
                <div className="text-xs text-muted-foreground rounded-lg border border-dashed p-3">
                  Chưa có lớp nào thuộc {grade}.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableClasses.map((c) => {
                    const active = classIds.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleClass(c)}
                        className={cn(
                          "rounded-lg border-2 px-3 py-2 text-sm font-bold transition-all",
                          active
                            ? "border-fun bg-fun/10 text-foreground"
                            : "border-border bg-background hover:border-fun/40",
                        )}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-lg border p-3 text-xs space-y-1">
              <div>
                📚 <strong>Môn:</strong> {subject} · {grade}
              </div>
              <div>
                🎯 <strong>Hình thức:</strong>{" "}
                {formats
                  .map((f) => FORMATS.find((x) => x.value === f)?.label)
                  .join(" + ")}
              </div>
              <div>
                🔢 <strong>Số câu:</strong> {questionCount} · ⏱ {duration} phút
              </div>
              <div>
                🧠 <strong>Năng lực:</strong>{" "}
                {COMPETENCY_GROUPS.find((c) => c.value === competency)?.label}
              </div>
              <div>
                🏫 <strong>Lớp giao:</strong>{" "}
                {classIds.length ? classIds.join(", ") : "Chưa chọn"}
              </div>
              <div>
                📌 <strong>Hình thức giao:</strong>{" "}
                {ASSIGN_MODE_LABEL[assignMode]}
              </div>
            </div>
            <AssignModeSelector value={assignMode} onChange={setAssignMode} />
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
              className="bg-fun hover:bg-fun/90 text-fun-foreground"
            >
              Tiếp tục <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              onClick={submit}
              className="bg-fun hover:bg-fun/90 text-fun-foreground"
            >
              <Send className="size-4 mr-1" /> AI sinh & Giao
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
