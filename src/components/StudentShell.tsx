import { AppShell, type NavItem } from "./AppShell";
import {
  Home,
  BookOpen,
  Dumbbell,
  Swords,
  Trophy,
  User,
  Brain,
} from "lucide-react";

const items: NavItem[] = [
  { label: "Trang chủ", to: "/student", icon: Home, group: 1 },
  {
    label: "Năng lực của tôi",
    to: "/student/competency",
    icon: Brain,
    group: 1,
  },
  {
    label: "Bài tập của tôi",
    to: "/student/assignments",
    icon: BookOpen,
    group: 2,
  },
  { label: "Luyện tập", to: "/student/practice", icon: Dumbbell, group: 2 },
  { label: "Thi đấu", to: "/student/battle", icon: Swords, group: 2 },
  { label: "Thành tích", to: "/student/achievements", icon: Trophy, group: 3 },
  { label: "Hồ sơ", to: "/student/profile", icon: User, group: 3 },
];

export function StudentShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      role="student"
      roleLabel="🎓 Học sinh"
      roleColor="bg-primary/15 text-primary"
      navItems={items}
      user={{ name: "Bảo An", subtitle: "Lớp 4A · TH Lê Quý Đôn" }}
      showStats
      aiHubTo="/student/ai"
    >
      {children}
    </AppShell>
  );
}
