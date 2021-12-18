const { Schema, model } = require('mongoose');

const CultivoSchema = new Schema({
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
        required: true,
        default: 'https://lh3.googleusercontent.com/pw/AM-JKLUhM-b5l3b0_y1fLl6SCel-vfZ2Sd1o4XwvkkMxTIvMModGVvOUV175JkZJzWGbxrpj_1BwGUt8AKvw6DRbg21cBUEeP9Ty2T3RaD15AqHVRv3xT5uWZFSNYGluanDg45fJdarKNuCMNH9-E_d7Bv4=w516-h405-no?authuser=0'
            
    },
    precio: {
        type: Number,
        required: true
    },
    area_destinada: {
        type: Number,
        required: true
    },
    cantidad_semillas_hectarea: {
        type: Number,
        required: true
    },
    cantidad_agua_semana: {
        type: Number,
        required: true
    },
    cantidad_fertilizante_semana: {
        type: Number,
        required: true
    },
    tiempo_recoleccion_hectarea: {
        type: Number,
        required: true
    },
    tiempo_cosecha_semana: {
        type: Number,
        required: true
    },
    kilogramos_hectareas: {
        type: Number,
        required: true
    },
    tiempos_espera: {
        type: Number,
        required: true
    },
    predio: {
        type: Schema.Types.ObjectId,
        ref: 'Predio'
    },
    fecha_siembra: {
        type: String,
        required: false
    },
    fecha_recoleccion: {
        type: String,
        required: false
    }

},
    {
        timestamps: true
    },
    {
        collection: 'Cultivos'
    }


);

exports.Cultivo = model('Cultivos', CultivoSchema);