import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  Card,
  CardContent,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { Menu as MenuIcon, Notifications, Home, People, Inventory, ShoppingCart, Settings, Logout, Assignment, Edit, Save } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from 'axios';

const estadoOpciones = ['bodega', 'reparto', 'entregado', 'pendiente', 'cancelado'];

export default function Orders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ordenes, setOrdenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [editMode, setEditMode] = useState(null); // Estado para rastrear cuál orden está en modo edición
  const [estadoTemporal, setEstadoTemporal] = useState(''); // Estado temporal para el estado seleccionado en modo edición
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    Cookies.remove('token'); 
    Cookies.remove('rol'); 
    window.location.href = '/'; 
  };

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/orden'); 
        setOrdenes(response.data);
      } catch (error) {
        console.error('Error al obtener órdenes:', error);
      }
    };

    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/inventario/productos');
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
    setEditMode(ordenId); // Activa el modo edición para esta orden
    setEstadoTemporal(estadoActual); // Guarda el estado actual temporalmente
  };

  const handleSaveClick = async (ordenId) => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/orden/estado/${ordenId}`, { estado: estadoTemporal });
      setOrdenes(prevOrdenes =>
        prevOrdenes.map(orden =>
          orden.id_orden === ordenId ? { ...orden, estado: response.data.estado } : orden
        )
      );
      setEditMode(null); // Salir del modo edición
    } catch (error) {
      console.error('Error al actualizar el estado de la orden:', error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 7 }}>
        <Toolbar sx={{ pt: 0, pb: 4 }}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Gestión de Órdenes
          </Typography>
        </Toolbar>
        <Grid container spacing={3}>
          {ordenes.map((orden) => (
            <Grid item xs={12} sm={6} md={4} key={orden.id_orden}>
              <Card sx={{ height: "100%", mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1">Orden ID: {orden.id_orden}</Typography>
                  <Typography variant="body1" color="#CA6DF2"><strong>Estado:</strong></Typography>
                  {editMode === orden.id_orden ? (
                    <>
                      <Select
                        value={estadoTemporal}
                        onChange={(e) => setEstadoTemporal(e.target.value)}
                        fullWidth
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
                      <Typography variant="body1" style={{ color: 'black' }}>{orden.estado}</Typography>
                      <IconButton color="primary" onClick={() => handleEditClick(orden.id_orden, orden.estado)}>
                        <Edit />
                      </IconButton>
                    </>
                  )}
                  <Typography variant="body1"><strong>Cliente:</strong> {orden.cliente?.nombre || 'Desconocido'}</Typography>
                  <Typography variant="body1"><strong>Total:</strong> ${orden.total}</Typography>
                  <Typography variant="body1"><strong>Observaciones:</strong> {orden.observaciones || 'N/A'}</Typography>
                  <Typography variant="body2" color="#CA6DF2"><strong>Productos:</strong></Typography>
                  <ul>
                    {orden.productos.map((productoId) => (
                      <li key={productoId}>{productosMap.get(productoId) || 'Producto no encontrado'}</li>
                    ))}
                  </ul>
                  <Typography variant="body2"><strong>Subtotales:</strong> ${orden.subtotalesProductos.join(', $')}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
