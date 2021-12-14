const express = require('express');
const { Usuario } = require('../models/Usuario');
const { validarUsuario, desencriptarToken } = require('../utils/authUtils');
const { authGuard } = require('../middlewares/auth');

const router = express.Router();

router.post('/new', authGuard, async (request, response) => {
    try {
        console.log("Creando usuario nuevo...");
        const usr = new Usuario(request.body);
        await usr.save();
        response.json({ message: 'Usuario guardado con exito.', id: usr.id });
    } catch (e) {
        console.log("Error creando usuario nuevo: ");
        console.log(e);
        response.status(500).send({ message: "Error al crear usuario nuevo." });
    }

});

//{ username: xxxxxx, password: xxxxxxx }
router.post('/login', async (request, response) => {
    try {
        console.log(request.body);
        const { refreshToken, accessToken, datosUser } = await validarUsuario(request.body);
        response.status(200).json({ token: accessToken, datosUser: datosUser });

    } catch (e) {
        console.log('Error al intentar autenticar el usuario.');
        console.log(e);
        response.status(401).send({ message: 'Nombre de usuario o contraseña incorrecta.' });
    }
});

// Cambiar contraseña
router.post('/cambiarPass', authGuard, async (request, response) => {
    try {
        console.log("Cambiando contraseña...");
        console.log(request.body);
        const { refreshToken, accessToken, datosUser } = await validarUsuario(request.body);
        const usr = await Usuario.findOne({ email: datosUser.email });
        // usr.password = request.body.newPassword;
        const newPassword = await usr.cambiarPassword(request.body.newPassword);

        Usuario.findOneAndUpdate({ email: datosUser.email }, { $set: { contrasena: newPassword } }, (err, usr) => {
            if (err) {
                console.log("Error al cambiar contraseña: ");
                console.log(err);
                response.status(500).send("Error al cambiar contraseña.");
            }
        });

        response.json({ message: 'Contraseña cambiada con exito.', usuario: usr.email, status: 200 });
        console.log("Contraseña cambiada con exito.");

    } catch (e) {
        console.log('Error al intentar cambiar la contraseña.');
        console.log(e);
        response.status(401).send({ message: 'Contraseña actual incorrecta.' });
    }
});

// Obtener todos los usuarios
router.get('/all', authGuard, async (request, response) => {
    const page = parseInt(request.query.page);
    const limit = parseInt(request.query.limit);
    const tokenUser = request.headers['authorization'];

    // veriicamos que el usuario es admin
    const data = desencriptarToken(tokenUser)
    if (data.user.rol !== "Admin") {
        response.status(401).send({ message: 'No tiene permisos para acceder a este recurso.' });

    } else {

        try {
            console.log("Obteniendo todos los usuarios...");
            const usuarios = await Usuario.find({}, null, {
                skip: ((page - 1) * limit),
                limit: limit
            })
                .exec();
                // total de usuarios
            const total = await Usuario.countDocuments();
            const datos = usuarios.map(u => {
                return {
                    _id: u._id,
                    email: u.email,
                    nombre: u.nombre,
                    apellido: u.apellido,
                    telefono: u.telefono,
                    rol: u.rol,
                }
            });
            response.json({totalElements: total, usuarios: datos });
            // response.json(datos);
        } catch (e) {
            console.log("Error al obtener todos los usuarios.");
            console.log(e);
            response.status(500).send({ message: "Error al obtener los usuarios." });
        }
    }
});

// Editar usuario
router.put('/edit/:id', authGuard, async (request, response) => {
    try {
        console.log("Editando usuario...");
        // console.log(request.body);
        // const { refreshToken, accessToken, datosUser } = await validarUsuario(request.body);
        const usr = await Usuario.findByIdAndUpdate(request.params.id, request.body, { new: true });
        response.json({ message: 'Usuario editado con exito.' });
    } catch (e) {
        console.log("Error al editar usuario.");
        console.log(e);
        response.status(500).send({ message: "Error al editar usuario." });
    }
});

// Eliminar usuario
router.delete('/delete/:id', authGuard, async (request, response) => {
    try {
        console.log("Eliminando usuario...");
        console.log(request.params.id);
        const usr = await Usuario.findByIdAndDelete(request.params.id);
        response.json({ message: 'Usuario eliminado con exito.' });
    } catch (e) {
        console.log("Error al eliminar usuario.");
        console.log(e);
        response.status(500).send({ message: "Error al eliminar usuario." });
    }
});


module.exports = router;