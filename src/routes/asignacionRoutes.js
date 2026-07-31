const express = require("express");

const verificarToken = require("../middlewares/authMiddleware");

const router = express.Router();

const {

    obtenerAsignaciones,

    obtenerAsignacionPorId,

    crearAsignacion,

    devolverActivo

} = require("../controllers/asignacionController");

const {
    generarPDFAsignacion,
    generarPDFDevolucion
} = require("../controllers/AsignacionExportController");

router.get("/", verificarToken, obtenerAsignaciones);

router.get("/:id", verificarToken, obtenerAsignacionPorId);

router.post("/", verificarToken, crearAsignacion);

router.put("/:id/devolver", verificarToken, devolverActivo);

router.get("/:id/pdf",  generarPDFAsignacion);

router.get("/:id/devolucion/pdf",  generarPDFDevolucion);

module.exports = router;