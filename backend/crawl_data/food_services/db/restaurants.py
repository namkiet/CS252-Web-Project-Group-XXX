def get_all(conn, **filters):
    cur = conn.cursor()
    sql = "SELECT * FROM restaurants"
    params = []

    if filters:
        conditions = []
        for key, value in filters.items():
            conditions.append(f"{key} = ?")
            params.append(value)
        sql += " WHERE " + " AND ".join(conditions)

    cur.execute(sql, params)
    cols = [col[0] for col in cur.description]
    conn.commit()
    return [dict(zip(cols, row)) for row in cur.fetchall()]


def get_first(conn, **filters):
    results = get_all(conn, **filters)
    return results[0] if results else None

def add_or_update(conn, **fields):
    existing = get_first(conn, name=fields.get("name"), address=fields.get("address"))
    if existing:
        return update(conn, **fields)
    return add(conn, **fields)

######################################################## HELPERS ########################################################

def add(conn, **fields):
    cur = conn.cursor()
    cols = ", ".join(fields.keys())
    placeholders = ", ".join(["?"] * len(fields))
    sql = f"INSERT INTO restaurants ({cols}) VALUES ({placeholders})"
    cur.execute(sql, list(fields.values()))
    conn.commit()
    return cur.lastrowid


def update(conn, **fields):
    if "name" not in fields or "address" not in fields:
        raise ValueError("update() requires 'name' and 'address' to identify the record")

    name = fields.pop("name")
    address = fields.pop("address")

    cur = conn.cursor()

    cur.execute(
        "SELECT id FROM restaurants WHERE name = ? AND address = ?",
        (name, address)
    )
    row = cur.fetchone()
    if not row:
        return None
    record_id = row[0]

    # --- STEP 2: update fields ---
    set_clause = ", ".join([f"{k} = ?" for k in fields.keys()])
    sql = f"UPDATE restaurants SET {set_clause} WHERE id = ?"

    cur.execute(sql, list(fields.values()) + [record_id])
    conn.commit()

    return record_id