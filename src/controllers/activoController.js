const activoService = require("../services/activoService");

const obtenerActivos = async (req, res) => {

    try {

        const activos = await activoService.obtenerActivos();

        res.json(activos);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};

const obtenerActivoPorId = async (req, res) => {

    try {

        const activo = await activoService.obtenerActivoPorId(req.params.id);

        res.json(activo);

    } catch (error) {

        res.status(404).json({
            mensaje: error.message
        });

    }

};

const crearActivo = async (req, res) => {

    try {

        const activo = await activoService.crearActivo(req.body);

        res.status(201).json(activo);

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });

    }

};

const actualizarActivo = async (req, res) => {

    try {

        const activo = await activoService.actualizarActivo(
            req.params.id,
            req.body
        );

        res.json(activo);

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });

    }

};

const eliminarActivo = async (req, res) => {

    try {

        await activoService.eliminarActivo(req.params.id);

        res.json({
            mensaje: "Activo eliminado correctamente."
        });

    } catch (error) {

        res.status(404).json({
            mensaje: error.message
        });

    }

};

module.exports = {
    obtenerActivos,
    obtenerActivoPorId,
    crearActivo,
    actualizarActivo,
    eliminarActivo
};