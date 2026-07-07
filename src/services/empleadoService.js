const Empleado = require("../models/Empleado");
const Departamento = require("../models/Departamento");

const obtenerEmpleados = async () => {

    return await Empleado.findAll({

        include: {
            model: Departamento,
            attributes: ["id_departamento", "nombre"]
        },

        order: [["nombre", "ASC"]]

    });

};

const obtenerEmpleadoPorId = async (id) => {

    const empleado = await Empleado.findByPk(id, {

        include: {
            model: Departamento,
            attributes: ["nombre"]
        }

    });

    if (!empleado)
        throw new Error("Empleado no encontrado.");

    return empleado;

};

const crearEmpleado = async (datos) => {

    const existeCedula = await Empleado.findOne({
        where: {
            cedula: datos.cedula
        }
    });

    if (existeCedula)
        throw new Error("La cédula ya existe.");

    const existeCorreo = await Empleado.findOne({
        where: {
            correo: datos.correo
        }
    });

    if (existeCorreo)
        throw new Error("El correo ya existe.");

    return await Empleado.create(datos);

};

const actualizarEmpleado = async (id, datos) => {

    const empleado = await Empleado.findByPk(id);

    if (!empleado)
        throw new Error("Empleado no encontrado.");

    await empleado.update(datos);

    return empleado;

};

const eliminarEmpleado = async (id) => {

    const empleado = await Empleado.findByPk(id);

    if (!empleado)
        throw new Error("Empleado no encontrado.");

    await empleado.destroy();

};

module.exports = {

    obtenerEmpleados,
    obtenerEmpleadoPorId,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado

};