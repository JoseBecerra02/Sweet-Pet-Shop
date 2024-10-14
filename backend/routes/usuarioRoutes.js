const express = require('express');
const router = express.Router();
const { googleLoginBackend } = require('../controllers/AuthController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const Usuario = require('../models/Usuario'); // Asegúrate de que la ruta al modelo sea correcta


// Ruta pública para login con Google
router.post('/google-login', googleLoginBackend);

// Ruta protegida para obtener el perfil del usuario
router.get('/perfil', authMiddleware, async (req, res) => {
    try {
      console.log('ID del usuario extraído del token:', req.user.id);
      const user = await Usuario.findById(req.user.id);
      if (!user) {
        console.log('Usuario no encontrado');
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      console.log('Perfil completo del usuario:', user);
      res.json({ user });
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      res.status(500).json({ message: 'Error al obtener el perfil' });
    }
  });
  

// Ruta protegida para actualizar el perfil del usuario
router.put('/perfil', authMiddleware, async (req, res) => {
  try {
    const { telefono, direccion, ciudad } = req.body;
    const user = await Usuario.findByIdAndUpdate(
      req.user.id,
      { telefono, direccion, ciudad },
      { new: true }
    );
    res.json({ message: 'Perfil actualizado con éxito', user });
  } catch (error) {
    console.error('Error actualizando el perfil:', error);
    res.status(500).json({ message: 'Error actualizando el perfil' });
  }
});

module.exports = router;