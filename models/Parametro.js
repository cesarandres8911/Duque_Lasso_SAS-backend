const { Schema, model } = require('mongoose');

const ParametroSchema = new Schema({
    valor_agua: {
        type: Number,
        required: true,
        default: 0
    },
    valor_fertilizante: {
        type: Number,
        required: true,
        default: 0
    },
    valor_semilla: {
        type: Number,
        required: true,
        default: 0
    }
},
    {
        timestamps: true
    },
    {
        collection: 'Parametros'
    }
);

exports.Parametro = model('Parametro', ParametroSchema);
