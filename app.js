"use strict";

require('dotenv').config();

const express = require('express');

const cors = require('cors');

const {
  registrarControladores
} = require('./controllers');

const {
  conectarAMongoDB,
  subscribirCerrar
} = require('./db/db');

const app = express();
const port = process.env.PORT || 9000; // Configuramos el middleware de express

app.use(cors());
app.use(express.json()); // Permite que los datos sean enviados en formato json

app.use(express.urlencoded()); // Permite que los datos sean enviados en formato urlencoded
// Establecer coneccion con la base de datos

conectarAMongoDB(); // Registramos ka configuración de las funciones controladoras

registrarControladores(app); // Configuramos watcher para cerrar la coneccion con la base de datos

subscribirCerrar();
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
