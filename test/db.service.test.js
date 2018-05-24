/* eslint no-undef: 1, prefer-arrow-callback: 1 */
/* eslint space-before-function-paren: 1, global-require: 1  */
// process.env.DB_HOST = 'dummy';

require('dotenv').config();
// process.env.NODE_ENV = 'dummy';


describe('DB connection testing', () => {
  it('should throw an error when string passed to insertOne()', (done) => {
    const connection = require('../app/db/db.service.js');
    connection.insertOne('hello')
      .then((res) => {
        throw new Error('insertOne test failed on passing string');
      })
      .catch((err) => {
        done();
      })
  });
  it('should throw an error when null passed to insertOne()', (done) => {
    const connection = require('../app/db/db.service.js');
    connection.insertOne(null)
      .then((res) => {
        throw new Error('insertOne test failed on passing null');
      })
      .catch((err) => {
        done();
      })
  });
  it('should throw an error from insert one and execute catch block', (done) => {
    const obj = 'throw test error';
    const connection = require('../app/db/db.service.js');
    connection.insertOne(obj)
      .then(() => {
        done(new Error('Should error out'));
      })
      .catch(() => {
        done();
      })
  });
  it('should throw an error from delete one and execute catch block', (done) => {
    const obj = 'throw test error';
    const connection = require('../app/db/db.service.js');
    connection.deleteOne(obj)
      .then(() => {
        done(new Error('Should error out'));
      })
      .catch(() => {
        done();
      })
  })
});