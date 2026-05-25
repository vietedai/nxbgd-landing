import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import coverToan from "@/assets/bia-sach/lop-4-toan-tap-1.webp";
import {
  ArrowLeft,
  BookOpen,
  QrCode,
  Sparkles,
  Users,
  Award,
  Check,
  PlayCircle,
  Calculator,
  Triangle,
  Hash,
  Ruler,
  Plus,
  Square,
  RefreshCw,
  Star,
  Smartphone,
  Target,
  Brain,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/sach/toan-4")({
  head: () => ({
    meta: [
      {
        title: "Vở bài tập Toán 4 — Tích hợp phát triển năng lực số | NXBGDVN",
      },
      {
        name: "description",
        content:
          "Vở bài tập Toán lớp 4 — 37 bài học, 7 chủ đề bám sát SGK, tích hợp mã QR học liệu điện tử và bài tập tương tác AI.",
      },
      { property: "og:title", content: "Vở bài tập Toán 4 — NXBGDVNVN" },
      {
        property: "og:description",
        content: "Bám sát SGK, 37 bài học, 7 chủ đề, tích hợp năng lực số.",
      },
    ],
  }),
  component: BookIntroPage,
});

const TOPICS = [
  {
    id: 1,
    title: "Ôn tập và bổ sung",
    icon: RefreshCw,
    color: "from-info to-primary",
    bg: "bg-info/10",
    text: "text-info",
    lessons: [
      "Ôn tập các số đến 100 000",
      "Ôn tập các phép tính trong phạm vi 100 000",
      "Số chẵn, số lẻ",
      "Biểu thức chứa chữ",
      "Giải bài toán có ba bước tính",
      "Luyện tập chung",
    ],
  },
  {
    id: 2,
    title: "Góc và đơn vị đo góc",
    icon: Triangle,
    color: "from-warning to-fun",
    bg: "bg-warning/10",
    text: "text-warning-foreground",
    lessons: [
      "Đo góc, đơn vị đo góc",
      "Góc nhọn, góc tù, góc bẹt",
      "Luyện tập chung",
    ],
  },
  {
    id: 3,
    title: "Số có nhiều chữ số",
    icon: Hash,
    color: "from-primary to-info",
    bg: "bg-primary/10",
    text: "text-primary",
    lessons: [
      "Số có sáu chữ số. Số 1 000 000",
      "Hàng và lớp",
      "Các số trong phạm vi lớp triệu",
      "Làm tròn số đến hàng trăm nghìn",
      "So sánh các số có nhiều chữ số",
      "Làm quen với dãy số tự nhiên",
      "Luyện tập chung",
    ],
  },
  {
    id: 4,
    title: "Một số đơn vị đo đại lượng",
    icon: Ruler,
    color: "from-success to-info",
    bg: "bg-success/10",
    text: "text-success",
    lessons: [
      "Yến, tạ, tấn",
      "Đề-xi-mét vuông, mét vuông, mi-li-mét vuông",
      "Giây, thế kỉ",
      "Thực hành và trải nghiệm sử dụng một số đơn vị đo đại lượng",
      "Luyện tập chung",
    ],
  },
  {
    id: 5,
    title: "Phép cộng và phép trừ",
    icon: Plus,
    color: "from-destructive to-fun",
    bg: "bg-destructive/10",
    text: "text-destructive",
    lessons: [
      "Phép cộng các số có nhiều chữ số",
      "Phép trừ các số có nhiều chữ số",
      "Tính chất giao hoán và kết hợp của phép cộng",
      "Tìm hai số biết tổng và hiệu của hai số đó",
      "Luyện tập chung",
    ],
  },
  {
    id: 6,
    title: "Đường thẳng vuông góc. Đường thẳng song song",
    icon: Square,
    color: "from-fun to-warning",
    bg: "bg-fun/10",
    text: "text-fun",
    lessons: [
      "Hai đường thẳng vuông góc",
      "Thực hành và trải nghiệm vẽ hai đường thẳng vuông góc",
      "Hai đường thẳng song song",
      "Thực hành và trải nghiệm vẽ hai đường thẳng song song",
      "Hình bình hành, hình thoi",
      "Luyện tập chung",
    ],
  },
  {
    id: 7,
    title: "Ôn tập học kì 1",
    icon: Calculator,
    color: "from-info to-success",
    bg: "bg-info/10",
    text: "text-info",
    lessons: [
      "Ôn tập các số đến lớp triệu",
      "Ôn tập phép cộng, phép trừ",
      "Ôn tập hình học",
      "Ôn tập đo lường",
      "Ôn tập chung",
    ],
  },
];

