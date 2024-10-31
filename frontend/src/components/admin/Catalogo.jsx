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
import { Menu as MenuIcon, Home, People, Inventory, ShoppingCart, Settings, Edit, Delete, Save } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// Importar los módulos necesarios de Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAOu2d20BqFbe2Ilm7lTlvn953tL6GM8GE",
  authDomain: "sweetpetshop-5477f.firebaseapp.com",
  projectId: "sweetpetshop-5477f",
  storageBucket: "sweetpetshop-5477f.appspot.com",
  messagingSenderId: "559380812966",
  appId: "1:559380812966:web:621c71ccedb15297451067",
  measurementId: "G-4ECC4H19CV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);


export default function Catalogo() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [umbralDialogOpen, setUmbralDialogOpen] = useState(false);
  const [umbralMinimo, setUmbralMinimo] = useState(0);
  const [umbral, setUmbral] = useState(null);
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
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editProductId, setEditProductId] = useState(null);
  const [editProductData, setEditProductData] = useState({});

  useEffect(() => {
    // Obtener categorías desde el backend
    axios.get('http://localhost:3000/api/categoria')
      .then(response => {
        setCategories(response.data); // Guardar las categorías en el estado
      })
      .catch(error => {
        console.error('Error al obtener categorías:', error);
      });

    axios.get('http://localhost:3000/api/inventario')
      .then(response => {
        setProducts(response.data); 
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
      });
  }, []);

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

  const handleUmbralDialogOpen = () => {
    setUmbralDialogOpen(true);
  };

  const handleUmbralDialogClose = () => {
    setUmbralDialogOpen(false);
  };

  const handleCategoryDialogOpen = () => {
    setCategoryDialogOpen(true);
  };

  const handleCategoryDialogClose = () => {
    setCategoryDialogOpen(false);
    setEditCategoryId(null);
    setEditCategoryName("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSaveUmbral = () => {
    const valor = umbralMinimo; 
    
    axios.put(`http://localhost:3000/api/inventario/umbral/${valor}`)
      .then((response) => {
        console.log('Umbrales actualizados correctamente:', response.data);
        setUmbral(valor); 
        setUmbralMinimo(''); 
      })
      .catch((error) => {
        console.error('Error al establecer umbral:', error);
      });
  };

  const handleAddProduct = async () => {
      if (!newProduct.categoria || !newProduct.imagen) {
        console.error('No se ha seleccionado una categoría o imagen');
        return;
      }

      // Subir la imagen a Firebase Storage
      const fileRef = ref(storage, `images/${newProduct.imagen.name}`);
      await uploadBytes(fileRef, newProduct.imagen);

      // Obtener la URL de la imagen subida
      const imageUrl = await getDownloadURL(fileRef);

      // Ahora puedes guardar el producto en MongoDB con la URL de la imagen
      const productoConImagen = { ...newProduct, ruta: imageUrl };

      axios.post('http://localhost:3000/api/inventario', productoConImagen)
        .then(response => {
          setProducts([...products, response.data]);
          handleDialogClose();
          setNewProduct({
            nombre_producto: "",
            precio: "",
            cantidad: "",
            descripcion: "",
            categoria: "",
            ruta: "",
          });
        })
        .catch(error => {
          console.error('Error al agregar producto:', error.message);
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



  // Iniciar la edición de una categoría
  const handleEditClick = (category) => {
    setEditCategoryId(category._id);
    setEditCategoryName(category.nombre);
  };

  // Guardar los cambios de edición de una categoría
  const handleSaveClick = (categoryId) => {
    axios.put(`http://localhost:3000/api/categoria/${categoryId}`, { nombre: editCategoryName })
      .then(() => {
        const updatedCategories = categories.map((cat) =>
          cat._id === categoryId ? { ...cat, nombre: editCategoryName } : cat
        );
        setCategories(updatedCategories);
        setEditCategoryId(null); // Finaliza la edición
      })
      .catch((error) => {
        console.error('Error al editar categoría:', error);
      });
  };

  // Eliminar una categoría
  const handleCategoryDelete = (categoryId) => {
    axios.delete(`http://localhost:3000/api/categoria/${categoryId}`)
      .then(() => {
        setCategories(categories.filter(cat => cat._id !== categoryId));
      })
      .catch(error => {
        console.error('Error al eliminar categoría:', error);
      });
  };

  // Iniciar la edición de un producto
  const handleProductEditClick = (product) => {
    setEditProductId(product._id);
    setEditProductData({ ...product });
  };

  // Guardar los cambios de edición de un producto
  const handleProductSaveClick = (productId) => {
    console.log('Editando producto:', editProductData);
    axios.put(`http://localhost:3000/api/inventario/producto/${productId}`, editProductData)
      .then(() => {
        const updatedProducts = products.map((prod) =>
          prod._id === productId ? { ...prod, ...editProductData } : prod
        );
        setProducts(updatedProducts);
        setEditProductId(null); 
      })
      .catch((error) => {
        console.error('Error al editar producto:', error);
      });
  };

  // Eliminar un producto
  const handleProductDelete = (productId) => {
    axios.delete(`http://localhost:3000/api/inventario/producto/${productId}`)
      .then(() => {
        setProducts(products.filter(prod => prod._id !== productId));
      })
      .catch(error => {
        console.error('Error al eliminar producto:', error);
      });
  };  

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#ffffff", color: "#2D2D2D" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Catálogo de Productos
          </Typography>
          <Button variant="contained" color="primary" onClick={handleUmbralDialogOpen}>
            ✎ UMBRAL MÍNIMO
          </Button>
          <Button variant="contained" color="primary" onClick={handleDialogOpen} sx={{ ml: 2 }} >
            + AGREGAR PRODUCTO
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCategoryDialogOpen} sx={{ ml: 2 }}>
            + AGREGAR CATEGORÍA
          </Button>
        </Toolbar>
      </AppBar>

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

      {/* Main Content - Tabla de Productos */}
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
                  <TableCell>
                    {editProductId === product._id ? (
                      <TextField
                        value={editProductData.nombre_producto}
                        onChange={(e) =>
                          setEditProductData({ ...editProductData, nombre_producto: e.target.value })
                        }
                      />
                    ) : (
                      product.nombre_producto
                    )}
                  </TableCell>
                  <TableCell>
                    {editProductId === product._id ? (
                      <TextField
                        value={editProductData.precio}
                        onChange={(e) =>
                          setEditProductData({ ...editProductData, precio: e.target.value })
                        }
                      />
                    ) : (
                      product.precio
                    )}
                  </TableCell>
                  <TableCell>
                    {editProductId === product._id ? (
                      <TextField
                        value={editProductData.cantidad}
                        onChange={(e) =>
                          setEditProductData({ ...editProductData, cantidad: e.target.value })
                        }
                      />
                    ) : (
                      product.cantidad
                    )}
                  </TableCell>
                  <TableCell>
                    {editProductId === product._id ? (
                      <TextField
                        value={editProductData.descripcion}
                        onChange={(e) =>
                          setEditProductData({ ...editProductData, descripcion: e.target.value })
                        }
                      />
                    ) : (
                      product.descripcion
                    )}
                  </TableCell>
                  <TableCell>{product.categoria?.nombre}</TableCell>
                  <TableCell>
                    {editProductId === product._id ? (
                      <IconButton color="primary" onClick={() => handleProductSaveClick(product._id)}>
                        <Save />
                      </IconButton>
                    ) : (
                      <IconButton color="primary" onClick={() => handleProductEditClick(product)}>
                        <Edit />
                      </IconButton>
                    )}
                    <IconButton color="secondary" onClick={() => handleProductDelete(product._id)}>
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
                  {category.nombre}
                </MenuItem>
              ))}
            </Select>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewProduct({ ...newProduct, imagen: e.target.files[0] })}
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

        {/* Nueva tabla de Categorías */}
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre de la Categoría</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {editCategoryId === category._id ? (
                      <TextField
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                      />
                    ) : (
                      category.nombre
                    )}
                  </TableCell>
                  <TableCell>
                    {editCategoryId === category._id ? (
                      <IconButton color="primary" onClick={() => handleSaveClick(category._id)}>
                        <Save />
                      </IconButton>
                    ) : (
                      <IconButton color="primary" onClick={() => handleEditClick(category)}>
                        <Edit />
                      </IconButton>
                    )}
                    <IconButton color="secondary" onClick={() => handleCategoryDelete(category._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog para agregar/editar categoría */}
        <Dialog open={categoryDialogOpen} onClose={handleCategoryDialogClose}>
          <DialogTitle>{editCategoryId ? "Editar Categoría" : "Agregar Categoría"}</DialogTitle>
          <DialogContent>
            <DialogContentText>{editCategoryId ? "Modifica el nombre de la categoría" : "Ingrese el nombre de la nueva categoría"}</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre de la Categoría"
              fullWidth
              variant="outlined"
              value={editCategoryId ? editCategoryName : newCategory}
              onChange={(e) => (editCategoryId ? setEditCategoryName(e.target.value) : setNewCategory(e.target.value))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCategoryDialogClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={editCategoryId ? handleSaveClick : handleAddCategory} color="primary">
              {editCategoryId ? "Guardar" : "Agregar"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog para editar umbral mínimo de stock */}
        <Dialog open={umbralDialogOpen} onClose={handleUmbralDialogClose}>
          <DialogTitle>Establecer Umbral Mínimo de Stock</DialogTitle>
          <DialogContent>
            <DialogContentText>Establezca el umbral mínimo de stock para los productos.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Umbral Mínimo"
              type="number"
              fullWidth
              variant="outlined"
              value={umbralMinimo}
              onChange={(e) => setUmbralMinimo(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUmbralDialogClose}>Cancelar</Button>
            <Button onClick={handleSaveUmbral} color="primary">Guardar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
