"""
update_prefaces.py
Updates the preface arrays in extracted-contents.ts with correct, full content from PDFs.
For garbled PDFs (Tập 2 Toán, Tập Viết, etc.), uses content from the corresponding Tập 1
or creates a proper subject-specific template.
"""
import json
import re

# Load extracted prefaces from PDF
with open("src/assets/preface_check.json", "r", encoding="utf-8") as f:
    extracted = json.load(f)

def get_preface_paragraphs(fname):
    """Get only the meaningful preface paragraphs (filter out TOC noise)."""
    content = extracted.get(fname, {})
    paragraphs = content.get("preface_paragraphs", [])
    # Filter: keep paragraphs that look like preface (contain key Vietnamese words)
    result = []
    for p in paragraphs:
        # Skip TOC-like entries, garbled text, noise
        if any(kw in p for kw in ["Bài ", "Chủ đề ", "CHƯƠNG", "Trang", "…..", "......"]):
            continue
        if re.search(r"/uni[0-9A-F]{4}|/[A-Z][a-z]+\.[a-z]+", p):
            continue  # garbled font encoding
        if len(p) < 30:
            continue  # too short to be meaningful
        if any(kw in p for kw in [
            "Các em", "học sinh", "Hi vọng", "Chúc các", "được biên soạn",
            "nhằm giúp", "tác giả", "nhóm tác giả", "phát triển", "luyện tập", "củng cố"
        ]):
            result.append(p.strip())
    return result

# =============================================================================
# MASTER PREFACE MAP: filename -> list of correct paragraphs
# =============================================================================
PREFACE_MAP = {}

# ---- TNXH (Tự nhiên và Xã hội) ----
TNXH_1_2_PREFACE = [
    "Các em học sinh yêu quý! Vở bài tập Tự nhiên và Xã hội (Tích hợp phát triển năng lực số) được biên soạn nhằm giúp các em học tập tốt hơn thông qua những hoạt động gần gũi, phù hợp với lứa tuổi. Trong sách, các em sẽ được đọc, viết, quan sát, vẽ và thực hành qua nhiều bài tập sinh động, giúp củng cố và vận dụng kiến thức đã học vào thực tiễn cuộc sống.",
    "Bên cạnh các hoạt động trên giấy, cuốn sách còn bước đầu mở ra cơ hội để các em làm quen với việc học qua hình ảnh, video và học liệu số phù hợp, từ đó sử dụng công nghệ một cách an toàn và đúng mục đích. Mỗi bài học được thiết kế rõ ràng, dễ hiểu, giúp các em hình thành thói quen học tập tích cực, phát triển tư duy và thêm yêu thích việc học.",
    "Hi vọng cuốn sách sẽ là người bạn đồng hành thân thiết của các em trong những giờ học vui vẻ và bổ ích.",
    "Các tác giả",
]
PREFACE_MAP["tnxh-1-full.pdf"] = TNXH_1_2_PREFACE
PREFACE_MAP["tnxh-2-full.pdf"] = TNXH_1_2_PREFACE
PREFACE_MAP["tnxh-3-full.pdf"] = get_preface_paragraphs("tnxh-3-full.pdf")

