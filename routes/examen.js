const auth = require('../middleware/auth');
const Curs = require('../models/curs');
const Domeniu = require('../models/domeniu');
const Examen = require('../models/examen');
const ExamenStudent = require('../models/examen_student');
const Experienta = require('../models/experienta');
const Intrebare = require('../models/intrebare');
const Materie = require('../models/materie');
const Utilizator = require('../models/utilizator');
const Varianta = require('../models/varianta');

const router = require('express').Router();

router.post('/', auth, async (req, res) => {
  try {
    const { nume, descriere, durata, id_curs, data_incepere, intrebari } =
      req.body;
    const examen = await Examen.create({
      nume,
      descriere,
      durata,
      id_curs,
      data_incepere,
    });

    for (let intrebare of intrebari) {
      const { text, indexRaspunsCorect, variante } = intrebare;
      const intrebareModel = await Intrebare.create({
        text,
        raspuns_corect: 'abcde'[indexRaspunsCorect],
        id_examen: examen.getDataValue('id'),
      });

      for (let varianta of variante) {
        await Varianta.create({
          text: varianta.text,
          id_intrebare: intrebareModel.getDataValue('id'),
        });
      }
    }

    res.status(200).json(examen);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const examen = await Examen.findByPk(req.params.id);
    await examen.update(req.body);

    await Intrebare.destroy({
      where: { id_examen: examen.getDataValue('id') },
    });

    for (let intrebare of req.body.intrebari) {
      const { text, indexRaspunsCorect, variante } = intrebare;
      const intrebareModel = await Intrebare.create({
        text,
        raspuns_corect: 'abcde'[indexRaspunsCorect],
        id_examen: examen.getDataValue('id'),
      });

      for (let varianta of variante) {
        await Varianta.create({
          text: varianta.text,
          id_intrebare: intrebareModel.getDataValue('id'),
        });
      }
    }

    res.status(200).json({ mesaj: 'ok' });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const examen = await Examen.findByPk(req.params.id);
    await examen.destroy();
    res.status(200).json({ mesaj: 'ok' });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.get('/:id/rezultat', auth, async (req, res) => {
  try {
    const instanta = await ExamenStudent.findOne({
      where: { id_student: req.user.id, id_examen: req.params.id },
    });
    if (instanta == null || instanta.getDataValue('punctaj') < 0) {
      return res.status(200).json({ sustinut: false });
    }
    return res
      .status(200)
      .json({ sustinut: true, punctaj: instanta.getDataValue('punctaj') });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.post('/:id/termina', auth, async (req, res) => {
  try {
    let numarCorecte = 0;
    const examen = await Examen.findByPk(req.params.id);
    const intrebari = await examen.getIntrebares();
    for (let intrebare of intrebari) {
      const raspuns = req.body.raspunsuri.filter(
        (rasp) => rasp.id_intrebare === intrebare.id
      )[0]?.raspuns;
      if (raspuns && intrebare.getDataValue('raspuns_corect')[0] === raspuns)
        numarCorecte++;
    }
    const instanta = await ExamenStudent.findOne({
      where: {
        id_student: req.user.id,
        id_examen: req.params.id,
      },
    });
    let raspunsuri = req.body.raspunsuri.map((rasp) => rasp.raspuns).join('');
    if (raspunsuri.length < intrebari.length) {
      for (let i = raspunsuri.length; i < intrebari.length; i++)
        raspunsuri += '-';
    }
    if (instanta == null) {
      await ExamenStudent.create({
        id_student: req.user.id,
        id_examen: req.params.id,
        punctaj: numarCorecte,
        raspunsuri,
      });
    } else await instanta.update({ punctaj: numarCorecte, raspunsuri });

    //actualizare nivel
    const curs = await Curs.findByPk(examen.getDataValue('id_curs'));
    const materie = await Materie.findByPk(curs.getDataValue('id_materie'));
    const domeniu = await Domeniu.findByPk(materie.getDataValue('id_domeniu'));

    const [experienta, created] = await Experienta.findOrCreate({
      where: {
        id_student: req.user.id,
        id_domeniu: domeniu.getDataValue('id'),
      },
    });

    const xp = (numarCorecte / intrebari.length) * 100;
    let rank = experienta.getDataValue('rank');
    const xpVechi = experienta.getDataValue('xp');
    const xpActual = xp + xpVechi;

    if (rank === 'Incepator' && xpActual >= 200) rank = 'Entuziast';
    else if (rank === 'Entuziast' && xpActual >= 500) rank = 'Maestru';

    await experienta.update({ xp: xpActual, rank });

    return res.status(200).json({ punctaj: numarCorecte, raspunsuri });
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
});

router.get('/:id/raspunsuri', auth, async (req, res) => {
  try {
    const instanta = await ExamenStudent.findOne({
      where: { id_student: req.user.id, id_examen: req.params.id },
    });

    if (instanta == null || instanta.getDataValue('punctaj') < 0) {
      return res.status(400).json('Examenul nu a fost sustinut');
    }

    const examen = await Examen.findByPk(req.params.id);
    const intrebari = await examen.getIntrebares();

    const listaId = intrebari.map((intreb) => intreb.id);
    const raspCorecte = intrebari.map((intreb) => intreb.raspuns_corect[0]);
    const raspTrimise = instanta.getDataValue('raspunsuri');

    // intorc id-ul intrebarii
    const lista = [];
    for (let i = 0; i < intrebari.length; i++) {
      lista.push({
        id: listaId[i],
        trimis: raspTrimise[i],
        corect: raspCorecte[i],
      });
    }

    return res.status(200).json({
      lista,
      xp: (instanta.getDataValue('punctaj') / intrebari.length) * 100,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.get('/:id/clasament', auth, async (req, res) => {
  try {
    let instante = await ExamenStudent.findAll({
      where: { id_examen: req.params.id },
      raw: true,
      order: [['punctaj', 'DESC']],
    });
    const examen = await Examen.findByPk(req.params.id);

    //data incepere
    const data_inceput = new Date(examen.getDataValue('data_incepere'));

    // durata in minute
    const durata = examen.getDataValue('durata') * 60 * 1000;

    if (data_inceput.getTime() + durata > new Date().getTime())
      return res.status(400).json('Examenul nu s-a terminat inca');

    for (let instanta of instante) {
      const user = await Utilizator.findByPk(instanta.id_student, {
        raw: true,
      });
      instanta.nume = user.nume;
      instanta.email = user.email;
    }

    instante = instante.map(
      ({ id_examen, createdAt, updatedAt, raspunsuri, ...rest }) => rest
    );

    return res.status(200).json(instante);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const examen = await Examen.findByPk(req.params.id, {
      include: [{ model: Intrebare, include: Varianta }],
    });
    res.status(200).json(examen);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

module.exports = router;
