import urllib.request
import json

url = "http://127.0.0.1:8000/cakes/?limit=5"

try:
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode())
        print(json.dumps(data, indent=2, ensure_ascii=False))
except Exception as e:
    print(f"Error: {e}")
