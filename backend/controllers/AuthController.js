// controllers/AuthController.js

const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { sendWelcomeEmail, sendSuspensionAlertEmail } = require('../controllers/MailController');

const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

const googleLoginBackend = async (req, res) => {
  const { token } = req.body;

  try {
    // Verificar el token de Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Buscar al usuario en la base de datos
    let user = await Usuario.findOne({ correo: email });

    // Crear un nuevo usuario si no existe
    if (!user) {
      const adminEmails = [
        'isabela.rosero@correounivalle.edu.co',
        'orrego.sebastian@correounivalle.edu.co',
        'manuel.cardoso@correounivalle.edu.co',
        'stefhania.noguera@correounivalle.edu.co',
        'maria.paula.giraldo@correounivalle.edu.co',
        'jose.becerra@correounivalle.edu.co',
        'SweetPetSchi@gmail.com',
      ];
      const rol = adminEmails.includes(email) ? 'admin' : 'cliente';

      user = new Usuario({
        correo: email,
        nombre: name,
        rol: rol,
        estado: 'activo',
      });
      await user.save();

      await sendWelcomeEmail(user.correo, user.nombre);

    }

    // Generar el token JWT
    const jwtToken = jwt.sign(
      { id: user._id, correo: user.correo, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    // Configurar la cookie con SameSite y Secure
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    // Devolver el token en la respuesta
    res.status(200).json({ token: jwtToken, user });
  } catch (error) {
    console.error('Error verificando token de Google:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = { googleLoginBackend };
