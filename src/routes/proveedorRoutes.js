const express=require("express");

const verificarToken=require("../middlewares/authMiddleware");

const router=express.Router();

const{

obtenerProveedores,
obtenerProveedorPorId,
crearProveedor,
actualizarProveedor,
eliminarProveedor

}=require("../controllers/proveedorController");

router.get("/",verificarToken,obtenerProveedores);

router.get("/:id",verificarToken,obtenerProveedorPorId);

router.post("/",verificarToken,crearProveedor);

router.put("/:id",verificarToken,actualizarProveedor);

router.delete("/:id",verificarToken,eliminarProveedor);

module.exports=router;