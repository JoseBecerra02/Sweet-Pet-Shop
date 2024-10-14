import React, { useState, useEffect } from 'react';
import { decodeToken } from "react-jwt";
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleLogin = ({ setIsLogin, setData }) => {
    const navigate = useNavigate();
    const [showLoginButton, setShowLoginButton] = useState(true); // Estado para controlar la visibilidad del botón de inicio de sesión
    const [userEmail, setUserEmail] = useState(null); // Estado para almacenar el email del usuario

    const handleCredentialResponse = async (response) => {
        const data_decode = decodeToken(response.credential);

        try {
            // Enviar el token al backend para autenticar
            const res = await axios.post('http://localhost:3000/google-login', { token: response.credential });

            if (res.status === 200) {
                setIsLogin(true);
                setUserEmail(data_decode.email); // Almacenar el email del usuario
                const expiracion = new Date();
                expiracion.setDate(expiracion.getDate() + 5);
                Cookies.set('token', JSON.stringify(data_decode), { expires: expiracion });
                sessionStorage.setItem('logged', JSON.stringify(res.data.user));
                setShowLoginButton(false); 
                navigate('/perfil');
            } else {
                alert('No tienes permiso para acceder');
                setIsLogin(false);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            throw error; 
        }
    };

    const _get_auth = async () => {
        try {
            google.accounts.id.initialize({
                client_id: '197152996427-tnahvkham0qkj09onm3a82mo3n6b0s2k.apps.googleusercontent.com',
                callback: (response) => handleCredentialResponse(response),
            });

            google.accounts.id.renderButton(
                document.getElementById("buttonDiv"),
                { theme: "outline", size: "large", text: "login with google" }  
            );

            google.accounts.id.prompt();
        } catch (error) {
            console.log('error', error);
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

        _script.onload = _get_auth;
    }, []);

    return (
        <>
            {showLoginButton && <div id="buttonDiv"></div>}
        </>
    );
};

export default GoogleLogin;