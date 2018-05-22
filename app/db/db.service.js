/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
/* eslint max-len: 1 */
const ObjectId = require('mongodb').ObjectID;
const mongoClient = require('mongodb').MongoClient;

// Form connection URL
let url = 'mongodb://127.0.0.1:27017';
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
  url = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
}

const dbName = process.env.DB_NAME || 'test';
const collectionName = process.env.DB_COLLECTION || 'test';

function open() {
  return new Promise((resolve, reject) => {
    mongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
      if (err) {
        // console.log('Error in opening server connection', err);
        reject(err);
      } else {
        // console.log('Server connection opened');
        resolve(client);
      }
    });
  });
}

function close(client) {
  if (client !== null) {
    client.close((err) => {
      if (err) {
        console.log('Error in closing connection', err);
      } else {
        // console.log('Server connection closed');
      }
    });
  }
}


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
            .catch((err) => {
              reject(err);
              close(client);
            });
        } catch (e) {
          close(client);
          reject(e);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function insertOne(obj) {
  return new Promise((resolve, reject) => {
    const object = obj;
    open()
      .then((client) => {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        try {
          collection.insertOne(object)
            .then((respObj) => {
              close(client);
              resolve(respObj);
            })
            .catch((errObj) => {
              close(client);
              reject(errObj);
            });
        } catch (e) {
          close(client);
          reject(e);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

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
        } catch (e) {
          reject(e);
          close(client);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function putOne(obj) {
  return new Promise((resolve, reject) => {
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
              collection.findOneAndReplace({ _id: new ObjectId(id) }, newObj, { returnOriginal: false })
                .then((doc) => {
                  const { value } = doc;
                  value.uid = value._id;
                  delete value._id;
                  close(client);
                  resolve(value);
                })
                .catch((err) => {
                  close(client);
                  reject(err);
                });
            } catch (e) {
              reject(e);
              close(client);
            }
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function deleteOne(id) {
  return new Promise((resolve, reject) => {
    open()
      .then((client) => {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        try {
          const newId = id;
          newId._id = new ObjectId(newId.uid);
          delete newId.uid;
          collection.deleteOne(newId)
            .then(() => {
              resolve();
              close(client);
            })
            .catch(() => {
              reject();
              close(client);
            });
        } catch (e) {
          reject(e);
          close(client);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  open,
  close,
  findOne,
  insertOne,
  getAllIds,
  putOne,
  deleteOne,
};
