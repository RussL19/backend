const asignacionService = require("../services/asignacionService");

const obtenerAsignaciones = async (req, res) => {

    try {

        const datos = await asignacionService.obtenerAsignaciones();

        res.json(datos);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};

const obtenerAsignacionPorId = async (req, res) => {

    try {

        const dato = await asignacionService.obtenerAsignacionPorId(req.params.id);

        res.json(dato);

    } catch (error) {

        res.status(404).json({
            mensaje: error.message
        });

    }

};

const crearAsignacion = async (req, res) => {

    try {

        const dato = await asignacionService.crearAsignacion(req.body);

        res.status(201).json(dato);

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });

    }

};

const devolverActivo = async (req, res) => {

    try {

        await asignacionService.devolverActivo(req.params.id);

        res.json({
            mensaje: "Activo devuelto correctamente."
        });

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });

    }

};

module.exports = {

    obtenerAsignaciones,

    obtenerAsignacionPorId,

    crearAsignacion,

    devolverActivo

};