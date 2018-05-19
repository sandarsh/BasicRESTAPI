/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const connection = require('../../db/db.service.js');

function constructErrorMessage(req, s) {
  return {
    verb: req.method,
    url: `http://${req.headers.host}${req.url}`,
    message: s,
  };
}

function postHandler(req, res) {
  if (Object.hasOwnProperty.call(req.body, 'uid') || Object.hasOwnProperty.call(req.body, '_id')) {
    res
      .status(400)
      .json(constructErrorMessage(req, 'Invalid attribute \'uid\' or \'_id\' in request'));
    return;
  }
  connection.insertOne(req.body)
    .then((insertMessage) => {
      const param = {
        uid: insertMessage.insertedId,
      };
      connection.findOne(param)
        .then((doc) => {
          res
            .status(201)
            .json(doc);
        })
        .catch(() => {
          res
            .status(400)
            .json(constructErrorMessage(req, 'Unable to POST object'));
        });
    })
    .catch((err) => {
      res
        .status(500)
        .json(constructErrorMessage(req, err.message));
    });
}

function getOneHandler(req, res) {
  const { params } = req;
  try {
    connection.findOne(params)
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch(() => {
        res
          .status(404)
          .json(constructErrorMessage(req, 'Object not found'));
      });
  } catch (e) {
    res
      .status(400)
      .json(constructErrorMessage(req, e.message));
  }
}

function getAllHandler(req, res) {
  connection.getAll()
    .then((docs) => {
      res
        .status(200)
        .json(docs);
    })
    .catch(() => {
      res
        .status(500)
        .json(constructErrorMessage(req, 'Internal server error'));
    });
}

function putHandler(req, res) {
  if (Object.hasOwnProperty.call(req.body, '_id')) {
    res
      .status(400)
      .json(constructErrorMessage(req, 'Invalid attribute \'_id\' in request'));
    return;
  }
  if (req.body.uid !== req.params.uid) {
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
    .catch(() => {
      res
        .status(400)
        .json(constructErrorMessage(req, 'Object not found'));
    });
}

function deleteHandler(req, res) {
  const idObj = req.params;
  connection.deleteOne(idObj)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.status(400).json(constructErrorMessage(req, 'Invalid Id'));
    });
}

module.exports = {
  postHandler,
  putHandler,
  getOneHandler,
  getAllHandler,
  deleteHandler,
  constructErrorMessage,
};
