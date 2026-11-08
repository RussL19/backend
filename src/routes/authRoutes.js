const express = require("express");

const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");

const {
    login,
    register,
    recuperarPassword,
    resetPassword,
    configurar2FA,
    confirmar2FA,
    verificarCodigoLogin
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);

// Recuperar contraseña
router.post("/recuperar-password", recuperarPassword);

// Restablecer contraseña
router.post("/reset-password", resetPassword);
router.post(
    "/2fa/configurar",
    verificarToken,
    configurar2FA
);

router.post(
    "/2fa/confirmar",
    verificarToken,
    confirmar2FA
);

router.post("/2fa/verificar-login", verificarCodigoLogin);

module.exports = router;