const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const nodemailer=require("nodemailer");
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

const transporter = nodemailer.createTransport({

    service:"gmail",

    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }

});

const recuperarPassword = async(correo)=>{

    const usuario=await Usuario.findOne({
        where:{correo}
    });

    if(!usuario){

        throw new Error("No existe un usuario con ese correo.");

    }

    const token=jwt.sign(

        {id_usuario:usuario.id_usuario},

        process.env.JWT_SECRET,

        {expiresIn:"15m"}

    );

    usuario.reset_token=token;

    usuario.reset_expira=new Date(Date.now()+15*60*1000);

    await usuario.save();

    const enlace=`${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await transporter.sendMail({

        from:process.env.EMAIL_USER,

        to:usuario.correo,

        subject:"Recuperar contraseña",

        html:`

        <div style="font-family:Arial;padding:30px">

            <h2>Sistema Gestión de Activos</h2>

            <p>Hola ${usuario.nombre_usuario}</p>

            <p>Haz clic en el siguiente botón para cambiar tu contraseña.</p>

            <a
                href="${enlace}"
                style="
                    background:#2563eb;
                    color:white;
                    padding:12px 25px;
                    text-decoration:none;
                    border-radius:6px;
                "
            >
                Restablecer contraseña
            </a>

            <p>Este enlace expirará en 15 minutos.</p>

        </div>

        `

    });

};

const resetPassword=async(token,password)=>{

    let payload;

    try{

        payload=jwt.verify(

            token,

            process.env.JWT_SECRET

        );

    }catch{

        throw new Error("Token inválido.");

    }

    const usuario=await Usuario.findByPk(

        payload.id_usuario

    );

    if(!usuario){

        throw new Error("Usuario no encontrado.");

    }

    if(usuario.reset_token!==token){

        throw new Error("Token inválido.");

    }

    if(new Date(usuario.reset_expira)<new Date()){

        throw new Error("El enlace expiró.");

    }

    usuario.password_hash=await bcrypt.hash(password,10);

    usuario.reset_token=null;

    usuario.reset_expira=null;

    await usuario.save();

    return true;

};

module.exports = {
    login,
    register,
    recuperarPassword,
    resetPassword
};



