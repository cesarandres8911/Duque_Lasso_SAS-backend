const { Schema, model } = require('mongoose');

const PredioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: false,
        default: 'https://lh3.googleusercontent.com/pw/AM-JKLUhM-b5l3b0_y1fLl6SCel-vfZ2Sd1o4XwvkkMxTIvMModGVvOUV175JkZJzWGbxrpj_1BwGUt8AKvw6DRbg21cBUEeP9Ty2T3RaD15AqHVRv3xT5uWZFSNYGluanDg45fJdarKNuCMNH9-E_d7Bv4=w516-h405-no?authuser=0'
    },

    area: {
        type: Number,
        required: true
    },
    latitud: {
        type: String,
        required: true
    },
    longitud: {
        type: String,
        required: true
    },
    valor_agua: {
        type: Number,
        default: 0
    },
    valor_kilogramo_fertilizante: {
        type: Number,
        default: 0
    },
    asignado: {
        type: Boolean,
        default: false
    },
    areaAsignada: {
        type: Number,
        default: 0
    },
    // area disponible para cultivo por defecto se coloca la misma area del predio

    areaDisponible: {
        type: Number,
        default: 0
    },
    usuario_asignado: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    cultivos: [{
        type: Schema.Types.ObjectId,
        ref: 'Cultivo'
    }]
},
    {
        timestamps: true
    },
    {
        collection: 'Predios'
    }

);

exports.Predio = model('Predios', PredioSchema);