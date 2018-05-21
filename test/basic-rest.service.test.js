/* eslint no-undef: 1, prefer-arrow-callback: 1 */
/* eslint space-before-function-paren: 1, global-require: 1  */

// process.env.NODE_ENV = 'test';

const request = require('supertest');
const { assert } = require('chai');
const expect = require('chai').expect;
const async = require('async');


describe('Loading server for testing..', () => {
  let server;
  let uid;
  let uid_empty;
  const postObj = {
    object : 1,
    utility: 'test'
  };
  const putObj = {
    object: 2,
    utility: 'test',
    message: 'Object put'
  };
  beforeEach(() => {
    delete require.cache[require.resolve('../server.js')];
    server = require('../server.js');
  });
  afterEach((done) => {
    server.close(done);
  });
  it('should handle malformed json on POST paths', (done) => {
    async.series([
      (cb) => {
        request(server)
          .post('/api/objects')
          .type('json')
          .send('{"project":{test}}')
          .expect(400)
          .end((err, res) => {
            const body = res.body;
            expect(body).to.be.an('object');
            expect(body).to.have.all.keys('verb', 'url', 'message');
            assert.equal(body.verb, 'POST');
            assert.equal(body.message, 'Malformed JSON');
            cb();
          })
      },
      (cb) => {
        request(server)
          .post('/')
          .type('json')
          .send('{"project":{test}}')
          .expect(400)
          .end((err, res) => {
            const body = res.body;
            expect(body).to.be.an('object');
            expect(body).to.have.all.keys('verb', 'url', 'message');
            assert.equal(body.verb, 'POST');
            assert.equal(body.message, 'Malformed JSON');
            cb();
          })
      },
      (cb) => {
        request(server)
          .post('/xyz')
          .type('json')
          .send('{"project":{test}}')
          .expect(400)
          .end((err, res) => {
            const body = res.body;
            expect(body).to.be.an('object');
            expect(body).to.have.all.keys('verb', 'url', 'message');
            assert.equal(body.verb, 'POST');
            assert.equal(body.message, 'Malformed JSON');
            cb();
          })
      },
      (cb) => {
        request(server)
          .post('/api/objects/' + uid)
          .type('json')
          .send('{"project":{test}}')
          .expect(400)
          .end((err, res) => {
            const body = res.body;
            expect(body).to.be.an('object');
            expect(body).to.have.all.keys('verb', 'url', 'message');
            assert.equal(body.verb, 'POST');
            assert.equal(body.message, 'Malformed JSON');
            cb();
          })
      }
    ], done);
  });
  it('should respond to GET / with 404', (done) => {
    request(server)
      .get('/')
      .expect(404, done);
  });
  it('should respond to GET /xyz with 404', (done) => {
    request(server)
      .get('/xyz')
      .expect(404, done);
  });
  it('should respond to GET /api/objects with 200 and an array of items', (done) => {
    request(server)
      .get('/api/objects')
      .expect(200)
      .end((err, res) => {
        const body = res.body;
        assert.isArray(body, 'body is not an array');
        if (body.length !== 0) {
          for (const i in body) {
            expect(body[i]).to.have.all.keys('url');
          }
        }
        done();
      });
  });
  it('should respond to empty object POST /api/objects with 201 and the new object', (done) => {
    request(server)
      .post('/api/objects')
      .type('json')
      .send('{}')
      .expect(201)
      .expect('json')
      .end((err, res) => {
        const body = res.body;
        expect(body).to.be.an('object');
        expect(body).to.have.all.keys('uid');
        uid_empty = body.uid;
        done();
      })
  });
  it('should respond to POST /api/objects with 201 and the new object', (done) => {
    request(server)
      .post('/api/objects')
      .type('json')
      .send(postObj)
      .expect(201)
      .expect('json')
      .end((err, res) => {
        const body = res.body;
        expect(body).to.be.an('object');
        expect(body).to.have.all.keys('object', 'utility', 'uid');
        uid = body.uid;
        assert.equal(body.object, postObj.object);
        assert.equal(body.utility, postObj.utility);
        done();
      })
  });
  it('should respond to uid or _id field in POST /api/objects with 400 and error message', (done) => {
    const obj1 = {
      uid: 123
    };
    const obj2 = {
      _id: 123
    };
    async.series([
      (cb) => {
        request(server)
          .post('/api/objects')
          .type('json')
          .send(obj1)
          .expect(400)
          .end((err, res) => {
            const body = res.body;
            expect(body).to.be.an('object');
            expect(body).to.have.all.keys('verb', 'url', 'message');
            cb();
          })
      },
      (cb) => {
        request(server)
          .post('/api/objects')
          .type('json')
          .send(obj2)
          .expect(400)
          .end((err, res) => {
            const body = res.body;
            expect(body).to.be.an('object');
            expect(body).to.have.all.keys('verb', 'url', 'message');
            cb();
          })
      }
    ], done);
  });
  it('should respond to GET /api/objects/:uid with 200 and the object', (done) => {
    const url = `/api/objects/${uid}`;
    request(server)
      .get(url)
      .expect(200)
      .end((err, res) => {
        const body = res.body;
        expect(body).to.be.an('object');
        expect(body).to.have.all.keys('object', 'utility', 'uid');
        assert.equal(uid, body.uid);
        assert.equal(body.object, postObj.object);
        assert.equal(body.utility, postObj.utility);
        done();
      })
  });
  it('should respond to GET /api/objects/:invaliduid with 404 and error message', (done) => {
    const url = `/api/objects/123`;
    request(server)
      .get(url)
      .expect(404)
      .end((err, res) => {
        const body = res.body;
        expect(body).to.be.an('object');
        expect(body).to.have.all.keys('verb', 'url', 'message');
        assert.equal(body.verb, 'GET');
        assert.equal(body.message, 'Object not found');
        done();
    })
  });
  it('should respond to PUT /api/objects/:uid by replacing old object', (done) => {
    const url = `/api/objects/` + uid;
    putObj.uid = uid;
    request(server)
      .put(url)
      .type('json')
      .send(putObj)
      .expect(200)
      .end((err, res) => {
        const body = res.body;
        expect(body).to.be.an('object');
        expect(body).to.have.all.keys('uid', 'utility', 'message', 'object');
        assert.equal(body.uid, uid);
        assert.equal(body.utility, 'test');
        assert.equal(body.uid, uid);
        assert.equal(body.message, 'Object put');
        assert.equal(body.object, 2);
        done();
    })
  });
});
