import os

def replace_font():
    count = 0
    for root, _, files in os.walk('frontend/src'):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.css'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    if "'Oswald', sans-serif" in content:
                        new_content = content.replace("'Oswald', sans-serif", "'Oswald', 'Oswald Fallback', sans-serif")
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        count += 1
                except Exception as e:
                    print(f"Error processing {path}: {e}")
    print(f"Updated {count} files.")

if __name__ == '__main__':
    replace_font()
