const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Departamento = sequelize.define(
    "Departamento",
    {
        id_departamento: {
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
        tableName: "departamentos",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = Departamento;