# ---- TOÁN ----
TOAN_TEMPLATE_BASE = (
    "Các em yêu quý! Cuốn {title} được biên soạn bám sát các chủ đề và bài học trong sách giáo khoa Toán {grade} "
    "(theo Chương trình sách giáo khoa mới của Bộ Giáo dục và Đào tạo), nhằm giúp các em luyện tập và củng cố "
    "những điều đã học một cách bài bản và hệ thống. Mỗi bài tập là một cơ hội để các em ôn lại kiến thức, "
    "rèn luyện sự cẩn thận và tính kiên trì. Các dạng bài phong phú như lựa chọn đáp án, điền số, trình bày lời giải, "
    "thực hành và trải nghiệm sẽ giúp các em phát triển kĩ năng tính toán, suy luận và giải quyết vấn đề. "
    "Qua từng trang sách, các em sẽ nhận ra rằng Toán học không chỉ là những con số và phép tính mà còn gắn với "
    "những tình huống gần gũi trong cuộc sống hằng ngày."
)
TOAN_MIDDLE = (
    "Khi làm bài, các em hãy đọc kĩ yêu cầu, suy nghĩ và trình bày cẩn thận cách làm của mình. Nếu gặp bài khó, "
    "đừng vội nản lòng. Mỗi lần thử lại và sửa sai là một lần các em tiến bộ hơn. Điều quan trọng không chỉ là "
    "đáp án đúng, mà là cách các em suy nghĩ để tìm ra lời giải."
)
TOAN_DIGITAL = (
    "Đặc biệt hơn nữa, thông qua cuốn vở bài tập này, các em còn có cơ hội phát triển năng lực số. "
    "Phụ huynh có thể cùng các em truy cập học liệu điện tử thông qua mã QR ở từng bài học để xem phiên bản số "
    "của sách và thực hiện các bài tập tương tác từ cơ bản đến nâng cao. Qua đó, các em được tiếp tục rèn luyện, "
    "phát triển tư duy logic, khả năng tính toán và giải quyết các vấn đề trong thực tiễn."
)
TOAN_CLOSING = (
    "Hi vọng cuốn vở bài tập sẽ trở thành người bạn đồng hành thân thiết, giúp các em thêm tự tin, "
    "thêm yêu môn Toán và luôn giữ được niềm vui học tập. Chúc các em chăm chỉ và đạt nhiều thành công!"
)

def make_toan_preface(grade, tap=None):
    if tap:
        title = f"Vở bài tập Toán {grade} – Tập {tap}"
    else:
        title = f"Vở bài tập Toán {grade}"
    return [
        TOAN_TEMPLATE_BASE.format(title=title, grade=grade),
        TOAN_MIDDLE,
        TOAN_DIGITAL,
        TOAN_CLOSING,
        "Các tác giả",
    ]

# Toán 1
PREFACE_MAP["vbt-toan-1-tap-1.pdf"] = get_preface_paragraphs("vbt-toan-1-tap-1.pdf") or make_toan_preface(1, 1)
PREFACE_MAP["vbt-toan-1-tap-2.pdf"] = make_toan_preface(1, 2)
# Toán 2
PREFACE_MAP["vbt-toan-2-tap-1.pdf"] = get_preface_paragraphs("vbt-toan-2-tap-1.pdf") or make_toan_preface(2, 1)
PREFACE_MAP["vbt-toan-2-tap-2.pdf"] = make_toan_preface(2, 2)
# Toán 3
PREFACE_MAP["vbt-toan-3-tap-1-full.pdf"] = get_preface_paragraphs("vbt-toan-3-tap-1-full.pdf") or make_toan_preface(3, 1)
PREFACE_MAP["vbt-toan-3-tap-2-full.pdf"] = make_toan_preface(3, 2)
# Toán 4
PREFACE_MAP["vbt-toan-4-tap-1-full.pdf"] = get_preface_paragraphs("vbt-toan-4-tap-1-full.pdf") or make_toan_preface(4, 1)
PREFACE_MAP["vbt-toan-4-tap-2-full.pdf"] = make_toan_preface(4, 2)
# Toán 5
PREFACE_MAP["vbt-toan-5-tap-1-full.pdf"] = get_preface_paragraphs("vbt-toan-5-tap-1-full.pdf") or make_toan_preface(5, 1)
PREFACE_MAP["vbt-toan-5-tap-2-full.pdf"] = make_toan_preface(5, 2)

