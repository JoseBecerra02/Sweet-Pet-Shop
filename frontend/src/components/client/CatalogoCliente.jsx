import React, { useState, useEffect, Suspense } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Snackbar, Alert, TextField, InputAdornment } from '@mui/material';
import { ShoppingCart, Search } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const defaultImageUrl = 'https://img.freepik.com/foto-gratis/perro-lindo-arte-digital_23-2151150544.jpg';

function CollarModel({ color }) {
  const { scene, materials } = useGLTF(`${process.env.PUBLIC_URL}/assets/collar.glb`);

  useEffect(() => {
    if (materials) {
      console.log('Materiales disponibles:', materials);

      const customizableMaterialNames = ['', 'Dark Brown Leather', 'metal'];
      customizableMaterialNames.forEach((materialName) => {
        if (materials[materialName]) {
          console.log(`Aplicando color a ${materialName}`);
          if (materialName === '') {
            materials[materialName].color = new THREE.Color(color);
          }
          materials[materialName].metalness = 0.5;
          materials[materialName].roughness = 0.4;
        } else {
          console.log(`Material ${materialName} no encontrado`);
        }
      });
    }
  }, [color, materials]);

  return <primitive object={scene} scale={2} />;
}

function ProductDetailsModal({ open, onClose, product, onSaveCustomization }) {
  const [user, setUser] = useState({});
  const [selectedColor, setSelectedColor] = useState('');

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

  const handleSaveCustomization = () => {
    if (product && product.nombre_producto === "Collar para perros") {
      const customizationData = {
        usuarioId: user._id,
        productoId: product._id,
        opciones: {
          color: selectedColor,
        },
      };
      console.log('Datos de personalización a guardar:', customizationData);
      onSaveCustomization(customizationData);
    }
  };

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

        {product.nombre_producto === "Collar para perros" && (
          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h6" gutterBottom>Personaliza tu collar</Typography>
            <TextField
              select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              fullWidth
              SelectProps={{ native: true }}
              sx={{ marginBottom: 2 }}
            >
              <option value="">Seleccione un color</option>
              <option value="#ff0000">Rojo</option>
              <option value="#0000ff">Azul</option>
              <option value="#00ff00">Verde</option>
              <option value="#000000">Negro</option>
              <option value="#ffffff">Blanco</option>
            </TextField>
            <Box sx={{ height: 400, marginTop: 2 }}>
              <Canvas shadows camera={{ position: [0, 0, 10], fov: 35 }}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 10]} intensity={2} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={1.0} />
                <Suspense fallback={null}>
                  <CollarModel color={selectedColor} />
                </Suspense>
                <OrbitControls enableZoom={true} />
              </Canvas>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#CA6DF2' }}>Cerrar</Button>
        {product.nombre_producto === "Collar para perros" && (
          <Button onClick={handleSaveCustomization} sx={{ color: '#CA6DF2' }} disabled={!selectedColor}>
            Guardar Personalización
          </Button>
        )}
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
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedSuggestion, setHighlightedSuggestion] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');

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
              categoriaNombre: category ? category.nombre : 'Sin Categoría',
              cantidad: product.cantidad || 0,
              enPromocion: product.enPromocion || false
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
    filterProducts(searchQuery, selectedCategories);
  }, [minPrice, maxPrice, inStock, onSale, sortOrder]);

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

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      const matchedSuggestions = products
        .filter(product => product.nombre_producto.toLowerCase().startsWith(query.toLowerCase()))
        .map(product => product.nombre_producto);

      setSuggestions(matchedSuggestions);
      setHighlightedSuggestion(matchedSuggestions[0] || '');
    } else {
      setSuggestions([]);
      setHighlightedSuggestion('');
    }

    filterProducts(query, selectedCategories);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Tab' && highlightedSuggestion) {
      event.preventDefault();
      setSearchQuery(highlightedSuggestion);
      filterProducts(highlightedSuggestion, selectedCategories);
      setSuggestions([]);
    }
  };

  const filterProducts = (query, categories) => {
    let filtered = products;

    if (categories.length > 0) {
      filtered = filtered.filter(product => categories.includes(product.categoria));
    }

    if (query) {
      filtered = filtered.filter(product =>
        product.nombre_producto.toLowerCase().includes(query.toLowerCase()) ||
        product.categoriaNombre.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (minPrice !== '') {
      filtered = filtered.filter(product => product.precio >= parseFloat(minPrice));
    }
    if (maxPrice !== '') {
      filtered = filtered.filter(product => product.precio <= parseFloat(maxPrice));
    }

    if (inStock) {
      filtered = filtered.filter(product => product.cantidad > 0);
    }

    if (onSale) {
      filtered = filtered.filter(product => product.enPromocion === true);
    }

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.precio - b.precio);
    } else {
      filtered.sort((a, b) => b.precio - a.precio);
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (categoryId) => {
    const updatedSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(updatedSelectedCategories);
    filterProducts(searchQuery, updatedSelectedCategories);
  };

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
        alert('Por favor, inicia sesión para agregar productos al carrito.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const carritoData = {
        id_usuario: user._id,
        id_producto: product._id,
        cantidad: 1,
      };

      const response = await axios.post('http://localhost:3000/api/carrito/carrito/agregar', carritoData, config);
      if (response.status === 200) {
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error.message);
    }
  };

  const handleSaveCustomization = async (customizationData) => {
    try {
      console.log('Datos de personalización recibidos:', customizationData);
      const token = Cookies.get('token');
      if (!token) {
        alert('Por favor, inicia sesión para personalizar productos.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const response = await axios.post('http://localhost:3000/personalizacion/personalizacion', customizationData, config);
      if (response.status === 201) {
        alert('Personalización guardada exitosamente!');

        const personalizacionId = response.data.personalizacion._id;

        handleAddPersonalizationToCart({
          id_usuario: user._id,
          id_personalizacion: personalizacionId,
          cantidad: 1,
        });
      }
    } catch (error) {
      console.error('Error al guardar la personalización:', error.message);
    }
  };

  const handleAddPersonalizationToCart = async (cartData) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        alert('Por favor, inicia sesión para agregar productos al carrito.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const response = await axios.post('http://localhost:3000/api/carrito/carrito/agregarPersonalizacion', cartData, config);
      if (response.status === 200) {
        alert('Producto personalizado agregado al carrito exitosamente!');
      }
    } catch (error) {
      console.error('Error al agregar el producto personalizado al carrito:', error.message);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: 3, marginTop: -3, backgroundColor: 'white' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#CA6DF2', textAlign: 'center', marginBottom: '40px', fontWeight: 'bold' }}>
        Catálogo de Productos
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginBottom: 3 }}>
        <TextField
          type="number"
          variant="outlined"
          placeholder="Precio mínimo"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          sx={{ width: '150px', marginRight: 2 }}
        />
        <TextField
          type="number"
          variant="outlined"
          placeholder="Precio máximo"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          sx={{ width: '150px', marginRight: 2 }}
        />
        <Button
          variant="outlined"
          onClick={() => {
            const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            setSortOrder(newOrder);
            filterProducts(searchQuery, selectedCategories);
          }}
          sx={{ textTransform: 'none', marginRight: 2 }}
        >
          Ordenar por precio: {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
        </Button>
        <Button
          variant={inStock ? 'contained' : 'outlined'}
          onClick={() => setInStock(!inStock)}
          sx={{ textTransform: 'none', marginRight: 2 }}
        >
          {inStock ? 'En Stock' : 'En Stock'}
        </Button>
        <Button
          variant={onSale ? 'contained' : 'outlined'}
          onClick={() => setOnSale(!onSale)}
          sx={{ textTransform: 'none', marginRight: 2 }}
        >
          {onSale ? 'Promociones' : 'Promociones'}
        </Button>
        {categories.map((category) => (
          <Button
            key={category._id}
            variant={selectedCategories.includes(category._id) ? 'contained' : 'outlined'}
            onClick={() => handleCategoryChange(category._id)}
            sx={{ textTransform: 'none', marginRight: 2 }}
          >
            {category.nombre}
          </Button>
        ))}
        <TextField
          variant="outlined"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          sx={{ width: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {suggestions.length > 0 && (
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              backgroundColor: '#FFF',
              border: '1px solid #CA6DF2',
              borderRadius: '4px',
              width: '300px',
              zIndex: 10,
              marginTop: '-15px',
            }}
          >
            {suggestions.map((suggestion, index) => (
              <Typography
                key={index}
                onClick={() => {
                  setSearchQuery(suggestion);
                  filterProducts(suggestion, selectedCategories);
                  setSuggestions([]);
                }}
                sx={{
                  padding: '8px',
                  cursor: 'pointer',
                  backgroundColor: suggestion === highlightedSuggestion ? '#CA6DF2' : 'transparent',
                  color: suggestion === highlightedSuggestion ? '#FFF' : '#000',
                  '&:hover': { backgroundColor: '#B86AD9', color: '#FFF' },
                }}
              >
                {suggestion}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

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
          onSaveCustomization={handleSaveCustomization}
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
