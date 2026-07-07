const Ubicacion = require("../models/Ubicacion");

// Obtener todas
const obtenerUbicaciones = async () => {

    return await Ubicacion.findAll({
        order: [["nombre", "ASC"]]
    });

};

// Obtener por ID
const obtenerUbicacionPorId = async (id) => {

    const ubicacion = await Ubicacion.findByPk(id);

    if (!ubicacion)
        throw new Error("Ubicación no encontrada.");

    return ubicacion;

};

// Crear
const crearUbicacion = async (datos) => {

    const existe = await Ubicacion.findOne({
        where: {
            nombre: datos.nombre
        }
    });

    if (existe)
        throw new Error("La ubicación ya existe.");

    return await Ubicacion.create(datos);

};

// Actualizar
const actualizarUbicacion = async (id, datos) => {

    const ubicacion = await Ubicacion.findByPk(id);

    if (!ubicacion)
        throw new Error("Ubicación no encontrada.");

    const existe = await Ubicacion.findOne({
        where: {
            nombre: datos.nombre
        }
    });

    if (existe && existe.id_ubicacion != id)
        throw new Error("La ubicación ya existe.");

    await ubicacion.update(datos);

    return ubicacion;

};

// Eliminar
const eliminarUbicacion = async (id) => {

    const ubicacion = await Ubicacion.findByPk(id);

    if (!ubicacion)
        throw new Error("Ubicación no encontrada.");

    await ubicacion.destroy();

};

module.exports = {

    obtenerUbicaciones,
    obtenerUbicacionPorId,
    crearUbicacion,
    actualizarUbicacion,
    eliminarUbicacion

};