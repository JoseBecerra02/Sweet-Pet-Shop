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
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import PetsIcon from "@mui/icons-material/Pets";

// Definimos colores personalizados
const colors = {
  primary: "#CA6DF2",
  secondary: "#B86AD9",
  textDark: "#2D2D2D",
  textLight: "#FFFFFF",
};

// Estilos personalizados con styled
const CustomCard = styled(Card)(({ theme }) => ({
  backgroundColor: colors.textLight,
  color: colors.textDark,
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
  border: `2px solid ${colors.primary}`,
}));

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: colors.primary,
  color: colors.textLight,
  fontWeight: 'bold',
  textTransform: 'none',
  fontSize: '16px',
  padding: '10px 20px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: colors.secondary,
  },
}));

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
        <Typography variant="h4" gutterBottom sx={{ marginTop: '50px', color: colors.textDark, fontWeight: 'bold' }}>
          Informes de Administración
        </Typography>
      </Toolbar>
      {/* Tarjetas de Resumen */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <CustomCard>
            <IconButton sx={{ color: colors.primary }}>
              <PetsIcon />
            </IconButton>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total Ventas Mensuales</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.secondary }}>{ventasMensuales.length}</Typography>
            </CardContent>
          </CustomCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomCard>
            <IconButton sx={{ color: colors.primary }}>
              <PetsIcon />
            </IconButton>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Ventas por Usuario</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.secondary }}>{ventasPorUsuario.length}</Typography>
            </CardContent>
          </CustomCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomCard>
            <IconButton sx={{ color: colors.primary }}>
              <PetsIcon />
            </IconButton>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Ventas por Categoría</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.secondary }}>{ventasPorCategoria.length}</Typography>
            </CardContent>
          </CustomCard>
        </Grid>
      </Grid>

      {/* Sección de Ventas Mensuales */}
      <Typography variant="h5" sx={{ mt: 4, color: colors.textDark, fontWeight: 'bold' }}>
        Ventas Mensuales
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <CustomButton onClick={() => downloadPDF("http://localhost:3000/api/factura/informes/ventas/mensual/pdf")}>Descargar PDF</CustomButton>
        <CustomButton onClick={() => downloadExcel("http://localhost:3000/api/factura/informes/ventas/mensual/excel")}>Descargar Excel</CustomButton>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: colors.textDark, fontWeight: 'bold' }}>Mes/Año</TableCell>
              <TableCell style={{ color: colors.textDark, fontWeight: 'bold' }}>Total Ventas</TableCell>
              <TableCell style={{ color: colors.textDark, fontWeight: 'bold' }}>Cantidad de Ventas</TableCell>
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
      <Typography variant="h5" sx={{ mt: 4, color: colors.textDark, fontWeight: 'bold' }}>
        Ventas por Usuario
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <CustomButton onClick={() => downloadPDF("http://localhost:3000/api/factura/informes/ventas/usuarios/pdf")}>Descargar PDF</CustomButton>
        <CustomButton onClick={() => downloadExcel("http://localhost:3000/api/factura/informes/ventas/usuarios/excel")}>Descargar Excel</CustomButton>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: colors.textDark, fontWeight: 'bold' }}>Nombre Usuario</TableCell>
              <TableCell style={{ color: colors.textDark, fontWeight: 'bold' }}>Correo</TableCell>
              <TableCell style={{ color: colors.textDark, fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell style={{ color: colors.textDark, fontWeight: 'bold' }}>Total Ventas</TableCell>
              <TableCell style={{ color: colors.textDark, fontWeight: 'bold' }}>Cantidad de Ventas</TableCell>
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
      <Typography variant="h5" sx={{ mt: 4, color: colors.textDark, fontWeight: 'bold' }}>
        Ventas por Categoría
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <CustomButton onClick={() => downloadPDF("http://localhost:3000/api/factura/informes/ventas/categorias/pdf")}>Descargar PDF</CustomButton>
        <CustomButton onClick={() => downloadExcel("http://localhost:3000/api/factura/informes/ventas/categorias/excel")}>Descargar Excel</CustomButton>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: colors.textDark, fontWeight: 'bold' }}>Nombre Categoría</TableCell>
              <TableCell style={{ color: colors.textDark, fontWeight: 'bold' }}>Total Ventas</TableCell>
              <TableCell style={{ color: colors.textDark, fontWeight: 'bold' }}>Cantidad de Ventas</TableCell>
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
