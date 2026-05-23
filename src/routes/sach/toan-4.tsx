import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import coverToan from "@/assets/bia-sbt-toan-4.jpg";
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

function BookIntroPage() {
  const totalLessons = TOPICS.reduce((s, t) => s + t.lessons.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-info/5">
      {/* Header */}
      <header className="border-b-2 bg-card/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Về trang chủ
          </Link>
          <div className="flex-1" />
          <Link
            to="/student"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft hover:opacity-90"
          >
            <PlayCircle className="size-4" /> Vào học
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-10 pb-12 w-full">
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-center">
          {/* Book cover */}
          <div className="relative mx-auto lg:mx-0 w-full max-w-[280px]">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-primary/30 via-info/20 to-fun/30 blur-2xl" />
            <div className="rotate-[-3deg] rounded-2xl border-2 border-border overflow-hidden shadow-card hover:rotate-0 transition-transform duration-300">
              <img
                src={coverToan}
                alt="Bìa Vở bài tập Toán 4 - Tập một"
                className="w-full h-auto block"
              />
            </div>
            <div className="absolute -top-3 -right-3 rotate-12 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-warning text-warning-foreground text-xs font-bold shadow-soft border-2 border-card">
              <Star className="size-3 fill-current" /> Mới · Lớp 4
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/15 text-success font-bold text-xs mb-3">
              <Check className="size-3.5" /> Đã sở hữu · Bám sát SGK GDPT 2018
            </div>
            <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Toán · Lớp 4 · Tập một
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold mt-1 leading-tight">
              Vở bài tập <span className="text-primary">Toán 4</span>
            </h1>
            <p className="mt-2 text-base font-bold text-primary">
              Tích hợp phát triển năng lực số
            </p>

            <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
              Cuốn Vở bài tập Toán 4 được biên soạn bám sát các chủ đề và bài
              học trong SGK Toán 4 (Chương trình GDPT 2018), giúp các em luyện
              tập và củng cố kiến thức một cách bài bản và hệ thống. Mỗi bài học
              có mã QR để truy cập học liệu điện tử và bài tập tương tác.
            </p>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-3 max-w-lg">
              <Stat value={`${TOPICS.length}`} label="Chủ đề" />
              <Stat value={`${totalLessons}`} label="Bài học" />
              <Stat value="250+" label="Bài tập" />
            </div>

            {/* Authors */}
            <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-card border-2 border-border">
              <Users className="size-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-bold">Nhóm tác giả</div>
                <div className="text-muted-foreground">
                  Lê Anh Vinh (Chủ biên) · Hoàng Quế Hường · Vũ Văn Luân ·
                  Nguyễn Minh Hải · Đặng Thị Phương Anh
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Nhà xuất bản Giáo dục Việt Nam
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/student"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:opacity-90"
              >
                <PlayCircle className="size-4" /> Bắt đầu học bài 1
              </Link>
              <a
                href="#muc-luc"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-card px-5 py-3 text-sm font-bold hover:border-primary"
              >
                <BookOpen className="size-4" /> Xem mục lục
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lời nói đầu */}
      <section className="max-w-7xl mx-auto px-4 pb-12 w-full">
        <Card className="p-6 md:p-8 border-2 bg-gradient-to-br from-card to-primary/5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
            <BookOpen className="size-4" /> Lời nói đầu
          </div>
          <h2 className="font-display text-2xl font-bold">Các em yêu quý!</h2>
          <div className="mt-3 space-y-3 text-muted-foreground leading-relaxed text-[15px]">
            <p>
              Cuốn{" "}
              <strong className="text-foreground">Vở bài tập Toán 4</strong>{" "}
              được biên soạn bám sát các chủ đề và bài học trong sách giáo khoa
              Toán 4 (theo Chương trình GDPT mới), nhằm giúp các em luyện tập và
              củng cố những điều đã học một cách bài bản và hệ thống.
            </p>
            <p>
              Các dạng bài phong phú như lựa chọn đáp án, điền số, trình bày lời
              giải, thực hành và trải nghiệm sẽ giúp các em phát triển kĩ năng
              tính toán, suy luận và giải quyết vấn đề. Toán học không chỉ là
              những con số và phép tính mà còn gắn với những tình huống gần gũi
              trong cuộc sống hằng ngày.
            </p>
            <p>
              Đặc biệt, các em còn có cơ hội{" "}
              <strong className="text-foreground">
                phát triển năng lực số
              </strong>
              : truy cập học liệu điện tử qua mã QR ở từng bài học để xem phiên
              bản số của sách và thực hiện các bài tập tương tác từ cơ bản đến
              nâng cao.
            </p>
            <p className="text-right italic">— Các tác giả</p>
          </div>
        </Card>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 pb-12 w-full">
        <div className="text-xs font-bold uppercase tracking-wider text-primary">
          Điểm nổi bật
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-1 mb-6">
          Vì sao học sinh yêu thích cuốn sách này?
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card
              key={f.title}
              className="p-5 border-2 hover:border-primary transition-all hover:-translate-y-1"
            >
              <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <f.icon className="size-5 text-primary" />
              </div>
              <div className="font-bold">{f.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{f.desc}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Mục lục */}
      <section id="muc-luc" className="max-w-7xl mx-auto px-4 pb-16 w-full">
        <div className="text-xs font-bold uppercase tracking-wider text-primary">
          Nội dung
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-1 mb-1">
          Mục lục — {TOPICS.length} chủ đề · {totalLessons} bài học
        </h2>
        <p className="text-muted-foreground mb-6">
          Bám sát thứ tự sách giáo khoa Toán 4 — Tập một
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          {TOPICS.map((topic) => (
            <Card
              key={topic.id}
              className="p-0 border-2 overflow-hidden hover:border-primary transition-all"
            >
              <div className={`bg-gradient-to-r ${topic.color} p-5 text-white`}>
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-white/25 backdrop-blur flex items-center justify-center">
                    <topic.icon className="size-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-90">
                      Chủ đề {topic.id}
                    </div>
                    <div className="font-display text-xl font-bold">
                      {topic.title}
                    </div>
                  </div>
                  <div className="ml-auto text-xs font-bold bg-white/25 backdrop-blur px-2.5 py-1 rounded-full">
                    {topic.lessons.length} bài
                  </div>
                </div>
              </div>
              <ol className="divide-y">
                {topic.lessons.map((lesson, idx) => (
                  <li
                    key={lesson}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`size-7 rounded-lg ${topic.bg} ${topic.text} flex items-center justify-center text-xs font-bold shrink-0`}
                    >
                      {idx + 1}
                    </div>
                    <div className="text-sm font-medium flex-1">{lesson}</div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA cuối */}
      <section className="max-w-7xl mx-auto px-4 pb-16 w-full">
        <Card className="p-8 md:p-12 border-2 bg-gradient-to-br from-primary/10 via-info/10 to-fun/10 text-center">
          <Sparkles className="size-10 text-primary mx-auto mb-3" />
          <h2 className="font-display text-2xl md:text-3xl font-bold">
            Sẵn sàng chinh phục Toán 4?
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Bắt đầu với Bài 1 — Ôn tập các số đến 100 000, hoặc xem tổng quan
            tiến độ học tập của em.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              to="/student"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:opacity-90"
            >
              <PlayCircle className="size-4" /> Vào học ngay
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-card px-5 py-3 text-sm font-bold hover:border-primary"
            >
              <ArrowLeft className="size-4" /> Về trang chủ
            </Link>
          </div>
        </Card>
      </section>

      <footer className="border-t-2 bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-muted-foreground">
          © NXBGDVNVN · Vở bài tập Toán 4 (Tích hợp phát triển năng lực số)
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border-2 border-border bg-card p-3 text-center">
      <div className="font-display text-2xl font-bold text-primary">
        {value}
      </div>
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
