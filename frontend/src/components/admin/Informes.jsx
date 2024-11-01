import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Toolbar,
} from "@mui/material";
import axios from "axios";

export default function AdminReports() {
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [ventasPorUsuario, setVentasPorUsuario] = useState([]);
  const [ventasPorCategoria, setVentasPorCategoria] = useState([]);
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    fetchVentasMensuales();
    fetchVentasPorUsuario();
    fetchVentasPorCategoria();
  }, []);

  // Funciones para obtener datos de la API
  const fetchVentasMensuales = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/factura/informes/ventas/mensual");
      setVentasMensuales(response.data);
    } catch (error) {
      console.error("Error al obtener ventas mensuales:", error);
    }
  };

  const fetchVentasPorUsuario = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/factura/informes/ventas/usuarios");
      setVentasPorUsuario(response.data);
    } catch (error) {
      console.error("Error al obtener ventas por usuario:", error);
    }
  };

  const fetchVentasPorCategoria = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/factura/informes/ventas/categorias");
      setVentasPorCategoria(response.data);
    } catch (error) {
      console.error("Error al obtener ventas por categoría:", error);
    }
  };

  // Funciones para descargar informes en PDF o Excel
  const downloadPDF = async (url) => {
    try {
      const response = await axios.get(url, { responseType: "blob" });
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", "informe.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error al generar PDF:", error);
    }
  };

  const downloadExcel = async (url) => {
    try {
      const response = await axios.get(url, { responseType: "blob" });
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", "informe.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error al generar Excel:", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Toolbar>
      <Typography variant="h4" gutterBottom sx={{marginTop:'50px'}}>
        Informes de Administración
      </Typography>
      </Toolbar>
      {/* Tarjetas de Resumen */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Total Ventas Mensuales</Typography>
              <Typography variant="h5">{ventasMensuales.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Ventas por Usuario</Typography>
              <Typography variant="h5">{ventasPorUsuario.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Ventas por Categoría</Typography>
              <Typography variant="h5">{ventasPorCategoria.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sección de Ventas Mensuales */}
      <Typography variant="h5" sx={{ mt: 4 }}>
        Ventas Mensuales
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => downloadPDF("http://localhost:3000/api/factura/informes/ventas/mensual/pdf")}>
          Descargar PDF
        </Button>
        <Button variant="contained" color="success" onClick={() => downloadExcel("http://localhost:3000/api/factura/informes/ventas/mensual/excel")}>
          Descargar Excel
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mes/Año</TableCell>
              <TableCell>Total Ventas</TableCell>
              <TableCell>Cantidad de Ventas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventasMensuales.map((venta, index) => (
              <TableRow key={index}>
                <TableCell>{`${venta._id.mes}/${venta._id.anio}`}</TableCell>
                <TableCell>{venta.totalVentas}</TableCell>
                <TableCell>{venta.cantidadVentas}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Sección de Ventas por Usuario */}
      <Typography variant="h5" sx={{ mt: 4 }}>
        Ventas por Usuario
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => downloadPDF("http://localhost:3000/api/factura/informes/ventas/usuarios/pdf")}>
          Descargar PDF
        </Button>
        <Button variant="contained" color="success" onClick={() => downloadExcel("http://localhost:3000/api/factura/informes/ventas/usuarios/excel")}>
          Descargar Excel
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre Usuario</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Total Ventas</TableCell>
              <TableCell>Cantidad de Ventas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventasPorUsuario.map((venta, index) => (
              <TableRow key={index}>
                <TableCell>{venta.nombre}</TableCell>
                <TableCell>{venta.correo}</TableCell>
                <TableCell>{venta.estado}</TableCell>
                <TableCell>{venta.totalVentas}</TableCell>
                <TableCell>{venta.cantidadVentas}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Sección de Ventas por Categoría */}
      <Typography variant="h5" sx={{ mt: 4 }}>
        Ventas por Categoría
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => downloadPDF("http://localhost:3000/api/factura/informes/ventas/categorias/pdf")}>
          Descargar PDF
        </Button>
        <Button variant="contained" color="success" onClick={() => downloadExcel("http://localhost:3000/api/factura/informes/ventas/categorias/excel")}>
          Descargar Excel
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre Categoría</TableCell>
              <TableCell>Total Ventas</TableCell>
              <TableCell>Cantidad de Ventas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventasPorCategoria.map((venta, index) => (
              <TableRow key={index}>
                <TableCell>{venta.nombre}</TableCell>
                <TableCell>{venta.totalVentas}</TableCell>
                <TableCell>{venta.cantidadVentas}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
