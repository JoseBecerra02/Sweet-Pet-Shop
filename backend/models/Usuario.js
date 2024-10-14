const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  correo: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  rol: { type: String, default: 'cliente' },
  estado: { type: String, default: 'activo' },
  telefono: String,
  direccion: String,
  ciudad: String,
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
