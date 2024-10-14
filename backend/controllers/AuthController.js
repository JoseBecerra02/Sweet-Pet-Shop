const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLoginBackend = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Verificación con el Client ID en el backend
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Buscar o crear el usuario
    let user = await Usuario.findOne({ correo: email });
    
    if (!user) {
      // Si es un nuevo usuario, asignar el rol de admin si el correo es de Isabela
      const rol = email === 'isabela.rosero@correounivalle.edu.co' ? 'admin' : 'cliente';
      
      user = new Usuario({
        correo: email,
        nombre: name,
        rol: rol, // Rol asignado aquí
        estado: 'activo',
      });
      await user.save();
    }

    // Verificar si el rol está correctamente asignado
    console.log(`Rol del usuario: ${user.rol}`);

    // Generar el token JWT
    const jwtToken = jwt.sign(
      { id: user._id, correo: user.correo, rol: user.rol }, // Asegurarse de que el rol esté incluido en el token
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Verificar los detalles del token generado
    console.log(`Token generado: ${jwtToken}`);

    res.status(200).json({ token: jwtToken, user });

  } catch (error) {
    console.error('Error verificando token de Google:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = { googleLoginBackend };