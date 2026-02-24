import sqlite3
import os

db_path = 'backend/sql_app.db'
conn = sqlite3.connect(db_path)
c = conn.cursor()
c.execute("SELECT id, name, image_url FROM cakes WHERE category='bento'")
results = c.fetchall()

print(f"Found {len(results)} bento cakes:")
for r in results:
    print(r)
