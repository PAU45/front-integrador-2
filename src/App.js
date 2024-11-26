import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Gerente from "./Components/gerente";
import Contador from "./Components/contador";
import Dashboard from "./Components/Dashboard";
import FacturaForm from "./Components/FacturaForm";
import FacturaList from "./Components/FacturaList";
import Reporte from "./Components/reporte";
import ChatPage from "./Components/ChatPage"; // Asegúrate de que el nombre del archivo sea correcto
import Prueba from "./Components/prueba";
import FacturaProveedorForm from "./Components/facturaProveedor";
import ClienteForm from "./Components/ClienteForm";
import ProveedorForm from "./Components/proveedorForm"; // Importar el nuevo componente
import Profile from "./Components/profile";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/gerente" element={<Gerente />} />
        <Route path="/contador" element={<Contador />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/factura-form" element={<FacturaForm />} />
        <Route path="/factura-list" element={<FacturaList />} />
        <Route path="/reportes" element={<Reporte />} />
        <Route path="/chat" element={<ChatPage />} /> {/* Asegúrate de usar `element` en lugar de `component` */}
        <Route path="/prueba" element={<Prueba />} />
        <Route path="/factura-proveedor" element={<FacturaProveedorForm />} />
        <Route path="/FormCliente" element={<ClienteForm />} />
        <Route path="/proveedor-form" element={<ProveedorForm />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;