const jwt = require('jsonwebtoken');
require('dotenv').config();
const Utilizator = require('../models/utilizator');

const secret = process.env.SECRET || 'secret';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token)
      return res.status(400).json({ eroare: 'Utilizator neautentificat' });
    const userObject = jwt.verify(token, secret);
    req.user = await Utilizator.findOne({
      where: { id: userObject.id, email: userObject.email },
      attributes: { exclude: ['parola'] },
      raw: true,
    });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ eroare: 'Token gresit sau expirat' });
  } finally {
    next();
  }
};

module.exports = auth;
