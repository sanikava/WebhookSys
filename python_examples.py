import requests
import json

BASE_URL = "http://localhost:3000"

def send_webhook_to_system(event_data):
    """Sends a webhook notification to your Node.js system's /webhook/receive endpoint."""
    url = f"{BASE_URL}/webhook/receive"
    headers = {"Content-Type": "application/json"}
    try:
        response = requests.post(url, headers=headers, data=json.dumps(event_data))
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
        print(f"Successfully sent webhook to system: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Error sending webhook to system: {e}")

def trigger_outgoing_webhook(target_url, payload):
    """Tells your Node.js system to send an outgoing webhook to a specified URL."""
    url = f"{BASE_URL}/webhook/send"
    headers = {"Content-Type": "application/json"}
    data = {"url": target_url, "payload": payload}
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        response.raise_for_status()
        print(f"Successfully triggered outgoing webhook: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Error triggering outgoing webhook: {e}")

def get_notifications():
    """Fetches all notifications currently stored in your Node.js system."""
    url = f"{BASE_URL}/notifications"
    try:
        response = requests.get(url)
        response.raise_for_status()
        notifications = response.json()
        print("\n--- Received Notifications ---")
        if notifications:
            for i, notif in enumerate(notifications):
                print(f"Notification {i+1}:")
                print(f"  Timestamp: {notif.get('timestamp')}")
                print(f"  Data: {json.dumps(notif.get('data'), indent=2)}")
        else:
            print("No notifications found.")
        print("----------------------------")
        return notifications
    except requests.exceptions.RequestException as e:
        print(f"Error fetching notifications: {e}")
        return None

if __name__ == "__main__":
    print("--- Python Examples for Webhook System ---")

    # Example 1: Send a webhook to your system
    print("\n>>> Example 1: Sending a webhook to /webhook/receive")
    user_signup_data = {
        "event": "user_registered",
        "user": {
            "id": "py-001",
            "name": "Python User",
            "email": "python@example.com"
        }
    }
    send_webhook_to_system(user_signup_data)

    # Example 2: Trigger an outgoing webhook from your system
    # This will send a webhook from your Node.js server to its own /webhook/receive endpoint
    print("\n>>> Example 2: Triggering an outgoing webhook to /webhook/receive")
    outgoing_payload = {"message": "Hello from Python via Node.js!", "source": "python_script"}
    trigger_outgoing_webhook(f"{BASE_URL}/webhook/receive", outgoing_payload)

    # Give the server a moment to process (especially for the outgoing webhook)
    import time
    time.sleep(1)

    # Example 3: Get all notifications
    print("\n>>> Example 3: Fetching all notifications")
    get_notifications()

    print("\n--- End of Examples ---")
