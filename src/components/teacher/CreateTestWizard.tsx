import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  FileText,
  ClipboardList,
  Users,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Stepper, OptionCard, CLASSES } from "./PaperWizardShared";
import { PAPERS } from "@/lib/mock-papers";
import { cn } from "@/lib/utils";

const STEPS = ["Chọn đề", "Giao bài"];
const DURATIONS = [15, 30, 45];

export function CreateTestWizard({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [step, setStep] = useState(0);
  const [className, setClassName] = useState("4A");
  const [paperId, setPaperId] = useState<string | null>(null);
  const [duration, setDuration] = useState(30);

  const paper = PAPERS.find((p) => p.id === paperId);
  const close = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(0);
      setPaperId(null);
    }, 200);
  };

  const submit = () => {
    toast.success(`📋 Đã giao "${paper?.title}" cho lớp ${className}`, {
      description: `Thời gian làm bài: ${duration} phút · ${paper?.questionCount} câu`,
    });
    close();
  };

  const canNext = (() => {
    if (step === 0) return !!className && !!paperId && !!duration;
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
            ➕ Tạo cuộc thi / kiểm tra
          </DialogTitle>
          <DialogDescription>
            2 bước để giao bài kiểm tra hoặc luyện thi cho lớp.
          </DialogDescription>
        </DialogHeader>

        <Stepper steps={STEPS} current={step} />

        {step === 0 && (
          <div className="space-y-5">
            {/* Lớp */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="size-4 text-primary" /> Chọn lớp tham gia
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

            {/* Bài */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <FileText className="size-4 text-primary" /> Chọn bài đã tạo ở
                mục <strong>Tạo đề/phiếu</strong>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 max-h-[35vh] overflow-y-auto pr-1">
                {PAPERS.map((p) => {
                  const active = paperId === p.id;
                  const Icon = p.kind === "exam" ? FileText : ClipboardList;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPaperId(p.id);
                        setDuration(
                          p.durationMin <= 15
                            ? 15
                            : p.durationMin <= 30
                              ? 30
                              : 45,
                        );
                      }}
                      className={cn(
                        "text-left rounded-xl border-2 p-3 transition-all",
                        active
                          ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                          : "border-border hover:border-primary/50",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <Icon
                          className={cn(
                            "size-4 mt-0.5 shrink-0",
                            p.kind === "exam" ? "text-primary" : "text-info",
                          )}
                        />
                        <div className="flex-1">
                          <div className="font-bold text-sm">{p.title}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {p.kind === "exam"
                              ? "Đề kiểm tra"
                              : "Phiếu bài tập"}{" "}
                            · {p.questionCount} câu · {p.durationMin}p
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Thời gian */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="size-4 text-primary" /> Thời gian làm bài
              </div>
              <div className="grid grid-cols-3 gap-3">
                {DURATIONS.map((d) => (
                  <OptionCard
                    key={d}
                    active={duration === d}
                    onClick={() => setDuration(d)}
                  >
                    <div className="font-display font-bold text-2xl text-center">
                      {d}p
                    </div>
                    <div className="text-[11px] text-muted-foreground text-center mt-0.5">
                      {d === 15
                        ? "Kiểm tra nhanh"
                        : d === 30
                          ? "Kiểm tra chuẩn"
                          : "Luyện thi đầy đủ"}
                    </div>
                  </OptionCard>
                ))}
              </div>
              {paper && paper.durationMin !== duration && (
                <div className="text-xs text-warning-foreground bg-warning/10 border border-warning/40 rounded-lg p-2">
                  ⚠️ Bài gốc thiết kế cho {paper.durationMin} phút — bạn đang
                  điều chỉnh sang {duration} phút.
                </div>
              )}
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
                  📋 <strong>Bài:</strong> {paper.title}
                </div>
                <div>
                  👥 <strong>Lớp:</strong> {className}
                </div>
                <div>
                  ⏱️ <strong>Thời gian:</strong> {duration} phút
                </div>
                <div>
                  📝 <strong>Số câu:</strong> {paper.questionCount}
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Hệ thống sẽ tự động gửi thông báo đến tất cả học sinh trong lớp{" "}
              {className}.
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
