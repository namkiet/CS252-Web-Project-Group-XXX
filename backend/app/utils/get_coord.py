from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import re

def get_coords_with_selenium(url_cid):
    chrome_options = Options()
    chrome_options.add_argument("--headless") 
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    try:
        url = url_cid
        # print(f"1. Đang truy cập: {url}")
        driver.get(url)

        timeout = 10
        start_time = time.time()
        
        final_url = ""
        while time.time() - start_time < timeout:
            current_url = driver.current_url

            if "@" in current_url or "!3d" in current_url:
                final_url = current_url
                # print(f"2. Đã redirect xong sau {round(time.time() - start_time, 2)}s")
                break
            
            time.sleep(0.5)
        
        if not final_url:
            final_url = driver.current_url
            print("Time out! Lấy URL hiện tại.")

        # print(f"3. Link cuối cùng: {final_url}")


        lat_match = re.search(r'!3d(-?\d+(\.\d+)?)', final_url)
        lon_match = re.search(r'!4d(-?\d+(\.\d+)?)', final_url)
        
        if lat_match and lon_match:
            return lat_match.group(1), lon_match.group(1)
            
        match_at = re.search(r'@(-?\d+\.\d+),(-?\d+\.\d+)', final_url)
        if match_at:
            return float(match_at.group(1)), float(match_at.group(2))

        return None, None

    except Exception as e:
        print(f"Lỗi: {e}")
        return None, None
    finally:
        driver.quit()

# # --- Chạy thử ---
# cid_input = "15316336336495340637"
# lat, lon = get_coords_with_selenium(cid_input)

# if lat:
#     print(f"✅ KẾT QUẢ: Lat={lat}, Lon={lon}")
# else:
#     print("❌ Không lấy được tọa độ.")