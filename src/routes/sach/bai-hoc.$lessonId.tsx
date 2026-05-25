import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
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
import { EXTRACTED_CONTENTS } from "@/lib/extracted-contents";

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

function parsePdfKey(pdfKey: string) {
  const specialReverseMappings: Record<string, { grade: number; subjectSlug: string; tap: number | null }> = {
    "tnxh-1-full.pdf": { grade: 1, subjectSlug: "tu-nhien-xa-hoi", tap: null },
    "tnxh-2-full.pdf": { grade: 2, subjectSlug: "tu-nhien-xa-hoi", tap: null },
    "tnxh-3-full.pdf": { grade: 3, subjectSlug: "tu-nhien-xa-hoi", tap: null },
    "vo-tap-viet-lop2-tap1-filein-full.pdf": { grade: 2, subjectSlug: "tap-viet", tap: 1 },
    "vo-tap-viet-lop2-tap2-filein-full.pdf": { grade: 2, subjectSlug: "tap-viet", tap: 2 },
    "vo-tap-viet-3-tap-1.pdf": { grade: 3, subjectSlug: "tap-viet", tap: 1 },
    "vo-tap-viet-lop3-tap2-filein-full.pdf": { grade: 3, subjectSlug: "tap-viet", tap: 2 },
    "vbt-lich-su-dia-li-4filein-2026.pdf": { grade: 4, subjectSlug: "lich-su-dia-li", tap: null },
    "vbt-lich-su-dia-li-5filein-2026.pdf": { grade: 5, subjectSlug: "lich-su-dia-li", tap: null },
    "vo-tap-viet-1-tap-1.pdf": { grade: 1, subjectSlug: "tap-viet", tap: 1 },
    "vo-tap-viet-1-tap-2.pdf": { grade: 1, subjectSlug: "tap-viet", tap: 2 },
    "vbt-tieng-viet-1-1.pdf": { grade: 1, subjectSlug: "tieng-viet", tap: 1 },
    "vbt-tieng-viet-1-tap2.pdf": { grade: 1, subjectSlug: "tieng-viet", tap: 2 },
    "vbt-tieng-viet-2-1.pdf": { grade: 2, subjectSlug: "tieng-viet", tap: 1 },
    "vbt-tieng-viet-2-2.pdf": { grade: 2, subjectSlug: "tieng-viet", tap: 2 },
    "vbt-tieng-viet-3-1.pdf": { grade: 3, subjectSlug: "tieng-viet", tap: 1 },
    "vbt-tieng-viet-3-2.pdf": { grade: 3, subjectSlug: "tieng-viet", tap: 2 },
    "vbt-tieng-viet-4-1.pdf": { grade: 4, subjectSlug: "tieng-viet", tap: 1 },
    "vbt-tieng-viet-4-2.pdf": { grade: 4, subjectSlug: "tieng-viet", tap: 2 },
    "vbt-tieng-viet-5-tap-1-full.pdf": { grade: 5, subjectSlug: "tieng-viet", tap: 1 },
    "vbt-tieng-viet-5-2.pdf": { grade: 5, subjectSlug: "tieng-viet", tap: 2 },
    "vbt-toan-1-tap-1.pdf": { grade: 1, subjectSlug: "toan", tap: 1 },
    "vbt-toan-1-tap-2.pdf": { grade: 1, subjectSlug: "toan", tap: 2 },
    "vbt-toan-2-tap-1.pdf": { grade: 2, subjectSlug: "toan", tap: 1 },
    "vbt-toan-2-tap-2.pdf": { grade: 2, subjectSlug: "toan", tap: 2 },
    "vbt-toan-3-tap-1-full.pdf": { grade: 3, subjectSlug: "toan", tap: 1 },
    "vbt-toan-3-tap-2-full.pdf": { grade: 3, subjectSlug: "toan", tap: 2 },
    "vbt-toan-4-tap-1-full.pdf": { grade: 4, subjectSlug: "toan", tap: 1 },
    "vbt-toan-4-tap-2-full.pdf": { grade: 4, subjectSlug: "toan", tap: 2 },
    "vbt-toan-5-tap-1-full.pdf": { grade: 5, subjectSlug: "toan", tap: 1 },
    "vbt-toan-5-tap-2-full.pdf": { grade: 5, subjectSlug: "toan", tap: 2 },
  };

  if (specialReverseMappings[pdfKey]) {
    return specialReverseMappings[pdfKey];
  }

  let grade = 4;
  let subjectSlug = "toan";
  let tap: number | null = null;

  if (pdfKey.startsWith("vbt-hdtn-")) {
    const match = pdfKey.match(/^vbt-hdtn-(\d+)/);
    grade = match ? parseInt(match[1], 10) : 1;
    subjectSlug = "hoat-dong-trai-nghiem";
  } else {
    const match = pdfKey.match(/^vbt-([a-z0-9-]+)-(\d+)/);
    if (match) {
      subjectSlug = match[1];
      grade = parseInt(match[2], 10);
    }
  }
  return { grade, subjectSlug, tap };
}

