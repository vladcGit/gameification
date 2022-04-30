const router = require('express').Router();

router.use('/user', require('./utilizatori'));
router.use('/domeniu', require('./domeniu'));
router.use('/materie', require('./materie'));
router.use('/curs', require('./curs'));

module.exports = router;
