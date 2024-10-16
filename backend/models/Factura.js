const mongoose = require('mongoose');

const FacturaSchema = new mongoose.Schema({
    id_factura: {
        type: Number,
        unique: true,
        required: true
    },
    id_producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventario',
        required: true
    },
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: [1, 'La cantidad debe ser al menos 1.']
    },
    valor_total: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now, // Asigna la fecha actual por defecto
        required: true
    }
}, { timestamps: true });

FacturaSchema.pre('save', generarIdSecuencial('Factura', 'id_factura'));

module.exports = mongoose.model('Factura', FacturaSchema);
