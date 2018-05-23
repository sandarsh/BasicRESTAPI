/**
 * @fileOverview
 * This file is the core db operations file. The code here performs two major tasks
 * 1. Perform db operations and ensure that every connection that is opened is
 *    also closed so there are no unnecessary open connections
 * 2. Performs the translations from mongodb's '_id' format to the user specified
 *    'uid' format. This has been handled here to provide abstraction to the api above
 *    it so they don't have to deal with this conversion from _id to uid.
 * ...
 * Some variable reassignments may seem redundant here due to eslint enforcements.
 * Best effort was made to follow these enforcements to uphold coding best practices.
 * ...
 * Author: Sandarsh Srivastava
 */

/**
 * Bypass eslint to allow leading underscores. Used for mongo's _id variable
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

/**
 * Require ObjectID from mongodb to create new objectsId's
 */
const ObjectId = require('mongodb').ObjectID;

/**
 * mongoClient to open connection to mongodb
 */
const mongoClient = require('mongodb').MongoClient;

/**
 * Form connection url based on environment variables
 */
let url;
if (process.env.NODE_ENV === 'local') {
  url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;
} else {
  url = `mongodb://${process.env.DB_USERNAME}:\
  ${process.env.DB_PASSWORD}@${process.env.DB_HOST}:\
  ${process.env.DB_PORT}/${process.env.DB_NAME}`;
}

/**
 * Populate dbname from environment variable
 * @type {*|string}
 */
const dbName = process.env.DB_NAME || 'test';

/**
 * Populate collection name from environment variable
 * @type {*|string}
 */
const collectionName = process.env.DB_COLLECTION || 'test';

/**
 * Open connection to the database
 * @returns {Promise} Resolves or rejects to parameters returned by mongoClient.connect.
 */
function open() {
  return new Promise((resolve, reject) => {
    mongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
      if (err) {
        reject(err);
      } else {
        resolve(client);
      }
    });
  });
}

/**
 * Close connection to the database
 * @param client The client object created by calling the mongoClient.connect method
 */
function close(client) {
  if (client !== null) {
    client.close((err) => {
      if (err) {
        // Insert some log here
      } else {
        // Insert some log here as well
      }
    });
  }
}

/**
 * Finds the given param in the database
 * @param params uid of the object to find, as json. Eg. param = {uid : "98437234ho32423"}
 * @returns {Promise} Resolves to received document. Rejects to thrown exception or errors
 */
function findOne(params) {
  return new Promise((resolve, reject) => {
    open()
      .then((client) => {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        try {
          collection.findOne({ _id: new ObjectId(params.uid) })
            .then((doc) => {
              const resDoc = doc;
              resDoc.uid = resDoc._id;
              delete resDoc._id;
              resolve(doc);
              close(client);
            })
            // Catching for findOne()
            .catch((err) => {
              reject(err);
              close(client);
            });
          // Catching for new ObjectId(id).
          // The above constructor throws errors for invalid ids.
        } catch (e) {
          close(client);
          reject(e);
        }
      })
      // Catching for open()
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Inserts a document in the database
 * @param obj Document to be inserted in the database
 * @returns {Promise} Resolves to mongodb's insertOne response object.
 *                    Rejects to thrown exception or errors
 */
function insertOne(obj) {
  return new Promise((resolve, reject) => {
    const object = obj;
    open()
      .then((client) => {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        try {
          // Testing stub below used to execute catch block
          if (obj === 'throw test error') {
            throw new Error('Test throw successful');
          }
          collection.insertOne(object)
            .then((respObj) => {
              close(client);
              resolve(respObj);
            })
            // Catching for insertOne()
            .catch((errObj) => {
              close(client);
              reject(errObj);
            });
          // Catching for the above testing stub to force catch execution during testing.
        } catch (e) {
          close(client);
          reject(e);
        }
      })
      // Catching for open()
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Database scan to get all Id's from the database.
 * @returns {Promise} Resolves to Array of json objects. Rejects to thrown exception or errors
 * Eg: [{
 *  uid : '............'
 * },
 * {
 *  uid: '.............'
 * },
 * .
 * .
 * .
 * ]
 */
function getAllIds() {
  return new Promise((resolve, reject) => {
    open()
      .then((client) => {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        try {
          collection.find({}, { _id: 1 })
            .toArray((err, arr) => {
              if (err) {
                reject(err);
              } else {
                const result = arr.map(val => ({ uid: val._id }));
                resolve(result);
                close(client);
              }
            });
          // Catching for exceptions from the above block find() method.
        } catch (e) {
          reject(e);
          close(client);
        }
      })
      // Catching for open()
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Replaces the object with matching uid with the new object.
 * @param obj New object to replace the old object
 * @returns {Promise} Resolves to the new object. Rejects to thrown exception or errors
 */
function putOne(obj) {
  return new Promise((resolve, reject) => {
    // Verify if the object is present first.
    // Mongodb does not return if the object is not find hence this additional call.
    findOne({ uid: obj.uid })
      .then(() => {
        open()
          .then((client) => {
            const newObj = obj;
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
            const id = newObj.uid;
            delete newObj.uid;
            try {
              collection
                .findOneAndReplace({ _id: new ObjectId(id) }, newObj, { returnOriginal: false })
                .then((doc) => {
                  const { value } = doc;
                  value.uid = value._id;
                  delete value._id;
                  close(client);
                  resolve(value);
                })
                // Catching for findOneAndReplace
                .catch((err) => {
                  close(client);
                  reject(err);
                });
              // Catching for new ObjectId(id).
              // The above constructor throws errors for invalid ids.
            } catch (e) {
              reject(e);
              close(client);
            }
          })
          // Catching for open
          .catch((err) => {
            reject(err);
          });
      })
      // Catching for findOne()
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Deletes the object with the given id from the database
 * @param id id of the object to delete
 */
function deleteOne(id) {
  return new Promise((resolve, reject) => {
    open()
      .then((client) => {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        try {
          // Testing stub below used to force execute catch block during testing
          if (id === 'throw test error') {
            throw new Error('Test throw successful');
          }
          const newId = id;
          newId._id = new ObjectId(newId.uid);
          delete newId.uid;
          collection.deleteOne(newId)
            .then(() => {
              resolve();
              close(client);
            })
            // Catching for deleteOne()
            .catch(() => {
              reject();
              close(client);
            });
          // Catching for the above testing stub to force catch execution during testing.
        } catch (e) {
          reject(e);
          close(client);
        }
      })
      // Catching for open()
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Export functions for service modules.
 * @type {
 * {url: *,
 * open: open,
 * close: close,
 * findOne: findOne,
 * insertOne: insertOne,
 * getAllIds: getAllIds,
 * putOne: putOne,
 * deleteOne: deleteOne}}
 */
module.exports = {
  findOne,
  insertOne,
  getAllIds,
  putOne,
  deleteOne,
};
