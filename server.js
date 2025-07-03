const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for notifications (for demonstration purposes)
const notifications = [];

// Middleware
app.use(bodyParser.json()); // To parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(require('./middleware/logger')); // Custom logger middleware

// Pass notifications array to routes that need it
app.use((req, res, next) => {
    req.notifications = notifications;
    next();
});

// Dynamic route loading
const routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach(file => {
    if (file.endsWith('.js')) {
        const route = require(path.join(routesPath, file));
        if (typeof route === 'function') {
            app.use('/', route); // Mount all routes under the root path
        } else if (route.router) {
            app.use(route.basePath || '/', route.router);
        }
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
