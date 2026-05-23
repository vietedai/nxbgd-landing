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
import {
  ChevronLeft,
  ChevronRight,
  Send,
  ClipboardList,
  Users,
  Calendar,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import {
  Stepper,
  OptionCard,
  CLASSES,
  AssignModeSelector,
  ASSIGN_MODE_LABEL,
  type AssignMode,
} from "./PaperWizardShared";
import { PAPERS } from "@/lib/mock-papers";
import { cn } from "@/lib/utils";

const STEPS = ["Chọn phiếu", "Giao bài"];

function defaultDue() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

export function AssignWizard({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [step, setStep] = useState(0);
  const [className, setClassName] = useState("4A");
  const [paperId, setPaperId] = useState<string | null>(null);
  const [due, setDue] = useState(defaultDue());
  const [notify, setNotify] = useState(true);
  const [assignMode, setAssignMode] = useState<AssignMode>("required");

  const worksheets = PAPERS.filter((p) => p.kind === "worksheet");
  const paper = worksheets.find((p) => p.id === paperId);

  const close = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(0);
      setPaperId(null);
      setDue(defaultDue());
      setNotify(true);
    }, 200);
  };

  const submit = () => {
    toast.success(
      `📤 Đã giao "${paper?.title}" (${ASSIGN_MODE_LABEL[assignMode]}) cho lớp ${className}`,
      {
        description: `Hạn nộp: ${new Date(due).toLocaleDateString("vi-VN")}${notify ? " · Đã gửi thông báo cho HS" : ""}`,
      },
    );
    close();
  };

  const canNext = !!className && !!paperId && !!due;

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
            📤 Giao phiếu bài tập
          </DialogTitle>
          <DialogDescription>
            2 bước để giao phiếu bài tập đã tạo cho học sinh.
          </DialogDescription>
        </DialogHeader>

        <Stepper steps={STEPS} current={step} />

        {step === 0 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="size-4 text-primary" /> Chọn lớp nhận bài
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {CLASSES.map((c) => (
                  <OptionCard
                    key={c}
                    active={className === c}
                    onClick={() => setClassName(c)}
                  >
                    <div className="font-bold text-center">{c}</div>
                  </OptionCard>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <ClipboardList className="size-4 text-primary" /> Chọn phiếu bài
                tập
              </div>
              {worksheets.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed p-6 text-center text-sm text-muted-foreground">
                  Chưa có phiếu nào. Vào <strong>Tạo đề/phiếu</strong> để tạo
                  phiếu trước.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-2 max-h-[35vh] overflow-y-auto pr-1">
                  {worksheets.map((p) => {
                    const active = paperId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPaperId(p.id)}
                        className={cn(
                          "text-left rounded-xl border-2 p-3 transition-all",
                          active
                            ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <ClipboardList className="size-4 mt-0.5 shrink-0 text-info" />
                          <div className="flex-1">
                            <div className="font-bold text-sm">{p.title}</div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">
                              Phiếu bài tập · {p.questionCount} câu · ~
                              {p.durationMin}p
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="size-4 text-primary" /> Hạn nộp bài
              </div>
              <Input
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className="max-w-xs"
              />
            </div>
          </div>
        )}

        {step === 1 && paper && (
          <div className="space-y-3">
            <div className="rounded-lg bg-success/10 border-2 border-success/40 p-4">
              <div className="font-display font-bold text-success mb-2">
                ✅ Sẵn sàng giao bài
              </div>
              <div className="text-sm space-y-1">
                <div>
                  📋 <strong>Phiếu:</strong> {paper.title}
                </div>
                <div>
                  👥 <strong>Lớp:</strong> {className}
                </div>
                <div>
                  📅 <strong>Hạn nộp:</strong>{" "}
                  {new Date(due).toLocaleDateString("vi-VN")}
                </div>
                <div>
                  📝 <strong>Số câu:</strong> {paper.questionCount} câu (~
                  {paper.durationMin} phút)
                </div>
                <div>
                  📌 <strong>Hình thức:</strong> {ASSIGN_MODE_LABEL[assignMode]}
                </div>
              </div>
            </div>

            <AssignModeSelector value={assignMode} onChange={setAssignMode} />

            <button
              type="button"
              onClick={() => setNotify(!notify)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all",
                notify
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background",
              )}
            >
              <div
                className={cn(
                  "size-5 rounded border-2 grid place-items-center shrink-0",
                  notify ? "bg-primary border-primary" : "border-border",
                )}
              >
                {notify && (
                  <span className="text-primary-foreground text-xs font-bold">
                    ✓
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm flex items-center gap-1.5">
                  <Bell className="size-3.5" /> Gửi thông báo cho học sinh
                </div>
                <div className="text-xs text-muted-foreground">
                  Học sinh nhận thông báo trên app + email (nếu đã liên kết).
                </div>
              </div>
            </button>

            <div className="text-xs text-muted-foreground">
              Hệ thống sẽ tạo bản ghi giao bài cho lớp{" "}
              <strong>{className}</strong> và xuất hiện trong mục "Bài đã giao".
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
            <Button onClick={submit} className="bg-success hover:bg-success/90">
              <Send className="size-4 mr-1" /> Giao bài
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
