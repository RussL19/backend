const sequelize = require("../config/database");

const Mantenimiento = require("../models/Mantenimiento");
const Activo = require("../models/Activo");
const Proveedor = require("../models/Proveedor");
const HistorialMovimiento = require("../models/HistorialMovimiento");

const crearMantenimiento = async (datos)=>{

    const transaction = await sequelize.transaction();

    try{

        const activo = await Activo.findByPk(
            datos.id_activo,
            {transaction}
        );

        if(!activo){
            throw new Error("Activo no encontrado.");
        }

        const proveedor = await Proveedor.findByPk(
            datos.id_proveedor,
            {transaction}
        );

        if(!proveedor){
            throw new Error("Proveedor no encontrado.");
        }

        const mantenimiento = await Mantenimiento.create(
            datos,
            {transaction}
        );

        await activo.update(
            {
                estado:"Mantenimiento"
            },
            {transaction}
        );

        await HistorialMovimiento.create({

            id_activo:activo.id_activo,

            tipo_movimiento:"Mantenimiento",

            detalle:`Ingreso a mantenimiento (${datos.tipo})`

        },{transaction});

        await transaction.commit();

        return mantenimiento;

    }catch(error){

        await transaction.rollback();

        throw error;

    }

};

const obtenerMantenimientos = async ()=>{

    return await Mantenimiento.findAll({

        include:[

            {
                model:Activo,
                attributes:[
                    "codigo",
                    "nombre"
                ]
            },

            {
                model:Proveedor,
                attributes:[
                    "nombre"
                ]
            }

        ],

        order:[
            ["fecha_inicio","DESC"]
        ]

    });

};

const obtenerMantenimientoPorId = async(id)=>{

    const mantenimiento = await Mantenimiento.findByPk(id,{

        include:[

            {model:Activo},

            {model:Proveedor}

        ]

    });

    if(!mantenimiento){

        throw new Error("Mantenimiento no encontrado.");

    }

    return mantenimiento;

};

const finalizarMantenimiento = async(id)=>{

    const transaction = await sequelize.transaction();

    try{

        const mantenimiento = await Mantenimiento.findByPk(id,{transaction});

        if(!mantenimiento){

            throw new Error("Mantenimiento no encontrado.");

        }

        const activo = await Activo.findByPk(
            mantenimiento.id_activo,
            {transaction}
        );

        await mantenimiento.update({

            fecha_fin:new Date()

        },{transaction});

        await activo.update({

            estado:"Disponible"

        },{transaction});

        await HistorialMovimiento.create({

            id_activo:activo.id_activo,

            tipo_movimiento:"Mantenimiento",

            detalle:"Mantenimiento finalizado"

        },{transaction});

        await transaction.commit();

    }catch(error){

        await transaction.rollback();

        throw error;

    }

};

module.exports={

    crearMantenimiento,

    obtenerMantenimientos,

    obtenerMantenimientoPorId,

    finalizarMantenimiento

};