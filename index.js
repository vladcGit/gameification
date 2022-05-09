const express = require('express');
const cors = require('cors');
const sequelize = require('./models/sequelize');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', require('./routes/index'));

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  await sequelize.sync();
  console.log(`Server pornit pe portul ${port}`);
});

app.use(express.static('./client/build'));
app.get('*', (req, res) => res.sendFile('./client/build/index.html'));
