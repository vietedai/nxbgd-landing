import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ManagerShell } from "@/components/ManagerShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, School, Users, GraduationCap, Activity } from "lucide-react";

export const Route = createFileRoute("/manager/report-truong")({
  head: () => ({ meta: [{ title: "Báo cáo cấp Trường | NXBGDVN" }] }),
  component: ReportTruongPage,
});

const SCHOOLS = [
  "TH Đoàn Thị Điểm",
  "TH Nguyễn Siêu",
  "TH Lê Quý Đôn",
  "TH Kim Đồng",
];

const GRADES = [
  { g: "Khối 1", classes: 8, students: 240, score: 8.8, completion: 92 },
  { g: "Khối 2", classes: 8, students: 248, score: 8.6, completion: 90 },
  { g: "Khối 3", classes: 9, students: 268, score: 8.4, completion: 88 },
  { g: "Khối 4", classes: 9, students: 272, score: 8.2, completion: 85 },
  { g: "Khối 5", classes: 8, students: 252, score: 8.5, completion: 89 },
];

const SUBJECTS = [
  { s: "Toán", avg: 8.4, hsg: 38 },
  { s: "Tiếng Việt", avg: 8.5, hsg: 41 },
  { s: "Khoa học", avg: 8.1, hsg: 34 },
  { s: "Lịch sử & Địa lí", avg: 7.9, hsg: 31 },
  { s: "Tiếng Anh", avg: 7.6, hsg: 28 },
];

function ReportTruongPage() {
  const [school, setSchool] = useState("TH Đoàn Thị Điểm");
  return (
    <ManagerShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-5">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-2">
              <School className="size-8 text-primary" /> Báo cáo cấp Trường
            </h1>
            <p className="text-muted-foreground">
              {school} · Phường Cầu Giấy · HK I 2025-2026
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={school} onValueChange={setSchool}>
              <SelectTrigger className="w-56 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCHOOLS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-full">
              <Download className="size-4 mr-1" />
              Xuất PDF
            </Button>
            <Button className="btn-pop rounded-full">
              <Download className="size-4 mr-1" />
              Trình Hiệu trưởng
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-3">
          {[
            {
              l: "Khối / Lớp",
              v: "5 / 42",
              i: <School className="size-4" />,
              c: "primary",
            },
            {
              l: "Học sinh",
              v: "1.280",
              i: <Users className="size-4" />,
              c: "info",
            },
            {
              l: "Giáo viên",
              v: "78",
              i: <GraduationCap className="size-4" />,
              c: "success",
            },
            {
              l: "Active hôm nay",
              v: "1.184",
              i: <Activity className="size-4" />,
              c: "fun",
            },
          ].map((s) => (
            <Card
              key={s.l}
              className={`p-4 border-2 border-${s.c}/30 bg-${s.c}/5`}
            >
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                {s.i}
                {s.l}
              </div>
              <div className="font-display text-2xl font-bold">{s.v}</div>
            </Card>
          ))}
        </div>

        <Card className="p-5 border-2">
          <div className="font-display font-bold mb-3">
            📚 Kết quả theo khối lớp
          </div>
          <div className="grid grid-cols-12 gap-2 p-2 border-b text-xs font-bold uppercase text-muted-foreground">
            <div className="col-span-3">Khối</div>
            <div className="col-span-2 text-right">Lớp</div>
            <div className="col-span-2 text-right">HS</div>
            <div className="col-span-3">Hoàn thành CT</div>
            <div className="col-span-2 text-right">Điểm TB</div>
          </div>
          {GRADES.map((g) => (
            <div
              key={g.g}
              className="grid grid-cols-12 gap-2 p-2 border-t items-center text-sm"
            >
              <div className="col-span-3 font-bold">{g.g}</div>
              <div className="col-span-2 text-right">{g.classes}</div>
              <div className="col-span-2 text-right">{g.students}</div>
              <div className="col-span-3">
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-success"
                    style={{ width: `${g.completion}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {g.completion}%
                </div>
              </div>
              <div className="col-span-2 text-right font-display font-bold">
                {g.score}
              </div>
            </div>
          ))}
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5 border-2">
            <div className="font-display font-bold mb-3">
              📖 Chất lượng theo môn
            </div>
            <div className="space-y-2 text-sm">
              {SUBJECTS.map((s) => (
                <div key={s.s} className="flex items-center gap-2">
                  <div className="w-32 font-bold">{s.s}</div>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(s.avg / 10) * 100}%` }}
                    />
                  </div>
                  <div className="w-28 text-right text-xs">
                    TB <b>{s.avg}</b> · HSG {s.hsg}%
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 border-2 border-info bg-info/5">
            <div className="font-display font-bold text-info mb-2">
              👩‍🏫 Đội ngũ giáo viên
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Đạt chuẩn nghề nghiệp</span>
                <b>76 / 78 (97%)</b>
              </div>
              <div className="flex justify-between">
                <span>Trên chuẩn (Thạc sĩ+)</span>
                <b>22 (28%)</b>
              </div>
              <div className="flex justify-between">
                <span>Đã hoàn thành tập huấn AI</span>
                <b>54 (69%)</b>
              </div>
              <div className="flex justify-between">
                <span>Sử dụng SBT số ≥ 80%</span>
                <b>71 (91%)</b>
              </div>
              <div className="flex justify-between">
                <span>Đánh giá HS xuất sắc/giỏi</span>
                <b>18 (23%)</b>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5 border-2 border-warning bg-warning/5">
            <div className="font-display font-bold text-warning-foreground mb-2">
              ⚠️ Học sinh cần quan tâm
            </div>
            <div className="text-sm space-y-1">
              <div>
                • <b>32 HS</b> nguy cơ chưa đạt chuẩn HK I (3 môn trở xuống TB
                &lt; 5).
              </div>
              <div>
                • <b>8 HS</b> nghỉ học &gt; 5 buổi không phép.
              </div>
              <div>
                • <b>12 HS</b> diện hoà nhập (khuyết tật / chậm phát triển).
              </div>
              <div>
                • <b>5 HS</b> chuyển trường trong kỳ.
              </div>
            </div>
          </Card>
          <Card className="p-5 border-2 border-fun bg-fun/5">
            <div className="font-display font-bold text-fun mb-2">
              🤖 Phân tích AI cho Hiệu trưởng
            </div>
            <ul className="text-sm space-y-1 list-disc pl-5">
              <li>
                Khối 4 có điểm thấp nhất do môn <b>Tiếng Anh</b> (TB 7.1). Đề
                xuất tăng tiết tăng cường.
              </li>
              <li>
                Tỉ lệ phụ huynh xem báo cáo tuần đạt <b>89%</b> — cao hơn mức xã
                (82%).
              </li>
              <li>
                3 GV mới có tỉ lệ HS hoàn thành bài tập &lt; 70%, cần sinh hoạt
                chuyên môn.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </ManagerShell>
  );
}
