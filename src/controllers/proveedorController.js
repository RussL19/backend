const proveedorService=require("../services/proveedorService");

const obtenerProveedores=async(req,res)=>{

try{

const proveedores=await proveedorService.obtenerProveedores();

res.json(proveedores);

}catch(error){

res.status(500).json({
mensaje:error.message
});

}

};

const obtenerProveedorPorId=async(req,res)=>{

try{

const proveedor=await proveedorService.obtenerProveedorPorId(req.params.id);

res.json(proveedor);

}catch(error){

res.status(404).json({
mensaje:error.message
});

}

};

const crearProveedor=async(req,res)=>{

try{

const proveedor=await proveedorService.crearProveedor(req.body);

res.status(201).json(proveedor);

}catch(error){

res.status(400).json({
mensaje:error.message
});

}

};

const actualizarProveedor=async(req,res)=>{

try{

const proveedor=await proveedorService.actualizarProveedor(req.params.id,req.body);

res.json(proveedor);

}catch(error){

res.status(400).json({
mensaje:error.message
});

}

};

const eliminarProveedor=async(req,res)=>{

try{

await proveedorService.eliminarProveedor(req.params.id);

res.json({
mensaje:"Proveedor eliminado correctamente."
});

}catch(error){

res.status(404).json({
mensaje:error.message
});

}

};

module.exports={
obtenerProveedores,
obtenerProveedorPorId,
crearProveedor,
actualizarProveedor,
eliminarProveedor
};