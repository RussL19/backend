const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Dispositivo = sequelize.define(
    "Dispositivo",
    {
        id_dispositivo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        token_fcm: {
            type: DataTypes.STRING(500),
            allowNull: false,
            unique: true
        },

        plataforma: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "web"
        },

        fecha_registro: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },

        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        tableName: "dispositivos",
        timestamps: false
    }
);

module.exports = Dispositivo;