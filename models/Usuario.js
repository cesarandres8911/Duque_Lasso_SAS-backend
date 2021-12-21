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
    imagen: {
        type: String,
        default: 'https://lh3.googleusercontent.com/ZcIqijLggCXPrn6oeFdFuVMN3Gs2TsEcEEGss-cenT5OBEgfalj1XiYJvNzRzakn7EFUvup39zpq65Pj9J0vu-83Rby1_iPIwC4vbL0ILBWlv2P6x81ZN7Aqr_R1fwa-4JqPWWY_1FpWfIClbtWWPTcswEksCSQEjDU7lC69JfMsovY6N9FbZyhdYW6-l5ohPFr6bnmFa5lXOLp4j-kt6cO1sn-dwBmq2xuIfEHciawpHAV7QCKYOAOUu6WoxmfWZSOLT1co3cpVcRwcgWIHsKRMl6OZjeBLbCwmmPgv08PZ6v3a0QNiMd4eXqfzuNaLfnwyr-flA-pDjGxoEJJe719KEtFAAnf_V4xCQwOBpGtUlqtcoaFcLqM0MXjVu1EyyrKCTZc_h38eAcGwfXLSMHV_nSV3MjCBL3u6BUGMhFMGl95_crM-UzDtkL4p_zIq6ojkB4MmwVGwYzqw2fjUT2R4PN4Rj1OMmlJ1K8b4umfcdkrLxPiJRdUvnIvyy_hSFOMPYDm84eMe8zhWug0HKd8g13nR9X7ISlqFt2SdO7vhPMpGN_tlLRwpj-R58K2TBo4eACcinq6yooE7e5mGnypAKCjClWH2pYx54eAv3tO_aFJ5RxLX4PrIP_wxaE52DDiwcGYs452dB_vkXpCiS2tqviEgGWifMYREWgHZOMv1xdhdlm5SXe-P_J5nCbb7JFQaexHRq9uW1NEMSHpaYhPIpJyfIJGm_ExwNxAqp9ro7no_Slz6oCBB2CW0rScdOM14aelYWVFlzLCO=s72-no'
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