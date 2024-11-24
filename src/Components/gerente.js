import React, { useEffect, useState } from "react";
import axios from "axios";

const Gerente = () => {
  const [role, setRole] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    // Obtener el usuario desde el almacenamiento local
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (userInfo && userInfo.rol === "gerente") {
      setRole(userInfo.rol); // Solo si el rol es "gerente"
    }

    // Obtener el token de acceso
    const token = localStorage.getItem("access");

    // Configurar Axios para incluir el token en las solicitudes
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Obtener los registros de auditoría desde el backend
    const fetchAuditLogs = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/audit-logs/");
        setAuditLogs(response.data);
      } catch (error) {
        console.error("Error al obtener los registros de auditoría:", error);
      }
    };

    if (token) {
      fetchAuditLogs();
    }
  }, []);

  if (!role) {
    return <div>No tienes acceso a esta área. Inicia sesión con el rol adecuado.</div>;
  }

  return (
    <div>
      <h2>Bienvenido, Gerente!</h2>
      <p>Acceso autorizado al área de Gerente.</p>
      <h3>Registros de Auditoría</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Acción</th>
            <th>Timestamp</th>
            <th>Detalles</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.action}</td>
              <td>{log.timestamp}</td>
              <td>{log.details}</td>
              <td>{log.user_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Gerente;