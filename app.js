require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


const { writeData } = require('./fileBuilder');

app.use(express.static('public'));
app.use(bodyParser.json());


app.post('/download', (req, res) => {
  const path = writeData(req.body);
  res.download(path, err => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al descargar el documento. :(');
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log("escuchando en el puerto " + port);
})

// domain: https://proyecto-sgc.up.railway.app/