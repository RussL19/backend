const express = require("express");
const router = express.Router();

const verificarToken = require("../middlewares/authMiddleware");

const {
    registrarToken,
    enviarPrueba
} = require("../controllers/notificacionController");

// Registrar dispositivo del usuario
router.post(
    "/registrar-token",
    verificarToken,
    registrarToken
);

// Enviar notificación de prueba
router.post(
    "/prueba",
    verificarToken,
    enviarPrueba
);

module.exports = router;