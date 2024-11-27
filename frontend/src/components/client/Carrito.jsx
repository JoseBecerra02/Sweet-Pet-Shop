import React, { Suspense, useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Button, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const defaultImageUrl = 'https://via.placeholder.com/150';

function CollarModel({ color }) {
  const { scene, materials } = useGLTF(`${process.env.PUBLIC_URL}/assets/collar.glb`);

  useEffect(() => {
    if (materials) {
      const customizableMaterialNames = ["", "Dark Brown Leather", "metal"];
      customizableMaterialNames.forEach((materialName) => {
        if (materials[materialName]) {
          if (materialName === "") {
            materials[materialName].color = new THREE.Color(color);
          }
          materials[materialName].metalness = 0.5;
          materials[materialName].roughness = 0.4;
        }
      });
    }
  }, [color, materials]);

  return <primitive object={scene} scale={2} />;
}

export default function Carrito() {
  const [cartItems, setCartItems] = useState([]);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);

  
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
    
          // Fetch Cart Items using user._id from profileResponse
          const cartResponse = await axios.get(`http://localhost:3000/api/carrito/carrito/${fetchedUser._id}`, config);
          if (cartResponse.status === 200) {
            const fetchedCartItems = cartResponse.data.items || [];
    
            // Fetch all personalizations for the user
            const personalizationResponse = await axios.get(`http://localhost:3000/personalizacion/personalizaciones/usuario/${fetchedUser._id}`, config);
            let personalizaciones = [];
            if (personalizationResponse.status === 200) {
              personalizaciones = personalizationResponse.data.personalizaciones || [];
            }
    
            // Obtener la personalización específica para cada producto en el carrito si está personalizada
            const updatedCartItems = await Promise.all(
              fetchedCartItems.map(async (item) => {
                try {
                  // Buscar personalización específica del producto y del usuario
                  const productoPersonalizacion = personalizaciones.find(
                    (p) => p.productoId === item.id_producto
                  );
    
                  // Si se encontró una personalización para el producto en cuestión
                  if (productoPersonalizacion) {
                    return {
                      ...item,
                      opciones: productoPersonalizacion.opciones, // Añadimos la personalización si existe
                    };
                  }
    
                  // En caso de que no exista, hacemos la búsqueda específica
                  const individualPersonalizationResponse = await axios.get(
                    `http://localhost:3000/personalizacion/personalizacion/${item.id_producto}`,
                    config
                  );
    
                  if (individualPersonalizationResponse.status === 200) {
                    return {
                      ...item,
                      opciones: individualPersonalizationResponse.data.personalizacion.opciones, // Añadimos la personalización si existe
                    };
                  }
                } catch (error) {
                  console.error(
                    `Error al obtener la personalización del producto con ID ${item.id_producto}:`,
                    error
                  );
                }
                return item; // Si no hay personalización, retornamos el item sin cambios
              })
            );
    
            setCartItems(updatedCartItems);
          } else {
            console.error('Error al obtener el carrito:', cartResponse);
            setCartItems([]);
          }
        } else {
          console.error('Error al obtener el perfil del usuario:', profileResponse);
        }
      } catch (error) {
        console.error('Error al obtener el perfil o los productos del carrito:', error);
        setCartItems([]);
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

  // Función para crear la factura y orden 
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

        // Usar la URL correcta del endpoint para crear la factura
        const response = await axios.post('http://localhost:3000/api/factura/factura/crear', facturaData, config);

        if (response.status === 201) {
            console.log('Factura creada con éxito:', response.data);
            alert('Factura creada y enviada por correo.');
            
            // Crear datos para la orden
            const ordenData = {
                cliente: user._id,
                productos: cartItems.map(item => item.id_producto),
                total: totalCarrito,
                estado: 'pendiente', // Estado inicial de la orden
                subtotalesProductos: cartItems.map(item => item.precio_unitario * item.cantidad),
                observaciones: 'Orden creada a partir de la factura',
            };

            // Crear la orden en el backend
            const ordenResponse = await axios.post('http://localhost:3000/api/orden', ordenData, config);
            
            if (ordenResponse.status === 201) {
              console.log('Orden creada con éxito:', ordenResponse.data);
                // Eliminar las personalizaciones para los productos del carrito
                await Promise.all(cartItems.map(async (item) => {
                  try {
                    const deleteResponse = await axios.delete(`http://localhost:3000/personalizacion/personalizacion/eliminar/${item.id_producto}/${user._id}`, config);
                    if (deleteResponse.status === 200) {
                      console.log(`Personalización del producto con ID ${item.id_producto} eliminada con éxito`);
                    } else {
                      console.error(`Error al eliminar la personalización del producto con ID ${item.id_producto}`, deleteResponse);
                    }
                  } catch (error) {
                    console.error(`Error al eliminar la personalización del producto con ID ${item.id_producto}:`, error);
                  }
                }));              
            } else {
                console.error('Error al crear la orden:', ordenResponse);
            }

            setOpenInvoice(false);
            setCartItems([]); // Vacía el carrito después de crear la factura
        } else {
            console.error('Error al crear la factura:', response);
        }
    } catch (error) {
        console.error('Error al crear la factura o la orden:', error);
        alert('Hubo un error al crear la factura y la orden, por favor intenta nuevamente.');
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
                        {item.opciones && item.opciones.color ? (
                          <Box sx={{ height: 100, width: 100 }}>
                            <Canvas shadows camera={{ position: [0, 0, 10], fov: 35 }}>
                              <ambientLight intensity={1.5} />
                              <directionalLight position={[10, 10, 10]} intensity={2} castShadow />
                              <Suspense fallback={null}>
                                <CollarModel color={item.opciones.color} />
                              </Suspense>
                              <OrbitControls enableZoom={true} />
                            </Canvas>
                          </Box>
                        ) : (
                          <Avatar
                            variant="square"
                            src={getProductImage(item.id_producto)}
                            alt={item.nombre_producto}
                            sx={{ width: 100, height: 100 }}
                          />
                        )}
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
