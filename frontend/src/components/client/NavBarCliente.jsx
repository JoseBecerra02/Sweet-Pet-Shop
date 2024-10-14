import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import { ShoppingCart, Person, Home } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function NavBarCliente() {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#ffffff", color: "#2D2D2D" }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button component={Link} to="/catalogo" color="inherit" startIcon={<Home />}>
            Sweet Pet Shop
          </Button>
        </Box>
        <Button component={Link} to="/catalogo" color="inherit" startIcon={<Home />}>
          Catalog
        </Button>
        <Button component={Link} to="/carrito" color="inherit" startIcon={<ShoppingCart />}>
          Cart
        </Button>
        <IconButton component={Link} to="/perfil" color="inherit">
          <Person />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
