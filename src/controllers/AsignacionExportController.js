const PDFDocument = require("pdfkit");
const Asignacion = require("../models/Asignacion");
const Activo = require("../models/Activo");
const Empleado = require("../models/Empleado");

function formatoFecha(fecha) {
    if (!fecha) return "";

    return new Date(fecha).toLocaleDateString("es-CR");
}

function encabezado(doc, titulo) {

    doc
        .rect(40, 40, 520, 70)
        .lineWidth(1)
        .stroke();

    doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .text("SISTEMA DE GESTIÓN DE ACTIVOS", 0, 55, {
            align: "center"
        });

    doc
        .fontSize(16)
        .text(titulo, {
            align: "center"
        });

    doc.moveDown(2);
}

function piePagina(doc) {

    doc
        .fontSize(9)
        .fillColor("gray")
        .text(
            "Documento generado automáticamente por el Sistema de Gestión de Activos",
            0,
            760,
            {
                align: "center"
            }
        );

}

exports.generarPDFAsignacion = async (req, res) => {

    const asignacion = await Asignacion.findByPk(req.params.id, {
        include: [
            { model: Activo },
            { model: Empleado }
        ]
    });

    if (!asignacion) {
        return res.status(404).json({
            mensaje: "Asignación no encontrada."
        });
    }

    const doc = new PDFDocument({
        margin: 50,
        size: "A4"
    });

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=Asignacion_${asignacion.id_asignacion}.pdf`
    );

    doc.pipe(res);

    encabezado(doc, "BOLETA DE ASIGNACIÓN");

    doc.moveDown();

    doc.font("Helvetica-Bold")
        .fontSize(12)
        .text(`N° Asignación: `, 50, 140, { continued: true })
        .font("Helvetica")
        .text(asignacion.id_asignacion);

    doc.font("Helvetica-Bold")
        .text(`Fecha: `, { continued: true })
        .font("Helvetica")
        .text(formatoFecha(asignacion.fecha_asignacion));

    doc.moveDown();

    doc.font("Helvetica-Bold")
        .fontSize(13)
        .text("DATOS DEL ACTIVO");

    doc.moveTo(50, doc.y + 2)
        .lineTo(550, doc.y + 2)
        .stroke();

    doc.moveDown();

    doc.font("Helvetica")
        .fontSize(12);

    doc.text(`Código: ${asignacion.Activo.codigo}`);
    doc.text(`Nombre: ${asignacion.Activo.nombre}`);
    doc.text(`Estado: ${asignacion.Activo.estado}`);

    doc.moveDown();

    doc.font("Helvetica-Bold")
        .fontSize(13)
        .text("DATOS DEL EMPLEADO");

    doc.moveTo(50, doc.y + 2)
        .lineTo(550, doc.y + 2)
        .stroke();

    doc.moveDown();

    doc.font("Helvetica")
        .fontSize(12);

    doc.text(`Nombre: ${asignacion.Empleado.nombre} ${asignacion.Empleado.apellido}`);

    if (asignacion.Empleado.puesto) {
        doc.text(`Puesto: ${asignacion.Empleado.puesto}`);
    }

    doc.moveDown();

    doc.font("Helvetica-Bold")
        .fontSize(13)
        .text("OBSERVACIONES");

    doc.rect(50, doc.y + 10, 500, 80).stroke();

    doc.font("Helvetica")
        .fontSize(11)
        .text(
            "El colaborador recibe el activo descrito anteriormente en buen estado y se compromete a utilizarlo únicamente para fines laborales, así como a responder por su adecuado cuidado.",
            60,
            doc.y + 20,
            {
                width: 480,
                align: "justify"
            }
        );

    doc.y += 120;

    doc.moveTo(70, doc.y)
        .lineTo(220, doc.y)
        .stroke();

    doc.moveTo(340, doc.y)
        .lineTo(490, doc.y)
        .stroke();

    doc.font("Helvetica")
        .fontSize(11);

    doc.text("Firma del Empleado", 85, doc.y + 8);

    doc.text("Responsable de TI", 355, doc.y + 8);

    piePagina(doc);

    doc.end();

};

exports.generarPDFDevolucion = async (req, res) => {

    const asignacion = await Asignacion.findByPk(req.params.id, {
        include: [
            { model: Activo },
            { model: Empleado }
        ]
    });

    if (!asignacion) {
        return res.status(404).json({
            mensaje: "Asignación no encontrada."
        });
    }

    const doc = new PDFDocument({
        margin: 50,
        size: "A4"
    });

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=Devolucion_${asignacion.id_asignacion}.pdf`
    );

    doc.pipe(res);

    encabezado(doc, "BOLETA DE DEVOLUCIÓN");

    doc.moveDown();

    doc.font("Helvetica-Bold")
        .fontSize(12)
        .text(`N° Asignación: `, 50, 140, { continued: true })
        .font("Helvetica")
        .text(asignacion.id_asignacion);

    doc.font("Helvetica-Bold")
        .text(`Fecha devolución: `, { continued: true })
        .font("Helvetica")
        .text(formatoFecha(asignacion.fecha_devolucion));

    doc.moveDown();

    doc.font("Helvetica-Bold")
        .fontSize(13)
        .text("DATOS DEL ACTIVO");

    doc.moveTo(50, doc.y + 2)
        .lineTo(550, doc.y + 2)
        .stroke();

    doc.moveDown();

    doc.font("Helvetica")
        .fontSize(12);

    doc.text(`Código: ${asignacion.Activo.codigo}`);
    doc.text(`Nombre: ${asignacion.Activo.nombre}`);

    doc.moveDown();

    doc.font("Helvetica-Bold")
        .fontSize(13)
        .text("DATOS DEL EMPLEADO");

    doc.moveTo(50, doc.y + 2)
        .lineTo(550, doc.y + 2)
        .stroke();

    doc.moveDown();

    doc.font("Helvetica")
        .fontSize(12);

    doc.text(`Nombre: ${asignacion.Empleado.nombre} ${asignacion.Empleado.apellido}`);

    if (asignacion.Empleado.puesto) {
        doc.text(`Puesto: ${asignacion.Empleado.puesto}`);
    }

    doc.moveDown();

    doc.font("Helvetica-Bold")
        .fontSize(13)
        .text("OBSERVACIONES");

    doc.rect(50, doc.y + 10, 500, 80).stroke();

    doc.font("Helvetica")
        .fontSize(11)
        .text(
            "Se hace constar que el activo fue devuelto al departamento de Tecnología. Después de su revisión, se verificó su estado físico y funcional.",
            60,
            doc.y + 20,
            {
                width: 480,
                align: "justify"
            }
        );

    doc.y += 120;

    doc.moveTo(70, doc.y)
        .lineTo(220, doc.y)
        .stroke();

    doc.moveTo(340, doc.y)
        .lineTo(490, doc.y)
        .stroke();

    doc.fontSize(11);

    doc.text("Entrega", 120, doc.y + 8);

    doc.text("Recibe", 390, doc.y + 8);

    piePagina(doc);

    doc.end();

};