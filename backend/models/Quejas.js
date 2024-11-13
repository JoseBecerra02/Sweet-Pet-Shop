const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuejaSchema = new Schema({
    id_usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: ['leido', 'no_leido', 'pendiente', 'resuelto'],
        default: 'no_leido'
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Queja', QuejaSchema);