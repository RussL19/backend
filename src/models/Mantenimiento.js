const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Mantenimiento = sequelize.define("Mantenimiento", {

    id_mantenimiento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_activo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    id_proveedor: {
        type: DataTypes.INTEGER
    },

    tipo: {
        type: DataTypes.ENUM(
            "Preventivo",
            "Correctivo"
        )
    },

    fecha_inicio: {
        type: DataTypes.DATEONLY
    },

    fecha_fin: {
        type: DataTypes.DATEONLY
    },

    costo: {
        type: DataTypes.DECIMAL(10, 2)
    },

    descripcion: {
        type: DataTypes.TEXT
    },
    recordatorio_enviado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

    fecha_recordatorio_enviado: {
        type: DataTypes.DATE,
        allowNull: true
    }

}, {

    tableName: "mantenimientos",
    timestamps: false

});

module.exports = Mantenimiento;