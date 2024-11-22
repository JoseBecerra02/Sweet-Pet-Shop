// routes/categoriaRoutes.js
const express = require('express');
const Queja = require('../models/Quejas');
const router = express.Router();

// Ruta para agregar una nueva categoría
// Ruta para obtener todas las quejas
router.get('/', async (req, res) => {
    try {
        const quejas = await Queja.find();
        res.json(quejas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Ruta para crear una nueva queja
router.post('/', async (req, res) => {
    const queja = new Queja({
        id_usuario: req.body.id_usuario,
        id_orden: req.body.id_orden,
        asunto: req.body.asunto,
        descripcion: req.body.descripcion
    });
    // res.status(201).json(queja);
    const newQueja = await queja.save();
    try {
        res.status(201).json(newQueja);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}); 
// Ruta para editar una queja basada en id_queja
router.put('/:id_queja', async (req, res) => {

    try {
        const queja = await Queja.findOne({ id_queja: req.params.id_queja });
        if (!queja) {
            return res.status(404).json({ message: 'Queja no encontrada' });
        }

        queja.asunto = req.body.asunto || queja.asunto;
        queja.descripcion = req.body.descripcion || queja.descripcion;

        const updatedQueja = await queja.save();
        res.json(updatedQueja);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
