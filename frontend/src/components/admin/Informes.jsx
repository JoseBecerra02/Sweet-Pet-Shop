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
} from "@mui/material";
import { Menu as MenuIcon, Notifications, Home, People, Inventory, ShoppingCart, Settings, Logout, Assignment } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

export default function Informes() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [invoices, setInvoices] = useState([]); // State to hold fetched invoices
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("rol");
    window.location.href = "/";
  };

  // Function to fetch invoices
  const fetchInvoices = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/factura/informes/ventas");
      setInvoices(response.data); // Set invoices data to state
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  // Function to generate PDF
  const generatePDF = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/factura/informes/ventas/pdf", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "facturas.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Function to generate Excel
  const generateExcel = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/factura/informes/ventas/excel", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "facturas.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error generating Excel:", error);
    }
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
            Panel de Administración
          </Typography>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
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
            
            <ListItem button onClick={() => handleNavigation("/informes")}>
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Informes" />}
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
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Cerrar Sesión" />}
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4">Informes de Facturación</Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Selecciona una opción para ver las facturas o exportarlas en diferentes formatos.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button variant="contained" color="primary" onClick={fetchInvoices}>
            Traer Facturas
          </Button>
          <Button variant="contained" color="secondary" onClick={generatePDF}>
            Facturas en PDF
          </Button>
          <Button variant="contained" color="success" onClick={generateExcel}>
            Facturas en Excel
          </Button>
        </Box>

        {/* Table to display invoices */}
        {invoices.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.fecha}</TableCell>
                    <TableCell>{invoice.cliente}</TableCell>
                    <TableCell>{invoice.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
