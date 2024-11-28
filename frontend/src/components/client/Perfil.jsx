import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';

const Perfil = () => {
  const [user, setUser] = useState({});
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Obtener el token desde las cookies
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

        const response = await axios.get('https://sweet-pet-shop-production.up.railway.app/api/usuarios/perfil', config);
        setUser(response.data.user);
        setTelefono(response.data.user.telefono || '');
        setDireccion(response.data.user.direccion || '');
        setCiudad(response.data.user.ciudad || '');
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        console.error('Token no encontrado');
        return;
      }

      const data = { telefono, direccion, ciudad };

      console.log('Datos a actualizar:', data);

      const response = await axios.put(
        'https://sweet-pet-shop-production.up.railway.app/api/usuarios/perfil',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      alert('Perfil actualizado con éxito.');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Perfil de {user.nombre}
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              label="Teléfono"
              variant="outlined"
              margin="normal"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            <TextField
              fullWidth
              label="Dirección"
              variant="outlined"
              margin="normal"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
            <TextField
              fullWidth
              label="Ciudad"
              variant="outlined"
              margin="normal"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
            />
          </Box>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateProfile}
            fullWidth
          >
            Actualizar Perfil
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default Perfil;