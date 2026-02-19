import sqlite3
import os
import time

db_path = 'backend/sql_app.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("--- TABLES ---")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    print(tables)
    
    print("\n--- CAKES WITH /media/ PATHS ---")
    cursor.execute("SELECT id, name, image_url, category FROM cakes WHERE image_url LIKE '/media/%'")
    rows = cursor.fetchall()
    for row in rows:
        print(row)
        
    print("\n--- BENTO CAKES ---")
    cursor.execute("SELECT id, name, image_url FROM cakes WHERE category='bento'")
    rows = cursor.fetchall()
    for row in rows:
        print(row)
        
    conn.close()
else:
    print("Database not found")

print("\n--- MEDIA FILES (LAST 24H) ---")
media_dir = 'backend/media'
if os.path.exists(media_dir):
    now = time.time()
    for f in os.listdir(media_dir):
        path = os.path.join(media_dir, f)
        mtime = os.path.getmtime(path)
        if now - mtime < 48 * 3600: # 48 hours
            print(f"{f}: {time.ctime(mtime)}")
else:
    print("Media dir not found")
