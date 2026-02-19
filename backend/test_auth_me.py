import requests

def test_login_and_me():
    url = "http://localhost:8000"
    
    # Login
    print("Testing login...")
    response = requests.post(f"{url}/token", data={"username": "admin", "password": "admin"})
    if response.status_code != 200:
        print(f"Login failed: {response.status_code}, {response.text}")
        return
    
    token = response.json().get("access_token")
    print(f"Login successful. Token: {token[:20]}...")
    
    # Get me
    print("Testing /users/me/...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{url}/users/me/", headers=headers)
    print(f"Status color: {response.status_code}")
    print(f"Response: {response.text}")

if __name__ == "__main__":
    test_login_and_me()
