import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Lightbulb, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeedbackBox({
  status,
  explanation,
  onNext,
}: {
  status: "correct" | "incorrect" | "partial";
  explanation?: string;
  onNext?: () => void;
}) {
  const styles =
    status === "correct"
      ? "bg-success/15 border-success text-foreground"
      : status === "partial"
        ? "bg-warning/15 border-warning"
        : "bg-destructive/15 border-destructive";
  const Icon =
    status === "correct" ? Check : status === "partial" ? Sparkles : X;
  const title =
    status === "correct"
      ? "Tuyệt vời! 🎉"
      : status === "partial"
        ? "Gần đúng rồi!"
        : "Chưa chính xác 😢";
  return (
    <Card className={cn("border-2 p-4 mt-4 animate-pop-in", styles)}>
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-card p-2">
          <Icon className="size-5" />
        </div>
        <div className="flex-1">
          <div className="font-display text-lg font-bold">{title}</div>
          {explanation && (
            <div className="mt-1 text-sm">
              <span className="font-semibold">💡 Giải thích AI: </span>
              {explanation}
            </div>
          )}
        </div>
        {onNext && (
          <Button onClick={onNext} className="btn-pop">
            Tiếp →
          </Button>
        )}
      </div>
    </Card>
  );
}

export function HintButton({ hint }: { hint?: string }) {
  const [open, setOpen] = useState(false);
  if (!hint) return null;
  return (
    <div className="mt-3">
      <Button
        variant="outline"
        size="sm"
        className="rounded-full border-warning text-warning-foreground bg-warning/20 hover:bg-warning/30"
        onClick={() => setOpen(!open)}
      >
        <Lightbulb className="size-4 mr-1" />
        Gợi ý từ AI
      </Button>
      {open && (
        <div className="mt-2 rounded-xl border-2 border-dashed border-warning bg-warning/10 p-3 text-sm animate-pop-in">
          {hint}
        </div>
      )}
    </div>
  );
}

export interface InteractionProps<T> {
  question: T;
  onAnswer: (result: {
    correct: boolean;
    partial?: boolean;
    userAnswer?: unknown;
  }) => void;
  showFeedback?: boolean;
}
