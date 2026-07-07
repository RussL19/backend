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

const register = async (datos) => {

    const {
        nombre_usuario,
        correo,
        password,
        id_rol
    } = datos;

    const existeUsuario = await Usuario.findOne({
        where: { correo }
    });

    if (existeUsuario) {
        throw new Error("El correo ya está registrado.");
    }

    const password_hash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
        nombre_usuario,
        correo, 
        password_hash, // Guardar el hash de la contraseña en lugar de la contraseña en texto plano
        id_rol: 3,   // Consulta para que no tenga permisos de administrador, solo usuario normal
        estado: true
    });

    const token = jwt.sign(
        {
            id_usuario: nuevoUsuario.id_usuario, // Incluir el id_usuario en el payload del token
            id_rol: nuevoUsuario.id_rol  // Incluir el id_rol en el payload del token
        },
        process.env.JWT_SECRET,  // Usar la clave secreta del archivo .env
        {
            expiresIn: "8h"
        }
    );

    return {
        usuario: {
            id_usuario: nuevoUsuario.id_usuario,
            nombre_usuario: nuevoUsuario.nombre_usuario,
            correo: nuevoUsuario.correo,
            id_rol: nuevoUsuario.id_rol
        },
        token
    };

};



module.exports = {
    login,
    register
};



