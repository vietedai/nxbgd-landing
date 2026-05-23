import { createFileRoute, Link } from "@tanstack/react-router";
import mascot from "@/assets/mascot-bee.png";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles } from "lucide-react";
import { TYPE_LABELS } from "@/components/interactions/QuestionRenderer";

export const Route = createFileRoute("/gioi-thieu")({
  head: () => ({
    meta: [
      {
        title:
          "Giới thiệu 23 kiểu câu hỏi tương tác | NXBGDVN - Sách bài tập (AI)",
      },
      {
        name: "description",
        content:
          "Khám phá 23 kiểu câu hỏi tương tác trong hệ thống Sách bài tập số NXBGDVN: từ trắc nghiệm cơ bản, kéo thả, ghép hình, Kahoot tới Adaptive AI.",
      },
      { property: "og:title", content: "23 kiểu câu hỏi tương tác — NXBGDVN" },
      {
        property: "og:description",
        content: "Đa dạng tương tác giúp học sinh học vui và hiệu quả hơn.",
      },
    ],
  }),
  component: GioiThieuPage,
});

type GroupKey = "basic" | "spatial" | "advanced" | "gamification" | "ai";

interface QTypeInfo {
  key: keyof typeof TYPE_LABELS;
  group: GroupKey;
  desc: string;
  preview: React.ReactNode;
}

const GROUPS: Record<
  GroupKey,
  { label: string; color: string; emoji: string }
> = {
  basic: {
    label: "Nhóm cơ bản",
    color: "from-primary/15 to-primary/5 border-primary/40",
    emoji: "📝",
  },
  spatial: {
    label: "Nhóm tương tác không gian",
    color: "from-info/15 to-info/5 border-info/40",
    emoji: "🧩",
  },
  advanced: {
    label: "Nhóm nâng cao học tập",
    color: "from-success/15 to-success/5 border-success/40",
    emoji: "🎯",
  },
  gamification: {
    label: "Nhóm Gamification",
    color: "from-fun/15 to-fun/5 border-fun/40",
    emoji: "🎮",
  },
  ai: {
    label: "Nhóm AI nâng cao",
    color: "from-warning/20 to-warning/5 border-warning/50",
    emoji: "🤖",
  },
};

