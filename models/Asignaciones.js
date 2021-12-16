const { Schema, model } = require('mongoose');

const AsignadosSchema = new Schema({
    cultivos: [{
        type: Schema.Types.ObjectId,
        ref: 'Cultivos'
    }],
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'

    }
},
{
        timestamps: true
    },
    {
        collection: 'Predios'
    }

);

exports.Asignados = model('Asignados', AsignadosSchema);