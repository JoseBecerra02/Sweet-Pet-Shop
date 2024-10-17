import React, { useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, CardActions, Button, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions as DialogAction } from '@mui/material';

const defaultImageUrl = 'https://img.freepik.com/foto-gratis/perro-lindo-arte-digital_23-2151150544.jpg';

const products = [
  { id: 1, name: 'Comida para Perros', price: 20, description: 'Comida nutritiva para perros', imageUrl: '', category: 'Comida' },
  { id: 2, name: 'Juguete para Gatos', price: 10, description: 'Juguete divertido para gatos', imageUrl: '', category: 'Juguetes' },
  { id: 3, name: 'Jaula para Pájaros', price: 50, description: 'Jaula espaciosa para pájaros', imageUrl: '', category: 'Accesorios' },
  { id: 4, name: 'Correa para Perros', price: 15, description: 'Correa duradera para pasear a tu perro', imageUrl: '', category: 'Accesorios' },
  { id: 5, name: 'Comida para Peces', price: 8, description: 'Comida nutritiva para tus peces', imageUrl: '', category: 'Comida' },
  { id: 6, name: 'Rueda para Hámster', price: 25, description: 'Rueda de ejercicio para hámsters', imageUrl: '', category: 'Juguetes' },
  { id: 7, name: 'Cama para Gatos', price: 30, description: 'Cama cómoda para tu gato', imageUrl: '', category: 'Mobiliario' },
  { id: 8, name: 'Casa para Conejos', price: 120, description: 'Casa espaciosa para conejos', imageUrl: '', category: 'Mobiliario' },
];

function ProductDetailsModal({ open, onClose, product }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product.name}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <img src={product.imageUrl || defaultImageUrl} alt={product.name} style={{ width: '100%', height: 'auto' }} />
          <Typography variant="h6">Precio: ${product.price}</Typography>
          <Typography variant="body1">{product.description}</Typography>
          <Typography variant="body2" color="textSecondary">Categoría: {product.category}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogAction>
        <Button onClick={onClose} color="primary">Cerrar</Button>
      </DialogAction>
    </Dialog>
  );
}

export default function CatalogoCliente() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={product.imageUrl || defaultImageUrl} // Utiliza la imagen por defecto si no hay URL
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h5">{product.name}</Typography>
                <Typography variant="subtitle1">${product.price}</Typography>
                <Typography variant="body2" color="textSecondary">{product.description}</Typography>
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
