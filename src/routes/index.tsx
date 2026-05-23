import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import mascot from "@/assets/mascot-bee.png";
import coverToan from "@/assets/bia-sbt-toan-4.jpg";
import coverTV from "@/assets/bia-sbt-tieng-viet-4.jpeg";
import coverKH from "@/assets/bia-sbt-khoa-hoc-4.jpeg";
import coverTA from "@/assets/bia-sbt-tieng-anh-4.jpg";
import coverTH from "@/assets/bia-sbt-tin-hoc-4.jpg";
import coverLSDL from "@/assets/bia-sbt-lich-su-dia-ly-4.jpg";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GraduationCap,
  Users,
  Building2,
  Shield,
  Sparkles,
  BookOpen,
  Brain,
  Trophy,
  ArrowRight,
  PlayCircle,
  Check,
  ShoppingCart,
  LogIn,
  Search,
  MapPin,
  Phone,
  Mail,
  Globe,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NXBGDVN - Sách bài tập (AI) | Hệ thống học tập số quốc gia" },
      {
        name: "description",
        content:
          "Nền tảng sách bài tập điện tử tích hợp AI cho học sinh Việt Nam — 23 kiểu tương tác, gamification và adaptive learning.",
      },
      { property: "og:title", content: "NXBGDVN - Sách bài tập (AI)" },
      {
        property: "og:description",
        content:
          "Hệ thống học tập số quốc gia với 23 kiểu tương tác, AI feedback, và gamification.",
      },
    ],
  }),
  component: Landing,
});

const ROLES = [
  {
    to: "/student",
    icon: GraduationCap,
    title: "Học sinh",
    desc: "Làm bài tập, luyện tập, thi đấu",
    emoji: "🎓",
  },
  {
    to: "/teacher",
    icon: Users,
    title: "Giáo viên",
    desc: "Giao bài, theo dõi tiến độ",
    emoji: "👨‍🏫",
  },
  {
    to: "/manager",
    icon: Building2,
    title: "Quản lý",
    desc: "Trường / Sở / Bộ",
    emoji: "🏛️",
  },
  {
    to: "/admin",
    icon: Shield,
    title: "Admin",
    desc: "Quản lý hệ thống & nội dung",
    emoji: "⚙️",
  },
] as const;

interface BookData {
  id: string;
  title: string;
  subject: string;
  grade: number;
  price: number;
  emoji: string;
  pattern: "dots" | "grid" | "waves" | "stars" | "circles" | "triangles";
  gradient: string;
  owned: boolean;
}

const ADVANCED_BOOKS: (BookData & { cover: string })[] = [
  {
    id: "toan4",
    title: "Toán nâng cao",
    subject: "Toán",
    grade: 4,
    price: 89000,
    emoji: "➗",
    pattern: "grid",
    gradient: "from-primary via-primary to-info",
    owned: true,
    cover: coverToan,
  },
  {
    id: "tv4",
    title: "Tiếng Việt nâng cao",
    subject: "Tiếng Việt",
    grade: 4,
    price: 79000,
    emoji: "📖",
    pattern: "waves",
    gradient: "from-destructive via-fun to-warning",
    owned: true,
    cover: coverTV,
  },
  {
    id: "kh4",
    title: "Khoa học nâng cao",
    subject: "Khoa học",
    grade: 4,
    price: 95000,
    emoji: "🔬",
    pattern: "circles",
    gradient: "from-success via-info to-primary",
    owned: true,
    cover: coverKH,
  },
  {
    id: "ta4",
    title: "Tiếng Anh nâng cao",
    subject: "Tiếng Anh",
    grade: 4,
    price: 99000,
    emoji: "🌐",
    pattern: "stars",
    gradient: "from-fun via-primary to-info",
    owned: false,
    cover: coverTA,
  },
  {
    id: "th4",
    title: "Tin học nâng cao",
    subject: "Tin học",
    grade: 4,
    price: 85000,
    emoji: "💻",
    pattern: "dots",
    gradient: "from-info via-fun to-primary",
    owned: false,
    cover: coverTH,
  },
  {
    id: "lsdl4",
    title: "Lịch sử & Địa lí nâng cao",
    subject: "Lịch sử & Địa lí",
    grade: 4,
    price: 89000,
    emoji: "🗺️",
    pattern: "triangles",
    gradient: "from-warning via-destructive to-fun",
    owned: false,
    cover: coverLSDL,
  },
];

