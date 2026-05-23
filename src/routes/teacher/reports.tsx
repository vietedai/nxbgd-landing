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
import { Download, FileBarChart } from "lucide-react";
import { ParentReportDialog } from "@/components/teacher/ParentReportDialog";

export const Route = createFileRoute("/teacher/reports")({
  head: () => ({ meta: [{ title: "Báo cáo | Giáo viên - NXBGDVN" }] }),
  component: ReportsPage,
});

const TOPICS = [
  { topic: "Tính chất của nước", avg: 8.5, mastery: 86 },
  { topic: "Vòng tuần hoàn của nước", avg: 6.8, mastery: 64 },
  { topic: "Không khí", avg: 7.4, mastery: 72 },
  { topic: "Sự sống của thực vật", avg: 8.1, mastery: 80 },
  { topic: "Dinh dưỡng", avg: 5.9, mastery: 55 },
];

const SUBJECT_LABEL: Record<string, string> = {
  "khoa-hoc": "Khoa học",
  toan: "Toán",
  "tieng-viet": "Tiếng Việt",
  "lich-su-dia-li": "Lịch sử & Địa lí",
  "tieng-anh": "Tiếng Anh",
};

function ReportsPage() {
  const [cls, setCls] = useState("4A");
  const [subject, setSubject] = useState("khoa-hoc");
  const [parentOpen, setParentOpen] = useState(false);

  return (
    <TeacherShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">
              📊 Báo cáo lớp {cls}
            </h1>
            <p className="text-muted-foreground">
              Môn {SUBJECT_LABEL[subject]} · Tổng hợp kết quả học tập học kỳ I
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
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
                {Object.entries(SUBJECT_LABEL).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-full">
              <Download className="size-4 mr-1" />
              Xuất PDF
            </Button>
            <Button
              className="btn-pop rounded-full"
              onClick={() => setParentOpen(true)}
            >
              <FileBarChart className="size-4 mr-1" />
              Báo cáo phụ huynh
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-3">
          {[
            { l: "Điểm TB lớp", v: "7.4", c: "primary" },
            { l: "Tỉ lệ hoàn thành", v: "78%", c: "success" },
            { l: "Câu hỏi đã làm", v: "12.450", c: "info" },
            { l: "Thời gian học TB", v: "42 phút/tuần", c: "fun" },
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
          <div className="font-display font-bold mb-3">
            🎯 Mức độ thành thạo theo chủ đề
          </div>
          <div className="space-y-3">
            {TOPICS.map((t) => (
              <div key={t.topic}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold">{t.topic}</span>
                  <span>
                    Điểm TB {t.avg.toFixed(1)} · Mức thành thạo {t.mastery}%
                  </span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full ${t.mastery >= 75 ? "bg-success" : t.mastery >= 60 ? "bg-warning" : "bg-destructive"}`}
                    style={{ width: `${t.mastery}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 border-2 border-fun bg-fun/5">
          <div className="font-display font-bold text-fun mb-2">
            🤖 Phân tích từ AI
          </div>
          <ul className="text-sm space-y-1 list-disc pl-5">
            <li>
              Lớp em mạnh nhất chủ đề <b>Tính chất của nước</b> (mastery 86%).
            </li>
            <li>
              Cần củng cố chủ đề <b>Dinh dưỡng</b> — chỉ 55% học sinh thành
              thạo.
            </li>
            <li>
              Khuyến nghị: làm thêm 2-3 buổi luyện tập nhóm và 1 quiz Kahoot
              tổng kết.
            </li>
          </ul>
        </Card>
      </div>
      <ParentReportDialog
        open={parentOpen}
        onOpenChange={setParentOpen}
        className={cls}
        subjectName={SUBJECT_LABEL[subject]}
      />
    </TeacherShell>
  );
}
