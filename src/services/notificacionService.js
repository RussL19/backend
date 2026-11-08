const { getMessaging } = require("firebase-admin/messaging");

const firebaseApp = require("../config/firebaseAdmin");
const Dispositivo = require("../models/Dispositivo");

// Registrar o actualizar el token FCM
const registrarToken = async (idUsuario, token, plataforma = "web") => {

    const existente = await Dispositivo.findOne({
        where: {
            token_fcm: token
        }
    });

    if (existente) {

        await existente.update({
            id_usuario: idUsuario,
            plataforma,
            fecha_registro: new Date(),
            activo: true
        });

        return existente;
    }

    return await Dispositivo.create({
        id_usuario: idUsuario,
        token_fcm: token,
        plataforma,
        activo: true
    });
};


// Enviar notificación a todos los dispositivos activos de un usuario
const enviarNotificacionAUsuario = async (
    idUsuario,
    titulo,
    cuerpo
) => {

    const dispositivos = await Dispositivo.findAll({
        where: {
            id_usuario: idUsuario,
            activo: true
        }
    });

    if (dispositivos.length === 0) {
        return {
            total: 0,
            enviados: 0,
            fallidos: 0
        };
    }

    const messaging = getMessaging(firebaseApp);

    const resultados = await Promise.all(
        dispositivos.map(async (dispositivo) => {

            try {

                await messaging.send({
                    token: dispositivo.token_fcm,

                    // Los mensajes data permiten controlar
                    // la presentación desde el Service Worker.
                    data: {
                        titulo: String(titulo),
                        cuerpo: String(cuerpo),
                        tipo: "general"
                    },

                    webpush: {
                        headers: {
                            Urgency: "high"
                        }
                    }
                });

                return true;

            } catch (error) {

                console.error(
                    "Error enviando notificación:",
                    error.code || error.message
                );

                // Desactivar tokens que ya no son válidos
                if (
                    error.code === "messaging/registration-token-not-registered" ||
                    error.code === "messaging/invalid-registration-token"
                ) {
                    await dispositivo.update({
                        activo: false
                    });
                }

                return false;
            }
        })
    );

    const enviados = resultados.filter(Boolean).length;

    return {
        total: dispositivos.length,
        enviados,
        fallidos: dispositivos.length - enviados
    };
};

module.exports = {
    registrarToken,
    enviarNotificacionAUsuario
};