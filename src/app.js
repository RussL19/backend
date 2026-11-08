const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/firebaseAdmin");

const sequelize = require("./config/database");

const app = express();

const Rol = require("./models/Rol");

app.use(cors());
app.use(express.json());


const routes = require("./routes");


app.use("/api", routes);


const PORT = process.env.PORT || 3000;

// Probar conexión con MySQL
sequelize.authenticate()
    .then(async () => {

        console.log("✅ Conexión a MySQL establecida correctamente.");

    })
    .catch((error) => {

        console.error(error);

    });

// Ruta de prueba
app.get("/", (req, res) => {
    res.json({
        mensaje: "API Sistema de Gestión de Activos",
        version: "1.0"
    });
});

app.listen(PORT, "0.0.0.0",() => {
    console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});

const activoRoutes = require("./routes/activoRoutes");

app.use("/api/activos", activoRoutes);


const Activo = require("./models/Activo");
const Proveedor = require("./models/Proveedor");
const Mantenimiento = require("./models/Mantenimiento");
const Categoria = require("./models/Categoria");
const Ubicacion = require("./models/Ubicacion");
const Asignacion = require("./models/Asignacion");
const Empleado = require("./models/Empleado");
const Usuario = require("./models/Usuario");
const Dispositivo = require("./models/Dispositivo");
const reporteExportRoutes = require("./routes/reporteExportRoutes");

app.use("/api/reportes", reporteExportRoutes);

Activo.hasMany(Mantenimiento,{
    foreignKey:"id_activo"
});

Activo.belongsTo(Categoria,{
    foreignKey:"id_categoria"
});

Activo.belongsTo(Ubicacion,{
    foreignKey:"id_ubicacion"
});

Mantenimiento.belongsTo(Activo,{
    foreignKey:"id_activo"
});

Mantenimiento.belongsTo(Proveedor, {
    foreignKey: "id_proveedor"
});

Proveedor.hasMany(Mantenimiento,{
    foreignKey:"id_proveedor"
});
Categoria.hasMany(Activo, {

    foreignKey: "id_categoria"

});
Ubicacion.hasMany(Activo, {

    foreignKey: "id_ubicacion"

});
//---------------------------------------------------
// Relación Activo - Asignación
//---------------------------------------------------

Activo.hasMany(Asignacion,{
    foreignKey:"id_activo",
    as:"Asignaciones"
});

Asignacion.belongsTo(Activo,{
    foreignKey:"id_activo"
});

//---------------------------------------------------
// Relación Empleado - Asignación
//---------------------------------------------------

Empleado.hasMany(Asignacion,{
    foreignKey:"id_empleado"
});

Asignacion.belongsTo(Empleado,{
    foreignKey:"id_empleado"
});


//---------------------------------------------------
// Relación Usuario - Dispositivo
//---------------------------------------------------

Usuario.hasMany(Dispositivo, {
    foreignKey: "id_usuario",
    as: "dispositivos"
});

Dispositivo.belongsTo(Usuario, {
    foreignKey: "id_usuario",
    as: "usuario"
});

// Iniciar recordatorios automáticos de mantenimiento
const iniciarRecordatoriosMantenimiento =
    require("./jobs/mantenimientoReminderJob");

iniciarRecordatoriosMantenimiento();