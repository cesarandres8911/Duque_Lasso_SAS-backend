const express = require('express');
const { authGuard } = require('../middlewares/auth');
const router = express.Router();
const { Cultivo } = require('../models/Cultivo');

// Crear cultivo nuevo
router.post('/new', authGuard, async (request, response) => {
    try {
        console.log("Creando cultivo nuevo...");
        const cultivo = new Cultivo(request.body);
        
        // Calculamos el precio del cultivo

        cultivo.precio=40043343453450;

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
    const page = parseInt(request.query.page);
    const limit = parseInt(request.query.limit);
    const tokenUser = request.headers['authorization'];
    // const data = desencriptarToken(tokenUser)

    try {
        console.log("Obteniendo todos los cultivos...");
        const cultivos = await Cultivo.find({}, null, {
            skip: ((page - 1) * limit),
            limit: limit
        });

        const total = await Cultivo.countDocuments();
        // const datos = cultivos.map(cultivo => {
        //     return {
        //         id: cultivo.id,
        //         nombre: cultivo.nombre,
        //         descripcion: cultivo.descripcion,
        //         imagen: cultivo.imagen,
        //         precio: cultivo.precio,
        //         cantidad_semillas_hectarea: cultivo.cantidad_semillas_hectarea,
        //         cantidad_agua_semana: cultivo.cantidad_agua_semana,
        //         cantidad_fertilizante_semana: cultivo.cantidad_fertilizante_semana,
        //         tiempo_recoleccion_hectarea: cultivo.tiempo_recoleccion_hectarea,
        //         tiempo_cosecha_semana: cultivo.tiempo_cosecha_semana,
        //         kilogramos_hectareas: cultivo.kilogramos_hectareas,
        //         tiempos_espera: cultivo.tiempos_espera,
                
        //     }
        // });


        response.json({ totalElements: total, cultivos: cultivos });
    } catch (e) {
        console.log("Error obteniendo todos los cultivos: ");
        console.log(e);
        response.status(500).send({ message: "Error al obtener todos los cultivos." });
    }
});

// Obtener cultivo por id

router.get('/:id', authGuard, async (request, response) => {
    try {
        console.log("Obteniendo cultivo por id...");
        const cultivo = await Cultivo.findById(request.query.id);
        response.json({cultivos:cultivo});
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
        console.log(id);
        const cultivo = await Cultivo.findByIdAndUpdate(id, request.body);
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