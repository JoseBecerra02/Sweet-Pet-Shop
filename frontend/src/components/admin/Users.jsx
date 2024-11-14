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
  FormControl,
  InputLabel,
} from "@mui/material";
import { Menu as MenuIcon, Home, People, Inventory, ShoppingCart, Settings, Edit, Delete, Save, Assignment } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

// Estilos personalizados para la tabla
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#2D2D2D',
  borderBottom: '1px solid #E0E0E0',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#F3E5F5', // Lila pastel
  },
  '&:hover': {
    backgroundColor: '#EDE7F6', // Un tono más claro para el hover
  },
}));

export default function Usuarios() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    correo: "",
    nombre: "",
    rol: "cliente",
    estado: "activo",
    telefono: "",
  });
  const [editUserId, setEditUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({});
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterRole, setFilterRole] = useState("todos");

  useEffect(() => {
    axios.get('http://localhost:3000/api/usuarios/usuarios')
      .then(response => {
        setUsers(response.data);
        setFilteredUsers(response.data);
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
    axios.post('http://localhost:3000/api/usuarios/crear-usuario', newUser)
      .then(response => {
        setUsers([...users, response.data]); 
        setFilteredUsers([...users, response.data]);
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
        const updatedUsers = users.filter(user => user._id !== userId);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
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
        setFilteredUsers(updatedUsers);
        setEditUserId(null); 
      })
      .catch((error) => {
        console.error('Error al editar usuario:', error);
      });
  };

  const handleFilterChange = (e) => {
    const status = e.target.value;
    setFilterStatus(status);
    applyFilters(status, filterRole);
  };

  const handleRoleFilterChange = (e) => {
    const role = e.target.value;
    setFilterRole(role);
    applyFilters(filterStatus, role);
  };

  const applyFilters = (status, role) => {
    let filtered = users;
    if (status !== "todos") {
      filtered = filtered.filter(user => user.estado === status);
    }
    if (role !== "todos") {
      filtered = filtered.filter(user => user.rol === role);
    }
    setFilteredUsers(filtered);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar sx={{ pt: 7, pb: 4 }}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Gestión de Usuarios
          </Typography>
          <FormControl sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel id="filter-status-label">Filtrar por Estado</InputLabel>
            <Select
              labelId="filter-status-label"
              value={filterStatus}
              label="Filtrar por Estado"
              onChange={handleFilterChange}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="activo">Activo</MenuItem>
              <MenuItem value="inactivo">Inactivo</MenuItem>
              <MenuItem value="suspendido">Suspendido</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="filter-role-label">Filtrar por Rol</InputLabel>
            <Select
              labelId="filter-role-label"
              value={filterRole}
              label="Filtrar por Rol"
              onChange={handleRoleFilterChange}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="cliente">Cliente</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </Toolbar>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Correo</StyledTableCell>
                <StyledTableCell>Nombre</StyledTableCell>
                <StyledTableCell>Rol</StyledTableCell>
                <StyledTableCell>Estado</StyledTableCell>
                <StyledTableCell>Teléfono</StyledTableCell>
                <StyledTableCell>Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <StyledTableRow key={user._id}>
                  <StyledTableCell>
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
                  </StyledTableCell>
                  <StyledTableCell>
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
                  </StyledTableCell>
                  <StyledTableCell>
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
                  </StyledTableCell>
                  <StyledTableCell>
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
                  </StyledTableCell>
                  <StyledTableCell>
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
                  </StyledTableCell>
                  <StyledTableCell>
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
                  </StyledTableCell>
                </StyledTableRow>
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
