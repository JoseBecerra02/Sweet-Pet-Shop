import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Button, Snackbar, Alert } from '@mui/material';
import Cookies from 'js-cookie';
import axios from 'axios';

const MyGoogleLoginButton = ({ onLoginSuccess }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false); // Estado para el Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Mensaje del Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Severidad (success, error, warning, etc.)

  const handleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;

      // Enviar el token al backend para autenticar
      const res = await axios.post('https://sweet-pet-shop-production.up.railway.app/api/usuarios/google-login', { token: credential });

      // Guardar el token y rol en cookies
      Cookies.set('token', res.data.token, { expires: 5 });
      Cookies.set('rol', res.data.user.rol, { expires: 5 });

      // Mostrar mensaje de éxito
      setSnackbarMessage('Inicio de sesión exitoso');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Llamar la función de éxito del componente padre (App.jsx)
      onLoginSuccess(res.data.user.rol);
    } catch (error) {
      console.error('Error al autenticar con Google:', error);

      // Mostrar mensaje de error
      setSnackbarMessage('Error al autenticar con Google');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleError = () => {
    // Mostrar mensaje de error si falla el login
    setSnackbarMessage('Error al iniciar sesión con Google');
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        render={(renderProps) => (
          <Button
            variant="contained"
            style={{
              backgroundColor: '#CA6DF2',
              color: '#F2F2F2',
            }}
            onClick={renderProps.onClick} // Enlazar onClick
            disabled={renderProps.disabled} // Respetar disabled
          >
            Inicia sesión con Google
          </Button>
        )}
      />

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
    </>
  );
};

export default MyGoogleLoginButton;
