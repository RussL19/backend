const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const { Op } = require("sequelize");

const Activo = require("../models/Activo");
const Categoria = require("../models/Categoria");
const Ubicacion = require("../models/Ubicacion");
const Asignacion = require("../models/Asignacion");
const Empleado = require("../models/Empleado");
const Mantenimiento = require("../models/Mantenimiento");
const Usuario = require("../models/Usuario");
const Proveedor = require("../models/Proveedor");


async function obtenerActivos(where = {}) {

    return await Activo.findAll({

        where,

        include: [

            {
                model: Categoria,
                attributes: ["nombre"]
            },

            {
                model: Ubicacion,
                attributes: ["nombre"]
            },

            {
                model: Asignacion,
                as: "Asignaciones",

                include: [

                    {
                        model: Empleado
                    }

                ]
            }

        ]

    });

}

async function obtenerAsignaciones(where = {}) {

    return await Asignacion.findAll({

        where,

        include: [

            {
                model: Activo,
                attributes: [
                    "codigo",
                    "nombre"
                ]
            },

            {
                model: Empleado,
                attributes: [
                    "nombre",
                    "apellido"
                ]
            }

        ]

    });

}

async function obtenerHistorial(where = {}) {

    return await Asignacion.findAll({

        where,

        include: [

            {
                model: Activo,
                attributes: [
                    "codigo",
                    "nombre"
                ]
            },

            {
                model: Empleado,
                attributes: [
                    "nombre",
                    "apellido"
                ]
            }

        ],

        order: [

            ["fecha_asignacion", "DESC"]

        ]

    });

}


async function obtenerMantenimientos(where = {}) {

    return await Mantenimiento.findAll({

        where,

        include: [

            {
                model: Activo,
                attributes: [
                    "codigo",
                    "nombre"
                ]
            },

            {
                model: Proveedor,
                attributes: [
                    "nombre"
                ]
            }

        ]

    });

}


async function crearExcel(activos, res, nombreArchivo) {

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Activos");

    worksheet.columns = [

        { header: "Código", key: "codigo", width: 18 },
        { header: "Nombre", key: "nombre", width: 30 },
        { header: "Marca", key: "marca", width: 20 },
        { header: "Modelo", key: "modelo", width: 20 },
        { header: "Serie", key: "serie", width: 20 },
        { header: "Categoría", key: "categoria", width: 25 },
        { header: "Ubicación", key: "ubicacion", width: 25 },
        { header: "Empleado", key: "empleado", width: 30 },
        { header: "Estado", key: "estado", width: 18 }

    ];

    worksheet.getRow(1).font = {
        bold: true,
        color: {
            argb: "FFFFFF"
        }
    };

    worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "2563EB"
        }
    };

    worksheet.getRow(1).alignment = {
        vertical: "middle",
        horizontal: "center"
    };

    worksheet.autoFilter = "A1:I1";

    activos.forEach((activo) => {

        worksheet.addRow({

            codigo: activo.codigo,

            nombre: activo.nombre,

            marca: activo.marca,

            modelo: activo.modelo,

            serie: activo.serie,

            categoria: activo.Categoria?.nombre || "",

            ubicacion: activo.Ubicacion?.nombre || "",

            empleado:

                activo.Asignaciones?.length > 0 &&
                    activo.Asignaciones[0].Empleado

                    ? `${activo.Asignaciones[0].Empleado.nombre} ${activo.Asignaciones[0].Empleado.apellido}`

                    : "Sin asignar",

            estado: activo.estado

        });

    });

    worksheet.eachRow((row) => {

        row.eachCell((cell) => {

            cell.border = {

                top: { style: "thin" },

                left: { style: "thin" },

                bottom: { style: "thin" },

                right: { style: "thin" }

            };

        });

    });

    worksheet.views = [

        {

            state: "frozen",

            ySplit: 1

        }

    ];

    res.setHeader(

        "Content-Type",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    );

    res.setHeader(

        "Content-Disposition",

        `attachment; filename="${nombreArchivo}"`

    );

    await workbook.xlsx.write(res);

    res.end();

}