# ---- TIẾNG VIỆT ----
TV_PREFACE_TEMPLATE = [
    "Các em học sinh thân mến! Để đồng hành với các em trong hoạt động thực hành tiếng Việt, chúng tôi biên soạn bộ "
    "Vở bài tập Tiếng Việt (từ lớp 1 đến lớp 5). Bộ sách được triển khai theo từng chủ đề và bài học trong sách giáo khoa, "
    "giúp các em rèn luyện và phát triển kĩ năng sử dụng tiếng Việt một cách hiệu quả. Nhóm tác giả đã xây dựng hệ thống "
    "bài tập bám sát nội dung học tập, đơn giản, nhẹ nhàng và sinh động để các em vui học.",
    "Đặc biệt hơn nữa, thông qua bộ Vở bài tập này, các em còn có cơ hội phát triển năng lực số. "
    "Phụ huynh có thể cùng các em truy cập học liệu điện tử thông qua mã QR ở từng bài học để xem sách với phiên bản số "
    "và thực hiện các bài tập tương tác từ cơ bản đến nâng cao với đầy đủ các kĩ năng: Đọc, Viết, Nói và Nghe.",
    "Các em có thể sử dụng cuốn vở này song hành cùng sách giáo khoa để việc học môn Tiếng Việt đạt hiệu quả cao hơn. "
    "Chúc các em học tập vui và đạt kết quả tốt!",
    "Các tác giả",
]
for fname in [
    "vbt-tieng-viet-1-1.pdf", "vbt-tieng-viet-1-tap2.pdf",
    "vbt-tieng-viet-2-1.pdf", "vbt-tieng-viet-2-2.pdf",
    "vbt-tieng-viet-3-1.pdf", "vbt-tieng-viet-3-2.pdf",
    "vbt-tieng-viet-4-1.pdf", "vbt-tieng-viet-4-2.pdf",
    "vbt-tieng-viet-5-tap-1-full.pdf", "vbt-tieng-viet-5-2.pdf",
]:
    PREFACE_MAP[fname] = get_preface_paragraphs(fname) or TV_PREFACE_TEMPLATE

# ---- TẬP VIẾT ----
TAP_VIET_PREFACE = [
    "Các em học sinh thân mến! Cuốn Vở tập viết (Tích hợp phát triển năng lực số) được biên soạn nhằm giúp "
    "các em luyện viết chữ đẹp, đúng quy trình và hình thành thói quen viết cẩn thận, ngăn nắp ngay từ những năm đầu tiểu học. "
    "Nội dung sách bao gồm các bài luyện viết chữ thường, chữ hoa theo mẫu chữ viết trong trường tiểu học, "
    "kết hợp với các bài luyện viết câu, luyện viết tự chọn để các em tự tin hơn trong việc biểu đạt bằng chữ viết.",
    "Thông qua mã QR trong sách, các em có thể truy cập học liệu điện tử, xem video hướng dẫn viết chữ và thực hành "
    "luyện viết trên thiết bị số một cách sinh động, từ đó phát triển năng lực số song song với kĩ năng viết chữ.",
    "Hi vọng cuốn vở sẽ trở thành người bạn đồng hành thân thiết giúp các em hình thành nét chữ đẹp và nết người ngoan. "
    "Chúc các em học tập vui và tiến bộ mỗi ngày!",
    "Các tác giả",
]
for fname in [
    "vo-tap-viet-1-tap-1.pdf", "vo-tap-viet-1-tap-2.pdf",
    "vo-tap-viet-lop2-tap1-filein-full.pdf", "vo-tap-viet-lop2-tap2-filein-full.pdf",
    "vo-tap-viet-3-tap-1.pdf", "vo-tap-viet-lop3-tap2-filein-full.pdf",
]:
    PREFACE_MAP[fname] = TAP_VIET_PREFACE

# ---- KHOA HỌC ----
PREFACE_MAP["vbt-khoa-hoc-4.pdf"] = get_preface_paragraphs("vbt-khoa-hoc-4.pdf")
PREFACE_MAP["vbt-khoa-hoc-5.pdf"] = [
    "Các em học sinh thân mến! Cùng đồng hành với các em trong hoạt động thực hành môn Khoa học là bộ "
    "Vở bài tập Khoa học 5 (Tích hợp phát triển năng lực số) được biên soạn bám sát theo từng chủ đề và bài học "
    "trong sách giáo khoa, giúp các em rèn luyện, củng cố và phát triển kiến thức khoa học một cách hiệu quả.",
    "Nhóm tác giả đã xây dựng hệ thống bài tập vừa bám sát nội dung học tập, vừa đơn giản, nhẹ nhàng, sinh động, "
    "tạo điều kiện để các em củng cố và vận dụng tốt kiến thức đã học. Một điểm đặc biệt là cuốn vở giúp các em "
    "từng bước phát triển năng lực số. Phụ huynh có thể hỗ trợ các em truy cập học liệu điện tử thông qua mã QR "
    "ở từng bài học để xem sách phiên bản số và thực hiện các bài tập tương tác.",
    "Các em có thể sử dụng cuốn vở này song hành cùng sách giáo khoa để việc học tập môn Khoa học đạt hiệu quả cao hơn. "
    "Chúc các em học tập vui và đạt kết quả tốt!",
    "Các tác giả",
]

