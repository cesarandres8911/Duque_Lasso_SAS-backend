const { Schema, model } = require('mongoose');

const ProyectoSchema = new Schema({
    nombre: {
        type: String,
        max: [50, 'El nombre no puede tener mas de 50 caracteres'],
        required: [true, 'El nombre es obligatorio']
    },
    fecha: {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    },
    descripcion: {
        type: String,
        max: [200, 'La descripcion no puede tener mas de 200 caracteres'],
    },
    director: {
        type: String,
        required: [true, 'El director es obligatorio']
    },
    completado: {
        type: Boolean,
        required: [true, 'El estado es obligatorio'],
        default: false
    }
},
    {
        collection: 'Proyectos'
    }
);

exports.Proyecto = model('Proyecto', ProyectoSchema);