const GRADES = [
  { value: 1, label: "Lớp 1", emoji: "🎒" },
  { value: 2, label: "Lớp 2", emoji: "✏️" },
  { value: 3, label: "Lớp 3", emoji: "📐" },
  { value: 4, label: "Lớp 4", emoji: "🐝" },
  { value: 5, label: "Lớp 5", emoji: "🎓" },
] as const;

const FILTER_SUBJECTS = [
  "Ngữ văn",
  "Toán",
  "Khoa học tự nhiên",
  "Lịch sử và Địa lí",
  "Lịch sử",
  "Công nghệ",
  "Âm nhạc",
  "Mĩ thuật",
  "Giáo dục công dân",
  "Tin học",
  "Tiếng Anh",
  "Hoạt động trải nghiệm",
] as const;

const SUBJECT_MAPPING: Record<string, string[]> = {
  "Ngữ văn": ["Tiếng Việt"],
  Toán: ["Toán"],
  "Khoa học tự nhiên": ["Khoa học"],
  "Lịch sử và Địa lí": ["Lịch sử & Địa lí"],
  "Lịch sử": ["Lịch sử & Địa lí"],
  "Tin học": ["Tin học"],
  "Tiếng Anh": ["Tiếng Anh"],
};

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "₫";
}

function BookCover({ book, badge }: { book: BookData; badge: string }) {
  return (
    <div
      className={`relative aspect-[5/7] bg-gradient-to-br ${book.gradient} overflow-hidden`}
    >
      <PatternSvg pattern={book.pattern} />
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/30" />
      <div className="absolute top-0 left-2 bottom-0 w-0.5 bg-white/20" />
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-2">
        <span className="inline-block bg-white/95 backdrop-blur px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider text-foreground shadow-soft">
          {book.subject}
        </span>
        <span className="inline-block bg-black/30 backdrop-blur px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
          Lớp {book.grade}
        </span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="size-20 md:size-24 rounded-full bg-white/95 backdrop-blur shadow-card flex items-center justify-center text-4xl md:text-5xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
          {book.emoji}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 px-2.5 py-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <div className="text-white text-[10px] font-bold uppercase tracking-wider">
          {badge}
        </div>
        <div className="text-white/80 text-[9px] font-medium">
          NXB Giáo dục Việt Nam
        </div>
      </div>
    </div>
  );
}

