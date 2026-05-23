import { createFileRoute } from "@tanstack/react-router";
import { StudentShell } from "@/components/StudentShell";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Star, Flame, Award, Target } from "lucide-react";

export const Route = createFileRoute("/student/achievements")({
  head: () => ({ meta: [{ title: "Thành tích | NXBGDVN" }] }),
  component: Achievements,
});

const BADGES = [
  { name: "Khởi đầu", icon: Star, color: "warning", earned: true },
  { name: "Streak 7 ngày", icon: Flame, color: "destructive", earned: true },
  { name: "Cao thủ Khoa học", icon: Award, color: "info", earned: true },
  { name: "Top 3 lớp", icon: Trophy, color: "warning", earned: true },
  { name: "100 câu đúng", icon: Target, color: "success", earned: true },
  { name: "Vô địch tuần", icon: Medal, color: "fun", earned: false },
  { name: "Streak 30 ngày", icon: Flame, color: "destructive", earned: false },
  { name: "Khám phá AI", icon: Star, color: "fun", earned: false },
];

function Achievements() {
  return (
    <StudentShell>
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Trophy className="text-warning" /> Thành tích
          </h1>
          <p className="text-muted-foreground">Bộ sưu tập huy hiệu của em</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {BADGES.map((b) => (
            <Card
              key={b.name}
              className={`p-5 border-2 text-center ${b.earned ? "border-warning bg-warning/5" : "border-border opacity-40 grayscale"}`}
            >
              <div
                className={`size-16 rounded-full bg-${b.color}/20 mx-auto flex items-center justify-center mb-2`}
              >
                <b.icon className={`size-8 text-${b.color}`} />
              </div>
              <div className="font-bold text-sm">{b.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {b.earned ? "Đã đạt" : "Chưa đạt"}
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-5 border-2 border-fun bg-fun/5">
          <div className="font-display font-bold text-fun text-lg mb-3">
            📊 Bảng xếp hạng quốc gia
          </div>
          <div className="space-y-2">
            {[
              { name: "Nguyễn Hà My", school: "Hà Nội", score: 9850, rank: 1 },
              {
                name: "Trần Minh Khôi",
                school: "TP.HCM",
                score: 9720,
                rank: 2,
              },
              {
                name: "Lê Bảo An (em)",
                school: "TH Lê Quý Đôn",
                score: 9450,
                rank: 247,
                you: true,
              },
            ].map((p) => (
              <div
                key={p.rank}
                className={`flex items-center gap-3 p-3 rounded-xl ${p.you ? "bg-primary/10 border-2 border-primary" : "bg-card border"}`}
              >
                <div className="font-display font-bold text-2xl w-12 text-center">
                  #{p.rank}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.school}
                  </div>
                </div>
                <div className="font-mono font-bold text-warning">
                  {p.score} XP
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </StudentShell>
  );
}
