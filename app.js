require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const combos = require('./jsons/comboOptions.json');
const indicadores = require('./jsons/indicadores.json');
const formu = require('./jsons/ind-form.json');
const nombresSubP = require('./jsons/nombresSubP.json');

const { writeData } = require('./fileBuilder');

// app.use(express.static('public'));
app.use(bodyParser.json());


app.post('/download', (req, res) => {
  
  const fec = new Date();
  const st = `${fec.getDate().toString().padStart(2,0)} / ${(fec.getMonth()+1).toString().padStart(2,0)} / ${fec.getFullYear() % 100}`;
  const values = req.body;

  values["momento"] = st;
  values.nombre2 += " " + nombresSubP[values.nombre2.toUpperCase()];
  
  const path = writeData(values);

  res.download(path, err => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al descargar el documento. :(');
    }
  });
});

app.get('/combos/:name', (req, res) => {
  const { name } = req.params;

  if (!Object.keys(combos).includes(name)) return res.status(400).json({ msg: "Clave de parametro invalida", keys: Object.keys(combos) })

  res.json(combos[name]);
});

app.get('/combos', (req, res) => {
  res.json(combos);
});

app.get('/indicadores/:code', (req, res) => {
  const { code } = req.params;
  if (!Object.keys(indicadores).includes(code)) return res.status(400).json({ msg: "Clave de parametro invalida", keys: Object.keys(indicadores) })
  res.json({ options: indicadores[code] });
});

app.get('/formula/:indicador', (req, res) => {
  const { indicador } = req.params;
  if (!Object.keys(formu).includes(indicador)) return res.status(400).json({ msg: "Clave de parametro invalida", keys: Object.keys(indicador) });
  res.json({ value: formu[indicador][0], goal: formu[indicador][1]});
});

const port = process.env.port;
app.listen(port, () => {
  console.log("escuchando en el puerto " + port);
})

// domain: https://proyecto-sgc.up.railway.app/
//         https://ind-sgc-production-47a7.up.railway.app/