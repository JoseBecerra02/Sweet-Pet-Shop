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
} from '@mui/material';
import { Menu as MenuIcon, Home, ShoppingCart, Inventory, Person } from '@mui/icons-material';
import CatalogoCliente from './CatalogoCliente';
import Carrito from './Carrito';
import ProductoDetalle from './ProductoDetalle';
import HistorialPedidos from './HistorialPedidos';

export default function ClienteDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('catalogo');

  const toggleDrawer = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderSelectedSection = () => {
    switch (selectedSection) {
      case 'catalogo':
        return <CatalogoCliente />;
      case 'carrito':
        return <Carrito />;
      case 'historialPedidos':
        return <HistorialPedidos />;
      case 'perfil':
        return <ProductoDetalle />;
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
          <IconButton color="inherit">
            <Person />
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
              {sidebarOpen && <ListItemText primary="Catalog" />}
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('carrito')}>
              <ListItemIcon>
                <ShoppingCart />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Cart" />}
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('historialPedidos')}>
              <ListItemIcon>
                <Inventory />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Orders" />}
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('perfil')}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Profile" />}
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderSelectedSection()}
      </Box>
    </Box>
  );
}
