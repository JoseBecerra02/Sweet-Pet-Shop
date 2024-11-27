// models/Personalizacion.js

const mongoose = require('mongoose');

const PersonalizacionSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventario', required: true },
  opciones: {
    color: { 
      type: String, 
      required: true, 
      enum: ['#ff0000', '#0000ff', '#00ff00', '#000000', '#ffffff'], // Lista de colores permitidos
    },
  },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Personalizacion', PersonalizacionSchema);