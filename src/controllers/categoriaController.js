const categoriaService = require("../services/categoriaService");

const obtenerCategorias = async (req, res) => {

    try {

        const categorias = await categoriaService.obtenerCategorias();

        res.json(categorias);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};

const obtenerCategoriaPorId = async (req, res) => {

    try {

        const categoria = await categoriaService.obtenerCategoriaPorId(req.params.id);

        res.json(categoria);

    } catch (error) {

        res.status(404).json({
            mensaje: error.message
        });

    }

};

const crearCategoria = async (req, res) => {

    try {

        const categoria = await categoriaService.crearCategoria(req.body);

        res.status(201).json(categoria);

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });

    }

};

const actualizarCategoria = async (req, res) => {

    try {

        const categoria = await categoriaService.actualizarCategoria(
            req.params.id,
            req.body
        );

        res.json(categoria);

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });

    }

};

const eliminarCategoria = async (req, res) => {

    try {

        await categoriaService.eliminarCategoria(req.params.id);

        res.json({
            mensaje: "Categoría eliminada correctamente."
        });

    } catch (error) {

        res.status(404).json({
            mensaje: error.message
        });

    }

};

module.exports = {

    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria

};