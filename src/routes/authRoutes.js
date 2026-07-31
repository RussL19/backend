const express = require("express");

const router = express.Router();

const {
    login,
    register,
    recuperarPassword,
    resetPassword
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);

// Recuperar contraseña
router.post("/recuperar-password", recuperarPassword);

// Restablecer contraseña
router.post("/reset-password", resetPassword);


module.exports = router;