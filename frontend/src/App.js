import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import axios from 'axios';
import Home from './components/Home';
import Perfil from './components/client/Perfil';
import AdminDashboard from './components/admin/AdminDashboard';
import Catalogo from './components/admin/Catalogo';
import ClienteDashboard from './components/client/ClienteDashboard';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('rol'); // Obtener el rol del usuario desde las cookies
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
                userRole === 'admin' ? (
                  <Navigate to="/dashboard-admin" />
                ) : (
                  <Navigate to="/clienteapp" />
                )
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

          {/* Rutas para Admin */}
          <Route path="/dashboard-admin" element={isLoggedIn && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/catalogAdmin" element={isLoggedIn && userRole === 'admin' ? <Catalogo /> : <Navigate to="/" />} />

          {/* Rutas para Cliente */}
          <Route path="/clienteapp" element={isLoggedIn && userRole === 'cliente' ? <ClienteDashboard /> : <Navigate to="/" />} />

          {/* Redirección a Home si se accede a una ruta no válida */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
