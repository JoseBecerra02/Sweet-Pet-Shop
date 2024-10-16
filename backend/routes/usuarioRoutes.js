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

router.get('/estructura-db', async (req, res) => {
  console.log('Obteniendo estructura de la base de datos');
  try {
    const estructura = {
      Usuario: Usuario.schema.obj
    };
    res.json(estructura);
  } catch (error) {
    console.error('Error al obtener la estructura de la base de datos:', error);
    res.status(500).json({ message: 'Error al obtener la estructura de la base de datos' });
  }
});

// Ruta para obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find({});
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});
// Ruta para crear un nuevo usuario
router.post('/crear-usuario', async (req, res) => {
  try {
    const { correo, nombre, rol, telefono, direccion, ciudad } = req.body;

    // Validar campos requeridos
    if (!correo || !nombre) {
      return res.status(400).json({ message: 'Correo y nombre son campos requeridos.' });
    }

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      correo,
      nombre,
      rol,
      telefono,
      direccion,
      ciudad
    });

    // Guardar usuario en la base de datos
    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario creado con éxito', user: nuevoUsuario });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
});
// Ruta para eliminar un usuario por correo electrónico
router.delete('/eliminar', async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ message: 'Debe proporcionar un correo electrónico.' });
    }

    const user = await Usuario.findOneAndDelete({ correo });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
});
// Ruta para cambiar el estado de un usuario por correo electrónico
router.put('/cambiar-estado', async (req, res) => {
  try {
    const { correo, estado } = req.body;

    if (!correo || !estado) {
      return res.status(400).json({ message: 'Debe proporcionar un correo electrónico y un estado.' });
    }

    const user = await Usuario.findOneAndUpdate(
      { correo },
      { estado },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Estado del usuario cambiado con éxito', user });
  } catch (error) {
    console.error('Error al cambiar el estado del usuario:', error);
    res.status(500).json({ message: 'Error al cambiar el estado del usuario' });
  }
});
// Ruta para cambiar el rol de un usuario por correo electrónico
router.put('/cambiar-rol', async (req, res) => {
  try {
    const { correo, rol } = req.body;

    if (!correo || !rol) {
      return res.status(400).json({ message: 'Debe proporcionar un correo electrónico y un rol.' });
    }

    const user = await Usuario.findOneAndUpdate(
      { correo },
      { rol },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Rol del usuario cambiado con éxito', user });
  } catch (error) {
    console.error('Error al cambiar el rol del usuario:', error);
    res.status(500).json({ message: 'Error al cambiar el rol del usuario' });
  }
});
module.exports = router;
