const express = require('express');
const { authGuard } = require('../middlewares/auth');
const { desencriptarToken } = require('../utils/authUtils');
const router = express.Router();

// Verificar si el usuario tiene permiso para acceder a la ruta de cada pagina
router.post('/', authGuard, async (request, response) => {
    const tokenUser = request.headers['authorization'];
    const datos = request.body;
    // const data = desencriptarToken(datos.token);
    // console.log(pagina);
    console.log(tokenUser);
    console.log(datos);

    try {
        const data = desencriptarToken(tokenUser);
        console.log(data);
        console.log("Obteniendo permisos...");
        if ((data.user.rol === "Admin" || data.user.rol === "userConfig") && datos.pagina === "configuracion") {
            response.json({ message: 'Permisos obtenidos con exito.', permitir: true, status: 200 });
        } if ((data.user.rol === "userConfig" || datos.user.rol === "userGestion") && datos.pagina === "usuarios") {
            response.json({ message: 'No tiene permisos para acceder a este recurso.', permitir: false, status: 401 });
        } if (data.user.rol === "userConfig" && datos.pagina === "gestion") {
            response.json({ message: 'No tiene permisos para acceder a este recurso.', permitir: false, status: 401 });
        }

    } catch (e) {
        console.log("Error obteniendo permisos: ");
        console.log(e);
        response.status(500).send({ message: "Error al obtener permisos.", permitir: false });
    }
});

// Verificar si el usuario tiene permiso para editar o eliminar
router.post('/edit', authGuard, async (request, response) => {
    const tokenUser = request.headers['authorization'];
    const datos = request.body;
    // const data = desencriptarToken(datos.token);
    // console.log(pagina);
    console.log(tokenUser);
    console.log(datos);
    response.json({ message: 'Permisos obtenidos con exito.', permitir: true, status: 200 });
});


module.exports = router;
