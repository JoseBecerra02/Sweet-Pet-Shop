import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Perfil = () => {
  const [user, setUser] = useState({});
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
        const token = localStorage.getItem('token');  // Get token from localStorage
        if (token) {
          try {
            const response = await axios.get('http://localhost:3000/api/usuarios/perfil', {
              headers: { Authorization: `Bearer ${token}` },  // Pass token
              withCredentials: true  // Allow credentials
            });
            setUser(response.data.user);
          } catch (error) {
            console.error('Error al obtener el perfil:', error);
          }
        } else {
          console.error('No token found in localStorage.');
        }
      };
      

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        'http://localhost:3000/api/usuarios/perfil',
        { telefono, direccion, ciudad },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true  // Permitir envío de credenciales
        }
      );
      alert('Perfil actualizado con éxito.');
      setUser(response.data.user); // Actualizar el estado con la nueva información
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