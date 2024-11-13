import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Typography, Box, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/system';
import "./App.css";

const Perfil = lazy(() => import('./components/client/Perfil'));
const AdminDashboard = lazy(() => import( './components/admin/AdminDashboard'));
const Catalogo = lazy(() => import( './components/admin/Catalogo'));
const Users = lazy(() => import( './components/admin/Users'));
const ClienteDashboard = lazy(() => import('./components/client/ClienteDashboard'));
const CatalogoCliente = lazy(() => import('./components/client/CatalogoCliente'));
const Carrito = lazy(() => import( './components/client/Carrito'));
const Orders = lazy(() => import( './components/admin/Orders'));
const Informes = lazy(() => import( './components/admin/Informes'));
const GestionSolicitudes = lazy(() => import( './components/admin/GestionSolicitudes'));

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
      <Suspense fallback={<div>Cargando...</div>}>
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
          <Route path="/informes" element={isLoggedIn && userRole === 'admin' ? <Informes /> : <Navigate to="/" />} />
          <Route path="/solicitudes" element={isLoggedIn && userRole === 'admin' ? <GestionSolicitudes /> : <Navigate to="/" />} />


          {/* Rutas para Cliente */}
          <Route path="/clienteapp" element={isLoggedIn && userRole === 'cliente' ? <ClienteDashboard /> : <Navigate to="/" />} />
          <Route path="/catalogo-cliente" element={<CatalogoCliente />} />
          <Route path="/carrito" element={<Carrito />} />

          {/* Redirección a Home si se accede a una ruta no válida */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
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

