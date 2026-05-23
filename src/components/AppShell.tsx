import { Link, useLocation } from "@tanstack/react-router";
import mascot from "@/assets/mascot-bee.png";
import { cn } from "@/lib/utils";
import { Flame, Star, Coins } from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  group?: number;
}

interface AppShellProps {
  role: "student" | "teacher" | "manager" | "admin";
  roleLabel: string;
  roleColor: string;
  navItems: NavItem[];
  user: { name: string; subtitle: string };
  children: React.ReactNode;
  showStats?: boolean;
  aiHubTo?: string;
}

export function AppShell({
  role,
  roleLabel,
  roleColor,
  navItems,
  user,
  children,
  showStats,
  aiHubTo,
}: AppShellProps) {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top header */}
      <header className="bg-card border-b-2 border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={mascot}
              alt="NXBGDVN"
              className="size-10"
              width={40}
              height={40}
            />
            <div className="hidden sm:block">
              <div className="font-display font-bold text-base leading-tight">
                NXBGDVN
              </div>
              <div className="text-[11px] text-muted-foreground leading-tight">
                Sách bài tập (AI)
              </div>
            </div>
          </Link>
          <div
            className={cn(
              "hidden md:inline-flex items-center text-xs px-3 py-1.5 rounded-full font-bold",
              roleColor,
            )}
          >
            {roleLabel}
          </div>
          <div className="flex-1" />
          {showStats && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-warning/20 text-warning-foreground font-bold text-sm">
                <Flame className="size-4" /> 12
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-fun/20 text-fun font-bold text-sm">
                <Star className="size-4" /> 1.250
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-success/20 text-success font-bold text-sm">
                <Coins className="size-4" /> 340
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <div className="font-bold text-sm">{user.name}</div>
              <div className="text-xs text-muted-foreground">
                {user.subtitle}
              </div>
            </div>
            <div className="size-10 rounded-full bg-gradient-to-br from-primary to-fun flex items-center justify-center text-primary-foreground font-bold">
              {user.name.charAt(0)}
            </div>
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-foreground ml-2 underline"
            >
              Đổi role
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-60 shrink-0 hidden lg:block bg-card border-r-2 p-3">
          <nav className="space-y-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              const prev = navItems[idx - 1];
              const showDivider =
                prev && item.group !== undefined && prev.group !== item.group;
              return (
                <div key={item.to}>
                  {showDivider && <div className="my-2 mx-3 h-px bg-border" />}
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-sm transition-all",
                      active
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "hover:bg-secondary text-foreground/80",
                    )}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </nav>
          {aiHubTo ? (
            <Link
              to={aiHubTo}
              className="mt-8 block rounded-2xl bg-gradient-to-br from-fun/20 to-primary/10 p-4 text-center hover:ring-2 hover:ring-fun transition group"
            >
              <img
                src={mascot}
                alt=""
                className="size-20 mx-auto animate-float group-hover:scale-110 transition-transform"
              />
              <div className="text-xs font-bold mt-2">Ong Chăm Chỉ</div>
              <div className="text-[10px] text-muted-foreground">
                Trợ lí AI · Bấm để mở →
              </div>
            </Link>
          ) : (
            <div className="mt-8 rounded-2xl bg-gradient-to-br from-fun/20 to-primary/10 p-4 text-center">
              <img
                src={mascot}
                alt=""
                className="size-20 mx-auto animate-float"
              />
              <div className="text-xs font-bold mt-2">Ong Chăm Chỉ</div>
              <div className="text-[10px] text-muted-foreground">
                Trợ lí AI của em
              </div>
            </div>
          )}
        </aside>

        {/* Main + bottom nav for mobile */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden sticky bottom-0 bg-card border-t-2 z-40 grid grid-cols-5 gap-1 p-2">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 py-1 rounded-lg text-[10px] font-medium",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" />
              <span className="truncate w-full text-center">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
