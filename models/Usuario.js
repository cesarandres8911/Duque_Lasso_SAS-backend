const { genSalt, hash, compare } = require('bcrypt');
const { Schema, model } = require('mongoose');
const validator = require('validator');

const usuarioSchema = new Schema({
     
    nombre: {
        type: String,
        required: [true, 'El nombre del usuario es obligatorio.']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido del usuario es obligatorio.']
    },
    email: {
        type: String,
        unique: [true, 'El email del usuario no está disponible.'],
        required: [true, 'El email del usuario es obligatorio.'],
        lowercase: true,
        validate: [validator.isEmail, 'El email del usuario no es válido.'],
        
    },
    contrasena: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono del usuario es obligatorio.']
    },
    rol: {
        type: String,
        required: [true, 'El rol del usuario es obligatorio.']
    }
},
{ 
    collection: 'Usuarios'
});

usuarioSchema.pre('save', async function (next) {
    console.log('Encriptando contraseña...');
    const salt = await genSalt(parseInt(process.env.BCRYPT_ROUNDS));
    this.contrasena = await hash(this.contrasena, salt);
    next();
});

usuarioSchema.methods.compararPasswords = async function (passwordTextoPlano) {
    console.log('Comparando contraseñas...');

    return await compare(passwordTextoPlano, this.contrasena)
}

// cambiar password
usuarioSchema.methods.cambiarPassword = async function (passwordTextoPlano) {
    console.log('Cambiando contraseña...');
    const salt = await genSalt(parseInt(process.env.BCRYPT_ROUNDS));
    console.log('Encriptando contraseña...');
    this.contrasena = await hash(passwordTextoPlano, salt);
    return this.contrasena;
}

exports.Usuario = model('Usuario', usuarioSchema);