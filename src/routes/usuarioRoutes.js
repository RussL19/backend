const express = require("express");

const verificarToken = require("../middlewares/authMiddleware");

const router = express.Router();

const {
    obtenerUsuarios,
    crearUsuario,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
} = require("../controllers/usuarioController");

router.get("/", verificarToken, obtenerUsuarios);

router.get("/:id", verificarToken, obtenerUsuarioPorId);

router.post("/", verificarToken, crearUsuario);

router.put("/:id", verificarToken, actualizarUsuario);

router.delete("/:id", verificarToken, eliminarUsuario);

module.exports = router;