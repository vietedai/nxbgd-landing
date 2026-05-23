import { createFileRoute, Link } from "@tanstack/react-router";
import { StudentShell } from "@/components/StudentShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LESSONS } from "@/lib/mock-data";
import {
  Sparkles,
  Clock,
  ArrowRight,
  Flame,
  Trophy,
  BookOpen,
  Dumbbell,
  Swords,
} from "lucide-react";
import mascot from "@/assets/mascot-bee.png";

export const Route = createFileRoute("/student/")({
  head: () => ({ meta: [{ title: "Trang chủ — Học sinh | NXBGDVN" }] }),
  component: StudentHome,
});

function StudentHome() {
  return (
    <StudentShell>
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* Hero greeting */}
        <Card className="p-6 md:p-8 border-2 bg-gradient-to-br from-primary/15 via-warning/10 to-fun/10 relative overflow-hidden">
          <div className="flex items-center gap-6">
            <img
              src={mascot}
              alt=""
              className="size-24 md:size-32 animate-float shrink-0"
            />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">
                Xin chào buổi sáng,
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                Bảo An ơi! 👋
              </h1>
              <p className="mt-1 text-muted-foreground">
                Hôm nay em có{" "}
                <strong className="text-primary">3 bài tập</strong> mới và{" "}
                <strong className="text-fun">1 trận đấu</strong> chờ đợi!
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link to="/student/assignments">
                  <Button className="btn-pop rounded-full">
                    Bắt đầu làm bài →
                  </Button>
                </Link>
                <Link to="/student/battle">
                  <Button variant="outline" className="rounded-full">
                    Vào trận đấu
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Streak + progress */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="p-5 border-2 border-warning bg-warning/5">
            <div className="flex items-center gap-2">
              <Flame className="text-warning" />
              <span className="font-bold">Chuỗi học</span>
            </div>
            <div className="font-display text-3xl font-bold mt-1">12 ngày</div>
            <div className="text-xs text-muted-foreground">
              Tiếp tục để mở huy hiệu!
            </div>
          </Card>
          <Card className="p-5 border-2 border-fun bg-fun/5">
            <div className="flex items-center gap-2">
              <Sparkles className="text-fun" />
              <span className="font-bold">XP tuần này</span>
            </div>
            <div className="font-display text-3xl font-bold mt-1">1.250</div>
            <div className="text-xs text-muted-foreground">Cách Bạc 250 XP</div>
          </Card>
          <Card className="p-5 border-2 border-success bg-success/5">
            <div className="flex items-center gap-2">
              <Trophy className="text-success" />
              <span className="font-bold">Hạng lớp</span>
            </div>
            <div className="font-display text-3xl font-bold mt-1">#3 / 32</div>
            <div className="text-xs text-muted-foreground">Top 10% lớp 4A</div>
          </Card>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="font-display text-xl font-bold mb-3">Lối tắt</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <QuickAction
              to="/student/assignments"
              icon={BookOpen}
              label="Bài tập được giao"
              desc="3 bài chờ"
              color="bg-primary/15 text-primary"
            />
            <QuickAction
              to="/student/practice"
              icon={Dumbbell}
              label="Luyện tập tự do"
              desc="Chọn môn / chế độ"
              color="bg-info/15 text-info"
            />
            <QuickAction
              to="/student/battle"
              icon={Swords}
              label="Thi đấu"
              desc="Phòng đang mở"
              color="bg-fun/15 text-fun"
            />
          </div>
        </div>

        {/* Continue learning */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-xl font-bold">📚 Tiếp tục học</h2>
            <Link
              to="/student/assignments"
              className="text-sm text-primary hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {LESSONS.slice(0, 4).map((l) => (
              <Link
                key={l.id}
                to="/student/lesson/$lessonId"
                params={{ lessonId: l.id }}
              >
                <Card className="p-4 border-2 hover:border-primary transition-all hover:-translate-y-0.5 cursor-pointer">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <div className="text-xs uppercase font-bold text-primary">
                        {l.topic}
                      </div>
                      <div className="font-display font-bold mt-0.5">
                        {l.title}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" /> ~{l.questions.length * 2}{" "}
                          phút
                        </span>
                        <span>· {l.questions.length} câu</span>
                      </div>
                    </div>
                    <ArrowRight className="text-muted-foreground shrink-0" />
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-success"
                      style={{ width: `${Math.random() * 60 + 20}%` }}
                    />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* AI suggestion */}
        <Card className="p-5 border-2 border-fun bg-gradient-to-br from-fun/10 to-primary/5">
          <div className="flex gap-4">
            <Sparkles className="text-fun size-8 shrink-0 mt-1" />
            <div>
              <div className="font-display font-bold text-fun text-lg">
                Gợi ý từ AI
              </div>
              <p className="text-sm mt-1">
                Em làm <strong>Bài 2: Vòng tuần hoàn của nước</strong> còn yếu
                phần "ngưng tụ". Ong Chăm Chỉ gợi ý em xem flashcard và làm thêm
                5 câu luyện tập để thuộc bài hơn nhé!
              </p>
              <Link
                to="/student/lesson/$lessonId"
                params={{ lessonId: "bai-2" }}
              >
                <Button size="sm" className="btn-pop mt-3 rounded-full">
                  Bắt đầu ngay
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </StudentShell>
  );
}

function QuickAction({
  to,
  icon: Icon,
  label,
  desc,
  color,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  desc: string;
  color: string;
}) {
  return (
    <Link to={to}>
      <Card className="p-4 border-2 hover:border-primary cursor-pointer transition-all hover:-translate-y-0.5">
        <div
          className={`size-10 rounded-xl ${color} flex items-center justify-center mb-2`}
        >
          <Icon className="size-5" />
        </div>
        <div className="font-bold">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </Card>
    </Link>
  );
}
