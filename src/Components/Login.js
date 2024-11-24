import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar errores previos

        try {
            console.log("Enviando datos de inicio de sesión:", { email, password });
            const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
                email,
                contraseña: password  , // Asegúrate de que el backend espera 'password' y no 'contraseña'
            });

            console.log("Respuesta del servidor:", response.data);

            // Guardar tokens en el almacenamiento local
            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
            localStorage.setItem("user", JSON.stringify({
                nombre: response.data.nombre,
                rol: response.data.rol,
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
            console.error("Error al iniciar sesión:", error);
            if (error.response && error.response.status === 400) {
                setError("Credenciales inválidas. Intenta de nuevo.");
            } else {
                setError("Error al iniciar sesión. Intenta de nuevo más tarde.");
            }
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;