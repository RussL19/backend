const Activo = require("../models/Activo");
const Asignacion = require("../models/Asignacion");
const Empleado = require("../models/Empleado");
const Usuario = require("../models/Usuario");

const {
    enviarNotificacionAUsuario
} = require("./notificacionService");
// ==========================
// Obtener todos los activos
// ==========================
const obtenerActivos = async () => {

    const activos = await Activo.findAll({
        order: [["id_activo", "ASC"]]
    });

    return activos;

};

// ==========================================
// Notificar cambios de estado de los activos
// ==========================================
const notificarCambioEstado = async (
    activo,
    estadoAnterior,
    estadoNuevo
) => {

    try {

        const destinatarios = new Set();

        // Obtener administradores activos
        const administradores = await Usuario.findAll({
            where: {
                id_rol: 1,
                estado: true
            },
            attributes: ["id_usuario"]
        });

        administradores.forEach(usuario => {
            destinatarios.add(usuario.id_usuario);
        });

        // Buscar la asignación activa del activo
        const asignacion = await Asignacion.findOne({
            where: {
                id_activo: activo.id_activo,
                estado: "Asignado"
            },
            order: [
                ["fecha_asignacion", "DESC"]
            ]
        });

        // Identificar al empleado responsable
        if (asignacion) {

            const empleado = await Empleado.findByPk(
                asignacion.id_empleado
            );

            if (empleado?.correo) {

                const usuario = await Usuario.findOne({
                    where: {
                        correo: empleado.correo.trim()
                    }
                });

                if (usuario && usuario.estado) {
                    destinatarios.add(usuario.id_usuario);
                }
            }
        }

        // Preparar el mensaje
        const titulo = "Cambio de estado de activo";

        const cuerpo =
            `El activo ${activo.nombre} (${activo.codigo}) ` +
            `cambió de estado: ${estadoAnterior} a ${estadoNuevo}.`;

        // Enviar a todos los destinatarios
        const resultados = await Promise.allSettled(
            Array.from(destinatarios).map(idUsuario =>
                enviarNotificacionAUsuario(
                    idUsuario,
                    titulo,
                    cuerpo
                )
            )
        );

        console.log(
            `Notificaciones de cambio de estado procesadas para el activo ${activo.codigo}:`,
            resultados.length
        );

    } catch (error) {

        // Un problema de Firebase no debe cancelar la actualización
        console.error(
            "Error enviando notificación de cambio de estado:",
            error.message
        );
    }
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

    // Guardar el estado anterior
    const estadoAnterior = activo.estado;

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

    // Actualizar información del activo
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

    // Verificar si realmente cambió el estado
    const estadoNuevo = activo.estado;

    if (
        estadoNuevo &&
        estadoAnterior !== estadoNuevo
    ) {

        await notificarCambioEstado(
            activo,
            estadoAnterior,
            estadoNuevo
        );

    }

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