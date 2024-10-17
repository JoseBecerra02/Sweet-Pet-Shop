const mongoose = require('mongoose');

// Middleware genérico para asignar un ID secuencial
const generarIdSecuencial = (nombreModelo, campoId) => {
    return async function (next) {
        if (this.isNew) {
            const count = await mongoose.model(nombreModelo).countDocuments();
            this[campoId] = count + 1; // Asigna un ID secuencial
        }
        next();
    };
};

module.exports = generarIdSecuencial;