async function crearExcelAsignaciones(asignaciones, res, nombreArchivo) {

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Asignaciones");

    worksheet.columns = [

        { header: "Activo", key: "activo", width: 30 },
        { header: "Empleado", key: "empleado", width: 35 },
        { header: "Fecha Asignación", key: "fecha", width: 20 },
        { header: "Fecha Devolución", key: "devolucion", width: 20 }

    ];

    worksheet.getRow(1).font = {
        bold: true,
        color: { argb: "FFFFFF" }
    };

    worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "2563EB" }
    };

    asignaciones.forEach(a => {

        worksheet.addRow({

            activo: a.Activo?.nombre || "",

            empleado:
                a.Empleado
                    ? `${a.Empleado.nombre} ${a.Empleado.apellido}`
                    : "",

            fecha: a.fecha_asignacion,

            devolucion: a.fecha_devolucion || "Pendiente"

        });

    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nombreArchivo}"`
    );

    await workbook.xlsx.write(res);

    res.end();

}

async function crearExcelMantenimientos(mantenimientos, res, nombreArchivo) {

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Mantenimientos");

    worksheet.columns = [
        { header: "Activo", key: "activo", width: 30 },
        { header: "Proveedor", key: "proveedor", width: 30 },
        { header: "Fecha Inicio", key: "inicio", width: 18 },
        { header: "Fecha Fin", key: "fin", width: 18 },
        { header: "Costo", key: "costo", width: 15 },
        { header: "Descripción", key: "descripcion", width: 40 }
    ];

    worksheet.getRow(1).font = {
        bold: true,
        color: { argb: "FFFFFF" }
    };

    worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "2563EB" }
    };

    mantenimientos.forEach((m) => {

        worksheet.addRow({

            activo: m.Activo?.nombre || "",

            proveedor: m.Proveedor?.nombre || "",

            inicio: m.fecha_inicio,

            fin: m.fecha_fin,

            costo: m.costo,

            descripcion: m.descripcion

        });

    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nombreArchivo}"`
    );

    await workbook.xlsx.write(res);

    res.end();

}

async function crearExcelHistorial(historial, res, nombreArchivo) {

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Historial");

    worksheet.columns = [

        { header: "Activo", key: "activo", width: 35 },

        { header: "Empleado", key: "empleado", width: 35 },

        { header: "Fecha Asignación", key: "asignacion", width: 20 },

        { header: "Fecha Devolución", key: "devolucion", width: 20 },

        { header: "Estado", key: "estado", width: 18 }

    ];

    worksheet.getRow(1).font = {

        bold: true,

        color: { argb: "FFFFFF" }

    };

    worksheet.getRow(1).fill = {

        type: "pattern",

        pattern: "solid",

        fgColor: { argb: "2563EB" }

    };

    historial.forEach(h => {

        worksheet.addRow({

            activo: h.Activo?.nombre ?? "",

            empleado: h.Empleado

                ? `${h.Empleado.nombre} ${h.Empleado.apellido}`

                : "",

            asignacion: h.fecha_asignacion,

            devolucion: h.fecha_devolucion ?? "Pendiente",

            estado: h.fecha_devolucion

                ? "Finalizada"

                : "Activa"

        });

    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nombreArchivo}"`
    );

    await workbook.xlsx.write(res);

    res.end();

}

exports.exportarExcel = async (req, res) => {

    const activos = await obtenerActivos();

    await crearExcel(

        activos,

        res,

        "Reporte_Activos.xlsx"

    );

};

