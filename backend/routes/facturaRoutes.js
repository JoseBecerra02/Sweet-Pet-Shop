const express = require('express');
const router = express.Router();
const Carrito = require('../models/Carrito');
const Factura = require('../models/Factura');
const { sendInvoiceEmail } = require('../controllers/MailController');

// Ruta para crear una factura a partir del carrito
router.post('/factura/crear', async (req, res) => {
    const { id_usuario, id_correo, id_nombre, productos, valor_total } = req.body; 
  
    try {
      // Crear la factura directamente con los datos proporcionados
      const nuevaFactura = new Factura({
        id_usuario,
        productos,
        valor_total,
        fecha: new Date()
      });
  
      await nuevaFactura.save();
    
      // Enviar la factura por correo (descomenta esta línea cuando configures `sendInvoiceEmail`)
      console.log(id_correo);
      
      await sendInvoiceEmail(id_correo, {
        id_factura: nuevaFactura._id,
        id_nombre,
        productos: nuevaFactura.productos,
        valor_total: nuevaFactura.valor_total,
        fecha: nuevaFactura.fecha
      });
  
      // Limpiar el carrito después de crear la factura
      await Carrito.deleteMany({ id_usuario });
  
      res.status(201).json({ message: 'Factura creada y enviada por correo', factura: nuevaFactura });
    } catch (error) {
      console.error('Error al crear la factura:', error);
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
