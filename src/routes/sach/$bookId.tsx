import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  BookOpen,
  Check,
  PlayCircle,
  ChevronRight,
  Sparkles,
  Users,
  Hash,
  Ruler,
  Calculator,
  Compass,
  Star,
} from "lucide-react";
import { EXTRACTED_CONTENTS } from "@/lib/extracted-contents";

export const Route = createFileRoute("/sach/$bookId")({
  head: ({ params }) => {
    const { grade, subjectSlug, tap } = parseBookId(params.bookId);
    const { name: subjectName } = getSubjectInfo(subjectSlug);
    const bookTitle = tap !== null
      ? `Vở bài tập ${subjectName} ${grade} - Tập ${tap}`
      : `Vở bài tập ${subjectName} ${grade}`;
    return {
      meta: [
        {
          title: `${bookTitle} — Tích hợp phát triển năng lực số | NXBGDVN`,
        },
        {
          name: "description",
          content: `${bookTitle} — bám sát sách giáo khoa, tích hợp học liệu điện tử, trợ lý AI thông minh giải bài tập tương tác.`,
        },
      ],
    };
  },
  component: DynamicBookIntroPage,
});

// Glob WebP covers
const BIA_SACH = import.meta.glob("../../assets/bia-sach/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const BOOK_AUTHORS: Record<string, string> = {
  "tnxh-1-full.pdf": "Nguyễn Thị Thu Hằng (Chủ biên) - Lương Việt Thái - Phương Thảo",
  "tnxh-2-full.pdf": "Nguyễn Thị Thu Hằng (Chủ biên) - Lương Việt Thái - Phương Thảo",
  "tnxh-3-full.pdf": "Nguyễn Thị Thu Hằng (Chủ biên) - Lương Việt Thái - Phương Thảo",
  "vbt-am-nhac-1.pdf": "Đặng Khánh Nhật (Chủ biên) - Trần Ngọc Tú - Mai Linh Chi - Vũ Thanh Thuỷ",
  "vbt-am-nhac-2.pdf": "Đặng Khánh Nhật (Chủ biên) - Trần Ngọc Tú - Mai Linh Chi - Vũ Thanh Thuỷ",
  "vbt-am-nhac-3.pdf": "Đặng Khánh Nhật (Chủ biên) - Trần Ngọc Tú - Mai Linh Chi - Vũ Thanh Thuỷ",
  "vbt-am-nhac-4.pdf": "Đặng Khánh Nhật (Chủ biên) - Trần Ngọc Tú - Mai Linh Chi - Vũ Thanh Thuỷ",
  "vbt-am-nhac-5.pdf": "Đặng Khánh Nhật (Chủ biên) - Trần Ngọc Tú - Mai Linh Chi - Vũ Thanh Thuỷ",
  "vbt-cong-nghe-3.pdf": "Vũ Thị Ngọc Thuý (Chủ biên) - Đặng Minh Đức - Nguyễn Thị Hoa",
  "vbt-cong-nghe-4.pdf": "Vũ Thị Ngọc Thuý (Chủ biên) - Đặng Minh Đức - Nguyễn Thị Hoa",
  "vbt-cong-nghe-5.pdf": "Vũ Thị Ngọc Thuý (Chủ biên) - Đặng Minh Đức - Nguyễn Thị Hoa",
  "vbt-dao-duc-1.pdf": "Nguyễn Thị Toan (Chủ biên) - Nguyễn Thị Hoàng Anh - Nguyễn Ngọc Dung - Đặng Xuân Điều",
  "vbt-dao-duc-2.pdf": "Nguyễn Thị Toan (Chủ biên) - Nguyễn Thị Hoàng Anh - Nguyễn Ngọc Dung - Đặng Xuân Điều",
  "vbt-dao-duc-3.pdf": "Nguyễn Thị Toan (Chủ biên) - Nguyễn Thị Hoàng Anh - Nguyễn Ngọc Dung - Đặng Xuân Điều",
  "vbt-dao-duc-4.pdf": "Nguyễn Thị Toan (Chủ biên) - Nguyễn Thị Hoàng Anh - Nguyễn Ngọc Dung - Đặng Xuân Điều",
  "vbt-dao-duc-5.pdf": "Nguyễn Thị Toan (Chủ biên) - Nguyễn Thị Hoàng Anh - Nguyễn Ngọc Dung - Đặng Xuân Điều",
  "vbt-hdtn-1.pdf": "Đinh Thị Kim Thoa (Chủ biên) - Đặng Xuân Điều - Vũ Phương Liên - Lại Thị Yến Ngọc - Phương Thảo",
  "vbt-hdtn-2.pdf": "Đinh Thị Kim Thoa (Chủ biên) - Đặng Xuân Điều - Nguyễn Hồng Kiên - Trần Thị Quỳnh Trang - Phương Thảo",
  "vbt-hdtn-3.pdf": "Đinh Thị Kim Thoa (Chủ biên) - Nguyễn Thị Bích Liên - Vũ Phương Liên - Trần Thị Quỳnh Trang - Phương Thảo",
  "vbt-hdtn-4.pdf": "Đinh Thị Kim Thoa (Chủ biên) - Vũ Phương Liên - Lại Thị Yến Ngọc - Trần Thị Quỳnh Trang - Phương Thảo",
  "vbt-hdtn-5.pdf": "Đinh Thị Kim Thoa (Chủ biên) - Nguyễn Hồng Kiên - Nguyễn Thị Bích Liên - Lại Thị Yến Ngọc - Phương Thảo",
  "vbt-khoa-hoc-4.pdf": "Lý Vương Ngọc Minh (Chủ biên) - Phan Thanh Hà - Nguyễn Thị Thanh Phúc",
  "vbt-khoa-hoc-5.pdf": "Lý Vương Ngọc Minh (Chủ biên) - Phan Thanh Hà - Nguyễn Thị Thanh Phúc",
  "vbt-lich-su-dia-li-4filein-2026.pdf": "Dương Thị Oanh (Chủ biên) - Nguyễn Tú Linh - Đặng Thị Phương - Trần Thị Lan",
  "vbt-lich-su-dia-li-5filein-2026.pdf": "Dương Thị Oanh (Chủ biên) - Nguyễn Tú Linh - Đặng Thị Phương - Trần Thị Lan",
  "vbt-mi-thuat-1.pdf": "Nguyễn Xuân Tiên (Chủ biên) - Nguyễn Hữu Hạnh - Trần Huy Thắng - Phan Minh Trí",
  "vbt-mi-thuat-2.pdf": "Nguyễn Xuân Tiên (Chủ biên) - Nguyễn Hữu Hạnh - Trần Huy Thắng - Phan Minh Trí",
  "vbt-mi-thuat-3.pdf": "Nguyễn Xuân Tiên (Chủ biên) - Nguyễn Hữu Hạnh - Trần Huy Thắng - Phan Minh Trí",
  "vbt-mi-thuat-4.pdf": "Nguyễn Xuân Tiên (Chủ biên) - Nguyễn Hữu Hạnh - Trần Huy Thắng - Phan Minh Trí",
  "vbt-mi-thuat-5.pdf": "Nguyễn Xuân Tiên (Chủ biên) - Nguyễn Hữu Hạnh - Trần Huy Thắng - Phan Minh Trí",
  "vbt-tieng-viet-1-1.pdf": "Trần Minh Hương (Chủ biên) - Trần Thị Quỳnh Nga - Vũ Thị Lan - Lương Thị Hiền - Thạch Thị Lan Anh",
  "vbt-tieng-viet-1-tap2.pdf": "Trần Minh Hương (Chủ biên) - Trần Thị Quỳnh Nga - Vũ Thị Lan - Lương Thị Hiền - Thạch Thị Lan Anh",
  "vbt-tieng-viet-2-1.pdf": "Trần Minh Hương (Chủ biên) - Vũ Thị Lan - Trần Thị Quỳnh Nga - Lương Thị Hiền - Thạch Thị Lan Anh",
  "vbt-tieng-viet-2-2.pdf": "Trần Minh Hương (Chủ biên) - Vũ Thị Lan - Trần Thị Quỳnh Nga - Lương Thị Hiền - Thạch Thị Lan Anh",
  "vbt-tieng-viet-3-1.pdf": "Trần Minh Hương (Chủ biên) - Thạch Thị Lan Anh - Trần Thị Quỳnh Nga - Vũ Thị Lan - Lương Thị Hiền",
  "vbt-tieng-viet-3-2.pdf": "Trần Minh Hương (Chủ biên) - Thạch Thị Lan Anh - Trần Thị Quỳnh Nga - Vũ Thị Lan - Lương Thị Hiền",
  "vbt-tieng-viet-4-1.pdf": "Trần Minh Hương (Chủ biên) - Lương Thị Hiền - Trần Thị Quỳnh Nga - Vũ Thị Lan - Thạch Thị Lan Anh",
  "vbt-tieng-viet-4-2.pdf": "Trần Minh Hương (Chủ biên) - Lương Thị Hiền - Trần Thị Quỳnh Nga - Vũ Thị Lan - Thạch Thị Lan Anh",
  "vbt-tieng-viet-5-2.pdf": "Trần Minh Hương (Chủ biên) - Trần Thị Quỳnh Nga - Vũ Thị Lan - Lương Thị Hiền - Thạch Thị Lan Anh",
  "vbt-tieng-viet-5-tap-1-full.pdf": "Trần Minh Hương (Chủ biên) - Trần Thị Quỳnh Nga - Vũ Thị Lan - Lương Thị Hiền - Thạch Thị Lan Anh",
  "vbt-tin-hoc-3.pdf": "Hoàng Thị Mai (Chủ biên) - Hà Đặng Cao Tùng",
  "vbt-tin-hoc-4.pdf": "Hoàng Thị Mai (Chủ biên) - Hà Đặng Cao Tùng",
  "vbt-tin-hoc-5.pdf": "Hoàng Thị Mai (Chủ biên) - Hà Đặng Cao Tùng",
  "vbt-toan-1-tap-1.pdf": "Lê Anh Vinh (Chủ biên) - Hoàng Quế Hường - Vũ Văn Luân - Nguyễn Minh Hải - Đặng Thị Phương Anh",
  "vbt-toan-1-tap-2.pdf": "Lê Anh Vinh (Chủ biên) - Hoàng Quế Hường - Vũ Văn Luân - Nguyễn Minh Hải - Đặng Thị Phương Anh",
  "vbt-toan-2-tap-1.pdf": "Lê Anh Vinh (Chủ biên) - Hoàng Quế Hường - Vũ Văn Luân - Nguyễn Minh Hải - Đặng Thị Phương Anh",
  "vbt-toan-2-tap-2.pdf": "Lê Anh Vinh (Chủ biên) - Hoàng Quế Hường - Vũ Văn Luân - Nguyễn Minh Hải - Đặng Thị Phương Anh",
  "vbt-toan-3-tap-1-full.pdf": "Lê Anh Vinh (Chủ biên) - Hoàng Quế Hường - Vũ Văn Luân - Nguyễn Minh Hải - Đặng Thị Phương Anh",
  "vbt-toan-3-tap-2-full.pdf": "Lê Anh Vinh (Chủ biên) - Hoàng Quế Hường - Vũ Văn Luân - Nguyễn Minh Hải - Đặng Thị Phương Anh",
  "vbt-toan-4-tap-1-full.pdf": "Lê Anh Vinh (Chủ biên) - Hoàng Quế Hường - Vũ Văn Luân - Nguyễn Minh Hải - Đặng Thị Phương Anh",
  "vbt-toan-4-tap-2-full.pdf": "Lê Anh Vinh (Chủ biên) - Hoàng Quế Hường - Vũ Văn Luân - Nguyễn Minh Hải - Đặng Thị Phương Anh",
  "vbt-toan-5-tap-1-full.pdf": "Lê Anh Vinh (Chủ biên) - Hoàng Quế Hường - Vũ Văn Luân - Nguyễn Minh Hải - Đặng Thị Phương Anh",
  "vbt-toan-5-tap-2-full.pdf": "Lê Anh Vinh (Chủ biên) - Hoàng Quế Hường - Vũ Văn Luân - Nguyễn Minh Hải - Đặng Thị Phương Anh",
  "vo-tap-viet-1-tap-1.pdf": "Trần Minh Hương (Chủ biên) - Thạch Thị Lan Anh - Trần Thị Quỳnh Nga",
  "vo-tap-viet-1-tap-2.pdf": "Trần Minh Hương (Chủ biên) - Thạch Thị Lan Anh - Trần Thị Quỳnh Nga",
  "vo-tap-viet-3-tap-1.pdf": "Trần Minh Hương (Chủ biên) - Lương Thị Hiền - Trần Thị Quỳnh Nga",
  "vo-tap-viet-lop2-tap1-filein-full.pdf": "Trần Minh Hương (Chủ biên) - Thạch Thị Lan Anh - Trần Thị Quỳnh Nga - Vũ Thị Lan - Lương Thị Hiền",
  "vo-tap-viet-lop2-tap2-filein-full.pdf": "Trần Minh Hương (Chủ biên) - Thạch Thị Lan Anh - Trần Thị Quỳnh Nga - Vũ Thị Lan - Lương Thị Hiền",
  "vo-tap-viet-lop3-tap2-filein-full.pdf": "Trần Minh Hương (Chủ biên) - Lương Thị Hiền - Trần Thị Quỳnh Nga"
};

