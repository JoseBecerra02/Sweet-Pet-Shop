const express = require('express');
const router = express.Router();
const Carrito = require('../models/Carrito');
const Factura = require('../models/Factura');
const { sendInvoiceEmail } = require('../controllers/MailController');

// Ruta para crear una factura a partir del carrito
router.post('/factura/crear', async (req, res) => {
    const { id_usuario } = req.body; 

    try {
        const carrito = await Carrito.find({ id_usuario }).populate('producto');
        if (carrito.length === 0) {
            return res.status(404).json({ error: 'No hay productos en el carrito' });
        }

        // Calcular el total
        let total = 0;
        const productos = carrito.map(item => {
            const subtotal = item.producto.precio * item.cantidad;
            total += subtotal;
            return {
                id_producto: item.producto._id,
                nombre_producto: item.producto.nombre_producto,
                precio_unitario: item.producto.precio,
                cantidad: item.cantidad,
                subtotal: subtotal
            };
        });

        // Crear la factura
        const nuevaFactura = new Factura({
            id_usuario,
            productos,
            valor_total: total,
            fecha: new Date()
        });

        await nuevaFactura.save();

        // Obtener el correo electrónico del usuario (asumiendo que tienes un modelo Usuario)
        const usuario = await Usuario.findById(id_usuario);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await sendInvoiceEmail(id_usuario, usuario.correo, {
            id_factura: nuevaFactura.id_factura,
            productos: nuevaFactura.productos,
            valor_total,
            fecha: nuevaFactura.fecha
        });

        // Limpiar el carrito después de crear la factura (opcional)
        await Carrito.deleteMany({ id_usuario });

        res.status(201).json({ message: 'Factura creada y enviada por correo', factura: nuevaFactura });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la factura' });
    }
});

// Ruta para obtener las facturas de un usuario
router.get('/facturas', async (req, res) => {
    const { id_usuario } = req.body;

    try {
        const facturas = await Factura.find({ id_usuario }).populate('productos.id_producto');
        res.status(200).json(facturas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las facturas' });
    }
});

module.exports = router;