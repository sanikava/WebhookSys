document.addEventListener('DOMContentLoaded', () => {
    fetchNotifications();
    // Refresh notifications every 5 seconds
    setInterval(fetchNotifications, 5000);
});

async function fetchNotifications() {
    try {
        const response = await fetch('/notifications');
        const notifications = await response.json();
        const notificationsList = document.getElementById('notificationsList');
        notificationsList.innerHTML = ''; // Clear existing list

        if (notifications.length === 0) {
            notificationsList.innerHTML = '<li>No notifications received yet.</li>';
            return;
        }

        notifications.forEach(notification => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>Timestamp:</strong> ${notification.timestamp}<br><strong>Data:</strong> ${JSON.stringify(notification.data, null, 2)}`;
            notificationsList.prepend(listItem); // Add new notifications to the top
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        const notificationsList = document.getElementById('notificationsList');
        notificationsList.innerHTML = '<li>Error loading notifications.</li>';
    }
}

async function sendWebhook() {
    const url = document.getElementById('webhookUrl').value;
    const payloadInput = document.getElementById('webhookPayload').value;
    const statusElement = document.getElementById('sendWebhookStatus');

    try {
        const payload = JSON.parse(payloadInput);

        const response = await fetch('/webhook/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url, payload })
        });

        if (response.ok) {
            statusElement.textContent = 'Webhook sent successfully!';
            statusElement.style.color = 'green';
        } else {
            const errorText = await response.text();
            statusElement.textContent = `Failed to send webhook: ${errorText}`;
            statusElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Error sending webhook:', error);
        statusElement.textContent = `Error: ${error.message}`;
        statusElement.style.color = 'red';
    }
}
