import os
import time
import json
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

# Configuration
FACEBOOK_PAGE_URL = "https://www.facebook.com/sveetdesert/photos"
OUTPUT_DIR = os.path.join("backend", "static", "images", "facebook")
JSON_OUTPUT = os.path.join("backend", "scraped_products.json")
TARGET_IMAGE_COUNT = 60

def setup_driver():
    options = Options()
    # options.add_argument("--headless")  # Run in headless mode
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-notifications")
    options.add_argument("--window-size=1920,1080")
    
    # User agent to avoid detection
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    return driver

def download_image(url, folder, filename):
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            filepath = os.path.join(folder, filename)
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return filepath
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return None

def scrape_facebook_photos():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    driver = setup_driver()
    data = []
    
    try:
        print(f"Navigating to {FACEBOOK_PAGE_URL}...")
        driver.get(FACEBOOK_PAGE_URL)
        
        # Handle cookie consent if it appears (this is tricky as it varies)
        # For now, we'll wait a bit and hope we can scroll
        time.sleep(5) 
        
        # Close login popup if it appears (Facebook often forces login)
        try:
            close_button = driver.find_element(By.XPATH, "//div[@aria-label='Close']")
            close_button.click()
            print("Closed login popup.")
        except:
            pass

        image_urls = set()
        scraped_count = 0
        scroll_attempts = 0
        
        while len(image_urls) < TARGET_IMAGE_COUNT and scroll_attempts < 30:
            # Find all images
            images = driver.find_elements(By.TAG_NAME, "img")
            
            for img in images:
                try:
                    src = img.get_attribute("src")
                    if not src or "scontent" not in src:
                        continue
                        
                    # Filter by display size to find actual product photos
                    width = int(img.get_attribute("width") or 0)
                    height = int(img.get_attribute("height") or 0)
                    
                    if width < 300 or height < 300:
                        continue

                    # Some Facebook images don't have srcset but are high res
                    # We prioritize those that have a high display width
                    if src not in [u[0] for u in image_urls]:
                        alt_text = img.get_attribute("alt")
                        if not alt_text or "Нет описания" in alt_text:
                            alt_text = "Delicious custom dessert"
                        
                        image_urls.add((src, alt_text))
                        print(f"Added high-quality candidate: {width}x{height}")
                        
                        if len(image_urls) >= TARGET_IMAGE_COUNT:
                            break
                except:
                    continue
            
            # Scroll down
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(3)
            scroll_attempts += 1
            
        print(f"Scraping complete. Found {len(image_urls)} unique images.")
        print(f"Current URL: {driver.current_url}")
        
        # DEBUG: Save page source
        with open("facebook_debug.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
        print("Saved page source to facebook_debug.html")

        # Download images
        for i, (url, desc) in enumerate(image_urls):
            filename = f"fb_product_{i+1}.jpg"
            relative_path = os.path.join("/static/images/facebook", filename) # Path for DB
             # Important: The download function needs the absolute system path
            download_path = download_image(url, OUTPUT_DIR, filename)
            
            if download_path:
                data.append({
                    "image_url": relative_path.replace("\\", "/"), # Ensure forward slashes for URL
                    "description": desc
                })
                print(f"Downloaded {filename}")
                
        # Save JSON
        with open(JSON_OUTPUT, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"Saved metadata to {JSON_OUTPUT}")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    scrape_facebook_photos()
