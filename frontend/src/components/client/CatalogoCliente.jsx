import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import axios from 'axios';

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

  // Obtener productos y categorías desde el backend
  useEffect(() => {
    axios.get('http://localhost:3000/api/categoria')
      .then(response => {
        const categoriesData = response.data.map(category => ({
          _id: category._id.$oid || category._id,
          nombre: category.nombre
        }));
        setCategories(categoriesData);
        
        // Log para ver las categorías cargadas
        console.log('Categorías cargadas:', categoriesData);
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
          
          // Log para ver los productos cargados
          console.log('Productos cargados:', productsWithCategoryNames);
        })
        .catch(error => {
          console.error('Error al obtener los productos:', error);
        });
    }
  }, [categories]);

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

  const handleCategoryChange = (categoryId) => {
    const updatedSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(updatedSelectedCategories);
    
    // Log de las categorías seleccionadas
    console.log('Categorías seleccionadas:', updatedSelectedCategories);

    // Filtrar productos según las categorías seleccionadas
    if (updatedSelectedCategories.length === 0) {
      setFilteredProducts(products); // Si no hay categorías seleccionadas, mostrar todos los productos
    } else {
      // Log antes de filtrar
      console.log('Productos antes de filtrar:', products);
      const newFilteredProducts = products.filter(product => 
        updatedSelectedCategories.includes(product.categoria) // Comparar directamente con el string
      );
      setFilteredProducts(newFilteredProducts);
      
      // Log de los productos filtrados
      console.log('Productos filtrados:', newFilteredProducts);
    }
  };

  return (
    <Box sx={{ padding: 3, marginTop: -3, backgroundColor: '#F2F2F2' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#CA6DF2', textAlign: 'center', marginBottom: '40px', fontWeight: 'bold' }}>
        Catálogo de Productos
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', marginBottom: 3 }}>
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
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id.$oid}>
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
    </Box>
  );
}
