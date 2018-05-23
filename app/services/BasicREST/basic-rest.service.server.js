/**
 * @fileOverview
 * This is the service file that calls the underlying db.service API.
 * This service takes care of request level validation and
 * constructing appropriate responses.
 * ...
 * Some variable reassignments may seem redundant here due to eslint enforcements.
 * Best effort was made to follow these enforcements to uphold coding best practices.
 * ...
 * Author: Sandarsh Srivastava
 */

/**
 * Load the db service responsible for core db operations.
 */
const connection = require('../../db/db.service.js');

/**
 * Constructs the provided standard error object.
 * Eg: {
 *  verb : 'GET',
 *  url : 'https://mydomain.com/api/objects',
 *  message : 'Object not found'
 * }
 * @param req The request body received by server to extract the verb and the URL
 * @param s The message to be sent back in the 'message' attribute.
 * @returns {{verb: string, url: string, message: string}}
 */
function constructErrorMessage(req, s) {
  return {
    verb: req.method,
    url: `http://${req.headers.host}${req.url}`,
    message: s,
  };
}

/**
 * Helper to construct url to be sent by getAllHandler.
 * @param req The request body received by server to extract the host and the URL
 * @param id The to be converted to url
 * @returns {string} The url generated for that id.
 */
function constructIdUrl(req, id) {
  return `http://${req.headers.host}${req.url}/${id}`;
}

/**
 * Handle POST requests to the server.
 * Since the insertOne() API in mongodb does not return the newly inserted object but only the id.
 * This hander makes a subsequent call to findOne() to get the newly inserted object.
 * @param req Express request object
 * @param res Express response object
 */
function postHandler(req, res) {
  if (Object.hasOwnProperty.call(req.body, 'uid') || Object.hasOwnProperty.call(req.body, '_id')) {
    // Filter out objects if they already have a uid as that should be assigned by this service.
    // Filter out objects that have _id field. We cannot support it because of mongodb.
    res
      .status(400)
      .json(constructErrorMessage(req, 'Invalid attribute \'uid\' or \'_id\' in request'));
    return;
  }
  /**
   * Returns just the id of the inserted object
   */
  connection.insertOne(req.body)
    .then((insertMessage) => {
      const param = {
        uid: insertMessage.insertedId,
      };
      /**
       * Find the inserted object
       */
      connection.findOne(param)
        .then((doc) => {
          res
            .status(201)
            .json(doc);
        })
        // Catching for findOne
        .catch(() => {
          res
            .status(400)
            .json(constructErrorMessage(req, 'Unable to POST object'));
        });
    })
    // Catching for insertOne()
    .catch((err) => {
      res
        .status(500)
        .json(constructErrorMessage(req, err.message));
    });
}

/**
 * Handle GET for a single object from the database
 * @param req Express request object
 * @param res Express response object
 */
function getOneHandler(req, res) {
  const { params } = req;
  try {
    connection.findOne(params)
      .then((doc) => {
        res.status(200).json(doc);
      })
      // Catching for findOne()
      .catch(() => {
        res
          .status(404)
          .json(constructErrorMessage(req, 'Object not found'));
      });
  } catch (e) {
    res
      .status(500)
      .json(constructErrorMessage(req, e.message));
  }
}

/**
 * Handle GET request for all the uid's converted to url's
 * @param req Express request object
 * @param res Express response object
 */
function getAllHandler(req, res) {
  connection.getAllIds()
    .then((docs) => {
    // Transform the received JSON array of uid's to JSON array of url's
      const result = docs.map(val => ({ url: constructIdUrl(req, val.uid) }));
      res
        .status(200)
        .json(result);
    })
    // Catch for getAllIds()
    .catch(() => {
      res
        .status(500)
        .json(constructErrorMessage(req, 'Internal server error'));
    });
}

/**
 * Handle PUT request to replace an existing object.
 * @param req Express request object
 * @param res Express response object
 */
function putHandler(req, res) {
  if (Object.hasOwnProperty.call(req.body, '_id')) {
    // Filter out objects that have _id field. We cannot support it because of mongodb.
    res
      .status(400)
      .json(constructErrorMessage(req, 'Invalid attribute \'_id\' in request'));
    return;
  }
  if (req.body.uid !== req.params.uid) {
    // Filter out objects that have that have different uid in body and url.
    res
      .status(400)
      .json(constructErrorMessage(req, 'Id mismatch in body and url'));
    return;
  }
  const obj = req.body;
  connection.putOne(obj)
    .then((doc) => {
      res.status(200).json(doc);
    })
    // Catching for putOne()
    .catch(() => {
      res
        .status(400)
        .json(constructErrorMessage(req, 'Object not found'));
    });
}

/**
 * Handle DELETE request to delete an object
 * @param req
 * @param res
 */
function deleteHandler(req, res) {
  const idObj = req.params;
  connection.deleteOne(idObj)
    .then(() => {
      res.sendStatus(200);
    })
    // Catching for deleteOne()
    .catch(() => {
      res.status(400).json(constructErrorMessage(req, 'Invalid Id'));
    });
}

/**
 * Export functions for the router module.
 * @type {
 * {postHandler: postHandler,
 * putHandler: putHandler,
 * getOneHandler: getOneHandler,
 * getAllHandler: getAllHandler,
 * deleteHandler: deleteHandler,
 * constructErrorMessage:
 * constructErrorMessage}}
 */
module.exports = {
  postHandler,
  putHandler,
  getOneHandler,
  getAllHandler,
  deleteHandler,
  constructErrorMessage,
};
