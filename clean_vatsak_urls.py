import os
import re
from pathlib import Path

def clean_urls_in_files(directory):
    count = 0
    # Regular expression to match https://vatsak.com.ua/...(.png|.jpg)
    pattern = re.compile(r'https://vatsak\.com\.ua[^\s\'"]*\.(png|jpg|jpeg|webp)', re.IGNORECASE)
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.jsx', '.js', '.css', '.html')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    if pattern.search(content):
                        # Replace the found URL with just a placeholder or empty string
                        # Since these are in img src="", an empty string or placeholder is best. Let's use a tiny placeholder or empty string.
                        new_content = pattern.sub('', content)
                        
                        if new_content != content:
                            with open(filepath, 'w', encoding='utf-8') as f:
                                f.write(new_content)
                            count += 1
                            print(f"Removed external URLs from: {filepath}")
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")
                    
    print(f"Successfully processed {count} files for external URLs.")

if __name__ == "__main__":
    frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'frontend')
    print(f"Searching in: {frontend_dir}")
    clean_urls_in_files(frontend_dir)
