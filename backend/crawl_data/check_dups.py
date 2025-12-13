from service.supabase import get_admin_db

def check_dups(restaurant_name : str):
    db = get_admin_db()
    
    res = (
        db.table("restaurants")
        .select("id")
        .eq("name", restaurant_name)
        .limit(1)
        .execute()
    )
    return bool(res.data)