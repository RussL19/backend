const {
    registrarToken: guardarToken,
    enviarNotificacionAUsuario
} = require("../services/notificacionService");


// Registrar token del navegador
const registrarToken = async (req, res) => {

    try {

        const idUsuario = Number(req.usuario?.id_usuario);

        const { token_fcm, plataforma = "web" } = req.body;

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            return res.status(401).json({
                mensaje: "No se pudo identificar al usuario autenticado."
            });
        }

        if (
            typeof token_fcm !== "string" ||
            token_fcm.trim().length < 20
        ) {
            return res.status(400).json({
                mensaje: "El token FCM no es válido."
            });
        }

        const dispositivo = await guardarToken(
            idUsuario,
            token_fcm.trim(),
            plataforma
        );

        return res.status(200).json({
            mensaje: "Dispositivo registrado correctamente.",
            id_dispositivo: dispositivo.id_dispositivo
        });

    } catch (error) {

        console.error("Error al registrar dispositivo:", error);

        return res.status(500).json({
            mensaje: "Error al registrar el dispositivo."
        });
    }
};


// Enviar notificación de prueba al usuario autenticado
const enviarPrueba = async (req, res) => {

    try {

        const idUsuario = Number(req.usuario?.id_usuario);

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            return res.status(401).json({
                mensaje: "Usuario no autenticado."
            });
        }

        const resultado = await enviarNotificacionAUsuario(
            idUsuario,
            "Prueba de notificaciones",
            "¡Tu sistema de Gestión de Activos ya puede enviarte notificaciones!"
        );

        if (resultado.total === 0) {
            return res.status(404).json({
                mensaje: "No tienes dispositivos registrados.",
                ...resultado
            });
        }

        return res.status(200).json({
            mensaje: "Proceso de envío finalizado.",
            destinatario: {
                id_usuario: idUsuario
            },
            ...resultado
        });

    } catch (error) {

        console.error("Error al enviar notificación:", error);

        return res.status(500).json({
            mensaje: "No se pudo enviar la notificación."
        });
    }
};


module.exports = {
    registrarToken,
    enviarPrueba
};