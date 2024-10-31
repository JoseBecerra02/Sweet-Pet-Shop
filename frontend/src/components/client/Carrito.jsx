import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Button, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';
import Cookies from 'js-cookie';
import axios from 'axios';

const defaultImageUrl = 'https://via.placeholder.com/150';

export default function Carrito() {
  const [cartItems, setCartItems] = useState([]);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);

  // Obtener los datos del perfil del cliente y luego los productos del carrito
  useEffect(() => {
    const fetchProfileAndCartItems = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          console.error('Token no encontrado');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        };

        // Fetch User Profile
        const profileResponse = await axios.get('http://localhost:3000/api/usuarios/perfil', config);
        if (profileResponse.status === 200) {
          const fetchedUser = profileResponse.data.user;
          setUser(fetchedUser);
          console.log('Perfil del cliente:', fetchedUser);

          // Fetch Cart Items using user._id from profileResponse
          const cartResponse = await axios.get(`http://localhost:3000/api/carrito/carrito/${fetchedUser._id}`, config);
          if (cartResponse.status === 200) {
            setCartItems(cartResponse.data.items || []); // Asegurar que siempre se asigna un array
          } else {
            console.error('Error al obtener el carrito:', cartResponse);
            setCartItems([]); // Si hay error, asegúrate de que cartItems sea un array vacío
          }
        } else {
          console.error('Error al obtener el perfil del usuario:', profileResponse);
        }
      } catch (error) {
        console.error('Error al obtener el perfil o los productos del carrito:', error);
        setCartItems([]); // Si hay error, asegúrate de que cartItems sea un array vacío
      }
    };

    fetchProfileAndCartItems();
  }, []);

  useEffect(() => {
    console.log("Items del carrito después de ser actualizados:", cartItems);
  }, [cartItems]);
  

  // Obtener los detalles de los productos para las imágenes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/inventario/productos');
        if (response.status === 200) {
          setProducts(response.data);
        } else {
          console.error('Error al obtener los productos:', response);
        }
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProducts();
  }, []);

  // Buscar la imagen del producto por su ID
  const getProductImage = (productId) => {
    const product = products.find((prod) => prod._id === productId);
    return product ? product.ruta : defaultImageUrl;
  };

  // Actualizar la cantidad de un producto en el carrito en el backend
  const handleUpdateQuantity = async (productId, action) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        console.error('Token no encontrado');
        return;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };
  
      const updateData = {
        id_usuario: user._id,
        id_producto: productId,
        action: action, // 'increment' o 'decrement'
      };
  
      const response = await axios.put('http://localhost:3000/api/carrito/carrito/actualizar', updateData, config);
  
      if (response.status === 200) {
        console.log('Cantidad actualizada con éxito:', response.data);
        
        if (response.data.item) {
          setCartItems(prevItems =>
            prevItems.map(item =>
              item.id_producto === response.data.item.producto
                ? {
                    ...item,
                    cantidad: response.data.item.cantidad, // Actualiza la cantidad con el valor nuevo
                  }
                : item
            )
          );
        } else {
          console.error('La respuesta de la API no contiene el item actualizado');
        }
      } else {
        console.error('Error al actualizar la cantidad:', response);
      }
    } catch (error) {
      console.error('Error al actualizar la cantidad del producto en el carrito:', error);
    }
  };
  

  useEffect(() => {
    if (Array.isArray(cartItems)) {
      console.log("Items del carrito después de ser actualizados:", cartItems);
    } else {
      console.error('cartItems no es un array:', cartItems);
    }
  }, [cartItems]);
  
  

  const handleIncreaseQuantity = (productId) => {
    handleUpdateQuantity(productId, 'increment');
  };

  const handleDecreaseQuantity = (productId) => {
    handleUpdateQuantity(productId, 'decrement');
  };

  // Eliminar un producto del carrito en el backend
  const handleRemoveFromCart = async (productId) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        console.error('Token no encontrado');
        return;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };
  
      const response = await axios.delete(`http://localhost:3000/api/carrito/carrito/eliminar/${productId}`, {
        headers: config.headers,
        data: { id_usuario: user._id },
      });
  
      if (response.status === 200) {
        console.log('Producto eliminado del carrito con éxito:', response.data);
        
        // Actualiza el estado eliminando el producto correspondiente
        setCartItems(prevItems => prevItems.filter(item => item.id_producto !== productId));
      } else {
        console.error('Error al eliminar el producto del carrito:', response);
      }
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
    }
  };
  

  // Calcular el total del carrito
  const totalCarrito = cartItems.reduce((total, item) => total + item.precio_unitario * item.cantidad, 0);

  // Función para abrir la factura
  const handleOpenInvoice = () => {
    setOpenInvoice(true);
  };

  // Función para cerrar la factura
  const handleCloseInvoice = () => {
    setOpenInvoice(false);
  };

  // Función para crear la factura
  const handleCreateInvoice = async () => {
    try {
        const token = Cookies.get('token');
        if (!token) {
            console.error('Token no encontrado');
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        };

      // Crear los datos para la factura
      const facturaData = {
        id_usuario: user._id,
        id_correo: user.correo,
        id_nombre: user.nombre,
        productos: cartItems.map(item => ({
          id_producto: item.id_producto,
          nombre_producto: item.nombre_producto,
          precio_unitario: item.precio_unitario,
          cantidad: item.cantidad,
          subtotal: item.precio_unitario * item.cantidad, // Calcular el subtotal correctamente
        })),
        valor_total: totalCarrito,
      };

      // Usar la URL correcta del endpoint
      const response = await axios.post('http://localhost:3000/api/factura/factura/crear', facturaData, config);

        if (response.status === 201) {
            console.log('Factura creada con éxito:', response.data);
            setOpenInvoice(false);
            alert('Factura creada y enviada por correo.');
            setCartItems([]); // Vacía el carrito después de crear la factura
        } else {
            console.error('Error al crear la factura:', response);
        }
    } catch (error) {
        console.error('Error al crear la factura:', error);
        alert('Hubo un error al crear la factura, por favor intenta nuevamente.');
    }
};


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
              {cartItems.map((item) => {
                if (!item || !item.id_producto) {
                  console.error('Producto no encontrado en el item:', item);
                  return null; // Omite la renderización si no se encuentra el producto
                }

                return (
                  <ListItem key={item.id_producto} sx={{ backgroundColor: '#F2F2F2', borderRadius: '15px', mb: 3, padding: 2, boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} sm={2} md={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                        <ListItemAvatar>
                          <Avatar
                            variant="square"
                            src={getProductImage(item.id_producto)}
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
                              <Typography variant="body2" sx={{ mb: 0.5 }}>Cantidad: {item.cantidad}</Typography>
                              <Typography variant="body2" sx={{ color: '#B86AD9', fontWeight: 'bold' }}>
                                Total: ${item.precio_unitario * item.cantidad}
                              </Typography>
                            </>
                          }
                        />
                      </Grid>

                      {/* Botones para aumentar/disminuir cantidad */}
                      <Grid item xs={12} sm={5} md={4} sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton onClick={() => handleIncreaseQuantity(item.id_producto)} sx={{ backgroundColor: '#CA6DF2', color: 'white', '&:hover': { backgroundColor: '#A55BC0' }, marginRight: 1 }}>
                            <Add />
                          </IconButton>
                          <Typography variant="body1" component="span" sx={{ fontWeight: 'bold', mx: 1 }}>
                            {item.cantidad}
                          </Typography>
                          <IconButton
                            onClick={() => handleDecreaseQuantity(item.id_producto)}
                            sx={{ backgroundColor: '#F2F2F2', color: '#2D2D2D', '&:hover': { backgroundColor: '#e0e0e0' }, marginLeft: 1 }}
                            disabled={item.cantidad === 1}
                          >
                            <Remove />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveFromCart(item.id_producto)}
                            sx={{ color: '#B86AD9', marginLeft: 2 }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </ListItem>
                );
              })}
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
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Total: ${totalCarrito.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#B86AD9', color: 'white', padding: '15px', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', width: '100%', '&:hover': { backgroundColor: '#A55BC0' } }}
              onClick={handleOpenInvoice}
            >
              PROCEDER AL PAGO
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal para mostrar la factura */}
      <Dialog open={openInvoice} onClose={handleCloseInvoice} maxWidth="md" fullWidth>
  <DialogTitle sx={{ 
      textAlign: 'center', 
      fontWeight: 'bold', 
      fontSize: '1.5rem', 
      backgroundColor: '#f5f5f5', 
      color: '#CA6DF2',  // Color para el título
      borderBottom: `2px solid #CA6DF2` 
  }}>
    Factura
  </DialogTitle>
  <DialogContent sx={{ padding: 4, backgroundColor: '#fbfbfb' }}>
    <Box sx={{ 
        borderBottom: `2px solid #CA6DF2`, 
        paddingBottom: 2, 
        marginBottom: 3 
    }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#CA6DF2', marginBottom: 1 }}>
        Cliente: {user.nombre || 'Nombre del Cliente'}
      </Typography>
      <Typography variant="body1">Dirección: {user.direccion || 'Sin dirección'}</Typography>
      <Typography variant="body1">Ciudad: {user.ciudad || 'Sin ciudad'}</Typography>
      <Typography variant="body1">Teléfono: {user.telefono || 'Sin teléfono'}</Typography>
      <Typography variant="body1" sx={{ marginTop: 1 }}>
        Fecha: {new Date().toLocaleDateString()}
      </Typography>
    </Box>

    <Box sx={{ 
        marginTop: 3, 
        border: `1px solid #CA6DF2`, 
        borderRadius: 1, 
        padding: 2, 
        backgroundColor: '#fff' 
    }}>
      <List disablePadding>
        {cartItems.map((item, index) => (
          <ListItem key={item.id_producto} sx={{ padding: 1, borderBottom: '1px solid #e0e0e0' }}>
            <ListItemText
              primary={<Typography sx={{ fontWeight: 'bold', color: '#CA6DF2' }}>{`${index + 1}. ${item.nombre_producto}`}</Typography>}
              secondary={
                <Typography variant="body2" color="textSecondary">
                  {`Cantidad: ${item.cantidad} - Precio Unitario: $${item.precio_unitario.toFixed(2)} - Total: $${(item.precio_unitario * item.cantidad).toFixed(2)}`}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>

    <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'right', color: '#CA6DF2', marginTop: 3 }}>
      Total Factura: ${totalCarrito.toFixed(2)}
    </Typography>
  </DialogContent>
  <DialogActions sx={{ padding: 2, backgroundColor: '#f5f5f5', borderTop: `2px solid #CA6DF2` }}>
    <Button onClick={handleCreateInvoice} variant="contained" sx={{ backgroundColor: '#CA6DF2', color: 'white', fontWeight: 'bold' }}>
      Aceptar
    </Button>
  </DialogActions>
</Dialog>
</Box>
  );
}
