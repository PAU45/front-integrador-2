import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacturaProveedorForm = () => {
    const [proveedores, setProveedores] = useState([]);
    const [proveedor, setProveedor] = useState('');
    const [numeroFactura, setNumeroFactura] = useState('');
    const [estado, setEstado] = useState('pendiente');
    const [monto, setMonto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaVencimiento, setFechaVencimiento] = useState(''); // Nuevo campo
    const [mensaje, setMensaje] = useState('');
    const [usuario, setUsuario] = useState(null); // Usuario logueado

    // Obtener el token del almacenamiento local
    const token = localStorage.getItem('access');
    console.log("Token de acceso:", token);

    // Configurar Axios para incluir el token en las solicitudes
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Fetch para cargar proveedores y usuario logueado
    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/auth/proveedores/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("Datos de proveedores:", response.data); // Agregar console.log para depuración
                if (response.data.length > 0) {
                    setProveedores(response.data);
                } else {
                    setMensaje("No se encontraron proveedores.");
                }
            } catch (error) {
                console.error("Error al obtener proveedores:", error);
                setMensaje("Hubo un error al cargar los proveedores.");
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
            fetchProveedores();
            fetchUsuario();
        } else {
            setMensaje("No se encontró el token de acceso.");
        }
    }, [token]);

    // Manejador de envío de formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!proveedor || !monto || !numeroFactura || !fechaVencimiento) {
            setMensaje("Por favor complete todos los campos.");
            return;
        }

        const factura = {
            proveedor: proveedor, 
            monto: monto,
            estado: estado,
            descripcion: descripcion,
            numero_factura: numeroFactura,
            fecha_vencimiento: fechaVencimiento, // Nuevo campo
            usuario: usuario ? usuario.id : null, // ID del usuario logueado
        };

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/auth/facturas-proveedores/", factura, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 201) {
                setMensaje("Factura generada exitosamente");
                // Limpiar el formulario después del éxito
                setProveedor('');
                setMonto('');
                setEstado('pendiente');
                setDescripcion('');
                setNumeroFactura('');
                setFechaVencimiento(''); // Limpiar el campo de fecha de vencimiento
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
            <h1>Crear Nueva Factura de Proveedor</h1>
            {mensaje && <p>{mensaje}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Proveedor</label>
                    <select value={proveedor} onChange={e => setProveedor(e.target.value)} required>
                        <option value="">Seleccione un proveedor</option>
                        {proveedores.map(proveedor => (
                            <option key={proveedor.id} value={proveedor.id}>
                                {proveedor.nombre}
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
                    <label>Fecha de Vencimiento</label>
                    <input 
                        type="date" 
                        value={fechaVencimiento} 
                        onChange={e => setFechaVencimiento(e.target.value)} 
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

export default FacturaProveedorForm;