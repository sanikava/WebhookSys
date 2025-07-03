const express = require('express');
const router = express.Router();

// Endpoint to get all received notifications
router.get('/notifications', (req, res) => {
    res.status(200).json(req.notifications);
});

module.exports = router;
