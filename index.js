const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(`Server pornit pe portul ${port}`);
});

app.use(express.static('./client/build'));
app.get('*', (req, res) => res.sendFile('./client/build/index.html'));
