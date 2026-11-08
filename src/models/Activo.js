const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Activo = sequelize.define(
  "Activo",
  {
    id_activo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    descripcion: {
      type: DataTypes.TEXT,
    },

    marca: {
      type: DataTypes.STRING,
    },

    modelo: {
      type: DataTypes.STRING,
    },

    serie: {
      type: DataTypes.STRING,
    },

    fecha_adquisicion: {
      type: DataTypes.DATEONLY,
    },

    valor_adquisicion: {
      type: DataTypes.DECIMAL(12, 2),
    },

    garantia_meses: {
      type: DataTypes.INTEGER,
    },

    estado: {
      type: DataTypes.ENUM(
        "Disponible",
        "Asignado",
        "Mantenimiento",
        "Baja"
      ),
    },

    id_categoria: {
      type: DataTypes.INTEGER,
    },

    id_ubicacion: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "activos",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);



module.exports = Activo;