import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  GraduationCap,
  UserCog,
  Shield,
  Building2,
} from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Quản lý user | Admin - NXBGDVN" }] }),
  component: UsersPage,
});

const USERS = [
  {
    name: "Nguyễn Bảo An",
    role: "Học sinh",
    unit: "TH Đoàn Thị Điểm - 4A",
    status: "active",
  },
  {
    name: "Cô Nguyễn Lan",
    role: "Giáo viên",
    unit: "TH Đoàn Thị Điểm",
    status: "active",
  },
  {
    name: "TS. Hoàng Minh",
    role: "Quản lý",
    unit: "Sở GD&ĐT Hà Nội",
    status: "active",
  },
  {
    name: "Trần Văn Bình",
    role: "Học sinh",
    unit: "TH Nguyễn Siêu - 4B",
    status: "active",
  },
  {
    name: "Cô Phạm Hồng",
    role: "Giáo viên",
    unit: "TH Lê Quý Đôn",
    status: "inactive",
  },
  { name: "Admin Tech", role: "Admin", unit: "NXBGDVN", status: "active" },
];

function roleIcon(role: string) {
  if (role === "Học sinh")
    return <GraduationCap className="size-4 text-primary" />;
  if (role === "Giáo viên") return <UserCog className="size-4 text-info" />;
  if (role === "Quản lý") return <Building2 className="size-4 text-success" />;
  return <Shield className="size-4 text-fun" />;
}

function UsersPage() {
  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-5">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">👥 Quản lý user</h1>
            <p className="text-muted-foreground">
              1.2M user trên toàn hệ thống
            </p>
          </div>
          <Button className="btn-pop rounded-full">
            <Plus className="size-4 mr-1" />
            Thêm user
          </Button>
        </div>

        <div className="grid sm:grid-cols-4 gap-3">
          {[
            { l: "Học sinh", v: "1.18M", c: "primary" },
            { l: "Giáo viên", v: "18.230", c: "info" },
            { l: "Quản lý", v: "324", c: "success" },
            { l: "Admin", v: "42", c: "fun" },
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
              placeholder="Tìm user theo tên, email, đơn vị..."
              className="pl-9"
            />
          </div>
          <div className="divide-y">
            {USERS.map((u) => (
              <div key={u.name} className="py-3 flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-to-br from-primary to-fun flex items-center justify-center text-primary-foreground font-bold">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{u.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {u.unit}
                  </div>
                </div>
                <span className="hidden sm:flex items-center gap-1 text-xs font-bold">
                  {roleIcon(u.role)} {u.role}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.status === "active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}
                >
                  {u.status === "active" ? "Active" : "Khoá"}
                </span>
                <Button size="sm" variant="outline">
                  Sửa
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
