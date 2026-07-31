const express = require("express");

const verificarToken = require("../middlewares/authMiddleware");

const {

    exportarExcel,

    exportarPDF,

    generarReporte

} = require("../controllers/reporteExportController");

const router = express.Router();

router.get(

    "/excel",

    verificarToken,

    exportarExcel

);

router.get(
    "/pdf",
    verificarToken,
    exportarPDF
);


router.post(
    "/generar",
    verificarToken,
    generarReporte
);

module.exports = router;