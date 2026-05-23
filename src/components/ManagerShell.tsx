import { AppShell } from "@/components/AppShell";
import { LayoutDashboard, Landmark, MapPin, Home, School } from "lucide-react";

const items = [
  { label: "Dashboard", to: "/manager", icon: LayoutDashboard },
  { label: "Báo cáo cấp Bộ", to: "/manager/report-bo", icon: Landmark },
  { label: "Báo cáo cấp Tỉnh", to: "/manager/report-tinh", icon: MapPin },
  { label: "Báo cáo cấp Xã", to: "/manager/report-xa", icon: Home },
  { label: "Báo cáo cấp Trường", to: "/manager/report-truong", icon: School },
];

export function ManagerShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      role="manager"
      roleLabel="🏛️ Quản lý"
      roleColor="bg-success/15 text-success"
      navItems={items}
      user={{ name: "TS. Hoàng", subtitle: "Sở GD&ĐT Hà Nội" }}
    >
      {children}
    </AppShell>
  );
}
