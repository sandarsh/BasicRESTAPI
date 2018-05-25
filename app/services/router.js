/**
 * @fileOverview
 * Main router file
 * Loads all the services and then calls the handlers defined
 * in those services for specific routes.
 * ...
 * Author: Sandarsh Srivastava
 */

/**
 * Load the router module provided by express.js
 */
const router = require('express').Router();

/**
 * Load Services
 */
const basicRestService = require('./BasicREST/basic-rest.service.server');
const constructErrorMessage = require('./BasicREST/basic-rest.service.server').constructErrorMessage;

/*
Include more services here..
.
.
 */

/**
 * Basic REST service routes and their handlers.
 */
router.post('/api/objects', basicRestService.postHandler);
router.put('/api/objects/:uid', basicRestService.putHandler);
router.get('/api/objects/:uid', basicRestService.getOneHandler);
router.get('/api/objects', basicRestService.getAllHandler);
router.delete('/api/objects/:uid', basicRestService.deleteHandler);
/*
Add routes to other services here
.
.
 */

/**
 * Route to respond to undefined routes with 404
 */
router.use('/', (req, res) => (res.status(404).send(constructErrorMessage(req, 'Not Found'))));

/**
 * Export router module to use in server.js
 */
module.exports = router;
