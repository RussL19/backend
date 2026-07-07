const reporteService=require("../services/reporteService");

const dashboard=async(req,res)=>{

    try{

        const datos=await reporteService.dashboard();

        res.json(datos);

    }catch(error){

        res.status(500).json({
            mensaje:error.message
        });

    }

};

module.exports={

    dashboard

};