// Helper to parse dynamic bookId parameter
function parseBookId(bookId: string) {
  const match = bookId.match(/^dynamic-(\d+)-([a-z0-9-]+?)(?:-tap-(\d+))?$/);
  if (!match) {
    return {
      grade: 4,
      subjectSlug: "toan",
      tap: null,
    };
  }
  return {
    grade: parseInt(match[1], 10),
    subjectSlug: match[2],
    tap: match[3] ? parseInt(match[3], 10) : null,
  };
}

// Resolver for WebP cover image
function getCoverImage(grade: number, subjectSlug: string, tap: number | null): string {
  if (subjectSlug === "toan" || subjectSlug === "tieng-viet" || subjectSlug === "tap-viet") {
    const path = `../../assets/bia-sach/lop-${grade}-${subjectSlug}-tap-${tap || 1}.webp`;
    if (BIA_SACH[path]) return BIA_SACH[path];
  }

  if (subjectSlug === "khoa-hoc" || subjectSlug === "lich-su-dia-li") {
    const path = `../../assets/bia-sach/lop-${grade}-${subjectSlug}.webp`;
    if (BIA_SACH[path]) return BIA_SACH[path];

    // Fallback for lower grades
    const fallbackPath = `../../assets/bia-sach/lop-${grade}-tu-nhien-xa-hoi.webp`;
    if (BIA_SACH[fallbackPath]) return BIA_SACH[fallbackPath];
  }

  const directPath = `../../assets/bia-sach/lop-${grade}-${subjectSlug}.webp`;
  if (BIA_SACH[directPath]) return BIA_SACH[directPath];

  return "";
}

