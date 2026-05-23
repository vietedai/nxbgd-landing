import { AppShell } from "@/components/AppShell";
import {
  LayoutDashboard,
  Send,
  Database,
  LineChart,
  FileBarChart,
  FileEdit,
  ClipboardCheck,
} from "lucide-react";

const items = [
  { label: "Dashboard lớp", to: "/teacher", icon: LayoutDashboard, group: 1 },
  { label: "Ngân hàng câu hỏi", to: "/teacher/bank", icon: Database, group: 2 },
  {
    label: "Ngân hàng đề/phiếu",
    to: "/teacher/exam",
    icon: FileEdit,
    group: 2,
  },
  { label: "Giao bài tập", to: "/teacher/assign", icon: Send, group: 3 },
  {
    label: "Thi/Kiểm tra",
    to: "/teacher/test",
    icon: ClipboardCheck,
    group: 3,
  },
  {
    label: "Theo dõi tiến độ",
    to: "/teacher/progress",
    icon: LineChart,
    group: 4,
  },
  { label: "Báo cáo", to: "/teacher/reports", icon: FileBarChart, group: 4 },
];

export function TeacherShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      role="teacher"
      roleLabel="👨‍🏫 Giáo viên"
      roleColor="bg-info/15 text-info"
      navItems={items}
      user={{ name: "Cô Lan", subtitle: "GV chủ nhiệm 4A" }}
      aiHubTo="/teacher/ai"
    >
      {children}
    </AppShell>
  );
}
