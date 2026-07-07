const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Empleado = sequelize.define(
    "Empleado",
    {
        id_empleado: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        cedula: {
            type: DataTypes.STRING,
            allowNull: false
        },

        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },

        apellido: {
            type: DataTypes.STRING,
            allowNull: false
        },

        correo: {
            type: DataTypes.STRING,
            allowNull: false
        },

        telefono: {
            type: DataTypes.STRING
        },

        puesto: {
            type: DataTypes.STRING
        },

        id_departamento: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    },
    {
        tableName: "empleados",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = Empleado;

const Departamento = require("./Departamento");

Empleado.belongsTo(Departamento, {
    foreignKey: "id_departamento"
});