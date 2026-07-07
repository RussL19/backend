const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Asignacion = sequelize.define(
    "Asignacion",
    {

        id_asignacion:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },

        id_activo:{
            type:DataTypes.INTEGER,
            allowNull:false
        },

        id_empleado:{
            type:DataTypes.INTEGER,
            allowNull:false
        },

        fecha_asignacion:{
            type:DataTypes.DATEONLY,
            allowNull:false
        },

        fecha_devolucion:{
            type:DataTypes.DATEONLY
        },

        observaciones:{
            type:DataTypes.TEXT
        }

    },
    {
        tableName:"asignaciones",
        timestamps:true,
        createdAt:"created_at",
        updatedAt:"updated_at"
    }
);

const Activo=require("./Activo");
const Empleado=require("./Empleado");

Asignacion.belongsTo(Activo,{
    foreignKey:"id_activo"
});

Asignacion.belongsTo(Empleado,{
    foreignKey:"id_empleado"
});

module.exports=Asignacion;