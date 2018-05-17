const routes = require('express').Router();
const basicRestHandler = require('./BasicREST/basic-rest.service.server');

routes.get('/test', basicRestHandler.testHandler);

module.exports = routes;