// Resolver for dynamic book authors
function getBookAuthors(grade: number, subjectSlug: string): string {
  if (subjectSlug === "toan") {
    return "Lê Anh Vinh (Chủ biên) - Hoàng Quế Hường - Vũ Văn Luân - Nguyễn Minh Hải - Đặng Thị Phương Anh";
  }
  if (subjectSlug === "tieng-viet" || subjectSlug === "tap-viet") {
    if (grade === 1) return "Bùi Mạnh Hùng (Tổng chủ biên kiêm Chủ biên) - Lê Thị Lan Anh - Nguyễn Thị Ngân Hoa - Vũ Thị Thanh Hương - Vũ Thị Lan";
    if (grade === 2) return "Bùi Mạnh Hùng (Tổng chủ biên) - Trần Thị Hiền Lương (Chủ biên) - Đỗ Hồng Dương - Nguyễn Thị Ngọc Minh - Trần Kim Phượng";
    if (grade === 3) return "Bùi Mạnh Hùng (Tổng chủ biên) - Trần Thị Hiền Lương (Chủ biên) - Lê Thị Lan Anh - Nguyễn Lê Hằng - Đỗ Hồng Dương";
    if (grade === 4) return "Bùi Mạnh Hùng (Tổng chủ biên) - Trần Thị Hiền Lương (Chủ biên) - Nguyễn Thị Kim Oanh - Đặng Thị Hảo Tâm - Phạm Vĩnh Lộc - Nguyễn Lương Hải Như";
    return "Bùi Mạnh Hùng (Tổng chủ biên) - Trần Thị Hiền Lương (Chủ biên) - Lê Thị Lan Anh - Đỗ Hồng Dương - Nguyễn Thị Kim Oanh - Vũ Thị Thanh Hương - Đặng Thị Hảo Tâm";
  }
  if (subjectSlug === "tu-nhien-xa-hoi") {
    if (grade === 1) return "Đỗ Xuân Hội (Tổng chủ biên) - Nguyễn Thị Thu Hằng (Chủ biên) - Phạm Phương Anh - Lưu Phương Thanh Bình - Trần Thị Thu Hiền - Lý Khánh Hoa";
    return "Vũ Văn Hùng (Tổng chủ biên) - Nguyễn Thị Thấn (Chủ biên) - Đào Thị Hồng - Phương Hà Lan - Phạm Việt Quỳnh - Hoàng Quý Tỉnh";
  }
  if (subjectSlug === "khoa-hoc") {
    if (grade === 4) return "Vũ Văn Hùng (Tổng chủ biên) - Phan Thanh Hà (Chủ biên) - Nguyễn Thị Thanh Phúc - Lý Vương Ngọc Minh";
    return "Vũ Văn Hùng (Tổng chủ biên) - Phan Thanh Hà (Chủ biên) - Hà Thị Lan Hương - Nguyễn Thị Thanh Phúc";
  }
  if (subjectSlug === "lich-su-dia-li") {
    if (grade === 4) return "Vũ Minh Giang (Tổng chủ biên) - Nghiêm Đình Vỳ - Trần Thị Hà Giang (Chủ biên) - Nguyễn Thị Thu Thủy - Đinh Ngọc Bảo";
    return "Vũ Minh Giang (Tổng chủ biên) - Nghiêm Đình Vỳ (Chủ biên) - Đinh Ngọc Bảo - Lương Mỹ Vân - Nguyễn Minh Hằng";
  }
  if (subjectSlug === "dao-duc") {
    return "Nguyễn Thị Toan (Tổng chủ biên) - Trần Thành Nam (Chủ biên) - Nguyễn Thị Hoàng Anh - Nguyễn Nam Phương";
  }
  if (subjectSlug === "tin-hoc") {
    return "Nguyễn Chí Công (Chủ biên) - Hoàng Thị Mai - Nguyễn Huy Khắc - Phùng Anh Tuấn";
  }
  if (subjectSlug === "cong-nghe") {
    if (grade === 3) return "Lê Huy Hoàng (Tổng chủ biên) - Đặng Văn Nghĩa (Chủ biên) - Dương Giáng Thiên Hương - Nguyễn Thị Mai Lan";
    if (grade === 4) return "Lê Huy Hoàng (Tổng chủ biên) - Đặng Văn Nghĩa (Chủ biên) - Bùi Thị Hải Yến - Nguyễn Thị Mai Lan";
    return "Lê Huy Hoàng (Tổng chủ biên) - Đặng Văn Nghĩa (Chủ biên) - Dương Giáng Thiên Hương - Bùi Thị Hải Yến";
  }
  if (subjectSlug === "hoat-dong-trai-nghiem") {
    return "Bùi Ngọc Diệp (Chủ biên) - Phó Đức Hòa - Nguyễn Hữu Hợp - Nguyễn Hà My";
  }
  if (subjectSlug === "am-nhac") {
    return "Đỗ Thanh Hiên (Chủ biên) - Lương Diệu Linh - Nguyễn Đăng Bửu - Trịnh Hoài Thu";
  }
  if (subjectSlug === "mi-thuat") {
    return "Nguyễn Xuân Tiên (Chủ biên) - Nguyễn Hữu Hạnh - Trần Huy Thắng - Phan Minh Trí";
  }
  if (subjectSlug === "tieng-anh") {
    return "Hoàng Văn Vân (Chủ biên) - Phan Hà - Nguyễn Thị Chi - Lương Quỳnh Trang";
  }
  return "Đội ngũ tác giả chuyên môn của Nhà xuất bản Giáo dục Việt Nam";
}

