import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Home from './components/Home';
import Perfil from './components/Perfil';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleCredentialResponse = async (response) => {
    try {
      const { credential } = response;
  
      // Enviar el token al backend para autenticar
      const res = await axios.post('http://localhost:3000/api/usuarios/google-login', { token: credential });
  
      // Guardar el token JWT en el frontend si la autenticación fue exitosa
      localStorage.setItem('token', res.data.token);
      console.log('Sesión iniciada con éxito:', res.data.user);
  
      // Actualizar el estado de autenticación
      setIsLoggedIn(true);
  
      // Redirigir al perfil si es un nuevo usuario
      if (res.status === 201) {
        alert('Complete su perfil.');
        window.location.href = '/perfil';
      } else {
        // Si el usuario ya está registrado, ir al home
        window.location.href = '/home'; // Redirigir a /home
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);  // Si el token existe, el usuario está autenticado
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId="340874428494-ot9uprkvvq4ha529arl97e9mehfojm5b.apps.googleusercontent.com">
      <Router>
        <Routes>
          {/* Ruta principal */}
          <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Login handleCredentialResponse={handleCredentialResponse} />} />

          {/* Ruta de perfil */}
          <Route path="/perfil" element={<Perfil />} />

          {/* Ruta de Home */}
          <Route path="/home" element={<Home />} />

          {/* Redirección a Home si se accede a una ruta no válida */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

// Componente de Login
const Login = ({ handleCredentialResponse }) => (
  <div>
    <h2>Iniciar sesión con Google</h2>
    <GoogleLogin
      onSuccess={handleCredentialResponse}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  </div>
);

export default App;