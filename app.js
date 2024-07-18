require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const combos = require('./jsons/comboOptions.json');
const indicadores = require('./jsons/indicadores.json');
const formu = require('./jsons/ind-form.json');
const nombresSubP = require('./jsons/nombresSubP.json');

const globalJSON = require('./jsons/FO-TESCo82.json');

const { writeData } = require('./fileBuilder');

app.use(express.static('public'));
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

app.post('/objectkeys', (req, res) => {
  const path = req.body["path"] ?? [];
  result = globalJSON;
  for(let key of path) {
    if (result[key] !== undefined) {
      result = result[key];
      //console.log(Object.keys(result))
    } else {
      console.log(path)
      return res.status(400).json({"msg": "bad request", "path": path});
    }
  }

  if (Object.keys(result)[0] == "0") { // claves solamente
    if (typeof result[0] == "object") { // cuando son objetos
      const newArray = result.map((element) => {
        return element["name"];
      });
      return res.json(newArray)
    }
    res.json(result);
  } else {
    res.json(Object.keys(result));
  }
});

app.post("/objectpart", (req, res) => {
  const path = req.body["path"] ?? [];

  result = globalJSON;
  for(let key of path) {
    if (result[key] !== undefined) {
      result = result[key];
    } else {
      console.log(path);
      return res.status(400).json({"msg": "bad request, wrong path", "path" : path});
    }
  }
  
  res.json(result);
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log("escuchando en el puerto " + port);
});

// domain: https://proyecto-sgc.up.railway.app/
//         https://ind-sgc-production-47a7.up.railway.app/