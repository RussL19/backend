const express = require("express");

const verificarToken = require("../middlewares/authMiddleware");

const router = express.Router();

const {

    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria

} = require("../controllers/categoriaController");

router.get("/", verificarToken, obtenerCategorias);

router.get("/:id", verificarToken, obtenerCategoriaPorId);

router.post("/", verificarToken, crearCategoria);

router.put("/:id", verificarToken, actualizarCategoria);

router.delete("/:id", verificarToken, eliminarCategoria);

module.exports = router;