const express = require("express");

const verificarToken = require("../middlewares/authMiddleware");

const router = express.Router();

const {

    obtenerAsignaciones,

    obtenerAsignacionPorId,

    crearAsignacion,

    devolverActivo

} = require("../controllers/asignacionController");

router.get("/", verificarToken, obtenerAsignaciones);

router.get("/:id", verificarToken, obtenerAsignacionPorId);

router.post("/", verificarToken, crearAsignacion);

router.put("/devolver/:id", verificarToken, devolverActivo);

module.exports = router;