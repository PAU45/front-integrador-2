import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importar useNavigate para redirigir

const Gerente = () => {
  const [role, setRole] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [facturasClientes, setFacturasClientes] = useState([]);
  const [facturasProveedores, setFacturasProveedores] = useState([]);
  const [usuariosFacturados, setUsuariosFacturados] = useState([]); // Estado para almacenar los datos de usuarios facturados
  const navigate = useNavigate(); // Crear una instancia de useNavigate

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

    // Obtener los clientes desde el backend
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/clientes/");
        setClientes(response.data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    // Obtener los proveedores desde el backend
    const fetchProveedores = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/proveedores/");
        setProveedores(response.data);
      } catch (error) {
        console.error("Error al obtener los proveedores:", error);
      }
    };

    // Obtener las facturas de clientes desde el backend
    const fetchFacturasClientes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/facturas-clientes/");
        setFacturasClientes(response.data);
      } catch (error) {
        console.error("Error al obtener las facturas de clientes:", error);
      }
    };

    // Obtener las facturas de proveedores desde el backend
    const fetchFacturasProveedores = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/facturas-proveedores/");
        setFacturasProveedores(response.data);
      } catch (error) {
        console.error("Error al obtener las facturas de proveedores:", error);
      }
    };

    // Obtener la cantidad de facturas por usuario desde el backend
    const fetchUsuariosFacturados = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/total-facturas-por-usuario/", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUsuariosFacturados(response.data);
      } catch (error) {
        console.error("Error al obtener la cantidad de facturas por usuario:", error);
      }
    };

    if (token) {
      fetchAuditLogs();
      fetchClientes();
      fetchProveedores();
      fetchFacturasClientes();
      fetchFacturasProveedores();
      fetchUsuariosFacturados();
    }
  }, []);

  const aprobarFactura = async (id, tipo) => {
    try {
      const url = tipo === "cliente"
        ? `http://127.0.0.1:8000/api/auth/facturas-clientes/${id}/`
        : `http://127.0.0.1:8000/api/auth/facturas-proveedores/${id}/`;
      await axios.patch(url, { accion: true });
      alert("Factura aprobada exitosamente");
      navigate("/reporte"); // Redirigir a la página de reportes
    } catch (error) {
      console.error("Error al aprobar la factura:", error);
    }
  };

  const rechazarFactura = async (id, tipo) => {
    try {
      const url = tipo === "cliente"
        ? `http://127.0.0.1:8000/api/auth/facturas-clientes/${id}/`
        : `http://127.0.0.1:8000/api/auth/facturas-proveedores/${id}/`;
      await axios.patch(url, { accion: false });
      alert("Factura rechazada exitosamente");
      navigate("/reporte"); // Redirigir a la página de reportes
    } catch (error) {
      console.error("Error al rechazar la factura:", error);
    }
  };

  if (!role) {
    return <div>No tienes acceso a esta área. Inicia sesión con el rol adecuado.</div>;
  }

  // Función para redirigir a la página de chat
  const irAChat = () => {
    navigate("/chat"); // Redirige a la página de chat
  };

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

      <h3>Clientes</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Proveedores</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor) => (
            <tr key={proveedor.id}>
              <td>{proveedor.id}</td>
              <td>{proveedor.nombre}</td>
              <td>{proveedor.email}</td>
              <td>{proveedor.telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Facturas de Clientes</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Número de Factura</th>
            <th>Estado</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {facturasClientes.map((factura) => (
            <tr key={factura.id}>
              <td>{factura.id}</td>
              <td>{factura.numero_factura}</td>
              <td>{factura.estado}</td>
              <td>{factura.monto}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Facturas de Proveedores</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Número de Factura</th>
            <th>Estado</th>
            <th>Monto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturasProveedores.map((factura) => (
            <tr key={factura.id}>
              <td>{factura.id}</td>
              <td>{factura.numero_factura}</td>
              <td>{factura.estado}</td>
              <td>{factura.monto}</td>
              <td>
                <button onClick={() => aprobarFactura(factura.id, "proveedor")}>Aprobar</button>
                <button onClick={() => rechazarFactura(factura.id, "proveedor")}>Rechazar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Usuarios que han Facturado</h3>
      <ul>
        {usuariosFacturados.map((usuario) => (
          <li key={usuario.id}>
            Nombre: {usuario.nombre}, Email: {usuario.email}, Total Facturas Cliente: {usuario.total_facturas_cliente}, Total Facturas Proveedor: {usuario.total_facturas_proveedor}
          </li>
        ))}
      </ul>

      {/* Botón para redirigir a la página de chat */}
      <button onClick={irAChat}>Ir al Chat</button>
    </div>
  );
};

export default Gerente;