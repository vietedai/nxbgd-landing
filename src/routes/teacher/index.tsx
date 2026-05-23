import { createFileRoute } from "@tanstack/react-router";
import { TeacherShell } from "@/components/TeacherShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, CheckCircle, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/teacher/")({
  head: () => ({ meta: [{ title: "Dashboard lớp | Giáo viên - NXBGDVN" }] }),
  component: TeacherDashboard,
});

function TeacherDashboard() {
  return (
    <TeacherShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-5">
        <div>
          <h1 className="font-display text-3xl font-bold">
            📊 Dashboard lớp 4A
          </h1>
          <p className="text-muted-foreground">
            Tổng quan tình hình học tập của 32 học sinh
          </p>
        </div>

        <div className="grid sm:grid-cols-4 gap-3">
          <Stat icon={Users} label="Học sinh" value="32" color="primary" />
          <Stat icon={BookOpen} label="Bài đang giao" value="5" color="info" />
          <Stat
            icon={CheckCircle}
            label="Hoàn thành TB"
            value="78%"
            color="success"
          />
          <Stat
            icon={AlertCircle}
            label="HS yếu cần hỗ trợ"
            value="4"
            color="destructive"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5 border-2">
            <div className="font-display font-bold mb-3">
              📈 Tiến độ bài tập gần nhất
            </div>
            <div className="space-y-3">
              {[
                { name: "Bài 1: Tính chất của nước", done: 28, total: 32 },
                { name: "Bài 2: Vòng tuần hoàn của nước", done: 22, total: 32 },
                { name: "Bài 4: Không khí có ở đâu?", done: 15, total: 32 },
              ].map((b) => (
                <div key={b.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold">{b.name}</span>
                    <span>
                      {b.done}/{b.total}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(b.done / b.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 border-2 border-warning bg-warning/5">
            <div className="font-display font-bold text-warning-foreground mb-3 flex items-center gap-2">
              <AlertCircle className="text-warning" /> Học sinh cần hỗ trợ
            </div>
            <div className="space-y-2">
              {[
                "Trần Văn Bình - Yếu phần ngưng tụ",
                "Lê Thị Hoa - Chưa làm bài 3",
                "Nguyễn Khôi - Sai 70% bài 4",
                "Phạm Mai - Vắng 5 ngày",
              ].map((n) => (
                <div
                  key={n}
                  className="flex justify-between items-center p-2 rounded-lg bg-card border"
                >
                  <span className="text-sm">{n}</span>
                  <Button size="sm" variant="outline">
                    Liên hệ
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-5 border-2 border-fun bg-fun/5">
          <div className="font-display font-bold text-fun mb-2">
            🤖 Gợi ý từ AI
          </div>
          <p className="text-sm">
            Có 12 học sinh còn yếu chủ đề "Vòng tuần hoàn của nước". Cô có muốn
            AI tạo
            <strong> bộ câu hỏi luyện tập riêng</strong> cho nhóm này không?
          </p>
          <Button className="btn-pop mt-3 rounded-full" size="sm">
            Tạo bộ câu hỏi
          </Button>
        </Card>
      </div>
    </TeacherShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card className={`p-4 border-2 border-${color}/30 bg-${color}/5`}>
      <Icon className={`text-${color} size-5 mb-1`} />
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-display text-2xl font-bold">{value}</div>
    </Card>
  );
}
