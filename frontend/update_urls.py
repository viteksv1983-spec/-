import os

frontend_dir = r"c:\Users\Виктор\Desktop\интернет магазин торты\frontend\src"

mappings = {
    '/cakes?category=bento': '/bento-torty',
    '/cakes?category=biscuit': '/biskvitni-torty',
    '/cakes?category=mousse': '/musovi-torty',
    '/cakes?category=cupcakes': '/kapkeyki',
    '/cakes?category=gingerbread': '/imbirni-pryaniki',
    "location.search.includes('category=bento')": "location.pathname === '/bento-torty'",
    "location.search.includes('category=biscuit')": "location.pathname === '/biskvitni-torty'",
    "location.search.includes('category=mousse')": "location.pathname === '/musovi-torty'",
    "location.search.includes('category=cupcakes')": "location.pathname === '/kapkeyki'",
    "location.search.includes('category=gingerbread')": "location.pathname === '/imbirni-pryaniki'"
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    # apply explicit string replacements
    for old, new in mappings.items():
        content = content.replace(old, new)
        
    # apply dynamic template replacement
    if "``/cakes?category=${cat.slug}``".replace("`", "") in content:
        content = content.replace("`/cakes?category=${cat.slug}`", "getCategoryUrl(cat.slug)")
        if "import { getCategoryUrl }" not in content:
            # Add import after first line
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if line.startswith('import '):
                    lines.insert(i, "import { getCategoryUrl } from '../utils/urls';")
                    break
            content = '\n'.join(lines)
            
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(frontend_dir):
    for filename in files:
        if filename.endswith('.jsx'):
            process_file(os.path.join(root, filename))

print("Done updating URLs.")
