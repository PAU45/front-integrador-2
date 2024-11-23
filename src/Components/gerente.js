import React, { useEffect, useState } from "react";

const Gerente = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Obtener el usuario desde el almacenamiento local
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (userInfo && userInfo.rol === "gerente") {
      setRole(userInfo.rol); // Solo si el rol es "gerente"
    }
  }, []);

  if (!role) {
    return <div>No tienes acceso a esta área. Inicia sesión con el rol adecuado.</div>;
  }

  return (
    <div>
      <h2>Bienvenido, Gerente!</h2>
      <p>Acceso autorizado al área de Gerente.</p>
    </div>
  );
};

export default Gerente;
