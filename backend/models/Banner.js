const mongoose = require('mongoose');
const generarIdSecuencial = require('../middlewares/generarIdSecuencial');

const BannerSchema = new mongoose.Schema({
    id_banner: { type: Number, unique: true, required: true, default: 0, min: 0 },
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: { 
        type: String,
        required: true,
        trim: true
    }
});

BannerSchema.pre('save', generarIdSecuencial('Banner', 'id_banner'));

module.exports = mongoose.model('Banner', BannerSchema);