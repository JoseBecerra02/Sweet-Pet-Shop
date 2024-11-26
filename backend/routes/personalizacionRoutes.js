// routes/personalizacionRoutes.js

const express = require('express');
const router = express.Router();
const Personalizacion = require('../models/Personalizacion');
const Inventario = require('../models/Inventario');

// POST /api/personalizaciones
router.post('/personalizacion', async (req, res) => {
  try {
    const { usuarioId, productoId, opciones } = req.body;

    // Validar la existencia del producto
    const producto = await Inventario.findById(productoId);
    if (!producto) {
      return res.status(404).json({ mensaje: 'El producto no existe' });
    }

    // Crear una nueva personalización
    const nuevaPersonalizacion = new Personalizacion({ 
      usuarioId, 
      productoId, 
      opciones 
    });

    await nuevaPersonalizacion.save();
    res.status(201).json({ mensaje: 'Personalización guardada exitosamente', personalizacion: nuevaPersonalizacion });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al guardar la personalización', error });
  }
});

module.exports = router;
