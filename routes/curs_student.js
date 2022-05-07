const auth = require('../middleware/auth');
const Curs = require('../models/curs');
const CursuriStudent = require('../models/cursuri_student');

const router = require('express').Router();

router.get('/user', auth, async (req, res) => {
  try {
    const cursuri = await Curs.findAll({
      include: [{ model: CursuriStudent, where: { id_student: req.user.id } }],
    });
    res.status(200).json(cursuri);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const curs = await CursuriStudent.findOrCreate({
      where: {
        id_student: req.user.id,
        id_curs: req.body.id_curs,
      },
    });
    res.status(201).json(curs);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const curs = await CursuriStudent.findByPk(req.params.id);
    await curs.destroy();
    res.status(200).json({ mesaj: 'ok' });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

module.exports = router;
