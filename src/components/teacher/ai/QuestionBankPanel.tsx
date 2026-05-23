import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Sparkles, Loader2, Check } from "lucide-react";
import { callAIJson } from "@/lib/ai-client";
import { toast } from "sonner";

type GenQuestion = {
  type: "single_choice" | "true_false" | "fill_blank" | "short_answer";
  question: string;
  options?: string[];
  answer: string;
  difficulty: "easy" | "medium" | "hard";
};

const LABELS: Record<GenQuestion["type"], string> = {
  single_choice: "Trắc nghiệm",
  true_false: "Đúng/Sai",
  fill_blank: "Điền khuyết",
  short_answer: "Tự luận ngắn",
};

const DIFF_COLOR: Record<GenQuestion["difficulty"], string> = {
  easy: "bg-success/15 text-success",
  medium: "bg-warning/15 text-warning-foreground",
  hard: "bg-destructive/15 text-destructive",
};

export function QuestionBankPanel() {
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<GenQuestion[]>([]);
  const [saved, setSaved] = useState(false);

  async function generate() {
    if (content.trim().length < 50) {
      toast.error("Cô dán nội dung dài hơn 50 ký tự nhé!");
      return;
    }
    setLoading(true);
    setQuestions([]);
    setSaved(false);

    const { data, error } = await callAIJson<{ questions: GenQuestion[] }>({
      system:
        "Bạn là chuyên gia thiết kế câu hỏi cho học sinh tiểu học Việt Nam, bám sát chương trình GDPT 2018. Tạo câu hỏi đa dạng loại và độ khó, ngôn ngữ trong sáng, phù hợp lứa tuổi.",
      prompt: `Từ nội dung sau, tạo ${count} câu hỏi đa dạng (trắc nghiệm, đúng/sai, điền khuyết, tự luận ngắn) với 3 mức độ khó.${topic ? `\nChủ đề: ${topic}` : ""}\n\nNội dung:\n${content}`,
      tool: {
        name: "generate_questions",
        description: "Tạo bộ câu hỏi từ tài liệu",
        parameters: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: [
                      "single_choice",
                      "true_false",
                      "fill_blank",
                      "short_answer",
                    ],
                  },
                  question: { type: "string" },
                  options: { type: "array", items: { type: "string" } },
                  answer: { type: "string" },
                  difficulty: {
                    type: "string",
                    enum: ["easy", "medium", "hard"],
                  },
                },
                required: ["type", "question", "answer", "difficulty"],
              },
            },
          },
          required: ["questions"],
        },
      },
    });

    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    if (data?.questions?.length) {
      setQuestions(data.questions);
      toast.success(`Đã tạo ${data.questions.length} câu hỏi! 🎉`);
    }
  }

  return (
    <div className="space-y-5">
      <Card className="p-5 border-2 space-y-4">
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="text-xs uppercase font-bold text-muted-foreground mb-1 block">
              Chủ đề (tùy chọn)
            </label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="VD: Tính chất của nước - Khoa học 4"
            />
          </div>
          <div>
            <label className="text-xs uppercase font-bold text-muted-foreground mb-1 block">
              Số câu
            </label>
            <Input
              type="number"
              min={3}
              max={30}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase font-bold text-muted-foreground mb-1 block">
            Nội dung tài liệu
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Dán nội dung SGK, bài giảng..."
            rows={8}
            className="text-sm"
          />
        </div>
        <Button
          onClick={generate}
          disabled={loading}
          className="btn-pop rounded-full px-6 h-11"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 mr-1 animate-spin" /> AI đang biên
              soạn...
            </>
          ) : (
            <>
              <Sparkles className="size-4 mr-1" /> Tạo câu hỏi
            </>
          )}
        </Button>
      </Card>

      {questions.length > 0 && (
        <div className="space-y-3 animate-pop-in">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">
              {questions.length} câu hỏi đã tạo
            </h2>
            <Button
              variant={saved ? "outline" : "default"}
              onClick={() => {
                setSaved(true);
                toast.success("Đã thêm vào ngân hàng câu hỏi!");
              }}
              className="btn-pop rounded-full"
            >
              {saved ? (
                <>
                  <Check className="size-4 mr-1" /> Đã lưu
                </>
              ) : (
                "💾 Lưu vào ngân hàng"
              )}
            </Button>
          </div>
          {questions.map((q, i) => (
            <Card key={i} className="p-4 border-2">
              <div className="flex items-start gap-3 mb-2">
                <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-info/15 text-info text-xs font-bold">
                      {LABELS[q.type]}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${DIFF_COLOR[q.difficulty]}`}
                    >
                      {q.difficulty === "easy"
                        ? "Dễ"
                        : q.difficulty === "medium"
                          ? "Vừa"
                          : "Khó"}
                    </span>
                  </div>
                  <div className="font-medium">{q.question}</div>
                  {q.options && (
                    <ul className="mt-2 space-y-1 text-sm">
                      {q.options.map((opt, j) => (
                        <li
                          key={j}
                          className={`pl-2 ${opt === q.answer ? "text-success font-bold" : ""}`}
                        >
                          {String.fromCharCode(65 + j)}. {opt}
                          {opt === q.answer && " ✓"}
                        </li>
                      ))}
                    </ul>
                  )}
                  {!q.options && (
                    <div className="mt-2 text-sm">
                      <span className="text-xs uppercase font-bold text-muted-foreground">
                        Đáp án:{" "}
                      </span>
                      <span className="text-success font-bold">{q.answer}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
