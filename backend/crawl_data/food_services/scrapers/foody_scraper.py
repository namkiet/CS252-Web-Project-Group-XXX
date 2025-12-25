from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.options import Options
from .utils import encode_name

def init_driver(headless=False):
    options = Options()
    options.add_argument("-headless")
    if headless:
        options.add_argument("--headless")
    driver = webdriver.Firefox(options=options)
    return driver

def get_link_from_keyword(driver, name):
    encoded = encode_name(name)
    base_url = 'https://www.foody.vn'
    url = base_url + '/ho-chi-minh/food/dia-diem?q=' + encoded + '&ss=header_search_form'
    driver.get(url)
    wait = WebDriverWait(driver, 10)
    item = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "div.resname > h2 > a"))
    )
    return item.get_attribute("href"), item.text

def get_info_from_url(driver, url, restaurant_name, source_url):
    driver.get(url)
    
    items = []
    
    r_info = None
    wait = WebDriverWait(driver, 10)
    
    try:
        # Chờ từng element trước khi lấy text hoặc attribute
        address = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[itemprop="streetAddress"]'))).text
        img_src = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "pic-place"))).get_attribute("src").split('@')[0]
        ratings = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "microsite-point-avg"))).text

        r_info = {
            "name": restaurant_name,
            "address": address,
            "img_src": img_src,
            "ratings": ratings,
            "url" : source_url
        }

        items = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "delivery-dishes-item")))
    except:
        pass

    dishes = []
    for item in items:
        try:
            title = item.find_element(By.CLASS_NAME, "title-name").text
            price = item.find_element(By.CLASS_NAME, "price").text
            img_src = item.find_element(By.CLASS_NAME, "img-box").get_attribute("src").split('@')[0]
            dishes.append({
                "name": title, 
                "price": price, 
                "img_src": img_src
            })
        except:
            continue
    return r_info, dishes

def scrape_info_from_keyword(driver, keyword, source_url):
    link, r_name = get_link_from_keyword(driver, keyword)
    r_info, dishes_info = get_info_from_url(driver, link, r_name, source_url)
    return r_info, dishes_info