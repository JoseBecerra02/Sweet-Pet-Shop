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


// GET /api/personalizaciones/:productoId
router.get('/personalizacion/:productoId', async (req, res) => {
  try {
    const { productoId } = req.params;

    // Buscar la personalización por productoId
    const personalizacion = await Personalizacion.findOne({ productoId });
    if (!personalizacion) {
      return res.status(404).json({ mensaje: 'Personalización no encontrada para el producto especificado' });
    }

    res.status(200).json({ personalizacion });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la personalización', error });
  }
});

// GET /api/personalizaciones/usuario/:usuarioId
router.get('/personalizaciones/usuario/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;

    // Buscar todas las personalizaciones por usuarioId
    const personalizaciones = await Personalizacion.find({ usuarioId });
    if (!personalizaciones || personalizaciones.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron personalizaciones para el usuario especificado' });
    }

    res.status(200).json({ personalizaciones });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las personalizaciones', error });
  }
});

// DELETE /api/personalizacion/eliminar/:productoId/:usuarioId
router.delete('/personalizacion/eliminar/:productoId/:usuarioId', async (req, res) => {
  try {
    const { productoId, usuarioId } = req.params;

    // Eliminar la personalización que coincida con el productoId y usuarioId
    const result = await Personalizacion.findOneAndDelete({ productoId, usuarioId });
    if (!result) {
      return res.status(404).json({ mensaje: 'Personalización no encontrada para el producto especificado' });
    }

    res.status(200).json({ mensaje: 'Personalización eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la personalización', error });
  }
});


module.exports = router;
