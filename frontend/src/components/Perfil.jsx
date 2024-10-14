// components/Perfil.jsx

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

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
        
        const response = await axios.get('http://localhost:3000/api/usuarios/perfil', config);
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
        'http://localhost:3000/api/usuarios/perfil',
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
    <div>
      <h2>Perfil de {user.nombre}</h2>
      <input
        type="text"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
      <input
        type="text"
        placeholder="Dirección"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
      />
      <input
        type="text"
        placeholder="Ciudad"
        value={ciudad}
        onChange={(e) => setCiudad(e.target.value)}
      />
      <button onClick={handleUpdateProfile}>Actualizar Perfil</button>
    </div>
  );
};

export default Perfil;