// Mini preview components — dạng "ảnh chụp" giả lập từng loại
const QTYPES: QTypeInfo[] = [
  {
    key: "single_choice",
    group: "basic",
    desc: "Học sinh chọn 1 đáp án đúng duy nhất từ danh sách. Phù hợp kiểm tra nhanh khái niệm, định nghĩa.",
    preview: (
      <PreviewChoices
        items={[
          { t: "Trái Đất", ok: true },
          { t: "Sao Hỏa" },
          { t: "Mặt Trăng" },
        ]}
      />
    ),
  },
  {
    key: "multiple_choice",
    group: "basic",
    desc: "Học sinh chọn nhiều đáp án đúng cùng lúc. Đánh giá hiểu biết toàn diện về một chủ đề.",
    preview: (
      <PreviewChoices
        multi
        items={[
          { t: "Nước", ok: true },
          { t: "Lửa" },
          { t: "Không khí", ok: true },
          { t: "Đất", ok: true },
        ]}
      />
    ),
  },
  {
    key: "true_false",
    group: "basic",
    desc: "Câu hỏi nhanh dạng đúng/sai. Thích hợp để mở đầu bài hoặc kiểm tra phản xạ.",
    preview: (
      <div className="flex gap-2">
        <div className="flex-1 rounded-lg border-2 border-success bg-success/15 px-3 py-2 text-sm font-bold text-success text-center">
          ✓ Đúng
        </div>
        <div className="flex-1 rounded-lg border-2 border-border bg-card px-3 py-2 text-sm font-bold text-muted-foreground text-center">
          ✗ Sai
        </div>
      </div>
    ),
  },
  {
    key: "fill_blank",
    group: "basic",
    desc: "Điền từ/số vào chỗ trống trong câu. Rèn luyện ngữ pháp, công thức, định nghĩa.",
    preview: (
      <div className="text-sm leading-relaxed">
        Nước sôi ở{" "}
        <span className="inline-block min-w-[3rem] border-b-2 border-primary text-primary font-bold text-center">
          100
        </span>
        °C ở áp suất{" "}
        <span className="inline-block min-w-[5rem] border-b-2 border-dashed border-muted-foreground" />
        .
      </div>
    ),
  },
  {
    key: "short_answer",
    group: "basic",
    desc: "Trả lời ngắn 1–2 câu. So khớp linh hoạt với từ khóa và đồng nghĩa.",
    preview: (
      <div className="rounded-lg border-2 border-border bg-card p-2 text-sm text-muted-foreground italic">
        "Vì hơi nước bay lên gặp lạnh ngưng tụ thành mây..."
      </div>
    ),
  },
  {
    key: "essay",
    group: "ai",
    desc: "Tự luận dài, được AI chấm theo thang điểm tiêu chí. Trả về nhận xét chi tiết, gợi ý cải thiện.",
    preview: (
      <div className="space-y-1.5">
        <div className="rounded-lg border-2 border-border bg-card p-2 text-xs text-muted-foreground italic">
          Bài làm của em...
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-warning/20 text-warning-foreground font-bold">
            🤖 AI: 8.5/10
          </span>
          <span className="text-muted-foreground">· Ý tưởng tốt</span>
        </div>
      </div>
    ),
  },
  {
    key: "math_input",
    group: "basic",
    desc: "Nhập kết quả số học. Hỗ trợ phân số, đơn vị đo, dung sai sai số nhỏ.",
    preview: (
      <div className="flex items-center gap-2 text-sm">
        <span>3 × 12 + 5 =</span>
        <div className="rounded-lg border-2 border-primary bg-primary/10 px-3 py-1 font-bold text-primary font-mono">
          41
        </div>
      </div>
    ),
  },
  {
    key: "code_input",
    group: "basic",
    desc: "Nhập đoạn code (Scratch, Python). Tự động chấm theo test case.",
    preview: (
      <pre className="rounded-lg bg-foreground text-background p-2 text-[11px] font-mono leading-tight">
        {`for i in range(5):
  print(i * 2)`}
      </pre>
    ),
  },
  {
    key: "drag_drop",
    group: "spatial",
    desc: "Kéo thả các thẻ vào đúng vùng/danh mục. Trực quan cho phân loại, sắp xếp.",
    preview: (
      <div className="grid grid-cols-2 gap-1.5">
        <div className="rounded-md border-2 border-dashed border-primary bg-primary/10 p-1.5 text-[10px] font-bold text-primary text-center">
          Động vật
        </div>
        <div className="rounded-md border-2 border-dashed border-success bg-success/10 p-1.5 text-[10px] font-bold text-success text-center">
          Thực vật
        </div>
        <div className="rounded-md bg-card border-2 px-1.5 py-1 text-[10px] font-bold text-center">
          🐱 Mèo
        </div>
        <div className="rounded-md bg-card border-2 px-1.5 py-1 text-[10px] font-bold text-center">
          🌳 Cây
        </div>
      </div>
    ),
  },
  {
    key: "matching",
    group: "spatial",
    desc: "Nối cặp giữa hai cột tương ứng. Phù hợp từ vựng, định nghĩa, hình–tên.",
    preview: (
      <div className="text-xs space-y-1">
        {[
          ["Cá", "🐟"],
          ["Chim", "🐦"],
          ["Voi", "🐘"],
        ].map(([a, b]) => (
          <div key={a} className="flex items-center gap-2">
            <span className="flex-1 rounded border-2 px-2 py-0.5 bg-card font-bold">
              {a}
            </span>
            <span className="text-primary">━━</span>
            <span className="flex-1 rounded border-2 px-2 py-0.5 bg-primary/10 font-bold text-center">
              {b}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: "ordering",
    group: "spatial",
    desc: "Sắp xếp các bước/sự kiện theo đúng thứ tự. Tốt cho quy trình, lịch sử.",
    preview: (
      <div className="space-y-1 text-xs">
        {["1. Bay hơi", "2. Ngưng tụ", "3. Mưa rơi", "4. Chảy về biển"].map(
          (s, i) => (
            <div
              key={s}
              className="flex items-center gap-2 rounded border-2 px-2 py-1 bg-card"
            >
              <span className="size-5 rounded bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="font-bold">{s.slice(3)}</span>
            </div>
          ),
        )}
      </div>
    ),
  },
  {
    key: "image_hotspot",
    group: "spatial",
    desc: "Chọn vùng/bộ phận chính xác trên hình ảnh. Phù hợp giải phẫu, bản đồ, sơ đồ.",
    preview: (
      <div className="relative aspect-[4/3] rounded-lg bg-gradient-to-br from-info/30 to-success/20 border-2">
        <div className="absolute top-3 left-4 size-6 rounded-full bg-success border-2 border-card animate-pulse flex items-center justify-center text-[10px] font-bold text-success-foreground">
          ✓
        </div>
        <div className="absolute bottom-4 right-6 size-5 rounded-full bg-primary/60 border-2 border-card" />
        <div className="absolute inset-x-0 bottom-1 text-center text-[10px] text-muted-foreground font-bold">
          Bấm vùng đúng
        </div>
      </div>
    ),
  },
  {
    key: "kahoot",
    group: "gamification",
    desc: "Quiz nhịp độ nhanh phong cách Kahoot, 4 phương án màu, tính điểm theo tốc độ.",
    preview: (
      <div className="grid grid-cols-2 gap-1.5">
        {[
          ["bg-destructive", "▲"],
          ["bg-info", "◆"],
          ["bg-warning", "●"],
          ["bg-success", "■"],
        ].map(([c, s]) => (
          <div
            key={c}
            className={`${c} text-white rounded-md p-2 text-center font-bold text-sm`}
          >
            {s}
          </div>
        ))}
      </div>
    ),
  },
  {
    key: "speed",
    group: "gamification",
    desc: "Ai nhanh hơn — đếm ngược, càng trả lời nhanh càng nhiều điểm thưởng.",
    preview: (
      <div className="text-center">
        <div className="font-display text-3xl font-bold text-destructive">
          ⏱ 03
        </div>
        <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
          giây còn lại
        </div>
        <div className="mt-1 inline-block px-2 py-0.5 rounded-full bg-warning/30 text-[10px] font-bold">
          +50 XP nhanh!
        </div>
      </div>
    ),
  },
  {
    key: "flashcard",
    group: "gamification",
    desc: "Lật thẻ ghi nhớ — mặt trước câu hỏi, mặt sau đáp án. Học từ vựng, công thức.",
    preview: (
      <div className="rounded-xl bg-gradient-to-br from-primary to-fun text-primary-foreground p-4 text-center shadow-card">
        <div className="text-[10px] uppercase tracking-wider opacity-80">
          Photosynthesis
        </div>
        <div className="font-display text-lg font-bold mt-1">Quang hợp</div>
        <div className="text-[10px] mt-1 opacity-70">↻ chạm để lật</div>
      </div>
    ),
  },
  {
    key: "leaderboard",
    group: "gamification",
    desc: "Đua top — bảng xếp hạng thời gian thực với bạn cùng lớp.",
    preview: (
      <div className="space-y-1 text-xs">
        {[
          ["🥇", "Minh", "1.250"],
          ["🥈", "Em", "1.180"],
          ["🥉", "Lan", "1.050"],
        ].map(([m, n, p]) => (
          <div
            key={n}
            className="flex items-center gap-2 rounded border-2 bg-card px-2 py-1"
          >
            <span>{m}</span>
            <span className="font-bold flex-1">{n}</span>
            <span className="text-primary font-bold">{p}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: "level",
    group: "gamification",
    desc: "Vượt màn — chinh phục từng level theo độ khó tăng dần, mở khóa thưởng.",
    preview: (
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((l) => (
          <div
            key={l}
            className={`size-8 rounded-lg flex items-center justify-center font-bold text-sm ${l <= 3 ? "bg-success text-success-foreground" : l === 4 ? "bg-warning text-warning-foreground animate-pulse" : "bg-muted text-muted-foreground"}`}
          >
            {l <= 3 ? "✓" : l}
          </div>
        ))}
      </div>
    ),
  },
  {
    key: "puzzle",
    group: "gamification",
    desc: "Ghép hình — hoàn thành các mảnh để khám phá hình ảnh kiến thức.",
    preview: (
      <div className="grid grid-cols-3 gap-0.5 aspect-square w-32 mx-auto">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-sm ${i === 4 ? "bg-muted" : `bg-gradient-to-br ${["from-primary to-fun", "from-success to-info", "from-warning to-destructive"][i % 3]}`}`}
          />
        ))}
      </div>
    ),
  },
  {
    key: "story",
    group: "gamification",
    desc: "Story-based — học theo cốt truyện, mỗi câu trả lời ảnh hưởng diễn biến.",
    preview: (
      <div className="rounded-lg border-2 bg-gradient-to-br from-fun/20 to-warning/20 p-2.5 text-xs">
        <div className="font-bold">🐝 Ong Chăm Chỉ:</div>
        <div className="text-muted-foreground italic mt-0.5">
          "Em hãy giúp tôi tìm đường về tổ qua khu rừng kiến thức..."
        </div>
      </div>
    ),
  },
  {
    key: "step_hint",
    group: "advanced",
    desc: "Gợi ý từng bước khi học sinh gặp khó — bóc tách bài toán, không lộ đáp án.",
    preview: (
      <div className="space-y-1 text-xs">
        <div className="rounded border-2 border-info bg-info/10 p-1.5">
          💡 Bước 1: Xác định dữ liệu đã cho
        </div>
        <div className="rounded border-2 border-dashed border-muted-foreground p-1.5 text-muted-foreground">
          💡 Bước 2: ...
        </div>
      </div>
    ),
  },
  {
    key: "explanation",
    group: "advanced",
    desc: "Hiển thị lời giải chi tiết sau khi học sinh nộp bài, kèm hình minh họa.",
    preview: (
      <div className="rounded-lg border-2 border-success bg-success/10 p-2 text-xs">
        <div className="font-bold text-success mb-1">✓ Giải thích:</div>
        <div className="text-foreground/80">
          Nước trong tự nhiên tồn tại ở 3 thể: rắn, lỏng, khí. Khi nhiệt độ thay
          đổi...
        </div>
      </div>
    ),
  },
  {
    key: "peer_compare",
    group: "advanced",
    desc: "So sánh đáp án với bạn cùng lớp (ẩn danh) để học từ cách giải khác.",
    preview: (
      <div className="text-xs space-y-1">
        <div className="rounded border-2 border-primary bg-primary/10 px-2 py-1">
          <b>Em:</b> Vì hơi nước ngưng tụ
        </div>
        <div className="rounded border-2 px-2 py-1 bg-card">
          <b className="text-muted-foreground">Bạn A:</b> Do gặp lạnh tạo mây
        </div>
      </div>
    ),
  },
  {
    key: "adaptive",
    group: "ai",
    desc: "Adaptive AI — câu hỏi tiếp theo tự động điều chỉnh theo năng lực hiện tại của học sinh.",
    preview: (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs">
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-3/5 bg-gradient-to-r from-success to-warning" />
          </div>
          <span className="font-bold text-warning-foreground">Trung bình</span>
        </div>
        <div className="text-[10px] text-muted-foreground">
          🤖 AI đang tăng độ khó cho em...
        </div>
      </div>
    ),
  },
];

function GioiThieuPage() {
  const grouped = (Object.keys(GROUPS) as GroupKey[]).map((g) => ({
    group: g,
    items: QTYPES.filter((q) => q.group === g),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-fun/5">
      {/* Header */}
      <header className="border-b-2 bg-card/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src={mascot}
              alt="NXBGDVN logo"
              className="size-10"
              width={40}
              height={40}
            />
            <div>
              <div className="font-display font-bold text-lg leading-tight">
                NXBGDVN
              </div>
              <div className="text-xs text-muted-foreground leading-tight">
                Sách bài tập (AI)
              </div>
            </div>
          </Link>
          <div className="flex-1" />
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-card px-4 py-2 text-sm font-bold hover:border-primary"
          >
            <ArrowLeft className="size-4" /> Về trang chủ
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warning/20 text-warning-foreground font-bold text-xs mb-4">
          <Sparkles className="size-4" /> 23 kiểu câu hỏi · 5 nhóm tương tác
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
          Giới thiệu các <span className="text-primary">kiểu câu hỏi</span>{" "}
          tương tác
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Hệ thống NXBGDVN - Sách bài tập (AI) hỗ trợ <b>23 kiểu câu hỏi</b>{" "}
          được phân thành 5 nhóm, giúp giáo viên thiết kế bài tập phong phú và
          học sinh học vui hơn, hiệu quả hơn.
        </p>
      </section>

      {/* Groups */}
      <section className="max-w-7xl mx-auto px-4 pb-16 space-y-12">
        {grouped.map(({ group, items }) => {
          const meta = GROUPS[group];
          return (
            <div key={group}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{meta.emoji}</span>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-primary">
                    {items.length} kiểu
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">
                    {meta.label}
                  </h2>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((q) => (
                  <Card
                    key={q.key}
                    className={`p-0 border-2 overflow-hidden hover:-translate-y-1 hover:shadow-card transition-all bg-gradient-to-br ${meta.color}`}
                  >
                    <div className="bg-card/60 backdrop-blur-sm p-4 min-h-[160px] flex items-center justify-center border-b-2 border-border/50">
                      <div className="w-full max-w-[240px]">{q.preview}</div>
                    </div>
                    <div className="p-4 bg-card">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        {meta.label}
                      </div>
                      <div className="font-bold text-base leading-tight mt-0.5">
                        {TYPE_LABELS[q.key]}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {q.desc}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-16 text-center">
        <Card className="p-8 border-2 bg-gradient-to-br from-primary/10 via-fun/10 to-warning/10">
          <h3 className="font-display text-2xl md:text-3xl font-bold">
            Sẵn sàng trải nghiệm?
          </h3>
          <p className="text-muted-foreground mt-2">
            Đăng nhập với vai trò Học sinh để làm thử các kiểu câu hỏi trên.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 justify-center">
            <Link
              to="/student"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:opacity-90"
            >
              Vào học ngay
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
          © NXBGDVNVN · Hệ thống sách giáo khoa bài tập (Tích hợp AI hỗ trợ phát
          triển năng lực số)
        </div>
      </footer>
    </div>
  );
}

function PreviewChoices({
  items,
  multi,
}: {
  items: { t: string; ok?: boolean }[];
  multi?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      {items.map((it) => (
        <div
          key={it.t}
          className={`flex items-center gap-2 rounded-lg border-2 px-2.5 py-1.5 text-xs ${it.ok ? "border-success bg-success/10" : "border-border bg-card"}`}
        >
          <div
            className={`size-4 ${multi ? "rounded" : "rounded-full"} border-2 ${it.ok ? "bg-success border-success" : "border-muted-foreground"} flex items-center justify-center`}
          >
            {it.ok && (
              <span className="text-success-foreground text-[10px] font-bold">
                ✓
              </span>
            )}
          </div>
          <span className="font-bold">{it.t}</span>
        </div>
      ))}
    </div>
  );
}
