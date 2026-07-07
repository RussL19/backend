const express = require("express");

const verificarToken = require("../middlewares/authMiddleware");

const router = express.Router();

const {

    obtenerEmpleados,
    obtenerEmpleadoPorId,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado

} = require("../controllers/empleadoController");

router.get("/", verificarToken, obtenerEmpleados);

router.get("/:id", verificarToken, obtenerEmpleadoPorId);

router.post("/", verificarToken, crearEmpleado);

router.put("/:id", verificarToken, actualizarEmpleado);

router.delete("/:id", verificarToken, eliminarEmpleado);

module.exports = router;