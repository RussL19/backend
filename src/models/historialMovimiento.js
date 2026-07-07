const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HistorialMovimiento = sequelize.define(
    "HistorialMovimiento",
    {

        id_movimiento:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },

        id_activo:{
            type:DataTypes.INTEGER,
            allowNull:false
        },

        tipo_movimiento:{
            type:DataTypes.ENUM(
                "Asignacion",
                "Devolucion",
                "Mantenimiento",
                "Baja"
            )
        },

        fecha:{
            type:DataTypes.DATE
        },

        detalle:{
            type:DataTypes.TEXT
        }

    },
    {
        tableName:"historial_movimientos",
        timestamps:true,
        createdAt:"created_at",
        updatedAt:"updated_at"
    }
);

const Activo=require("./Activo");

HistorialMovimiento.belongsTo(Activo,{
    foreignKey:"id_activo"
});

module.exports=HistorialMovimiento;