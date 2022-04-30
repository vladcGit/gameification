const Domeniu = require('../models/domeniu');

const router = require('express').Router();
router.get('/all', async (req, res) => {
  try {
    const domenii = await Domeniu.findAll();
    res.status(200).json(domenii);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});
router.get('/:id', async (req, res) => {
  try {
    const domeniu = await Domeniu.findByPk(req.params.id);
    if (!domeniu)
      return res.status(404).json({ eroare: 'Nu exista acest domeniu' });
    res.status(200).json(domeniu);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});
module.exports = router;
