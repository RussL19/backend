const express=require("express");

const verificarToken=require("../middlewares/authMiddleware");

const router=express.Router();

const{

obtenerDepartamentos,
obtenerDepartamentoPorId,
crearDepartamento,
actualizarDepartamento,
eliminarDepartamento

}=require("../controllers/departamentoController");

router.get("/",verificarToken,obtenerDepartamentos);

router.get("/:id",verificarToken,obtenerDepartamentoPorId);

router.post("/",verificarToken,crearDepartamento);

router.put("/:id",verificarToken,actualizarDepartamento);

router.delete("/:id",verificarToken,eliminarDepartamento);

module.exports=router;