const express = require('express');
const router = express.Router();
const Carrito = require('./models/Carrito'); // Ajusta la ruta al modelo Carrito
const Inventario = require('./models/Inventario'); // Ajusta la ruta al modelo Inventario

// Ruta para agregar un producto al carrito
router.post('/carrito/agregar', async (req, res) => {
    const { id_usuario, id_producto, cantidad } = req.body;

    try {
        // Verifica si el producto ya existe en el carrito para este usuario
        let item = await Carrito.findOne({ id_usuario, producto: id_producto });

        if (item) {
            // Si el producto ya está, aumenta la cantidad
            item.cantidad += cantidad;
        } else {
            // Verifica si el producto existe en el inventario
            const producto = await Inventario.findById(id_producto);
            if (!producto) return res.status(404).json({ error: 'Producto no encontrado en inventario' });

            // Si no está en el carrito, crea una nueva entrada
            item = new Carrito({ id_usuario, producto: id_producto, cantidad });
        }

        await item.save();

        // Recalcular el total del carrito
        const carrito = await Carrito.find({ id_usuario }).populate('producto');
        let total = carrito.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);

        res.status(200).json({ message: 'Producto agregado al carrito', item, total });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

// Ruta para eliminar un producto del carrito
router.delete('/carrito/eliminar/:id_producto', async (req, res) => {
    const { id_producto } = req.params;
    const { id_usuario } = req.body;

    try {
        const item = await Carrito.findOneAndDelete({ id_usuario, producto: id_producto });
        if (!item) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

        res.status(200).json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
});

// Ruta para modificar la cantidad de un producto en el carrito
router.put('/carrito/actualizar', async (req, res) => {
    const { id_usuario, id_producto, action } = req.body;

    try {
        const item = await Carrito.findOne({ id_usuario, producto: id_producto });
        if (!item) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

        // Ajusta la cantidad según la acción
        if (action === 'increment') {
            item.cantidad += 1;
        } else if (action === 'decrement' && item.cantidad > 1) {
            item.cantidad -= 1;
        } else {
            return res.status(400).json({ error: 'La cantidad no puede ser menor a 1' });
        }

        await item.save();

        // Recalcular el total del carrito para enviar en la respuesta
        const carrito = await Carrito.find({ id_usuario }).populate('producto');
        let total = carrito.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);

        res.status(200).json({ message: 'Cantidad actualizada', item, total });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});

// Ruta para obtener el total del carrito
router.get('/carrito', async (req, res) => {
    const { id_usuario } = req.body;

    try {
        const carrito = await Carrito.find({ id_usuario }).populate('producto');
        let total = 0;
        const items = carrito.map(item => {
            const subtotal = item.producto.precio * item.cantidad;
            total += subtotal;
            return {
                id_producto: item.producto._id,
                nombre_producto: item.producto.nombre_producto,
                cantidad: item.cantidad,
                precio_unitario: item.producto.precio,
                subtotal: subtotal
            };
        });

        res.status(200).json({ items, total });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el total del carrito' });
    }
});

module.exports = router;
