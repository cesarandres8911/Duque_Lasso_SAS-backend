const express = require('express');
const { authGuard } = require('../middlewares/auth');
const router = express.Router();
const { Cultivo } = require('../models/Cultivo');
const { Parametro } = require('../models/Parametro');

// Crear cultivo nuevo
router.post('/new', authGuard, async (request, response) => {
    try {
        console.log("Creando cultivo nuevo...");
        const cultivo = new Cultivo(request.body);
        const parametro = await Parametro.find();
        // Calculamos el precio del cultivo

        cultivo.precio = parametro[0].valor_agua * cultivo.cantidad_agua +
            parametro[0].valor_fertilizante * cultivo.cantidad_fertilizante +
            parametro[0].valor_semilla * cultivo.cantidad_semilla;

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
        console.log(datos);
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