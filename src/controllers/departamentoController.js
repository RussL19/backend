const departamentoService=require("../services/departamentoService");

const obtenerDepartamentos=async(req,res)=>{

    try{

        const departamentos=await departamentoService.obtenerDepartamentos();

        res.json(departamentos);

    }catch(error){

        res.status(500).json({
            mensaje:error.message
        });

    }

};

const obtenerDepartamentoPorId=async(req,res)=>{

    try{

        const departamento=await departamentoService.obtenerDepartamentoPorId(req.params.id);

        res.json(departamento);

    }catch(error){

        res.status(404).json({
            mensaje:error.message
        });

    }

};

const crearDepartamento=async(req,res)=>{

    try{

        const departamento=await departamentoService.crearDepartamento(req.body);

        res.status(201).json(departamento);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

};

const actualizarDepartamento=async(req,res)=>{

    try{

        const departamento=await departamentoService.actualizarDepartamento(req.params.id,req.body);

        res.json(departamento);

    }catch(error){

        res.status(400).json({
            mensaje:error.message
        });

    }

};

const eliminarDepartamento=async(req,res)=>{

    try{

        await departamentoService.eliminarDepartamento(req.params.id);

        res.json({
            mensaje:"Departamento eliminado correctamente."
        });

    }catch(error){

        res.status(404).json({
            mensaje:error.message
        });

    }

};

module.exports={
    obtenerDepartamentos,
    obtenerDepartamentoPorId,
    crearDepartamento,
    actualizarDepartamento,
    eliminarDepartamento
};