// Resolver for Vietnamese name and display assets
function getSubjectInfo(subjectSlug: string) {
  let name = "";
  let emoji = "📚";
  let color = "success";
  let themeColor = "text-success bg-success/15 border-success/20";
  let keywordColor = "text-success";

  switch (subjectSlug) {
    case "toan":
      name = "Toán";
      emoji = "➗";
      color = "primary";
      themeColor = "text-sky-600 bg-sky-50 border-sky-100";
      keywordColor = "text-sky-500";
      break;
    case "tieng-viet":
      name = "Tiếng Việt";
      emoji = "📖";
      color = "destructive";
      themeColor = "text-rose-600 bg-rose-50 border-rose-100";
      keywordColor = "text-rose-500";
      break;
    case "tap-viet":
      name = "Tập viết";
      emoji = "✍️";
      color = "warning";
      themeColor = "text-amber-600 bg-amber-50 border-amber-100";
      keywordColor = "text-amber-500";
      break;
    case "khoa-hoc":
      name = "Khoa học";
      emoji = "🔬";
      color = "success";
      themeColor = "text-emerald-600 bg-emerald-50 border-emerald-100";
      keywordColor = "text-emerald-500";
      break;
    case "tu-nhien-xa-hoi":
      name = "Tự nhiên và Xã hội";
      emoji = "🌱";
      color = "success";
      themeColor = "text-emerald-600 bg-emerald-50 border-emerald-100";
      keywordColor = "text-emerald-500";
      break;
    case "lich-su-dia-li":
      name = "Lịch sử và Địa lí";
      emoji = "🗺️";
      color = "warning";
      themeColor = "text-amber-600 bg-amber-50 border-amber-100";
      keywordColor = "text-amber-600";
      break;
    case "tin-hoc":
      name = "Tin học";
      emoji = "💻";
      color = "info";
      themeColor = "text-cyan-600 bg-cyan-50 border-cyan-100";
      keywordColor = "text-cyan-500";
      break;
    case "tieng-anh":
      name = "Tiếng Anh";
      emoji = "🌐";
      color = "info";
      themeColor = "text-indigo-600 bg-indigo-50 border-indigo-100";
      keywordColor = "text-indigo-600";
      break;
    case "am-nhac":
      name = "Âm nhạc";
      emoji = "🎵";
      color = "fun";
      themeColor = "text-pink-600 bg-pink-50 border-pink-100";
      keywordColor = "text-pink-500";
      break;
    case "dao-duc":
      name = "Đạo đức";
      emoji = "🤝";
      color = "success";
      themeColor = "text-teal-600 bg-teal-50 border-teal-100";
      keywordColor = "text-teal-600";
      break;
    case "mi-thuat":
      name = "Mĩ thuật";
      emoji = "🎨";
      color = "fun";
      themeColor = "text-purple-600 bg-purple-50 border-purple-100";
      keywordColor = "text-purple-500";
      break;
    case "cong-nghe":
      name = "Công nghệ";
      emoji = "🛠️";
      color = "warning";
      themeColor = "text-orange-600 bg-orange-50 border-orange-100";
      keywordColor = "text-orange-600";
      break;
    case "hoat-dong-trai-nghiem":
      name = "Hoạt động trải nghiệm";
      emoji = "🏕️";
      color = "info";
      themeColor = "text-sky-600 bg-sky-50 border-sky-100";
      keywordColor = "text-sky-600";
      break;
    default:
      name = subjectSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      break;
  }
  return { name, emoji, color, themeColor, keywordColor };
}

// Match dynamic lesson details mapping
function getLessonSlug(subjectSlug: string, title: string) {
  if (subjectSlug === "toan") {
    if (title.includes("100 000") && !title.includes("phép tính")) return "toan-bai-1";
    if (title.includes("Biểu thức chứa chữ")) return "toan-bai-4";
    if (title.includes("Đo góc")) return "toan-bai-11";
  }
  if (subjectSlug === "khoa-hoc") {
    if (title.includes("Tính chất của nước")) return "khoahoc-bai-1";
    if (title.includes("Sự chuyển thể của nước")) return "khoahoc-bai-2";
    if (title.includes("Bảo vệ nguồn nước")) return "khoahoc-bai-3";
    if (title.includes("Không khí có ở đâu")) return "khoahoc-bai-4";
    if (title.includes("Gió, bão")) return "khoahoc-bai-6";
    if (title.includes("Vai trò của ánh sáng")) return "khoahoc-bai-9";
  }

  // Normalize other lessons into a clean slug
  let slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  if (slug.length > 50) {
    slug = slug.substring(0, 50);
  }

  return `${subjectSlug}-${slug}`;
}

// Fallback dynamic chapters/topics and lessons list
function getFallbackBookTopics(grade: number, subjectSlug: string) {
  const defaultTopics: Record<string, string[]> = {
    "toan": ["Ôn tập đầu năm", "Phép cộng và phép trừ", "Hình học trực quan", "Phép nhân và phép chia", "Phần số và số thập phân", "Ôn tập cuối năm"],
    "tieng-viet": ["Chào năm học mới", "Măng non tỏa sáng", "Hương vị quê hương", "Vẻ đẹp bốn mùa", "Bảo vệ tổ quốc", "Hành trình tri thức"],
    "tap-viet": ["Tập viết nét cơ bản", "Tập viết chữ cái viết hoa", "Tập viết từ ứng dụng", "Tập viết câu ứng dụng"],
    "tu-nhien-xa-hoi": ["Gia đình em", "Trường học thân yêu", "Cộng đồng địa phương", "Thực vật và động vật", "Con người và sức khoẻ", "Trái đất và bầu trời"],
    "khoa-hoc": ["Chất và sự biến đổi", "Năng lượng quanh ta", "Thực vật và động vật", "Nấm ăn trong đời sống", "Con người và sức khoẻ", "Sinh vật và môi trường"],
    "lich-su-dia-li": ["Địa lí địa phương", "Bản đồ và lược đồ", "Lịch sử dựng nước", "Thời kì chống ngoại xâm", "Địa hình và khoáng sản", "Sông ngòi và khí hậu"],
    "tin-hoc": ["Máy tính và em", "Mạng máy tính và Internet", "Tổ chức lưu trữ thông tin", "Soạn thảo văn bản cơ bản", "Làm quen với lập trình", "Giải quyết vấn đề với máy tính"],
    "tieng-anh": ["Hello Again", "My New School", "At Home", "My Friends", "Our Activities", "Free Time"],
    "am-nhac": ["Vui bước đến trường", "Giai điệu quê hương", "Bài ca hòa bình", "Âm thanh thiên nhiên", "Tình thầy nghĩa bạn", "Khúc ca sum vầy"],
    "dao-duc": ["Yêu thương gia đình", "Kính trọng thầy cô", "Giúp đỡ bạn bè", "Tự tin và tự trọng", "Bảo vệ môi trường công cộng", "Tuân thủ luật giao thông"],
    "mi-thuat": ["Màu sắc quanh ta", "Hình khối cơ bản", "Vẽ tranh phong cảnh", "Đất nặn sáng tạo", "Cắt dán thủ công", "Trang trí ứng dụng"],
    "cong-nghe": ["Thiết kế công nghệ", "Lắp ráp mô hình kỹ thuật", "Làm quen với đồ gia dụng", "An toàn điện trong gia đình"],
    "hoat-dong-trai-nghiem": ["Khám phá bản thân", "Rèn luyện nếp sống", "Em và gia đình", "Em và mái trường", "Em và cộng đồng", "Em và môi trường"],
  };

  const topicsList = defaultTopics[subjectSlug] || ["Chủ đề 1", "Chủ đề 2", "Chủ đề 3", "Chủ đề 4"];
  return topicsList.map((t, idx) => {
    return {
      chapter: String(idx + 1),
      title: t,
      page: String((idx + 1) * 6),
    };
  });
}

