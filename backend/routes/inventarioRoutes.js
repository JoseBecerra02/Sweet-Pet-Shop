const express = require('express');
const Inventario = require('../models/Inventario'); // Modelo de Inventario

const router = express.Router();

// Ruta para obtener todos los productos del inventario con las categorías populadas
router.get('/', async (req, res) => {
  try {
    const productos = await Inventario.find().populate('categoria', 'nombre');
    res.json(productos);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
  try {
    const nuevoProducto = new Inventario(req.body);
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (err) {
    console.error('Error al agregar producto:', err);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

module.exports = router;