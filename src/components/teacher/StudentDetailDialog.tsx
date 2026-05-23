import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Eye,
} from "lucide-react";

export interface StudentDetail {
  name: string;
  done: number;
  total: number;
  score: number;
  status: "good" | "ok" | "weak";
}

interface WorksheetRow {
  id: string;
  title: string;
  assignedAt: string;
  dueAt: string;
  status: "done" | "late" | "pending" | "overdue";
  score?: number;
  questions: number;
  correct?: number;
  timeSpent?: string;
}

interface ExamRow {
  id: string;
  title: string;
  date: string;
  duration: string;
  status: "done" | "absent" | "scheduled";
  score?: number;
  rank?: number;
  classAvg?: number;
  questions: number;
  correct?: number;
}

const WORKSHEETS: WorksheetRow[] = [
  {
    id: "w1",
    title: "Phiếu BT Bài 1: Tính chất của nước",
    assignedAt: "10/04",
    dueAt: "12/04",
    status: "done",
    score: 9.0,
    questions: 12,
    correct: 11,
    timeSpent: "18 phút",
  },
  {
    id: "w2",
    title: "Phiếu BT Vòng tuần hoàn của nước",
    assignedAt: "12/04",
    dueAt: "14/04",
    status: "done",
    score: 8.3,
    questions: 8,
    correct: 7,
    timeSpent: "22 phút",
  },
  {
    id: "w3",
    title: "Phiếu ôn tập chương 1",
    assignedAt: "15/04",
    dueAt: "17/04",
    status: "late",
    score: 6.7,
    questions: 30,
    correct: 20,
    timeSpent: "55 phút",
  },
  {
    id: "w4",
    title: "Phiếu BT Bài 3: Không khí",
    assignedAt: "17/04",
    dueAt: "19/04",
    status: "done",
    score: 9.5,
    questions: 10,
    correct: 10,
    timeSpent: "15 phút",
  },
  {
    id: "w5",
    title: "Phiếu BT Bài 4: Âm thanh",
    assignedAt: "19/04",
    dueAt: "21/04",
    status: "pending",
    questions: 12,
  },
  {
    id: "w6",
    title: "Phiếu ôn cuối tuần",
    assignedAt: "08/04",
    dueAt: "10/04",
    status: "overdue",
    questions: 15,
  },
];

const EXAMS: ExamRow[] = [
  {
    id: "e1",
    title: "Đề KT 15 phút - Bài 1",
    date: "11/04/2026",
    duration: "15 phút",
    status: "done",
    score: 9.0,
    rank: 3,
    classAvg: 7.4,
    questions: 10,
    correct: 9,
  },
  {
    id: "e2",
    title: "Đề KT 15 phút - Bài 2",
    date: "18/04/2026",
    duration: "15 phút",
    status: "done",
    score: 8.0,
    rank: 5,
    classAvg: 7.1,
    questions: 10,
    correct: 8,
  },
  {
    id: "e3",
    title: "Đề KT giữa kỳ I - Khoa học 4",
    date: "15/04/2026",
    duration: "60 phút",
    status: "done",
    score: 8.5,
    rank: 4,
    classAvg: 6.9,
    questions: 40,
    correct: 34,
  },
  {
    id: "e4",
    title: "Quiz Kahoot Vòng tuần hoàn",
    date: "13/04/2026",
    duration: "10 phút",
    status: "done",
    score: 9.5,
    rank: 2,
    classAvg: 7.8,
    questions: 15,
    correct: 14,
  },
  {
    id: "e5",
    title: "Đề KT 15 phút - Bài 3",
    date: "22/04/2026",
    duration: "15 phút",
    status: "scheduled",
    questions: 10,
  },
];

function statusBadge(s: WorksheetRow["status"] | ExamRow["status"]) {
  switch (s) {
    case "done":
      return (
        <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20">
          Đã nộp
        </Badge>
      );
    case "late":
      return (
        <Badge className="bg-warning/15 text-warning-foreground border-warning/30 hover:bg-warning/20">
          Nộp muộn
        </Badge>
      );
    case "pending":
      return <Badge variant="outline">Đang làm</Badge>;
    case "overdue":
      return (
        <Badge className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20">
          Quá hạn
        </Badge>
      );
    case "absent":
      return (
        <Badge className="bg-destructive/15 text-destructive border-destructive/30">
          Vắng
        </Badge>
      );
    case "scheduled":
      return <Badge variant="outline">Sắp diễn ra</Badge>;
  }
}

function scoreClass(score?: number) {
  if (score === undefined) return "text-muted-foreground";
  if (score >= 8) return "text-success";
  if (score >= 6.5) return "text-warning-foreground";
  return "text-destructive";
}

