const express=require("express");

const router=express.Router();

const verificarToken=require("../middlewares/authMiddleware");

const{

    dashboard

}=require("../controllers/reporteController");

router.get("/dashboard",verificarToken,dashboard);

module.exports=router;