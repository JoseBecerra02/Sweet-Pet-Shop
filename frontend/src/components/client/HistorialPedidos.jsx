import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const orderHistory = [
  { id: 1, date: '2024-10-10', total: 40, status: 'Delivered' },
  { id: 2, date: '2024-10-01', total: 25, status: 'Pending' },
];

export default function HistorialPedidos() {
  return (
    <Box sx={{ padding: 3, marginTop: 8 }}>
      <Typography variant="h4" gutterBottom>Order History</Typography>
      <List>
        {orderHistory.map((order) => (
          <ListItem key={order.id}>
            <ListItemText
              primary={`Order #${order.id} - $${order.total}`}
              secondary={`Date: ${order.date} | Status: ${order.status}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
