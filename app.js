"use strict";

require('dotenv').config();

const express = require('express');
const path = require('path');

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

app.use(cors()); // Configuramos el middleware de cors para permitir peticiones desde cualquier origen

//app.use(express.json()); // Permite que los datos sean enviados en formato json
app.use(express.json({limit: '1mb'}));

app.use(express.urlencoded()); // Permite que los datos sean enviados en formato urlencoded
// Carpeta de imagenes staticas
app.use(express.static(path.join(__dirname, 'public/imagenes/')));

// Establecer coneccion con la base de datos

conectarAMongoDB(); // Registramos ka configuración de las funciones controladoras

registrarControladores(app); // Configuramos watcher para cerrar la coneccion con la base de datos

subscribirCerrar();
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
