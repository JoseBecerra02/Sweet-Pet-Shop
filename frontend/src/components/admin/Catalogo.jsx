import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { Menu as MenuIcon, Home, People, Inventory, ShoppingCart, Settings, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Catalogo() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    nombre_producto: "",
    precio: "",
    cantidad: "",
    descripcion: "",
    categoria: "",
    ruta: "",
  });
  const [categories, setCategories] = useState([
    { name: "Categoría 1", _id: "616a4f50c2bca25f842df6a8" },
    { name: "Categoría 2", _id: "616a4f50c2bca25f842df6a9" }
  ]);

  useEffect(() => {
    // Obtener categorías desde el backend
    axios.get('http://localhost:3000/api/categoria')
      .then(response => {
        setCategories(response.data); // Guardar las categorías en el estado
      })
      .catch(error => {
        console.error('Error al obtener categorías:', error);
      });
  
    // Obtener productos desde el backend
    axios.get('http://localhost:3000/api/inventario')
      .then(response => {
        setProducts(response.data); // Guardar los productos en el estado
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
      });
  }, []);

  
  const [newCategory, setNewCategory] = useState("");

  const navigate = useNavigate();

  const toggleDrawer = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleCategoryDialogOpen = () => {
    setCategoryDialogOpen(true);
  };

  const handleCategoryDialogClose = () => {
    setCategoryDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = () => {
    if (!newProduct.categoria) {
      console.error('No se ha seleccionado una categoría');
      return;
    }

    // Envía los datos al backend
    axios.post('http://localhost:3000/api/inventario', newProduct)
      .then(response => {
        setProducts([...products, response.data]); // Agregar el nuevo producto a la lista
        handleDialogClose();
        setNewProduct({
          nombre_producto: "",
          precio: "",
          descripcion: "",
          categoria: "",
          ruta: "",
        });
      })
      .catch(error => {
        if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          console.error('Error al agregar producto:', error.response.data);
        } else if (error.request) {
          // La solicitud fue hecha pero no se recibió respuesta
          console.error('Error al agregar producto: No se recibió respuesta del servidor', error.request);
        } else {
          // Algo pasó al configurar la solicitud que desencadenó un error
          console.error('Error al agregar producto:', error.message);
        }
      });
  };


  const handleAddCategory = () => {
    const categoryToSend = { nombre: newCategory }; 
    
    axios.post('http://localhost:3000/api/categoria', categoryToSend)
      .then(response => {
        setCategories([...categories, response.data]); 
        setNewCategory("");
        handleCategoryDialogClose();
      })
      .catch(error => {
        console.error('Error al agregar categoría:', error);
      });
  };  
  

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Top AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#ffffff", color: "#2D2D2D" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Catálogo de Productos
          </Typography>
          <Button variant="contained" color="primary" onClick={handleDialogOpen}>
            + AGREGAR PRODUCTO
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCategoryDialogOpen} sx={{ ml: 2 }}>
            + AGREGAR CATEGORÍA
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={sidebarOpen}
        sx={{
          width: sidebarOpen ? 240 : 72,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: sidebarOpen ? 240 : 72,
            boxSizing: "border-box",
            transition: "width 0.3s",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem button onClick={() => navigate("/dashboard-admin")}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Dashboard" />}
            </ListItem>
            <ListItem button onClick={() => navigate("/users")}>
              <ListItemIcon>
                <People />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Usuarios" />}
            </ListItem>
            <ListItem button onClick={() => navigate("/catalog")}>
              <ListItemIcon>
                <Inventory />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Catálogo" />}
            </ListItem>
            <ListItem button onClick={() => navigate("/orders")}>
              <ListItemIcon>
                <ShoppingCart />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Órdenes" />}
            </ListItem>
            <ListItem button onClick={() => navigate("/settings")}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Configuración" />}
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Imagen</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <img src={product.ruta} alt={product.nombre_producto} style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                  </TableCell>
                  <TableCell>{product.nombre_producto}</TableCell>
                  <TableCell>{product.precio}</TableCell>
                  <TableCell>{product.cantidad}</TableCell> 
                  <TableCell>{product.descripcion}</TableCell>
                  <TableCell>{product.categoria?.nombre}</TableCell> 
                  <TableCell>
                    <IconButton color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton color="secondary">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog para agregar producto */}
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Agregar Producto</DialogTitle>
          <DialogContent>
            <DialogContentText>Ingrese los detalles del nuevo producto que desea agregar.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="nombre_producto"
              label="Nombre del Producto"
              fullWidth
              variant="outlined"
              value={newProduct.nombre_producto}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="precio"
              label="Precio"
              fullWidth
              variant="outlined"
              value={newProduct.precio}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="cantidad"
              label="Cantidad"
              fullWidth
              variant="outlined"
              value={newProduct.cantidad}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="descripcion"
              label="Descripción"
              fullWidth
              variant="outlined"
              value={newProduct.descripcion}
              onChange={handleInputChange}
            />
            <Select
              fullWidth
              margin="dense"
              name="categoria"
              value={newProduct.categoria}
              onChange={handleInputChange}
              displayEmpty
            >
              <MenuItem value="">
                Selecciona una categoría
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.nombre} {/* Mostrar el nombre de la categoría */}
                </MenuItem>
              ))}
            </Select>
            <TextField
              margin="dense"
              name="ruta"
              label="URL de la Imagen"
              fullWidth
              variant="outlined"
              value={newProduct.ruta}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleAddProduct} color="primary">
              Agregar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog para agregar categoría */}
        <Dialog open={categoryDialogOpen} onClose={handleCategoryDialogClose}>
          <DialogTitle>Agregar Categoría</DialogTitle>
          <DialogContent>
            <DialogContentText>Ingrese el nombre de la nueva categoría que desea agregar.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="category"
              label="Nombre de la Categoría"
              fullWidth
              variant="outlined"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCategoryDialogClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleAddCategory} color="primary">
              Agregar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
