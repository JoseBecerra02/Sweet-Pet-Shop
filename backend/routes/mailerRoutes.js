const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventario');
const transporter = require('../config/mailer');

// Función para enviar correo de bienvenida
router.post('/send-email', async (req, res) => {
    const { to } = req.body;

    const lowStockItems = await Inventory.find({ $expr: { $lt: ["$cantidad", "$umbral"] } });
    const lowStockText = "Los siguientes items se encuentran bajo el umbral " + lowStockItems.map(item => `ID: ${item._id}, Nombre: ${item.nombre_producto}, Cantidad: ${item.cantidad}`).join('\n');
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
        from: '"Sweet Pet Shop" <SweetPetSchi@gmail.com>',
        to: to,
        subject: "Bienvenido a SweetPet Shop",
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
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Email enviado' });


});

module.exports = router;