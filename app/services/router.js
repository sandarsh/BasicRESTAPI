const router = require('express').Router();
const basicRestService = require('./BasicREST/basic-rest.service.server');
/*
Include more services here..
.
.
 */

// BasicREST Service Routes
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

router.use('/', (req, res) => (res.sendStatus(404)));

module.exports = router;
