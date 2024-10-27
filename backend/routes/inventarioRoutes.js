// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const { googleLoginBackend } = require('../controllers/AuthController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const Inventario = require('../models/Inventario'); 
const Categoria = require('../models/Categoria'); 

router.get('/categorias', async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    res.status(500).json({ message: 'Error al obtener las categorías' });
  }
});
router.get('/estructura', async (req, res) => {
  console.log('Obteniendo estructura de la base de datos');
  try {
    const estructura = {
      Inventario: Inventario.schema.obj
    };
    res.json(estructura);
  } catch (error) {
    console.error('Error al obtener la estructura de la base de datos:', error);
    res.status(500).json({ message: 'Error al obtener la estructura de la base de datos' });
  }
});
router.get('/productos', async (req, res) => {
  try {
    const productos = await Inventario.find();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
});

router.get('/producto/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Inventario.findById(id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
});
router.delete('/producto/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Eliminando producto:', id);
  try {
    const productoEliminado = await Inventario.findByIdAndDelete(id);
    if (!productoEliminado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
});
router.post('/crear-producto', async (req, res) => {
  const {nombre_producto, categoria, cantidad, precio, ruta, descripcion } = req.body;

  if ( !nombre_producto || !categoria || !cantidad || !precio || !ruta) {
    return res.status(400).json({ message: 'Todos los campos requeridos deben ser proporcionados' });
  }

  try {
    const nuevoProducto = new Inventario({
      nombre_producto,
      categoria,
      cantidad,
      precio,
      ruta,
      descripcion
    });

    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: 'Error al crear el producto' });
  }
});
router.put('/producto/:id', async (req, res) => {
  // console.log('Actualizando producto');
  const { id } = req.params;
  const { nombre_producto, categoria, cantidad, precio, ruta, descripcion } = req.body;

  if (!nombre_producto || !categoria || !cantidad || !precio || !ruta) {
    return res.status(400).json({ message: 'Todos los campos requeridos deben ser proporcionados' });
  }

  try {
    const productoActualizado = await Inventario.findByIdAndUpdate(id, {
      nombre_producto,
      categoria,
      cantidad,
      precio,
      ruta,
      descripcion
    }, { new: true });

    if (!productoActualizado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
});
router.get('/hola', (req, res) => {
  res.send('Hola Mundo');
});
module.exports = router;
// const express = require('express');
// const Inventario = require('../models/Inventario'); // Modelo de Inventario

// const router = express.Router();

// Ruta para obtener todos los productos del inventario con las categorías populadas
router.get('/', async (req, res) => {
  try {
    const productos = await Inventario.find().populate('categoria', 'nombre');
    res.json(productos);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
  try {
    const nuevoProducto = new Inventario(req.body);
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (err) {
    console.error('Error al agregar producto:', err);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

// module.exports = router;
