const auth = require('../middleware/auth');
const Curs = require('../models/curs');
const Lectie = require('../models/lectie');
const Fisier = require('../models/fisier');
const Examen = require('../models/examen');
const ExamenStudent = require('../models/examen_student');

const router = require('express').Router();

router.post('/nou', auth, async (req, res) => {
  try {
    const { nume, descriere, id_materie } = req.body;
    const curs = await Curs.create({
      nume,
      descriere,
      id_materie,
      id_creator: req.user.id,
    });
    res.status(201).json(curs);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    const cursuri = await Curs.findAll({ where: { id_creator: req.user.id } });
    res.status(200).json(cursuri);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.delete('/sterge/:id', async (req, res) => {
  try {
    const curs = await Curs.findByPk(req.params.id);
    if (!curs) return res.status(400).json({ eroare: 'Nu exista acest curs' });
    await curs.destroy();
    res.status(200).json({ mesaj: 'Curs sters' });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const curs = await Curs.findByPk(req.params.id, {
      include: [
        { model: Lectie, include: [Fisier] },
        { model: Examen, include: [ExamenStudent] },
      ],
    });
    res.status(200).json(curs);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

module.exports = router;
