import React from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, IconButton, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';

const cartItems = [
  { id: 1, name: 'Dog Food', price: 20, imageUrl: 'https://via.placeholder.com/150', quantity: 1 },
  { id: 2, name: 'Cat Toy', price: 10, imageUrl: 'https://via.placeholder.com/150', quantity: 2 },
];

export default function Carrito() {
  return (
    <Box sx={{ padding: 3, marginTop: 8 }}>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      <List>
        {cartItems.map((item) => (
          <ListItem key={item.id}>
            <ListItemAvatar>
              <Avatar src={item.imageUrl} alt={item.name} />
            </ListItemAvatar>
            <ListItemText primary={item.name} secondary={`$${item.price} x ${item.quantity}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end">
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h5">Total: $50</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>Proceed to Checkout</Button>
      </Box>
    </Box>
  );
}
