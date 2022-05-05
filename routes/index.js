const router = require('express').Router();

router.use('/user', require('./utilizatori'));
router.use('/domeniu', require('./domeniu'));
router.use('/materie', require('./materie'));
router.use('/curs', require('./curs'));
router.use('/lectie', require('./lectie'));
router.use('/fisier', require('./fisier'));
router.use('/examen', require('./examen'));
router.use('/experienta', require('./experienta'));

module.exports = router;
