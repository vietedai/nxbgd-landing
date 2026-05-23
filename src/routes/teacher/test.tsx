import { createFileRoute } from "@tanstack/react-router";
import { TeacherShell } from "@/components/TeacherShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Users, Clock } from "lucide-react";
import { PAPERS, TEST_SCHEDULES } from "@/lib/mock-papers";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CreateTestWizard } from "@/components/teacher/CreateTestWizard";

export const Route = createFileRoute("/teacher/test")({
  head: () => ({ meta: [{ title: "Thi/Kiểm tra | Giáo viên - NXBGDVN" }] }),
  component: TestPage,
});

const STATUS_LABEL = {
  scheduled: { label: "Lên lịch", color: "bg-info/15 text-info" },
  ongoing: {
    label: "Đang thi",
    color: "bg-warning/15 text-warning-foreground animate-pulse",
  },
  done: { label: "Đã xong", color: "bg-success/15 text-success" },
} as const;

function TestPage() {
  const [open, setOpen] = useState(false);

  return (
    <TeacherShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">
              📋 Thi / Kiểm tra
            </h1>
            <p className="text-muted-foreground">
              Lên lịch và quản lí các kì thi, lấy đề từ{" "}
              <strong>Tạo đề/phiếu</strong>.
            </p>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="btn-pop rounded-full"
          >
            <Plus className="size-4 mr-1" /> Tạo cuộc thi/kiểm tra
          </Button>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold mb-3">
            📅 Lịch thi đã tạo ({TEST_SCHEDULES.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {TEST_SCHEDULES.map((s) => {
              const paper = PAPERS.find((p) => p.id === s.paperId);
              const status = STATUS_LABEL[s.status];
              return (
                <Card key={s.id} className="p-4 border-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <div className="font-bold">{paper?.title}</div>
                      <div className="text-xs text-muted-foreground flex flex-wrap gap-3 mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="size-3" /> Lớp {s.className}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" /> {s.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" /> {paper?.durationMin}p
                        </span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap",
                        status.color,
                      )}
                    >
                      {status.label}
                    </span>
                  </div>
                  {s.submitted !== undefined && (
                    <>
                      <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(s.submitted / (s.total ?? 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>
                          {s.submitted}/{s.total} HS đã nộp
                        </span>
                        <button className="text-primary hover:underline">
                          Xem kết quả →
                        </button>
                      </div>
                    </>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <CreateTestWizard open={open} onOpenChange={setOpen} />
    </TeacherShell>
  );
}
