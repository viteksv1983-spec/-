from backend.database import engine, Base
from backend.models import Page
from sqlalchemy import text

def update_db():
    print("Creating new tables (if any)...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")

    print("Checking for new columns in 'cakes' table...")
    with engine.connect() as conn:
        # Get existing columns
        result = conn.execute(text("PRAGMA table_info(cakes)"))
        columns = [row.name for row in result]
        
        new_columns = [
            ("meta_title", "VARCHAR"),
            ("meta_description", "VARCHAR"),
            ("meta_keywords", "VARCHAR"),
            ("h1_heading", "VARCHAR"),
            ("canonical_url", "VARCHAR"),
            ("og_title", "VARCHAR"),
            ("og_description", "VARCHAR"),
            ("og_image", "VARCHAR"),
            ("schema_json", "VARCHAR")
        ]

        for col_name, col_type in new_columns:
            if col_name not in columns:
                print(f"Adding column {col_name} to cakes table...")
                try:
                    conn.execute(text(f"ALTER TABLE cakes ADD COLUMN {col_name} {col_type}"))
                    print(f"Column {col_name} added.")
                except Exception as e:
                    print(f"Error adding {col_name}: {e}")
            else:
                print(f"Column {col_name} already exists.")
        
        # Check 'users' table
        result = conn.execute(text("PRAGMA table_info(users)"))
        user_columns = [row.name for row in result]
        if "is_admin" not in user_columns:
            print("Adding column is_admin to users table...")
            try:
                conn.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0"))
                print("Column is_admin added.")
            except Exception as e:
                print(f"Error adding is_admin to users: {e}")
        else:
            print("Column is_admin already exists in users table.")

        # Check 'orders' table
        result = conn.execute(text("PRAGMA table_info(orders)"))
        order_columns = [row.name for row in result]
        if "created_at" not in order_columns:
            print("Adding column created_at to orders table...")
            try:
                # SQLite doesn't always support dynamic defaults in ALTER TABLE
                conn.execute(text("ALTER TABLE orders ADD COLUMN created_at DATETIME"))
                # Optionally set a default for existing rows
                conn.execute(text("UPDATE orders SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL"))
                print("Column created_at added.")
            except Exception as e:
                print(f"Error adding created_at to orders: {e}")
        else:
            print("Column created_at already exists in orders table.")

        conn.commit()
    print("Database update completed.")

if __name__ == "__main__":
    update_db()
