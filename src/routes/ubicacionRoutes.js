const express = require("express");

const verificarToken = require("../middlewares/authMiddleware");

const router = express.Router();

const {

    obtenerUbicaciones,
    obtenerUbicacionPorId,
    crearUbicacion,
    actualizarUbicacion,
    eliminarUbicacion

} = require("../controllers/ubicacionController");

router.get("/", verificarToken, obtenerUbicaciones);

router.get("/:id", verificarToken, obtenerUbicacionPorId);

router.post("/", verificarToken, crearUbicacion);

router.put("/:id", verificarToken, actualizarUbicacion);

router.delete("/:id", verificarToken, eliminarUbicacion);

module.exports = router;