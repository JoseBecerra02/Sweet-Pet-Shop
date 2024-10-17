    const mongoose = require('mongoose');
    const generarIdSecuencial = require('../middlewares/generarIdSecuencial'); // Middleware para generar id secuencial

    const CategoriaSchema = new mongoose.Schema({
        id_categoria: {
            type: Number,
            unique: true,
            required: true
        },
        nombre: {
            type: String,
            required: true,
            unique: true
        }
    }, { timestamps: true });

    CategoriaSchema.pre('save', generarIdSecuencial('Categoria', 'id_categoria')); // Usa el middleware aquí

    module.exports = mongoose.model('Categoria', CategoriaSchema);
