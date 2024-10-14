const express = require('express');
const cors = require('cors');
const connectDB = require('./database'); // Tu archivo de conexión a la base de datos
require('dotenv').config();

const app = express();

// Configurar CORS
const corsOptions = {
  origin: 'http://localhost:3001', // frontend URL
  credentials: true, // Enable Access-Control-Allow-Credentials
};

app.use(cors(corsOptions)); // Apply CORS with options

// Conectar a la base de datos
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const usuarioRoutes = require('../routes/usuarioRoutes');

// Usar rutas
app.use('/api/usuarios', usuarioRoutes);

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
