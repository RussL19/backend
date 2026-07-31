const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Asignacion = sequelize.define(
    "Asignacion",
    {

        id_asignacion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        id_activo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        id_empleado: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        fecha_asignacion: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        fecha_devolucion: {
            type: DataTypes.DATEONLY
        },
        estado: {
            type: DataTypes.ENUM(
                "Asignado",
                "Devuelto"
            ),
            defaultValue: "Asignado"
        },

        observaciones: {
            type: DataTypes.TEXT
        }

    },
    {
        tableName: "asignaciones",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);


module.exports = Asignacion;