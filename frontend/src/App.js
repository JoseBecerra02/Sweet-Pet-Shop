import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import axios from 'axios';
import "./App.css";
import Perfil from './components/client/Perfil';
import AdminDashboard from './components/admin/AdminDashboard';
import Catalogo from './components/admin/Catalogo';
import Users from './components/admin/Users';
import ClienteDashboard from './components/client/ClienteDashboard';
import { Typography, Box, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/system';
import CatalogoCliente from './components/client/CatalogoCliente';
import Carrito from './components/client/Carrito';
import Orders from './components/admin/Orders';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  
  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('rol'); 
    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;

      // Enviar el token al backend para autenticar
      const res = await axios.post('http://localhost:3000/api/usuarios/google-login', { token: credential });

      // Guardar el token JWT en cookies si la autenticación fue exitosa
      Cookies.set('token', res.data.token, { expires: 5 });
      Cookies.set('rol', res.data.user.rol, { expires: 5 }); // Guardar el rol del usuario en las cookies
      console.log('Sesión iniciada con éxito:', res.data.user);

      // Actualizar el estado de autenticación y rol
      setIsLoggedIn(true);
      setUserRole(res.data.user.rol);

      // Mostrar mensaje de éxito
      setSnackbarMessage('Inicio de sesión exitoso');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Redirigir al perfil si es un nuevo usuario
      if (res.status === 201) {
        alert('Complete su perfil.');
        window.location.href = '/perfil';
      } else {
        // Si el usuario ya está registrado, ir al dashboard adecuado según el rol
        if (res.data.user.rol === 'admin') {
          window.location.href = '/dashboard-admin';
        } else {
          window.location.href = '/clienteapp';
        }
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
       // Mostrar mensaje de error
       setSnackbarMessage('Error al autenticar con Google');
       setSnackbarSeverity('error');
       setOpenSnackbar(true);
    }
  };

  const handleLoginFailure = () => {
    console.log('Error al iniciar sesión con Google.');
    setSnackbarMessage('Error al iniciar sesión con Google. Inténtelo nuevamente.');
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Styled components
const BackgroundImage = styled(Box)({
  backgroundImage: 'url(/assets/bg.svg)', 
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const Logo = styled('img')({
  position: 'absolute',
  top: '10vmin',
  right: '10vmin',
  height: '30vmin',
});

const ContentBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
});

  return (
    <GoogleOAuthProvider clientId={'197152996427-tnahvkham0qkj09onm3a82mo3n6b0s2k.apps.googleusercontent.com'}>
      <Router>
        <Routes>
          {/* Ruta principal */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                userRole === 'admin' ? (
                  <Navigate to="/dashboard-admin" />
                ) : (
                  <Navigate to="/clienteapp" />
                )
              ) : (
                <BackgroundImage>
                <Logo src="/logosps.svg" alt="Logo" classname="mi-logo"/> 
                <ContentBox>
                  <Typography variant="h4" style={{ color: '#B86AD9' }}>
                    Inicia sesión con Google
                  </Typography>
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                  />
                </ContentBox>
              </BackgroundImage>
              )
            }
          />

          {/* Ruta de perfil */}
          <Route path="/perfil" element={isLoggedIn ? <Perfil /> : <Navigate to="/" />} />

          {/* Rutas para Admin */}
          <Route path="/dashboard-admin" element={isLoggedIn && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/catalogAdmin" element={isLoggedIn && userRole === 'admin' ? <Catalogo /> : <Navigate to="/" />} />
          <Route path="/Users" element={isLoggedIn && userRole === 'admin' ? <Users /> : <Navigate to="/" />} />
          <Route path="/orders" element={isLoggedIn && userRole === 'admin' ? <Orders /> : <Navigate to="/" />} />

          {/* Rutas para Cliente */}
          <Route path="/clienteapp" element={isLoggedIn && userRole === 'cliente' ? <ClienteDashboard /> : <Navigate to="/" />} />
          <Route path="/catalogo-cliente" element={<CatalogoCliente />} />
          <Route path="/carrito" element={<Carrito />} />

          {/* Redirección a Home si se accede a una ruta no válida */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
       {/* Snackbar para mostrar mensajes de éxito o error */}
       <Snackbar
          open={openSnackbar}
          autoHideDuration={6000} // Duración del mensaje
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;

