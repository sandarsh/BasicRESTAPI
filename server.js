const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./services/router');

const app = express();

// Parse JSON in request body
app.use(bodyParser.json({ type: 'application/json' }));

// Parse URL encoded arguments
app.use(bodyParser.urlencoded({ extended: true }));

// Use the router service
app.use('/', routes);

// Port number to run the app on
const PORT = 3000;

// Initialize server
app.listen(PORT, () => { console.log('Listening on port:', PORT); });
