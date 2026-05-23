import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { TeacherShell } from "@/components/TeacherShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Plus, Calendar, Users, ClipboardList } from "lucide-react";
import { PAPERS } from "@/lib/mock-papers";
import { AssignWizard } from "@/components/teacher/AssignWizard";

export const Route = createFileRoute("/teacher/assign")({
  head: () => ({ meta: [{ title: "Giao bài tập | Giáo viên - NXBGDVN" }] }),
  component: AssignPage,
});

const ASSIGNED = [
  {
    id: "a1",
    paperId: "p3",
    class: "4A",
    due: "20/04/2026",
    done: 28,
    total: 32,
    status: "active",
  },
  {
    id: "a2",
    paperId: "p5",
    class: "4A",
    due: "22/04/2026",
    done: 22,
    total: 32,
    status: "active",
  },
  {
    id: "a3",
    paperId: "p4",
    class: "4A",
    due: "25/04/2026",
    done: 0,
    total: 32,
    status: "scheduled",
  },
  {
    id: "a4",
    paperId: "p3",
    class: "4B",
    due: "18/04/2026",
    done: 30,
    total: 30,
    status: "done",
  },
];

function AssignPage() {
  const worksheets = PAPERS.filter((p) => p.kind === "worksheet");
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <TeacherShell>
      <AssignWizard open={wizardOpen} onOpenChange={setWizardOpen} />
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">📤 Giao bài tập</h1>
            <p className="text-muted-foreground">
              Giao <strong>phiếu bài tập</strong> đã tạo cho các lớp em phụ
              trách.
            </p>
          </div>
          <Button
            className="btn-pop rounded-full"
            onClick={() => setWizardOpen(true)}
          >
            <Plus className="size-4 mr-1" />
            Giao bài mới
          </Button>
        </div>

        <Card className="p-5 border-2 border-primary bg-primary/5">
          <div className="flex items-start gap-3">
            <Send className="text-primary size-6 mt-1" />
            <div className="flex-1">
              <div className="font-display font-bold">
                Giao nhanh từ phiếu bài tập
              </div>
              <p className="text-sm text-muted-foreground">
                Chọn 1 phiếu (đã tạo từ{" "}
                <Link to="/teacher/exam" className="text-primary underline">
                  Tạo đề/phiếu
                </Link>
                ), lớp và thời hạn — hệ thống tự gửi thông báo cho học sinh.
              </p>
            </div>
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-3">
            {worksheets.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-card border-2 flex items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="text-xs uppercase font-bold text-primary flex items-center gap-1">
                    <ClipboardList className="size-3" /> Phiếu bài tập
                  </div>
                  <div className="font-bold text-sm">{p.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.questionCount} câu · ~{p.durationMin} phút
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setWizardOpen(true)}
                >
                  Giao
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <div>
          <h2 className="font-display text-xl font-bold mb-3">
            📋 Bài đã giao
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {ASSIGNED.map((a) => {
              const paper = PAPERS.find((p) => p.id === a.paperId);
              return (
                <Card key={a.id} className="p-4 border-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-bold">{paper?.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="size-3" /> Lớp {a.class}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" /> Hạn {a.due}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        a.status === "done"
                          ? "bg-success/15 text-success"
                          : a.status === "active"
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {a.status === "done"
                        ? "Hoàn thành"
                        : a.status === "active"
                          ? "Đang chạy"
                          : "Lên lịch"}
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(a.done / a.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>
                      {a.done}/{a.total} HS đã làm
                    </span>
                    <Link
                      to="/teacher/progress"
                      className="text-primary hover:underline"
                    >
                      Xem chi tiết →
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}
