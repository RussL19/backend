const Usuario = require("../models/Usuario");
const usuarioService = require("../services/usuarioService");

// Obtener usuarios
const obtenerUsuarios = async (req, res) => {

    try {

        const usuarios = await Usuario.findAll({
            where: {
                estado: true
            },
            attributes: {
                exclude: ["password_hash"]
            }
        });

        res.json(usuarios);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};

// Crear usuario
const crearUsuario = async (req, res) => {

    try {

        const usuario = await usuarioService.crearUsuario(req.body);

        res.status(201).json({
            mensaje: "Usuario creado correctamente.",
            usuario
        });

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });

    }

};

const obtenerUsuarioPorId = async (req, res) => {

    try {

        const usuario = await usuarioService.obtenerUsuarioPorId(req.params.id);

        res.status(200).json(usuario);

    } catch (error) {

        res.status(404).json({
            mensaje: error.message
        });

    }

};

const actualizarUsuario = async (req, res) => {

    try {

        const usuario = await usuarioService.actualizarUsuario(
            req.params.id,
            req.body
        );

        res.status(200).json({
            mensaje: "Usuario actualizado correctamente.",
            usuario
        });

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });

    }

};

const eliminarUsuario = async (req, res) => {

    try {

        await usuarioService.eliminarUsuario(req.params.id);

        res.status(200).json({
            mensaje: "Usuario desactivado correctamente."
        });

    } catch (error) {

        res.status(404).json({
            mensaje: error.message
        });

    }

};

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
};