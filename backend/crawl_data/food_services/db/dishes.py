def get_all(conn, **filters):
    cur = conn.cursor()
    sql = "SELECT * FROM dishes"
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
    existing = get_first(conn, name=fields.get("name"), restaurant_id=fields.get("restaurant_id"))
    if existing:
        return update(conn, **fields)
    return add(conn, **fields)

######################################################## HELPERS ########################################################

def add(conn, **fields):
    cur = conn.cursor()
    cols = ", ".join(fields.keys())
    placeholders = ", ".join(["?"] * len(fields))
    sql = f"INSERT INTO dishes ({cols}) VALUES ({placeholders})"
    cur.execute(sql, list(fields.values()))
    conn.commit()
    return fields.get("name")


def update(conn, **fields):
    if "name" not in fields or "restaurant_id" not in fields:
        raise ValueError("update() requires 'name' and 'restaurant_id' to identify the record")

    record_name = fields.pop("name")
    restaurant_id = fields.pop("restaurant_id")
    cur = conn.cursor()
    set_clause = ", ".join([f"{k} = ?" for k in fields.keys()])
    sql = f"UPDATE dishes SET {set_clause} WHERE name = ? AND restaurant_id = ?"
    cur.execute(sql, list(fields.values()) + [record_name, restaurant_id])
    conn.commit()
    return record_name