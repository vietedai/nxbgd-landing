import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TeacherShell } from "@/components/TeacherShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StudentDetailDialog,
  type StudentDetail,
} from "@/components/teacher/StudentDetailDialog";

export const Route = createFileRoute("/teacher/progress")({
  head: () => ({ meta: [{ title: "Theo dõi tiến độ | Giáo viên - NXBGDVN" }] }),
  component: ProgressPage,
});

const STUDENTS = [
  { name: "Nguyễn Bảo An", done: 18, total: 20, score: 9.2, status: "good" },
  { name: "Trần Văn Bình", done: 12, total: 20, score: 5.4, status: "weak" },
  { name: "Lê Thị Hoa", done: 8, total: 20, score: 4.8, status: "weak" },
  { name: "Phạm Minh Khôi", done: 15, total: 20, score: 7.6, status: "ok" },
  { name: "Hoàng Thị Mai", done: 20, total: 20, score: 9.8, status: "good" },
  { name: "Đỗ Quang Huy", done: 14, total: 20, score: 6.5, status: "ok" },
  { name: "Vũ Thanh Hằng", done: 10, total: 20, score: 5.0, status: "weak" },
  { name: "Phan Đức Minh", done: 19, total: 20, score: 8.8, status: "good" },
];

function ProgressPage() {
  const [selected, setSelected] = useState<StudentDetail | null>(null);
  const [cls, setCls] = useState("4A");
  const [subject, setSubject] = useState("khoa-hoc");
  return (
    <TeacherShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">
              📈 Theo dõi tiến độ — Lớp {cls}
            </h1>
            <p className="text-muted-foreground">
              Cập nhật real-time từng học sinh
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={cls} onValueChange={setCls}>
              <SelectTrigger className="w-32 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4A">Lớp 4A</SelectItem>
                <SelectItem value="4B">Lớp 4B</SelectItem>
                <SelectItem value="4C">Lớp 4C</SelectItem>
                <SelectItem value="5A">Lớp 5A</SelectItem>
              </SelectContent>
            </Select>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="w-40 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="khoa-hoc">Khoa học</SelectItem>
                <SelectItem value="toan">Toán</SelectItem>
                <SelectItem value="tieng-viet">Tiếng Việt</SelectItem>
                <SelectItem value="lich-su-dia-li">Lịch sử & Địa lí</SelectItem>
                <SelectItem value="tieng-anh">Tiếng Anh</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <Card className="p-4 border-2 border-success bg-success/5">
            <div className="text-xs text-muted-foreground">Học tốt</div>
            <div className="font-display text-2xl font-bold text-success">
              12 HS
            </div>
          </Card>
          <Card className="p-4 border-2 border-warning bg-warning/5">
            <div className="text-xs text-muted-foreground">Trung bình</div>
            <div className="font-display text-2xl font-bold">15 HS</div>
          </Card>
          <Card className="p-4 border-2 border-destructive bg-destructive/5">
            <div className="text-xs text-muted-foreground">Cần hỗ trợ</div>
            <div className="font-display text-2xl font-bold text-destructive">
              5 HS
            </div>
          </Card>
        </div>

        <Card className="p-0 border-2 overflow-hidden">
          <div className="p-4 border-b-2 font-display font-bold">
            Danh sách học sinh
          </div>
          <div className="divide-y">
            {STUDENTS.map((s) => (
              <div key={s.name} className="p-3 flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-to-br from-primary to-fun flex items-center justify-center text-primary-foreground font-bold shrink-0">
                  {s.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{s.name}</div>
                  <div className="h-1.5 rounded-full bg-muted mt-1 overflow-hidden">
                    <div
                      className={`h-full ${s.status === "good" ? "bg-success" : s.status === "ok" ? "bg-warning" : "bg-destructive"}`}
                      style={{ width: `${(s.done / s.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <div className="text-xs text-muted-foreground">
                    {s.done}/{s.total} bài
                  </div>
                  <div
                    className={`font-bold ${s.score >= 8 ? "text-success" : s.score >= 6 ? "text-warning-foreground" : "text-destructive"}`}
                  >
                    {s.score.toFixed(1)}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelected(s as StudentDetail)}
                >
                  Chi tiết
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <StudentDetailDialog
        student={selected}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </TeacherShell>
  );
}
