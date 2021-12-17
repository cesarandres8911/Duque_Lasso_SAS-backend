const { Schema, model } = require('mongoose');

const AsignarPredioSchema = new Schema({
    predio: [{
        type: Schema.Types.ObjectId,
        ref: 'Predio'
    }],
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'

    }
},
{
        timestamps: true
    },
    {
        collection: 'AsignarPredios'
    }

);

exports.AsignarPredio = model('AsignarPredio', AsignarPredioSchema);