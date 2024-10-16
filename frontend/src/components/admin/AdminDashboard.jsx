import React, { useState } from "react";
import Cookies from 'js-cookie';
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
  Button,
  Grid,
} from "@mui/material";
import { Menu as MenuIcon, Notifications, Home, People, Inventory, ShoppingCart, Settings } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Hook para redirección

  const toggleDrawer = () => {
    setSidebarOpen(!sidebarOpen);
  };

/*   const handleLogout = () => {
    // Eliminar cookies
    Cookies.remove('token');
    Cookies.remove('rol');

    // Redirigir al usuario a la página principal (login)
    navigate('/');
  };
 */
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
            Dashboard
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
              {sidebarOpen && <ListItemText primary="Home" />}
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/users")}>
              <ListItemIcon>
                <People />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Users" />}
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/catalogAdmin")}>
              <ListItemIcon>
                <Inventory />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Catalog" />}
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/orders")}>
              <ListItemIcon>
                <ShoppingCart />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Orders" />}
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/settings")}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Settings" />}
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
                <Typography variant="subtitle1">Registered Users</Typography>
                <Typography variant="h4" color="#CA6DF2">
                  1,234
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  +20% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="subtitle1">Orders Processed</Typography>
                <Typography variant="h4" color="#CA6DF2">
                  345
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  +15% from last week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="subtitle1">Available Products</Typography>
                <Typography variant="h4" color="#CA6DF2">
                  789
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  +5 new products added
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="subtitle1">Low Inventory Products</Typography>
                <Typography variant="h4" color="error">
                  23
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Requires immediate attention
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sales Overview Chart */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6">Sales Overview</Typography>
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
