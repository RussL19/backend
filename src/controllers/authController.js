const authService = require("../services/authService");

const login = async (req, res) => {

    try {

        const { correo, password } = req.body;

        const respuesta = await authService.login(correo, password);

        res.status(200).json(respuesta);

    } catch (error) {

        res.status(401).json({
            mensaje: error.message
        });

    }

};

const register = async (req, res) => {

    try {

        const respuesta = await authService.register(req.body);

        res.status(201).json(respuesta);

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });

    }

};

module.exports = {
    login,
    register
};