# ---- LỊCH SỬ VÀ ĐỊA LÍ ----
LSDL4 = get_preface_paragraphs("vbt-lich-su-dia-li-4filein-2026.pdf")
if not LSDL4:
    LSDL4 = [
        "Các em học sinh thân mến! Vở bài tập Lịch sử và Địa lí 4 (Tích hợp phát triển năng lực số) được biên soạn nhằm "
        "giúp các em củng cố kiến thức, rèn luyện kĩ năng, hình thành và phát triển năng lực, phẩm chất theo các yêu cầu "
        "cần đạt của chương trình môn Lịch sử và Địa lí lớp 4 trong Chương trình giáo dục phổ thông 2018.",
        "Nội dung vở bài tập gồm 27 bài với hệ thống bài tập đa dạng như trắc nghiệm, điền khuyết, ghép nối, đúng – sai, "
        "tự luận,… góp phần rèn luyện cho học sinh các kĩ năng như quan sát, nhận xét, trình bày, giải thích; đồng thời, "
        "vở bài tập cũng chú trọng gắn với thực tiễn đời sống và đặc điểm địa phương.",
        "Cùng với phiên bản in, cuốn vở còn được phát hành dưới dạng bản điện tử, tích hợp hệ thống học liệu số phong phú, "
        "giúp các em có thể làm bài tập trực tiếp và kiểm tra kết quả nhanh chóng. Thông qua mã QR ở đầu mỗi bài, "
        "các em có thể dễ dàng truy cập vào các hoạt động học tập tương tác, sinh động và hấp dẫn.",
        "Nhóm tác giả rất mong nhận được ý kiến đóng góp của quý thầy cô giáo, các bậc phụ huynh và các em học sinh "
        "để cuốn vở bài tập ngày càng hoàn thiện hơn.",
        "Các tác giả",
    ]
PREFACE_MAP["vbt-lich-su-dia-li-4filein-2026.pdf"] = LSDL4

PREFACE_MAP["vbt-lich-su-dia-li-5filein-2026.pdf"] = [
    "Các em học sinh thân mến! Vở bài tập Lịch sử và Địa lí 5 (Tích hợp phát triển năng lực số) được biên soạn nhằm "
    "giúp các em củng cố kiến thức, rèn luyện kĩ năng, hình thành và phát triển năng lực, phẩm chất theo yêu cầu cần đạt "
    "của chương trình môn Lịch sử và Địa lí lớp 5 trong Chương trình giáo dục phổ thông 2018.",
    "Cùng với phiên bản in, vở bài tập còn được phát hành dưới dạng bản điện tử, tích hợp hệ thống học liệu số phong phú, "
    "giúp các em làm bài trực tiếp và kiểm tra kết quả nhanh chóng. Thông qua mã QR ở đầu mỗi bài, các em có thể "
    "truy cập vào các hoạt động học tập tương tác, vừa củng cố kiến thức, vừa rèn luyện kĩ năng một cách hiệu quả.",
    "Chúc các em học tập vui, khám phá nhiều điều thú vị về đất nước và con người Việt Nam!",
    "Các tác giả",
]

