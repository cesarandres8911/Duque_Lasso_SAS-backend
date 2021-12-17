const express = require('express');
const { authGuard } = require('../middlewares/auth');
const router = express.Router();
const { Predio } = require('../models/Predio');
const { Usuario } = require('../models/Usuario');
const { AsignarPredio } = require('../models/AsignarPredio');

// Crear predio nuevo
router.post('/new', authGuard, async (request, response) => {
    try {
        console.log("Creando predio nuevo...");
        const predio = new Predio(request.body);
        await predio.save();
        response.json({ message: 'Predio guardado con exito.', id: predio.id });
    } catch (e) {
        console.log("Error creando predio nuevo: ");
        console.log(e);
        response.status(500).send({ message: "Error al crear predio nuevo." });
    }
});

// Obtener todos los predios limitados por pagina
router.get('/all', authGuard, async (request, response) => {
    const page = parseInt(request.query.page);
    const limit = parseInt(request.query.limit);

    try {
        console.log("Obteniendo todos los predios...");
        const predios = await Predio.find({}, null, {
            skip: ((page - 1) * limit),
            limit: limit
        });

        const total = await Predio.countDocuments();
        response.json({ totalElements: total, predios: predios });
        
    } catch (e) {
        console.log("Error obteniendo todos los predios: ");
        console.log(e);
        response.status(500).send({ message: "Error al obtener todos los predios." });
    }
});

// Obtener todos los predios para auto-completar
router.get('/all/autocomplete', authGuard, async (request, response) => {
    try {
        console.log("Obteniendo todos los predios para auto-completar...");
        const predios = await Predio.find({}, null, {
            skip: 0,
            limit: 100
        });
        response.json({ predios: predios });
    } catch (e) {
        console.log("Error obteniendo todos los predios para auto-completar: ");
        console.log(e);
        response.status(500).send({ message: "Error al obtener todos los predios para auto-completar." });
    }
});

// Obtener predio por id
router.get('/:id', authGuard, async (request, response) => {
    try {
        console.log("Obteniendo predio por id...");
        const predio = await Predio.findById(request.query.id);
        response.json({predios: predio});
    } catch (e) {
        console.log("Error obteniendo predio por id: ");
        console.log(e);
        response.status(500).send({ message: "Error al obtener predio por id." });
    }
});

// Obterner predio por id
router.get('/:id/asignar', authGuard, async (request, response) => {
    try {
        console.log("Obteniendo predio por id...");
        const { id } = request.params;
        console.log(id);
        const predio = await Predio.findById(id);
        response.json({predios: predio});
    } catch (e) {
        console.log("Error obteniendo predio por id: ");
        console.log(e);
        response.status(500).send({ message: "Error al obtener predio por id." });
    }
});

// Editar predio por id
router.put('/edit/:id', authGuard, async (request, response) => {
    try {
        console.log("Editando predio...");
        const { id } = request.params;
        const predio = await Predio.findByIdAndUpdate(id, request.body);
        response.json({ message: 'Predio editado con exito.', id: predio.id });
    } catch (e) {
        console.log("Error editando predio: ");
        console.log(e);
        response.status(500).send({ message: "Error al editar predio." });
    }
});

// Eliminar predio por id
router.delete('/delete/:id', authGuard, async (request, response) => {
    try {
        console.log("Eliminando predio...");
        const { id } = request.params;
        await Predio.findByIdAndDelete(id);
        response.json({ message: 'Predio eliminado con exito.' });
    } catch (e) {
        console.log("Error eliminando predio: ");
        console.log(e);
        response.status(500).send({ message: "Error al eliminar predio." });
    }
});

// Obtener todos los predios asignados
router.get('/all/asignados', authGuard, async (request, response) => {
    try {
        console.log("Obteniendo todos los predios asignados...");
        const predios = await AsignarPredio.find({}, null, {
            skip: 0,
            limit: 100
        });
        const total = await AsignarPredio.countDocuments();
        response.json({ predios: predios, totalElements: total });
    } catch (e) {
        console.log("Error obteniendo todos los predios asignados: ");
        console.log(e);
        response.status(500).send({ message: "Error al obtener todos los predios asignados." });
    }
});


module.exports = router;