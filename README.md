<h1><u><b>I am Back my friends i will now make new projects like before check this new project until then</b></u></h1>



# Webhook Notification System

This project implements a flexible webhook notification system using Node.js and Express.js. It allows for receiving incoming webhooks, sending outgoing webhooks, and provides a simple client interface to view received notifications.

### Check my Master branches for code
# follow me for updates and wait for My New Projects 

## Features

-   **Webhook Receiver**: An endpoint to listen for and store incoming POST requests (notifications).
-   **Webhook Sender**: An endpoint to trigger sending a POST request to a specified external URL.
-   **Modular Routes**: API endpoints are organized into separate route files for better maintainability.
-   **Custom Middleware**: Includes a basic logging middleware.
-   **In-Memory Storage**: Notifications are stored in memory for demonstration purposes (data is lost on server restart).
-   **Simple Web Client**: A basic HTML/JavaScript client to display received notifications and send test webhooks.

## File Structure

```
.gitignore
package.json
package-lock.json
README.md
server.js
├── middleware/
│   └── logger.js
├── public/
│   ├── client.js
│   └── index.html
└── routes/
    ├── notificationRoutes.js
    └── webhookRoutes.js
```

## Technologies Used

-   **Node.js**: JavaScript runtime environment.
-   **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
-   **Axios**: Promise-based HTTP client for the browser and Node.js (used for sending webhooks).
-   **npm**: Node.js package manager.

## Setup and Installation

To set up and run the project locally, follow these steps:

1.  **Clone the repository (if applicable) or navigate to the project directory.**

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the server:**
    ```bash
    npm start
    ```
    The server will typically run on `http://localhost:3000` (or the port specified by the `PORT` environment variable).

## API Endpoints

This system exposes the following API endpoints:

### 1. `POST /webhook/receive`

-   **Description**: Receives incoming webhook notifications. The payload of the incoming request is stored in the server's in-memory notification list.
-   **Method**: `POST`
-   **URL**: `/webhook/receive`
-   **Request Body**: Any JSON payload.
    ```json
    {
        "event": "user_created",
        "data": {
            "id": "123",
            "name": "John Doe",
            "email": "john.doe@example.com"
        }
    }
    ```
-   **Response**: `200 OK` with a success message.
    ```
    Webhook received successfully!
    ```
-   **Example `curl` command:**
    ```bash
    curl -X POST \
         -H "Content-Type: application/json" \
         -d '{"event": "order_placed", "orderId": "XYZ789"}' \
         http://localhost:3000/webhook/receive
    ```

### 2. `POST /webhook/send`

-   **Description**: Triggers an outgoing webhook to a specified URL with a given payload. This endpoint acts as a proxy or a way to simulate sending webhooks from your system.
-   **Method**: `POST`
-   **URL**: `/webhook/send`
-   **Request Body**: JSON object containing `url` (the target URL for the webhook) and `payload` (the JSON data to send).
    ```json
    {
        "url": "http://example.com/external-webhook-listener",
        "payload": {
            "message": "Hello from my webhook system!",
            "status": "success"
        }
    }
    ```
-   **Response**: `200 OK` with a success message or `500 Internal Server Error` if sending fails.
    ```
    Webhook sent successfully!
    ```
-   **Example `curl` command (sending to your own receive endpoint):**
    ```bash
    curl -X POST \
         -H "Content-Type: application/json" \
         -d '{"url": "http://localhost:3000/webhook/receive", "payload": {"test": "data"}}' \
         http://localhost:3000/webhook/send
    ```

### 3. `GET /notifications`

-   **Description**: Retrieves all notifications currently stored in the server's memory.
-   **Method**: `GET`
-   **URL**: `/notifications`
-   **Request Body**: None.
-   **Response**: JSON array of received notifications.
    ```json
    [
        {
            "timestamp": "2023-10-27T10:00:00.000Z",
            "data": {
                "event": "user_created",
                "data": {
                    "id": "123",
                    "name": "John Doe"
                }
            }
        },
        {
            "timestamp": "2023-10-27T10:05:00.000Z",
            "data": {
                "event": "order_placed",
                "orderId": "XYZ789"
            }
        }
    ]
    ```
-   **Example `curl` command:**
    ```bash
    curl http://localhost:3000/notifications
    ```

## Client-Side Usage

Once the server is running, you can access the simple web client by navigating to `http://localhost:3000/` in your web browser. This client provides:

-   A form to send test webhooks to any URL (defaults to your `/webhook/receive` endpoint).
-   A real-time (via polling) display of all notifications received by your server.

## Important Notes

-   **In-Memory Storage**: The current implementation uses an in-memory array (`notifications`) to store received webhooks. This means all data will be lost when the Node.js server restarts. For a production environment, you would integrate a persistent database (e.g., MongoDB, PostgreSQL, MySQL, etc.).
-   **Error Handling**: Basic error handling is in place, but a production system would require more robust error management and logging.
-   **Security**: This example does not include authentication, authorization, or advanced security measures. For production use, consider implementing API keys, OAuth, or other security protocols.
-   **Real-time Updates**: The client uses polling to fetch new notifications. For true real-time updates, consider implementing WebSockets (e.g., with Socket.IO).

```