function getCoverImage(grade: number, subjectSlug: string, tap: number | null): string {
  if (subjectSlug === "toan" || subjectSlug === "tieng-viet" || subjectSlug === "tap-viet") {
    const path = `../../assets/bia-sach/lop-${grade}-${subjectSlug}-tap-${tap || 1}.webp`;
    if (BIA_SACH[path]) return BIA_SACH[path];
  }

  if (subjectSlug === "khoa-hoc" || subjectSlug === "lich-su-dia-li") {
    const path = `../../assets/bia-sach/lop-${grade}-${subjectSlug}.webp`;
    if (BIA_SACH[path]) return BIA_SACH[path];

    const fallbackPath = `../../assets/bia-sach/lop-${grade}-tu-nhien-xa-hoi.webp`;
    if (BIA_SACH[fallbackPath]) return BIA_SACH[fallbackPath];
  }

  const directPath = `../../assets/bia-sach/lop-${grade}-${subjectSlug}.webp`;
  if (BIA_SACH[directPath]) return BIA_SACH[directPath];

  return "";
}

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

function getSubjectInfo(subjectSlug: string) {
  let name = "";
  let emoji = "📚";
  let color = "success";
  let themeColor = "text-success bg-success/15 border-success/20";
  let keywordColor = "text-success";

  switch (subjectSlug) {
    case "toan":
      name = "Toán"; emoji = "➗"; color = "primary";
      themeColor = "text-sky-600 bg-sky-50 border-sky-100"; keywordColor = "text-sky-500";
      break;
    case "tieng-viet":
      name = "Tiếng Việt"; emoji = "📖"; color = "destructive";
      themeColor = "text-rose-600 bg-rose-50 border-rose-100"; keywordColor = "text-rose-500";
      break;
    case "tap-viet":
      name = "Tập viết"; emoji = "✍️"; color = "warning";
      themeColor = "text-amber-600 bg-amber-50 border-amber-100"; keywordColor = "text-amber-500";
      break;
    case "khoa-hoc":
      name = "Khoa học"; emoji = "🔬"; color = "success";
      themeColor = "text-emerald-600 bg-emerald-50 border-emerald-100"; keywordColor = "text-emerald-500";
      break;
    case "tu-nhien-xa-hoi":
      name = "Tự nhiên và Xã hội"; emoji = "🌱"; color = "success";
      themeColor = "text-emerald-600 bg-emerald-50 border-emerald-100"; keywordColor = "text-emerald-500";
      break;
    case "lich-su-dia-li":
      name = "Lịch sử và Địa lí"; emoji = "🗺️"; color = "warning";
      themeColor = "text-amber-600 bg-amber-50 border-amber-100"; keywordColor = "text-amber-600";
      break;
    case "tin-hoc":
      name = "Tin học"; emoji = "💻"; color = "info";
      themeColor = "text-cyan-600 bg-cyan-50 border-cyan-100"; keywordColor = "text-cyan-500";
      break;
    case "tieng-anh":
      name = "Tiếng Anh"; emoji = "🌐"; color = "info";
      themeColor = "text-indigo-600 bg-indigo-50 border-indigo-100"; keywordColor = "text-indigo-600";
      break;
    case "am-nhac":
      name = "Âm nhạc"; emoji = "🎵"; color = "fun";
      themeColor = "text-pink-600 bg-pink-50 border-pink-100"; keywordColor = "text-pink-500";
      break;
    case "dao-duc":
      name = "Đạo đức"; emoji = "🤝"; color = "success";
      themeColor = "text-teal-600 bg-teal-50 border-teal-100"; keywordColor = "text-teal-600";
      break;
    case "mi-thuat":
      name = "Mĩ thuật"; emoji = "🎨"; color = "fun";
      themeColor = "text-purple-600 bg-purple-50 border-purple-100"; keywordColor = "text-purple-500";
      break;
    case "cong-nghe":
      name = "Công nghệ"; emoji = "🛠️"; color = "warning";
      themeColor = "text-orange-600 bg-orange-50 border-orange-100"; keywordColor = "text-orange-600";
      break;
    case "hoat-dong-trai-nghiem":
      name = "Hoạt động trải nghiệm"; emoji = "🏕️"; color = "info";
      themeColor = "text-sky-600 bg-sky-50 border-sky-100"; keywordColor = "text-sky-600";
      break;
    default:
      name = subjectSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      break;
  }
  return { name, emoji, color, themeColor, keywordColor };
}

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

