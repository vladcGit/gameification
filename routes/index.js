const router = require('express').Router();

router.use('/user', require('./utilizatori'));
router.use('/domeniu', require('./domeniu'));
router.use('/materie', require('./materie'));

module.exports = router;
