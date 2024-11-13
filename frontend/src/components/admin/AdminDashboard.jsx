import React, { useEffect, useState } from "react";
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
import Grid from '@mui/material/Grid';
import { Menu as MenuIcon, Notifications, Home, People, Inventory, ShoppingCart, Logout, Assignment, CoPresent} from "@mui/icons-material";
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Cookies from 'js-cookie';
import axios from "axios";
import Catalogo from './Catalogo';
import Informes from './Informes';
import Orders from './Orders';
import Users from './Users';
import GestionSolicitudes from './GestionSolicitudes';
import VistaUser from './GestionVistaUser';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('home');
  const [productosDisponibles, setProductosDisponibles] = useState(0);
  const [productosBajoInventario, setProductosBajoInventario] = useState(0);
  const [ordenesProcesadas, setOrdenesProcesadas] = useState(0);
  const [usuariosActivos, setUsuariosActivos] = useState(0);
  const [umbralMinimo, setUmbralMinimo] = useState(20); // Valor por defecto de 20
  const [salesData, setSalesData] = useState([]); // Nueva variable de estado para los datos de ventas

  useEffect(() => {
    // Obtener productos y calcular métricas de inventario
    const fetchInventarioData = async () => {
      try {
        const productosResponse = await axios.get("http://localhost:3000/api/inventario/productos");
        const productos = productosResponse.data;
        const totalCantidad = productos.reduce((acc, producto) => acc + producto.cantidad, 0);
        const umbral = productos[0]?.umbral || 20; // Suponiendo que el umbral es igual para todos los productos
        const bajoInventario = productos.filter(producto => producto.cantidad < umbral).length;

        setProductosDisponibles(totalCantidad);
        setProductosBajoInventario(bajoInventario);
        setUmbralMinimo(umbral);
      } catch (error) {
        console.error("Error al obtener datos de inventario:", error);
      }
    };

    // Obtener el número total de órdenes
    const fetchOrdenesData = async () => {
      try {
        const ordenesResponse = await axios.get("http://localhost:3000/api/orden");
        setOrdenesProcesadas(ordenesResponse.data.length);
      } catch (error) {
        console.error("Error al obtener datos de órdenes:", error);
      }
    };

    // Obtener el número de usuarios activos
    const fetchUsuariosData = async () => {
      try {
        const usuariosResponse = await axios.get("http://localhost:3000/api/usuarios/usuarios");
        const activos = usuariosResponse.data.filter(usuario => usuario.estado === "activo").length;
        setUsuariosActivos(activos);
      } catch (error) {
        console.error("Error al obtener datos de usuarios:", error);
      }
    };

    // Obtener los datos de ventas mensuales
    const fetchSalesData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/factura/informes/ventas/mensual"); // Ruta del backend para ventas mensuales
        const formattedData = response.data.map((item) => ({
          name: `${item._id.mes}/${item._id.anio}`,
          sales: item.totalVentas,
        }));
        setSalesData(formattedData);
      } catch (error) {
        console.error("Error al obtener datos de ventas:", error);
      }
    };

    fetchInventarioData();
    fetchOrdenesData();
    fetchUsuariosData();
    fetchSalesData(); // Llamada para obtener los datos de ventas
  }, []);

    // Función para obtener y procesar datos de inventario
  const fetchInventarioData = async () => {
    try {
      const productosResponse = await axios.get("http://localhost:3000/api/inventario/productos");
      const productos = productosResponse.data;
      const totalCantidad = productos.reduce((acc, producto) => acc + producto.cantidad, 0);
      const umbral = productos[0]?.umbral || 20;
      const bajoInventario = productos.filter(producto => producto.cantidad < umbral).length;

      setProductosDisponibles(totalCantidad);
      setProductosBajoInventario(bajoInventario);
      setUmbralMinimo(umbral);
    } catch (error) {
      console.error("Error al obtener datos de inventario:", error);
    }
  };

  // Función para obtener el número total de órdenes
  const fetchOrdenesData = async () => {
    try {
      const ordenesResponse = await axios.get("http://localhost:3000/api/orden");
      setOrdenesProcesadas(ordenesResponse.data.length);
    } catch (error) {
      console.error("Error al obtener datos de órdenes:", error);
    }
  };

  // Función para obtener los datos de ventas mensuales
  const fetchSalesData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/factura/informes/ventas/mensual");
      const formattedData = response.data.map((item) => ({
        name: `${item._id.mes}/${item._id.anio}`,
        sales: item.totalVentas,
      }));
      setSalesData(formattedData);
    } catch (error) {
      console.error("Error al obtener datos de ventas:", error);
    }
  };

  useEffect(() => {
    fetchInventarioData();
    fetchOrdenesData();
    fetchSalesData();
  }, []);



  const toggleDrawer = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    Cookies.remove('token'); 
    Cookies.remove('rol'); 
    window.location.href = '/'; 
  };

  // Función para renderizar la sección seleccionada
  const renderSelectedSection = () => {
    switch (selectedSection) {
      case 'home':
        return (
          <>
            <Grid container spacing={2} sx={{marginTop:'60px'}}>
              <Grid item xs={12} sm={6} md={2.4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1">Usuarios Activos</Typography>
                    <Typography variant="h5" color="#CA6DF2">{usuariosActivos}</Typography>
                    <Typography variant="caption" color="textSecondary">Total de usuarios activos</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1">Órdenes Procesadas</Typography>
                    <Typography variant="h5" color="#CA6DF2">{ordenesProcesadas}</Typography>
                    <Typography variant="caption" color="textSecondary">Total de órdenes</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1">Productos Disponibles</Typography>
                    <Typography variant="h5" color="#CA6DF2">{productosDisponibles}</Typography>
                    <Typography variant="caption" color="textSecondary">Total en inventario</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1">Productos con Inventario Bajo</Typography>
                    <Typography variant="h5" color="error">{productosBajoInventario}</Typography>
                    <Typography variant="caption" color="textSecondary">Requiere atención inmediata</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1">Umbral Mínimo</Typography>
                    <Typography variant="h5" color="#CA6DF2">{umbralMinimo}</Typography>
                    <Typography variant="caption" color="textSecondary">Umbral de inventario</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            {/* Gráfico de resumen de ventas */}
            <Card sx={{ mt: 4}}>
              <CardContent>
                <Typography variant="h6">Resumen de Ventas Mensuales</Typography>
                <ResponsiveContainer width="100%" height={300} style={{padding:'10px'}}>
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
          </>
        );
      case 'catalogo':
        return <Catalogo />;
      case 'informes':
        return <Informes />;
      case 'orders':
        return <Orders />;
      case 'users':
        return <Users />;
      case 'solicitudes':
        return <GestionSolicitudes />;
      case 'vistaUser':
        return <VistaUser />;
      default:
        return <div>Bienvenido al Panel de Administración</div>;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#ffffff", color: "#2D2D2D" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Panel de Administración</Typography>
          <IconButton color="inherit"><Notifications /></IconButton>
          <IconButton color="inherit" onClick={handleLogout}><Logout /></IconButton>
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
            <ListItem button onClick={() => setSelectedSection('home')}>
              <ListItemIcon><Home /></ListItemIcon>
              {sidebarOpen && <ListItemText primary="Inicio" />}
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('informes')}>
              <ListItemIcon><Assignment /></ListItemIcon>
              {sidebarOpen && <ListItemText primary="Informes" />}
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('users')}>
              <ListItemIcon><People /></ListItemIcon>
              {sidebarOpen && <ListItemText primary="Usuarios" />}
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('catalogo')}>
              <ListItemIcon><Inventory /></ListItemIcon>
              {sidebarOpen && <ListItemText primary="Catálogo" />}
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('orders')}>
              <ListItemIcon><ShoppingCart /></ListItemIcon>
              {sidebarOpen && <ListItemText primary="Órdenes" />}
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('solicitudes')}>
              <ListItemIcon><ModeCommentIcon /></ListItemIcon>
              {sidebarOpen && <ListItemText primary="Gestión Solicitudes" />}
            </ListItem>
            <ListItem button onClick={() => setSelectedSection('vistaUser')}>
              <ListItemIcon><CoPresentIcon /></ListItemIcon>
              {sidebarOpen && <ListItemText primary="Gestión vista Usuario" />}
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><Logout /></ListItemIcon>
              {sidebarOpen && <ListItemText primary="Cerrar Sesión" />}
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {renderSelectedSection()}
      </Box>
    </Box>
  );
}
