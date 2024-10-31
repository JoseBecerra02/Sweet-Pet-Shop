const transporter = require('../config/mailer');

// Función para enviar correo de bienvenida
const sendWelcomeEmail = async (to, name) => {
  const mailOptions = {
    from: '"Sweet Pet Shop" <SweetPetSchi@gmail.com>',
    to,
    subject: "Bienvenido a SweetPet Shop",
    html: `<b>¡Hola ${name}, bienvenido a SweetPet Shop!</b><p>Estamos encantados de que te hayas unido a nuestra comunidad.</p>`
  };
  await transporter.sendMail(mailOptions);
};

// Función para enviar alerta de suspensión de cuenta
const sendSuspensionAlertEmail = async (to, name) => {
  const mailOptions = {
    from: '"Sweet Pet Shop" <SweetPetSchi@gmail.com>',
    to,
    subject: "Alerta de Suspensión de Cuenta",
    html: `<p>${name}, tu cuenta ha sido suspendida. </p><p>Si crees que esto es un error, contáctanos.</p>`
  };
  await transporter.sendMail(mailOptions);
};

// Función para enviar correo con la factura de la compra
const sendInvoiceEmail = async (to, invoiceDetails) => {
  const { id_factura, id_nombre, productos, valor_total, fecha } = invoiceDetails;

  // Crea una tabla HTML para los productos
  const productsTableRows = productos.map(product => `
      <tr>
          <td>${product.nombre_producto}</td>
          <td>${product.precio_unitario}</td>
          <td>${product.cantidad}</td>
          <td>${product.subtotal}</td>
      </tr>
  `).join('');

  const mailOptions = {
      from: '"Sweet Pet Shop" <SweetPetSchi@gmail.com>',
      to,
      subject: "Factura de tu Compra",
      html: `
          <h1>Factura #${id_factura}</h1>
          <p>Hola ${id_nombre}, gracias por tu compra.</p>
          <p>Detalles de la factura:</p>
          <p>Fecha: ${new Date(fecha).toLocaleDateString()}</p>
          <table border="1" cellpadding="5" cellspacing="0">
              <thead>
                  <tr>
                      <th>Producto</th>
                      <th>Precio Unitario</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                  </tr>
              </thead>
              <tbody>
                  ${productsTableRows}
              </tbody>
          </table>
          <p><strong>Valor Total: $${valor_total}</strong></p>
          <p>¡Gracias por tu compra!</p>
      `
  };

  await transporter.sendMail(mailOptions);
};


module.exports = {
  sendWelcomeEmail,
  sendSuspensionAlertEmail,
  sendInvoiceEmail
};
