/**
 * @fileOverview
 * Main server file.
 * Loads environment variables
 * Throws error for malformed JSON object
 * Uses routes defined in app/router
 * Initiates server daemon
 */


require('dotenv').config();

/**
 * Load expressjs
 * @type {*|createApplication}
 */
const express = require('express');

/**
 * Load body parser to parse json in request body
 * @type {Parsers|*}
 */
const bodyParser = require('body-parser');

/**
 * Load the router module to route requests
 */
const routes = require('./app/services/router');

/**
 * Error message constructor function to create defined standard error response.
 * @type {constructErrorMessage}
 */
const constructErrorMsg = require('./app/services/BasicREST/basic-rest.service.server').constructErrorMessage;

/**
 * Initialize the application
 */
const app = express();

/**
 * Parse JSON in request body, return error if malformed
 */
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

/**
 * Parse URL encoded arguments
 */
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Use the router service
 */
app.use('/', routes);

/**
 * Port number to run the app on
 * @type {*|number}
 */
// Port number to run the app on
const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

/**
 * Run server
 * @type {http.Server}
 */
const server = app.listen(PORT);

/**
 * Export server for testing
 * @type {http.Server}
 */
module.exports = server;
