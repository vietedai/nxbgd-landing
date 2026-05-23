import { createFileRoute } from "@tanstack/react-router";
import { StudentShell } from "@/components/StudentShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/student/profile")({
  head: () => ({ meta: [{ title: "Hồ sơ | NXBGDVN" }] }),
  component: Profile,
});

function Profile() {
  return (
    <StudentShell>
      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-5">
        <h1 className="font-display text-3xl font-bold">👤 Hồ sơ</h1>
        <Card className="p-6 border-2 flex flex-col sm:flex-row items-center gap-5">
          <div className="size-24 rounded-full bg-gradient-to-br from-primary to-fun flex items-center justify-center text-primary-foreground text-4xl font-display font-bold">
            B
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="font-display text-2xl font-bold">Lê Bảo An</div>
            <div className="text-muted-foreground">
              Lớp 4A · Trường TH Lê Quý Đôn · Hà Nội
            </div>
            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
              <Badge label="🥇 Hạng Vàng" />
              <Badge label="🔥 Streak 12" />
              <Badge label="⭐ 1.250 XP" />
            </div>
          </div>
          <Button variant="outline" className="rounded-full">
            Chỉnh sửa
          </Button>
        </Card>

        <Card className="p-5 border-2">
          <div className="font-display font-bold mb-3">Cài đặt</div>
          <div className="space-y-2 text-sm">
            <Row label="Thông báo nhắc học" value="Bật" />
            <Row label="Phụ huynh được liên kết" value="Mẹ Lan (0987...)" />
            <Row label="Chế độ ban đêm" value="Tự động" />
            <Row label="Ngôn ngữ" value="Tiếng Việt" />
          </div>
        </Card>
      </div>
    </StudentShell>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="text-xs px-3 py-1 rounded-full bg-secondary font-bold">
      {label}
    </span>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
