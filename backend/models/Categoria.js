const mongoose = require('mongoose');
const generarIdSecuencial = require('../middlewares/generarIdSecuencial');

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

CategoriaSchema.pre('save', generarIdSecuencial('Categoria', 'id_categoria'));

module.exports = mongoose.model('Categoria', CategoriaSchema);
