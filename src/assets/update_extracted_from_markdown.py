import glob
import re
import json

def clean_markdown_bold(s):
    # Remove markdown bold/italic tags and backslashes
    s = s.replace("**", "").replace("\\", "").strip()
    # Replace markdown italics (*word*) with standard text
    s = s.replace("*", "")
    return s

def parse_md_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split content by book sections starting with `# **lop-` or `# lop-`
    # E.g. "# **lop-4-am-nhac.md**" or "# **lop-4-am-nhac**"
    parts = re.split(r'#\s+\*\*lop-([0-9a-z-]+)(?:\.md)?\*\*', content)
    
    books = {}
    for i in range(1, len(parts), 2):
        book_id = "lop-" + parts[i].strip()
        book_content = parts[i+1]
        
        preface_paras = []
        toc_items = []
        
        # 1. Parse TOC
        # Find content between MỤC LỤC and LỜI NÓI ĐẦU
        toc_match = re.search(r'##\s+\*\*MỤC LỤC\*\*(.*?)(?=##\s+\*\*LỜI NÓI ĐẦU\*\*)', book_content, re.DOTALL | re.IGNORECASE)
        if toc_match:
            toc_text = toc_match.group(1)
            for line in toc_text.split('\n'):
                line = line.strip()
                if not line:
                    continue
                # Heading line (starts with ###)
                if line.startswith('###'):
                    title = line.replace('###', '').strip()
                    title = clean_markdown_bold(title)
                    toc_items.append({
                        "chapter": "",
                        "title": title,
                        "page": ""
                    })
                # Table row (starts with |)
                elif line.startswith('|'):
                    cells = [clean_markdown_bold(c) for c in line.split('|')[1:-1]]
                    if len(cells) >= 2:
                        col1 = cells[0].strip()
                        col2 = cells[1].strip()
                        col3 = cells[2].strip() if len(cells) > 2 else ""
                        
                        # Skip table headers or divider lines
                        if col1.lower() in ['chủ đề', 'bài', 'tuần', 'nội dung', 'trang'] or col2.lower() in ['chủ đề', 'bài', 'tuần', 'nội dung', 'trang']:
                            continue
                        if col1.startswith('---') or col2.startswith('---'):
                            continue
                        
                        toc_items.append({
                            "chapter": col1,
                            "title": col2,
                            "page": col3
                        })
        
        # 2. Parse Preface
        # Find content starting from LỜI NÓI ĐẦU to next section or separator
        preface_match = re.search(r'##\s+\*\*LỜI NÓI ĐẦU\*\*(.*)', book_content, re.DOTALL | re.IGNORECASE)
        if preface_match:
            preface_text = preface_match.group(1)
            # Split by book separator --- if it exists
            preface_text = re.split(r'\n---\n', preface_text)[0]
            
            for line in preface_text.split('\n'):
                line = line.strip()
                if not line:
                    continue
                if line == '---' or line.startswith('#'):
                    continue
                
                # Format bullets as standard bullet character
                if line.startswith('*') or line.startswith('-') or line.startswith('•'):
                    line_content = re.sub(r'^[\*\-\•]\s*', '', line)
                    line_content = clean_markdown_bold(line_content)
                    preface_paras.append("• " + line_content)
                else:
                    line_content = clean_markdown_bold(line)
                    preface_paras.append(line_content)
                    
        cleaned_preface = []
        for p in preface_paras:
            p = p.strip()
            if not p:
                continue
            if p.upper() in ['LỜI NÓI ĐẦU', 'LỜI NÓI ĐẦU.', 'LỜI NÓI ĐẦU!']:
                continue
            cleaned_preface.append(p)
            
        books[book_id] = {
            "preface": cleaned_preface,
            "toc": toc_items
        }
    return books

