const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const login = async (correo, password) => {

    const usuario = await Usuario.findOne({
        where: { correo }
    });

    if (!usuario) {
        throw new Error("Correo o contraseña incorrectos.");
    }

    if (!usuario.estado) {
        throw new Error("El usuario está inactivo.");
    }

    const passwordValido = await bcrypt.compare(
        password,
        usuario.password_hash
    );

    if (!passwordValido) {
        throw new Error("Correo o contraseña incorrectos.");
    }

    const token = jwt.sign(
        {
            id_usuario: usuario.id_usuario,
            id_rol: usuario.id_rol
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "8h"
        }
    );

    return {
        usuario: {
            id_usuario: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario,
            correo: usuario.correo,
            id_rol: usuario.id_rol
        },
        token
    };

};

module.exports = {
    login
};