// models/Usuario.js

const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  correo: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  nombre: { type: String, required: true },
  rol: { type: String, enum: ['cliente', 'admin'], default: 'cliente' },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
  telefono: { 
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); // Que el teléfono tenga 10 dígitos
      },
      message: props => `${props.value} no es un número de teléfono válido!`
    }
  },
  direccion: String,
  ciudad: String,
}, { timestamps: true }); // Agregar timestamps para createdAt y updatedAt

module.exports = mongoose.model('Usuario', UsuarioSchema);
