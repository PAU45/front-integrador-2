import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate
import axios from 'axios'; // Asegúrate de importar axios

const Contador = () => {
  const [role, setRole] = useState(null);
  const [clientes, setClientes] = useState([]); // Estado para almacenar clientes
  const [proveedores, setProveedores] = useState([]); // Estado para almacenar proveedores
  const navigate = useNavigate(); // Inicializamos useNavigate

  // Obtener los clientes desde el backend
  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get("http://127.0.0.1:8000/api/auth/clientes/", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setClientes(response.data);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  // Obtener los proveedores desde el backend
  const fetchProveedores = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get("http://127.0.0.1:8000/api/auth/proveedores/", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProveedores(response.data);
    } catch (error) {
      console.error("Error al obtener los proveedores:", error);
    }
  };

  useEffect(() => {
    // Obtener el usuario desde el almacenamiento local
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("access");

    if (userInfo && userInfo.rol === "contador") {
      setRole(userInfo.rol); // Solo si el rol es "contador"
    }

    // Si el token no está presente, redirigir al login
    if (!token) {
      navigate("/login");
    }

    // Fetch de clientes y proveedores
    fetchClientes();
    fetchProveedores();
  }, [navigate]);

  if (!role) {
    return <div>No tienes acceso a esta área. Inicia sesión con el rol adecuado.</div>;
  }

  // Función para redirigir a la lista de facturas
  const irAFacturaList = () => {
    navigate("/factura-list"); // Redirige a la lista de facturas
  };

  // Función para redirigir al formulario de creación de factura
  const irAFacturaForm = () => {
    navigate("/factura-form"); // Redirige al formulario de creación de factura
  };

  // Función para redirigir a la página de chat
  const irAChat = () => {
    navigate("/chat/"); // Redirige a la página de chat
  };

  const irAPrueba = () => {
    navigate("/prueba"); // Redirige a la página de prueba
  };

  const irProveedor = () => {
    navigate("/factura-proveedor"); // Redirige a la página de prueba
  };

  const irCliente = () => {
    navigate("/FormCLiente"); 
  };

  const irCrearProveedor = () => {
    navigate("/proveedor-form"); 
  };

  const irProfile = () => {
    navigate("/profile"); 
  };
  const irproveedoresList = () => {
    navigate("/proveedor-list"); 
  };

  return (
    <div>
      <h2>Bienvenido, Contador!</h2>
      <p>Acceso autorizado al área de Contador.</p>

      {/* Botón para redirigir a la lista de facturas */}
      <button onClick={irAFacturaList}>Ver Lista de Facturas</button>

      {/* Botón para redirigir al formulario de creación de factura */}
      <button onClick={irAFacturaForm}>Crear Factura</button>

      {/* Botón para redirigir a la página de chat */}
      <button onClick={irAChat}>Ir al Chat</button>

      {/* Botón para redirigir a la página de prueba */}
      <button onClick={irAPrueba}>Ir a Prueba</button>

      {/* Botón para redirigir a la página de prueba */}
      <button onClick={irProveedor}>CREAR FACTURA DE PROVEEDOR</button>

      {/* Botón para redirigir a la página de prueba */}
      <button onClick={irCliente}>Cliente</button>

      {/* Botón para redirigir a la página de prueba */}
      <button onClick={irCrearProveedor}>proveedor</button>

      {/* Botón para redirigir a la página de prueba */}
      <button onClick={irProfile}>perfil</button>
          
      {/* Botón para redirigir a la página de prueba */}
      <button onClick={irproveedoresList}>Listado De Proveedores</button>

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
    </div>
  );
};

export default Contador;