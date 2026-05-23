import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Sparkles, Loader2, Lightbulb, CheckCircle2 } from "lucide-react";
import { callAIJson } from "@/lib/ai-client";
import { toast } from "sonner";

type Feedback = {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestion: string;
  vocabularyTips: string[];
};

export function EssayCoachPanel() {
  const [prompt, setPrompt] = useState(
    "Em hãy tả cảnh buổi sáng trên cánh đồng quê em.",
  );
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [fb, setFb] = useState<Feedback | null>(null);

  async function review() {
    if (draft.trim().length < 20) {
      toast.error("Em viết thêm chút nữa rồi nhờ AI góp ý nhé!");
      return;
    }
    setLoading(true);
    setFb(null);

    const { data, error } = await callAIJson<Feedback>({
      system:
        "Bạn là cô giáo dạy Tiếng Việt cấp tiểu học. Hãy đọc bài tự luận của học sinh và đưa ra nhận xét tích cực, dễ hiểu. Khen điểm mạnh trước, sau đó góp ý nhẹ nhàng. Tuyệt đối không sửa thay học sinh.",
      prompt: `Đề bài: ${prompt}\n\nBài làm của em:\n${draft}\n\nHãy đánh giá và góp ý.`,
      tool: {
        name: "review_essay",
        description: "Chấm và góp ý bài tự luận tiểu học",
        parameters: {
          type: "object",
          properties: {
            score: { type: "number" },
            strengths: { type: "array", items: { type: "string" } },
            improvements: { type: "array", items: { type: "string" } },
            suggestion: { type: "string" },
            vocabularyTips: { type: "array", items: { type: "string" } },
          },
          required: [
            "score",
            "strengths",
            "improvements",
            "suggestion",
            "vocabularyTips",
          ],
        },
      },
    });

    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    if (data) {
      setFb(data);
      toast.success("AI đã góp ý xong!");
    }
  }

  return (
    <div className="space-y-5">
      <Card className="p-5 border-2 space-y-4">
        <div>
          <label className="text-xs uppercase font-bold text-muted-foreground mb-1 block">
            Đề bài
          </label>
          <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        </div>
        <div>
          <label className="text-xs uppercase font-bold text-muted-foreground mb-1 block">
            Bài làm của em
          </label>
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Bắt đầu viết bài tại đây..."
            rows={10}
            className="text-base leading-relaxed"
          />
          <div className="text-xs text-muted-foreground mt-1">
            {draft.trim().split(/\s+/).filter(Boolean).length} từ
          </div>
        </div>
        <Button
          onClick={review}
          disabled={loading}
          className="btn-pop rounded-full px-6 h-11"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 mr-1 animate-spin" /> AI đang đọc...
            </>
          ) : (
            <>
              <Sparkles className="size-4 mr-1" /> Nhờ AI góp ý
            </>
          )}
        </Button>
      </Card>

      {fb && (
        <div className="space-y-4 animate-pop-in">
          <Card className="p-5 border-2 border-fun bg-gradient-to-br from-fun/10 to-primary/5">
            <div className="flex items-center gap-3">
              <div className="size-16 rounded-full bg-fun text-fun-foreground flex items-center justify-center font-display text-2xl font-bold">
                {fb.score.toFixed(1)}
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-fun">
                  Điểm AI
                </div>
                <div className="font-display text-xl font-bold">
                  {fb.score >= 8
                    ? "Tuyệt vời!"
                    : fb.score >= 6.5
                      ? "Khá tốt"
                      : "Cố lên nhé!"}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-2 border-success bg-success/5">
            <div className="font-display font-bold text-success mb-2 flex items-center gap-2">
              <CheckCircle2 /> Điểm mạnh của em
            </div>
            <ul className="space-y-1.5 text-sm">
              {fb.strengths.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-success">✓</span> {s}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 border-2 border-warning bg-warning/5">
            <div className="font-display font-bold text-warning-foreground mb-2 flex items-center gap-2">
              <Lightbulb className="text-warning" /> Có thể tốt hơn nếu...
            </div>
            <ul className="space-y-1.5 text-sm">
              {fb.improvements.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span>•</span> {s}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 border-2 border-info bg-info/5">
            <div className="font-display font-bold text-info mb-2">
              💡 Gợi ý của Cô AI
            </div>
            <p className="text-sm leading-relaxed">{fb.suggestion}</p>
            {fb.vocabularyTips.length > 0 && (
              <div className="mt-3">
                <div className="text-xs uppercase font-bold text-muted-foreground mb-1">
                  Từ ngữ gợi ý
                </div>
                <div className="flex flex-wrap gap-2">
                  {fb.vocabularyTips.map((v, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-info/15 text-info text-xs font-bold"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
