import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacturaForm = () => {
    const [facturas, setFacturas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [cliente, setCliente] = useState('');
    const [numeroFactura, setNumeroFactura] = useState('');
    const [estado, setEstado] = useState('pendiente');
    const [monto, setMonto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [usuario, setUsuario] = useState(null); // Usuario logueado

    // Obtener el token del almacenamiento local
    const token = localStorage.getItem('access');
    console.log("Token de acceso:", token);

    // Configurar Axios para incluir el token en las solicitudes
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Fetch para cargar facturas, clientes y usuario logueado
    useEffect(() => {
        const fetchFacturas = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/auth/facturas-clientes/');
                if (response.data.length > 0) {
                    setFacturas(response.data);
                } else {
                    setMensaje("No se encontraron facturas.");
                }
            } catch (error) {
                console.error("Error al obtener facturas:", error);
                setMensaje("Hubo un error al cargar las facturas.");
            }
        };

        const fetchClientes = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/auth/clientes/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("Datos de clientes:", response.data); // Agregar console.log para depuración
                if (response.data.length > 0) {
                    setClientes(response.data);
                } else {
                    setMensaje("No se encontraron clientes.");
                }
            } catch (error) {
                console.error("Error al obtener clientes:", error);
                setMensaje("Hubo un error al cargar los clientes.");
            }
        };

        const fetchUsuario = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/auth/usuario-logueado/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("Datos del usuario logueado:", response.data); // Agregar console.log para depuración
                setUsuario(response.data);
            } catch (error) {
                console.error("Error al obtener el usuario logueado:", error);
                setMensaje("Hubo un error al cargar el usuario logueado.");
            }
        };

        if (token) {
            fetchFacturas();
            fetchClientes();
            fetchUsuario();
        } else {
            setMensaje("No se encontró el token de acceso.");
        }
    }, [token]);

    // Manejador de envío de formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cliente || !monto || !numeroFactura) {
            setMensaje("Por favor complete todos los campos.");
            return;
        }

        const factura = {
            cliente: cliente, 
            monto: monto,
            estado: estado,
            descripcion: descripcion,
            numero_factura: numeroFactura,
            usuario: usuario ? usuario.id : null, // ID del usuario logueado
        };

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/auth/facturas-clientes/", factura, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 201) {
                setMensaje("Factura generada exitosamente");
                // Limpiar el formulario después del éxito
                setCliente('');
                setMonto('');
                setEstado('pendiente');
                setDescripcion('');
                setNumeroFactura('');
            } else {
                setMensaje("Error al generar la factura. Código de estado: " + response.status);
            }
        } catch (error) {
            console.error("Error al generar la factura:", error);
            setMensaje("Hubo un error al generar la factura. Detalles: " + error.message);
        }
    };

    return (
        <div>
            <h1>Crear Nueva Factura</h1>
            {mensaje && <p>{mensaje}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Cliente</label>
                    <select value={cliente} onChange={e => setCliente(e.target.value)} required>
                        <option value="">Seleccione un cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Número de Factura</label>
                    <input 
                        type="text" 
                        value={numeroFactura} 
                        onChange={e => setNumeroFactura(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Estado</label>
                    <select value={estado} onChange={e => setEstado(e.target.value)} required>
                        <option value="pendiente">Pendiente</option>
                        <option value="pagada">Pagada</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                </div>
                <div>
                    <label>Monto</label>
                    <input 
                        type="number" 
                        value={monto} 
                        onChange={e => setMonto(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Descripción</label>
                    <textarea 
                        value={descripcion} 
                        onChange={e => setDescripcion(e.target.value)} 
                    />
                </div>
                <button type="submit">Generar Factura</button>
            </form>
        </div>
    );
};

export default FacturaForm;