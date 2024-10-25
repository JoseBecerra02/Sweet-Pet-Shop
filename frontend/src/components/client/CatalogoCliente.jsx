import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, CardActions, Button, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions as DialogAction } from '@mui/material';
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
    axios.get('http://localhost:3000/api/inventario/productos')  // Ajusta la URL según tu servidor
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

  return (
    <Box sx={{ padding: 3, marginTop: -3 }}>
      <Typography variant="h4" gutterBottom>Catálogo de Productos</Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={product.ruta || defaultImageUrl} // Mostrar imagen del producto
                alt={product.nombre_producto}
              />
              <CardContent>
                <Typography variant="h5">{product.nombre_producto}</Typography>
                <Typography variant="subtitle1">${product.precio}</Typography>
                <Typography variant="body2" color="textSecondary">{product.descripcion}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="contained" color="primary" onClick={() => handleOpenDialog(product)}>Ver Detalles</Button>
                <Button size="small" variant="contained" color="secondary">Agregar al Carrito</Button>
              </CardActions>
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