# ---- TIN HỌC ----
for grade in [3, 4, 5]:
    fname = f"vbt-tin-hoc-{grade}.pdf"
    parsed = get_preface_paragraphs(fname)
    PREFACE_MAP[fname] = parsed if parsed else [
        f"Các em học sinh yêu quý! Cuốn Vở bài tập Tin học {grade} (Tích hợp phát triển năng lực số) được biên soạn nhằm "
        f"hỗ trợ các em thực hiện các hoạt động học tập đa dạng trong quá trình học môn Tin học {grade}. "
        "Nội dung gồm hệ thống bài tập phong phú như đánh dấu, nối hình, viết vào chỗ trống,… giúp các em luyện tập, "
        "củng cố và vận dụng kiến thức đã học trong sách giáo khoa một cách nhẹ nhàng, hứng thú.",
        "Bên cạnh đó, cuốn vở bổ sung các bài tập phát triển năng lực số, giúp các em bước đầu rèn luyện khả năng sử dụng "
        "thiết bị số an toàn, khai thác thông tin đơn giản và vận dụng kiến thức Tin học vào các tình huống gần gũi trong "
        "học tập và đời sống hằng ngày. Thông qua mã QR, các em có thể truy cập học liệu điện tử và thực hiện bài tập tương tác.",
        f"Hi vọng cuốn Vở bài tập Tin học {grade} sẽ trở thành người bạn đồng hành thân thiết, hỗ trợ các em học tập "
        "hiệu quả trong suốt năm học. Chúc các em chăm ngoan, học tốt và đạt nhiều thành công!",
        "Các tác giả",
    ]

# ---- HOẠT ĐỘNG TRẢI NGHIỆM ----
for grade in [1, 2, 3, 4, 5]:
    fname = f"vbt-hdtn-{grade}.pdf"
    parsed = get_preface_paragraphs(fname)
    PREFACE_MAP[fname] = parsed if parsed else [
        f"Các em học sinh thân mến! Vở bài tập Hoạt động trải nghiệm {grade} (Tích hợp phát triển năng lực số) "
        "được biên soạn để đồng hành cùng các em trong các hoạt động học tập và rèn luyện ở trường. "
        f"Cuốn vở được xây dựng theo các chủ đề và bài học của chương trình Hoạt động trải nghiệm {grade} "
        "và sách giáo khoa, giúp các em thực hiện các nhiệm vụ giáo dục ngay trong giờ học.",
        "Thông qua các hoạt động quan sát, chia sẻ, thảo luận và thực hành, các em sẽ có cơ hội tìm hiểu bản thân, "
        "mở rộng hiểu biết về cuộc sống và tích cực tham gia các hoạt động của tập thể. Thông qua mã QR trong sách, "
        "các em có thể truy cập học liệu điện tử và phát triển năng lực số trong học tập.",
        f"Chúc các em học tập tốt và có nhiều trải nghiệm bổ ích!",
        "Các tác giả",
    ]

# ---- ĐẠO ĐỨC ----
for grade in [1, 2, 3, 4, 5]:
    fname = f"vbt-dao-duc-{grade}.pdf"
    parsed = get_preface_paragraphs(fname)
    PREFACE_MAP[fname] = parsed if parsed else [
        f"Các em học sinh thân mến! Vở bài tập Đạo đức {grade} (Tích hợp phát triển năng lực số) được biên soạn "
        "nhằm giúp các em củng cố, rèn luyện và vận dụng những giá trị đạo đức đã học vào cuộc sống hằng ngày. "
        "Mỗi bài học trong vở là một câu chuyện, tình huống gần gũi giúp các em suy nghĩ và lựa chọn cách hành động đúng đắn.",
        "Thông qua mã QR trong sách, các em có thể truy cập học liệu điện tử và thực hiện bài tập tương tác, "
        "từ đó phát triển năng lực số và kĩ năng tự học.",
        f"Hi vọng cuốn vở sẽ giúp các em hình thành những phẩm chất tốt đẹp và trở thành người học sinh ngoan, "
        "sống tốt. Chúc các em học tập vui và tiến bộ mỗi ngày!",
        "Các tác giả",
    ]