def get_pdf_key(book_id):
    # Parse grade and subject parts
    match = re.match(r'^lop-(\d+)-(.*)$', book_id)
    if not match:
        return None
    grade = match.group(1)
    subject = match.group(2)
    
    if subject == 'tu-nhien-xa-hoi':
        return f'tnxh-{grade}-full.pdf'
    if subject == 'hoat-dong-trai-nghiem':
        return f'vbt-hdtn-{grade}.pdf'
    if subject == 'lich-su-dia-li':
        return f'vbt-lich-su-dia-li-{grade}filein-2026.pdf'
    if subject == 'tieng-viet-tap-1':
        if grade == '5':
            return 'vbt-tieng-viet-5-tap-1-full.pdf'
        return f'vbt-tieng-viet-{grade}-1.pdf'
    if subject == 'tieng-viet-tap-2':
        if grade == '1':
            return 'vbt-tieng-viet-1-tap2.pdf'
        return f'vbt-tieng-viet-{grade}-2.pdf'
    if subject == 'toan-tap-1':
        if grade in ['1', '2']:
            return f'vbt-toan-{grade}-tap-1.pdf'
        return f'vbt-toan-{grade}-tap-1-full.pdf'
    if subject == 'toan-tap-2':
        if grade in ['1', '2']:
            return f'vbt-toan-{grade}-tap-2.pdf'
        return f'vbt-toan-{grade}-tap-2-full.pdf'
        
    return f'vbt-{subject}-{grade}.pdf'

def main():
    # Load original database
    with open("src/lib/extracted-contents.json", "r", encoding="utf-8") as f:
        db = json.load(f)
    
    # Parse all markdown files
    md_books = {}
    for path in sorted(glob.glob('src/assets/muc-luc-loi-noi-dau/muc-luc-lop-*.md')):
        print(f"Parsing {path}...")
        parsed = parse_md_file(path)
        md_books.update(parsed)
        
    print(f"Total parsed books from Markdown: {len(md_books)}")
    
    # Merge into original database
    overridden_count = 0
    for book_id, data in md_books.items():
        pdf_key = get_pdf_key(book_id)
        if not pdf_key:
            print(f"  [Error] No PDF key mapping found for {book_id}")
            continue
            
        if pdf_key in db:
            # Overwrite preface and toc with markdown data
            db[pdf_key]['preface'] = data['preface']
            db[pdf_key]['toc'] = data['toc']
            overridden_count += 1
        else:
            print(f"  [Warning] PDF key '{pdf_key}' not found in database for book_id '{book_id}'")
            
    print(f"Successfully overridden {overridden_count} books in database!")
    
    # Save the updated database JSON
    with open("src/lib/extracted-contents.json", "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
    print("✓ Updated src/lib/extracted-contents.json successfully!")
    
    # Generate TS file
    print("Regenerating src/lib/extracted-contents.ts...")
    lines = []
    lines.append("// Auto-generated from PDF and Markdown extraction")
    lines.append("export interface BookContent {")
    lines.append("  preface: string[];")
    lines.append("  toc: { chapter: string; title: string; page: string }[];")
    lines.append("}")
    lines.append("")
    lines.append("export const EXTRACTED_CONTENTS: Record<string, BookContent> = {")
    
    for pdf_name, content in sorted(db.items()):
        lines.append(f'  "{pdf_name}": {{')
        
        # Preface
        lines.append('    preface: [')
        for para in content['preface']:
            # Double escape quotes and backslashes
            escaped = para.replace('\\', '\\\\').replace('"', '\\"')
            lines.append(f'      "{escaped}",')
        lines.append('    ],')
        
        # TOC
        lines.append('    toc: [')
        for item in content['toc']:
            ch_esc = item['chapter'].replace('\\', '\\\\').replace('"', '\\"')
            title_esc = item['title'].replace('\\', '\\\\').replace('"', '\\"')
            page_esc = item['page'].replace('\\', '\\\\').replace('"', '\\"')
            lines.append(f'      {{ chapter: "{ch_esc}", title: "{title_esc}", page: "{page_esc}" }},')
        lines.append('    ]')
        
        lines.append('  },')
        
    lines.append("};")
    
    with open("src/lib/extracted-contents.ts", "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
        
    print("✓ Successfully regenerated src/lib/extracted-contents.ts!")

if __name__ == "__main__":
    main()
