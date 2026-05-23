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
  MapPin,
  School,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/manager/report-tinh")({
  head: () => ({ meta: [{ title: "Báo cáo cấp Tỉnh | NXBGDVN" }] }),
  component: ReportTinhPage,
});

const PROVINCES = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
];

const WARDS = [
  {
    name: "Phường Cầu Giấy",
    schools: 18,
    students: 14200,
    score: 8.6,
    completion: 91,
  },
  {
    name: "Phường Hoàn Kiếm",
    schools: 12,
    students: 9800,
    score: 8.5,
    completion: 90,
  },
  {
    name: "Phường Đống Đa",
    schools: 22,
    students: 18400,
    score: 8.2,
    completion: 86,
  },
  { name: "Xã Ba Vì", schools: 14, students: 8200, score: 7.4, completion: 72 },
  {
    name: "Xã Mỹ Đức",
    schools: 11,
    students: 6800,
    score: 7.1,
    completion: 68,
  },
  {
    name: "Xã Sóc Sơn",
    schools: 19,
    students: 12400,
    score: 7.5,
    completion: 75,
  },
];

function ReportTinhPage() {
  const [province, setProvince] = useState("Hà Nội");
  return (
    <ManagerShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-5">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-2">
              <MapPin className="size-8 text-primary" /> Báo cáo cấp Tỉnh
            </h1>
            <p className="text-muted-foreground">
              Sở GD&ĐT {province} · HK I 2025-2026
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={province} onValueChange={setProvince}>
              <SelectTrigger className="w-48 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROVINCES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-full">
              <Download className="size-4 mr-1" />
              Excel
            </Button>
            <Button className="btn-pop rounded-full">
              <Download className="size-4 mr-1" />
              Trình Giám đốc Sở
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-3">
          {[
            {
              l: "Xã/Phường",
              v: "126",
              i: <MapPin className="size-4" />,
              c: "primary",
            },
            {
              l: "Trường tiểu học",
              v: "847",
              i: <School className="size-4" />,
              c: "info",
            },
            {
              l: "Học sinh",
              v: "324.580",
              i: <Users className="size-4" />,
              c: "success",
            },
            {
              l: "Điểm TB Tỉnh",
              v: "7.8",
              i: <TrendingUp className="size-4" />,
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

        <Card className="p-0 border-2 overflow-hidden">
          <div className="p-4 font-display font-bold border-b-2">
            📊 Xếp hạng theo xã/phường (sau sáp nhập 2025)
          </div>
          <div className="grid grid-cols-12 gap-2 p-3 border-b bg-muted text-xs font-bold uppercase">
            <div className="col-span-4">Xã/Phường</div>
            <div className="col-span-2 text-right">Trường</div>
            <div className="col-span-2 text-right">Học sinh</div>
            <div className="col-span-2 text-right">Hoàn thành CT</div>
            <div className="col-span-2 text-right">Điểm TB</div>
          </div>
          {WARDS.map((w) => (
            <div
              key={w.name}
              className="grid grid-cols-12 gap-2 p-3 border-t items-center text-sm hover:bg-muted/30"
            >
              <div className="col-span-4 font-bold">{w.name}</div>
              <div className="col-span-2 text-right">{w.schools}</div>
              <div className="col-span-2 text-right">
                {w.students.toLocaleString()}
              </div>
              <div className="col-span-2 text-right">
                <span
                  className={
                    w.completion >= 85
                      ? "text-success font-bold"
                      : w.completion >= 75
                        ? "text-warning-foreground"
                        : "text-destructive font-bold"
                  }
                >
                  {w.completion}%
                </span>
              </div>
              <div className="col-span-2 text-right font-display font-bold text-lg">
                {w.score.toFixed(1)}
              </div>
            </div>
          ))}
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5 border-2 border-success bg-success/5">
            <div className="font-display font-bold text-success mb-2 flex items-center gap-2">
              <Award className="size-5" /> Top 5 trường xuất sắc
            </div>
            <ol className="text-sm space-y-1 list-decimal pl-5">
              <li>TH Đoàn Thị Điểm — 9.2/10 · Phường Cầu Giấy</li>
              <li>TH Nguyễn Siêu — 9.1/10 · Phường Cầu Giấy</li>
              <li>TH Lê Quý Đôn — 8.9/10 · Phường Hoàn Kiếm</li>
              <li>TH Kim Đồng — 8.4/10 · Phường Đống Đa</li>
              <li>TH Ba Đình — 8.1/10 · Phường Ba Đình</li>
            </ol>
          </Card>
          <Card className="p-5 border-2 border-warning bg-warning/5">
            <div className="font-display font-bold text-warning-foreground mb-2">
              ⚠️ Trường cần hỗ trợ
            </div>
            <ul className="text-sm space-y-1">
              <li>
                • <b>TH Vân Hoà</b> (Xã Ba Vì) — TB 5.8, thiếu 4 GV Tin học
              </li>
              <li>
                • <b>TH An Phú</b> (Xã Mỹ Đức) — TB 6.1, thiết bị xuống cấp
              </li>
              <li>
                • <b>TH Hợp Tiến</b> (Xã Sóc Sơn) — TB 6.2, tỉ lệ active &lt;60%
              </li>
            </ul>
          </Card>
        </div>

        <Card className="p-5 border-2">
          <div className="font-display font-bold mb-3">
            📋 Chỉ tiêu HK I 2025-2026 của Sở
          </div>
          <div className="space-y-3 text-sm">
            {[
              { k: "Tỉ lệ HS hoàn thành chương trình", v: 82, t: 85 },
              { k: "Tỉ lệ HS giỏi - khá", v: 71, t: 70 },
              { k: "Tỉ lệ trường đạt chuẩn quốc gia", v: 76, t: 80 },
              { k: "Tỉ lệ GV đạt chuẩn nghề nghiệp", v: 94, t: 95 },
            ].map((c) => (
              <div key={c.k}>
                <div className="flex justify-between mb-1">
                  <span className="font-bold">{c.k}</span>
                  <span>
                    {c.v}% / {c.t}%{" "}
                    {c.v >= c.t && <span className="text-success">✓</span>}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden relative">
                  <div
                    className={`h-full ${c.v >= c.t ? "bg-success" : "bg-warning"}`}
                    style={{ width: `${c.v}%` }}
                  />
                  <div
                    className="absolute top-0 h-full w-px bg-foreground/40"
                    style={{ left: `${c.t}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ManagerShell>
  );
}