// Fallback prefaces
function getFallbackBookPreface(grade: number, subjectName: string) {
  return [
    `Cuốn Vở bài tập ${subjectName} Lớp ${grade} được biên soạn bám sát các chủ đề và bài học trong sách giáo khoa ${subjectName} ${grade} (theo Chương trình GDPT mới), nhằm giúp các em học sinh luyện tập và củng cố những điều đã học một cách bài bản và hệ thống.`,
    `Các dạng bài phong phú như lựa chọn đáp án, điền số, trình bày lời giải, thực hành và trải nghiệm sẽ giúp các em phát triển kĩ năng tính toán, suy luận và giải quyết vấn đề. Môn học không chỉ là lý thuyết khô khan mà còn gắn với những tình huống gần gũi trong cuộc sống hằng ngày.`,
    `Đặc biệt, các em còn có cơ hội phát triển năng lực số: truy cập học liệu điện tử qua mã QR ở từng bài học để xem phiên bản số của sách và thực hiện các bài tập tương tác từ cơ bản đến nâng cao.`,
  ];
}

// Match the PDF filename from grade, subject, tap
function getPdfFileName(grade: number, subjectSlug: string, tap: number | null): string {
  const specialMappings: Record<string, string> = {
    "1-tu-nhien-xa-hoi": "tnxh-1-full.pdf",
    "2-tu-nhien-xa-hoi": "tnxh-2-full.pdf",
    "3-tu-nhien-xa-hoi": "tnxh-3-full.pdf",
    "2-tap-viet-tap-1": "vo-tap-viet-lop2-tap1-filein-full.pdf",
    "2-tap-viet-tap-2": "vo-tap-viet-lop2-tap2-filein-full.pdf",
    "3-tap-viet-tap-1": "vo-tap-viet-3-tap-1.pdf",
    "3-tap-viet-tap-2": "vo-tap-viet-lop3-tap2-filein-full.pdf",
    "4-lich-su-dia-li": "vbt-lich-su-dia-li-4filein-2026.pdf",
    "5-lich-su-dia-li": "vbt-lich-su-dia-li-5filein-2026.pdf",
    "1-tap-viet-tap-1": "vo-tap-viet-1-tap-1.pdf",
    "1-tap-viet-tap-2": "vo-tap-viet-1-tap-2.pdf",
    "1-tieng-viet-tap-1": "vbt-tieng-viet-1-1.pdf",
    "1-tieng-viet-tap-2": "vbt-tieng-viet-1-tap2.pdf",
    "2-tieng-viet-tap-1": "vbt-tieng-viet-2-1.pdf",
    "2-tieng-viet-tap-2": "vbt-tieng-viet-2-2.pdf",
    "3-tieng-viet-tap-1": "vbt-tieng-viet-3-1.pdf",
    "3-tieng-viet-tap-2": "vbt-tieng-viet-3-2.pdf",
    "4-tieng-viet-tap-1": "vbt-tieng-viet-4-1.pdf",
    "4-tieng-viet-tap-2": "vbt-tieng-viet-4-2.pdf",
    "5-tieng-viet-tap-1": "vbt-tieng-viet-5-tap-1-full.pdf",
    "5-tieng-viet-tap-2": "vbt-tieng-viet-5-2.pdf",
    "1-toan-tap-1": "vbt-toan-1-tap-1.pdf",
    "1-toan-tap-2": "vbt-toan-1-tap-2.pdf",
    "2-toan-tap-1": "vbt-toan-2-tap-1.pdf",
    "2-toan-tap-2": "vbt-toan-2-tap-2.pdf",
    "3-toan-tap-1": "vbt-toan-3-tap-1-full.pdf",
    "3-toan-tap-2": "vbt-toan-3-tap-2-full.pdf",
    "4-toan-tap-1": "vbt-toan-4-tap-1-full.pdf",
    "4-toan-tap-2": "vbt-toan-4-tap-2-full.pdf",
    "5-toan-tap-1": "vbt-toan-5-tap-1-full.pdf",
    "5-toan-tap-2": "vbt-toan-5-tap-2-full.pdf",
  };

  const key = `${grade}-${subjectSlug}${tap !== null ? `-tap-${tap}` : ""}`;
  let fileName = specialMappings[key];

  if (!fileName) {
    let tempSlug = subjectSlug;
    if (subjectSlug === "hoat-dong-trai-nghiem") {
      tempSlug = "hdtn";
    }
    fileName = `vbt-${tempSlug}-${grade}.pdf`;
  }
  return fileName;
}

// Group TOC rows into formatted Chapter groups
interface GroupedTopic {
  id: number;
  title: string;
  lessons: string[];
}

