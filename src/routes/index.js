const express = require("express");

const router = express.Router();

const rolRoutes = require("./rolRoutes");
const usuarioRoutes = require("./usuarioRoutes");
const authRoutes = require("./authRoutes");

router.use("/roles", rolRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/", authRoutes);

module.exports = router;