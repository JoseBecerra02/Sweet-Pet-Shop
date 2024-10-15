import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardMedia, CardContent, Button } from '@mui/material';

const productData = {
  id: 1,
  name: 'Dog Food',
  price: 20,
  description: 'Nutritious food for dogs',
  imageUrl: 'https://via.placeholder.com/300',
  category: 'Food'
};

export default function ProductoDetalle() {
  const { id } = useParams();
  // For simplicity, using static data here. This can be replaced with a fetch request.

  return (
    <Box sx={{ padding: 3, marginTop: 8 }}>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={productData.imageUrl}
          alt={productData.name}
        />
        <CardContent>
          <Typography variant="h4">{productData.name}</Typography>
          <Typography variant="h6" color="primary">${productData.price}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>{productData.description}</Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary">Add to Cart</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
