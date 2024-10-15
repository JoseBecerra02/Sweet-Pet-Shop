import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, CardActions, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const products = [
  { id: 1, name: 'Dog Food', price: 20, description: 'Nutritious food for dogs', imageUrl: 'https://via.placeholder.com/150', category: 'Food' },
  { id: 2, name: 'Cat Toy', price: 10, description: 'Fun toy for cats', imageUrl: 'https://via.placeholder.com/150', category: 'Toys' },
  // More products...
];

export default function CatalogoCliente() {
  return (
    <Box sx={{ padding: 3, marginTop: 8 }}>
      <Typography variant="h4" gutterBottom>Product Catalog</Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={product.imageUrl}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h5">{product.name}</Typography>
                <Typography variant="subtitle1">${product.price}</Typography>
                <Typography variant="body2" color="textSecondary">{product.description}</Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} to={`/producto/${product.id}`} size="small">View Details</Button>
                <Button size="small" variant="contained" color="primary">Add to Cart</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
