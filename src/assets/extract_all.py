import os
import re
import json
import pypdf

# Directory containing the PDFs
PDF_DIR = "src/assets/muc-luc"
OUTPUT_FILE = "src/lib/extracted-contents.json"

def clean_title(title):
    # Remove trailing dots, underscores, dashes, spaces
    title = re.sub(r'[\.\s_-]+$', '', title)
    title = title.strip()
    return title

def extract_book_data(file_path):
    reader = pypdf.PdfReader(file_path)
    
    toc_text = ""
    preface_text = ""
    
    # 1. Find the page for "Mục lục" and "Lời nói đầu"
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if not text:
            continue
            
        lower_text = text.lower()
        # Keep searching, sometimes multiple pages match
        if "mục lục" in lower_text or "muc luc" in lower_text:
            toc_text = text
        if "lời nói đầu" in lower_text or "loi noi dau" in lower_text:
            preface_text = text
            
    # If not found directly, let's look at page 3 (0-indexed 3) and page 4 for fallbacks
    if not toc_text and len(reader.pages) > 3:
        toc_text = reader.pages[3].extract_text() or ""
    if not preface_text and len(reader.pages) > 4:
        preface_text = reader.pages[4].extract_text() or ""
        
    # Clean up preface text into paragraphs
    preface_paragraphs = []
    if preface_text:
        lines = preface_text.split('\n')
        current_para = []
        for line in lines:
            line = line.strip()
            if not line:
                if current_para:
                    preface_paragraphs.append(" ".join(current_para))
                    current_para = []
                continue
            
            # Skip page numbers or header lines
            if line.isdigit() or line.upper() in ["LỜI NÓI ĐẦU", "LOI NOI DAU", "MỤC LỤC", "MUC LUC"]:
                continue
                
            # If line is signature line
            if line.startswith("—") or "các tác giả" in line.lower() or "tác giả" in line.lower():
                if current_para:
                    preface_paragraphs.append(" ".join(current_para))
                    current_para = []
                preface_paragraphs.append(line)
                continue
                
            current_para.append(line)
            
        if current_para:
            preface_paragraphs.append(" ".join(current_para))
            
    # Clean up TOC text into structured rows
    toc_rows = []
    if toc_text:
        lines = toc_text.split('\n')
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Skip title and headers
            line_upper = line.upper()
            if "MỤC LỤC" in line_upper or "MUC LUC" in line_upper:
                continue
            if "TRANG" in line_upper or "CHỦ ĐỀ" in line_upper or "NỘI DUNG" in line_upper:
                continue
                
            # Match line ending with a page number
            match = re.match(r'^(.*?)\s*(\d+)$', line)
            if match:
                left_part = match.group(1).strip()
                page_num = match.group(2).strip()
                
                chapter = ""
                content = left_part
                
                # Check if it starts with a number like "1", "2"
                num_match = re.match(r'^(\d+)\s+(.*)$', left_part)
                if num_match:
                    chapter = num_match.group(1).strip()
                    content = num_match.group(2).strip()
                else:
                    # Check "Chủ đề X" or "Bài X"
                    prefix_match = re.match(r'^(Chủ đề \d+|Bài \d+)\.?\s*(.*)$', left_part, re.IGNORECASE)
                    if prefix_match:
                        chapter = prefix_match.group(1).strip()
                        content = prefix_match.group(2).strip()
                        
                content = clean_title(content)
                if not content:
                    continue
                    
                toc_rows.append({
                    "chapter": chapter,
                    "title": content,
                    "page": page_num
                })
                
    return {
        "preface": preface_paragraphs,
        "toc": toc_rows
    }

def main():
    books_data = {}
    
    # Iterate over all PDF files in directory
    files = [f for f in os.listdir(PDF_DIR) if f.endswith(".pdf")]
    
    # Sort files to ensure consistency
    files.sort()
    
    for file_name in files:
        file_path = os.path.join(PDF_DIR, file_name)
        try:
            data = extract_book_data(file_path)
            books_data[file_name] = data
            print(f"Success: {file_name} (TOC items: {len(data['toc'])}, Preface paragraphs: {len(data['preface'])})")
        except Exception as e:
            print(f"Error reading {file_name}: {e}")
            
    # Write to JSON file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(books_data, f, ensure_ascii=False, indent=2)
        
    print(f"\nSaved all extracted book contents to: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
