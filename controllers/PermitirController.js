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
    // console.log(tokenUser);
    // console.log(datos.pagina);

    try {
        const data = desencriptarToken(tokenUser);
        
        console.log("Obteniendo permisos...");
        if ((data.user.rol === "Admin" || data.user.rol === "userConfig") && datos.pagina === "configuracion") {
            console.log('Permisos obtenidos con exito.');
            response.json({ message: 'Permisos obtenidos con exito.', permitir: true, status: 200 });
        }else if ((data.user.rol === "userConfig" || data.user.rol === "userGestion") && datos.pagina === "usuarios") {
            console.log('No tiene permisos para acceder a este recurso.');
            response.json({ message: 'No tiene permisos para acceder a este recurso.', permitir: false, status: 401 });
        }else if (data.user.rol === "userConfig" && datos.pagina === "gestion") {
            console.log('No tiene permisos para acceder a este recurso.');
            response.json({ message: 'No tiene permisos para acceder a este recurso.', permitir: false, status: 401 });
        }else{
            console.log('No tiene permisos para acceder a este recurso.');
            response.status(401).json({ message: 'No tiene permisos para acceder a este recurso.', permitir: false, status: 401 });
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
    // console.log(tokenUser);
    // console.log(datos);
    response.json({ message: 'Permisos obtenidos con exito.', permitir: true, status: 200 });
});


module.exports = router;
