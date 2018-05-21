require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./app/services/router');
const constructErrorMsg = require('./app/services/BasicREST/basic-rest.service.server').constructErrorMessage;

const app = express();

// Parse JSON in request body, return error if malformed
app.use((req, res, next) => {
  bodyParser.json({
    type: 'application/json',
  })(req, res, (err) => {
    if (err) {
      res
        .status(400)
        .json(constructErrorMsg(req, 'Malformed JSON'));
      return;
    }
    next();
  });
});


// Parse URL encoded arguments
app.use(bodyParser.urlencoded({ extended: true }));

// Use the router service
app.use('/', routes);

// Port number to run the app on
const PORT = process.env.NODE_PORT || 3000;

// Initialize server
const server = app.listen(PORT);

module.exports = server;
