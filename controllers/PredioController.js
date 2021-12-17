const express = require('express');
const { authGuard } = require('../middlewares/auth');
const router = express.Router();
const { Predio } = require('../models/Predio');
const { Usuario } = require('../models/Usuario');

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

// Asignar predio a usuario por id y marcar como asignado
router.put('/asignar/:id', authGuard, async (request, response) => {
    try {
        console.log("Asignando predio a usuario...");
        const { id } = request.params;
        const { usuario } = request.body;
        const predio = await Predio.findById(id);
        const usuario_asignado = await Usuario.findById(usuario);
        predio.usuario_asignado = usuario_asignado;
        predio.asignado = true;
        await predio.save();
        response.json({ message: 'Predio asignado con exito.', id: predio.id });
    } catch (e) {
        console.log("Error asignando predio a usuario: ");
        console.log(e);
        response.status(500).send({ message: "Error al asignar predio a usuario." });
    }
});

// obtener todos los predios asignados a un usuario
router.get('/asignados/:id', authGuard, async (request, response) => {
    try {
        console.log("Obteniendo todos los predios asignados a un usuario...");
        const { id } = request.params;
        const predios = await Predio.find({ usuario_asignado: id });
        response.json({ predios: predios });
    } catch (e) {
        console.log("Error obteniendo todos los predios asignados a un usuario: ");
        console.log(e);
        response.status(500).send({ message: "Error al obtener todos los predios asignados a un usuario." });
    }
});

// obtener todos los predios asignados y aplicar populate al usuario
router.get('/all/asignados', authGuard, async (request, response) => {
    const page = parseInt(request.query.page) || 0;
    const limit = parseInt(request.query.limit) || 10;
    try {
        console.log("Obteniendo todos los predios asignados...");
        const predio = await Predio.find({ asignado: true }, null, {
            skip: ((page - 1) * limit),
            limit: limit
            }).populate('usuario_asignado');

        const predios_usuario = predio.map(predio => {
            predio.usuario_asignado.contrasena = undefined;
            return predio;
        });
                
        const total = await Predio.countDocuments({ asignado: true });
        response.json({ predios: predios_usuario, totalElements: total });
    } catch (e) {
        console.log("Error obteniendo todos los predios asignados: ");
        console.log(e);
        response.status(500).send({ message: "Error al obtener todos los predios asignados." });
    }
});


// obtener todos los predios no asignados
router.get('/all/noasignados', authGuard, async (request, response) => {
    const page = parseInt(request.query.page) || 0;
    const limit = parseInt(request.query.limit) || 10;
    
    try {
        console.log("Obteniendo todos los predios no asignados...");
        const predios = await Predio.find({ asignado: false }, null, { 
            skip: ((page - 1) * limit), 
            limit: limit });
        const total = await Predio.countDocuments({ asignado: false });
        response.json({ predios: predios, totalElements: total });
    } catch (e) {
        console.log("Error obteniendo todos los predios no asignados: ");
        console.log(e);
        response.status(500).send({ message: "Error al obtener todos los predios no asignados." });
    }
});

// Eliminar un usuario asignado a un predio y marcar como no asignado
router.put('/desasignar/:id', authGuard, async (request, response) => {
    try {
        console.log("Desasignando predio a usuario...");
        const { id } = request.params;
        const predio = await Predio.findById(id);
        predio.usuario_asignado = undefined;
        predio.asignado = false;
        await predio.save();
        response.json({ message: 'Predio desasignado con exito.', id: predio.id });
    } catch (e) {
        console.log("Error desasignando predio a usuario: ");
        console.log(e);
        response.status(500).send({ message: "Error al desasignar predio a usuario." });
    }
});



module.exports = router;