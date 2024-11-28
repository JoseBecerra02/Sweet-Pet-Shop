import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Grid,
} from "@mui/material";
import { Edit, Save } from "@mui/icons-material";
import { styled } from "@mui/system";
import axios from 'axios';

// Definimos colores personalizados
const colors = {
  primary: "#CA6DF2",
  secondary: "#B86AD9",
  textDark: "#2D2D2D",
  textLight: "#FFFFFF",
};

// Estilos personalizados con styled
const CustomCard = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
  height: "100%",
  '&:hover': {
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
  },
}));

export default function Orders() {
  const [ordenes, setOrdenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [estadoTemporal, setEstadoTemporal] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const estadoOpciones = ['bodega', 'reparto', 'entregado', 'pendiente', 'cancelado'];

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const response = await axios.get('https://sweet-pet-shop-production.up.railway.app/api/orden'); 
        setOrdenes(response.data);
      } catch (error) {
        console.error('Error al obtener órdenes:', error);
      }
    };

    const fetchProductos = async () => {
      try {
        const response = await axios.get('https://sweet-pet-shop-production.up.railway.app/api/inventario/productos');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    fetchOrdenes();
    fetchProductos();
  }, []);

  const productosMap = new Map(productos.map(producto => [producto._id, producto.nombre_producto]));

  const handleEditClick = (ordenId, estadoActual) => {
    setEditMode(ordenId);
    setEstadoTemporal(estadoActual);
  };

  const handleSaveClick = async (ordenId) => {
    try {
      const response = await axios.patch(`https://sweet-pet-shop-production.up.railway.app/api/orden/estado/${ordenId}`, { estado: estadoTemporal });
      setOrdenes(prevOrdenes =>
        prevOrdenes.map(orden =>
          orden.id_orden === ordenId ? { ...orden, estado: response.data.estado } : orden
        )
      );
      setEditMode(null);
    } catch (error) {
      console.error('Error al actualizar el estado de la orden:', error);
    }
  };

  const handleFiltroEstadoChange = (event) => {
    setFiltroEstado(event.target.value);
  };

  const ordenesFiltradas = filtroEstado
    ? ordenes.filter((orden) => orden.estado === filtroEstado)
    : ordenes;

  return (
    <Box sx={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 7 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: colors.textDark }}>
          Gestión de Órdenes
        </Typography>
        <Select
          value={filtroEstado}
          onChange={handleFiltroEstadoChange}
          displayEmpty
          sx={{
            minWidth: 200,
            mb: 3,
            bgcolor: colors.primary,
            color: colors.textLight,
            '& .MuiSelect-icon': { color: colors.textLight },
          }}
        >
          <MenuItem value="">
            <em>Todos los Estados</em>
          </MenuItem>
          {estadoOpciones.map((estado) => (
            <MenuItem key={estado} value={estado}>
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </MenuItem>
          ))}
        </Select>
        <Grid container spacing={3}>
          {ordenesFiltradas.map((orden) => (
            <Grid item xs={12} sm={6} md={4} key={orden.id_orden}>
              <CustomCard>
                <CardContent>
                  <Typography variant="h6" sx={{ color: colors.primary, fontWeight: 'bold' }}>
                    Orden ID: {orden.id_orden}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body1" sx={{ color: colors.textDark, mr: 1 }}>
                      <strong>Estado:</strong>
                    </Typography>
                    {editMode === orden.id_orden ? (
                      <>
                        <Select
                          value={estadoTemporal}
                          onChange={(e) => setEstadoTemporal(e.target.value)}
                          fullWidth
                          sx={{ mb: 2 }}
                        >
                          {estadoOpciones.map((estado) => (
                            <MenuItem key={estado} value={estado}>
                              {estado.charAt(0).toUpperCase() + estado.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                        <IconButton color="primary" onClick={() => handleSaveClick(orden.id_orden)}>
                          <Save />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <Typography variant="body1" sx={{ color: colors.secondary, mr: 1 }}>
                          {orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}
                        </Typography>
                        <IconButton color="primary" onClick={() => handleEditClick(orden.id_orden, orden.estado)}>
                          <Edit />
                        </IconButton>
                      </>
                    )}
                  </Box>
                  <Typography variant="body1" sx={{ color: colors.textDark, mt: 1 }}>
                    <strong>Cliente:</strong> {orden.cliente?.nombre || 'Desconocido'}
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.textDark }}>
                    <strong>Total:</strong> ${orden.total}
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.textDark }}>
                    <strong>Observaciones:</strong> {orden.observaciones || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.primary, mt: 2 }}>
                    <strong>Productos:</strong>
                  </Typography>
                  <ul>
                    {orden.productos.map((productoId) => (
                      <li key={productoId}>{productosMap.get(productoId) || 'Producto no encontrado'}</li>
                    ))}
                  </ul>
                  <Typography variant="body2" sx={{ color: colors.textDark, mt: 2 }}>
                    <strong>Subtotales:</strong> ${orden.subtotalesProductos.join(', $')}
                  </Typography>
                </CardContent>
              </CustomCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
