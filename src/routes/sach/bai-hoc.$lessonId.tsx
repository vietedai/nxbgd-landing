import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import coverToan from "@/assets/bia-sach/lop-4-toan-tap-1.webp";
import coverKH from "@/assets/bia-sach/lop-4-khoa-hoc.webp";
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCw,
  BookOpenCheck,
  Info,
  FileText,
  CheckCircle2,
  Eye,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";
import { LESSONS } from "@/lib/mock-data";

export const Route = createFileRoute("/sach/bai-hoc/$lessonId")({
  head: ({ params }) => {
    const lessonInfo = getLessonStaticInfo(params.lessonId);
    return {
      meta: [
        {
          title: `${lessonInfo.title} | Học liệu điện tử NXBGDVN`,
        },
        {
          name: "description",
          content: `Xem sách giáo khoa PDF và làm bài tập số tương tác AI cho bài học: ${lessonInfo.title}.`,
        },
      ],
    };
  },
  component: LessonDetailPage,
});

// Utility to get metadata and mock PDF content for any lesson slug
function getLessonStaticInfo(lessonId: string) {
  const isMath = lessonId.startsWith("toan");

  // Find matching interactive lesson from LESSONS mock data
  let interactiveLessonId = "all-23";
  if (isMath) {
    if (lessonId.includes("100-000") || lessonId.includes("bai-1")) {
      interactiveLessonId = "toan-bai-1";
    } else if (lessonId.includes("bieu-thuc") || lessonId.includes("bai-4")) {
      interactiveLessonId = "toan-bai-4";
    } else if (lessonId.includes("do-goc") || lessonId.includes("bai-11")) {
      interactiveLessonId = "toan-bai-11";
    } else {
      interactiveLessonId = "toan-bai-1"; // Math fallback
    }
  } else {
    if (lessonId.includes("tinh-chat-cua-nuoc") || lessonId.includes("bai-1")) {
      interactiveLessonId = "bai-1";
    } else if (
      lessonId.includes("su-chuyen-the") ||
      lessonId.includes("bai-2")
    ) {
      interactiveLessonId = "bai-2";
    } else if (
      lessonId.includes("bao-ve-nguon-nuoc") ||
      lessonId.includes("bai-3")
    ) {
      interactiveLessonId = "bai-3";
    } else if (lessonId.includes("khong-khi") || lessonId.includes("bai-4")) {
      interactiveLessonId = "bai-4";
    } else if (lessonId.includes("gio-bao") || lessonId.includes("bai-6")) {
      interactiveLessonId = "bai-6";
    } else if (
      lessonId.includes("vai-tro-cua-anh-sang") ||
      lessonId.includes("bai-9")
    ) {
      interactiveLessonId = "bai-9";
    } else {
      interactiveLessonId = "bai-1"; // Science fallback
    }
  }

  const matchedInteractive = LESSONS.find((l) => l.id === interactiveLessonId);

  // Clean dynamic title from lesson ID if no exact match
  let title = matchedInteractive
    ? matchedInteractive.title.replace(/^Bài \d+:\s*/, "")
    : "Bài học ";
  if (!matchedInteractive) {
    // Humanize slug
    const cleanSlug = lessonId
      .replace(/^(toan|khoahoc)-/, "")
      .replace(/-/g, " ");
    title = cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1);
  }

  const topicName = isMath ? "Chủ đề 1: Ôn tập và bổ sung" : "Chủ đề 1: Chất";
  const bookName = isMath
    ? "Vở bài tập Toán 4 - Tập một"
    : "Vở bài tập Khoa học 4";
  const cover = isMath ? coverToan : coverKH;
  const authors = isMath
    ? "Lê Anh Vinh (Chủ biên) · Hoàng Quế Hường · Vũ Văn Luân · Nguyễn Minh Hải"
    : "Lý Vương Ngọc Minh (Chủ biên) · Phan Thanh Hà · Nguyễn Thị Thanh Phúc";

  // Rich textbook PDF Mock Content
  const pdfPages = isMath
    ? [
        {
          pageNum: 1,
          header: "1. ÔN TẬP CÁC SỐ ĐẾN 100 000 (Tiếp theo)",
          paragraphs: [
            "Để đọc số trong phạm vi 100 000, ta đọc từ trái sang phải, tương ứng từ hàng cao nhất đến hàng thấp nhất. Mỗi chữ số biểu diễn số lượng của hàng đó.",
            "Ví dụ: Số 45 236 gồm 4 chục nghìn, 5 nghìn, 2 trăm, 3 chục và 6 đơn vị. Đọc là: Bốn mươi lăm nghìn hai trăm ba mươi sáu.",
            "Ví dụ 2: Số 79 999 đọc là Bảy mươi chín nghìn chín trăm chín mươi chín. Số liền sau của số này là 80 000 (đạt được bằng cách cộng thêm 1 đơn vị).",
          ],
          exercise:
            "Khám phá: Dãy số tròn nghìn tăng dần: 12 000; 13 000; 14 000; 15 000; 16 000... Hãy viết số liền sau và số liền trước của các số này.",
          tip: "💡 Mẹo nhỏ của Ong Chăm Chỉ: Số tròn nghìn luôn có ít nhất ba chữ số 0 ở cuối cùng. Hàng trăm, hàng chục và hàng đơn vị đều bằng 0.",
        },
        {
          pageNum: 2,
          header: "Luyện tập & Thực hành",
          paragraphs: [
            "Bài tập 1: Viết theo mẫu:",
            "a) Số gồm 4 chục nghìn, 7 nghìn, 2 trăm và 5 đơn vị là số: 47 205.",
            "b) Số gồm 2 chục nghìn, 5 trăm và 7 chục là số: 20 570.",
            "Bài tập 2: So sánh các số sau:",
            "- Số 32 145 nhỏ hơn số 32 154 (vì hàng chục 4 bé hơn hàng chục 5).",
          ],
          exercise:
            "Câu đố vui: Tìm số lớn nhất có 5 chữ số khác nhau. (Gợi ý: Chọn các chữ số lớn nhất có thể xếp lần lượt từ hàng chục nghìn về hàng đơn vị: 9, 8, 7, 6, 5).",
          tip: "🎯 Thử thách AI: Click nút 'Làm bài tập số' bên cạnh để thử sức với 8 câu hỏi trắc nghiệm và điền số do AI tự động chấm điểm và phản hồi!",
        },
      ]
    : [
        {
          pageNum: 1,
          header: "BÀI 1: TÍNH CHẤT CỦA NƯỚC VÀ NƯỚC VỚI CUỘC SỐNG",
          paragraphs: [
            "Mục tiêu: Nhận biết được nước là chất lỏng không màu, không mùi, không vị, không có hình dạng cố định nhưng có hình dạng của vật chứa.",
            "Hoạt động 1: Quan sát một cốc nước lọc trong suốt và một cốc sữa. Hãy rút ra nhận xét về màu sắc, mùi và vị của nước.",
            "Nước chảy từ trên cao xuống thấp và lan ra mọi phía. Nước có thể thấm qua một số vật xốp như giấy, vải nhưng không thấm qua nhựa, cao su.",
            "Nước có khả năng hòa tan một số chất như muối ăn, đường tinh luyện nhưng không hòa tan dầu mỡ, cát đá.",
          ],
          exercise:
            "Thực hành tại nhà: Đổ nước lên mặt một tấm kính đặt nghiêng. Quan sát hướng chảy của dòng nước và rút ra nhận xét.",
          tip: "💡 Em có biết: Nhờ nước có tính chất chảy từ cao xuống thấp, người ta đã làm mái nhà có độ dốc nhất định để nước mưa tự động thoát nhanh mà không bị đọng lại gây thấm dột!",
        },
        {
          pageNum: 2,
          header: "Vận dụng thực tiễn & Năng lực số",
          paragraphs: [
            "Nước rửa bát được hòa tan hoàn toàn vào nước giúp làm loãng và tăng diện tích tiếp xúc tẩy rửa vết dầu mỡ. Đây chính là vận dụng tính chất hòa tan một số chất của nước.",
            "Khi dùng bọt biển lau bàn, nước ngấm vào các lỗ nhỏ của bọt biển (tính chất thấm qua một số vật). Găng tay cao su giúp giữ cho tay khô ráo vì nước không thấm qua cao su.",
          ],
          exercise:
            "Suy ngẫm: Vì sao sau khi rửa sạch mặt bằng nước và sữa rửa mặt, da mặt lại không còn cảm giác trơn dầu?",
          tip: "🎯 Trải nghiệm tương tác: Bài học này tích hợp 5 câu hỏi thông minh (đúng sai, nối chéo, điền từ vào chỗ trống). Hãy ấn nút làm bài tập số ở bên để tham gia làm bài ngay nhé!",
        },
      ];

  return {
    title,
    topicName,
    bookName,
    cover,
    authors,
    isMath,
    pdfPages,
    interactiveLessonId,
  };
}

