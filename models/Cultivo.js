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
        required: true
    },
    precio: {
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

},
    {
        collection: 'Cultivos'
    },
    {
        timestamps: true
    }

);

exports.Cultivo = model('Cultivos', CultivoSchema);