function PatternSvg({ pattern }: { pattern: BookData["pattern"] }) {
  switch (pattern) {
    case "dots":
      return (
        <svg
          className="absolute inset-0 w-full h-full opacity-25"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="p-dots"
              x="0"
              y="0"
              width="14"
              height="14"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="7" cy="7" r="1.6" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#p-dots)" />
        </svg>
      );
    case "grid":
      return (
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="p-grid"
              x="0"
              y="0"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 16 0 L 0 0 0 16"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#p-grid)" />
        </svg>
      );
    case "waves":
      return (
        <svg
          className="absolute inset-0 w-full h-full opacity-25"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 100 140"
        >
          <path
            d="M0 30 Q 25 20 50 30 T 100 30"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M0 60 Q 25 50 50 60 T 100 60"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M0 90 Q 25 80 50 90 T 100 90"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M0 120 Q 25 110 50 120 T 100 120"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      );
    case "stars":
      return (
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="p-stars"
              x="0"
              y="0"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M14 4 L16 11 L23 11 L17 15 L19 22 L14 18 L9 22 L11 15 L5 11 L12 11 Z"
                fill="white"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#p-stars)" />
        </svg>
      );
    case "circles":
      return (
        <svg
          className="absolute inset-0 w-full h-full opacity-25"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 100 140"
        >
          <circle
            cx="20"
            cy="20"
            r="14"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
          />
          <circle
            cx="80"
            cy="40"
            r="20"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
          />
          <circle
            cx="30"
            cy="100"
            r="22"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
          />
          <circle
            cx="85"
            cy="115"
            r="12"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
          />
        </svg>
      );
    case "triangles":
      return (
        <svg
          className="absolute inset-0 w-full h-full opacity-25"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="p-tri"
              x="0"
              y="0"
              width="24"
              height="22"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="12,3 22,19 2,19"
                fill="none"
                stroke="white"
                strokeWidth="1.2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#p-tri)" />
        </svg>
      );
  }
}

const LogoSVG = () => (
  <svg
    viewBox="0 0 540 80"
    className="h-10 md:h-12 w-auto flex-shrink-0"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Gold Square Symbol */}
    <rect x="0" y="5" width="70" height="70" rx="8" fill="#C59325" />
    <path
      d="M 32 18 A 16 16 0 0 0 16 34 A 16 16 0 0 0 32 50 L 32 42 A 8 8 0 0 1 24 34 A 8 8 0 0 1 32 26 L 32 18 Z"
      fill="white"
    />
    <path d="M 24 32 H 32 V 38 H 24 Z" fill="white" />
    <path
      d="M 38 18 V 50 H 46 A 16 16 0 0 0 46 18 H 38 Z M 42 26 H 46 A 8 8 0 0 1 46 42 H 42 V 26 Z"
      fill="white"
    />
    <path
      d="M 15 57 C 22 55 30 55 35 59 C 40 55 48 55 55 57 L 55 64 C 48 62 40 62 35 66 C 30 62 22 62 15 64 Z"
      fill="white"
    />

    {/* Brand Texts - Responsive by hiding/showing parts using standard CSS */}
    <text
      x="85"
      y="38"
      fill="#0072BC"
      className="hidden sm:block"
      fontFamily='"Baloo 2", "Quicksand", system-ui, sans-serif'
      fontWeight="800"
      fontSize="24"
      letterSpacing="-0.02em"
    >
      NHÀ XUẤT BẢN GIÁO DỤC VIỆT NAM
    </text>
    <text
      x="85"
      y="62"
      fill="#C59325"
      className="hidden sm:block"
      fontFamily='"Baloo 2", "Quicksand", system-ui, sans-serif'
      fontWeight="700"
      fontSize="15"
      letterSpacing="-0.01em"
    >
      VIETNAM EDUCATION PUBLISHING HOUSE
    </text>

    <text
      x="85"
      y="48"
      fill="#0072BC"
      className="sm:hidden"
      fontFamily='"Baloo 2", "Quicksand", system-ui, sans-serif'
      fontWeight="800"
      fontSize="28"
      letterSpacing="-0.02em"
    >
      NXBGDVN
    </text>
  </svg>
);

