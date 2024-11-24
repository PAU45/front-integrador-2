import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate

const Contador = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate(); // Inicializamos useNavigate

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

  return (
    <div>
      <h2>Bienvenido, Contador!</h2>
      <p>Acceso autorizado al área de Contador.</p>

      {/* Botón para redirigir a la lista de facturas */}
      <button onClick={irAFacturaList}>Ver Lista de Facturas</button>

      {/* Botón para redirigir al formulario de creación de factura */}
      <button onClick={irAFacturaForm}>Crear Factura</button>
    </div>
  );
};

export default Contador;