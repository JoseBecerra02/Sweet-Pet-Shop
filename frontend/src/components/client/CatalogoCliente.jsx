import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Snackbar, Alert } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { TextField } from '@mui/material';
import { InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

const defaultImageUrl = 'https://img.freepik.com/foto-gratis/perro-lindo-arte-digital_23-2151150544.jpg';

function ProductDetailsModal({ open, onClose, product }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#CA6DF2', color: '#F2F2F2' }}>{product.nombre_producto}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <img src={product.ruta || defaultImageUrl} alt={product.nombre_producto} style={{ width: '100%', height: 'auto' }} />
          <Typography variant="h6">Precio: ${product.precio ? product.precio.toFixed(2) : 'N/A'}</Typography>
          <Typography variant="body1">{product.descripcion}</Typography>
          <Typography variant="body2" color="textSecondary">Categoría: {product.categoriaNombre}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#CA6DF2' }}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function CatalogoCliente() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [user, setUser] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/categoria')
      .then(response => {
        const categoriesData = response.data.map(category => ({
          _id: category._id.$oid || category._id,
          nombre: category.nombre
        }));
        setCategories(categoriesData);
      })
      .catch(error => {
        console.error('Error al obtener categorías:', error);
      });
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      axios.get('http://localhost:3000/api/inventario/productos')
        .then(response => {
          const productsWithCategoryNames = response.data.map(product => {
            const category = categories.find(cat => cat._id === (product.categoria.$oid || product.categoria));
            return {
              ...product,
              categoriaNombre: category ? category.nombre : 'Sin Categoría'
            };
          });
          setProducts(productsWithCategoryNames);
          setFilteredProducts(productsWithCategoryNames);
        })
        .catch(error => {
          console.error('Error al obtener los productos:', error);
        });
    }
  }, [categories]);

  useEffect(() => {
    const fetchProfile = async () => {
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
  
        const response = await axios.get('http://localhost:3000/api/usuarios/perfil', config);
        setUser(response.data.user);
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
      }
    };
  
    fetchProfile();
  }, []);
  
  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = async (product) => {
      try {
          const token = Cookies.get('token');
          if (!token) {
              console.error('Token no encontrado');
              alert('Por favor, inicia sesión para agregar productos al carrito.');
              return;
          }

          const config = {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
          };

          // Datos del carrito para enviar al backend
          const carritoData = {
              id_usuario: user._id,
              id_producto: product._id,
              cantidad: 1,
          };

          const response = await axios.post('http://localhost:3000/api/carrito/carrito/agregar', carritoData, config);
          if (response.status === 200) {
              console.log('Producto agregado al carrito con éxito:', response.data);
              setSnackbarOpen(true);
          } else {
              console.error('Error al agregar el producto al carrito:', response);
          }
      } catch (error) {
          if (error.response && error.response.status === 404) {
              console.error('Error 404: Endpoint no encontrado. Verifica la URL.');
          } else {
              console.error('Error al agregar el producto al carrito:', error.message);
          }
      }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCategoryChange = (categoryId) => {
    const updatedSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(updatedSelectedCategories);
    filterProducts(searchQuery, updatedSelectedCategories);

    if (updatedSelectedCategories.length === 0) {
      setFilteredProducts(products);
    } else {
      const newFilteredProducts = products.filter(product => 
        updatedSelectedCategories.includes(product.categoria)
      );
      setFilteredProducts(newFilteredProducts);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterProducts(query, selectedCategories);
  };

  const filterProducts = (query, categories) => {
    let filtered = products;
  
    // Filtrar por categoría si hay categorías seleccionadas
    if (categories.length > 0) {
      filtered = filtered.filter(product => categories.includes(product.categoria));
    }
  
    // Filtrar por búsqueda si hay un término de búsqueda
    if (query) {
      filtered = filtered.filter(product =>
        product.nombre_producto.toLowerCase().includes(query.toLowerCase()) ||
        product.categoriaNombre.toLowerCase().includes(query.toLowerCase())
      );
    }
  
    setFilteredProducts(filtered);
  };
  

  return (
    <Box sx={{ padding: 3, marginTop: -3, backgroundColor: 'white' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#CA6DF2', textAlign: 'center', marginBottom: '40px', fontWeight: 'bold' }}>
        Catálogo de Productos
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {categories.map((category) => (
          <Button
            key={category._id}
            variant={selectedCategories.includes(category._id) ? 'contained' : 'outlined'}
            onClick={() => handleCategoryChange(category._id)}
            sx={{
              textTransform: 'none',
              borderColor: selectedCategories.includes(category._id) ? '#CA6DF2' : '#B86AD9',
              backgroundColor: selectedCategories.includes(category._id) ? '#B86AD9' : 'transparent',
              color: selectedCategories.includes(category._id) ? '#F2F2F2' : '#2D2D2D',
              '&:hover': {
                backgroundColor: selectedCategories.includes(category._id) ? '#A55BC0' : '#E0E0E0',
                color: '#2D2D2D'
              }
            }}
          >
            {category.nombre}
          </Button>
        ))}
      </Box>
      <TextField
        variant="outlined"
        placeholder="Buscar productos..."
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{
          marginLeft: 2,
          width: '300px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#CA6DF2',
            },
            '&:hover fieldset': {
              borderColor: '#B86AD9',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#A55BC0',
            },
          },
          '& .MuiInputBase-input': {
            color: '#2D2D2D',
            backgroundColor: 'white',
            padding: '10px 14px',
            borderRadius: '4px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: '8px',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#CA6DF2' }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
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
                  <Typography variant="h6" sx={{ color: '#B86AD9', fontWeight: 'bold' }}>${product.precio ? product.precio.toFixed(2) : 'N/A'}</Typography>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                    sx={{ backgroundColor: '#B86AD9', '&:hover': { backgroundColor: '#A55BC0' }, color: '#F2F2F2', display: 'flex', alignItems: 'center' }}
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

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Producto agregado al carrito!
        </Alert>
      </Snackbar>
    </Box>
  );
}
