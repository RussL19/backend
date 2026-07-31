const sequelize = require("../config/database");

const Asignacion = require("../models/Asignacion");
const Activo = require("../models/Activo");
const Empleado = require("../models/Empleado");
const HistorialMovimiento = require("../models/HistorialMovimiento");

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

        return asignacion;

    } catch (error) {

        await transaction.rollback();
        console.error(error.message);

        throw error;

    }

};



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

const obtenerAsignacionPorId = async (id) => {

    const asignacion = await Asignacion.findByPk(id, {

        include: [

            { model: Activo },

            { model: Empleado }

        ]

    });

    if (!asignacion)
        throw new Error("Asignación no encontrada.");

    return asignacion;

};

const devolverActivo = async (id) => {

    const transaction = await sequelize.transaction();

    try {

        const asignacion = await Asignacion.findByPk(id, { transaction });

        if (!asignacion) {
            throw new Error("Asignación no encontrada.");
        }

        const activo = await Activo.findByPk(asignacion.id_activo, { transaction });

        

        if (!activo) {
            throw new Error("Activo no encontrado.");
        }

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

    } catch (error) {

        await transaction.rollback();
        console.log(error);
        throw error;
    }

};

module.exports = {

    crearAsignacion,

    obtenerAsignaciones,

    obtenerAsignacionPorId,

    devolverActivo

};

