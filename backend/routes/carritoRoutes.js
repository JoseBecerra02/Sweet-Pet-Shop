const express = require('express');
const router = express.Router();
const Carrito = require('../models/Carrito'); // Ajusta la ruta al modelo Carrito
const Inventario = require('../models/Inventario'); // Ajusta la ruta al modelo Inventario
const Personalizacion = require('../models/Personalizacion'); // Ajusta la ruta al modelo de Personalizacion


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
router.get('/carrito/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;

    try {
        // Hacemos la búsqueda del carrito y hacemos el populate del producto
        const carrito = await Carrito.find({ id_usuario }).populate('producto');
        
        let total = 0;
        const items = carrito.map(item => {
            if (!item.producto) {
                console.error(`Producto no encontrado para el item con id_producto: ${item.producto}`);
                // Si el producto no se encuentra, no incluimos este item
                return null;
            }

            // Construir cada item solo si el producto existe
            const subtotal = item.producto.precio * item.cantidad;
            total += subtotal;
            return {
                id_producto: item.producto._id,
                nombre_producto: item.producto.nombre_producto,
                cantidad: item.cantidad,
                precio_unitario: item.producto.precio,
                subtotal: subtotal
            };
        }).filter(Boolean); // Filtrar los items nulos

        res.status(200).json({ items, total });
    } catch (error) {
        console.error('Error al obtener el total del carrito:', error);
        res.status(500).json({ error: 'Error al obtener el total del carrito' });
    }
});

// Ruta para agregar una personalización al carrito
router.post('/carrito/agregarPersonalizacion', async (req, res) => {
    const { id_usuario, id_personalizacion, cantidad } = req.body;

    try {
        // Buscar la personalización en la base de datos
        const personalizacion = await Personalizacion.findById(id_personalizacion).populate('productoId');
        if (!personalizacion) {
            return res.status(404).json({ error: 'Personalización no encontrada' });
        }

        // Verifica si el producto personalizado ya existe en el carrito para este usuario
        let item = await Carrito.findOne({ id_usuario, producto: personalizacion.productoId._id });

        if (item) {
            // Si el producto ya está, aumenta la cantidad
            item.cantidad += cantidad;
        } else {
            // Si no está en el carrito, crea una nueva entrada con la personalización
            item = new Carrito({ id_usuario, producto: personalizacion.productoId._id, cantidad });
        }

        await item.save();

        // Recalcular el total del carrito
        const carrito = await Carrito.find({ id_usuario }).populate('producto');
        let total = carrito.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);

        res.status(200).json({ message: 'Producto personalizado agregado al carrito', item, total });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto personalizado al carrito' });
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
router.put('/carrito/actualizarPersonalizacion', async (req, res) => {
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

        res.status(200).json({ message: 'Cantidad de producto actualizada', item, total });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});


module.exports = router;
