const Proveedor=require("../models/Proveedor");

const obtenerProveedores=async()=>{

    return await Proveedor.findAll({
        order:[["nombre","ASC"]]
    });

};

const obtenerProveedorPorId=async(id)=>{

    const proveedor=await Proveedor.findByPk(id);

    if(!proveedor)
        throw new Error("Proveedor no encontrado.");

    return proveedor;

};

const crearProveedor=async(datos)=>{

    return await Proveedor.create(datos);

};

const actualizarProveedor=async(id,datos)=>{

    const proveedor=await Proveedor.findByPk(id);

    if(!proveedor)
        throw new Error("Proveedor no encontrado.");

    await proveedor.update(datos);

    return proveedor;

};

const eliminarProveedor=async(id)=>{

    const proveedor=await Proveedor.findByPk(id);

    if(!proveedor)
        throw new Error("Proveedor no encontrado.");

    await proveedor.destroy();

};

module.exports={
obtenerProveedores,
obtenerProveedorPorId,
crearProveedor,
actualizarProveedor,
eliminarProveedor
};