
const sequelize = require("../config/database");

const Mantenimiento = require("../models/Mantenimiento");
const Activo = require("../models/Activo");
const Proveedor = require("../models/Proveedor");
const Asignacion = require("../models/Asignacion");
const Empleado = require("../models/Empleado");
const Usuario = require("../models/Usuario");
const HistorialMovimiento = require("../models/HistorialMovimiento");

const {
    enviarNotificacionAUsuario
} = require("./notificacionService");


// Notificar al empleado que tiene asignado el activo.
const notificarEmpleadoAsignado = async (
    idActivo,
    titulo,
    cuerpo
) => {
    try {
        const asignacion = await Asignacion.findOne({
            where: {
                id_activo: idActivo,
                estado: "Asignado"
            },
            order: [
                ["fecha_asignacion", "DESC"]
            ]
        });

        if (!asignacion) {
            console.log(
                `El activo ${idActivo} no tiene una asignación activa.`
            );
            return;
        }

        const empleado = await Empleado.findByPk(
            asignacion.id_empleado
        );

        if (!empleado?.correo) {
            console.warn("No se encontró el correo del empleado.");
            return;
        }

        const usuario = await Usuario.findOne({
            where: {
                correo: empleado.correo.trim()
            }
        });

        if (!usuario) {
            console.warn(
                `No existe una cuenta para ${empleado.correo}.`
            );
            return;
        }

        await enviarNotificacionAUsuario(
            usuario.id_usuario,
            titulo,
            cuerpo
        );

    } catch (error) {
        console.error(
            "No se pudo enviar la notificación de mantenimiento:",
            error.message
        );
    }
};


// Crear mantenimiento
const crearMantenimiento = async (datos) => {
    const transaction = await sequelize.transaction();

    try {
        const activo = await Activo.findByPk(
            datos.id_activo,
            { transaction }
        );

        if (!activo) {
            throw new Error("Activo no encontrado.");
        }

        const proveedor = await Proveedor.findByPk(
            datos.id_proveedor,
            { transaction }
        );

        if (!proveedor) {
            throw new Error("Proveedor no encontrado.");
        }

        const mantenimiento = await Mantenimiento.create(
            datos,
            { transaction }
        );

        await activo.update(
            {
                estado: "Mantenimiento"
            },
            { transaction }
        );

        await HistorialMovimiento.create(
            {
                id_activo: activo.id_activo,
                tipo_movimiento: "Mantenimiento",
                detalle: `Ingreso a mantenimiento (${datos.tipo})`
            },
            { transaction }
        );

        await transaction.commit();

        // Avisar al empleado que tiene asignado el activo.
        await notificarEmpleadoAsignado(
            activo.id_activo,
            "Activo ingresado a mantenimiento",
            `El activo ${activo.nombre} (${activo.codigo}) ingresó a mantenimiento.`
        );

        return mantenimiento;

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        throw error;
    }
};


// Obtener mantenimientos
const obtenerMantenimientos = async () => {
    return await Mantenimiento.findAll({
        include: [
            {
                model: Activo,
                attributes: [
                    "codigo",
                    "nombre"
                ]
            },
            {
                model: Proveedor,
                attributes: [
                    "nombre"
                ]
            }
        ],

        order: [
            ["fecha_inicio", "DESC"]
        ]
    });
};


// Obtener mantenimiento por ID
const obtenerMantenimientoPorId = async (id) => {
    const mantenimiento = await Mantenimiento.findByPk(id, {
        include: [
            { model: Activo },
            { model: Proveedor }
        ]
    });

    if (!mantenimiento) {
        throw new Error("Mantenimiento no encontrado.");
    }

    return mantenimiento;
};


// Finalizar mantenimiento

const finalizarMantenimiento = async (id, estadoActivo) => {
    if (!["Disponible", "Baja"].includes(estadoActivo)) {
        throw new Error("Resultado del mantenimiento no válido.");
    }

    const transaction = await sequelize.transaction();

    let activo;

    try {
        const mantenimiento = await Mantenimiento.findByPk(id, {
            transaction
        });

        if (!mantenimiento) {
            throw new Error("Mantenimiento no encontrado.");
        }

        if (mantenimiento.fecha_fin) {
            throw new Error("Este mantenimiento ya fue finalizado.");
        }

        activo = await Activo.findByPk(
            mantenimiento.id_activo,
            { transaction }
        );

        if (!activo) {
            throw new Error("Activo no encontrado.");
        }

        const fechaFinalizacion = new Date()
            .toISOString()
            .slice(0, 10);

        await mantenimiento.update(
            { fecha_fin: fechaFinalizacion },
            { transaction }
        );

        await activo.update(
            { estado: estadoActivo },
            { transaction }
        );

        await HistorialMovimiento.create(
            {
                id_activo: activo.id_activo,
                tipo_movimiento:
                    estadoActivo === "Baja"
                        ? "Baja"
                        : "Mantenimiento",
                detalle:
                    estadoActivo === "Baja"
                        ? "Mantenimiento finalizado: activo dado de baja."
                        : "Mantenimiento finalizado: activo disponible."
            },
            { transaction }
        );

        await transaction.commit();

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        throw error;
    }

    // Notificación después de confirmar los cambios en MySQL
    try {
        const mensaje =
            estadoActivo === "Baja"
                ? `El activo ${activo.nombre} (${activo.codigo}) fue dado de baja después del mantenimiento.`
                : `El mantenimiento del activo ${activo.nombre} (${activo.codigo}) ha finalizado y ahora está disponible.`;

        await notificarEmpleadoAsignado(
            activo.id_activo,
            "Mantenimiento finalizado",
            mensaje
        );

    } catch (error) {
        console.error(
            "El mantenimiento finalizó, pero falló la notificación:",
            error.message
        );
    }

    return {
        mensaje: "Mantenimiento finalizado correctamente.",
        estadoActivo
    };
};



module.exports = {
    crearMantenimiento,
    obtenerMantenimientos,
    obtenerMantenimientoPorId,
    finalizarMantenimiento
};
