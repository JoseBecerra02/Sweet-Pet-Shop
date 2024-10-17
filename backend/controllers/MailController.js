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
const sendSuspensionAlertEmail = async (to, reason) => {
  const mailOptions = {
    from: '"Sweet Pet Shop" <SweetPetSchi@gmail.com>',
    to,
    subject: "Alerta de Suspensión de Cuenta",
    html: `<p>Tu cuenta ha sido suspendida por la siguiente razón: ${reason}.</p><p>Si crees que esto es un error, contáctanos.</p>`
  };
  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendWelcomeEmail,
  sendSuspensionAlertEmail
};
