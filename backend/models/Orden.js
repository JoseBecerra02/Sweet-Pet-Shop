const mongoose = require('mongoose');
const generarIdSecuencial = require('../middlewares/generarIdSecuencial'); // Middleware para generar id secuencial

const OrdenSchema = new mongoose.Schema({
    id_orden: {
        type: Number,
        unique: true,
        required: true
    },
    estado: {
        type: String,
        required: true,
        unique: true,
        enum: ['bodega', 'reparto', 'entregado', 'pendiente', 'cancelado']
    },
    productos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    }],
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    subtotalesProductos: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    observaciones: {
        type: String
    }
}, { timestamps: true });

OrdenSchema.pre('save', generarIdSecuencial('Orden', 'id_orden')); // Usa el middleware aquí

module.exports = mongoose.model('Orden', OrdenSchema);
