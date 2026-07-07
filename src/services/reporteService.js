const { Op } = require("sequelize");

const Activo=require("../models/Activo");
const Usuario=require("../models/Usuario");
const Empleado=require("../models/Empleado");
const Asignacion=require("../models/Asignacion");
const Mantenimiento=require("../models/Mantenimiento");

const totalActivos=()=>{

    return Activo.count();

};

const activosDisponibles=()=>{

    return Activo.count({

        where:{
            estado:"Disponible"
        }

    });

};

const activosAsignados=()=>{

    return Activo.count({

        where:{
            estado:"Asignado"
        }

    });

};

const activosMantenimiento=()=>{

    return Activo.count({

        where:{
            estado:"Mantenimiento"
        }

    });

};

const totalUsuarios=()=>{

    return Usuario.count({

        where:{
            estado:true
        }

    });

};

const totalEmpleados=()=>{

    return Empleado.count();

};

const totalMantenimientos=()=>{

    return Mantenimiento.count();

};

const dashboard=async()=>{

    return{

        activos:await totalActivos(),

        disponibles:await activosDisponibles(),

        asignados:await activosAsignados(),

        mantenimiento:await activosMantenimiento(),

        usuarios:await totalUsuarios(),

        empleados:await totalEmpleados(),

        mantenimientos:await totalMantenimientos()

    };

};

module.exports={

    dashboard

};