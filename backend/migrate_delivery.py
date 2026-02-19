import sqlite3
import os

db_path = os.path.join(os.getcwd(), "sql_app.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("Applying migrations to 'orders' table...")

try:
    cursor.execute("ALTER TABLE orders ADD COLUMN delivery_method VARCHAR")
    print("Added 'delivery_method' column.")
except sqlite3.OperationalError:
    print("'delivery_method' column already exists.")

try:
    cursor.execute("ALTER TABLE orders ADD COLUMN delivery_date VARCHAR")
    print("Added 'delivery_date' column.")
except sqlite3.OperationalError:
    print("'delivery_date' column already exists.")

conn.commit()
conn.close()
print("Migration completed.")
