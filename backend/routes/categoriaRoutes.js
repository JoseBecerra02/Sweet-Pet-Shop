// routes/categoriaRoutes.js
const express = require('express');
const Categoria = require('../models/Categoria');
const router = express.Router();

// Ruta para agregar una nueva categoría
router.post('/', async (req, res) => {
    try {
        // Obtener la última categoría para obtener el id_categoria más alto
        const ultimaCategoria = await Categoria.findOne().sort({ id_categoria: -1 });

        const nuevoIdCategoria = ultimaCategoria ? ultimaCategoria.id_categoria + 1 : 1;

        const nuevaCategoria = new Categoria({
            id_categoria: nuevoIdCategoria, // Asignar un id_categoria único
            nombre: req.body.nombre,
        });

        await nuevaCategoria.save();
        res.status(201).json(nuevaCategoria);
    } catch (err) {
        console.error('Error en el servidor al agregar categoría:', err);
        res.status(500).json({ error: 'Error al agregar categoría' });
    }
});

// Obtener todas las categorías
router.get('/', async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

module.exports = router;