function getLessonStaticInfo(lessonId: string) {
  let matchedPdfKey = "";
  let matchedLessonItem: { chapter: string; title: string; page: string } | null = null;
  let topicName = "";

  for (const [pdfKey, content] of Object.entries(EXTRACTED_CONTENTS)) {
    const { subjectSlug } = parsePdfKey(pdfKey);
    let currentHeader = "";
    for (const item of content.toc) {
      if (item.chapter === "" && item.page === "") {
        currentHeader = item.title;
      }
      const slug = getLessonSlug(subjectSlug, item.title);
      if (slug === lessonId) {
        matchedPdfKey = pdfKey;
        matchedLessonItem = item;
        topicName = currentHeader || "Bài học";
        break;
      }
    }
    if (matchedPdfKey) break;
  }

  let grade = 4;
  let subjectSlug = "toan";
  let tap: number | null = null;
  let title = "Bài học";
  let isMath = false;

  if (matchedPdfKey && matchedLessonItem) {
    const parsed = parsePdfKey(matchedPdfKey);
    grade = parsed.grade;
    subjectSlug = parsed.subjectSlug;
    tap = parsed.tap;
    title = matchedLessonItem.title;
    isMath = (subjectSlug === "toan");
  } else {
    isMath = lessonId.startsWith("toan") || lessonId.startsWith("toan-");
    grade = 4;
    subjectSlug = isMath ? "toan" : "khoa-hoc";
    tap = 1;
    const cleanSlug = lessonId.replace(/^(toan|khoahoc|khoa-hoc)-/, "").replace(/-/g, " ");
    title = cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1);
    topicName = isMath ? "Chủ đề 1: Ôn tập và thực hành" : "Chủ đề 1: Nhập môn";
  }

  const { name: subjectName } = getSubjectInfo(subjectSlug);
  const bookName = tap !== null
    ? `Vở bài tập ${subjectName} Lớp ${grade} - Tập ${tap}`
    : `Vở bài tập ${subjectName} Lớp ${grade}`;

  const cover = getCoverImage(grade, subjectSlug, tap);
  const authors = (matchedPdfKey && BOOK_AUTHORS[matchedPdfKey]) || getBookAuthors(grade, subjectSlug);
  const bookId = tap !== null ? `dynamic-${grade}-${subjectSlug}-tap-${tap}` : `dynamic-${grade}-${subjectSlug}`;

  let interactiveLessonId = "all-23";
  if (isMath) {
    if (lessonId.includes("100-000") || lessonId.includes("bai-1")) interactiveLessonId = "toan-bai-1";
    else if (lessonId.includes("bieu-thuc") || lessonId.includes("bai-4")) interactiveLessonId = "toan-bai-4";
    else if (lessonId.includes("do-goc") || lessonId.includes("bai-11")) interactiveLessonId = "toan-bai-11";
    else interactiveLessonId = "toan-bai-1";
  } else {
    if (lessonId.includes("tinh-chat-cua-nuoc") || lessonId.includes("bai-1")) interactiveLessonId = "bai-1";
    else if (lessonId.includes("su-chuyen-the") || lessonId.includes("bai-2")) interactiveLessonId = "bai-2";
    else if (lessonId.includes("bao-ve-nguon-nuoc") || lessonId.includes("bai-3")) interactiveLessonId = "bai-3";
    else if (lessonId.includes("khong-khi") || lessonId.includes("bai-4")) interactiveLessonId = "bai-4";
    else if (lessonId.includes("gio-bao") || lessonId.includes("bai-6")) interactiveLessonId = "bai-6";
    else if (lessonId.includes("vai-tro-cua-anh-sang") || lessonId.includes("bai-9")) interactiveLessonId = "bai-9";
    else interactiveLessonId = "bai-1";
  }

  const pdfPages = [
    {
      pageNum: 1,
      header: title.toUpperCase(),
      paragraphs: [
        `Tài liệu học tập số tích hợp đa tương tác bám sát nội dung Sách Giáo Khoa chuẩn của Bộ Giáo dục và Đào tạo cho bài học: "${title}".`,
        "Mục tiêu bài học: Giúp học sinh chủ động nắm vững kiến thức lý thuyết trọng tâm, thực hành các kỹ năng giải quyết vấn đề và vận dụng kiến thức lý thuyết vào các tình huống thực tế đời sóng hàng ngày.",
        "Thông qua các câu hỏi thông minh, sơ đồ tư duy sinh động và video bài giảng tương tác, các em học sinh sẽ tiếp thu bài học một cách tự nhiên, trực quan và hào hứng.",
      ],
      exercise: `Hoạt động luyện tập gợi ý: Hãy mở vở bài tập và thực hành trả lời các câu hỏi trắc nghiệm, các câu đố vui và bài tập thực hành liên quan đến chủ đề: "${title}".`,
      tip: `💡 Mẹo nhỏ của Ong Chăm Chỉ: Sau khi làm bài tập, các em hãy ấn nút 'Vào làm bài tập số' để nhận ngay phản hồi phân tích chi tiết từ AI nhé!`,
    },
    {
      pageNum: 2,
      header: "Vận dụng thực tiễn & Năng lực số",
      paragraphs: [
        `Mỗi bài học được thiết kế nhằm khơi dậy tư duy sáng tạo của các em học sinh. Việc tự học kết hợp công nghệ giúp các em hình thành thói quen tự nghiên cứu, tìm tòi và phát triển kỹ năng số ngay từ khi còn ngồi trên ghế nhà trường.`,
        "Phụ huynh và giáo viên có thể hỗ trợ các em học tập, đồng hành cùng sự tiến bộ của con thông qua mã QR dẫn đến hệ thống học liệu số với các bài tương tác trực tiếp sinh động và phong phú.",
      ],
      exercise: `Thử thách mở rộng: Thảo luận cùng bạn bè hoặc người thân về ứng dụng thực tế của bài học "${title}" trong cuộc sống xung quanh em.`,
      tip: `🎯 Trải nghiệm tương tác: Hãy ấn nút làm bài tập số ở phía trên để khám phá hệ thống câu hỏi chấm điểm thông minh tích hợp trí tuệ nhân tạo (AI)!`,
    },
  ];

  return {
    title,
    topicName: topicName || (isMath ? "Chủ đề 1: Ôn tập và thực hành" : "Chủ đề 1: Nhập môn"),
    bookName,
    cover,
    authors,
    isMath,
    pdfPages,
    interactiveLessonId,
    bookId,
    grade,
    subjectName,
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
            to="/sach/$bookId"
            params={{ bookId: info.bookId }}
            className="inline-flex items-center gap-2 text-sm md:text-base font-bold text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="size-4" /> Quay lại sách{" "}
            {info.subjectName} Lớp {info.grade}
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
                  <span className="font-bold text-foreground">Lớp {info.grade}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground font-medium">
                    Môn học:
                  </span>
                  <span className="font-bold text-foreground">
                    {info.subjectName}
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