async function crearPDF(activos, req, res, nombreArchivo) {

    const doc = new PDFDocument({
        margin: 30,
        size: "A4"
    });

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nombreArchivo}"`
    );

    doc.pipe(res);

    //--------------------------------------------------
    // Encabezado
    //--------------------------------------------------

    doc
        .rect(20, 20, 555, 60)
        .fill("#2563EB");

    doc
        .fillColor("white")
        .fontSize(20)
        .text("SISTEMA DE GESTIÓN DE ACTIVOS", 0, 40, {
            align: "center"
        });

    doc
        .fontSize(12)
        .text("Reporte General", {
            align: "center"
        });

    doc.moveDown(3);

    doc.fillColor("black");

    doc.fontSize(10);

    doc.text(`Fecha: ${new Date().toLocaleString()}`);

    doc.text(`Usuario: ${req.usuario?.nombre_usuario ?? "Administrador"}`);

    doc.moveDown();
    let y = 145;

    const columnas = [

        { titulo: "Código", x: 25 },
        { titulo: "Nombre", x: 80 },
        { titulo: "Categoría", x: 185 },
        { titulo: "Ubicación", x: 285 },
        { titulo: "Empleado", x: 385 },
        { titulo: "Estado", x: 505 }

    ];

    doc
        .rect(20, y, 555, 22)
        .fill("#1E40AF");

    doc.fillColor("white");

    columnas.forEach(col => {

        doc.text(

            col.titulo,

            col.x,

            y + 6

        );

    });

    y += 28;

    doc.fillColor("black");

    activos.forEach((activo) => {

        if (y > 730) {

            doc.addPage();

            y = 40;

        }

        doc.fontSize(8);

        doc.text(activo.codigo ?? "", 25, y);

        doc.text(
            activo.nombre ?? "",
            80,
            y,
            { width: 90 }
        );

        doc.text(
            activo.Categoria?.nombre ?? "",
            185,
            y,
            { width: 90 }
        );

        doc.text(
            activo.Ubicacion?.nombre ?? "",
            285,
            y,
            { width: 90 }
        );

        doc.text(

            activo.Asignaciones?.length > 0 &&
                activo.Asignaciones[0].Empleado

                ? `${activo.Asignaciones[0].Empleado.nombre} ${activo.Asignaciones[0].Empleado.apellido}`

                : "Sin asignar",

            385,
            y,
            { width: 110 }
        );

        doc.text(

            activo.estado,

            505,

            y

        );

        doc.moveTo(20, y + 18)
            .lineTo(575, y + 18)
            .strokeColor("#D1D5DB")
            .stroke();

        y += 22;

    });
    doc.moveDown(2);

    doc.fillColor("#2563EB");

    doc.fontSize(12);

    doc.text("Resumen");

    doc.fillColor("black");

    doc.text(`Total de activos: ${activos.length}`);

    doc.end();

}

async function crearPDFAsignaciones(asignaciones, req, res, nombreArchivo) {

    const doc = new PDFDocument({
        margin: 30,
        size: "A4"
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nombreArchivo}"`
    );

    doc.pipe(res);

    doc.rect(20, 20, 555, 60).fill("#2563EB");

    doc.fillColor("white")
        .fontSize(20)
        .text("SISTEMA DE GESTIÓN DE ACTIVOS", 0, 40, {
            align: "center"
        });

    doc.fontSize(12)
        .text("Reporte de Asignaciones", {
            align: "center"
        });

    doc.moveDown(3);

    doc.fillColor("black");

    doc.text(`Fecha: ${new Date().toLocaleString()}`);

    doc.text(`Usuario: ${req.usuario?.nombre_usuario ?? "Administrador"}`);

    let y = 145;

    doc.rect(20, y, 555, 22).fill("#1E40AF");

    doc.fillColor("white");

    doc.fontSize(9);

    doc.text("Activo", 25, y + 6);

    doc.text("Empleado", 170, y + 6);

    doc.text("Asignación", 350, y + 6);

    doc.text("Devolución", 470, y + 6);

    y += 28;

    doc.fillColor("black");

    asignaciones.forEach(a => {

        if (y > 730) {

            doc.addPage();

            y = 40;

        }

        doc.fontSize(8);

        doc.text(
            a.Activo?.nombre ?? "",
            25,
            y,
            { width: 130 }
        );

        doc.text(
            a.Empleado
                ? `${a.Empleado.nombre} ${a.Empleado.apellido}`
                : "",
            170,
            y,
            { width: 170 }
        );

        doc.text(
            a.fecha_asignacion ?? "",
            350,
            y
        );

        doc.text(
            a.fecha_devolucion ?? "Pendiente",
            470,
            y
        );

        doc.moveTo(20, y + 18)
            .lineTo(575, y + 18)
            .strokeColor("#E5E7EB")
            .stroke();

        y += 22;

    });

    doc.moveDown();

    doc.fontSize(12);

    doc.fillColor("#2563EB");

    doc.text("Resumen");

    doc.fillColor("black");

    doc.text(`Total de asignaciones: ${asignaciones.length}`);

    doc.end();

}

