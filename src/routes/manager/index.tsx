import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "@/components/ManagerShell";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, TrendingUp, Activity } from "lucide-react";

export const Route = createFileRoute("/manager/")({
  head: () => ({ meta: [{ title: "Dashboard | NXBGDVN" }] }),
  component: ManagerDashboard,
});

const RANK = [
  { rank: 1, unit: "Sở GD&ĐT TP. Hồ Chí Minh", score: 8.6, students: 480000 },
  { rank: 2, unit: "Sở GD&ĐT Hà Nội", score: 8.4, students: 324580 },
  { rank: 3, unit: "Sở GD&ĐT Đà Nẵng", score: 8.3, students: 92000 },
  { rank: 4, unit: "Sở GD&ĐT Hải Phòng", score: 8.1, students: 145000 },
  { rank: 5, unit: "Sở GD&ĐT Cần Thơ", score: 8.0, students: 88000 },
  { rank: 6, unit: "Sở GD&ĐT Nghệ An", score: 7.9, students: 218000 },
  { rank: 7, unit: "Sở GD&ĐT Thanh Hoá", score: 7.8, students: 245000 },
  { rank: 8, unit: "Sở GD&ĐT Bình Dương", score: 7.7, students: 132000 },
];

function ManagerDashboard() {
  return (
    <ManagerShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-5">
        <div>
          <h1 className="font-display text-3xl font-bold">
            🏛️ Dashboard điều hành
          </h1>
          <p className="text-muted-foreground">
            Sở GD&ĐT Hà Nội · Năm học 2025-2026
          </p>
        </div>

        <div className="grid sm:grid-cols-4 gap-3">
          {[
            { l: "Trường", v: "847", c: "primary" },
            { l: "Lớp học", v: "12.450", c: "info" },
            { l: "Học sinh", v: "324.580", c: "success" },
            { l: "Giáo viên", v: "18.230", c: "warning" },
          ].map((s) => (
            <Card
              key={s.l}
              className={`p-4 border-2 border-${s.c}/30 bg-${s.c}/5`}
            >
              <div className="text-xs text-muted-foreground">{s.l}</div>
              <div className="font-display text-2xl font-bold">{s.v}</div>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <Card className="p-5 border-2 border-success bg-success/5">
            <div className="flex items-center gap-2 text-success font-display font-bold mb-1">
              <Activity className="size-5" /> Học sinh active tuần
            </div>
            <div className="font-display text-3xl font-bold">286.412</div>
            <div className="text-xs text-muted-foreground mt-1">
              88% tổng số HS · +12% so với tuần trước
            </div>
          </Card>
          <Card className="p-5 border-2 border-info bg-info/5">
            <div className="flex items-center gap-2 text-info font-display font-bold mb-1">
              <TrendingUp className="size-5" /> Điểm TB toàn Sở
            </div>
            <div className="font-display text-3xl font-bold">7.8</div>
            <div className="text-xs text-muted-foreground mt-1">
              Hạng 2/63 toàn quốc · ↑ 0.3 so với HK trước
            </div>
          </Card>
          <Card className="p-5 border-2 border-fun bg-fun/5">
            <div className="flex items-center gap-2 text-fun font-display font-bold mb-1">
              <Trophy className="size-5" /> Tỉ lệ HSG
            </div>
            <div className="font-display text-3xl font-bold">32%</div>
            <div className="text-xs text-muted-foreground mt-1">
              103.866 học sinh · +4 điểm % YoY
            </div>
          </Card>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold mb-3">
            🏆 Bảng xếp hạng quốc gia
          </h2>
          <div className="grid sm:grid-cols-3 gap-3 mb-3">
            {RANK.slice(0, 3).map((r, i) => (
              <Card
                key={r.rank}
                className={`p-5 border-2 text-center ${
                  i === 0
                    ? "border-warning bg-warning/10"
                    : i === 1
                      ? "border-muted-foreground/30 bg-muted"
                      : "border-info/30 bg-info/5"
                }`}
              >
                <div className="text-4xl mb-2">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                </div>
                <div className="font-bold text-sm">{r.unit}</div>
                <div className="font-display text-2xl font-bold mt-1">
                  {r.score}
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-0 border-2 overflow-hidden">
            <div className="p-4 font-display font-bold border-b-2 flex items-center gap-2">
              <Trophy className="text-warning" /> Bảng xếp hạng đầy đủ — 63 Sở
              GD&ĐT
            </div>
            {RANK.map((r) => (
              <div
                key={r.rank}
                className={`p-3 border-t flex items-center gap-3 ${r.unit.includes("Hà Nội") ? "bg-primary/10" : ""}`}
              >
                <div
                  className={`size-9 rounded-full font-bold flex items-center justify-center shrink-0 ${
                    r.rank <= 3
                      ? "bg-warning text-warning-foreground"
                      : "bg-muted"
                  }`}
                >
                  {r.rank <= 3 ? <Medal className="size-4" /> : r.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{r.unit}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.students.toLocaleString()} học sinh
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold text-lg">
                    {r.score.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </ManagerShell>
  );
}
