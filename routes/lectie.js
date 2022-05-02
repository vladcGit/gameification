const auth = require('../middleware/auth');
const Fisier = require('../models/fisier');
const Lectie = require('../models/lectie');

const router = require('express').Router();

router.post('/nou', auth, async (req, res) => {
  try {
    const lectie = await Lectie.create(req.body);
    res.status(201).json(lectie);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const lectie = await Lectie.findByPk(req.params.id);
    await lectie.destroy();
    res.status(200).json({ mesaj: 'ok' });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const lectie = await Lectie.findByPk(req.params.id, { include: Fisier });
    res.status(200).json(lectie);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

module.exports = router;