# ---- CÔNG NGHỆ ----
for grade in [3, 4, 5]:
    fname = f"vbt-cong-nghe-{grade}.pdf"
    parsed = get_preface_paragraphs(fname)
    PREFACE_MAP[fname] = parsed if parsed else [
        f"Các em học sinh thân mến! Công nghệ là môn học giúp các em khám phá cách con người tạo ra sản phẩm, "
        "sử dụng công cụ, máy móc và ứng dụng khoa học vào đời sống hằng ngày. "
        f"Vở bài tập Công nghệ {grade} (Tích hợp phát triển năng lực số) được biên soạn nhằm hỗ trợ các em: "
        "củng cố kiến thức đã học trong sách giáo khoa; rèn luyện kĩ năng thực hành, quan sát và thiết kế; "
        "phát triển năng lực công nghệ, tư duy sáng tạo và năng lực giải quyết vấn đề.",
        "Khi sử dụng vở bài tập, các em hãy đọc kĩ yêu cầu trước khi thực hiện, làm bài trung thực và tự giác, "
        "mạnh dạn trao đổi, thảo luận cùng bạn bè và thầy cô.",
        f"Hi vọng rằng cuốn vở này sẽ trở thành người bạn đồng hành giúp các em thêm yêu thích môn Công nghệ, "
        "phát triển tư duy sáng tạo và hình thành những kĩ năng cần thiết cho tương lai. "
        "Chúc các em học tập thật vui và đạt nhiều thành công!",
        "Các tác giả",
    ]

# ---- ÂM NHẠC ----
for grade in [1, 2, 3, 4, 5]:
    fname = f"vbt-am-nhac-{grade}.pdf"
    PREFACE_MAP[fname] = [
        f"Các em học sinh thân mến! Vở bài tập Âm nhạc {grade} (Tích hợp phát triển năng lực số) được biên soạn "
        "nhằm giúp các em củng cố và phát triển những kiến thức, kĩ năng âm nhạc đã học, đồng thời khơi dậy "
        "niềm yêu thích với âm nhạc trong cuộc sống hằng ngày.",
        "Các bài tập trong vở được thiết kế đa dạng, sinh động, bao gồm bài tập nghe nhạc, đọc nhạc, vận động theo nhạc "
        "và thực hành nhạc cụ. Thông qua mã QR trong sách, các em có thể nghe các bài hát mẫu, xem video hướng dẫn "
        "và thực hành cùng học liệu điện tử, từ đó phát triển năng lực số song song với năng lực âm nhạc.",
        "Hi vọng cuốn vở sẽ là người bạn đồng hành thú vị, giúp các em thêm yêu thích âm nhạc và học tập vui vẻ. "
        "Chúc các em học tốt và luôn tràn đầy niềm vui!",
        "Các tác giả",
    ]

# ---- MĨ THUẬT ----
for grade in [1, 2, 3, 4, 5]:
    fname = f"vbt-mi-thuat-{grade}.pdf"
    PREFACE_MAP[fname] = [
        f"Các em học sinh thân mến! Vở bài tập Mĩ thuật {grade} (Tích hợp phát triển năng lực số) là tài liệu "
        "giúp các em thực hành và rèn luyện các kĩ năng mĩ thuật theo từng bài học trong sách giáo khoa. "
        "Cuốn vở bao gồm các bài tập quan sát, vẽ, tô màu, thiết kế và thực hành sáng tạo, "
        "giúp các em bộc lộ cảm xúc và phát triển tư duy thẩm mĩ.",
        "Thông qua mã QR trong sách, các em có thể truy cập kho học liệu số với các video hướng dẫn vẽ, "
        "tham khảo tác phẩm nghệ thuật và thực hành sáng tạo trên môi trường số, "
        "từ đó phát triển năng lực số song song với năng lực mĩ thuật.",
        "Hi vọng cuốn vở sẽ khơi dậy niềm đam mê sáng tạo và giúp các em thêm yêu thích môn Mĩ thuật. "
        "Chúc các em học tập vui và sáng tạo thật nhiều!",
        "Các tác giả",
    ]

# Write output
with open("src/assets/preface_map.json", "w", encoding="utf-8") as f:
    json.dump(PREFACE_MAP, f, ensure_ascii=False, indent=2)

print(f"✓ Written {len(PREFACE_MAP)} books to src/assets/preface_map.json")
for fname, paras in sorted(PREFACE_MAP.items()):
    print(f"  {fname}: {len(paras)} paragraphs")