async function crearPDFMantenimientos(mantenimientos, req, res, nombreArchivo) {

    const doc = new PDFDocument({
        margin: 30,
        size: "A4"
    });

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nombreArchivo}"`
    );

    doc.pipe(res);

    //------------------------------------------------

    doc.rect(20, 20, 555, 60).fill("#2563EB");

    doc.fillColor("white")
        .fontSize(20)
        .text("SISTEMA DE GESTIÓN DE ACTIVOS", 0, 40, {
            align: "center"
        });

    doc.fontSize(12)
        .text("Reporte de Mantenimientos", {
            align: "center"
        });

    doc.moveDown(3);

    doc.fillColor("black");

    doc.text(`Fecha: ${new Date().toLocaleString()}`);

    doc.text(`Usuario: ${req.usuario?.nombre_usuario ?? "Administrador"}`);

    let y = 145;

    doc.rect(20, y, 555, 22).fill("#1E40AF");

    doc.fillColor("white");

    doc.fontSize(8);

    doc.text("Activo", 25, y + 6);

    doc.text("Proveedor", 130, y + 6);

    doc.text("Inicio", 245, y + 6);

    doc.text("Fin", 320, y + 6);

    doc.text("Costo", 395, y + 6);

    doc.text("Tipo", 475, y + 6);

    y += 28;

    doc.fillColor("black");

    mantenimientos.forEach((m) => {

        if (y > 730) {

            doc.addPage();

            y = 40;

        }

        doc.fontSize(8);

        doc.text(
            m.Activo?.nombre ?? "",
            25,
            y,
            { width: 95 }
        );

        doc.text(
            m.Proveedor?.nombre ?? "",
            130,
            y,
            { width: 100 }
        );

        doc.text(
            m.fecha_inicio ?? "",
            245,
            y
        );

        doc.text(
            m.fecha_fin ?? "",
            320,
            y
        );

        doc.text(
            `${m.costo ?? 0}`,
            395,
            y
        );

        doc.text(
            m.tipo ?? "",
            475,
            y,
            { width: 80 }
        );

        doc.moveTo(20, y + 18)
            .lineTo(575, y + 18)
            .strokeColor("#E5E7EB")
            .stroke();

        y += 22;

    });

    doc.moveDown();

    doc.fontSize(12);

    doc.fillColor("#2563EB");

    doc.text("Resumen");

    doc.fillColor("black");

    doc.text(`Total de mantenimientos: ${mantenimientos.length}`);

    doc.end();

}

async function crearPDFHistorial(historial, req, res, nombreArchivo) {

    const doc = new PDFDocument({
        margin: 30,
        size: "A4"
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nombreArchivo}"`
    );

    doc.pipe(res);

    // Encabezado
    doc.rect(20, 20, 555, 60).fill("#2563EB");

    doc.fillColor("white")
        .fontSize(20)
        .text("SISTEMA DE GESTIÓN DE ACTIVOS", 0, 40, {
            align: "center"
        });

    doc.fontSize(12)
        .text("Reporte de Historial", {
            align: "center"
        });

    doc.moveDown(3);

    doc.fillColor("black");
    doc.fontSize(10);

    doc.text(`Fecha: ${new Date().toLocaleString()}`);
    doc.text(`Usuario: ${req.usuario?.nombre_usuario ?? "Administrador"}`);

    let y = 145;

    doc.rect(20, y, 555, 22).fill("#1E40AF");

    doc.fillColor("white").fontSize(9);

    doc.text("Activo", 25, y + 6);
    doc.text("Empleado", 170, y + 6);
    doc.text("Asignación", 320, y + 6);
    doc.text("Devolución", 420, y + 6);
    doc.text("Estado", 510, y + 6);

    y += 28;

    doc.fillColor("black");

    historial.forEach(h => {

        if (y > 730) {

            doc.addPage();

            y = 40;

        }

        doc.fontSize(8);

        doc.text(
            h.Activo?.nombre ?? "",
            25,
            y,
            { width: 130 }
        );

        doc.text(
            h.Empleado
                ? `${h.Empleado.nombre} ${h.Empleado.apellido}`
                : "",
            170,
            y,
            { width: 140 }
        );

        doc.text(
            h.fecha_asignacion ?? "",
            320,
            y
        );

        doc.text(
            h.fecha_devolucion ?? "Pendiente",
            420,
            y
        );

        doc.text(
            h.fecha_devolucion ? "Finalizada" : "Activa",
            510,
            y
        );

        doc.moveTo(20, y + 18)
            .lineTo(575, y + 18)
            .strokeColor("#D1D5DB")
            .stroke();

        y += 22;

    });

    doc.moveDown(2);

    doc.fillColor("#2563EB");

    doc.fontSize(12);

    doc.text("Resumen");

    doc.fillColor("black");

    doc.text(`Total de registros: ${historial.length}`);

    doc.end();

}

