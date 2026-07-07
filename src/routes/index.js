const express = require("express");

const router = express.Router();

const rolRoutes = require("./rolRoutes");
const usuarioRoutes = require("./usuarioRoutes");
const authRoutes = require("./authRoutes");
const categoriaRoutes = require("./categoriaRoutes");
const ubicacionRoutes = require("./ubicacionRoutes");
const departamentoRoutes=require("./departamentoRoutes");
const proveedorRoutes=require("./proveedorRoutes");
const empleadoRoutes = require("./empleadoRoutes");
const asignacionRoutes = require("./asignacionRoutes");
const mantenimientoRoutes = require("./mantenimientoRoutes");
const activoRoutes = require("./activoRoutes");
const historialRoutes = require("./historialRoutes");
const reporteRoutes = require("./reporteRoutes");

router.use("/reportes", reporteRoutes);
router.use("/activos", activoRoutes);
router.use("/historial",require("./historialRoutes"));
router.use("/mantenimientos", mantenimientoRoutes);
router.use("/asignaciones", asignacionRoutes);
router.use("/empleados", empleadoRoutes);
router.use("/proveedores",proveedorRoutes);
router.use("/departamentos",departamentoRoutes);
router.use("/ubicaciones", ubicacionRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/roles", rolRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/", authRoutes);

module.exports = router;