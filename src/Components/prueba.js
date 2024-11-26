import React, { useState } from 'react';
import axios from 'axios';

const Prueba = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [resultados, setResultados] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fechaInicio || !fechaFin) {
      setMensaje('Por favor, proporciona ambas fechas.');
      return;
    }

    try {
      const token = localStorage.getItem('access');
      const response = await axios.get('http://127.0.0.1:8000/api/auth/proyeccion-flujo-caja/', {
        params: {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setResultados(response.data);
      setMensaje('');
    } catch (error) {
      console.error('Error al obtener la proyección de flujo de caja:', error);
      setMensaje('Hubo un error al obtener la proyección de flujo de caja.');
    }
  };

  return (
    <div>
      <h1>Proyección de Flujo de Caja</h1>
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Fecha de Inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fecha de Fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            required
          />
        </div>
        <button type="submit">Obtener Proyección</button>
      </form>
      {resultados && (
        <div>
          <h2>Resultados</h2>
          <p>Ingresos: {resultados.ingresos}</p>
          <p>Egresos: {resultados.egresos}</p>
          <p>Flujo de Caja: {resultados.flujo_caja}</p>
        </div>
      )}
    </div>
  );
};

export default Prueba;