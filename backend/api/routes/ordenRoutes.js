const express = require('express');
const Orden = require('../models/Orden');

const router = express.Router();

// Ruta para agregar una nueva orden
router.post('/', async (req, res) => {
    try {
        console.log('Datos de la orden:', req.body);

        // Generar el id_orden secuencialmente
        const count = await Orden.countDocuments();
        const nuevoIdOrden = count + 1;

        // Crear la nueva orden con el id generado
        const nuevaOrden = new Orden({
            id_orden: nuevoIdOrden,
            cliente: req.body.cliente,
            productos: req.body.productos,
            total: req.body.total,
            estado: req.body.estado,
            subtotalesProductos: req.body.subtotalesProductos,
            observaciones: req.body.observaciones || '',
        });

        await nuevaOrden.save();
        res.status(201).json(nuevaOrden);
    } catch (err) {
        console.error('Error en el servidor al agregar orden:', err);
        res.status(500).json({ error: 'Error al agregar orden' });
    }
});


// Obtener todas las órdenes
router.get('/', async (req, res) => {
    try {
        const ordenes = await Orden.find();
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener órdenes' });
    }
});

// Actualizar una orden por ID
router.put('/:id', async (req, res) => {
    try {
        const ordenActualizada = await Orden.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!ordenActualizada) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.json(ordenActualizada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar una orden por ID
router.delete('/:id', async (req, res) => {
    try {
        const ordenEliminada = await Orden.findByIdAndDelete(req.params.id);
        if (!ordenEliminada) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Editar una orden por ID
router.patch('/:id', async (req, res) => {
    try {
        const ordenEditada = await Orden.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!ordenEditada) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.json(ordenEditada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar el estado de una orden por ID de orden
router.patch('/estado/:id_orden', async (req, res) => {
    try {
        const { id_orden } = req.params;
        const { estado } = req.body;

        const ordenActualizada = await Orden.findOneAndUpdate(
            { id_orden },
            { estado },
            { new: true, runValidators: true }
        );

        if (!ordenActualizada) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        res.json(ordenActualizada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Obtener todas las órdenes de un usuario por ID de cliente
router.get('/cliente/:id_cliente', async (req, res) => {
    try {
        const { id_cliente } = req.params;
        const ordenes = await Orden.find({ cliente: id_cliente });
        if (ordenes.length === 0) {
            return res.status(404).json({ message: 'No se encontraron órdenes para este cliente' });
        }
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener órdenes del cliente' });
    }
});

module.exports = router;