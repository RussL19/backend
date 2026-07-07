const express = require("express");
const router = express.Router();

const verificarToken = require("../middlewares/authMiddleware");

const {
    obtenerActivos,
    obtenerActivoPorId,
    crearActivo,
    actualizarActivo,
    eliminarActivo

} = require("../controllers/activoController");

router.get("/", verificarToken, obtenerActivos);

router.get("/:id", verificarToken, obtenerActivoPorId);

router.post("/", verificarToken, crearActivo);

router.put("/:id", verificarToken, actualizarActivo);

router.delete("/:id", verificarToken, eliminarActivo);


module.exports = router;