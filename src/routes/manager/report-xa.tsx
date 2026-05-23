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
import {
  Download,
  Home,
  School,
  Users,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/manager/report-xa")({
  head: () => ({ meta: [{ title: "Báo cáo cấp Xã | NXBGDVN" }] }),
  component: ReportXaPage,
});

const WARDS = [
  "Phường Cầu Giấy",
  "Phường Hoàn Kiếm",
  "Phường Đống Đa",
  "Xã Ba Vì",
  "Xã Mỹ Đức",
];

const SCHOOLS = [
  {
    name: "TH Đoàn Thị Điểm",
    classes: 42,
    students: 1280,
    teachers: 78,
    score: 9.2,
    status: "good",
  },
  {
    name: "TH Nguyễn Siêu",
    classes: 36,
    students: 1080,
    teachers: 65,
    score: 9.1,
    status: "good",
  },
  {
    name: "TH Cầu Giấy",
    classes: 30,
    students: 920,
    teachers: 52,
    score: 8.4,
    status: "good",
  },
  {
    name: "TH Yên Hoà",
    classes: 28,
    students: 860,
    teachers: 48,
    score: 7.9,
    status: "ok",
  },
  {
    name: "TH Trung Hoà",
    classes: 24,
    students: 720,
    teachers: 41,
    score: 7.2,
    status: "ok",
  },
];

function ReportXaPage() {
  const [ward, setWard] = useState("Phường Cầu Giấy");
  return (
    <ManagerShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-5">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-2">
              <Home className="size-8 text-primary" /> Báo cáo cấp Xã/Phường
            </h1>
            <p className="text-muted-foreground">
              {ward} · UBND {ward} · HK I 2025-2026
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={ward} onValueChange={setWard}>
              <SelectTrigger className="w-48 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WARDS.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}
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
              Trình UBND xã
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-3">
          {[
            {
              l: "Trường tiểu học",
              v: "18",
              i: <School className="size-4" />,
              c: "primary",
            },
            {
              l: "Học sinh độ tuổi 6-10",
              v: "14.612",
              i: <Users className="size-4" />,
              c: "info",
            },
            {
              l: "Đến trường (phổ cập)",
              v: "99.7%",
              i: <BookOpen className="size-4" />,
              c: "success",
            },
            {
              l: "Điểm TB Xã",
              v: "8.6",
              i: <School className="size-4" />,
              c: "warning",
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

        <div className="grid md:grid-cols-3 gap-3">
          <Card className="p-4 border-2 border-success bg-success/5">
            <div className="text-xs text-muted-foreground">
              HS hoàn cảnh khó khăn được hỗ trợ
            </div>
            <div className="font-display text-2xl font-bold">412 / 412</div>
            <div className="text-[11px] text-success mt-1">
              100% có học bổng / miễn học phí
            </div>
          </Card>
          <Card className="p-4 border-2 border-info bg-info/5">
            <div className="text-xs text-muted-foreground">
              HS dân tộc thiểu số
            </div>
            <div className="font-display text-2xl font-bold">86</div>
            <div className="text-[11px] text-info mt-1">
              Đang theo học bình thường
            </div>
          </Card>
          <Card className="p-4 border-2 border-fun bg-fun/5">
            <div className="text-xs text-muted-foreground">
              Phụ huynh tương tác app
            </div>
            <div className="font-display text-2xl font-bold">82%</div>
            <div className="text-[11px] text-fun mt-1">
              11.982 / 14.612 phụ huynh
            </div>
          </Card>
        </div>

        <Card className="p-0 border-2 overflow-hidden">
          <div className="p-4 font-display font-bold border-b-2">
            🏫 Các trường trên địa bàn xã
          </div>
          <div className="grid grid-cols-12 gap-2 p-3 border-b bg-muted text-xs font-bold uppercase">
            <div className="col-span-4">Trường</div>
            <div className="col-span-2 text-right">Lớp</div>
            <div className="col-span-2 text-right">HS</div>
            <div className="col-span-2 text-right">GV</div>
            <div className="col-span-2 text-right">Điểm TB</div>
          </div>
          {SCHOOLS.map((s) => (
            <div
              key={s.name}
              className="grid grid-cols-12 gap-2 p-3 border-t items-center text-sm"
            >
              <div className="col-span-4 font-bold">{s.name}</div>
              <div className="col-span-2 text-right">{s.classes}</div>
              <div className="col-span-2 text-right">
                {s.students.toLocaleString()}
              </div>
              <div className="col-span-2 text-right">{s.teachers}</div>
              <div
                className={`col-span-2 text-right font-display font-bold ${s.score >= 9 ? "text-success" : s.score >= 8 ? "text-warning-foreground" : ""}`}
              >
                {s.score}
              </div>
            </div>
          ))}
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5 border-2 border-warning bg-warning/5">
            <div className="font-display font-bold text-warning-foreground mb-2 flex items-center gap-2">
              <AlertTriangle className="size-5" /> Vấn đề cần UBND xã hỗ trợ
            </div>
            <ul className="text-sm space-y-1.5">
              <li>
                • 12 HS có nguy cơ bỏ học (đã liên hệ phụ huynh, cần thêm hỗ trợ
                xã hội).
              </li>
              <li>
                • 3 trường thiếu phòng tin học đạt chuẩn — đề nghị bổ sung 24
                máy.
              </li>
              <li>
                • Internet trường TH Trung Hoà yếu, ảnh hưởng học AI/SBT số.
              </li>
            </ul>
          </Card>
          <Card className="p-5 border-2 border-success bg-success/5">
            <div className="font-display font-bold text-success mb-2">
              ✅ Thành tích nổi bật
            </div>
            <ul className="text-sm space-y-1.5 list-disc pl-5">
              <li>Đạt chuẩn phổ cập tiểu học mức độ 3 (cao nhất).</li>
              <li>2 HS đạt giải Olympic Toán cấp Quốc gia.</li>
              <li>14/18 trường đạt chuẩn quốc gia mức độ 2.</li>
            </ul>
          </Card>
        </div>
      </div>
    </ManagerShell>
  );
}
