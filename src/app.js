const express = require("express");
const cors = require("cors");
require("dotenv").config();

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
Activo.hasMany(Mantenimiento,{
    foreignKey:"id_activo"
});

Mantenimiento.belongsTo(Activo,{
    foreignKey:"id_activo"
});

Proveedor.hasMany(Mantenimiento,{
    foreignKey:"id_proveedor"
});

Mantenimiento.belongsTo(Proveedor,{
    foreignKey:"id_proveedor"
});
