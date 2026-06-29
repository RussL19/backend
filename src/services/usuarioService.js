const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");

const crearUsuario = async (datosUsuario) => {

    // Verificar si ya existe el correo
    const correoExistente = await Usuario.findOne({
        where: {
            correo: datosUsuario.correo
        }
    });

    if (correoExistente) {
        throw new Error("El correo ya está registrado.");
    }

    // Verificar si ya existe el nombre de usuario
    const usuarioExistente = await Usuario.findOne({
        where: {
            nombre_usuario: datosUsuario.nombre_usuario
        }
    });

    if (usuarioExistente) {
        throw new Error("El nombre de usuario ya existe.");
    }

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(datosUsuario.password, 10);

    // Crear usuario
    const usuario = await Usuario.create({
        nombre_usuario: datosUsuario.nombre_usuario,
        correo: datosUsuario.correo,
        password_hash: passwordHash,
        estado: true,
        id_rol: datosUsuario.id_rol
    });

    return usuario;
};

const obtenerUsuarioPorId = async (id) => {

    const usuario = await Usuario.findByPk(id, {
        attributes: {
            exclude: ["password_hash"]
        }
    });

    if (!usuario) {
        throw new Error("Usuario no encontrado.");
    }

    return usuario;
};

const actualizarUsuario = async (id, datosUsuario) => {

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        throw new Error("Usuario no encontrado.");
    }

    // Verificar correo duplicado
    const correoExistente = await Usuario.findOne({
        where: {
            correo: datosUsuario.correo
        }
    });

    if (correoExistente && correoExistente.id_usuario != id) {
        throw new Error("El correo ya está registrado.");
    }

    // Verificar nombre de usuario duplicado
    const usuarioExistente = await Usuario.findOne({
        where: {
            nombre_usuario: datosUsuario.nombre_usuario
        }
    });

    if (usuarioExistente && usuarioExistente.id_usuario != id) {
        throw new Error("El nombre de usuario ya existe.");
    }

    await usuario.update({
        nombre_usuario: datosUsuario.nombre_usuario,
        correo: datosUsuario.correo,
        estado: datosUsuario.estado,
        id_rol: datosUsuario.id_rol
    });

    return usuario;

};

const eliminarUsuario = async (id) => {

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        throw new Error("Usuario no encontrado.");
    }

    await usuario.update({
        estado: false
    });

    return usuario;
};

module.exports = {
    crearUsuario,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
};