exports.exportarPDF = async (req, res) => {

    const activos = await obtenerActivos();

    await crearPDF(

        activos,

        req,

        res,

        "Reporte_Activos.pdf"

    );

};


exports.generarReporte = async (req, res) => {

    try {

        const {
            categoria,
            ubicacion,
            estado,
            fechaInicio,
            fechaFinal,
            tipoReporte,
            tipo
        } = req.body;

        const where = {};

        //=====================================
        // Filtros para ACTivos
        //=====================================

        const whereActivos = {};

        if (categoria) {
            whereActivos.id_categoria = categoria;
        }

        if (ubicacion) {
            whereActivos.id_ubicacion = ubicacion;
        }

        if (estado) {
            whereActivos.estado = estado;
        }

        if (fechaInicio && fechaFinal) {
            whereActivos.created_at = {
                [Op.between]: [fechaInicio, fechaFinal]
            };
        }

        //=====================================
        // Filtros para ASIGNACIONES
        //=====================================

        const whereAsignaciones = {};

        if (fechaInicio && fechaFinal) {
            whereAsignaciones.fecha_asignacion = {
                [Op.between]: [fechaInicio, fechaFinal]
            };
        }

        //=====================================
        // Filtros para MANTENIMIENTOS
        //=====================================

        const whereMantenimientos = {};

        if (fechaInicio && fechaFinal) {
            whereMantenimientos.fecha_inicio = {
                [Op.between]: [fechaInicio, fechaFinal]
            };
        }

        //----------------------------------------------------
        // Aquí luego agregaremos los demás tipos
        //----------------------------------------------------

        let datos = [];

        switch (tipoReporte) {

            case "activos": {

                const activos = await obtenerActivos(whereActivos);

                if (tipo === "pdf") {

                    return await crearPDF(
                        activos,
                        req,
                        res,
                        "Reporte_Activos.pdf"
                    );

                }

                return await crearExcel(
                    activos,
                    res,
                    "Reporte_Activos.xlsx"
                );

            }

            case "asignaciones": {

                const asignaciones = await obtenerAsignaciones(whereAsignaciones);

                if (tipo === "pdf") {

                    return await crearPDFAsignaciones(

                        asignaciones,

                        req,

                        res,

                        "Reporte_Asignaciones.pdf"

                    );

                }

                return await crearExcelAsignaciones(

                    asignaciones,

                    res,

                    "Reporte_Asignaciones.xlsx"

                );

            }


            case "mantenimientos": {

                const mantenimientos = await obtenerMantenimientos(whereMantenimientos);

                if (tipo === "pdf") {

                    return await crearPDFMantenimientos(

                        mantenimientos,

                        req,

                        res,

                        "Reporte_Mantenimientos.pdf"

                    );

                }

                return await crearExcelMantenimientos(

                    mantenimientos,

                    res,

                    "Reporte_Mantenimientos.xlsx"

                );

            }
            case "historial": {

                const historial = await obtenerHistorial(whereAsignaciones);

                if (tipo === "pdf") {

                    return await crearPDFHistorial(

                        historial,

                        req,

                        res,

                        "Reporte_Historial.pdf"

                    );

                }

                return await crearExcelHistorial(

                    historial,

                    res,

                    "Reporte_Historial.xlsx"

                );

            }


            default:

                return res.status(400).json({

                    mensaje: "Tipo de reporte aún no implementado"

                });

        }

    } catch (error) {
        console.log("=================================");
        console.log(error);
        console.log(error.message);
        console.log(error.stack);
        console.log("=================================");

        res.status(500).send("Error al generar el reporte");
    }

};