const FEATURES = [
  {
    icon: QrCode,
    title: "Mã QR học liệu số",
    desc: "Truy cập sách phiên bản số và bài tập tương tác qua mã QR ở từng bài.",
  },
  {
    icon: Brain,
    title: "23 kiểu tương tác",
    desc: "Trắc nghiệm, kéo thả, nối số, điền chỗ trống, quiz Kahoot…",
  },
  {
    icon: Sparkles,
    title: "AI gợi ý lời giải",
    desc: "Trợ lý AI hướng dẫn từng bước, gợi ý cách trình bày bài giải.",
  },
  {
    icon: Target,
    title: "Bám sát SGK",
    desc: "Đúng thứ tự bài học, củng cố kiến thức và phát triển năng lực.",
  },
  {
    icon: Award,
    title: "Gamification",
    desc: "Huy hiệu, XP, streak — học vui và động lực mỗi ngày.",
  },
  {
    icon: Smartphone,
    title: "Năng lực số",
    desc: "Phát triển kỹ năng công dân số ngay từ tiểu học.",
  },
];

function getLessonSlug(title: string) {
  if (title.includes("100 000") && !title.includes("phép tính"))
    return "toan-bai-1";
  if (title.includes("Biểu thức chứa chữ")) return "toan-bai-4";
  if (title.includes("Đo góc")) return "toan-bai-11";

  return (
    "toan-" +
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
  );
}

