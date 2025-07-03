const express = require('express');
const router = express.Router();
const axios = require('axios');

// Webhook receiver endpoint
router.post('/webhook/receive', (req, res) => {
    const notification = {
        timestamp: new Date().toISOString(),
        data: req.body
    };
    req.notifications.push(notification);
    console.log('Received webhook:', notification);
    res.status(200).send('Webhook received successfully!');
});

// Webhook sender endpoint
router.post('/webhook/send', async (req, res) => {
    const { url, payload } = req.body;

    if (!url || !payload) {
        return res.status(400).send('URL and payload are required.');
    }

    try {
        await axios.post(url, payload);
        console.log(`Webhook sent to ${url} with payload:`, payload);
        res.status(200).send('Webhook sent successfully!');
    } catch (error) {
        console.error('Error sending webhook:', error.message);
        res.status(500).send('Failed to send webhook.');
    }
});

module.exports = router;
