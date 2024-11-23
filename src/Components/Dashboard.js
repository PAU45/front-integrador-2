import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Obtener el usuario desde el almacenamiento local
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (userInfo && userInfo.rol === "admin") {
      setRole(userInfo.rol); // Solo si el rol es "admin"
    }
  }, []);

  if (!role) {
    return <div>No tienes acceso a esta área. Inicia sesión con el rol adecuado.</div>;
  }

  return (
    <div>
      <h2>Bienvenido, Admin!</h2>
      <p>Acceso autorizado al área de Administración.</p>
    </div>
  );
};

export default Dashboard;
