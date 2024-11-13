import React, { useState } from 'react';
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
  Box,
  CssBaseline,
  Button
} from '@mui/material';
import { Menu as MenuIcon, Home, ShoppingCart, Inventory, Person, Logout } from '@mui/icons-material';
import Cookies from 'js-cookie';
import CatalogoCliente from './CatalogoCliente';
import Carrito from './Carrito';
import ProductoDetalle from './ProductoDetalle';
import HistorialPedidos from './HistorialPedidos';
import Perfil from './Perfil'; 
import BannersCliente from './Banner';

export default function ClienteDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('catalogo');

    // Colores personalizados
    const colors = {
      primary: "#CA6DF2",
      secondary: "#B86AD9",
      textDark: "#2D2D2D",
      textLight: "#FFFFFF",
    };

  const toggleDrawer = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    Cookies.remove('token'); 
    Cookies.remove('rol'); 
    window.location.href = '/'; 
  };

  
  const banners = [
    { title: "Promoción Especial", content: "¡Aprovecha hasta 50% de descuento en productos seleccionados!" },
    { title: "Nuevo Producto", content: "Descubre nuestro nuevo producto para el cuidado de mascotas." },
    // Dummy banners
  ];

  const renderSelectedSection = () => {
    switch (selectedSection) {
      case 'catalogo':
        return <CatalogoCliente />;
      case 'carrito':
        return <Carrito />;
      case 'historialPedidos':
        return <HistorialPedidos />;
      case 'perfil':
        return <Perfil />; 
      default:
        return <CatalogoCliente />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Top AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#ffffff', color: '#2D2D2D' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sweet Pet Shop
          </Typography>
          <IconButton color="inherit" onClick={() => setSelectedSection('perfil')}>
            <Person />
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
            boxSizing: 'border-box',
            transition: 'width 0.3s',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button onClick={() => setSelectedSection('catalogo')}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Catálogo" />}
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('carrito')}>
              <ListItemIcon>
                <ShoppingCart />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Carrito" />}
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('historialPedidos')}>
              <ListItemIcon>
                <Inventory />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Órdenes" />}
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('perfil')}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Perfil" />}
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

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <BannersCliente banners={banners} colors={colors} />
        {renderSelectedSection()}
      </Box>
    </Box>
  );
}
