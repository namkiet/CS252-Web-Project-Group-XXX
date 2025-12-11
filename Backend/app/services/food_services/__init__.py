import app.services.food_services.db as db
import app.services.food_services.db.dishes as dishes
import app.services.food_services.db.restaurants as restaurants
import app.services.food_services.db.search_history as search_history

import time
import json
import traceback

from app.services.food_services.scrapers.foody_scraper import init_driver, get_link_from_keyword, get_info_from_url

def get_or_scrape_restaurant(conn, keyword):
    keyword = keyword.lower()

    entry = search_history.get_first(conn, name=keyword)

    # Đã từng search
    if entry:                    
        print(f"Đã từng cào: {keyword}")               
        r_id = entry.get("restaurant_id")
        r = restaurants.get_first(conn, id=r_id)
        return r
    
    # Chưa từng search
    else:
        with init_driver(headless=False) as driver:
            try:
                link, r_name = get_link_from_keyword(driver, keyword)
            except:
                return None

            r = restaurants.get_first(conn, name=r_name)

            # Đã từng cào
            if r:
                search_history.add_or_update(conn, name=keyword, restaurant_id=r["id"])
                return r

            # Chư từng cào
            try:
                r_info, dishes_info = get_info_from_url(driver, link, r_name)
                r_id = restaurants.add_or_update(conn, **r_info)
                for dish_info in dishes_info:
                    print(dish_info["name"], r_id)
                    dishes.add_or_update(conn, **dish_info, restaurant_id=r_id)
                search_history.add_or_update(conn, name=keyword, restaurant_id=r_id)
                print(f"Đã cào xong: {keyword}")
                return restaurants.get_first(conn, id=r_id)
            except Exception as e:
                print(f"Lỗi khi cào {keyword}: {e}")
                traceback.print_exc()
                return None
        
def get_restaurant_json(conn, r):
    r_dishes = [
        {
            "id": d.get("id", ""),
            "name": d.get("name", ""),
            "price": d.get("price", ""),
            "img_src": d.get("img_src", "")
        } for d in dishes.get_all(conn, restaurant_id=r["id"])
    ]
    return {
        "id": r.get("id", ""),
        "name": r.get("name", ""),
        "img_src": r.get("img_src", ""),
        "ratings": r.get("ratings", ""),
        "address": r.get("address", ""),
        "dishes": r_dishes
    }

def get_data_from_keywords(keywords):

    results = []

    for kw in keywords:
        print(kw)
        with db.init_db("table.db", timeout=10) as conn:
            r = get_or_scrape_restaurant(conn, kw)
            if r:
                results.append(get_restaurant_json(conn, r))


    print("Đã lấy data thành công")
    return results

if __name__ == "__main__":
    # Đọc file và tách bằng dấu ,
    with open("keywords.txt", "r", encoding="utf-8") as f:
        content = f.read()  # đọc toàn bộ file thành 1 string
    keywords = [kw.strip() for kw in content.split(",") if kw.strip()]
    print(len(keywords))
    start_time = time.perf_counter()
    get_data_from_keywords(keywords)
    end_time = time.perf_counter()
    elapsed_time = end_time - start_time
    print(f"Đã cào xong trong {elapsed_time:.2f} giây")