function groupTocIntoTopics(tocItems: { chapter: string; title: string; page: string }[], grade: number, subjectSlug: string): GroupedTopic[] {
  if (subjectSlug === "toan" && grade === 4) {
    return [
      { id: 1, title: "Ôn tập và bổ sung", lessons: ["Ôn tập các số đến 100 000", "Ôn tập các phép tính trong phạm vi 100 000", "Số chẵn, số lẻ", "Biểu thức chứa chữ", "Giải bài toán có ba bước tính", "Luyện tập chung"] },
      { id: 2, title: "Góc và đơn vị đo góc", lessons: ["Đo góc, đơn vị đo góc", "Góc nhọn, góc tù, góc bẹt", "Luyện tập chung"] },
      { id: 3, title: "Số có nhiều chữ số", lessons: ["Số có sáu chữ số. Số 1 000 000", "Hàng và lớp", "Các số trong phạm vi lớp triệu", "Làm tròn số đến hàng trăm nghìn", "So sánh các số có nhiều chữ số", "Làm quen với dãy số tự nhiên", "Luyện tập chung"] },
      { id: 4, title: "Một số đơn vị đo đại lượng", lessons: ["Yến, tạ, tấn", "Đề-xi-mét vuông, mét vuông, mi-li-mét vuông", "Giây, thế kỉ", "Thực hành và trải nghiệm sử dụng một số đơn vị đo đại lượng", "Luyện tập chung"] },
      { id: 5, title: "Phép cộng và phép trừ", lessons: ["Phép cộng các số có nhiều chữ số", "Phép trừ các số có nhiều chữ số", "Tính chất giao hoán và kết hợp của phép cộng", "Tìm hai số biết tổng và hiệu của hai số đó", "Luyện tập chung"] },
      { id: 6, title: "Đường thẳng vuông góc. Đường thẳng song song", lessons: ["Hai đường thẳng vuông góc", "Thực hành và trải nghiệm vẽ hai đường thẳng vuông góc", "Hai đường thẳng song song", "Thực hành và trải nghiệm vẽ hai đường thẳng song song", "Hình bình hành, hình thoi", "Luyện tập chung"] },
      { id: 7, title: "Ôn tập học kì 1", lessons: ["Ôn tập các số đến lớp triệu", "Ôn tập phép cộng, phép trừ", "Ôn tập hình học", "Ôn tập đo lường", "Ôn tập chung"] }
    ];
  }
  if (subjectSlug === "khoa-hoc" && grade === 4) {
    return [
      { id: 1, title: "Chất", lessons: ["Tính chất của nước và nước với cuộc sống", "Sự chuyển thể của nước và vòng tuần hoàn của nước", "Bảo vệ nguồn nước và sử dụng tiết kiệm nước", "Không khí có ở đâu?", "Sự ô nhiễm và bảo vệ bầu không khí", "Gió, bão và phòng chống bão", "Ôn tập chủ đề Chất"] },
      { id: 2, title: "Năng lượng", lessons: ["Ánh sáng và sự truyền ánh sáng", "Vai trò của ánh sáng", "Âm thanh", "Âm thanh trong cuộc sống", "Nhiệt độ và sự truyền nhiệt", "Vật dẫn nhiệt tốt và vật dẫn nhiệt kém", "Ôn tập chủ đề Năng lượng"] },
      { id: 3, title: "Thực vật và Động vật", lessons: ["Thực vật cần gì để sống?", "Động vật cần gì để sống?", "Chăm sóc cây trồng, vật nuôi", "Ôn tập chủ đề Thực vật và Động vật"] },
      { id: 4, title: "Nấm", lessons: ["Đặc điểm chung của nấm", "Nấm ăn và nấm men trong đời sống", "Nấm độc và an toàn khi sử dụng nấm", "Ôn tập chủ đề Nấm"] },
      { id: 5, title: "Con người và Sức khoẻ", lessons: ["Các nhóm chất dinh dưỡng có trong thức ăn", "Chế độ ăn uống cân bằng", "Một số bệnh liên quan đến dinh dưỡng", "Thực phẩm an toàn", "Phòng tránh đuối nước", "Ôn tập chủ đề Con người và Sức khoẻ"] },
      { id: 6, title: "Sinh vật và Môi trường", lessons: ["Chuỗi thức ăn trong tự nhiên", "Vai trò của thực vật trong chuỗi thức ăn", "Ôn tập chủ đề Sinh vật và Môi trường"] }
    ];
  }

  const topics: GroupedTopic[] = [];
  let currentTopic: GroupedTopic | null = null;
  let fallbackId = 1;

  tocItems.forEach((item) => {
    const isHeader = 
      item.title.toLowerCase().startsWith("chủ đề") || 
      item.title.toLowerCase().startsWith("chương") || 
      item.title.toLowerCase().startsWith("phần") ||
      (item.title.toUpperCase() === item.title && item.title.length > 10 && !item.chapter && !item.title.toLowerCase().startsWith("bài"));

    if (isHeader) {
      currentTopic = {
        id: topics.length + 1,
        title: item.title.replace(/^(Chủ đề \d+|Chương \d+|Phần \d+)\.?\s*/i, ""),
        lessons: []
      };
      topics.push(currentTopic);
    } else {
      if (!currentTopic) {
        currentTopic = {
          id: fallbackId++,
          title: "Nội dung học tập",
          lessons: []
        };
        topics.push(currentTopic);
      }
      currentTopic.lessons.push(item.title);
    }
  });

  // Flat fallback grouping if not enough distinct chapters
  if (topics.length === 0 || (topics.length === 1 && topics[0].lessons.length === 0)) {
    const backupTopics: GroupedTopic[] = [];
    let currentGrp: GroupedTopic | null = null;
    tocItems.forEach((item, idx) => {
      if (idx % 6 === 0) {
        currentGrp = {
          id: backupTopics.length + 1,
          title: `Chuyên đề học tập ${backupTopics.length + 1}`,
          lessons: []
        };
        backupTopics.push(currentGrp);
      }
      if (currentGrp) {
        currentGrp.lessons.push(item.title);
      }
    });
    return backupTopics;
  }

  return topics;
}

const TOPIC_COLORS = [
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-purple-500 to-indigo-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
  "from-cyan-500 via-teal-500 to-emerald-600",
  "from-indigo-500 to-violet-600"
];

const TOPIC_INDEX_THEMES = [
  { bg: "bg-sky-50 text-sky-600", hover: "group-hover/item:bg-sky-100 group-hover/item:text-sky-700" },
  { bg: "bg-emerald-50 text-emerald-600", hover: "group-hover/item:bg-emerald-100 group-hover/item:text-emerald-700" },
  { bg: "bg-purple-50 text-purple-600", hover: "group-hover/item:bg-purple-100 group-hover/item:text-purple-700" },
  { bg: "bg-amber-50 text-amber-600", hover: "group-hover/item:bg-amber-100 group-hover/item:text-amber-700" },
  { bg: "bg-pink-50 text-pink-600", hover: "group-hover/item:bg-pink-100 group-hover/item:text-pink-700" },
  { bg: "bg-cyan-50 text-cyan-600", hover: "group-hover/item:bg-cyan-100 group-hover/item:text-cyan-700" },
  { bg: "bg-indigo-50 text-indigo-600", hover: "group-hover/item:bg-indigo-100 group-hover/item:text-indigo-700" },
];

const TOPIC_ICONS = [Hash, Ruler, Calculator, Compass, Star];

