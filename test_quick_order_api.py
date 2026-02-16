import json
import urllib.request

def test_quick_order():
    url = "http://127.0.0.1:8000/orders/quick"
    data = {
        "customer_name": "API Verify User",
        "customer_phone": "+380999999999",
        "cake_id": 1,
        "quantity": 1,
        "flavor": "TestFlavor",
        "weight": 1.0
    }
    headers = {'Content-Type': 'application/json'}

    print(f"Sending POST request to {url} with data: {data}")
    
    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
        with urllib.request.urlopen(req) as response:
            print(f"Status Code: {response.status}")
            response_body = response.read().decode('utf-8')
            print(f"Response Body: {response_body}")
            return True
    except Exception as e:
        print(f"Failed to send request: {e}")
        return False

if __name__ == "__main__":
    test_quick_order()
