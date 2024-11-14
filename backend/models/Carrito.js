const mongoose = require('mongoose');

const CarritoSchema = new mongoose.Schema({
    id_usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario',
        required: true 
    },
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

CarritoSchema.index({ id_usuario: 1, producto: 1 }, { unique: true });

module.exports = mongoose.model('Carrito', CarritoSchema);
