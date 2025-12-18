import sqlite3

def init_db(db_path, timeout=10):
    conn = sqlite3.connect(db_path, timeout=timeout)
    # cur.execute("DROP TABLE IF EXISTS restaurants")
    # conn.commit()
    
    conn.execute("PRAGMA foreign_keys = ON")

    cur = conn.cursor()
    
    cur.execute("""
        CREATE TABLE IF NOT EXISTS restaurants(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            img_src TEXT,
            ratings REAL,
            url TEXT
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS dishes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            img_src TEXT,
            price INTEGER,
            restaurant_id INTEGER NOT NULL,
            FOREIGN KEY(restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
        )   
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS search_history(
            name TEXT UNIQUE NOT NULL,
            restaurant_id INTEGER NOT NULL,
            FOREIGN KEY(restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
        )   
    """)

    conn.commit()
    return conn