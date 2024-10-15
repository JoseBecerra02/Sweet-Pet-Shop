//components/Home.js
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Sweet Pet Shop
      </Typography>
      <Typography variant="body1" gutterBottom>
        Explore our personalized pet services and products!
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        component={Link} 
        to="/perfil"  
        style={{ marginTop: '20px' }}
      >
        Go to Profile
      </Button>
    </Container>
  );
};

export default Home;
