import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Button, Grid, Paper } from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';

export default function Carrito() {
  const [cartItems, setCartItems] = useState([]);

  // Leer el carrito desde localStorage al montar el componente
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, []);

  // Actualizar el carrito en localStorage
  const updateLocalStorage = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Aumentar la cantidad de un producto
  const handleIncreaseQuantity = (productId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateLocalStorage(updatedCart);
  };

  // Disminuir la cantidad de un producto
  const handleDecreaseQuantity = (productId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    updateLocalStorage(updatedCart);
  };

  // Eliminar un producto del carrito
  const handleRemoveFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    updateLocalStorage(updatedCart);
  };

  // Calcular el total del carrito
  const totalCarrito = cartItems.reduce((total, item) => total + item.precio * item.quantity, 0);

  return (
    <Box sx={{ padding: 3, marginTop: -1 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#CA6DF2', textAlign: 'center', marginBottom: '40px', fontWeight: 'bold' }}>
        Carrito de Compras
      </Typography>
      <Grid container spacing={3}>
        {/* Lista de productos en el carrito */}
        <Grid item xs={12} md={8}>
          {cartItems.length === 0 ? (
            <Typography variant="h6" sx={{ textAlign: 'center' }}>El carrito está vacío</Typography>
          ) : (
            <List>
              {cartItems.map((item) => (
                <ListItem key={item.id} sx={{ backgroundColor: '#F2F2F2', borderRadius: '15px', mb: 3, padding: 2, boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}>
                  <Grid container alignItems="center" spacing={2}>
                    {/* Imagen del producto */}
                    <Grid item xs={12} sm={2} md={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                      <ListItemAvatar>
                        <Avatar
                          variant="square"
                          src={item.ruta || 'https://via.placeholder.com/150'}
                          alt={item.nombre_producto}
                          sx={{ width: 100, height: 100, borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                        />
                      </ListItemAvatar>
                    </Grid>

                    {/* Información del producto */}
                    <Grid item xs={12} sm={5} md={6} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                      <ListItemText
                        primary={<Typography variant="h6" sx={{ color: '#2D2D2D', fontWeight: 'bold' }}>{item.nombre_producto}</Typography>}
                        secondary={
                          <>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>Cantidad: {item.quantity}</Typography>
                            <Typography variant="body2" sx={{ color: '#B86AD9', fontWeight: 'bold' }}>
                              Total: ${item.precio * item.quantity}
                            </Typography>
                          </>
                        }
                      />
                    </Grid>

                    {/* Botones para aumentar/disminuir cantidad */}
                    <Grid item xs={12} sm={5} md={4} sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => handleIncreaseQuantity(item.id)} sx={{ backgroundColor: '#CA6DF2', color: 'white', '&:hover': { backgroundColor: '#A55BC0' }, marginRight: 1 }}>
                          <Add />
                        </IconButton>
                        <Typography variant="body1" component="span" sx={{ fontWeight: 'bold', mx: 1 }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          onClick={() => handleDecreaseQuantity(item.id)}
                          sx={{ backgroundColor: '#F2F2F2', color: '#2D2D2D', '&:hover': { backgroundColor: '#e0e0e0' }, marginLeft: 1 }}
                          disabled={item.quantity === 1}
                        >
                          <Remove />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveFromCart(item.id)}
                          sx={{ color: '#B86AD9', marginLeft: 2 }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </List>
          )}
        </Grid>

        {/* Resumen del carrito y botón de proceder al pago */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h5" sx={{ color: '#CA6DF2', fontWeight: 'bold', marginBottom: 2 }}>
              Resumen de Compra
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              Productos ({cartItems.length}): ${totalCarrito.toFixed(2)}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 3 }}>
              Envío: ....
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Total: ${totalCarrito.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#B86AD9', color: 'white', padding: '15px', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', width: '100%', '&:hover': { backgroundColor: '#A55BC0' } }}
            >
              PROCEDER AL PAGO
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