function BookIntroPage() {
  const totalLessons = TOPICS.reduce((s, t) => s + t.lessons.length, 0);

  const TOPIC_INDEX_THEMES = [
    { bg: "bg-sky-50 text-sky-600", hover: "group-hover/item:bg-sky-100 group-hover/item:text-sky-700" },
    { bg: "bg-emerald-50 text-emerald-600", hover: "group-hover/item:bg-emerald-100 group-hover/item:text-emerald-700" },
    { bg: "bg-purple-50 text-purple-600", hover: "group-hover/item:bg-purple-100 group-hover/item:text-purple-700" },
    { bg: "bg-amber-50 text-amber-600", hover: "group-hover/item:bg-amber-100 group-hover/item:text-amber-700" },
    { bg: "bg-pink-50 text-pink-600", hover: "group-hover/item:bg-pink-100 group-hover/item:text-pink-700" },
    { bg: "bg-cyan-50 text-cyan-600", hover: "group-hover/item:bg-cyan-100 group-hover/item:text-cyan-700" },
    { bg: "bg-indigo-50 text-indigo-600", hover: "group-hover/item:bg-indigo-100 group-hover/item:text-indigo-700" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/90 backdrop-blur sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
          >
            <ArrowLeft className="size-4" /> Về trang chủ
          </Link>
          <Link
            to="/student/lesson/$lessonId"
            params={{ lessonId: "toan-bai-1" }}
            className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2 text-sm font-bold text-white shadow-soft hover:bg-sky-600 hover:opacity-95 transition-all cursor-pointer"
          >
            <PlayCircle className="size-4" /> Vào học
          </Link>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-8 w-full animate-pop-in">
        <div className="grid gap-12 lg:grid-cols-[auto_1fr] lg:items-center">
          {/* Book Cover */}
          <div className="relative mx-auto lg:mx-0 w-full max-w-[280px]">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-sky-400/20 via-blue-500/10 to-teal-400/20 blur-2xl pointer-events-none" />
            <div className="rotate-[-3deg] rounded-2xl border border-slate-200/80 overflow-hidden shadow-card hover:rotate-0 transition-transform duration-300">
              <img
                src={coverToan}
                alt="Vở bài tập Toán 4"
                className="w-full h-auto block"
              />
            </div>
            <div className="absolute -top-3 -right-3 rotate-12 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400 text-amber-950 text-xs font-black shadow-md border-2 border-white">
              <Star className="size-3 fill-amber-950 animate-pulse" /> Mới · Lớp 4
            </div>
          </div>

          {/* Book core metadata */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs mb-4 shadow-sm border border-emerald-100">
              <Check className="size-3.5" /> Đã sở hữu · Bám sát SGK GDPT 2018
            </div>
            
            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 leading-none">
              TOÁN · LỚP 4 · TẬP MỘT
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-black mt-2 leading-tight text-slate-900 tracking-tight">
              Vở bài tập <span className="text-sky-500">Toán 4</span>
            </h1>

            <p className="mt-2 text-base sm:text-lg font-bold text-sky-500 tracking-wide">
              Tích hợp phát triển năng lực số
            </p>

            <p className="mt-4 text-slate-500 leading-relaxed max-w-2xl text-justify text-sm sm:text-[15px] font-medium">
              Cuốn Vở bài tập Toán 4 được biên soạn bám sát các chủ đề và bài học trong SGK Toán 4 (Chương trình GDPT 2018), giúp các em học sinh luyện tập và củng cố kiến thức một cách bài bản và hệ thống. Mỗi bài học có mã QR để học sinh truy cập học liệu điện tử, làm bài tập tương tác.
            </p>

            {/* Stats list */}
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-lg">
              <Stat value={`${TOPICS.length}`} label="Chủ đề" />
              <Stat value={`${totalLessons}`} label="Bài học" />
              <Stat value="250+" label="Bài tập" />
            </div>

            {/* Authors Capsule */}
            <div className="mt-6 flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-sky-100/80 shadow-xs max-w-2xl">
              <div className="size-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shrink-0 mt-0.5">
                <Users className="size-5" />
              </div>
              <div className="text-sm font-medium">
                <div className="font-bold text-slate-800">Nhóm tác giả</div>
                <div className="text-slate-500 mt-1 leading-snug">
                  Lê Anh Vinh (Chủ biên) - Hoàng Quế Hường - Vũ Văn Luân - Nguyễn Minh Hải - Đặng Thị Phương Anh
                </div>
                <div className="text-xs text-slate-400/90 mt-1.5 font-semibold">
                  Nhà xuất bản Giáo dục Việt Nam
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/student/lesson/$lessonId"
                params={{ lessonId: "toan-bai-1" }}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-soft hover:bg-sky-600 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <PlayCircle className="size-4.5" /> Bắt đầu học bài 1
              </Link>
              <a
                href="#muc-luc"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
              >
                <BookOpen className="size-4.5" /> Xem mục lục
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Preface Section (Lời nói đầu) */}
      <section className="max-w-7xl mx-auto px-6 pb-12 w-full">
        <Card className="p-6 sm:p-10 border border-slate-100 bg-white shadow-soft relative overflow-hidden rounded-2xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-sky-50 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-500 mb-4">
            <BookOpen className="size-4" /> LỜI NÓI ĐẦU
          </div>

          {/* Book-style italic greeting */}
          <p className="text-center text-xl font-bold italic text-slate-700 mb-6 font-display">
            Các em yêu quý!
          </p>

          {/* Main body - book typography */}
          <div className="text-slate-700 leading-[1.9] text-[15px] sm:text-base font-[450] space-y-0">
            <p className="mt-4 text-justify first:mt-0" style={{ textIndent: "2em" }}>
              Cuốn <strong>Vở bài tập Toán 4</strong> được biên soạn bám sát các chủ đề và bài học trong sách giáo khoa Toán 4 (theo <strong>Chương trình GDPT 2018</strong>), nhằm giúp các em luyện tập và củng cố những điều đã học một cách bài bản và hệ thống. Mỗi bài tập là một cơ hội để các em ôn lại kiến thức, rèn luyện sự cẩn thận và tính kiên trì.
            </p>
            <p className="mt-4 text-justify" style={{ textIndent: "2em" }}>
              Các dạng bài phong phú như lựa chọn đáp án, điền số, trình bày lời giải, thực hành và trải nghiệm sẽ giúp các em phát triển kĩ năng tính toán, suy luận và giải quyết vấn đề. Qua từng trang sách, các em sẽ nhận ra rằng Toán học không chỉ là những con số và phép tính mà còn gắn với những tình huống gần gũi trong cuộc sống hằng ngày.
            </p>
            <p className="mt-4 text-justify" style={{ textIndent: "2em" }}>
              Khi làm bài, các em hãy đọc kĩ yêu cầu, suy nghĩ và trình bày cẩn thận cách làm của mình. Nếu gặp bài khó, đừng vội nản lòng — mỗi lần thử lại và sửa sai là một lần các em tiến bộ hơn. Điều quan trọng không chỉ là đáp án đúng, mà là cách các em suy nghĩ để tìm ra lời giải.
            </p>
            <p className="mt-4 text-justify" style={{ textIndent: "2em" }}>
              Đặc biệt hơn nữa, thông qua cuốn vở bài tập này, các em còn có cơ hội phát triển <strong>năng lực số</strong>. Phụ huynh có thể cùng các em truy cập <strong>học liệu điện tử</strong> thông qua <strong>mã QR</strong> ở từng bài học để xem phiên bản số của sách và thực hiện các <strong>bài tập tương tác</strong> từ cơ bản đến nâng cao.
            </p>
            <p className="mt-5 text-justify" style={{ textIndent: "2em" }}>
              Hi vọng cuốn vở bài tập sẽ trở thành người bạn đồng hành thân thiết, giúp các em thêm tự tin, thêm yêu môn Toán và luôn giữ được niềm vui học tập. Chúc các em chăm chỉ và đạt nhiều thành công!
            </p>

            {/* Signature */}
            <p className="text-right italic pt-6 text-sm font-semibold text-slate-400">— Các tác giả</p>
          </div>
        </Card>
      </section>

      {/* Table of Contents Section (Mục lục) */}
      <section id="muc-luc" className="max-w-7xl mx-auto px-6 pb-12 w-full scroll-mt-20">
        <div className="text-xs font-bold uppercase tracking-widest text-sky-500">
          Nội dung học liệu
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-black mt-1 mb-1 text-slate-800 tracking-tight">
          Mục lục học liệu số
        </h2>
        <p className="text-slate-400 font-medium mb-8 text-sm sm:text-base">
          Bám sát cấu trúc phân phối chương trình chính thức — {TOPICS.length} chủ đề · {totalLessons} bài học
        </p>

        {/* 2-Column Grid of Topics Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {TOPICS.map((topic, topicIdx) => {
            const indexTheme = TOPIC_INDEX_THEMES[topicIdx % TOPIC_INDEX_THEMES.length];

            return (
              <Card
                key={topic.id}
                className="p-0 border border-slate-100 overflow-hidden hover:border-slate-200 hover:shadow-soft transition-all duration-300 flex flex-col h-full rounded-2xl group/card"
              >
                {/* Topic Header */}
                <div className={`bg-gradient-to-r ${topic.color} p-5 text-white flex items-center gap-4 shrink-0`}>
                  <div className="size-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                    <topic.icon className="size-5.5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none">
                      Chủ đề {topic.id}
                    </div>
                    <div className="font-display text-base sm:text-[17px] font-black leading-snug truncate mt-1">
                      {topic.title}
                    </div>
                  </div>
                  <div className="shrink-0 text-xs font-bold bg-white/20 backdrop-blur px-3 py-1 rounded-full whitespace-nowrap">
                    {topic.lessons.length} bài
                  </div>
                </div>

                {/* Lessons Rows List */}
                <ol className="divide-y divide-slate-100 flex-1 bg-white">
                  {topic.lessons.map((lesson, idx) => {
                    const lessonSlug = getLessonSlug(lesson);

                    return (
                      <Link
                        key={idx}
                        to="/sach/bai-hoc/$lessonId"
                        params={{ lessonId: lessonSlug }}
                        className="flex items-center gap-3.5 px-5 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer group/item"
                      >
                        <div
                          className={`size-7 rounded-full ${indexTheme.bg} ${indexTheme.hover} flex items-center justify-center text-[13px] font-extrabold shrink-0 transition-all`}
                        >
                          {idx + 1}
                        </div>
                        <div className="text-sm font-semibold flex-1 text-slate-700 group-hover/item:text-slate-900 transition-colors line-clamp-1">
                          {lesson}
                        </div>
                        <ChevronRight className="size-4 text-slate-400 shrink-0 group-hover/item:translate-x-0.5 transition-transform" />
                      </Link>
                    );
                  })}
                </ol>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Sẵn sàng chinh phục Section (Footer Call to Action) */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <Card className="p-8 sm:p-12 border border-slate-100 bg-gradient-to-br from-sky-500/10 via-sky-400/5 to-teal-500/5 text-center shadow-soft relative overflow-hidden rounded-2xl">
          <div className="absolute -inset-10 -z-10 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          
          <Sparkles className="size-10 text-sky-500 mx-auto mb-3 animate-pulse" />
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Sẵn sàng chinh phục Toán 4?
          </h2>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm sm:text-base font-semibold leading-relaxed">
            Bắt đầu với Bài 1 — Ôn tập các số đến 100 000, hoặc xem tổng quan tiến độ học tập của em.
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/student/lesson/$lessonId"
              params={{ lessonId: "toan-bai-1" }}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-soft hover:bg-sky-600 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <PlayCircle className="size-4.5" /> Vào học ngay
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <ArrowLeft className="size-4.5" /> Về trang chủ
            </Link>
          </div>
        </Card>
      </section>

      {/* Footer copyright section matching the mockup */}
      <footer className="mt-16 border-t border-slate-100 py-8 bg-slate-50/80">
        <div className="max-w-7xl mx-auto px-6 text-center text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
          © NXBGDVN - Vở bài tập Toán 4 (Tích hợp phát triển năng lực số)
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3.5 text-center shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft">
      <div className="font-display text-2xl sm:text-3xl font-black text-sky-500 leading-none">
        {value}
      </div>
      <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 mt-2 leading-none">
        {label}
      </div>
    </div>
  );
}

