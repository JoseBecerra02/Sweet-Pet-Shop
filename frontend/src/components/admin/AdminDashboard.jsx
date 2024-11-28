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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Alert } from "@mui/material";
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
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [ventasPorUsuario, setVentasPorUsuario] = useState([]);
  const [ventasPorCategoria, setVentasPorCategoria] = useState([]);
  const [categoriasData, setCategoriasData] = useState([]); // Datos de categorías para el gráfico circular
  const [error, setError] = useState(null);


  useEffect(() => {
    // Obtener productos y calcular métricas de inventario
    const fetchInventarioData = async () => {
      const timeout = setTimeout(() => {
        setError("La carga de datos de inventario está tardando demasiado. Por favor, intente nuevamente.");
      }, 3000);
      try {
        const productosResponse = await axios.get("http://localhost:3000/api/inventario/productos");
        clearTimeout(timeout); // Cancela el timeout si la respuesta llega a tiempo
        const productos = productosResponse.data;
        const totalCantidad = productos.reduce((acc, producto) => acc + producto.cantidad, 0);
        const umbral = productos[0]?.umbral || 20; // Suponiendo que el umbral es igual para todos los productos
        const bajoInventario = productos.filter(producto => producto.cantidad < umbral).length;

        setProductosDisponibles(totalCantidad);
        setProductosBajoInventario(bajoInventario);
        setUmbralMinimo(umbral);

        // Calcular datos para el gráfico circular
        const categorias = productos.reduce((acc, producto) => {
          acc[producto.categoria] = (acc[producto.categoria] || 0) + producto.cantidad;
          return acc;
        }, {});
        setCategoriasData(Object.entries(categorias).map(([name, value]) => ({ name, value })));
      } catch (error) {
        clearTimeout(timeout); // Cancela el timeout en caso de error
        console.error("Error al obtener datos de inventario:", error);
      }
    };

    // Obtener el número total de órdenes
    const fetchOrdenesData = async () => {
      const timeout = setTimeout(() => {
        setError("La carga de datos de órdenes está tardando demasiado. Por favor, intente nuevamente.");
      }, 3000);
      try {
        const ordenesResponse = await axios.get("http://localhost:3000/api/orden");
        clearTimeout(timeout);
        setOrdenesProcesadas(ordenesResponse.data.length);
      } catch (error) {
        clearTimeout(timeout);
        console.error("Error al obtener datos de órdenes:", error);
      }
    };

    // Obtener el número de usuarios activos
    const fetchUsuariosData = async () => {
      const timeout = setTimeout(() => {
        setError("La carga de datos de usuarios está tardando demasiado. Por favor, intente nuevamente.");
      }, 3000);
      try {
        const usuariosResponse = await axios.get("http://localhost:3000/api/usuarios/usuarios");
        clearTimeout(timeout);
        const activos = usuariosResponse.data.filter(usuario => usuario.estado === "activo").length;
        setUsuariosActivos(activos);
      } catch (error) {
        clearTimeout(timeout);
        console.error("Error al obtener datos de usuarios:", error);
      }
    };


    const fetchSalesData = async () => {
      const timeout = setTimeout(() => {
        setError("La carga de datos de ventas está tardando demasiado. Por favor, intente nuevamente.");
      }, 3000);
      try {
        const response = await axios.get("http://localhost:3000/api/factura/informes/ventas/mensual"); // Ruta del backend para ventas mensuales
        clearTimeout(timeout);
        const formattedData = response.data.map((item) => ({
          name: `${item._id.mes}/${item._id.anio}`,
          sales: item.totalVentas,
        }));
        setSalesData(formattedData);
      } catch (error) {
        clearTimeout(timeout);
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
      const productosResponse = await axios.get("https://sweet-pet-shop-production.up.railway.app/api/inventario/productos");
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
      const ordenesResponse = await axios.get("https://sweet-pet-shop-production.up.railway.app/api/orden");
      setOrdenesProcesadas(ordenesResponse.data.length);
    } catch (error) {
      console.error("Error al obtener datos de órdenes:", error);
    }
  };


  const fetchSalesData = async () => {
    try {
      const response = await axios.get("https://sweet-pet-shop-production.up.railway.app/api/factura/informes/ventas/mensual");
      const formattedData = response.data.map((item) => ({
        name: `${item._id.mes}/${item._id.anio}`,
        sales: item.totalVentas,
      }));
      setSalesData(formattedData);
    } catch (error) {
      console.error("Error al obtener datos de ventas:", error);
    }
  };

  const fetchVentasMensuales = async () => {
    try {
      const response = await axios.get("https://sweet-pet-shop-production.up.railway.app/api/factura/informes/ventas/mensual");
      setVentasMensuales(response.data);
    } catch (error) {
      console.error("Error al obtener ventas mensuales:", error);
    }
  };

  const fetchVentasPorUsuario = async () => {
    try {
      const response = await axios.get("https://sweet-pet-shop-production.up.railway.app/api/factura/informes/ventas/usuarios");
      setVentasPorUsuario(response.data);
    } catch (error) {
      console.error("Error al obtener ventas por usuario:", error);
    }
  };

  const fetchVentasPorCategoria = async () => {
    try {
      const response = await axios.get("https://sweet-pet-shop-production.up.railway.app/api/factura/informes/ventas/categorias");
      setVentasPorCategoria(response.data);
    } catch (error) {
      console.error("Error al obtener ventas por categoría:", error);
    }
  };

  useEffect(() => {
    fetchInventarioData();
    fetchOrdenesData();
    fetchSalesData();
    fetchVentasMensuales();
    fetchVentasPorUsuario();
    fetchVentasPorCategoria();
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

  const COLORS = ["#CA6DF2", "#B86AD9", "#F2F2F2", "#2D2D2D"];

  // Función para renderizar la sección seleccionada
  const renderSelectedSection = () => {
    switch (selectedSection) {
      case 'home':
        return (
          <>
            <Grid container spacing={2} sx={{ marginTop: '60px' }}>
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

              <Grid item xs={12} md={6} sx={{ mt: 2 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Distribución de Productos por Categoría</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={categoriasData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#B86AD9">
                          {categoriasData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ mt: 4 }}>
                  <CardContent>
                    <Typography variant="h6">Resumen de Ventas Mensuales</Typography>
                    <ResponsiveContainer width="100%" height={300} style={{ padding: '10px' }}>
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
              </Grid>
            </Grid>
          <Grid container spacing={2} sx={{marginTop:'60px'}}>
            <Grid item xs={12} sm={6} md={2.4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1">Venta Total mensual</Typography>
                    <Typography variant="h5" color="#CA6DF2">{ventasMensuales.length}</Typography>
                    <Typography variant="caption" color="textSecondary">Total de ventas</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1">Venta Total por usuario</Typography>
                    <Typography variant="h5" color="#CA6DF2">{ventasPorUsuario.length}</Typography>
                    <Typography variant="caption" color="textSecondary">Total de ventas</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="subtitle1">Venta Total por categoria</Typography>
                    <Typography variant="h5" color="#CA6DF2">{ventasPorCategoria.length}</Typography>
                    <Typography variant="caption" color="textSecondary">Total de ventas</Typography>
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
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{marginTop:6}}>
            {error}
          </Alert>
        )}
        {renderSelectedSection()}
      </Box>
    </Box>
  );
};