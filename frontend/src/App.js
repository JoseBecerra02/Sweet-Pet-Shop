import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import axios from 'axios';
import Home from './components/Home';
import Perfil from './components/Perfil';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsLoggedIn(true); // Si el token existe, el usuario está autenticado
    }
  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;

      // Enviar el token al backend para autenticar
      const res = await axios.post('http://localhost:3000/api/usuarios/google-login', { token: credential });

      // Guardar el token JWT en cookies si la autenticación fue exitosa
      Cookies.set('token', res.data.token, { expires: 5 }); 
      console.log('Sesión iniciada con éxito:', res.data.user);

      // Actualizar el estado de autenticación
      setIsLoggedIn(true);

      // Redirigir al perfil si es un nuevo usuario
      if (res.status === 201) {
        alert('Complete su perfil.');
        window.location.href = '/perfil';
      } else {
        // Si el usuario ya está registrado, ir al home
        window.location.href = '/home'; 
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión. Por favor, inténtelo de nuevo.');
    }
  };

  const handleLoginFailure = () => {
    console.log('Error al iniciar sesión con Google.');
    alert('Error al iniciar sesión con Google. Inténtelo nuevamente.');
  };

  return (
    <GoogleOAuthProvider clientId={'197152996427-tnahvkham0qkj09onm3a82mo3n6b0s2k.apps.googleusercontent.com'}>
      <Router>
        <Routes>
          {/* Ruta principal */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/home" />
              ) : (
                <div>
                  <h2>Iniciar sesión con Google</h2>
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                  />
                </div>
              )
            }
          />

          {/* Ruta de perfil */}
          <Route path="/perfil" element={isLoggedIn ? <Perfil /> : <Navigate to="/" />} />

          {/* Ruta de Home */}
          <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/" />} />

          {/* Redirección a Home si se accede a una ruta no válida */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
