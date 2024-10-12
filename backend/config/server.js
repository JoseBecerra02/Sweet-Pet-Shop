// server.js
const express = require('express');
const connectDB = require('./database'); // Importar la función de conexión a la base de datos
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsing JSON
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Ruta simple para probar
app.get('/', (req, res) => {
    res.send('Hola, mundo!');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
