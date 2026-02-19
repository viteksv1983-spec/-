import sqlite3
import os

db_path = os.path.join(os.getcwd(), "sql_app.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("Schema for orders table:")
cursor.execute("PRAGMA table_info(orders)")
for col in cursor.fetchall():
    print(col)

print("\nSchema for order_items table:")
cursor.execute("PRAGMA table_info(order_items)")
for col in cursor.fetchall():
    print(col)

conn.close()
