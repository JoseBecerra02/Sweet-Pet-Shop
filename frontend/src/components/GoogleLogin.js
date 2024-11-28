// components/GoogleLogin.js
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleLogin = () => {
  const navigate = useNavigate();
  const [showLoginButton, setShowLoginButton] = useState(true);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await axios.post('https://sweet-pet-shop-production.up.railway.app/api/usuarios/google-login', {
        token: response.credential,
      });
  
      // Verifica si hay un token antes de guardarlo
      if (res.data && res.data.token) {
        Cookies.set('token', res.data.token, { expires: 1 }); 
        console.log('Sesión iniciada con éxito');
        navigate('/perfil'); 
      } else {
        console.error('Error: no se recibió un token válido');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  useEffect(() => {
    const _root = document.getElementById('root');
    const script_id = document.getElementById('google-login');
  
    if (script_id) {
      _root.removeChild(script_id);
    }
  
    const _script = document.createElement('script');
    _script.src = 'https://accounts.google.com/gsi/client';
    _script.async = true;
    _script.id = 'google-login';
    _script.defer = true;
    _root.appendChild(_script);
  
    _script.onload = () => {
      google.accounts.id.initialize({
        client_id: '197152996427-tnahvkham0qkj09onm3a82mo3n6b0s2k.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        auto_select: true, 
      });
  
      google.accounts.id.prompt(); 
    };
  }, []);  

  return (
    <>
      {showLoginButton && <div id="buttonDiv"></div>}
    </>
  );
};

export default GoogleLogin;
