const historialService=require("../services/historialService");

const obtenerHistorial=async(req,res)=>{

    try{

        const datos=await historialService.obtenerHistorial();

        res.json(datos);

    }catch(error){

        res.status(500).json({
            mensaje:error.message
        });

    }

};

const obtenerMovimientoPorId=async(req,res)=>{

    try{

        const dato=await historialService.obtenerMovimientoPorId(req.params.id);

        res.json(dato);

    }catch(error){

        res.status(404).json({
            mensaje:error.message
        });

    }

};

module.exports={

    obtenerHistorial,
    obtenerMovimientoPorId

};