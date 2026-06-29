const Rol = require("../models/Rol");

// Obtener todos los roles
const obtenerRoles = async (req, res) => {
    try {
        const roles = await Rol.findAll();

        res.status(200).json(roles);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener los roles."
        });

    }
};

module.exports = {
    obtenerRoles
};