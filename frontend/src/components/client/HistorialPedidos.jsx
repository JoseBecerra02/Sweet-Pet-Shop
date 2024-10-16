import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const orderHistory = [
  { id: 1, date: '2024-10-10', total: 40, status: 'Entregado' },
  { id: 2, date: '2024-10-01', total: 25, status: 'Pendiente' },
];

export default function HistorialPedidos() {
  return (
    <Box sx={{ padding: 3, marginTop: -3 }}>
      <Typography variant="h4" gutterBottom>Historial de Pedidos</Typography>
      <List>
        {orderHistory.map((order) => (
          <ListItem key={order.id}>
            <ListItemText
              primary={`Pedido #${order.id} - $${order.total}`}
              secondary={`Fecha: ${order.date} | Estado: ${order.status}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
