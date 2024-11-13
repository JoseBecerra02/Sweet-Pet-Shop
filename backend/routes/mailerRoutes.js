const express = require('express');
const router = express.Router();
const sendMail = require('../utils/mailer');
const Inventory = require('../models/Inventario');

router.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;
    // console.log('Datos del correo:', req.body);
    const lowStockItems = await Inventory.find({ $expr: { $lt: ["$cantidad", "$umbral"] } });
    // console.log('Items con bajo stock:', lowStockItems);
    const lowStockText = "Los siguientes items se encuentran bajo el umbral " + lowStockItems.map(item => `ID: ${item._id}, Nombre: ${item.nombre_producto}, Cantidad: ${item.cantidad}`).join('\n');
    // console.log(lowStockText);
    // return res.status(200).json(lowStockText);
    // Crear el HTML de la tabla
    let tablaHTML = `
        <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
        <thead>
            <tr style="background-color: #007bff; color: white;">
            <th style="padding: 8px; border: 1px solid #ddd;">ID</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Nombre</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Cantidad</th>
            </tr>
        </thead>
        <tbody>`;

    lowStockItems.forEach(producto => {
        tablaHTML += `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${producto.id_producto}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${producto.nombre_producto}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${producto.cantidad}</td>
            </tr>`;
                });

    tablaHTML += `
        </tbody>
        </table>`;


    const mailOptions = {
        to: to,
        subject: "Alerta de inventario bajo ",
        text: lowStockText,
        html: `
        <html>
          <body>
            <h1>Informe de Productos</h1>
            <p>Hola,</p>
            <p>A continuación se muestra una tabla con los productos con stock bajo:</p>
            ${tablaHTML}
            <footer>
              <p>Saludos,</p>
              <p><strong>SweetPet</strong></p>
            </footer>
          </body>
        </html>
      `, 
    };

    try {
        const result = await sendMail(mailOptions);
        res.status(200).json({ message: 'Correo enviado exitosamente', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;