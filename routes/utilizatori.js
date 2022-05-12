const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const Utilizator = require('../models/utilizator');
const ExamenStudent = require('../models/examen_student');
const CursuriStudent = require('../models/cursuri_student');
const Experienta = require('../models/experienta');
const Curs = require('../models/curs');
require('dotenv').config();

const secret = process.env.SECRET || 'secret';

router.post('/signup', async (req, res) => {
  try {
    const { email, parola, nume, eProfesor } = req.body;
    const hashedPassword = await bcrypt.hash(parola, 10);
    const nou = await Utilizator.create({
      email,
      nume,
      parola: hashedPassword,
      eProfesor,
    });
    return res.status(201).json(nou);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

//primeste datele de autentificare si intoarce un token de acces
router.post('/signin', async (req, res) => {
  const { email, parola } = req.body;
  try {
    const user = await Utilizator.findOne({
      where: { email: email },
      raw: true,
    });
    if (!user)
      return res
        .status(400)
        .json({ eroare: 'Nu exista utilizatorul cu acest mail' });

    if (await bcrypt.compare(parola, user.parola)) {
      const token = jwt.sign({ id: user.id, email: user.email }, secret);
      return res.status(200).json({ token });
    } else {
      return res.status(400).json({ error: 'Parola e incorecta' });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
});

router.get('/', auth, async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
});

router.get('/profil', auth, async (req, res) => {
  try {
    const user = await Utilizator.findByPk(req.user.id, {
      include: [ExamenStudent, CursuriStudent, Experienta, Curs],
      attributes: { exclude: ['parola'] },
    });
    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await Utilizator.findByPk(req.params.id);
    if (!user) return res.status(400).json({ eroare: 'nu exista' });
    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
});

module.exports = router;
