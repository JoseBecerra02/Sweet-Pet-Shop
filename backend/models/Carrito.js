const mongoose = require('mongoose');
const generarIdSecuencial = require('../middlewares/generarIdSecuencial');

const CarritoSchema = new mongoose.Schema({
    id_carrito: { type: Number, unique: true, required: true, default: 0, min: 0 },
    producto: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Inventario', 
        required: true 
    },
    cantidad: {
        type: Number,
        required: true,
        min: [0, 'La cantidad no puede ser negativa'],
    },
}, { timestamps: true });

CarritoSchema.pre('save', generarIdSecuencial('Carrito', 'id_carrito'));

module.exports = mongoose.model('Carrito', CarritoSchema);
