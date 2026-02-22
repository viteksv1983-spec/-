import sqlite3
conn = sqlite3.connect('backend/sql_app.db')
c = conn.cursor()
c.execute("SELECT slug, image_url FROM category_metadata")
for r in c.fetchall():
    print(f"{r[0]:20s} | {r[1][:80] if r[1] else 'NULL'}")
conn.close()
