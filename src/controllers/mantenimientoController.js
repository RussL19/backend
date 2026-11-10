const mantenimientoService = require("../services/mantenimientoService");

const obtenerMantenimientos = async (req, res) => {

    try {

        const datos = await mantenimientoService.obtenerMantenimientos();

        res.json(datos);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};

const obtenerMantenimientoPorId = async (req, res) => {

    try {

        const dato = await mantenimientoService.obtenerMantenimientoPorId(req.params.id);

        res.json(dato);

    } catch (error) {

        res.status(404).json({
            mensaje: error.message
        });

    }

};

const crearMantenimiento = async (req, res) => {

    try {

        const dato = await mantenimientoService.crearMantenimiento(req.body);

        res.status(201).json(dato);

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });

    }

};

const finalizarMantenimiento = async (req, res) => {
    try {
        const resultado =
            await mantenimientoService.finalizarMantenimiento(
                req.params.id,
                req.body.estadoActivo
            );

        return res.json(resultado);

    } catch (error) {
        console.error("Error al finalizar mantenimiento:", error);

        return res.status(400).json({
            mensaje: error.message
        });
    }
};

module.exports = {

    obtenerMantenimientos,
    obtenerMantenimientoPorId,
    crearMantenimiento,
    finalizarMantenimiento

};