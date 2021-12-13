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
    area: {
        type: Number,
        required: true
    },
    lactitud: {
        type: Number,
        required: true
    },
    longitud: {
        type: Number,
        required: true
    },
    valor_agua: {
        type: Number,
        required: true
    },
    valor_kilogramo_fertilizante: {
        type: Number,
        required: true
    },
    cultivos: [{
        type: Schema.Types.ObjectId,
        ref: 'Cultivos'
    }],

},

    {
        collection: 'Predios'
    },
    {
        timestamps: true
    }
);

exports.Predio = model('Predios', PredioSchema);