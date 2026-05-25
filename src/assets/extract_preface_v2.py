"""
extract_preface_v2.py
Extracts full "Lời nói đầu" (preface) text from all PDFs in the muc-luc directory.
Handles multi-page prefaces, cleans noise, and outputs a JSON mapping:
  { "filename.pdf": { "preface_raw": "...", "preface_paragraphs": [...] } }
"""
import os
import re
import json
import pypdf

PDF_DIR = "src/assets/muc-luc"
OUTPUT_FILE = "src/assets/preface_check.json"

NOISE_LINES = {
    "LỜI NÓI ĐẦU", "LOI NOI DAU", "MỤC LỤC", "MUC LUC",
    "TRANG", "NỘI DUNG", "CHỦ ĐỀ", "PAGE",
}

def clean_line(line):
    line = line.strip()
    # Remove lines that are only digits (page numbers)
    if re.match(r'^\d+$', line):
        return None
    # Remove known noise
    if line.upper() in NOISE_LINES:
        return None
    # Remove lines that are clearly TOC entries (e.g., "Bài 1 .............. 5")
    if re.search(r'\.{4,}\s*\d+\s*$', line):
        return None
    return line


def is_preface_start(text_lower):
    return "lời nói đầu" in text_lower or "loi noi dau" in text_lower


def is_toc_start(text_lower):
    return "mục lục" in text_lower or "muc luc" in text_lower


def extract_preface(file_path):
    reader = pypdf.PdfReader(file_path)
    total_pages = len(reader.pages)

    # Phase 1: find the page(s) that contain the preface
    preface_page_indices = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        if is_preface_start(text.lower()):
            preface_page_indices.append(i)

    if not preface_page_indices:
        # Fallback: try first 6 pages
        for i in range(min(6, total_pages)):
            text = reader.pages[i].extract_text() or ""
            if text.strip():
                preface_page_indices = [i]
                break

    if not preface_page_indices:
        return {"preface_raw": "", "preface_paragraphs": []}

    # Phase 2: collect all preface pages
    # Start from first detected page; stop when we hit TOC or next chapter
    start_idx = preface_page_indices[0]
    collected_text_parts = []

    for i in range(start_idx, min(start_idx + 4, total_pages)):
        page_text = reader.pages[i].extract_text() or ""
        lower = page_text.lower()
        # Once we hit a clear TOC page (that is NOT the preface page), stop
        if i > start_idx and is_toc_start(lower) and not is_preface_start(lower):
            break
        collected_text_parts.append(page_text)

    raw_full = "\n".join(collected_text_parts)

    # Phase 3: clean up
    # Remove duplicate "LỜI NÓI ĐẦU" occurrences at the start
    raw_full = re.sub(r'^(LỜI NÓI ĐẦULỜI NÓI ĐẦU|LỜI NÓI ĐẦU\s*)+', '', raw_full, flags=re.IGNORECASE).strip()
    raw_full = re.sub(r'^(LỜI NÓI ĐẦU\s*){1,}', '', raw_full, flags=re.IGNORECASE).strip()

    # Split into lines and clean
    lines = raw_full.split('\n')
    cleaned_lines = []
    for line in lines:
        cl = clean_line(line)
        if cl is not None:
            cleaned_lines.append(cl)

    # Phase 4: join into paragraphs
    # Group by empty lines; or by heuristic (bullet markers, sentence endings)
    paragraphs = []
    current_para = []

    for line in cleaned_lines:
        if not line:
            if current_para:
                para_text = " ".join(current_para).strip()
                if para_text:
                    paragraphs.append(para_text)
                current_para = []
            continue

        # If line starts with bullet variants, treat as its own item
        if re.match(r'^[•\-–]\s*', line) or re.match(r'^•\t', line):
            if current_para:
                paragraphs.append(" ".join(current_para).strip())
                current_para = []
            paragraphs.append(line)
            continue

        # Signature line
        if (line.startswith("—") or
                re.search(r'các tác giả', line, re.IGNORECASE) or
                re.search(r'nhóm tác giả\s*$', line, re.IGNORECASE) or
                re.search(r'ban biên soạn\s*$', line, re.IGNORECASE)):
            if current_para:
                paragraphs.append(" ".join(current_para).strip())
                current_para = []
            paragraphs.append(line.strip())
            continue

        current_para.append(line)

    if current_para:
        paragraphs.append(" ".join(current_para).strip())

    # Filter empty
    paragraphs = [p for p in paragraphs if p.strip()]

    # Also construct a single raw string for easy reading
    preface_raw = " ".join(paragraphs)

    return {
        "preface_raw": preface_raw,
        "preface_paragraphs": paragraphs,
    }


def main():
    results = {}
    files = sorted([f for f in os.listdir(PDF_DIR) if f.endswith(".pdf")])

    for fname in files:
        fpath = os.path.join(PDF_DIR, fname)
        try:
            data = extract_preface(fpath)
            results[fname] = data
            n = len(data["preface_paragraphs"])
            preview = data["preface_raw"][:120].replace("\n", " ")
            print(f"[OK]  {fname} ({n} paragraphs) | {preview}...")
        except Exception as e:
            print(f"[ERR] {fname}: {e}")
            results[fname] = {"preface_raw": "", "preface_paragraphs": [], "error": str(e)}

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Saved to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
