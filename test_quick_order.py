import requests
import json

def test_quick_order():
    url = "http://localhost:8000"
    
    # 1. Get a cake ID
    print("Fetching cakes...")
    response = requests.get(f"{url}/cakes/")
    if response.status_code != 200:
        print(f"Failed to fetch cakes: {response.status_code}")
        return
    
    cakes = response.json()
    if not cakes:
        print("No cakes found in database")
        return
    
    cake_id = cakes[0]['id']
    print(f"Using cake ID: {cake_id}")
    
    # 2. Create quick order
    print("Creating quick order...")
    payload = {
        "customer_name": "Test User",
        "customer_phone": "+380991234567",
        "cake_id": cake_id,
        "quantity": 1,
        "flavor": "Шоколадний",
        "weight": 1.5
    }
    
    response = requests.post(f"{url}/orders/quick", json=payload)
    print(f"Response status: {response.status_code}")
    print(f"Response body: {response.text}")
    
    if response.status_code == 200:
        print("Quick order created successfully!")
        order_id = response.json().get("id")
        
        # 3. Verify in orders list
        print("Verifying order in list...")
        # Need token for /orders/
        # Let's try to login as admin first
        login_response = requests.post(f"{url}/token", data={"username": "admin", "password": "admin"})
        if login_response.status_code == 200:
            token = login_response.json().get("access_token")
            headers = {"Authorization": f"Bearer {token}"}
            orders_response = requests.get(f"{url}/orders/", headers=headers)
            orders = orders_response.json()
            
            found = any(o['id'] == order_id for o in orders)
            if found:
                print(f"Order #{order_id} found in admin list!")
            else:
                print(f"Order #{order_id} NOT found in admin list!")
        else:
            print("Failed to login as admin to verify")

if __name__ == "__main__":
    test_quick_order()