function LessonDetailPage() {
  const { lessonId } = Route.useParams();
  const info = useMemo(() => getLessonStaticInfo(lessonId), [lessonId]);

  // State for PDF viewer
  const [viewMode, setViewMode] = useState<"pdf" | "summary">("pdf");
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHomeworkExpanded, setIsHomeworkExpanded] = useState(false);
  const [isPdfExpanded, setIsPdfExpanded] = useState(false);
  const [isPdfFullActive, setIsPdfFullActive] = useState(false);

  const currentPageContent = info.pdfPages[currentPage - 1] || info.pdfPages[0];

  const handleNextPage = () => {
    if (currentPage < info.pdfPages.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleZoomIn = () => {
    if (zoom < 150) setZoom((prev) => prev + 10);
  };

  const handleZoomOut = () => {
    if (zoom > 70) setZoom((prev) => prev - 10);
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-gradient-to-b from-primary/5 via-background to-info/5 overflow-x-hidden lg:overflow-hidden pb-4 lg:pb-0">
      {/* Header Navigation */}
      <header className="border-b-2 bg-card/85 backdrop-blur sticky top-0 z-40 h-16 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          <Link
            to={info.isMath ? "/sach/toan-4" : "/sach/khoa-hoc-4"}
            className="inline-flex items-center gap-2 text-sm md:text-base font-bold text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="size-4" /> Quay lại sách{" "}
            {info.isMath ? "Toán" : "Khoa học"}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {info.bookName}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 pt-4 flex-1 flex flex-col min-h-0 overflow-y-auto lg:overflow-hidden gap-3 pb-6 lg:pb-4">
        {/* Navigation Breadcrumb */}
        <div className="flex-shrink-0 flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
          <span>Học liệu số</span>
          <span>/</span>
          <span>{info.bookName}</span>
          <span>/</span>
          <span className="text-foreground font-bold">{info.title}</span>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch overflow-y-auto lg:overflow-hidden">
          {/* Left Column: Cover & Lesson metadata (size 4/12) */}
          <div className="lg:col-span-4 lg:h-full lg:overflow-y-auto pr-1 flex flex-col gap-4">
            <Card className="p-4 md:p-5 border-2 border-border/80 rounded-3xl bg-card shadow-soft space-y-4">
              {/* Premium Book Cover Container */}
              <div className="relative mx-auto w-full max-w-[130px]">
                <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/20 to-fun/20 blur-xl" />
                <div className="rotate-[-2deg] rounded-xl border-2 border-border overflow-hidden shadow-card transition-all hover:rotate-0 duration-300">
                  <img
                    src={info.cover}
                    alt={info.bookName}
                    className="w-full h-auto block"
                  />
                </div>
              </div>

              {/* Title & Description */}
              <div className="text-center lg:text-left space-y-1.5 border-t border-border/40 pt-3">
                <span className="text-xs font-black text-primary uppercase tracking-wider block">
                  {info.topicName}
                </span>
                <h1 className="font-display font-extrabold text-xl md:text-2xl text-foreground leading-tight">
                  {info.title}
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tài liệu học tập số tích hợp đa tương tác bám sát nội dung
                  Sách Giáo Khoa chuẩn của Bộ Giáo dục và Đào tạo.
                </p>
              </div>

              {/* Metadata list */}
              <div className="space-y-2 border-t border-border/40 pt-3 text-xs sm:text-sm font-medium">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground font-medium">
                    Khối lớp:
                  </span>
                  <span className="font-bold text-foreground">Lớp 4</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground font-medium">
                    Môn học:
                  </span>
                  <span className="font-bold text-foreground">
                    {info.isMath ? "Toán học" : "Khoa học tự nhiên"}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-muted-foreground font-medium shrink-0">
                    Nhóm tác giả:
                  </span>
                  <span className="font-bold text-foreground text-right leading-tight max-w-[200px] text-xs sm:text-sm">
                    {info.authors}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground font-medium">
                    Nhà xuất bản:
                  </span>
                  <span className="font-bold text-primary">
                    NXB Giáo Dục Việt Nam
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Practice Hub + PDF Viewer (size 8/12) */}
          <div className="lg:col-span-8 lg:h-full lg:overflow-y-auto pr-1 flex flex-col gap-4">
            
            {/* Hub 1: BÀI TẬP SỐ TƯƠNG TÁC */}
            {isHomeworkExpanded ? (
              /* EXPANDED Homework View */
              <Card className="p-5 md:p-6 border-2 border-primary/20 rounded-3xl bg-gradient-to-br from-card via-card to-primary/5 shadow-soft space-y-4 relative overflow-hidden flex-shrink-0 animate-pop-in">
                {/* Sparkle background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-fun/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start gap-4">
                  {/* Visual Icon Shield */}
                  <div className="size-12 rounded-2xl bg-gradient-to-br from-primary to-fun flex items-center justify-center text-white shadow-soft shrink-0">
                    <BookOpenCheck className="size-6" />
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary block">
                      Bản quyền tích hợp AI độc quyền
                    </span>
                    <h3 className="font-display font-extrabold text-lg md:text-xl text-foreground">
                      Vở Bài Tập Số Tương Tác
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Hệ thống bài tập số bám sát chuẩn kiến thức, tích hợp công
                      nghệ trí tuệ nhân tạo (AI) giúp chấm điểm tự động và hướng
                      dẫn chi tiết từng câu.
                    </p>
                  </div>
                </div>

                {/* Core Features bullets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-border/40 pt-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="size-4.5 text-success shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm font-medium">
                      <span className="font-bold text-foreground">
                        Chấm điểm tự động:
                      </span>{" "}
                      Biết ngay kết quả đúng/sai sau mỗi câu trả lời.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="size-4.5 text-success shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm font-medium">
                      <span className="font-bold text-foreground">
                        Phân tích AI Feedback:
                      </span>{" "}
                      Gợi ý lời giải chi tiết và nhắc lại kiến thức SGK.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="size-4.5 text-success shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm font-medium">
                      <span className="font-bold text-foreground">
                        Đa dạng tương tác:
                      </span>{" "}
                      Kéo thả, trắc nghiệm, ghép nối hình ảnh sinh động.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="size-4.5 text-success shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm font-medium">
                      <span className="font-bold text-foreground">
                        Học tập Gamification:
                      </span>{" "}
                      Tích lũy điểm XP, Streak và vinh danh bảng xếp hạng.
                    </div>
                  </div>
                </div>

                {/* CTA Action button area */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-4">
                  <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 flex-grow">
                    <Info className="size-4 text-primary shrink-0" />
                    <span>
                      Bài tập gồm các câu hỏi từ dễ đến khó phù hợp mọi đối tượng
                      học sinh.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsHomeworkExpanded(false)}
                      className="px-4 py-2.5 text-xs sm:text-sm font-bold text-primary hover:bg-primary/10 rounded-xl border border-primary/20 transition-all cursor-pointer"
                    >
                      Thu gọn chi tiết
                    </button>
                    <Link
                      to="/student/lesson/$lessonId"
                      params={{ lessonId: info.interactiveLessonId }}
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-fun px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-soft transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <PlayCircle className="size-4.5" /> Vào làm bài tập số
                    </Link>
                  </div>
                </div>
              </Card>
            ) : (
              /* COLLAPSED Homework View */
              <Card className="p-3 md:p-4 border-2 border-primary/20 rounded-2xl bg-gradient-to-r from-card to-primary/5 shadow-soft flex items-center justify-between gap-4 transition-all">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-fun flex items-center justify-center text-white shadow-soft shrink-0">
                    <BookOpenCheck className="size-5" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary block">
                      Bản quyền tích hợp AI độc quyền
                    </span>
                    <h3 className="font-display font-extrabold text-base text-foreground">
                      Vở Bài Tập Số Tương Tác
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsHomeworkExpanded(true)}
                    className="px-3.5 py-2 text-xs sm:text-sm font-bold text-primary hover:bg-primary/10 rounded-xl border border-primary/20 transition-all cursor-pointer"
                  >
                    Chi tiết bài tập
                  </button>
                  <Link
                    to="/student/lesson/$lessonId"
                    params={{ lessonId: info.interactiveLessonId }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-fun px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-soft transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <PlayCircle className="size-4" /> Vào làm bài tập số
                  </Link>
                </div>
              </Card>
            )}

            {/* Hub 2: SÁCH GIÁO KHOA PDF & TÓM TẮT BÀI HỌC (Collapsible Inline Viewer) */}
            {isPdfExpanded ? (
              /* EXPANDED PDF & Summary View */
              <Card className="border-2 border-border/80 rounded-3xl bg-card shadow-soft overflow-hidden flex flex-col animate-pop-in h-[580px] shrink-0">
                {/* PDF Viewer Header Toolbar */}
                <div className="bg-slate-50 border-b border-border/60 px-4 py-3 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
                  {/* Mode Selector Tabs */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setViewMode("pdf")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        viewMode === "pdf"
                          ? "bg-primary text-primary-foreground shadow-soft"
                          : "hover:bg-slate-200/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <BookOpen className="size-4" />
                      <span>Sách giáo khoa PDF</span>
                    </button>
                    <button
                      onClick={() => setViewMode("summary")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        viewMode === "summary"
                          ? "bg-primary text-primary-foreground shadow-soft"
                          : "hover:bg-slate-200/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <FileText className="size-4" />
                      <span>Tóm tắt bài học</span>
                    </button>
                  </div>

                  {/* Mode Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPdfFullActive(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-sm"
                      title="Toàn màn hình"
                    >
                      <Maximize2 className="size-3.5" />
                      <span className="hidden sm:inline">Toàn màn hình</span>
                    </button>
                    <button
                      onClick={() => setIsPdfExpanded(false)}
                      className="px-3.5 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 rounded-xl border border-destructive/20 transition-all cursor-pointer"
                    >
                      Thu gọn
                    </button>
                  </div>
                </div>

                {/* PDF Viewer Body */}
                <div className="flex-1 min-h-0 flex flex-col bg-slate-100 relative">
                  {viewMode === "pdf" ? (
                    <iframe
                      src="/Bai_08_Xu_li_bat_hoa_voi_ban_be.pdf"
                      className="w-full h-full border-0 bg-white"
                      title="Sách Giáo Khoa PDF"
                    />
                  ) : (
                    <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 flex justify-center items-start">
                      <Card className="w-full max-w-2xl bg-[#FCFAF2] border border-amber-950/15 shadow-card p-6 md:p-8 rounded-2xl relative select-none text-foreground/90 transition-all">
                        {/* Spine Shadow Effect */}
                        <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/5 to-transparent rounded-l-2xl pointer-events-none" />

                        <div className="space-y-4">
                          {/* Book info header */}
                          <div className="border-b border-amber-900/10 pb-2 flex justify-between items-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-800/80">
                            <span>BỘ SÁCH GIÁO KHOA KẾT NỐI TRI THỨC VỚI CUỘC SỐNG</span>
                            <span>Trang {currentPage + 5}</span>
                          </div>

                          {/* Lesson title inside book */}
                          <h3 className="font-display font-black text-lg md:text-xl text-amber-950 border-l-4 border-amber-700 pl-3 leading-snug py-0.5">
                            {currentPageContent.header}
                          </h3>

                          {/* Paragraphs */}
                          <div className="space-y-3.5 text-sm md:text-base leading-relaxed text-amber-950/80 font-medium text-justify">
                            {currentPageContent.paragraphs.map((p, idx) => (
                              <p key={idx}>{p}</p>
                            ))}
                          </div>

                          {/* Interactive workbook exercise section */}
                          <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200/60 shadow-inner">
                            <h4 className="font-display font-bold text-sm text-amber-900 flex items-center gap-1.5 mb-1">
                              <FileText className="size-3.5 text-amber-700" />
                              Hoạt động Luyện tập trong SGK:
                            </h4>
                            <p className="text-sm text-amber-900/85 leading-relaxed font-medium text-justify">
                              {currentPageContent.exercise}
                            </p>
                          </div>

                          {/* Tip block */}
                          <div className="mt-3.5 p-3.5 rounded-xl bg-orange-100/50 border border-orange-200/50">
                            <p className="text-sm text-orange-950 font-semibold leading-relaxed italic text-justify">
                              {currentPageContent.tip}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>

                {/* PDF Footer Toolbar (Pagination controls for Summary mode) */}
                {viewMode === "summary" && (
                  <div className="bg-card border-t border-border/60 px-4 py-3 flex items-center justify-between gap-4 flex-shrink-0">
                    <span className="text-sm font-bold text-muted-foreground">
                      Trang {currentPage} / {info.pdfPages.length}
                    </span>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`px-3.5 py-1.5 rounded-xl border border-border text-sm font-bold flex items-center gap-1.5 transition-all ${
                          currentPage === 1
                            ? "opacity-40 cursor-not-allowed text-muted-foreground"
                            : "hover:bg-muted text-foreground cursor-pointer shadow-sm bg-white"
                        }`}
                      >
                        <ChevronLeft className="size-4" /> Trang trước
                      </button>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === info.pdfPages.length}
                        className={`px-3.5 py-1.5 rounded-xl border border-border text-sm font-bold flex items-center gap-1.5 transition-all ${
                          currentPage === info.pdfPages.length
                            ? "opacity-40 cursor-not-allowed text-muted-foreground"
                            : "hover:bg-muted text-foreground cursor-pointer shadow-sm bg-white"
                        }`}
                      >
                        Trang sau <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              /* COLLAPSED PDF View */
              <Card className="p-3 md:p-4 border-2 border-border/80 rounded-2xl bg-card shadow-soft flex items-center justify-between gap-4 transition-all hover:border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 animate-wiggle">
                    <BookOpen className="size-5" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground block">
                      Tài liệu tự học
                    </span>
                    <h3 className="font-display font-extrabold text-base text-foreground">
                      Sách Giáo Khoa PDF &amp; Tóm tắt bài học
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPdfExpanded(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-bold text-primary-foreground shadow-soft transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <BookOpen className="size-4" /> Mở rộng đọc sách
                  </button>
                </div>
              </Card>
            )}

            {/* Hub 3: SMART LEARNING AI PROMPT WIDGET - Structured Premium Checklist */}
            <Card className="p-5 md:p-6 border-2 border-warning/30 rounded-3xl bg-warning/5 shadow-soft relative overflow-hidden flex flex-col gap-4">
              {/* Soft ambient background glow */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-warning/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2.5">
                <div className="size-8.5 rounded-xl bg-warning/15 text-warning-foreground flex items-center justify-center shrink-0 shadow-sm border border-warning/10">
                  <Sparkles className="size-4.5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-display font-black text-sm text-warning-foreground uppercase tracking-wider leading-none">
                    Hướng dẫn học hiệu quả
                  </h4>
                  <p className="text-[10px] sm:text-xs font-bold text-muted-foreground mt-0.5">
                    Đồng hành học tập chuẩn năng lực số cùng Trợ lý Ong Chăm Chỉ
                  </p>
                </div>
              </div>

              {/* Step-by-Step structured workflow */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-warning/20 pt-4">
                {/* Step 1 */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-white/40 border border-warning/10 shadow-xs flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="size-6 rounded-full bg-warning/20 text-warning-foreground flex items-center justify-center text-xs font-black shrink-0">
                      1
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-800">
                      Làm bài tập số trước
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed flex-1">
                    Nhấn nút <strong className="font-bold text-slate-700">Vào làm bài tập số</strong> (phía trên) để làm các câu hỏi trắc nghiệm, kéo thả, ghép hình... AI sẽ chấm điểm và hướng dẫn giải ngay!
                  </p>
                </div>

                {/* Step 2 */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-white/40 border border-warning/10 shadow-xs flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="size-6 rounded-full bg-warning/20 text-warning-foreground flex items-center justify-center text-xs font-black shrink-0">
                      2
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-800">
                      Tra cứu lý thuyết
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed flex-1">
                    Nhấn nút <strong className="font-bold text-slate-700">Mở rộng đọc sách</strong> (bên dưới) để xem trực quan sách giáo khoa PDF gốc hoặc đọc bản <strong className="font-bold text-slate-700">Tóm tắt bài học</strong> cô đọng.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-white/40 border border-warning/10 shadow-xs flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="size-6 rounded-full bg-warning/20 text-warning-foreground flex items-center justify-center text-xs font-black shrink-0">
                      3
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-800">
                      Ong Chăm Chỉ gợi ý
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed flex-1">
                    Hãy xem lại các phân tích, nhắc lại kiến thức của AI sau mỗi bài làm để khắc sâu kiến thức lâu hơn và xây dựng lộ trình học tập cá nhân hóa.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Immersive Full Screen PDF Viewer Modal */}
      {isPdfFullActive && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
          <div className="relative w-full max-w-6xl h-[95vh] sm:h-[90vh] bg-card rounded-3xl border border-border/80 shadow-2xl overflow-hidden flex flex-col animate-pop-in">
            {/* Absolute Elegant Close button overlay */}
            <button
              onClick={() => setIsPdfFullActive(false)}
              className="absolute top-3 right-3 z-50 size-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Đóng chế độ xem sách"
            >
              <span className="text-xl font-bold leading-none">&times;</span>
            </button>

            {/* Expanded PDF Card Container Content */}
            <Card className="flex-1 flex flex-col border-0 bg-card overflow-hidden min-h-0">
              {/* PDF Viewer Header Toolbar */}
              <div className="bg-muted/40 border-b border-border/60 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 pr-14">
                {/* Mode Selector Tabs */}
                <div className="flex items-center gap-1.5 bg-background/60 p-1 rounded-xl border border-border/60">
                  <button
                    onClick={() => setViewMode("pdf")}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      viewMode === "pdf"
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BookOpen className="size-3.5" />
                    <span>Sách giáo khoa PDF</span>
                  </button>
                  <button
                    onClick={() => setViewMode("summary")}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      viewMode === "summary"
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <FileText className="size-3.5" />
                    <span>Tóm tắt bài học</span>
                  </button>
                </div>

                {/* PDF Controls (Only visible in Summary mode) */}
                {viewMode === "summary" ? (
                  <div className="flex items-center gap-1.5 md:gap-2.5">
                    <button
                      onClick={handleZoomOut}
                      className="p-1.5 rounded-lg hover:bg-muted hover:text-foreground text-muted-foreground transition-all cursor-pointer"
                      title="Thu nhỏ"
                    >
                      <ZoomOut className="size-4" />
                    </button>
                    <span className="text-xs md:text-sm font-bold text-foreground min-w-[35px] text-center">
                      {zoom}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      className="p-1.5 rounded-lg hover:bg-muted hover:text-foreground text-muted-foreground transition-all cursor-pointer"
                      title="Phóng to"
                    >
                      <ZoomIn className="size-4" />
                    </button>

                    <div className="w-px h-4 bg-border/60 mx-1 hidden sm:block" />

                    <button
                      className="p-1.5 rounded-lg hover:bg-muted hover:text-foreground text-muted-foreground transition-all cursor-pointer hidden sm:block"
                      title="Xoay trang"
                    >
                      <RotateCw className="size-4" />
                    </button>

                    <button
                      className="p-1.5 rounded-lg hover:bg-muted hover:text-foreground text-muted-foreground transition-all cursor-pointer"
                      title="Toàn màn hình"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      <Maximize2 className="size-4" />
                    </button>

                    <a
                      href="/Bai_08_Xu_li_bat_hoa_voi_ban_be.pdf"
                      download
                      className="p-1.5 rounded-lg hover:bg-muted hover:text-foreground text-muted-foreground transition-all cursor-pointer"
                      title="Tải tệp PDF xuống"
                    >
                      <Download className="size-4" />
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <a
                      href="/Bai_08_Xu_li_bat_hoa_voi_ban_be.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-primary hover:underline px-2.5 py-1.5 rounded-lg bg-primary/10 transition-all"
                    >
                      <Eye className="size-3.5" /> Mở trong tab mới
                    </a>
                    <a
                      href="/Bai_08_Xu_li_bat_hoa_voi_ban_be.pdf"
                      download
                      className="p-1.5 rounded-lg hover:bg-muted hover:text-foreground text-muted-foreground transition-all cursor-pointer"
                      title="Tải tệp PDF xuống"
                    >
                      <Download className="size-4" />
                    </a>
                  </div>
                )}
              </div>

              {/* Realistic Paper Viewer Body or PDF iframe */}
              {viewMode === "pdf" ? (
                <div className="bg-slate-100 p-0 flex items-center justify-center flex-1 min-h-0 overflow-hidden">
                  <iframe
                    src="/Bai_08_Xu_li_bat_hoa_voi_ban_be.pdf"
                    className="w-full h-full border-0 bg-white"
                    title="Sách Giáo Khoa PDF"
                  />
                </div>
              ) : (
                <>
                  <div
                    className={`bg-slate-100 p-4 md:p-6 flex justify-center items-start flex-1 min-h-0 overflow-y-auto transition-all ${
                      isFullscreen
                        ? "fixed inset-0 z-[60] overflow-y-auto"
                        : ""
                    }`}
                    style={{
                      transform: isFullscreen ? "none" : `scale(${zoom / 100})`,
                      transformOrigin: "top center",
                    }}
                  >
                    {/* Fullscreen close helper */}
                    {isFullscreen && (
                      <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-4 right-4 z-50 bg-black/70 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold shadow-soft cursor-pointer"
                      >
                        Đóng Toàn Màn Hình [Esc]
                      </button>
                    )}

                    {/* The Paper Sheet */}
                    <Card
                      className={`w-full max-w-2xl bg-[#FCFAF2] border-2 border-amber-900/10 shadow-card p-6 md:p-8 rounded-2xl relative select-none text-foreground/90 transition-all ${
                        isFullscreen ? "my-12 animate-pop-in" : ""
                      }`}
                      style={{ fontFamily: '"Inter", system-ui, sans-serif' }}
                    >
                      {/* Spine Shadow Effect */}
                      <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/5 to-transparent rounded-l-2xl pointer-events-none" />

                      {/* Dynamic PDF content rendered beautifully */}
                      <div className="space-y-4">
                        {/* Chapter Header */}
                        <div className="border-b border-amber-900/10 pb-2 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-amber-800/80">
                          <span>
                            BỘ SÁCH GIÁO KHOA KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
                          </span>
                          <span>Trang {currentPage + 5}</span>
                        </div>

                        {/* Lesson Header Title */}
                        <h3 className="font-display font-black text-lg md:text-xl text-amber-950 border-l-4 border-amber-700 pl-3 leading-snug py-0.5">
                          {currentPageContent.header}
                        </h3>

                        {/* Lesson Content paragraphs */}
                        <div className="space-y-3.5 text-sm md:text-base leading-relaxed text-amber-950/80 font-medium">
                          {currentPageContent.paragraphs.map((p, idx) => (
                            <p key={idx}>{p}</p>
                          ))}
                        </div>

                        {/* Exercise block */}
                        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200/60 shadow-inner">
                          <h4 className="font-display font-bold text-sm text-amber-900 flex items-center gap-1.5 mb-1">
                            <FileText className="size-3.5 text-amber-700" />
                            Hoạt động Luyện tập trong SGK:
                          </h4>
                          <p className="text-sm text-amber-900/85 leading-relaxed font-medium">
                            {currentPageContent.exercise}
                          </p>
                        </div>

                        {/* Interactive highlight/hint in PDF */}
                        <div className="mt-3.5 p-3.5 rounded-xl bg-orange-100/50 border border-orange-200/50">
                          <p className="text-sm text-orange-950 font-semibold leading-relaxed italic">
                            {currentPageContent.tip}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* PDF Footer Toolbar (Pagination controls) */}
                  <div className="bg-card border-t border-border/60 px-4 py-2.5 flex items-center justify-between gap-4 flex-shrink-0">
                    <span className="text-sm font-bold text-muted-foreground">
                      Trang {currentPage} / {info.pdfPages.length}
                    </span>

                    {/* Back / Next buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1.5 rounded-xl border border-border text-sm font-bold flex items-center gap-1 transition-all ${
                          currentPage === 1
                            ? "opacity-40 cursor-not-allowed text-muted-foreground"
                            : "hover:bg-muted text-foreground cursor-pointer"
                        }`}
                      >
                        <ChevronLeft className="size-3.5" /> Trang trước
                      </button>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === info.pdfPages.length}
                        className={`px-3 py-1.5 rounded-xl border border-border text-sm font-bold flex items-center gap-1 transition-all ${
                          currentPage === info.pdfPages.length
                            ? "opacity-40 cursor-not-allowed text-muted-foreground"
                            : "hover:bg-muted text-foreground cursor-pointer"
                        }`}
                      >
                        Trang sau <ChevronRight className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
