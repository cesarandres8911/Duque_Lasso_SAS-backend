const express = require('express');
const { Usuario } = require('../models/Usuario');
const { validarUsuario, desencriptarToken, getTokenRecovery, verificarToken } = require('../utils/authUtils');
const { authGuard } = require('../middlewares/auth');
const nodemailer = require('nodemailer')


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
        // console.log(request.body);
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
        // console.log(request.body);
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

// Obtener todos los usuario por rol igual a userGestion para autocompletar
router.get('/all/gestion/autocomplete', authGuard, async (request, response) => {

    try {
        console.log("Obteniendo todos los usuarios...");
        const usuarios = await Usuario.find({ rol: "userGestion" }, null, {
            
                skip: 0,
                limit: 100
            })
            .exec();
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
        
        response.json({usuarios:datos});
    } catch (e) {
        console.log("Error al obtener todos los usuarios.");
        console.log(e);
        response.status(500).send({ message: "Error al obtener los usuarios." });
    }
});

// Obtener usuaio por id
router.get('/:id', authGuard, async (request, response) => {
    try {
        console.log("Obteniendo predio por id...");
        const { id } = request.params;
        // console.log(id);
        const usuario = await Usuario.findById(id);
        response.json({usuarios: usuario});
    } catch (e) {
        console.log("Error obteniendo el usuario por id: ");
        console.log(e);
        response.status(500).send({ message: "Error al obtener el usuario" });
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
        // console.log(request.params.id);
        const usr = await Usuario.findByIdAndDelete(request.params.id);
        response.json({ message: 'Usuario eliminado con exito.' });
    } catch (e) {
        console.log("Error al eliminar usuario.");
        console.log(e);
        response.status(500).send({ message: "Error al eliminar usuario." });
    }
});

// validar si un correo existe en la base de datos para recuperar contraseña
router.post('/validarCorreo', async (request, response) => {
    try {
        console.log("Validando correo...");
        const { email } = request.body;
        // console.log(email);
        const usr = await Usuario.findOne({ email: email });
        if (usr) {
            // Generar token de recuperacion
            const token = await getTokenRecovery(usr);
            // console.log(token);
            // Enviar correo con token
            // console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            const mailOptions = {
                from: '"Recuperar contraseña" <' + process.env.EMAIL_USER + '>',
                to: email,
                subject: 'Recuperar contraseña en Duque Lasso SAS',
                text: 'Hola, para recuperar tu contraseña ingresa al siguiente link: ' + process.env.URL_FRONT + '/users/recuperar/' + token,
                html: '<p>Hola, para recuperar tu contraseña ingresa al siguiente link: <a href="' + process.env.URL_FRONT + '/users/recuperar/' + token + '">Recuperar contraseña</a></p>'
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    response.status(500).send({ message: "Error al enviar correo." });
                } else {
                    console.log('Email sent: ' + info.response);
                    response.json({ message: 'Correo enviado con exito.' });
                }
            });
        } else {
            response.status(500).send({ message: "El correo no existe." });
        }
    } catch (e) {
        console.log("Error al validar correo.");
        console.log(e);
        response.status(500).send({ message: "Error al validar correo." });
    }
});

// Validar el token de recuperacion
router.get('/validar/:token', async (request, response) => {
    try {
        console.log("Validando token...");
        const { token } = request.params;
        // console.log(token);
        const user = await verificarToken(token);
        if (user) {
            response.json({ message: 'Token validado con exito.' });
        }else{
            response.status(500).send({ message: "Token invalido." });
        }
      
    } catch (e) {
        console.log("Error al validar token.");
        console.log(e);
        response.status(500).send({ message: "Error al validar token." });
    }
});


// Recuperar contraseña desde el enlace enviado por correo
router.post('/recuperar/:token', async (request, response) => {
    try {
        console.log("Recuperando contraseña...");
        const { token } = request.params;
        const decoded = await verificarToken(token);
        // console.log(decoded.user);
        const usr = await Usuario.findById(decoded.user._id);
        const {newPassword, confirmarPassword} = request.body;

        if (newPassword === confirmarPassword) {
            // const password = await usr.cambiarPassword(newPassword);
            // console.log(password);
            usr.contrasena = newPassword;
            await usr.save();
            response.json({ message: 'Contraseña recuperada con exito.' });
        } else {
            response.status(500).send({ message: "Las contraseñas no coinciden." });
        }
        
    } catch (e) {
        console.log("Error al recuperar contraseña.");
        console.log(e);
        response.status(500).send({ message: "Error al recuperar contraseña." });
    }
});




module.exports = router;