import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { StudentShell } from "@/components/StudentShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LESSONS, getQuestion } from "@/lib/mock-data";
import {
  QuestionRenderer,
  TYPE_LABELS,
} from "@/components/interactions/QuestionRenderer";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Trophy,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import mascot from "@/assets/mascot-bee.png";

export const Route = createFileRoute("/student/lesson/$lessonId")({
  head: ({ params }) => {
    const lesson = LESSONS.find((l) => l.id === params.lessonId);
    return { meta: [{ title: `${lesson?.title ?? "Bài học"} | NXBGDVN` }] };
  },
  component: LessonPlayer,
  notFoundComponent: () => <div className="p-8">Không tìm thấy bài học</div>,
});

function LessonPlayer() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<
    { correct: boolean; points: number }[]
  >([]);
  const [currentResult, setCurrentResult] = useState<{
    correct: boolean;
    points: number;
  } | null>(null);

  if (!lesson) return <div className="p-8">Không tìm thấy bài học</div>;

  const finished = idx >= lesson.questions.length;
  const q = lesson.questions[idx];
  const totalPoints = results.reduce((s, r) => s + r.points, 0);
  const correctCount = results.filter((r) => r.correct).length;

  // Lấy giải thích chi tiết của câu hỏi (nếu có)
  const explanation =
    q && "detailedExplanation" in q && typeof q.detailedExplanation === "string"
      ? q.detailedExplanation
      : q?.explanation;
  const hint = q?.hint;
  const whyCorrect = q?.whyCorrect;
  const whyWrong = q?.whyWrong;

  const onAnswer = (r: { correct: boolean }) => {
    if (currentResult) return; // already answered, ignore further clicks
    const points = r.correct ? (q?.points ?? 10) : 0;
    const result = { correct: r.correct, points };
    setCurrentResult(result);
    setResults([...results, result]);
  };

  const goNext = () => {
    setCurrentResult(null);
    setIdx(idx + 1);
  };

  const jumpTo = (i: number) => {
    setCurrentResult(null);
    setIdx(i);
  };

  return (
    <StudentShell>
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <Link
          to="/student/assignments"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="size-4 mr-1" /> Quay lại
        </Link>

        {!finished ? (
          <>
            <div className="mb-4">
              <div className="text-xs uppercase font-bold text-primary">
                {lesson.topic}
              </div>
              <h1 className="font-display text-2xl font-bold">
                {lesson.title}
              </h1>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <Progress
                value={(idx / lesson.questions.length) * 100}
                className="h-3"
              />
              <div className="text-sm font-bold whitespace-nowrap">
                {idx + 1} / {lesson.questions.length}
              </div>
            </div>

            <Card className="p-5 md:p-7 border-2 animate-pop-in">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-xs px-2 py-1 rounded-full bg-fun/15 text-fun font-bold">
                  {TYPE_LABELS[q.type]}
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-warning/15 text-warning-foreground font-bold">
                  +{q.points} điểm
                </div>
                {q.difficulty && (
                  <div className="text-xs px-2 py-1 rounded-full bg-secondary font-bold">
                    {q.difficulty === "easy"
                      ? "🟢 Dễ"
                      : q.difficulty === "medium"
                        ? "🟡 Vừa"
                        : "🔴 Khó"}
                  </div>
                )}
              </div>
              <QuestionRenderer key={q.id} question={q} onAnswer={onAnswer} />
            </Card>

            {currentResult && (
              <Card
                className={`mt-4 p-4 md:p-5 border-2 animate-pop-in ${
                  currentResult.correct
                    ? "border-success bg-success/10"
                    : "border-destructive bg-destructive/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`size-12 rounded-full flex items-center justify-center shrink-0 ${
                      currentResult.correct
                        ? "bg-success text-success-foreground"
                        : "bg-destructive text-destructive-foreground"
                    }`}
                  >
                    {currentResult.correct ? (
                      <Check className="size-6" />
                    ) : (
                      <X className="size-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-lg">
                      {currentResult.correct
                        ? `Chính xác! +${currentResult.points} điểm 🎉`
                        : "Chưa đúng — đừng nản nhé!"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {currentResult.correct
                        ? "Cùng đọc giải thích để nhớ lâu hơn nhé."
                        : "Xem lại giải thích bên dưới để hiểu vì sao."}
                    </div>
                  </div>
                  <Button
                    onClick={goNext}
                    className="btn-pop rounded-full px-6 h-11 shrink-0"
                  >
                    {idx + 1 < lesson.questions.length ? (
                      <>
                        Câu tiếp theo <ArrowRight className="size-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Hoàn thành <Trophy className="size-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Giải thích chi tiết */}
                {/* Vì sao đúng — chỉ hiển thị khi trả lời đúng */}
                {currentResult.correct && whyCorrect && (
                  <div className="mt-3 p-3 rounded-xl bg-success/10 border border-success/40 flex items-start gap-2">
                    <Check className="size-4 text-success shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <span className="font-bold text-success">
                        Vì sao đúng:{" "}
                      </span>
                      <span className="text-foreground/90">{whyCorrect}</span>
                    </div>
                  </div>
                )}

                {/* Vì sao sai — chỉ hiển thị khi trả lời sai */}
                {!currentResult.correct && whyWrong && (
                  <div className="mt-3 p-3 rounded-xl bg-destructive/10 border border-destructive/40 flex items-start gap-2">
                    <X className="size-4 text-destructive shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <span className="font-bold text-destructive">
                        Vì sao sai:{" "}
                      </span>
                      <span className="text-foreground/90">{whyWrong}</span>
                    </div>
                  </div>
                )}

                {/* Giải thích chung của câu hỏi (kiến thức nền) */}
                {explanation && (
                  <div className="mt-3 p-3 rounded-xl bg-card border border-border/60 flex items-start gap-2">
                    <BookOpen className="size-4 text-info shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <span className="font-bold text-info">
                        Kiến thức cần nhớ:{" "}
                      </span>
                      <span className="text-foreground/90">{explanation}</span>
                    </div>
                  </div>
                )}

                {/* Gợi ý chỉ hiện khi sai */}
                {!currentResult.correct && hint && (
                  <div className="mt-2 p-3 rounded-xl bg-warning/10 border border-warning/40 flex items-start gap-2">
                    <Lightbulb className="size-4 text-warning shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <span className="font-bold text-warning-foreground">
                        Gợi ý:{" "}
                      </span>
                      <span className="text-foreground/90">{hint}</span>
                    </div>
                  </div>
                )}

                {/* Khích lệ khi sai mà không có giải thích/hint nào */}
                {!currentResult.correct &&
                  !explanation &&
                  !hint &&
                  !whyWrong && (
                    <div className="mt-2 text-sm text-muted-foreground italic">
                      💪 Hãy thử lại ở câu sau — em đang tiến bộ từng ngày!
                    </div>
                  )}
              </Card>
            )}

            {/* Question type navigator (demo all types easily) */}
            <div className="mt-6">
              <div className="text-xs text-muted-foreground mb-2">
                ⚡ Nhảy nhanh tới câu khác (demo):
              </div>
              <div className="flex flex-wrap gap-1">
                {lesson.questions.map((qq, i) => (
                  <button
                    key={qq.id}
                    onClick={() => jumpTo(i)}
                    className={`size-8 rounded-lg text-xs font-bold border ${i === idx ? "bg-primary text-primary-foreground border-primary" : results[i] ? (results[i].correct ? "bg-success/20 border-success" : "bg-destructive/20 border-destructive") : "bg-card border-border"}`}
                    title={TYPE_LABELS[qq.type]}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <Card className="p-8 text-center border-2 border-primary bg-gradient-to-br from-primary/10 to-fun/10 animate-pop-in">
            <img
              src={mascot}
              alt=""
              className="size-32 mx-auto animate-float"
            />
            <Trophy className="text-warning mx-auto size-12 mt-2" />
            <h1 className="font-display text-3xl font-bold mt-2">Tuyệt vời!</h1>
            <p className="text-muted-foreground">
              Em đã hoàn thành {lesson.title}
            </p>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <Card className="p-4 bg-success/10 border-success">
                <div className="text-xs">Đúng</div>
                <div className="font-display text-2xl font-bold">
                  {correctCount}/{lesson.questions.length}
                </div>
              </Card>
              <Card className="p-4 bg-fun/10 border-fun">
                <div className="text-xs">Điểm</div>
                <div className="font-display text-2xl font-bold">
                  {totalPoints}
                </div>
              </Card>
              <Card className="p-4 bg-warning/10 border-warning">
                <div className="text-xs">Tốc độ</div>
                <div className="font-display text-2xl font-bold">A+</div>
              </Card>
            </div>

            <Card className="mt-5 p-4 border-2 border-info bg-info/5 text-left">
              <div className="font-display font-bold text-info flex items-center gap-2 mb-1">
                <Sparkles /> AI Feedback
              </div>
              <p className="text-sm">
                Em làm tốt phần lý thuyết. Cần luyện thêm phần ứng dụng thực tế.
                AI gợi ý em làm tiếp <strong>Bài luyện tập tự do</strong> để
                củng cố kiến thức nhé!
              </p>
            </Card>

            <div className="mt-5 flex justify-center gap-2">
              <Button
                onClick={() => {
                  setIdx(0);
                  setResults([]);
                  setCurrentResult(null);
                }}
                variant="outline"
                className="rounded-full"
              >
                Làm lại
              </Button>
              <Button
                onClick={() => navigate({ to: "/student/assignments" })}
                className="btn-pop rounded-full"
              >
                Về danh sách bài
              </Button>
            </div>
          </Card>
        )}
      </div>
    </StudentShell>
  );
}
// Avoid unused import warning
void getQuestion;
