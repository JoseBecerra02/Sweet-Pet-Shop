import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions as DialogAction, Button, IconButton } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import axios from 'axios';

const defaultImageUrl = 'https://img.freepik.com/foto-gratis/perro-lindo-arte-digital_23-2151150544.jpg';

function ProductDetailsModal({ open, onClose, product }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product.nombre_producto}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <img src={product.ruta || defaultImageUrl} alt={product.nombre_producto} style={{ width: '100%', height: 'auto' }} />
          <Typography variant="h6">Precio: ${product.precio}</Typography>
          <Typography variant="body1">{product.descripcion}</Typography>
          <Typography variant="body2" color="textSecondary">Categoría: {product.categoria.nombre}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogAction>
        <Button onClick={onClose} color="primary">Cerrar</Button>
      </DialogAction>
    </Dialog>
  );
}

export default function CatalogoCliente() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Obtener productos del backend
  useEffect(() => {
    axios.get('http://localhost:3000/api/inventario/productos')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
      });
  }, []);

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find((item) => item.id === product._id);
    if (existingItem) {
      cart = cart.map((item) =>
        item.id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      cart.push({ ...product, id: product._id, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  return (
    <Box sx={{ padding: 3, marginTop: -3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#CA6DF2', textAlign: 'center', marginBottom: '40px', fontWeight: 'bold' }}>
        Catálogo de Productos
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card
              onClick={() => handleOpenDialog(product)}
              sx={{ cursor: 'pointer', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}
            >
              <CardMedia
                component="img"
                height="300"
                image={product.ruta || defaultImageUrl}
                alt={product.nombre_producto}
              />
              <CardContent>
                <Typography variant="h5" sx={{ color: '#2D2D2D', fontWeight: 'bold' }}>{product.nombre_producto}</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>{product.descripcion}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#B86AD9', fontWeight: 'bold' }}>${product.precio.toFixed(2)}</Typography>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                    sx={{ backgroundColor: '#B86AD9', '&:hover': { backgroundColor: '#A55BC0' }, display: 'flex', alignItems: 'center' }}
                  >
                    <ShoppingCart sx={{ marginRight: 1 }} />
                    Agregar al Carrito
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedProduct && (
        <ProductDetailsModal
          open={dialogOpen}
          onClose={handleCloseDialog}
          product={selectedProduct}
        />
      )}
    </Box>
  );
}
