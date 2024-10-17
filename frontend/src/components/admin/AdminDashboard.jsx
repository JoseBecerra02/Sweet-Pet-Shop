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
  Card,
  CardContent,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { Menu as MenuIcon, Notifications, Home, People, Inventory, ShoppingCart, Settings } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

const salesData = [
  { name: "Ene", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Abr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Hook para redirección

  const toggleDrawer = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Manejar navegación
  const handleNavigation = (path) => {
    navigate(path);
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
          {/* <Button color="inherit" onClick={handleLogout}>Cerrar sesión</Button> */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Panel de Administración
          </Typography>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
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
            <ListItem button onClick={() => handleNavigation("/")}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Inicio" />}
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/users")}>
              <ListItemIcon>
                <People />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Usuarios" />}
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/catalogAdmin")}>
              <ListItemIcon>
                <Inventory />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Catálogo" />}
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/orders")}>
              <ListItemIcon>
                <ShoppingCart />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Órdenes" />}
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/settings")}>
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
        <Grid container spacing={3}>
          {/* Cards for different statistics */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="subtitle1">Usuarios Registrados</Typography>
                <Typography variant="h4" color="#CA6DF2">
                  1,234
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  +20% comparado con el mes pasado
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="subtitle1">Órdenes Procesadas</Typography>
                <Typography variant="h4" color="#CA6DF2">
                  345
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  +15% comparado con la semana pasada
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="subtitle1">Productos Disponibles</Typography>
                <Typography variant="h4" color="#CA6DF2">
                  789
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  +5 nuevos productos agregados
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="subtitle1">Productos con Inventario Bajo</Typography>
                <Typography variant="h4" color="error">
                  23
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Requiere atención inmediata
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sales Overview Chart */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6">Resumen de Ventas</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#B86AD9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
