const mongoose = require('mongoose');
const generarIdSecuencial = require('../middlewares/generarIdSecuencial');

const FacturaSchema = new mongoose.Schema({
    id_factura: {
        type: Number,
        unique: true,
        required: true
    },
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    productos: [
        {
            id_producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Inventario',
                required: true
            },
            nombre_producto: {
                type: String,
                required: true
            },
            precio_unitario: {
                type: Number,
                required: true
            },
            cantidad: {
                type: Number,
                required: true,
                min: [1, 'La cantidad debe ser al menos 1.']
            },
            subtotal: {
                type: Number,
                required: true
            }
        }
    ],
    valor_total: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now,
        required: true
    }
}, { timestamps: true });

FacturaSchema.pre('save', generarIdSecuencial('Factura', 'id_factura'));

module.exports = mongoose.model('Factura', FacturaSchema);
