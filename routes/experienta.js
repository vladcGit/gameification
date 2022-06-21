const auth = require('../middleware/auth');
const Experienta = require('../models/experienta');

const router = require('express').Router();

router.get('/domeniu/:id/clasament', auth, async (req, res) => {
  try {
    const [experienta, created] = await Experienta.findOrCreate({
      where: {
        id_domeniu: req.params.id,
        id_student: req.user.id,
      },
    });
    const instante = await Experienta.findAll({
      where: { id_domeniu: req.params.id },
      raw: true,
      order: [['xp', 'DESC']],
    });
    for (let i = 0; i < instante.length; i++) {
      if (instante[i].id === experienta.getDataValue('id'))
        return res.status(200).json({ pozitie: i + 1 });
    }
    res.status(400).json({ eroare: 'Eroare' });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const experienta = await Experienta.findAll({
      where: { id_student: req.user.id },
    });
    if (!experienta) return res.status(200).json([]);
    res.status(200).json(experienta);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const experienta = await Experienta.findAll();
    if (!experienta) return res.status(200).json([]);
    res.status(200).json(experienta);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

module.exports = router;
