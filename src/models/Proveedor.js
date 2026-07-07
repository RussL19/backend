const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Proveedor = sequelize.define(
    "Proveedor",
    {
        id_proveedor:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },

        nombre:{
            type:DataTypes.STRING,
            allowNull:false
        },

        telefono:DataTypes.STRING,

        correo:DataTypes.STRING

    },
    {
        tableName:"proveedores",
        timestamps:true,
        createdAt:"created_at",
        updatedAt:"updated_at"
    }
);

module.exports=Proveedor;