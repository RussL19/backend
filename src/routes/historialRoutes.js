const express=require("express");

const router=express.Router();

const verificarToken=require("../middlewares/authMiddleware");

const{

    obtenerHistorial,
    obtenerMovimientoPorId

}=require("../controllers/historialController");

router.get("/",verificarToken,obtenerHistorial);

router.get("/:id",verificarToken,obtenerMovimientoPorId);

module.exports=router;