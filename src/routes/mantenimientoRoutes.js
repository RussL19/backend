const express = require("express");

const verificarToken = require("../middlewares/authMiddleware");

const router = express.Router();

const {

    obtenerMantenimientos,

    obtenerMantenimientoPorId,

    crearMantenimiento,

    finalizarMantenimiento

} = require("../controllers/mantenimientoController");

router.get("/", verificarToken, obtenerMantenimientos);

router.get("/:id", verificarToken, obtenerMantenimientoPorId);

router.post("/", verificarToken, crearMantenimiento);

router.patch("/:id/finalizar", verificarToken, finalizarMantenimiento);

module.exports = router;