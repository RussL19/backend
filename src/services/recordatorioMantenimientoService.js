
const { Op } = require("sequelize");

const Mantenimiento = require("../models/Mantenimiento");
const Activo = require("../models/Activo");
const Asignacion = require("../models/Asignacion");
const Empleado = require("../models/Empleado");
const Usuario = require("../models/Usuario");

const {
    enviarNotificacionAUsuario
} = require("./notificacionService");

const ZONA_HORARIA = "America/Costa_Rica";
const DIAS_ANTICIPACION = 3;


// Obtener la fecha de Costa Rica y sumar días sin depender
// de la zona horaria configurada en Windows o en el servidor.
const obtenerFechaCostaRica = (diasAdicionales = 0) => {

    const partes = new Intl.DateTimeFormat("en-CA", {
        timeZone: ZONA_HORARIA,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());

    const valores = {};

    for (const parte of partes) {
        valores[parte.type] = parte.value;
    }

    const fecha = new Date(Date.UTC(
        Number(valores.year),
        Number(valores.month) - 1,
        Number(valores.day)
    ));

    fecha.setUTCDate(
        fecha.getUTCDate() + diasAdicionales
    );

    return fecha.toISOString().slice(0, 10);
};


// Calcular cuántos días faltan para la fecha programada.
const calcularDiasRestantes = (fechaProgramada) => {

    const hoy = obtenerFechaCostaRica(0);

    const fechaHoy = new Date(`${hoy}T00:00:00Z`);
    const fechaMantenimiento = new Date(
        `${fechaProgramada}T00:00:00Z`
    );

    return Math.round(
        (fechaMantenimiento - fechaHoy) / 86400000
    );
};


// Obtener el empleado que tiene asignado el activo.
const obtenerEmpleadoAsignado = async (idActivo) => {

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
        return null;
    }

    return await Empleado.findByPk(
        asignacion.id_empleado
    );
};


// Revisar y enviar recordatorios de mantenimiento.
const ejecutarRecordatoriosMantenimiento = async () => {

    const hoy = obtenerFechaCostaRica(0);

    const limite = obtenerFechaCostaRica(
        DIAS_ANTICIPACION
    );

    console.log(
        `Revisando mantenimientos entre ${hoy} y ${limite}`
    );

    const mantenimientos = await Mantenimiento.findAll({
        where: {
            fecha_inicio: {
                [Op.between]: [hoy, limite]
            },

            recordatorio_enviado: false
        }
    });

    let enviados = 0;
    let pendientes = 0;

    for (const mantenimiento of mantenimientos) {

        try {

            const activo = await Activo.findByPk(
                mantenimiento.id_activo
            );

            if (!activo) {
                console.warn(
                    `No se encontró el activo ${mantenimiento.id_activo}`
                );
                pendientes++;
                continue;
            }

            const empleado = await obtenerEmpleadoAsignado(
                activo.id_activo
            );

            if (!empleado || !empleado.correo) {
                console.warn(
                    `No hay empleado asignado al activo ${activo.id_activo}`
                );
                pendientes++;
                continue;
            }

            const usuario = await Usuario.findOne({
                where: {
                    correo: empleado.correo.trim()
                }
            });

            if (!usuario) {
                console.warn(
                    `No existe una cuenta para ${empleado.correo}`
                );
                pendientes++;
                continue;
            }

            const resultado = await enviarNotificacionAUsuario(
                usuario.id_usuario,
                "Recordatorio de mantenimiento",
                activo.nombre +
                ": el mantenimiento está programado para " +
                (
                    calcularDiasRestantes(mantenimiento.fecha_inicio) === 0
                        ? "hoy."
                        : `dentro de ${calcularDiasRestantes(mantenimiento.fecha_inicio)} días.`
                )
            );

            // Solo marcar como enviado si Firebase confirmó
            // al menos un envío exitoso.
            if (resultado.enviados > 0) {

                await mantenimiento.update({
                    recordatorio_enviado: true,
                    fecha_recordatorio_enviado: new Date()
                });

                enviados++;

                console.log(
                    `Recordatorio enviado para mantenimiento ${mantenimiento.id_mantenimiento}`
                );

            } else {

                pendientes++;

                console.warn(
                    `No se pudo enviar el recordatorio ${mantenimiento.id_mantenimiento}: no hay dispositivos activos o el envío falló.`
                );
            }

        } catch (error) {

            pendientes++;

            console.error(
                `Error en mantenimiento ${mantenimiento.id_mantenimiento}:`,
                error.message
            );
        }
    }

    return {
        fecha_revision: hoy,
        mantenimientos_encontrados: mantenimientos.length,
        recordatorios_enviados: enviados,
        pendientes
    };
};


module.exports = {
    ejecutarRecordatoriosMantenimiento
};
