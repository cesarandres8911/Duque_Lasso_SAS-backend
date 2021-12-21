const express = require('express');
const { authGuard } = require('../middlewares/auth');
const router = express.Router();
const { Cultivo } = require('../models/Cultivo');
const { Parametro } = require('../models/Parametro');
const { Predio } = require('../models/Predio');

// Crear cultivo nuevo
router.post('/new', authGuard, async (request, response) => {
    try {
        console.log("Creando cultivo nuevo...");
        const cultivo = new Cultivo(request.body);
        const parametro = await Parametro.find();
        // Calculamos el precio del cultivo


        cultivo.precio = parametro[0].valor_agua * cultivo.cantidad_agua_semana +
            parametro[0].valor_fertilizante * cultivo.cantidad_fertilizante_semana +
            parametro[0].valor_semilla * cultivo.cantidad_semillas_hectarea;

        // Se guarda el cultivo
        await cultivo.save();
        response.json({ message: 'Cultivo guardado con exito.', id: cultivo.id });
    } catch (e) {
        console.log("Error creando cultivo nuevo: ");
        console.log(e);
        response.status(500).send({ message: "Error al crear cultivo nuevo." });
    }
});

// Obtener todos los cultivos
router.get('/all', authGuard, async (request, response) => {
    const page = parseInt(request.query.page)||1;
    const limit = parseInt(request.query.limit)||10;
    
    try {
        console.log("Obteniendo todos los cultivos...");
        const cultivos = await Cultivo.find({}, null, {
            skip: ((page - 1) * limit),
            limit: limit
        });

        const total = await Cultivo.countDocuments();
        response.json({ totalElements: total, cultivos: cultivos });
    } catch (e) {
        console.log("Error obteniendo todos los cultivos: ");
        console.log(e);
        response.status(500).send({ message: "Error al obtener todos los cultivos." });
    }
});

// Obtener todos los cultivos para auto-completar
router.get('/all/autocomplete', authGuard, async (request, response) => {
    try {
        console.log("Obteniendo todos los cultivos para auto-completar...");
        const cultivos = await Cultivo.find({}, null, {
            skip: 0,
            limit: 100
        });
        response.json({ cultivos: cultivos });
    } catch (e) {
        console.log("Error obteniendo todos los cultivos para auto-completar: ");
        console.log(e);
        response.status(500).send({ message: "Error al obtener todos los cultivos para auto-completar." });
    }
});

// Obtener cultivo por id
router.get('/:id', authGuard, async (request, response) => {
    console.log(request.params.id);
    try {
        console.log("Obteniendo cultivo por id...");
        const cultivo = await Cultivo.findById(request.params.id);

        const parametro = await Parametro.find();
        // Calculamos el precio del cultivo

        cultivo.precio = parametro[0].valor_agua * cultivo.cantidad_agua_semana +
            parametro[0].valor_fertilizante * cultivo.cantidad_fertilizante_semana +
            parametro[0].valor_semilla * cultivo.cantidad_semillas_hectarea;


        response.json({ cultivos: cultivo });
    } catch (e) {
        console.log("Error obteniendo cultivo por id: ");
        console.log(e);
        response.status(500).send({ message: "Error al obtener cultivo por id." });
    }
});

// Editar cultivo por id
router.put('/edit/:id', authGuard, async (request, response) => {
    try {
        console.log("Editando cultivo...");
        const { id } = request.params;
        const datos = request.body;
        
        const parametro = await Parametro.find();
        // Calculamos el precio del cultivo

        datos.precio = parametro[0].valor_agua * datos.cantidad_agua_semana +
            parametro[0].valor_fertilizante * datos.cantidad_fertilizante_semana +
            parametro[0].valor_semilla * datos.cantidad_semillas_hectarea;

        const cultivo = await Cultivo.findByIdAndUpdate(id, datos);
        response.json({ message: 'Cultivo editado con exito.', id: cultivo.id });
    } catch (e) {
        console.log("Error editando cultivo: ");
        console.log(e);
        response.status(500).send({ message: "Error al editar cultivo." });
    }
});

// Eliminar cultivo por id
router.delete('/delete/:id', authGuard, async (request, response) => {
    try {
        console.log("Eliminando cultivo...");
        const { id } = request.params;
        const cultivo = await Cultivo.findByIdAndDelete(id);
        response.json({ message: 'Cultivo eliminado con exito.', id: cultivo.id });
    } catch (e) {
        console.log("Error eliminando cultivo: ");
        console.log(e);
        response.status(500).send({ message: "Error al eliminar cultivo." });
    }
});

  

module.exports = router;