import { AppShell } from "@/components/AppShell";
import { Database, Users, Gamepad2, Brain, Server } from "lucide-react";

const items = [
  { label: "Tổng quan", to: "/admin", icon: Server },
  { label: "Quản lý nội dung", to: "/admin/content", icon: Database },
  { label: "Quản lý user", to: "/admin/users", icon: Users },
  { label: "Game engine", to: "/admin/engine", icon: Gamepad2 },
  { label: "AI config", to: "/admin/ai", icon: Brain },
  { label: "Hệ thống", to: "/admin/system", icon: Server },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      role="admin"
      roleLabel="⚙️ Admin"
      roleColor="bg-fun/15 text-fun"
      navItems={items}
      user={{ name: "Admin", subtitle: "NXBGDVN Tech Team" }}
    >
      {children}
    </AppShell>
  );
}
