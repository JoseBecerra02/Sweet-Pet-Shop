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
} from "@mui/material";
import { Menu as MenuIcon, Home, People, Inventory, ShoppingCart, Settings, Edit, Delete, Save, Assignment } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Usuarios() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    correo: "",
    nombre: "",
    rol: "cliente",
    estado: "activo",
    telefono: "",
  });
  const [editUserId, setEditUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3000/api/usuarios/usuarios')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error al obtener usuarios:', error);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = () => {
    axios.post('http://localhost:3000/api/usuarios/usuarios', newUser)
      .then(response => {
        setUsers([...users, response.data]); 
        handleDialogClose();
        setNewUser({
          correo: "",
          nombre: "",
          rol: "cliente",
          estado: "activo",
          telefono: "",
        });
      })
      .catch(error => {
        console.error('Error al agregar usuario:', error);
      });
  };

  const handleDeleteUser = (userId) => {
    axios.delete(`http://localhost:3000/api/usuarios/usuarios/${userId}`)
      .then(() => {
        setUsers(users.filter(user => user._id !== userId));
      })
      .catch(error => console.error("Error al eliminar usuario:", error));
  };

  const handleUserEditClick = (user) => {
    setEditUserId(user._id);
    setEditUserData({ ...user });
  };

  const handleUserSaveClick = (userId) => {
    axios.put(`http://localhost:3000/api/usuarios/usuarios/${userId}`, editUserData)
      .then(() => {
        const updatedUsers = users.map((user) =>
          user._id === userId ? { ...user, ...editUserData } : user
        );
        setUsers(updatedUsers);
        setEditUserId(null); 
      })
      .catch((error) => {
        console.error('Error al editar usuario:', error);
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
            Gestión de usuarios
          </Typography>
          <Button variant="contained" color="primary" onClick={handleDialogOpen}>
            + AGREGAR USUARIO
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
                <Assignment />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Usuarios" />}
            </ListItem>

            <ListItem button onClick={() => navigate("/users")}>
              <ListItemIcon>
                <People />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Usuarios" />}
            </ListItem>
            <ListItem button onClick={() => navigate("/catalogAdmin")}>
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

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Correo</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    {editUserId === user._id ? (
                      <TextField
                        name="correo"
                        value={editUserData.correo}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            correo: e.target.value,
                          })
                        }
                      />
                    ) : (
                      user.correo
                    )}
                  </TableCell>
                  <TableCell>
                    {editUserId === user._id ? (
                      <TextField
                        name="nombre"
                        value={editUserData.nombre}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            nombre: e.target.value,
                          })
                        }
                      />
                    ) : (
                      user.nombre
                    )}
                  </TableCell>
                  <TableCell>
                    {editUserId === user._id ? (
                      <TextField
                        name="rol"
                        value={editUserData.rol}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            rol: e.target.value,
                          })
                        }
                      />
                    ) : (
                      user.rol
                    )}
                  </TableCell>
                  <TableCell>
                    {editUserId === user._id ? (
                      <TextField
                        name="estado"
                        value={editUserData.estado}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            estado: e.target.value,
                          })
                        }
                      />
                    ) : (
                      user.estado
                    )}
                  </TableCell>
                  <TableCell>
                    {editUserId === user._id ? (
                      <TextField
                        name="telefono"
                        value={editUserData.telefono}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            telefono: e.target.value,
                          })
                        }
                      />
                    ) : (
                      user.telefono
                    )}
                  </TableCell>
                  <TableCell>
                    {editUserId === user._id ? (
                      <IconButton color="primary" onClick={() => handleUserSaveClick(user._id)}>
                        <Save />
                      </IconButton>
                    ) : (
                      <>
                        <IconButton color="primary" onClick={() => handleUserEditClick(user)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => handleDeleteUser(user._id)}>
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Agregar usuario</DialogTitle>
        <DialogContent>
          <DialogContentText>Ingrese los detalles del nuevo usuario</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Correo"
            name="correo"
            fullWidth
            variant="outlined"
            value={newUser.correo}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Nombre"
            name="nombre"
            fullWidth
            variant="outlined"
            value={newUser.nombre}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Rol"
            name="rol"
            fullWidth
            variant="outlined"
            value={newUser.rol}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Estado"
            name="estado"
            fullWidth
            variant="outlined"
            value={newUser.estado}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Teléfono"
            name="telefono"
            fullWidth
            variant="outlined"
            value={newUser.telefono}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddUser} color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
