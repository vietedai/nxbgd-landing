import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "@/components/ManagerShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Landmark,
  TrendingUp,
  Users,
  GraduationCap,
  BookOpen,
} from "lucide-react";

export const Route = createFileRoute("/manager/report-bo")({
  head: () => ({ meta: [{ title: "Báo cáo cấp Bộ | NXBGDVN" }] }),
  component: ReportBoPage,
});

const REGIONS = [
  {
    name: "Đồng bằng sông Hồng",
    provinces: 11,
    students: 2840000,
    score: 8.1,
    completion: 86,
  },
  {
    name: "Trung du & miền núi phía Bắc",
    provinces: 14,
    students: 1620000,
    score: 7.2,
    completion: 71,
  },
  {
    name: "Bắc Trung Bộ & Duyên hải miền Trung",
    provinces: 14,
    students: 2210000,
    score: 7.6,
    completion: 78,
  },
  {
    name: "Tây Nguyên",
    provinces: 5,
    students: 740000,
    score: 7.0,
    completion: 68,
  },
  {
    name: "Đông Nam Bộ",
    provinces: 6,
    students: 2480000,
    score: 8.2,
    completion: 88,
  },
  {
    name: "Đồng bằng sông Cửu Long",
    provinces: 13,
    students: 1890000,
    score: 7.4,
    completion: 74,
  },
];

const SUBJECTS = [
  { s: "Toán", avg: 7.8, std: 1.2 },
  { s: "Tiếng Việt", avg: 7.9, std: 1.0 },
  { s: "Khoa học", avg: 7.4, std: 1.3 },
  { s: "Lịch sử & Địa lí", avg: 7.1, std: 1.4 },
  { s: "Tiếng Anh", avg: 6.8, std: 1.6 },
];

function ReportBoPage() {
  return (
    <ManagerShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-5">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-2">
              <Landmark className="size-8 text-primary" /> Báo cáo cấp Bộ GD&ĐT
            </h1>
            <p className="text-muted-foreground">
              Tổng hợp toàn quốc · 63 tỉnh/thành · HK I 2025-2026
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full">
              <Download className="size-4 mr-1" />
              Excel
            </Button>
            <Button className="btn-pop rounded-full">
              <Download className="size-4 mr-1" />
              Trình Bộ trưởng
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-3">
          {[
            {
              l: "Tỉnh/Thành phố",
              v: "63",
              i: <Landmark className="size-4" />,
              c: "primary",
            },
            {
              l: "Tổng học sinh tiểu học",
              v: "11.78M",
              i: <Users className="size-4" />,
              c: "info",
            },
            {
              l: "Giáo viên cả nước",
              v: "658.420",
              i: <GraduationCap className="size-4" />,
              c: "success",
            },
            {
              l: "Điểm TB quốc gia",
              v: "7.6",
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

        <Card className="p-5 border-2">
          <div className="font-display font-bold mb-3">
            🗺️ So sánh theo vùng kinh tế - xã hội
          </div>
          <div className="space-y-3">
            {REGIONS.map((r) => (
              <div
                key={r.name}
                className="grid grid-cols-12 gap-3 items-center text-sm"
              >
                <div className="col-span-4">
                  <div className="font-bold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.provinces} tỉnh · {(r.students / 1000000).toFixed(2)}M HS
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full ${r.completion >= 80 ? "bg-success" : r.completion >= 70 ? "bg-warning" : "bg-destructive"}`}
                      style={{ width: `${r.completion}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Hoàn thành chương trình {r.completion}%
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <div className="font-display font-bold text-lg">
                    {r.score}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Điểm TB
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5 border-2">
            <div className="font-display font-bold mb-3 flex items-center gap-2">
              <BookOpen className="size-5 text-info" /> Chất lượng theo môn học
              (CT GDPT 2018)
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
                  <div className="w-20 text-right text-xs">
                    <b>{s.avg}</b> · σ {s.std}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 border-2 border-fun bg-fun/5">
            <div className="font-display font-bold text-fun mb-2">
              🤖 Khuyến nghị chính sách AI
            </div>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li>
                Khoảng cách vùng miền vẫn lớn:{" "}
                <b>Tây Nguyên thấp hơn Đông Nam Bộ 1.2 điểm</b>. Đề xuất bổ sung
                4.500 thiết bị học AI cho 5 tỉnh Tây Nguyên.
              </li>
              <li>
                Môn <b>Tiếng Anh</b> có độ lệch chuẩn cao nhất (1.6) → cần chuẩn
                hoá tài liệu và tập huấn 28.000 GV vùng khó khăn.
              </li>
              <li>
                Tỉ lệ học sinh sử dụng SBT số tăng <b>+34% YoY</b>, khuyến nghị
                mở rộng cấp phép cho 12 tỉnh còn lại trong Quý III.
              </li>
            </ul>
          </Card>
        </div>

        <Card className="p-5 border-2 border-info bg-info/5">
          <div className="font-display font-bold text-info mb-2">
            📋 Chỉ tiêu Nghị quyết 29 (2025)
          </div>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">
                Phổ cập tiểu học đúng độ tuổi
              </div>
              <div className="font-display text-xl font-bold text-success">
                99.6%
              </div>
              <div className="text-[11px]">Vượt chỉ tiêu (≥99%)</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                HS đạt chuẩn năng lực số
              </div>
              <div className="font-display text-xl font-bold text-warning-foreground">
                74%
              </div>
              <div className="text-[11px]">Cần đạt 80% năm 2026</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                GV đạt chuẩn AI ứng dụng
              </div>
              <div className="font-display text-xl font-bold text-info">
                61%
              </div>
              <div className="text-[11px]">Cần đạt 70% năm 2026</div>
            </div>
          </div>
        </Card>
      </div>
    </ManagerShell>
  );
}
