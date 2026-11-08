const cron = require("node-cron");

const {
    ejecutarRecordatoriosMantenimiento
} = require("../services/recordatorioMantenimientoService");


const iniciarRecordatoriosMantenimiento = () => {

    cron.schedule(
        "0 8 * * *",

        async () => {

            console.log("Iniciando revisión automática de mantenimientos...");

            try {

                const resultado =
                    await ejecutarRecordatoriosMantenimiento();

                console.log(
                    "Resultado de recordatorios:",
                    resultado
                );

            } catch (error) {

                console.error(
                    "Error en la tarea de recordatorios:",
                    error
                );
            }

        },

        {
            timezone: "America/Costa_Rica"
        }
    );

    console.log(
        "Recordatorios de mantenimiento programados diariamente a las 8:00 a. m."
    );
};


module.exports = iniciarRecordatoriosMantenimiento;