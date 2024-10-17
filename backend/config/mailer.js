const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "SweetPetSchi@gmail.com",
        pass: "tptd qnvk rbqc xyiz"
    }
});

// Verificar si el transporter está bien configurado
transporter.verify().then(() => {
    console.log("¡Transporter listo!");
}).catch(err => {
    console.error("Error con el transporter:", err);
});

module.exports = transporter;
