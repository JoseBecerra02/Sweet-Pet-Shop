const mongoose = require('mongoose');
const generarIdSecuencial = require('../middlewares/generarIdSecuencial'); // Middleware para generar id secuencial

const Schema = mongoose.Schema;

const QuejaSchema = new Schema({
    id_usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    id_orden: {
        type: Schema.Types.ObjectId,
        ref: 'Orden',
        required: true
    },
    id_queja: { type: Number, unique: true, required: true, default: 0, min: 0 },
    asunto: {
        type: String,
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

QuejaSchema.pre('save', generarIdSecuencial('Queja', 'id_queja'));
module.exports = mongoose.model('Queja', QuejaSchema);