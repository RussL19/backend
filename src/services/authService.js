const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const nodemailer=require("nodemailer");
const { authenticator } = require("otplib");
const QRCode = require("qrcode");

const login = async (correo, password) => {
    const usuario = await Usuario.findOne({ where: { correo } });

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

    // Si tiene doble factor activado, todavía no entregar el JWT definitivo
    if (usuario.two_factor_enabled) {
        const challengeToken = jwt.sign(
            {
                id_usuario: usuario.id_usuario,
                purpose: "2fa_login"
            },
            process.env.JWT_SECRET,
            { expiresIn: "5m" }
        );

        return {
            requiere2FA: true,
            challengeToken,
            mensaje: "Ingresa el código de Google Authenticator."
        };
    }

    // Login normal para usuarios sin doble factor
    const token = jwt.sign(
        {
            id_usuario: usuario.id_usuario,
            id_rol: usuario.id_rol
        },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
    );

    return {
        requiere2FA: false,
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

// Generar QR para configurar Google Authenticator
const configurar2FA = async (id_usuario) => {
    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario || !usuario.estado) {
        throw new Error("Usuario no válido.");
    }

    if (usuario.two_factor_enabled) {
        throw new Error("La autenticación de dos factores ya está activada.");
    }

    const secret = authenticator.generateSecret();

    const otpauth = authenticator.keyuri(
        usuario.correo,
        "Sistema Gestion de Activos",
        secret
    );

    const qr = await QRCode.toDataURL(otpauth);

    // Guardar el secreto para verificar el código de confirmación.
    // El segundo factor sigue desactivado hasta confirmar el código.
    usuario.two_factor_secret = secret;
    await usuario.save();

    return {
        qr,
        secretoManual: secret,
        mensaje: "Escanea el QR con Google Authenticator y confirma el código."
    };
};

// Confirmar el código y activar Google Authenticator
const confirmar2FA = async (id_usuario, codigo) => {
    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario || !usuario.estado) {
        throw new Error("Usuario no válido.");
    }

    if (usuario.two_factor_enabled) {
        throw new Error("La autenticación de dos factores ya está activada.");
    }

    if (!usuario.two_factor_secret) {
        throw new Error("Primero debes solicitar la configuración del autenticador.");
    }

    const token = String(codigo || "").trim();

    if (!/^\d{6}$/.test(token)) {
        throw new Error("Ingresa un código válido de seis dígitos.");
    }

    const valido = authenticator.verify({
        token,
        secret: usuario.two_factor_secret,
        window: 1
    });

    if (!valido) {
        throw new Error("Código incorrecto o expirado. Inténtalo nuevamente.");
    }

    usuario.two_factor_enabled = true;
    await usuario.save();

    return {
        mensaje: "Google Authenticator se activó correctamente."
    };
};


const verificarCodigoLogin = async (challengeToken, codigo) => {
    let datos;

    try {
        datos = jwt.verify(challengeToken, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error("La solicitud expiró. Inicia sesión nuevamente.");
    }

    if (datos.purpose !== "2fa_login" || !datos.id_usuario) {
        throw new Error("Token de verificación no válido.");
    }

    const usuario = await Usuario.findByPk(datos.id_usuario);

    if (!usuario || !usuario.estado || !usuario.two_factor_enabled) {
        throw new Error("Usuario no válido o doble factor desactivado.");
    }

    const tokenIngresado = String(codigo || "").trim();

    if (!/^\d{6}$/.test(tokenIngresado)) {
        throw new Error("Ingresa un código de seis dígitos.");
    }

    const valido = authenticator.verify({
        token: tokenIngresado,
        secret: usuario.two_factor_secret,
        window: 1
    });

    if (!valido) {
        throw new Error("Código incorrecto o expirado.");
    }

    const token = jwt.sign(
        {
            id_usuario: usuario.id_usuario,
            id_rol: usuario.id_rol
        },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
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
    login,
    register,
    recuperarPassword,
    resetPassword,
    configurar2FA,
    confirmar2FA,
    verificarCodigoLogin
};