export function StudentDetailDialog({
  student,
  open,
  onOpenChange,
}: {
  student: StudentDetail | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  if (!student) return null;

  const wsDone = WORKSHEETS.filter(
    (w) => w.status === "done" || w.status === "late",
  );
  const wsAvg = wsDone.length
    ? wsDone.reduce((a, b) => a + (b.score ?? 0), 0) / wsDone.length
    : 0;
  const exDone = EXAMS.filter((e) => e.status === "done");
  const exAvg = exDone.length
    ? exDone.reduce((a, b) => a + (b.score ?? 0), 0) / exDone.length
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-5 pb-3 border-b-2">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-gradient-to-br from-primary to-fun flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
              {student.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="font-display text-xl">
                {student.name}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-3 mt-0.5">
                <span>Lớp 4A</span>
                <span>•</span>
                <span>
                  Tiến độ: {student.done}/{student.total} bài
                </span>
                <span>•</span>
                <span className={`font-bold ${scoreClass(student.score)}`}>
                  Điểm TB: {student.score.toFixed(1)}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="worksheets" className="flex flex-col">
          <div className="px-5 pt-3">
            <TabsList className="h-10 w-full sm:w-auto">
              <TabsTrigger value="worksheets" className="gap-2 px-4">
                <FileText className="size-4" />
                Phiếu bài tập{" "}
                <Badge variant="secondary" className="ml-1">
                  {WORKSHEETS.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="exams" className="gap-2 px-4">
                <ClipboardCheck className="size-4" />
                Bài thi / Kiểm tra{" "}
                <Badge variant="secondary" className="ml-1">
                  {EXAMS.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="worksheets" className="m-0 px-5 pb-5">
            <div className="grid sm:grid-cols-3 gap-3 my-3">
              <Card className="p-3 border-2">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Đã nộp
                </div>
                <div className="font-display text-xl font-bold">
                  {wsDone.length}/{WORKSHEETS.length}
                </div>
              </Card>
              <Card className="p-3 border-2">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="size-3.5" /> Điểm TB phiếu
                </div>
                <div
                  className={`font-display text-xl font-bold ${scoreClass(wsAvg)}`}
                >
                  {wsAvg.toFixed(1)}
                </div>
              </Card>
              <Card className="p-3 border-2">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="size-3.5" /> Quá hạn / Muộn
                </div>
                <div className="font-display text-xl font-bold text-destructive">
                  {
                    WORKSHEETS.filter(
                      (w) => w.status === "overdue" || w.status === "late",
                    ).length
                  }
                </div>
              </Card>
            </div>

            <ScrollArea className="h-[44vh] rounded-xl border-2">
              <div className="divide-y">
                {WORKSHEETS.map((w) => (
                  <div key={w.id} className="p-3 flex items-center gap-3">
                    <FileText className="size-5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {w.title}
                      </div>
                      <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                        <span>Giao: {w.assignedAt}</span>
                        <span>Hạn: {w.dueAt}</span>
                        {w.timeSpent && (
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {w.timeSpent}
                          </span>
                        )}
                        {w.correct !== undefined && (
                          <span>
                            Đúng: {w.correct}/{w.questions}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">{statusBadge(w.status)}</div>
                    <div
                      className={`shrink-0 w-12 text-right font-bold ${scoreClass(w.score)}`}
                    >
                      {w.score !== undefined ? w.score.toFixed(1) : "—"}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                      disabled={w.score === undefined}
                    >
                      <Eye className="size-3.5 mr-1" /> Xem
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="exams" className="m-0 px-5 pb-5">
            <div className="grid sm:grid-cols-3 gap-3 my-3">
              <Card className="p-3 border-2">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Đã thi
                </div>
                <div className="font-display text-xl font-bold">
                  {exDone.length}/{EXAMS.length}
                </div>
              </Card>
              <Card className="p-3 border-2">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="size-3.5" /> Điểm TB thi
                </div>
                <div
                  className={`font-display text-xl font-bold ${scoreClass(exAvg)}`}
                >
                  {exAvg.toFixed(1)}
                </div>
              </Card>
              <Card className="p-3 border-2">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  🏆 Hạng cao nhất
                </div>
                <div className="font-display text-xl font-bold text-primary">
                  #{Math.min(...exDone.map((e) => e.rank ?? 99))}
                </div>
              </Card>
            </div>

            <ScrollArea className="h-[44vh] rounded-xl border-2">
              <div className="divide-y">
                {EXAMS.map((e) => (
                  <div key={e.id} className="p-3 flex items-center gap-3">
                    <ClipboardCheck className="size-5 text-fun shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {e.title}
                      </div>
                      <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                        <span>{e.date}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {e.duration}
                        </span>
                        {e.correct !== undefined && (
                          <span>
                            Đúng: {e.correct}/{e.questions}
                          </span>
                        )}
                        {e.classAvg !== undefined && (
                          <span>TB lớp: {e.classAvg.toFixed(1)}</span>
                        )}
                        {e.rank !== undefined && (
                          <span className="font-semibold text-primary">
                            Hạng #{e.rank}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">{statusBadge(e.status)}</div>
                    <div
                      className={`shrink-0 w-12 text-right font-bold ${scoreClass(e.score)}`}
                    >
                      {e.score !== undefined ? e.score.toFixed(1) : "—"}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                      disabled={e.score === undefined}
                    >
                      <Eye className="size-3.5 mr-1" /> Xem
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
