// config/server.js
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const connectDB = require('./database');
const inventarioRoutes = require('../routes/inventarioRoutes'); // Nueva ruta
const categoriaRoutes = require('../routes/categoriaRoutes'); // Asegúrate de tener esta línea
const usuarioRoutes = require('../routes/usuarioRoutes');
const carritoRoutes = require('../routes/carritoRoutes');
const bodyParser = require('body-parser');
const emailRoutes = require('../routes/mailerRoutes');

const app = express();

// Configurar CORS
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3001',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser()); 
app.use(helmet()); 

// Conectar a la base de datos
connectDB().catch((error) => {
  console.error('Error conectando a la base de datos:', error);
  process.exit(1); 
});

// Middleware para parsear JSON
app.use(express.json());
const facturaRoutes = require('../routes/facturaRoutes');
const ordenRoutes = require('../routes/ordenRoutes');

// Usar rutas
app.use('/api/usuarios', usuarioRoutes); // Asegúrate de que esta línea exista
app.use('/api/inventario', inventarioRoutes); 
app.use('/api/categoria', categoriaRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/factura', facturaRoutes); 
app.use('/api/orden', ordenRoutes); 

app.use(bodyParser.json());
app.use('/api', emailRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Error interno del servidor' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port} en entorno ${process.env.NODE_ENV || 'desarrollo'}`);
});
