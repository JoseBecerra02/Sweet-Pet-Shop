<<<<<<< HEAD
// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const { googleLoginBackend } = require('../controllers/AuthController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const Inventario = require('../models/Inventario'); 
const Categoria = require('../models/Categoria'); 
const factura = require('../models/factura'); 
const PDFDocument = require('pdfkit'); // Importamos pdfkit
const ExcelJS = require('exceljs');

router.get('/facturas', async (req, res) => {
  try {
    const facturas = await factura.find();
    res.json(facturas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/facturas/:id', async (req, res) => {
  try {
    const factura = await factura.findById(req.params.id);
    if (!factura) return res.status(404).json({ message: 'Factura not found' });
    res.json(factura);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/facturas', async (req, res) => {
  const newFactura = new factura(req.body);
  try {
    const savedFactura = await newFactura.save();
    res.status(201).json(savedFactura);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/facturas/:id', async (req, res) => {
  try {
    const updatedFactura = await factura.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFactura) return res.status(404).json({ message: 'Factura not found' });
    res.json(updatedFactura);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/facturas/:id', async (req, res) => {
  try {
    const deletedFactura = await factura.findByIdAndDelete(req.params.id);
    if (!deletedFactura) return res.status(404).json({ message: 'Factura not found' });
    res.json({ message: 'Factura deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Informes

router.get('/informes/ventas', async (req, res) => {
  try {
    const facturasCompletas = await factura.aggregate([
      {
        $lookup: {
          from: 'usuarios',
          localField: 'id_usuario',
          foreignField: '_id',
          as: 'usuarioInfo'
        }
      },
      { $unwind: "$usuarioInfo" },
      {
        $lookup: {
          from: 'inventarios',
          localField: 'id_producto',
          foreignField: '_id',
          as: 'productoInfo'
        }
      },
      { $unwind: "$productoInfo" },
      {
        $lookup: {
          from: 'categorias',
          localField: 'productoInfo.categoria',
          foreignField: '_id',
          as: 'categoriaInfo'
        }
      },
      { $unwind: "$categoriaInfo" },
      {
        $project: {
          id_factura: "$_id",
          cantidad: 1,
          valor_total: 1,
          fecha: 1,
          nombre_usuario: "$usuarioInfo.nombre",
          nombre_producto: "$productoInfo.nombre_producto",
          nombre_categoria: "$categoriaInfo.nombre"
        }
      }
    ]);

    res.json(facturasCompletas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/informes/ventas/mensual', async (req, res) => {
  try {
    const ventasPorMes = await factura.aggregate([
      {
        $group: {
          _id: { 
            mes: { $month: "$fecha" }, // Extrae el mes de la fecha
            anio: { $year: "$fecha" }  // Extrae el año de la fecha
          },
          totalVentas: { $sum: "$valor_total" }, // Suma el valor total de las ventas
          cantidadVentas: { $sum: 1 } // Cuenta el número de ventas
        }
      },
      {
        $sort: { "_id.anio": 1, "_id.mes": 1 } // Ordena por año y mes
      }
    ]);

    res.json(ventasPorMes); // Devuelve el informe agrupado por meses
  } catch (err) {
    res.status(500).json({ message: err.message }); // Maneja errores
  }
});

router.get('/informes/ventas/usuarios', async (req, res) => {
  try {
    const ventasPorUsuario = await factura.aggregate([
      {
        $lookup: {
          from: 'usuarios', // Nombre de la colección de usuarios
          localField: 'id_usuario', // Campo en Factura que referencia al usuario
          foreignField: '_id', // Campo en Usuario que corresponde al ID del usuario
          as: 'usuarioInfo' // Nombre del campo donde se almacenará la información del usuario
        }
      },
      { $unwind: "$usuarioInfo" }, // Descompone el array para acceder a los detalles del usuario
      {
        $group: {
          _id: "$id_usuario", // Agrupa por el ID del usuario
          nombre: { $first: "$usuarioInfo.nombre" }, // Obtiene el nombre del usuario
          correo: { $first: "$usuarioInfo.correo" }, // Obtiene el correo del usuario
          estado: { $first: "$usuarioInfo.estado" }, // Obtiene el estado del usuario
          totalVentas: { $sum: "$valor_total" }, // Suma el valor total de ventas del usuario
          cantidadVentas: { $sum: 1 } // Cuenta cuántas ventas ha hecho el usuario
        }
      },
      {
        $sort: { totalVentas: -1 } // Ordena por el total de ventas en orden descendente
      }
    ]);

    res.json(ventasPorUsuario); // Devuelve el informe de ventas por usuario
  } catch (err) {
    res.status(500).json({ message: err.message }); // Maneja errores
  }
});

router.get('/informes/ventas/categorias', async (req, res) => {
  try {
    const ventasPorCategoria = await factura.aggregate([
      {
        $lookup: {
          from: 'inventarios',
          localField: 'id_producto',
          foreignField: '_id',
          as: 'productoInfo'
        }
      },
      { $unwind: "$productoInfo" },
      {
        $lookup: {
          from: 'categorias',
          localField: 'productoInfo.categoria',
          foreignField: '_id',
          as: 'categoriaInfo'
        }
      },
      { $unwind: "$categoriaInfo" },
      {
        $group: {
          _id: "$productoInfo.categoria",
          nombre: { $first: "$categoriaInfo.nombre" },
          cantidadVentas: { $sum: 1 },
          totalVentas: { $sum: "$valor_total" }
        }
      },
      {
        $sort: { cantidadVentas: -1 }
      }
    ]);

    res.json(ventasPorCategoria);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Informes  PDF

router.get('/informes/ventas/pdf', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const facturasCompletas = await factura.aggregate([
      {
        $lookup: {
          from: 'usuarios',
          localField: 'id_usuario',
          foreignField: '_id',
          as: 'usuarioInfo'
        }
      },
      { $unwind: "$usuarioInfo" },
      {
        $lookup: {
          from: 'inventarios',
          localField: 'id_producto',
          foreignField: '_id',
          as: 'productoInfo'
        }
      },
      { $unwind: "$productoInfo" },
      {
        $lookup: {
          from: 'categorias',
          localField: 'productoInfo.categoria',
          foreignField: '_id',
          as: 'categoriaInfo'
        }
      },
      { $unwind: "$categoriaInfo" },
      {
        $project: {
          id_factura: "$_id",
          cantidad: 1,
          valor_total: 1,
          fecha: 1,
          nombre_usuario: "$usuarioInfo.nombre",
          nombre_producto: "$productoInfo.nombre_producto",
          nombre_categoria: "$categoriaInfo.nombre"
        }
      }
    ])
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const fileName = 'ventas.pdf';
    res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Título
    doc.fontSize(25).text('Informe de Ventas', { align: 'center' });
    doc.moveDown();

    // Encabezados de la tabla
    doc.fontSize(12);
    const headers = ['ID Factura', 'Usuario', 'Producto', 'Categoría', 'Cantidad', 'Valor Total', 'Fecha'];
    const headerPositions = [50, 150, 250, 350, 450, 550, 650];

    headers.forEach((header, index) => {
      doc.text(header, headerPositions[index], 100);
    });

    // Separador
    doc.moveTo(50, 110).lineTo(800, 110).stroke();

    // Datos de la tabla
    let yOffset = 120; // Posición inicial en Y

    facturasCompletas.forEach((factura) => {
      // Define el contenido de cada columna
      const rowData = [
        factura.id_factura,
        factura.nombre_usuario,
        factura.nombre_producto,
        factura.nombre_categoria,
        factura.cantidad.toString(),
        factura.valor_total.toString(),
        factura.fecha.toString()
      ];

      // Calcula la altura máxima de la fila
      let maxRowHeight = 0;

      // Dibuja cada celda con ajuste de texto
      rowData.forEach((data, index) => {
        const x = headerPositions[index];
        const text = doc.text(data, x, yOffset, { width: 100, align: 'left' });

        // Calcula la altura del texto para ajustar el offset y permitir múltiples filas
        const textHeight = doc.heightOfString(data, { width: 100 });
        maxRowHeight = Math.max(maxRowHeight, textHeight);
      });

      // Aumenta el desplazamiento en Y según la altura máxima de la fila
      yOffset += maxRowHeight + 10; // Espacio adicional entre registros
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/informes/ventas/mensual/pdf', async (req, res) => {
  try {
    const ventasPorMes = await factura.aggregate([
      {
        $group: {
          _id: {
            mes: { $month: "$fecha" },
            anio: { $year: "$fecha" }
          },
          totalVentas: { $sum: "$valor_total" },
          cantidadVentas: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.anio": 1, "_id.mes": 1 }
      }
    ]);

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const fileName = 'informe_ventas_mensuales.pdf';
    res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Título
    doc.fontSize(25).text('Informe de Ventas Mensuales', { align: 'center' });
    doc.moveDown();

    // Encabezados de la tabla
    doc.fontSize(12);
    const headers = ['Mes/Año', 'Total Ventas', 'Cantidad de Ventas'];
    const headerPositions = [50, 250, 450];

    headers.forEach((header, index) => {
      doc.text(header, headerPositions[index], 100);
    });

    // Separador
    doc.moveTo(50, 110).lineTo(800, 110).stroke();

    // Datos de la tabla
    let yOffset = 120; // Posición inicial en Y

    ventasPorMes.forEach((venta) => {
      // Define el contenido de cada columna
      const mes = venta._id.mes;
      const anio = venta._id.anio;
      const totalVentas = venta.totalVentas.toFixed(2);
      const cantidadVentas = venta.cantidadVentas;

      const rowData = [
        `${mes}/${anio}`,
        totalVentas,
        cantidadVentas
      ];

      // Calcula la altura máxima de la fila
      let maxRowHeight = 0;

      // Dibuja cada celda con ajuste de texto
      rowData.forEach((data, index) => {
        const x = headerPositions[index];
        const text = doc.text(data, x, yOffset, { width: 100, align: 'left' });

        // Calcula la altura del texto para ajustar el offset y permitir múltiples filas
        const textHeight = doc.heightOfString(data, { width: 100 });
        maxRowHeight = Math.max(maxRowHeight, textHeight);
      });

      // Aumenta el desplazamiento en Y según la altura máxima de la fila
      yOffset += maxRowHeight + 10; // Espacio adicional entre registros
    });

    // Finaliza el PDF
    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/informes/ventas/usuarios/pdf', async (req, res) => {
  try {
    const ventasPorUsuario = await factura.aggregate([
      {
        $lookup: {
          from: 'usuarios', // Nombre de la colección de usuarios
          localField: 'id_usuario', // Campo en Factura que referencia al usuario
          foreignField: '_id', // Campo en Usuario que corresponde al ID del usuario
          as: 'usuarioInfo' // Nombre del campo donde se almacenará la información del usuario
        }
      },
      { $unwind: "$usuarioInfo" }, // Descompone el array para acceder a los detalles del usuario
      {
        $group: {
          _id: "$id_usuario", // Agrupa por el ID del usuario
          nombre: { $first: "$usuarioInfo.nombre" }, // Obtiene el nombre del usuario
          correo: { $first: "$usuarioInfo.correo" }, // Obtiene el correo del usuario
          estado: { $first: "$usuarioInfo.estado" }, // Obtiene el estado del usuario
          totalVentas: { $sum: "$valor_total" }, // Suma el valor total de ventas del usuario
          cantidadVentas: { $sum: 1 } // Cuenta cuántas ventas ha hecho el usuario
        }
      },
      {
        $sort: { totalVentas: -1 } // Ordena por el total de ventas en orden descendente
      }
    ]);

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const fileName = 'informe_ventas_por_usuario.pdf';
    res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Título
    doc.fontSize(25).text('Informe de Ventas por Usuario', { align: 'center' });
    doc.moveDown();

    // Encabezados de la tabla
    doc.fontSize(12);
    const headers = ['ID Usuario', 'Nombre', 'Correo', 'Estado', 'Total Ventas', 'Cantidad de Ventas'];
    const headerPositions = [50, 150, 250, 350, 450, 550];

    headers.forEach((header, index) => {
      doc.text(header, headerPositions[index], 100);
    });

    // Separador
    doc.moveTo(50, 110).lineTo(800, 110).stroke();

    // Datos de la tabla
    let yOffset = 120; // Posición inicial en Y

    ventasPorUsuario.forEach((venta) => {
      // Define el contenido de cada columna
      const rowData = [
        venta._id.toString(),
        venta.nombre,
        venta.correo,
        venta.estado,
        venta.totalVentas.toFixed(2),
        venta.cantidadVentas.toString()
      ];

      // Calcula la altura máxima de la fila
      let maxRowHeight = 0;

      // Dibuja cada celda con ajuste de texto
      rowData.forEach((data, index) => {
        const x = headerPositions[index];
        const text = doc.text(data, x, yOffset, { width: 100, align: 'left' });

        // Calcula la altura del texto para ajustar el offset y permitir múltiples filas
        const textHeight = doc.heightOfString(data, { width: 100 });
        maxRowHeight = Math.max(maxRowHeight, textHeight);
      });

      // Aumenta el desplazamiento en Y según la altura máxima de la fila
      yOffset += maxRowHeight + 10; // Espacio adicional entre registros
    });

    // Finaliza el PDF
    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/informes/ventas/categorias/pdf', async (req, res) => {
  try {
    const ventasPorCategoria = await factura.aggregate([
      {
        $lookup: {
          from: 'inventarios',
          localField: 'id_producto',
          foreignField: '_id',
          as: 'productoInfo'
        }
      },
      { $unwind: "$productoInfo" },
      {
        $lookup: {
          from: 'categorias',
          localField: 'productoInfo.categoria',
          foreignField: '_id',
          as: 'categoriaInfo'
        }
      },
      { $unwind: "$categoriaInfo" },
      {
        $group: {
          _id: "$productoInfo.categoria",
          nombre: { $first: "$categoriaInfo.nombre" },
          cantidadVentas: { $sum: 1 },
          totalVentas: { $sum: "$valor_total" }
        }
      },
      {
        $sort: { cantidadVentas: -1 }
      }
    ]);

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const fileName = 'informe_ventas_por_categoria.pdf';
    res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Título
    doc.fontSize(25).text('Informe de Ventas por Categoría', { align: 'center' });
    doc.moveDown();

    // Encabezados de la tabla
    doc.fontSize(12);
    const headers = ['ID Categoría', 'Nombre', 'Cantidad de Ventas', 'Total Ventas'];
    const headerPositions = [50, 150, 350, 550];

    headers.forEach((header, index) => {
      doc.text(header, headerPositions[index], 100);
    });

    // Separador
    doc.moveTo(50, 110).lineTo(800, 110).stroke();

    // Datos de la tabla
    let yOffset = 120; // Posición inicial en Y

    ventasPorCategoria.forEach((venta) => {
      // Define el contenido de cada columna
      const rowData = [
        venta._id.toString(),
        venta.nombre,
        venta.cantidadVentas.toString(),
        venta.totalVentas.toFixed(2)
      ];

      // Calcula la altura máxima de la fila
      let maxRowHeight = 0;

      // Dibuja cada celda con ajuste de texto
      rowData.forEach((data, index) => {
        const x = headerPositions[index];
        const text = doc.text(data, x, yOffset, { width: 100, align: 'left' });

        // Calcula la altura del texto para ajustar el offset y permitir múltiples filas
        const textHeight = doc.heightOfString(data, { width: 100 });
        maxRowHeight = Math.max(maxRowHeight, textHeight);
      });

      // Aumenta el desplazamiento en Y según la altura máxima de la fila
      yOffset += maxRowHeight + 10; // Espacio adicional entre registros
    });

    // Finaliza el PDF
    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Informes excel
router.get('/informes/ventas/excel', async (req, res) => {
  try {
    const facturasCompletas = await factura.aggregate([
      {
        $lookup: {
          from: 'usuarios',
          localField: 'id_usuario',
          foreignField: '_id',
          as: 'usuarioInfo'
        }
      },
      { $unwind: "$usuarioInfo" },
      {
        $lookup: {
          from: 'inventarios',
          localField: 'id_producto',
          foreignField: '_id',
          as: 'productoInfo'
        }
      },
      { $unwind: "$productoInfo" },
      {
        $lookup: {
          from: 'categorias',
          localField: 'productoInfo.categoria',
          foreignField: '_id',
          as: 'categoriaInfo'
        }
      },
      { $unwind: "$categoriaInfo" },
      {
        $project: {
          id_factura: "$_id",
          cantidad: 1,
          valor_total: 1,
          fecha: 1,
          nombre_usuario: "$usuarioInfo.nombre",
          nombre_producto: "$productoInfo.nombre_producto",
          nombre_categoria: "$categoriaInfo.nombre"
        }
      }
    ]);

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas');

    // Definir las columnas
    worksheet.columns = [
      { header: 'ID Factura', key: 'id_factura', width: 15 },
      { header: 'Cantidad', key: 'cantidad', width: 10 },
      { header: 'Valor Total', key: 'valor_total', width: 15 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Nombre Usuario', key: 'nombre_usuario', width: 30 },
      { header: 'Nombre Producto', key: 'nombre_producto', width: 30 },
      { header: 'Nombre Categoría', key: 'nombre_categoria', width: 30 }
    ];

    // Agregar filas al worksheet
    facturasCompletas.forEach(factura => {
      worksheet.addRow(factura);
    });

    // Configurar el encabezado para la descarga del archivo
    res.setHeader('Content-Disposition', 'attachment; filename=ventas.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Escribir el archivo en la respuesta
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/informes/ventas/mensual/excel', async (req, res) => {
  try {
    const ventasPorMes = await factura.aggregate([
      {
        $group: {
          _id: { 
            mes: { $month: "$fecha" }, // Extrae el mes de la fecha
            anio: { $year: "$fecha" }  // Extrae el año de la fecha
          },
          totalVentas: { $sum: "$valor_total" }, // Suma el valor total de las ventas
          cantidadVentas: { $sum: 1 } // Cuenta el número de ventas
        }
      },
      {
        $sort: { "_id.anio": 1, "_id.mes": 1 } // Ordena por año y mes
      }
    ]);

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas Mensuales');

    // Definir las columnas
    worksheet.columns = [
      { header: 'Año', key: 'anio', width: 10 },
      { header: 'Mes', key: 'mes', width: 10 },
      { header: 'Total Ventas', key: 'totalVentas', width: 15 },
      { header: 'Cantidad de Ventas', key: 'cantidadVentas', width: 20 }
    ];

    // Agregar filas al worksheet
    ventasPorMes.forEach(venta => {
      worksheet.addRow({
        anio: venta._id.anio,
        mes: venta._id.mes,
        totalVentas: venta.totalVentas,
        cantidadVentas: venta.cantidadVentas
      });
    });

    // Configurar el encabezado para la descarga del archivo
    res.setHeader('Content-Disposition', 'attachment; filename=ventas_mensuales.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Escribir el archivo en la respuesta
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: err.message }); // Maneja errores
  }
});

router.get('/informes/ventas/usuarios/excel', async (req, res) => {
  try {
    const ventasPorUsuario = await factura.aggregate([
      {
        $lookup: {
          from: 'usuarios', // Nombre de la colección de usuarios
          localField: 'id_usuario', // Campo en Factura que referencia al usuario
          foreignField: '_id', // Campo en Usuario que corresponde al ID del usuario
          as: 'usuarioInfo' // Nombre del campo donde se almacenará la información del usuario
        }
      },
      { $unwind: "$usuarioInfo" }, // Descompone el array para acceder a los detalles del usuario
      {
        $group: {
          _id: "$id_usuario", // Agrupa por el ID del usuario
          nombre: { $first: "$usuarioInfo.nombre" }, // Obtiene el nombre del usuario
          correo: { $first: "$usuarioInfo.correo" }, // Obtiene el correo del usuario
          estado: { $first: "$usuarioInfo.estado" }, // Obtiene el estado del usuario
          totalVentas: { $sum: "$valor_total" }, // Suma el valor total de ventas del usuario
          cantidadVentas: { $sum: 1 } // Cuenta cuántas ventas ha hecho el usuario
        }
      },
      {
        $sort: { totalVentas: -1 } // Ordena por el total de ventas en orden descendente
      }
    ]);

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas por Usuario');

    // Definir las columnas
    worksheet.columns = [
      { header: 'ID Usuario', key: 'id_usuario', width: 15 },
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Correo', key: 'correo', width: 30 },
      { header: 'Estado', key: 'estado', width: 15 },
      { header: 'Total Ventas', key: 'totalVentas', width: 15 },
      { header: 'Cantidad de Ventas', key: 'cantidadVentas', width: 20 }
    ];

    // Agregar filas al worksheet
    ventasPorUsuario.forEach(venta => {
      worksheet.addRow({
        id_usuario: venta._id,
        nombre: venta.nombre,
        correo: venta.correo,
        estado: venta.estado,
        totalVentas: venta.totalVentas,
        cantidadVentas: venta.cantidadVentas
      });
    });

    // Configurar el encabezado para la descarga del archivo
    res.setHeader('Content-Disposition', 'attachment; filename=ventas_por_usuario.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Escribir el archivo en la respuesta
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: err.message }); // Maneja errores
  }
});

router.get('/informes/ventas/categorias/excel', async (req, res) => {
  try {
    const ventasPorCategoria = await factura.aggregate([
      {
        $lookup: {
          from: 'inventarios',
          localField: 'id_producto',
          foreignField: '_id',
          as: 'productoInfo'
        }
      },
      { $unwind: "$productoInfo" },
      {
        $lookup: {
          from: 'categorias',
          localField: 'productoInfo.categoria',
          foreignField: '_id',
          as: 'categoriaInfo'
        }
      },
      { $unwind: "$categoriaInfo" },
      {
        $group: {
          _id: "$productoInfo.categoria",
          nombre: { $first: "$categoriaInfo.nombre" },
          cantidadVentas: { $sum: 1 },
          totalVentas: { $sum: "$valor_total" }
        }
      },
      {
        $sort: { cantidadVentas: -1 }
      }
    ]);

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas por Categoría');

    // Definir las columnas
    worksheet.columns = [
      { header: 'ID Categoría', key: 'id_categoria', width: 15 },
      { header: 'Nombre Categoría', key: 'nombre', width: 30 },
      { header: 'Cantidad Ventas', key: 'cantidadVentas', width: 20 },
      { header: 'Total Ventas', key: 'totalVentas', width: 15 }
    ];

    // Agregar filas al worksheet
    ventasPorCategoria.forEach(venta => {
      worksheet.addRow({
        id_categoria: venta._id,
        nombre: venta.nombre,
        cantidadVentas: venta.cantidadVentas,
        totalVentas: venta.totalVentas
      });
    });

    // Configurar el encabezado para la descarga del archivo
    res.setHeader('Content-Disposition', 'attachment; filename=ventas_por_categoria.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Escribir el archivo en la respuesta
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
=======
const express = require('express');
const router = express.Router();
const Carrito = require('../models/Carrito');
const Factura = require('../models/Factura');
const { sendInvoiceEmail } = require('../controllers/MailController');

// Ruta para crear una factura a partir del carrito
router.post('/factura/crear', async (req, res) => {
    const { id_usuario } = req.body; 

    try {
        const carrito = await Carrito.find({ id_usuario }).populate('producto');
        if (carrito.length === 0) {
            return res.status(404).json({ error: 'No hay productos en el carrito' });
        }

        // Calcular el total
        let total = 0;
        const productos = carrito.map(item => {
            const subtotal = item.producto.precio * item.cantidad;
            total += subtotal;
            return {
                id_producto: item.producto._id,
                nombre_producto: item.producto.nombre_producto,
                precio_unitario: item.producto.precio,
                cantidad: item.cantidad,
                subtotal: subtotal
            };
        });

        // Crear la factura
        const nuevaFactura = new Factura({
            id_usuario,
            productos,
            valor_total: total,
            fecha: new Date()
        });

        await nuevaFactura.save();

        // Obtener el correo electrónico del usuario (asumiendo que tienes un modelo Usuario)
        const usuario = await Usuario.findById(id_usuario);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await sendInvoiceEmail(id_usuario, usuario.correo, {
            id_factura: nuevaFactura.id_factura,
            productos: nuevaFactura.productos,
            valor_total,
            fecha: nuevaFactura.fecha
        });

        // Limpiar el carrito después de crear la factura (opcional)
        await Carrito.deleteMany({ id_usuario });

        res.status(201).json({ message: 'Factura creada y enviada por correo', factura: nuevaFactura });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la factura' });
    }
});

// Ruta para obtener las facturas de un usuario
router.get('/facturas', async (req, res) => {
    const { id_usuario } = req.body;

    try {
        const facturas = await Factura.find({ id_usuario }).populate('productos.id_producto');
        res.status(200).json(facturas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las facturas' });
    }
>>>>>>> 2901dcc64566a150bb2aeae3b495b88dae9b225e
});

module.exports = router;
