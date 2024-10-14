// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const { googleLoginBackend } = require('../controllers/AuthController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const Usuario = require('../models/Usuario'); 

// Ruta protegida para obtener el perfil del usuario
router.get('/perfil', authMiddleware, async (req, res) => {
  try {
    const user = await Usuario.findOne({ correo: req.user.correo });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
});

// Ruta para login con Google
router.post('/google-login', googleLoginBackend);

// Ruta protegida para actualizar el perfil del usuario
router.put('/perfil', authMiddleware, async (req, res) => {
  try {
    console.log('Usuario autenticado:', req.user); 
    console.log('Datos a actualizar:', req.body); 

    const { telefono, direccion, ciudad } = req.body;

    if (!telefono && !direccion && !ciudad) {
      return res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar.' });
    }

    // Actualizar perfil
    const user = await Usuario.findByIdAndUpdate(
      req.user.id,
      { telefono, direccion, ciudad },
      { new: true, runValidators: true } // Aplicar validadores durante la actualización
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Perfil actualizado con éxito', user });
  } catch (error) {
    console.error('Error actualizando el perfil:', error);
    res.status(500).json({ message: 'Error actualizando el perfil' });
  }
});


module.exports = router;
