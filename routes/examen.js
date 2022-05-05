const auth = require('../middleware/auth');
const Examen = require('../models/examen');
const Intrebare = require('../models/intrebare');
const Varianta = require('../models/varianta');

const router = require('express').Router();

router.post('/', auth, async (req, res) => {
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
});

module.exports = router;
