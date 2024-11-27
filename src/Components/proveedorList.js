import React, { useEffect, useState } from "react";
import axios from "axios";

const ProveedorList = () => {
  const [facturasProveedores, setFacturasProveedores] = useState([]);

  useEffect(() => {
    // Obtener el token de acceso
    const token = localStorage.getItem('access');

    // Configurar Axios para incluir el token en las solicitudes
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Obtener las facturas de proveedores desde el backend
    const fetchFacturasProveedores = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/facturas-proveedores/");
        setFacturasProveedores(response.data);
      } catch (error) {
        console.error("Error al obtener las facturas de proveedores:", error);
      }
    };

    fetchFacturasProveedores();
  }, []);

  return (
    <div>
      <h3>Facturas de Proveedores</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Proveedor</th>
            <th>Usuario</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Descripción</th>
            <th>Número de Factura</th>
            <th>Fecha de Vencimiento</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {facturasProveedores.map((factura) => (
            <tr key={factura.id}>
              <td>{factura.id}</td>
              <td>{factura.proveedor}</td>
              <td>{factura.usuario}</td>
              <td>{factura.fecha}</td>
              <td>{factura.monto}</td>
              <td>{factura.estado}</td>
              <td>{factura.descripcion}</td>
              <td>{factura.numero_factura}</td>
              <td>{factura.fecha_vencimiento}</td>
              <td>{factura.accion ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProveedorList;