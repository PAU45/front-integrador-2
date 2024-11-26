import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [avatar, setAvatar] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://127.0.0.1:8000/api/auth/usuario-logueado/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const { nombre, email, telefono, direccion, avatar } = response.data;
        setNombre(nombre);
        setEmail(email);
        setTelefono(telefono);
        setDireccion(direccion);
        setAvatar(avatar);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        setMensaje('Hubo un error al cargar los datos del usuario.');
      }
    };

    fetchUsuario();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      nombre: nombre,
      email: email,
      telefono: telefono,
      direccion: direccion,
      avatar: avatar
    };

    try {
      const token = localStorage.getItem('access');
      const response = await axios.put('http://127.0.0.1:8000/api/auth/usuario-logueado/', data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setMensaje('Perfil actualizado exitosamente');
      } else {
        setMensaje('Error al actualizar el perfil. Código de estado: ' + response.status);
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      setMensaje('Hubo un error al actualizar el perfil. Detalles: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Editar Perfil</h1>
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        <div>
          <label>Dirección</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>
        <div>
          <label>Avatar (URL)</label>
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
        </div>
        <button type="submit">Actualizar Perfil</button>
      </form>
      {avatar && (
        <div>
          <h2>Avatar Actual</h2>
          <img src={avatar} alt="Avatar" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
        </div>
      )}
    </div>
  );
};

export default Profile;