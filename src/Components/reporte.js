import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importar useNavigate para redirigir

const Reporte = () => {
  // const [reportes, setReportes] = useState([]); // Comentar esta línea si no se usa
  const navigate = useNavigate(); // Crear una instancia de useNavigate

  useEffect(() => {
    // Obtener el token de acceso
    const token = localStorage.getItem("access");

    // Configurar Axios para incluir el token en las solicitudes
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Obtener los reportes desde el backend
    const fetchReportes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/reportes-facturas/");
        console.log(response.data); // Verificar los datos en la consola
        // setReportes(response.data); // Comentar esta línea si no se usa
      } catch (error) {
        console.error("Error al obtener los reportes:", error);
      }
    };

    fetchReportes();
  }, []);

  const handleBackToGerente = () => {
    navigate("/gerente"); // Redirigir a la página del gerente
  };

  return (
    <div>
      <h2>Hello World</h2>
      <button onClick={handleBackToGerente}>Volver a Gerente</button>
    </div>
  );
};

export default Reporte;