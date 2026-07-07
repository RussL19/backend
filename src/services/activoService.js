const Activo = require("../models/Activo");

// ==========================
// Obtener todos los activos
// ==========================
const obtenerActivos = async () => {

    const activos = await Activo.findAll({
        order: [["id_activo", "ASC"]]
    });

    return activos;

};

// ==========================
// Obtener activo por ID
// ==========================
const obtenerActivoPorId = async (id) => {

    const activo = await Activo.findByPk(id);

    if (!activo) {
        throw new Error("Activo no encontrado.");
    }

    return activo;

};

// ==========================
// Crear activo
// ==========================
const crearActivo = async (datosActivo) => {

    // Verificar código duplicado
    const codigoExistente = await Activo.findOne({
        where: {
            codigo: datosActivo.codigo
        }
    });

    if (codigoExistente) {
        throw new Error("El código del activo ya existe.");
    }

    const activo = await Activo.create({

        codigo: datosActivo.codigo,
        nombre: datosActivo.nombre,
        descripcion: datosActivo.descripcion,
        marca: datosActivo.marca,
        modelo: datosActivo.modelo,
        serie: datosActivo.serie,
        fecha_adquisicion: datosActivo.fecha_adquisicion,
        valor_adquisicion: datosActivo.valor_adquisicion,
        garantia_meses: datosActivo.garantia_meses,
        estado: datosActivo.estado,
        id_categoria: datosActivo.id_categoria,
        id_ubicacion: datosActivo.id_ubicacion

    });

    return activo;

};

// ==========================
// Actualizar activo
// ==========================
const actualizarActivo = async (id, datosActivo) => {

    const activo = await Activo.findByPk(id);

    if (!activo) {
        throw new Error("Activo no encontrado.");
    }

    // Verificar código duplicado
    const codigoExistente = await Activo.findOne({
        where: {
            codigo: datosActivo.codigo
        }
    });

    if (
        codigoExistente &&
        codigoExistente.id_activo != id
    ) {
        throw new Error("El código del activo ya existe.");
    }

    await activo.update({

        codigo: datosActivo.codigo,
        nombre: datosActivo.nombre,
        descripcion: datosActivo.descripcion,
        marca: datosActivo.marca,
        modelo: datosActivo.modelo,
        serie: datosActivo.serie,
        fecha_adquisicion: datosActivo.fecha_adquisicion,
        valor_adquisicion: datosActivo.valor_adquisicion,
        garantia_meses: datosActivo.garantia_meses,
        estado: datosActivo.estado,
        id_categoria: datosActivo.id_categoria,
        id_ubicacion: datosActivo.id_ubicacion

    });

    return activo;

};

// ==========================
// Eliminar activo
// ==========================
const eliminarActivo = async (id) => {

    const activo = await Activo.findByPk(id);

    if (!activo) {
        throw new Error("Activo no encontrado.");
    }

    await activo.destroy();

    return activo;

};

module.exports = {

    obtenerActivos,
    obtenerActivoPorId,
    crearActivo,
    actualizarActivo,
    eliminarActivo

};