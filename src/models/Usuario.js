const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Usuario = sequelize.define(
    "Usuario",
    {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre_usuario: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },

        correo: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },

        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        id_rol: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reset_token: {
             type: DataTypes.STRING
        },

        reset_expira: {
            type: DataTypes.DATE
        },
        },
    {
        tableName: "usuarios",
        timestamps: false
    }
);

Usuario.associate = (models) => {

    Usuario.belongsTo(models.Rol, {
        foreignKey: "id_rol",
        as: "rol"
    });

};

module.exports = Usuario;