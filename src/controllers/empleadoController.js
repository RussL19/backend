const empleadoService = require("../services/empleadoService");

const obtenerEmpleados = async (req, res) => {

    try {

        const empleados = await empleadoService.obtenerEmpleados();

        res.json(empleados);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};

const obtenerEmpleadoPorId = async (req, res) => {

    try {

        const empleado = await empleadoService.obtenerEmpleadoPorId(req.params.id);

        res.json(empleado);

    } catch (error) {

        res.status(404).json({
            mensaje: error.message
        });

    }

};

const crearEmpleado = async (req, res) => {

    try {

        const empleado = await empleadoService.crearEmpleado(req.body);

        res.status(201).json(empleado);

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });

    }

};

const actualizarEmpleado = async (req, res) => {

    try {

        const empleado = await empleadoService.actualizarEmpleado(req.params.id, req.body);

        res.json(empleado);

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });

    }

};

const eliminarEmpleado = async (req, res) => {

    try {

        await empleadoService.eliminarEmpleado(req.params.id);

        res.json({
            mensaje: "Empleado eliminado correctamente."
        });

    } catch (error) {

        res.status(404).json({
            mensaje: error.message
        });

    }

};

module.exports = {

    obtenerEmpleados,
    obtenerEmpleadoPorId,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado

};