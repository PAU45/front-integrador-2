import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
        email,
        contraseña: password,
      });

      // Guardar tokens en el almacenamiento local
      localStorage.setItem("user", JSON.stringify({
        nombre: response.data.nombre,
        rol: response.data.rol,
        accessToken: response.data.access,
        refreshToken: response.data.refresh,
      }));
      // Leer el rol del usuario desde la respuesta
      const userRole = response.data.rol;

      // Redireccionar según el rol
      if (userRole === "gerente") {
        navigate("/gerente");
      } else if (userRole === "contador") {
        navigate("/contador");
      } else if (userRole === "admin") {
        navigate("/dashboard");
      } else {
        // Si el rol no es válido, puedes redirigir a una página de error o inicio
        setError("Rol no reconocido. Acceso denegado.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("Credenciales inválidas. Intenta de nuevo.");
      } else {
        setError("Error de conexión. Intenta más tarde.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
