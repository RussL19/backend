const Categoria = require("../models/Categoria");

// Obtener todas
const obtenerCategorias = async () => {

    return await Categoria.findAll({
        order: [["nombre", "ASC"]]
    });

};

// Obtener por ID
const obtenerCategoriaPorId = async (id) => {

    const categoria = await Categoria.findByPk(id);

    if (!categoria)
        throw new Error("Categoría no encontrada.");

    return categoria;

};

// Crear
const crearCategoria = async (datos) => {

    const existe = await Categoria.findOne({
        where: {
            nombre: datos.nombre
        }
    });

    if (existe)
        throw new Error("La categoría ya existe.");

    return await Categoria.create(datos);

};

// Actualizar
const actualizarCategoria = async (id, datos) => {

    const categoria = await Categoria.findByPk(id);

    if (!categoria)
        throw new Error("Categoría no encontrada.");

    const existe = await Categoria.findOne({
        where: {
            nombre: datos.nombre
        }
    });

    if (
        existe &&
        existe.id_categoria != id
    ) {
        throw new Error("La categoría ya existe.");
    }

    await categoria.update(datos);

    return categoria;

};

// Eliminar
const eliminarCategoria = async (id) => {

    const categoria = await Categoria.findByPk(id);

    if (!categoria)
        throw new Error("Categoría no encontrada.");

    await categoria.destroy();

};

module.exports = {

    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria

};