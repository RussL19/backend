const ubicacionService = require("../services/ubicacionService");

const obtenerUbicaciones = async (req, res) => {

    try {

        const ubicaciones = await ubicacionService.obtenerUbicaciones();

        res.json(ubicaciones);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};

const obtenerUbicacionPorId = async (req, res) => {

    try {

        const ubicacion = await ubicacionService.obtenerUbicacionPorId(req.params.id);

        res.json(ubicacion);

    } catch (error) {

        res.status(404).json({
            mensaje: error.message
        });

    }

};

const crearUbicacion = async (req, res) => {

    try {

        const ubicacion = await ubicacionService.crearUbicacion(req.body);

        res.status(201).json(ubicacion);

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });

    }

};

const actualizarUbicacion = async (req, res) => {

    try {

        const ubicacion = await ubicacionService.actualizarUbicacion(req.params.id, req.body);

        res.json(ubicacion);

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });

    }

};

const eliminarUbicacion = async (req, res) => {

    try {

        await ubicacionService.eliminarUbicacion(req.params.id);

        res.json({
            mensaje: "Ubicación eliminada correctamente."
        });

    } catch (error) {

        res.status(404).json({
            mensaje: error.message
        });

    }

};

module.exports = {

    obtenerUbicaciones,
    obtenerUbicacionPorId,
    crearUbicacion,
    actualizarUbicacion,
    eliminarUbicacion

};