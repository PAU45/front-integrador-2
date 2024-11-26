import React, { useState } from 'react';
import axios from 'axios';

const ProveedorForm = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !email) {
      setMensaje('Por favor, complete los campos obligatorios.');
      return;
    }

    const proveedor = {
      nombre: nombre,
      email: email,
      telefono: telefono,
      direccion: direccion,
    };

    try {
      const token = localStorage.getItem('access');
      const response = await axios.post('http://127.0.0.1:8000/api/auth/proveedores/', proveedor, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        setMensaje('Proveedor creado exitosamente');
        // Limpiar el formulario después del éxito
        setNombre('');
        setEmail('');
        setTelefono('');
        setDireccion('');
      } else {
        setMensaje('Error al crear el proveedor. Código de estado: ' + response.status);
      }
    } catch (error) {
      console.error('Error al crear el proveedor:', error);
      setMensaje('Hubo un error al crear el proveedor. Detalles: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Crear Nuevo Proveedor</h1>
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
        <button type="submit">Crear Proveedor</button>
      </form>
    </div>
  );
};

export default ProveedorForm;