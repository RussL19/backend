
const sequelize = require("../config/database");

const Asignacion = require("../models/Asignacion");
const Activo = require("../models/Activo");
const Empleado = require("../models/Empleado");
const Usuario = require("../models/Usuario");
const HistorialMovimiento = require("../models/HistorialMovimiento");

const {
    enviarNotificacionAUsuario
} = require("./notificacionService");


// Buscar la cuenta de usuario correspondiente al empleado
// y enviarle una notificación.
const notificarEmpleado = async (empleado, titulo, cuerpo) => {
    try {
        if (!empleado?.correo) {
            console.warn("El empleado no tiene correo registrado.");
            return;
        }

        const usuario = await Usuario.findOne({
            where: {
                correo: empleado.correo.trim()
            }
        });

        if (!usuario) {
            console.warn(
                `No existe una cuenta de usuario para el correo ${empleado.correo}.`
            );
            return;
        }

        const resultado = await enviarNotificacionAUsuario(
            usuario.id_usuario,
            titulo,
            cuerpo
        );

        if (resultado.total === 0) {
            console.log(
                `El usuario ${usuario.id_usuario} no tiene dispositivos registrados.`
            );
        }

    } catch (error) {
        // La notificación no debe afectar la operación principal.
        console.error(
            "No se pudo enviar la notificación de asignación:",
            error.message
        );
    }
};


// Crear asignación
const crearAsignacion = async (datos) => {
    const transaction = await sequelize.transaction();

    try {
        const activo = await Activo.findByPk(
            datos.id_activo,
            { transaction }
        );

        if (!activo) {
            throw new Error("Activo no encontrado.");
        }

        const empleado = await Empleado.findByPk(
            datos.id_empleado,
            { transaction }
        );

        if (!empleado) {
            throw new Error("Empleado no encontrado.");
        }

        const asignacion = await Asignacion.create(
            {
                id_activo: datos.id_activo,
                id_empleado: datos.id_empleado,
                fecha_asignacion: new Date(),
                estado: "Asignado"
            },
            { transaction }
        );

        await activo.update(
            {
                estado: "Asignado"
            },
            { transaction }
        );

        await HistorialMovimiento.create(
            {
                id_activo: activo.id_activo,
                tipo_movimiento: "Asignacion",
                detalle: `Asignado a ${empleado.nombre} ${empleado.apellido}`
            },
            { transaction }
        );

        await transaction.commit();

        // Notificar después de confirmar la asignación.
        await notificarEmpleado(
            empleado,
            "Nuevo activo asignado",
            `Se te ha asignado el activo ${activo.nombre} (${activo.codigo}).`
        );

        return asignacion;

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        console.error(error.message);
        throw error;
    }
};


// Obtener asignaciones activas
const obtenerAsignaciones = async () => {
    return await Asignacion.findAll({
        where: {
            estado: "Asignado"
        },

        include: [
            {
                model: Activo,
                attributes: [
                    "codigo",
                    "nombre",
                    "estado"
                ]
            },
            {
                model: Empleado,
                attributes: [
                    "nombre",
                    "apellido",
                    "puesto"
                ]
            }
        ],

        order: [
            ["fecha_asignacion", "DESC"]
        ]
    });
};


// Obtener asignación por ID
const obtenerAsignacionPorId = async (id) => {
    const asignacion = await Asignacion.findByPk(id, {
        include: [
            { model: Activo },
            { model: Empleado }
        ]
    });

    if (!asignacion) {
        throw new Error("Asignación no encontrada.");
    }

    return asignacion;
};


// Devolver activo
const devolverActivo = async (id) => {
    const transaction = await sequelize.transaction();

    try {
        const asignacion = await Asignacion.findByPk(
            id,
            { transaction }
        );

        if (!asignacion) {
            throw new Error("Asignación no encontrada.");
        }

        const activo = await Activo.findByPk(
            asignacion.id_activo,
            { transaction }
        );

        if (!activo) {
            throw new Error("Activo no encontrado.");
        }

        const empleado = await Empleado.findByPk(
            asignacion.id_empleado,
            { transaction }
        );

        await activo.update(
            { estado: "Disponible" },
            { transaction }
        );

        await HistorialMovimiento.create(
            {
                id_activo: activo.id_activo,
                tipo_movimiento: "Devolucion",
                fecha: new Date(),
                detalle: "Activo devuelto."
            },
            { transaction }
        );

        await asignacion.update(
            {
                estado: "Devuelto",
                fecha_devolucion: new Date()
            },
            { transaction }
        );

        await transaction.commit();

        // Notificar después de confirmar la devolución.
        await notificarEmpleado(
            empleado,
            "Devolución de activo registrada",
            `Se registró la devolución del activo ${activo.nombre} (${activo.codigo}).`
        );

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        console.error(error);
        throw error;
    }
};


module.exports = {
    crearAsignacion,
    obtenerAsignaciones,
    obtenerAsignacionPorId,
    devolverActivo
};
