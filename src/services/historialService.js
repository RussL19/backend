const HistorialMovimiento = require("../models/HistorialMovimiento");
const Activo = require("../models/Activo");

const obtenerHistorial = async () => {

    return await HistorialMovimiento.findAll({

        include: [{
            model: Activo,
            attributes: ["codigo","nombre"]
        }],

        order: [["fecha","DESC"]]

    });

};

const obtenerMovimientoPorId = async(id)=>{

    const movimiento = await HistorialMovimiento.findByPk(id,{

        include:[{
            model: Activo
        }]

    });

    if(!movimiento)
        throw new Error("Movimiento no encontrado.");

    return movimiento;

};

module.exports={

    obtenerHistorial,
    obtenerMovimientoPorId

};