const express = require('express');
const { authGuard } = require('../middlewares/auth');
const router = express.Router();
const { Parametro } = require('../models/Parametro');

// Obtener los parametros
router.get('/', authGuard, async (request, response) => {
    try {
        console.log("Obteniendo parametros...");
        const parametro = await Parametro.find();
        response.json({parametros:parametro});
    } catch (e) {
        console.log("Error obteniendo parametros: ");
        console.log(e);
        response.status(500).send({ message: "Error al obtener parametros." });
    }
});

// Guardar parametro nuevo
router.post('/new', authGuard, async (request, response) => {
    try {
        console.log("Creando parametro nuevo...");
        const parametro = new Parametro(request.body);
        await parametro.save();
        response.json({ message: 'Parametro guardado con exito.', id: parametro.id });
    } catch (e) {
        console.log("Error creando parametro nuevo: ");
        console.log(e);
        response.status(500).send({ message: "Error al crear parametro nuevo." });
    }
});


// Obtener parametro por id
router.get('/:id', authGuard, async (request, response) => {
    try {
        console.log("Obteniendo parametro por id...");
        const parametro = await Parametro.findById(request.params.id);
        response.json(parametro);
    } catch (e) {
        console.log("Error obteniendo parametro por id: ");
        console.log(e);
        response.status(500).send({ message: "Error al obtener parametro por id." });
    }
});

// Editar parametro por id
router.put('/edit/:id', authGuard, async (request, response) => {
    try {
        console.log("Editando parametro por id...");
        const { id } = request.params;
        const parametro = await Parametro.findByIdAndUpdate(id, request.body);
        response.json({ message: 'Parametro editado con exito.', id: parametro.id });
    } catch (e) {
        console.log("Error editando parametro: ");
        console.log(e);
        response.status(500).send({ message: "Error al editar parametro." });
    }
});

module.exports = router;