const Departamento = require("../models/Departamento");

const obtenerDepartamentos = async () => {
    return await Departamento.findAll({
        order: [["nombre", "ASC"]]
    });
};

const obtenerDepartamentoPorId = async (id) => {

    const departamento = await Departamento.findByPk(id);

    if (!departamento)
        throw new Error("Departamento no encontrado.");

    return departamento;
};

const crearDepartamento = async (datos) => {

    const existe = await Departamento.findOne({
        where:{
            nombre: datos.nombre
        }
    });

    if(existe)
        throw new Error("El departamento ya existe.");

    return await Departamento.create(datos);

};

const actualizarDepartamento = async(id,datos)=>{

    const departamento=await Departamento.findByPk(id);

    if(!departamento)
        throw new Error("Departamento no encontrado.");

    const existe=await Departamento.findOne({
        where:{nombre:datos.nombre}
    });

    if(existe && existe.id_departamento!=id)
        throw new Error("El departamento ya existe.");

    await departamento.update(datos);

    return departamento;

};

const eliminarDepartamento=async(id)=>{

    const departamento=await Departamento.findByPk(id);

    if(!departamento)
        throw new Error("Departamento no encontrado.");

    await departamento.destroy();

};

module.exports={
    obtenerDepartamentos,
    obtenerDepartamentoPorId,
    crearDepartamento,
    actualizarDepartamento,
    eliminarDepartamento
};