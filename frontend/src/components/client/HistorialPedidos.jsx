import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText, Divider, TextField, Button, MenuItem, Collapse, IconButton, Alert } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import Cookies from 'js-cookie';

export default function HistorialPedidos() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({
    orderId: '',
    subject: '',
    description: '',
  });
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          console.error('Token no encontrado');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        };

        // Obtener el perfil del usuario para saber el ID
        const profileResponse = await axios.get('http://localhost:3000/api/usuarios/perfil', config);
        const userId = profileResponse.data.user._id;
        setUserId(userId);

        // Obtener las órdenes del usuario

        const response = await axios.get(`http://localhost:3000/api/orden/cliente/${userId}`, config);
        setOrderHistory(response.data);
      } catch (error) {
        console.error('Error al obtener el historial de pedidos:', error);
      }
    };

    fetchOrderHistory();
  }, []);

  useEffect(() => {
    // Simular que una queja ha sido respondida (quemado)
    if (complaints.some(complaint => complaint.response)) {
      setShowAlert(true);
    }
  }, [complaints]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComplaint((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddComplaint = async () => {
    if (newComplaint.orderId && newComplaint.subject && newComplaint.description) {
      console.log('Agregando nueva queja:', newComplaint);
      const newEntry = {
        id_orden: newComplaint.orderId,
        id_usuario: userId,
        asunto: newComplaint.subject,
        descripcion: newComplaint.description,
      };
      try {
        const token = Cookies.get('token');
        if (!token) {
          console.error('Token no encontrado');
          return;
        }

        const config = {
          headers: {
        Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        };

        const response = await axios.post('http://localhost:3000/api/quejas', newEntry, config);
        console.log('Respuesta del servidor:', response.data);
      } catch (error) {
        console.error('Error al agregar la queja: ', error);
      }

      console.log('Nueva queja:', newEntry);
      setComplaints((prev) => [...prev, newEntry]);
      setNewComplaint({ orderId: '', subject: '', description: '' });
    }
  };

  const handleToggleExpand = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }

    try {
      const token = Cookies.get('token');
      if (!token) {
        console.error('Token no encontrado');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      // Obtener los detalles de los productos de la orden
      const selectedOrder = orderHistory.find((order) => order._id === orderId);
      if (!selectedOrder.productos || selectedOrder.productos.length === 0 || !selectedOrder.productos[0].nombre_producto) {
        const productosIds = selectedOrder.productos;

        // Obtener los detalles de los productos
        const productosPromises = productosIds.map(async (productoId) => {
          const productoResponse = await axios.get(`http://localhost:3000/api/inventario/producto/${productoId}`, config);
          return productoResponse.data;
        });

        const productos = await Promise.all(productosPromises);

        const updatedOrderHistory = orderHistory.map((order) =>
          order._id === orderId ? { ...order, productos } : order
        );
        setOrderHistory(updatedOrderHistory);
      }
      setExpandedOrder(orderId);
    } catch (error) {
      console.error('Error al obtener los detalles del pedido:', error);
    }
  };

  const handleToggleComplaintExpand = (complaintId) => {
    setExpandedComplaint(expandedComplaint === complaintId ? null : complaintId);
  };

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  return (
    <Box sx={{ padding: 3, marginTop: -3 }}>
      <Typography variant="h4" gutterBottom>
        Historial de Pedidos
      </Typography>
      {showAlert && (
        <Alert severity="info" onClose={() => setShowAlert(false)}>
          Su queja ha sido respondida.
        </Alert>
      )}
      <Button variant="outlined" onClick={handleShowAlert} sx={{ marginBottom: 2 }}>
        Mostrar Alerta
      </Button>
      <List>
        {orderHistory.map((order) => (
          <React.Fragment key={order._id}>
            <ListItem button onClick={() => handleToggleExpand(order._id)}>
              <ListItemText
                primary={`Pedido #${order.id_orden} - $${order.total}`}
                secondary={`Fecha: ${new Date(order.createdAt).toLocaleDateString()} | Estado: ${order.estado}`}
              />
              <IconButton>{expandedOrder === order._id ? <ExpandLess /> : <ExpandMore />}</IconButton>
            </ListItem>
            <Collapse in={expandedOrder === order._id} timeout="auto" unmountOnExit>
              <Box sx={{ marginLeft: 4, marginBottom: 2 }}>
                <Typography variant="h6">Detalles del Pedido:</Typography>
                <List>
                  {order.productos && order.productos.length > 0 ? (
                    order.productos.map((producto) => (
                      <ListItem key={producto._id}>
                        <ListItemText
                          primary={`Producto: ${producto.nombre_producto}`}
                        />
                        <img src={producto.ruta} alt={producto.nombre_producto} style={{ width: '100px', height: '100px', marginLeft: '20px' }} />
                      </ListItem>
                    ))
                  ) : (
                    <Typography variant="body2">No se encontraron productos para este pedido.</Typography>
                  )}
                </List>
              </Box>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
      <Divider sx={{ marginY: 3 }} />
      <Typography variant="h4" gutterBottom>
        Quejas y Reclamos
      </Typography>
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Agregar Nueva Queja o Reclamo
        </Typography>
        <TextField
          select
          label="Seleccionar Pedido"
          name="orderId"
          value={newComplaint.orderId}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        >
          {orderHistory.map((order) => (
            <MenuItem key={order._id} value={order._id}>
              Pedido #{order.id_orden} - ${order.total}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Asunto"
          name="subject"
          value={newComplaint.subject}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Descripción"
          name="description"
          value={newComplaint.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button variant="contained" onClick={handleAddComplaint} sx={{ marginTop: 2 }}>
          Guardar Queja
        </Button>
      </Box>
      <List>
        {complaints.map((complaint) => (
          <React.Fragment key={complaint.id}>
            <ListItem button onClick={() => handleToggleComplaintExpand(complaint.id)}>
              <ListItemText
                primary={`Queja #${complaint.id} - Asunto: ${complaint.subject}`}
                secondary={`Fecha: ${complaint.date} | Estado: ${complaint.status}
                
Descripción: ${complaint.description}`}
              />
              <IconButton>{expandedComplaint === complaint.id ? <ExpandLess /> : <ExpandMore />}</IconButton>
            </ListItem>
            <Collapse in={expandedComplaint === complaint.id} timeout="auto" unmountOnExit>
              <Box sx={{ marginLeft: 4, marginBottom: 2 }}>
                {complaint.response ? (
                  <>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Respuesta del Admin:</Typography>
                    <Typography variant="body2">{complaint.response}</Typography>
                  </>
                ) : (
                  <Typography variant="body2">No hay respuesta aún para esta queja.</Typography>
                )}
              </Box>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
