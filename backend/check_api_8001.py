import urllib.request
import json
import time

url = "http://127.0.0.1:8001/cakes/?limit=5"

# Verify that the server is up
# Try for 5 seconds
start_time = time.time()
while time.time() - start_time < 5:
    try:
        urllib.request.urlopen("http://127.0.0.1:8001/health", timeout=1)
        break
    except:
        time.sleep(0.5)

try:
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode())
        print(json.dumps(data, indent=2, ensure_ascii=False))
except Exception as e:
    print(f"Error: {e}")