// A block can be a regular paragraph, a bullet list, or a closing/special line
type PrefaceBlock =
  | { type: "paragraph"; html: string }
  | { type: "bullets"; items: string[] }
  | { type: "closing"; html: string };

// Bold key terms inside a text chunk
function boldKeyTerms(text: string): string {
  // Bold book/workbook titles (e.g. "Vở bài tập Toán 4", "Sách giáo khoa Khoa học 4")
  let result = text.replace(
    /(Vở bài tập [A-ZÀ-Ỵa-zà-ỵ\s]+?\d+(?:\s*[-–—]\s*Tập\s*\d+)?)/g,
    "<strong>$1</strong>"
  );
  result = result.replace(
    /(Sách giáo khoa [A-ZÀ-Ỵa-zà-ỵ\s]+?\d+)/g,
    "<strong>$1</strong>"
  );
  // Bold key pedagogical terms
  const keyTerms = [
    "năng lực số",
    "học liệu điện tử",
    "bài tập tương tác",
    "Chương trình GDPT 2018",
    "mã QR",
  ];
  keyTerms.forEach((term) => {
    result = result.replace(
      new RegExp(`(${term})`, "gi"),
      "<strong>$1</strong>"
    );
  });
  return result;
}

function normalizePreface(prefaceArray: string[]): { blocks: PrefaceBlock[]; signature: string; greeting: string } {
  if (!prefaceArray || prefaceArray.length === 0) {
    return { blocks: [], signature: "Các tác giả", greeting: "Các em yêu quý!" };
  }

  // 1. Extract signature and filter it out from body
  let signature = "Các tác giả";
  const bodyLines = prefaceArray.filter((line) => {
    const trimmed = line.trim().toUpperCase();
    if (
      trimmed === "CÁC TÁC GIẢ" ||
      trimmed === "CÁC TÁC GIẢ." ||
      trimmed === "TÁC GIẢ" ||
      trimmed === "NHÓM TÁC GIẢ" ||
      trimmed === "BAN BIÊN SOẠN" ||
      trimmed === "— CÁC TÁC GIẢ"
    ) {
      signature = line.trim().replace(/^—\s*/, "");
      return false;
    }
    return true;
  });

  // 2. Join lines with space and clean up whitespaces
  let fullText = bodyLines
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  // Remove duplicate "LỜI NÓI ĐẦU" header noise from extracted text
  fullText = fullText.replace(/^(LỜI NÓI ĐẦU\s*)+/i, "").trim();

  // Clean trailing signature if it got merged inside the last line
  const sigRegex = /\s*(—?\s*(Các tác giả|CÁC TÁC GIẢ|Tác giả|Nhóm tác giả|Ban biên soạn)\.?)\s*$/i;
  const sigMatch = fullText.match(sigRegex);
  if (sigMatch) {
    signature = sigMatch[2];
    fullText = fullText.replace(sigRegex, "");
  }

  // 3. Dynamic greeting extractor (before splitting)
  let greeting = "Các em yêu quý!";
  const greetingRegex = /^([^\.!:\?]+(thân mến|yêu quý|học sinh thân mến|học sinh yêu quý)[\s]*[\!:\?])\s*/i;
  const greetMatch = fullText.match(greetingRegex);
  if (greetMatch) {
    greeting = greetMatch[1];
    fullText = fullText.replace(greetingRegex, "").trim();
  }

  // 4. Split into raw segments by sentence boundaries before bullets and transition markers
  // Strategy: split at • bullet markers first, then re-group into prose vs list blocks
  // First, normalize bullet variants: "• ", "•\t", "- "
  fullText = fullText
    .replace(/•\t/g, "• ")
    .replace(/\s*•\s+/g, " |||BULLET||| ")
    .trim();

  // Split at transition sentence breaks
  const closingStarters = [
    "Hi vọng rằng", "Hi vọng cuốn", "Hi vọng các", "Chúng tôi hi vọng",
    "Chúc các em", "Chúc các con",
  ];
  const closingPattern = new RegExp(
    `(?<=[.!?])\\s+(?=${closingStarters.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|")})`,
    "g"
  );

  // Split into semantic segments
  const transitionMarkers = [
    "Nhóm tác giả đã", "Đặc biệt,", "Đặc biệt hơn nữa,",
    "Khi sử dụng", "Khi làm bài", "Phụ huynh có thể",
    "Để đồng hành", "Bộ sách được", "Mỗi cuốn vở", "Mỗi bài học",
    "Các câu hỏi", "Bên cạnh",
  ];
  const transitionPattern = new RegExp(
    `(?<=[.!?])\\s+(?=${transitionMarkers.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|")})`,
    "g"
  );

  let rawSegments = fullText
    .replace(closingPattern, "|||SPLIT|||")
    .replace(transitionPattern, "|||SPLIT|||")
    .split("|||SPLIT|||")
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // Fallback: if only 1 segment and very long, split by mid-sentence
  if (rawSegments.length <= 1 && fullText.length > 400 && !fullText.includes("|||BULLET|||")) {
    const sentences = fullText.match(/[^.!?]+[.!?]+/g) || [fullText];
    if (sentences.length >= 4) {
      const mid = Math.ceil(sentences.length / 2);
      rawSegments = [
        sentences.slice(0, mid).join(" ").trim(),
        sentences.slice(mid).join(" ").trim(),
      ];
    }
  }

  // 5. Convert raw segments into typed blocks
  const blocks: PrefaceBlock[] = [];

  rawSegments.forEach((seg) => {
    if (seg.includes("|||BULLET|||")) {
      // Split the segment into intro text + bullets
      const parts = seg.split("|||BULLET|||");
      const intro = parts[0].trim();
      const bulletItems = parts.slice(1).map(b => b.trim()).filter(b => b.length > 0);

      if (intro.length > 0) {
        blocks.push({ type: "paragraph", html: boldKeyTerms(intro) });
      }
      if (bulletItems.length > 0) {
        blocks.push({ type: "bullets", items: bulletItems });
      }
    } else {
      // Closing pattern detection
      const isClosing = closingStarters.some(s => seg.trimStart().startsWith(s));
      if (isClosing) {
        blocks.push({ type: "closing", html: boldKeyTerms(seg) });
      } else {
        blocks.push({ type: "paragraph", html: boldKeyTerms(seg) });
      }
    }
  });

  return { blocks, signature, greeting };
}

