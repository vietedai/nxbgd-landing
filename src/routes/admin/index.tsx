import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TYPE_LABELS } from "@/components/interactions/QuestionRenderer";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin | NXBGDVN" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-5">
        <div>
          <h1 className="font-display text-3xl font-bold">⚙️ Admin Console</h1>
          <p className="text-muted-foreground">
            Quản lý 72.000+ câu hỏi và toàn hệ thống
          </p>
        </div>

        <div className="grid sm:grid-cols-4 gap-3">
          {[
            { l: "Tổng câu hỏi", v: "72.348", c: "primary" },
            { l: "Active users", v: "1.2M", c: "success" },
            { l: "AI calls/ngày", v: "458K", c: "fun" },
            { l: "Uptime", v: "99.97%", c: "info" },
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

        <Card className="p-5 border-2">
          <div className="flex justify-between mb-3">
            <div className="font-display font-bold">
              🎮 Quản lí Interaction Engine (23 kiểu)
            </div>
            <Button size="sm" className="btn-pop rounded-full">
              <Plus className="size-4 mr-1" />
              Thêm kiểu mới
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between p-2 rounded-lg border bg-card"
              >
                <span>{v}</span>
                <span className="text-xs text-success font-bold">● Active</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5 border-2 border-fun bg-fun/5">
            <div className="font-display font-bold text-fun mb-3">
              🧠 AI Config
            </div>
            <div className="space-y-2 text-sm">
              {[
                { l: "Gợi ý bài học", v: "Bật" },
                { l: "AI chấm tự luận", v: "Bật" },
                { l: "Adaptive difficulty", v: "Bật" },
                { l: "Sinh câu hỏi tự động", v: "Beta" },
                { l: "Nhắc học qua app", v: "Bật" },
              ].map((r) => (
                <div
                  key={r.l}
                  className="flex justify-between p-2 rounded-lg bg-card border"
                >
                  <span>{r.l}</span>
                  <span className="font-bold text-fun">{r.v}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5 border-2">
            <div className="font-display font-bold mb-3">
              📥 Hoạt động gần đây
            </div>
            <div className="space-y-2 text-sm">
              <Log
                time="10 phút trước"
                act="Giáo viên Nguyễn Lan thêm 12 câu hỏi mới"
              />
              <Log
                time="35 phút trước"
                act="AI sinh tự động 240 câu cho lớp 4"
              />
              <Log time="2 giờ trước" act="Cập nhật hệ thống lên v2.4.1" />
              <Log time="hôm qua" act="Backup database thành công" />
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

function Log({ time, act }: { time: string; act: string }) {
  return (
    <div className="flex gap-2 p-2 rounded-lg bg-card border text-xs">
      <span className="text-muted-foreground whitespace-nowrap">{time}</span>
      <span className="flex-1">{act}</span>
    </div>
  );
}
