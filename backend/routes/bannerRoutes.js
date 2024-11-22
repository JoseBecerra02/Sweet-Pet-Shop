// routes/categoriaRoutes.js
const express = require('express');
const Banner = require('../models/Banner');
const router = express.Router();

// Ruta para agregar una nueva categoría
// Ruta para agregar un nuevo banner
router.post('/', async (req, res) => {
    try {
        const banner = new Banner(req.body);
        await banner.save();
        res.status(201).send(banner);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Ruta para obtener todos los banners
router.get('/', async (req, res) => {
    try {
        const banners = await Banner.find({});
        res.status(200).send(banners);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Ruta para obtener un banner por ID
router.get('/:id', async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).send();
        }
        res.status(200).send(banner);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Ruta para actualizar un banner por ID
router.put('/:id', async (req, res) => {
    try {
        const banner = await Banner.findOneAndUpdate(
            { id_banner: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!banner) {
            return res.status(404).send();
        }
        res.status(200).send(banner);
    } catch (error) {
        res.status(400).send(error);
    }
});
// Ruta para eliminar un banner por ID
router.delete('/:id', async (req, res) => {
try {
    const banner = await Banner.findOneAndDelete({ id_banner: req.params.id });
    if (!banner) {
        return res.status(404).send();
    }
    res.status(200).send(banner);
} catch (error) {
    res.status(500).send(error);
}
});


module.exports = router;