function DynamicBookIntroPage() {
  const { bookId } = Route.useParams();

  const { grade, subjectSlug, tap } = useMemo(() => parseBookId(bookId), [bookId]);
  const coverUrl = useMemo(() => getCoverImage(grade, subjectSlug, tap), [grade, subjectSlug, tap]);
  const { name: subjectName, emoji, keywordColor, color: subjectColorKey } = useMemo(() => getSubjectInfo(subjectSlug), [subjectSlug]);
  const pdfFileName = useMemo(() => getPdfFileName(grade, subjectSlug, tap), [grade, subjectSlug, tap]);
  const authorsList = useMemo(() => {
    return (pdfFileName && BOOK_AUTHORS[pdfFileName]) || getBookAuthors(grade, subjectSlug);
  }, [pdfFileName, grade, subjectSlug]);
  const extractedData = useMemo(() => EXTRACTED_CONTENTS[pdfFileName] || null, [pdfFileName]);

  const { blocks: prefaceBlocks, signature: signatureText, greeting: greetingText } = useMemo(() => {
    const rawPreface = (extractedData && extractedData.preface && extractedData.preface.length > 0)
      ? extractedData.preface
      : getFallbackBookPreface(grade, subjectName);
    return normalizePreface(rawPreface);
  }, [extractedData, grade, subjectName]);

  const rawTocItems = useMemo(() => {
    if (extractedData && extractedData.toc && extractedData.toc.length > 0) {
      return extractedData.toc;
    }
    return getFallbackBookTopics(grade, subjectSlug);
  }, [extractedData, grade, subjectSlug]);

  const topics = useMemo(() => groupTocIntoTopics(rawTocItems, grade, subjectSlug), [rawTocItems, grade, subjectSlug]);
  const totalLessons = topics.reduce((s, t) => s + t.lessons.length, 0);

  const bookTitle = tap !== null
    ? `Vở bài tập ${subjectName} ${grade} - Tập ${tap}`
    : `Vở bài tập ${subjectName} ${grade}`;

  // Routing anchors
  const isMath4 = subjectSlug === "toan" && grade === 4;
  const isScience4 = subjectSlug === "khoa-hoc" && grade === 4;

  const firstLessonSlug = isMath4
    ? "toan-bai-1"
    : isScience4
    ? "khoahoc-bai-1"
    : "all-23";

  const firstLessonTitle = useMemo(() => {
    if (topics[0] && topics[0].lessons[0]) {
      return topics[0].lessons[0];
    }
    return "Bài 1";
  }, [topics]);

  const tapText = tap !== null
    ? (tap === 1 ? "TẬP MỘT" : "TẬP HAI")
    : "";

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
            params={{ lessonId: firstLessonSlug }}
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
                src={coverUrl}
                alt={bookTitle}
                className="w-full h-auto block"
              />
            </div>
            <div className="absolute -top-3 -right-3 rotate-12 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400 text-amber-950 text-xs font-black shadow-md border-2 border-white">
              <Star className="size-3 fill-amber-950 animate-pulse" /> Mới · Lớp {grade}
            </div>
          </div>

          {/* Book core metadata */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs mb-4 shadow-sm border border-emerald-100">
              <Check className="size-3.5" /> Đã sở hữu · Bám sát SGK GDPT 2018
            </div>
            
            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 leading-none">
              {subjectName} · LỚP {grade} {tapText && `· ${tapText}`}
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-black mt-2 leading-tight text-slate-900 tracking-tight">
              Vở bài tập <span className={keywordColor}>{subjectName} {grade}</span>
            </h1>

            <p className="mt-2 text-base sm:text-lg font-bold text-sky-500 tracking-wide">
              Tích hợp phát triển năng lực số
            </p>

            <p className="mt-4 text-slate-500 leading-relaxed max-w-2xl text-justify text-sm sm:text-[15px] font-medium">
              Cuốn Vở bài tập {subjectName} {grade} được biên soạn bám sát các chủ đề và bài học trong SGK {subjectName} {grade} (Chương trình GDPT 2018), giúp các em học sinh luyện tập và củng cố một cách bài bản và hệ thống. Mỗi bài học có mã QR để truy cập học liệu điện tử và bài tập tương tác.
            </p>

            {/* Stats list */}
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-lg">
              <Stat value={`${topics.length}`} label="Chủ đề" />
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
                  {authorsList}
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
                params={{ lessonId: firstLessonSlug }}
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

          {/* Greeting as italic centered header, book-style */}
          <p className="text-center text-xl font-bold italic text-slate-700 mb-6 font-display">
            {greetingText}
          </p>

          {/* Main body - book typography */}
          <div className="text-slate-700 leading-[1.9] text-[15px] sm:text-base font-[450] space-y-0">
            {prefaceBlocks.map((block, idx) => {
              if (block.type === "bullets") {
                return (
                  <ul key={idx} className="my-3 space-y-1.5 pl-2">
                    {block.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-[5px] size-1.5 rounded-full bg-sky-400 shrink-0" />
                        <span
                          className="text-justify"
                          dangerouslySetInnerHTML={{ __html: boldKeyTerms(item) }}
                        />
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.type === "closing") {
                return (
                  <p
                    key={idx}
                    className="mt-5 text-justify"
                    style={{ textIndent: "2em" }}
                    dangerouslySetInnerHTML={{ __html: block.html }}
                  />
                );
              }
              // Regular paragraph
              return (
                <p
                  key={idx}
                  className="mt-4 text-justify first:mt-0"
                  style={{ textIndent: "2em" }}
                  dangerouslySetInnerHTML={{ __html: block.html }}
                />
              );
            })}

            {/* Signature */}
            <p className="text-right italic pt-6 text-sm font-semibold text-slate-400">— {signatureText}</p>
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
          Bám sát cấu trúc phân phối chương trình chính thức — {topics.length} chủ đề · {totalLessons} bài học
        </p>

        {/* 2-Column Grid of Topics Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {topics.map((topic, topicIdx) => {
            const colorClass = TOPIC_COLORS[topicIdx % TOPIC_COLORS.length];
            const IconComponent = TOPIC_ICONS[topicIdx % TOPIC_ICONS.length] || BookOpen;
            const indexTheme = TOPIC_INDEX_THEMES[topicIdx % TOPIC_INDEX_THEMES.length];

            return (
              <Card
                key={topic.id}
                className="p-0 border border-slate-100 overflow-hidden hover:border-slate-200 hover:shadow-soft transition-all duration-300 flex flex-col h-full rounded-2xl group/card"
              >
                {/* Topic Header */}
                <div className={`bg-gradient-to-r ${colorClass} p-5 text-white flex items-center gap-4 shrink-0`}>
                  <div className="size-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                    <IconComponent className="size-5.5 text-white" />
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
                    const lessonSlug = getLessonSlug(subjectSlug, lesson);

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
            Sẵn sàng chinh phục {subjectName} {grade}?
          </h2>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm sm:text-base font-semibold leading-relaxed">
            Bắt đầu với Bài 1 — {firstLessonTitle}, hoặc xem tổng quan tiến độ học tập của em.
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/student/lesson/$lessonId"
              params={{ lessonId: firstLessonSlug }}
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
          © NXBGDVN - Vở bài tập {subjectName} {grade} (Tích hợp phát triển năng lực số)
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

