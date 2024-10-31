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
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { Menu as MenuIcon, Notifications, Home, People, Inventory, ShoppingCart, Settings, Logout, Assignment } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from 'axios';


export default function Orders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    Cookies.remove('token'); 
    Cookies.remove('rol'); 
    window.location.href = '/'; 
  };

  const [ordenes, setOrdenes] = useState([]);
  const [productos, setProductos] = useState([]);

  
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

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Top AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#ffffff", color: "#2D2D2D" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Órdenes
          </Typography>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={sidebarOpen}
        sx={{
          width: sidebarOpen ? 240 : 72,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: sidebarOpen ? 240 : 72,
            boxSizing: "border-box",
            transition: "width 0.3s",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem button onClick={() => handleNavigation("/")}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Inicio" />}
            </ListItem>

            <ListItem button onClick={() => handleNavigation("/users")}>
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Usuarios" />}
            </ListItem>

            <ListItem button onClick={() => handleNavigation("/users")}>
              <ListItemIcon>
                <People />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Usuarios" />}
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/catalogAdmin")}>
              <ListItemIcon>
                <Inventory />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Catálogo" />}
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/orders")}>
              <ListItemIcon>
                <ShoppingCart />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Órdenes" />}
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/settings")}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Configuración" />}
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Cerrar Sesión" />}
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 10 }}>
      <Grid container spacing={3}>
        {ordenes.map((orden) => (
          <Grid item xs={12} sm={6} md={4} key={orden.id_orden}>
            <Card sx={{ height: "100%", mb: 2  }}>
              <CardContent>
                <Typography variant="subtitle1">Orden ID: {orden.id_orden}</Typography>
                <Typography variant="body1" color="#CA6DF2"><strong>Estado:</strong> <span style={{ color: 'black' }}>{orden.estado}</span> </Typography>
                <Typography variant="body1"><strong>Cliente:</strong> {orden.cliente?.nombre || 'Desconocido'}</Typography> {/* Asegúrate de tener el campo correcto */}
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
