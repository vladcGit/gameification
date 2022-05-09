const router = require('express').Router();

const fs = require('fs');
const multer = require('multer');
const Fisier = require('../models/fisier');
const upload = multer({ dest: 'uploads/' });
const pathNode = require('path');
const auth = require('../middleware/auth');

router.post('/nou', upload.single('file'), async (req, res) => {
  try {
    const { path, originalname, mimetype } = req.file;
    const uploadsFolder = pathNode.resolve(__dirname, '..');
    const caleAbsoluta = `${uploadsFolder}\\${path}`;
    const { id_lectie } = JSON.parse(req.body.json_data);
    const instanta = await Fisier.create({
      continut: fs.readFileSync(caleAbsoluta),
      titlu: originalname,
      tip: mimetype,
      id_lectie,
    });

    // fs.rmSync(`${uploadsFolder}\\uploads`, { recursive: true, force: true });
    fs.unlink(path, (err) => {
      if (err) return console.error(err);
    });
    return res.status(201).json(instanta);
  } catch (e) {
    console.error(e);
    res.status(400).json(e);
  }
});

router.get('/', async (req, res) => {
  try {
    const rows = await Fisier.findAll();
    res.status(200).json(rows);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const fisier = await Fisier.findByPk(req.params.id);
    await fisier.destroy();
    res.status(200).json({ mesaj: 'ok' });
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = router;
