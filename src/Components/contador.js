import React, { useEffect, useState } from "react";

const Contador = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Obtener el usuario desde el almacenamiento local
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (userInfo && userInfo.rol === "contador") {
      setRole(userInfo.rol); // Solo si el rol es "contador"
    }
  }, []);

  if (!role) {
    return <div>No tienes acceso a esta área. Inicia sesión con el rol adecuado.</div>;
  }

  return (
    <div>
      <h2>Bienvenido, Contador!</h2>
      <p>Acceso autorizado al área de Contador.</p>
    </div>
  );
};

export default Contador;
