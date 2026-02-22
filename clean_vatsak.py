import os
from pathlib import Path

def replace_in_files(directory):
    count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.jsx', '.js', '.css', '.html')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    if 'vatsak' in content.lower():
                        # Case insensitive replacement preserving case
                        new_content = content.replace('vatsak', 'antreme').replace('Vatsak', 'Antreme').replace('VATSAK', 'ANTREME')
                        
                        if new_content != content:
                            with open(filepath, 'w', encoding='utf-8') as f:
                                f.write(new_content)
                            count += 1
                            print(f"Updated: {filepath}")
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")
                    
    print(f"Successfully processed {count} files.")

if __name__ == "__main__":
    frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'frontend')
    print(f"Searching in: {frontend_dir}")
    replace_in_files(frontend_dir)
