const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Ubicacion = sequelize.define(
    "Ubicacion",
    {
        id_ubicacion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        }

    },
    {
        tableName: "ubicaciones",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = Ubicacion;