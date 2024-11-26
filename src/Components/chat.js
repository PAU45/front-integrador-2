import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [usuario, setUsuario] = useState(null); // Usuario logueado
  const [mensaje, setMensaje] = useState(''); // Mensaje de estado

  // Obtener el token del almacenamiento local
  const token = localStorage.getItem('access');
  console.log("Token de acceso:", token);

  // Configurar Axios para incluir el token en las solicitudes
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // Fetch para cargar mensajes y usuario logueado
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/auth/simple-messages/');
        setMessages(response.data);
      } catch (error) {
        console.error("Error al obtener mensajes:", error);
        setMensaje("Hubo un error al cargar los mensajes.");
      }
    };

    const fetchUsuario = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/auth/usuario-logueado/');
        setUsuario(response.data);
      } catch (error) {
        console.error("Error al obtener el usuario logueado:", error);
        setMensaje("Hubo un error al cargar el usuario logueado.");
      }
    };

    if (token) {
      fetchMessages();
      fetchUsuario();
    } else {
      setMensaje("No se encontró el token de acceso.");
    }
  }, [token]);

  const sendMessage = async () => {
    if (message) {
      try {
        await axios.post('http://127.0.0.1:8000/api/auth/simple-messages/', {
          user: usuario.id,
          content: message,
        });
        setMessage('');
        // Actualizar la lista de mensajes
        const response = await axios.get('http://127.0.0.1:8000/api/auth/simple-messages/');
        setMessages(response.data);
      } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        setMensaje("Hubo un error al enviar el mensaje.");
      }
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      {mensaje && <p>{mensaje}</p>}
      <div>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img src={msg.user_avatar} alt="avatar" style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />
            <div>
              <strong>{msg.user_nombre}:</strong> {msg.content}
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Escribe un mensaje..."
        style={{ width: '80%', padding: '10px', marginRight: '10px' }}
      />
      <button onClick={sendMessage} style={{ padding: '10px' }}>Enviar</button>
    </div>
  );
};

export default Chat;