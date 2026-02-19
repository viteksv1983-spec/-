import urllib.request
import time

urls = [
    "http://127.0.0.1:8000/static/images/bento_custom_v2_1.png",
    "http://127.0.0.1:8000/static/images/bento_custom_v2_2.png",
    "http://127.0.0.1:8000/static/images/bento_custom_v2_3.png"
]

for url in urls:
    try:
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req) as response:
            print(f"{url}: {response.getcode()}")
    except Exception as e:
        print(f"{url}: Error {e}")
