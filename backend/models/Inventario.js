const mongoose = require('mongoose');
const generarIdSecuencial = require('../middlewares/generarIdSecuencial');

const InventarioSchema = new mongoose.Schema({
    id_producto: { type: Number, unique: true, required: true, default: 0, min: 0 },
    nombre_producto: { type: String, required: true, trim: true },
    categoria: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true 
    },
    cantidad: {
        type: Number,
        required: true,
        min: [0, 'La cantidad no puede ser negativa'],
    },
    precio: {
        type: Number,
        required: true,
        min: [0, 'El precio no puede ser negativo'],
    },
    ruta: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(https:\/\/drive\.google\.com\/.+)/.test(v); // Valida que sea un enlace a Google Drive
            },
            message: props => `${props.value} no es una URL válida de Google Drive!`
        }
    },
    descripcion: {
        type: String,
        maxlength: [500, 'La descripción no puede exceder los 500 caracteres'],
    }
}, { timestamps: true }); // Timestamps para createdAt y updatedAt

InventarioSchema.pre('save', generarIdSecuencial('Inventario', 'id_producto'));

module.exports = mongoose.model('Inventario', InventarioSchema);
