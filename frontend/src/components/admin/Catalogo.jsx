import React, { useState } from "react";
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
  const [products, setProducts] = useState([
    { name: "Comida para Perros", price: "$20", description: "Comida nutritiva para perros", category: "Comida", imageUrl: "https://example.com/dogfood.jpg" },
    { name: "Juguete para Gatos", price: "$10", description: "Juguete divertido para gatos", category: "Juguetes", imageUrl: "https://example.com/cattoy.jpg" },
  ]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    imageUrl: "",
  });
  const [categories, setCategories] = useState(["Categoría 1", "Categoría 2", "Categoría 3"]);
  const [newCategory, setNewCategory] = useState("");

  const navigate = useNavigate();

  const toggleDrawer = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Manejar la apertura/cierre del formulario de agregar producto
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // Abrir el modal para agregar categoría
  const handleCategoryDialogOpen = () => {
    setCategoryDialogOpen(true);
  };

  const handleCategoryDialogClose = () => {
    setCategoryDialogOpen(false);
  };

  // Manejar los cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Manejar la adición del producto al catálogo
  const handleAddProduct = () => {
    setProducts([...products, newProduct]);
    handleDialogClose();
    setNewProduct({ name: "", price: "", description: "", category: "", imageUrl: "" });
  };

  // Manejar la adición de una nueva categoría
  const handleAddCategory = () => {
    setCategories([...categories, newCategory]);
    setNewCategory("");
    handleCategoryDialogClose();
  };
  const handleDeleteProduct = (productId) => {
    console.log("Deleting product with ID:", productId);
    fetch(`http://localhost:3000/api/inventario/producto/${productId}`, {
      method: "DELETE",
    })
      .then(response => {
        if (response.ok) {
          //Actualizar la lista de productos
        } else {
          console.error("Error deleting product:", response.statusText);
        }
      })
      .catch(error => console.error("Error deleting product:", error));
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
                <TableCell>Descripción</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <img src={product.imageUrl} alt={product.name} style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <IconButton color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDeleteProduct(product._id)}>
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
              name="name"
              label="Nombre del Producto"
              fullWidth
              variant="outlined"
              value={newProduct.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="price"
              label="Precio"
              fullWidth
              variant="outlined"
              value={newProduct.price}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Descripción"
              fullWidth
              variant="outlined"
              value={newProduct.description}
              onChange={handleInputChange}
            />
            <Select
              fullWidth
              margin="dense"
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              displayEmpty
            >
              {/* Opción por defecto */}
              <MenuItem value="">
                Selecciona una categoría
              </MenuItem>
              
              {/* Otras categorías */}
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select> 

            <TextField
              margin="dense"
              name="imageUrl"
              label="URL de la Imagen"
              fullWidth
              variant="outlined"
              value={newProduct.imageUrl}
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
