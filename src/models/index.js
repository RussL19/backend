const Rol = require("./Rol");
const Usuario = require("./Usuario");

// Relaciones
Rol.hasMany(Usuario, {
    foreignKey: "id_rol",
    as: "usuarios"
});

Usuario.belongsTo(Rol, {
    foreignKey: "id_rol",
    as: "rol"
});

module.exports = {
    Rol,
    Usuario
};