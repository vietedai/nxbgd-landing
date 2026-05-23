import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/content")({
  head: () => ({ meta: [{ title: "Quản lý nội dung | Admin - NXBGDVN" }] }),
  component: ContentPage,
});

const CONTENT = [
  {
    type: "Sách",
    name: "VBT Khoa học 4 - Tập 1",
    count: "8 chương · 120 bài",
    status: "published",
  },
  {
    type: "Sách",
    name: "VBT Toán 4 - Tập 1",
    count: "10 chương · 200 bài",
    status: "published",
  },
  {
    type: "Sách",
    name: "VBT Tiếng Việt 4 - Tập 1",
    count: "12 chương · 180 bài",
    status: "draft",
  },
  {
    type: "Bộ câu hỏi",
    name: "Olympic Khoa học cấp Sở",
    count: "240 câu",
    status: "published",
  },
  {
    type: "Khoá học",
    name: "Phát triển năng lực số",
    count: "12 module",
    status: "published",
  },
];

function ContentPage() {
  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-5">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">
              📚 Quản lý nội dung
            </h1>
            <p className="text-muted-foreground">
              Sách, bài tập, khoá học · 72.348 câu hỏi tổng
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full">
              <Upload className="size-4 mr-1" />
              Import
            </Button>
            <Button className="btn-pop rounded-full">
              <Plus className="size-4 mr-1" />
              Thêm nội dung
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-3">
          {[
            { l: "Sách điện tử", v: "48", c: "primary" },
            { l: "Câu hỏi", v: "72.348", c: "info" },
            { l: "Khoá học", v: "120", c: "fun" },
            { l: "Đang chờ duyệt", v: "12", c: "warning" },
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

        <Card className="p-4 border-2">
          <div className="relative mb-3">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm sách, câu hỏi, khoá học..."
              className="pl-9"
            />
          </div>
          <div className="space-y-2">
            {CONTENT.map((c) => (
              <div
                key={c.name}
                className="p-3 rounded-xl border-2 bg-card flex justify-between items-center"
              >
                <div>
                  <div className="text-[10px] uppercase font-bold text-primary">
                    {c.type}
                  </div>
                  <div className="font-bold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.count}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.status === "published"
                        ? "bg-success/15 text-success"
                        : "bg-warning/20 text-warning-foreground"
                    }`}
                  >
                    {c.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                  </span>
                  <Button size="sm" variant="outline">
                    Sửa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
