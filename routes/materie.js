const Curs = require('../models/curs');
const Materie = require('../models/materie');

const router = require('express').Router();

router.get('/all', async (req, res) => {
  try {
    const materii = await Materie.findAll();
    res.status(200).json(materii);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const materie = await Materie.findByPk(req.params.id, { include: Curs });
    res.status(200).json(materie);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});
module.exports = router;
