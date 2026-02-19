import urllib.request

urls = [
    "http://127.0.0.1:8000/static/images/bento_1.png",
    "http://127.0.0.1:8000/static/images/bento_2.png",
    "http://127.0.0.1:8000/static/images/bento_3.png"
]

for url in urls:
    try:
        # Use HEAD request via Method argument if possible, but GET is fine for images
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req) as response:
            print(f"{url}: {response.getcode()}")
    except Exception as e:
        print(f"{url}: Error {e}")