function Landing() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Generate books for all 5 grades
  const allBooks = useMemo(() => {
    const list: (BookData & { cover: string; isAdvanced: boolean })[] = [];

    for (let g = 1; g <= 5; g++) {
      ADVANCED_BOOKS.forEach((b) => {
        // 1. Basic book (Sách bài tập)
        const basicId = `basic-${b.id.replace("4", String(g))}`;
        const basicTitle = `Sách bài tập ${b.subject} Lớp ${g}`;
        const basicPrice =
          30000 + g * 2000 + (b.subject.charCodeAt(0) % 5) * 1000;
        list.push({
          id: basicId,
          title: basicTitle,
          subject: b.subject,
          grade: g,
          price: basicPrice,
          emoji: b.emoji,
          pattern: b.pattern,
          gradient: b.gradient,
          owned: g === 4 ? b.owned : (basicPrice + g) % 3 === 0,
          cover: b.cover,
          isAdvanced: false,
        });

        // 2. Advanced book (Sách bài tập nâng cao)
        const advId = `adv-${b.id.replace("4", String(g))}`;
        const advTitle = `${b.subject} nâng cao Lớp ${g}`;
        const advPrice = b.price + (g - 4) * 2000;
        list.push({
          id: advId,
          title: advTitle,
          subject: b.subject,
          grade: g,
          price: advPrice,
          emoji: b.emoji,
          pattern: b.pattern,
          gradient: b.gradient,
          owned: g === 4 ? b.owned : (advPrice + g) % 2 === 0,
          cover: b.cover,
          isAdvanced: true,
        });
      });
    }
    return list;
  }, []);

  // Filter books based on checked subjects and search query
  const filteredBooks = useMemo(() => {
    let list = allBooks;

    // 1. Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.subject.toLowerCase().includes(query),
      );
    }

    // 2. Filter by checked subjects in the sidebar
    if (selectedSubjects.length > 0) {
      const allowedSubjects = selectedSubjects.flatMap(
        (sub) => SUBJECT_MAPPING[sub] || [],
      );
      list = list.filter((book) => allowedSubjects.includes(book.subject));
    }

    return list;
  }, [allBooks, searchQuery, selectedSubjects]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 via-background to-fun/5">
      {/* Header */}
      <header className="border-b-2 bg-card/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <LogoSVG />
          </Link>

          {/* Middle: Search Bar */}
          <div className="flex-1 max-w-md mx-auto relative px-2">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm sách, bài tập, trợ lý AI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-9 rounded-full bg-muted/65 border-2 border-transparent focus:border-primary focus:bg-card focus:outline-none text-xs font-semibold transition-all shadow-inner focus:shadow-soft text-foreground placeholder:text-muted-foreground/80"
              />
              <Search className="absolute left-3.5 size-4 text-muted-foreground/80 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 text-muted-foreground/80 hover:text-foreground text-[10px] font-bold cursor-pointer bg-muted/40 hover:bg-muted/80 rounded-full size-4 flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Avatar dropdown with roles */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full pl-3 pr-1 py-1 border-2 border-border hover:border-primary transition-all bg-card group cursor-pointer">
              <span className="text-sm font-bold hidden sm:inline">
                Đăng nhập
              </span>
              <div className="size-9 rounded-full bg-gradient-to-br from-primary to-fun flex items-center justify-center text-primary-foreground">
                <LogIn className="size-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                Chọn vai trò để vào hệ thống
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ROLES.map((r) => (
                <DropdownMenuItem
                  key={r.to}
                  asChild
                  className="cursor-pointer py-2.5"
                >
                  <Link to={r.to} className="flex items-center gap-3">
                    <span className="text-xl">{r.emoji}</span>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{r.title}</div>
                      <div className="text-[11px] text-muted-foreground leading-tight">
                        {r.desc}
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-8 w-full">
        <div className="relative w-full rounded-3xl overflow-hidden border-2 border-border/80 shadow-soft group aspect-[16/6] md:aspect-[3/1] lg:aspect-[128/45] bg-gradient-to-r from-amber-100 via-orange-50 to-sky-100">
          <img
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1280&q=80"
            alt="NXBGDVN - Sách bài tập số"
            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent flex items-center px-8 md:px-16">
            <div className="max-w-xl text-white drop-shadow-md">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning text-warning-foreground text-[10px] font-bold uppercase tracking-wider mb-3 shadow-soft">
                🎯 Hệ thống học tập số quốc gia
              </span>
              <h1 className="font-display text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white">
                Sách Bài Tập Số <br />
                <span className="text-amber-300">NXB Giáo Dục Việt Nam</span>
              </h1>
              <p className="mt-2 md:mt-3 text-xs md:text-sm text-white/90 font-medium leading-relaxed hidden sm:block">
                Học vui hơn, hiệu quả hơn cùng Ong Chăm Chỉ và trợ lý AI thông
                minh — tích hợp 23 kiểu tương tác, adaptive learning và ngân
                hàng 72.000+ câu hỏi bám sát SGK.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sách bài tập (cơ bản theo SGK & nâng cao theo lớp/môn) */}
      <section
        id="sach-bai-tap"
        className="max-w-7xl mx-auto px-4 pb-20 w-full"
      >
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-primary">
            Học tập cá nhân hóa & phát triển năng lực
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-1">
            Kho Sách Bài Tập Số
          </h2>
          <p className="text-muted-foreground mt-1">
            Bám sát chương trình GDPT 2018 đầy đủ từ Lớp 1 đến Lớp 5
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Cột bên trái: Bộ lọc môn học */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-2 border-border/80 rounded-3xl bg-card/85 backdrop-blur shadow-soft sticky top-20">
              <h3 className="font-display font-bold text-lg text-foreground border-b-2 border-border pb-3 mb-4 flex items-center gap-2">
                <span>📚</span> Môn học
              </h3>
              <div className="space-y-3">
                {FILTER_SUBJECTS.map((sub) => {
                  const isChecked = selectedSubjects.includes(sub);
                  return (
                    <label
                      key={sub}
                      className="flex items-center gap-3.5 px-2 py-1.5 rounded-xl hover:bg-muted/80 cursor-pointer transition-all duration-200 group"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => {
                          setSelectedSubjects((prev) =>
                            prev.includes(sub)
                              ? prev.filter((s) => s !== sub)
                              : [...prev, sub],
                          );
                        }}
                        className="border-2 border-muted-foreground/30 data-[state=checked]:border-primary"
                      />
                      <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground select-none">
                        {sub}
                      </span>
                    </label>
                  );
                })}
              </div>

              {selectedSubjects.length > 0 && (
                <button
                  onClick={() => setSelectedSubjects([])}
                  className="mt-5 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-primary bg-primary/10 hover:bg-primary hover:text-white transition-all cursor-pointer text-center"
                >
                  Xóa bộ lọc
                </button>
              )}
            </Card>
          </div>

          {/* Cột bên phải: Danh sách 5 lớp, mỗi lớp 1 hàng */}
          <div className="lg:col-span-3 space-y-8">
            {/* Horizontal Grade Filter Row */}
            <div className="p-3 rounded-3xl bg-card/60 backdrop-blur border-2 border-border/80 shadow-soft">
              <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-1 px-1">
                <button
                  onClick={() => setSelectedGrade("all")}
                  className={`
                    px-4 py-2 rounded-xl text-xs font-bold font-display transition-all duration-300 flex items-center gap-1.5 cursor-pointer whitespace-nowrap
                    ${
                      selectedGrade === "all"
                        ? "bg-gradient-to-r from-primary to-fun text-white scale-105 shadow-soft border-transparent"
                        : "bg-card border-2 border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50"
                    }
                  `}
                >
                  <span className="text-sm">🌐</span>
                  <span>Tất cả lớp</span>
                </button>

                {GRADES.map((g) => {
                  const isActive = selectedGrade === g.value;
                  return (
                    <button
                      key={g.value}
                      onClick={() => setSelectedGrade(g.value)}
                      className={`
                        px-4 py-2 rounded-xl text-xs font-bold font-display transition-all duration-300 flex items-center gap-1.5 cursor-pointer whitespace-nowrap
                        ${
                          isActive
                            ? "bg-gradient-to-r from-primary to-fun text-white scale-105 shadow-soft border-transparent transform -translate-y-0.5 animate-pop-in"
                            : "bg-card border-2 border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50"
                        }
                      `}
                    >
                      <span className="text-sm">{g.emoji}</span>
                      <span>{g.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {GRADES.map((g) => {
              // If filtering by specific grade, only show that grade
              if (selectedGrade !== "all" && selectedGrade !== g.value) {
                return null;
              }

              // Filter books for this grade
              const gradeBooks = filteredBooks.filter(
                (b) => b.grade === g.value,
              );

              if (gradeBooks.length === 0) return null;

              return (
                <div key={g.value} className="space-y-4 animate-pop-in">
                  {/* Grade row header */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{g.emoji}</span>
                      <h3 className="font-display font-extrabold text-xl md:text-2xl text-foreground">
                        {g.label}
                      </h3>
                      <span className="text-[11px] font-bold text-muted-foreground ml-2 px-2 py-0.5 bg-muted rounded-full">
                        {gradeBooks.length} cuốn sách
                      </span>
                    </div>
                  </div>

                  {/* Grid of books of this grade */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                    {gradeBooks.map((b) => (
                      <Card
                        key={b.id}
                        className="group p-0 border-2 hover:border-primary transition-all hover:-translate-y-1 hover:shadow-card overflow-hidden flex flex-col relative"
                      >
                        {/* Custom Badge to indicate level */}
                        <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-soft text-white ${
                              b.isAdvanced
                                ? "bg-gradient-to-r from-primary to-fun"
                                : "bg-success"
                            }`}
                          >
                            {b.isAdvanced ? "Nâng cao" : "Cơ bản"}
                          </span>
                        </div>

                        {b.owned && (
                          <div className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-success text-success-foreground text-[8px] font-bold shadow-soft">
                            ✓ Đã mua
                          </div>
                        )}

                        <div className="aspect-[5/7] overflow-hidden bg-muted relative">
                          {b.isAdvanced ? (
                            <BookCover
                              book={b}
                              badge={`Nâng cao · Lớp ${b.grade}`}
                            />
                          ) : (
                            <div
                              className={`relative w-full h-full bg-gradient-to-br ${b.gradient} overflow-hidden flex items-center justify-center`}
                            >
                              <PatternSvg pattern={b.pattern} />
                              <div className="absolute top-0 left-0 right-0 h-1 bg-white/20" />
                              <div className="absolute top-0 left-1.5 bottom-0 w-0.5 bg-white/10" />
                              <div className="size-16 md:size-20 rounded-full bg-white/95 backdrop-blur shadow-card flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                {b.emoji}
                              </div>
                              <div className="absolute inset-x-0 bottom-0 px-2 py-1.5 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end">
                                <div className="text-white text-[9px] font-bold tracking-wide">
                                  SÁCH BÀI TẬP SGK
                                </div>
                                <div className="text-white/80 text-[8px]">
                                  NXB Giáo dục Việt Nam
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-3 flex flex-col flex-1">
                          <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
                            {b.subject}
                          </div>
                          <div className="font-bold text-xs md:text-sm leading-snug mt-1 line-clamp-2 min-h-[2.5rem] text-foreground">
                            {b.title}
                          </div>
                          <div className="mt-2.5 flex items-center justify-between gap-1 flex-wrap pt-2 border-t border-border/40">
                            <span className="font-display font-bold text-primary text-sm">
                              {b.isAdvanced ? formatVND(b.price) : "Miễn phí"}
                            </span>
                            {b.isAdvanced ? (
                              b.owned ? (
                                <button className="inline-flex items-center gap-0.5 text-[10px] font-bold text-success hover:underline">
                                  Mở sách →
                                </button>
                              ) : (
                                <button className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary hover:text-primary-foreground transition-colors">
                                  <ShoppingCart className="size-3" /> Mua
                                </button>
                              )
                            ) : b.subject === "Khoa học" ||
                              b.subject === "Toán" ? (
                              <Link
                                to={
                                  b.subject === "Khoa học"
                                    ? "/sach/khoa-hoc-4"
                                    : "/sach/toan-4"
                                }
                                className="inline-flex items-center gap-0.5 text-[10px] font-bold text-primary hover:underline"
                              >
                                Mở sách →
                              </Link>
                            ) : (
                              <button
                                className="inline-flex items-center gap-0.5 text-[10px] font-bold text-primary hover:underline opacity-60 cursor-not-allowed"
                                disabled
                              >
                                Sắp ra mắt
                              </button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Empty state when no books match filter */}
            {filteredBooks.length === 0 && (
              <div className="text-center py-16 bg-card/40 border-2 border-dashed border-border rounded-3xl p-8 max-w-md mx-auto">
                <div className="text-4xl mb-3">🔍</div>
                <h4 className="font-display font-bold text-lg text-foreground">
                  Không tìm thấy sách phù hợp
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Không có sách nào khớp với các môn học bạn đã chọn. Vui lòng
                  chọn môn khác hoặc xóa bộ lọc.
                </p>
                <button
                  onClick={() => setSelectedSubjects([])}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-soft transition hover:opacity-90 animate-wiggle"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-border bg-card mt-auto pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-border/60">
            {/* Cột 1: Thông tin NXBGDVN */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-fun flex items-center justify-center text-white text-xs font-extrabold shadow-soft">
                  GD
                </div>
                <h4 className="font-display font-bold text-sm tracking-tight text-foreground uppercase">
                  NXB Giáo Dục Việt Nam
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Nhà xuất bản hàng đầu phục vụ sự nghiệp giáo dục, nâng cao dân
                trí và phát triển nhân lực tại Việt Nam.
              </p>
              <div className="space-y-2.5 text-xs text-foreground/80">
                <div className="flex items-start gap-2">
                  <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>Số 81 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-primary shrink-0" />
                  <span>024.3822.0801 - Fax: 024.3942.2012</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-primary shrink-0" />
                  <a
                    href="mailto:lienhe@nxbgd.vn"
                    className="hover:text-primary transition-colors"
                  >
                    lienhe@nxbgd.vn
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="size-4 text-primary shrink-0" />
                  <a
                    href="https://www.nxbgd.vn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    www.nxbgd.vn
                  </a>
                </div>
              </div>
            </div>

            {/* Cột 2: Đơn vị phát hành Miền Bắc */}
            <div className="space-y-4">
              <h4 className="font-display font-bold text-sm tracking-tight text-primary uppercase pb-1 border-b border-border/40">
                Phát hành Miền Bắc
              </h4>
              <div className="space-y-3">
                <h5 className="font-bold text-xs text-foreground/90">
                  Công ty CP Sách & Thiết bị Giáo dục Miền Bắc
                </h5>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="size-3.5 text-muted-foreground/60 shrink-0 mt-0.5" />
                    <span>232 Tây Sơn, Đống Đa, Hà Nội</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-3.5 text-muted-foreground/60 shrink-0" />
                    <span>024.3852.1706</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-3.5 text-muted-foreground/60 shrink-0" />
                    <a
                      href="mailto:mienbac@nxbgd.vn"
                      className="hover:text-primary transition-colors"
                    >
                      mienbac@nxbgd.vn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột 3: Đơn vị phát hành Miền Trung */}
            <div className="space-y-4">
              <h4 className="font-display font-bold text-sm tracking-tight text-primary uppercase pb-1 border-b border-border/40">
                Phát hành Miền Trung
              </h4>
              <div className="space-y-3">
                <h5 className="font-bold text-xs text-foreground/90">
                  Công ty CP Sách & Thiết bị Giáo dục Miền Trung
                </h5>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="size-3.5 text-muted-foreground/60 shrink-0 mt-0.5" />
                    <span>78 Pasteur, Hải Châu, Đà Nẵng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-3.5 text-muted-foreground/60 shrink-0" />
                    <span>0236.382.1157</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-3.5 text-muted-foreground/60 shrink-0" />
                    <a
                      href="mailto:mientrung@nxbgd.vn"
                      className="hover:text-primary transition-colors"
                    >
                      mientrung@nxbgd.vn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột 4: Đơn vị phát hành Miền Nam */}
            <div className="space-y-4">
              <h4 className="font-display font-bold text-sm tracking-tight text-primary uppercase pb-1 border-b border-border/40">
                Phát hành Miền Nam
              </h4>
              <div className="space-y-3">
                <h5 className="font-bold text-xs text-foreground/90">
                  Công ty CP Sách & Thiết bị Giáo dục Miền Nam
                </h5>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="size-3.5 text-muted-foreground/60 shrink-0 mt-0.5" />
                    <span>240 Trần Bình Trọng, Quận 5, TP. Hồ Chí Minh</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-3.5 text-muted-foreground/60 shrink-0" />
                    <span>028.3835.3448</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-3.5 text-muted-foreground/60 shrink-0" />
                    <a
                      href="mailto:miennam@nxbgd.vn"
                      className="hover:text-primary transition-colors"
                    >
                      miennam@nxbgd.vn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 text-center text-xs text-muted-foreground leading-relaxed">
            © NXBGDVNVN · Hệ thống sách giáo khoa bài tập tích hợp AI hỗ trợ
            phát triển năng lực số
          </div>
        </div>
      </footer>
    </div>
  );
}

function Badge({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border-2 border-border">
      <Icon className="size-4 text-primary" />
      <span className="font-medium">{text}</span>
    </div>
  );
}
