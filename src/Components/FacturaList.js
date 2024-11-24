import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const FacturaList = () => {
    const [facturas, setFacturas] = useState([]);
    const [mensaje, setMensaje] = useState('');

    // Obtener el token del almacenamiento local
    const token = localStorage.getItem('access');
    console.log("Token de acceso:", token);

    // Configurar Axios para incluir el token en las solicitudes
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    useEffect(() => {
        const fetchFacturas = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/auth/facturas-clientes/');
                if (response.data.length > 0) {
                    const storedFacturas = JSON.parse(localStorage.getItem('importedFacturas')) || [];
                    setFacturas([...response.data, ...storedFacturas]);
                } else {
                    setMensaje("No se encontraron facturas.");
                }
            } catch (error) {
                console.error("Error al obtener facturas:", error);
                setMensaje("Hubo un error al cargar las facturas.");
            }
        };

        if (token) {
            fetchFacturas();
        } else {
            setMensaje("No se encontró el token de acceso.");
        }
    }, [token]);

    // Función para exportar todas las facturas a PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Lista de Facturas", 20, 10);
        doc.autoTable({
            head: [['Número de Factura', 'Estado', 'Fecha de Vencimiento', 'Monto', 'Descripción', 'Fecha', 'Cliente', 'Usuario']],
            body: facturas.map(factura => [
                factura.numero_factura,
                factura.estado,
                factura.fecha_vencimiento,
                factura.monto,
                factura.descripcion,
                factura.fecha,
                factura.cliente_nombre,
                factura.usuario_nombre
            ])
        });
        doc.save('facturas.pdf');
    };

    // Función para exportar todas las facturas a Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(facturas.map(factura => ({
            'Número de Factura': factura.numero_factura,
            'Estado': factura.estado,
            'Fecha de Vencimiento': factura.fecha_vencimiento,
            'Monto': factura.monto,
            'Descripción': factura.descripcion,
            'Fecha': factura.fecha,
            'Cliente': factura.cliente_nombre,
            'Usuario': factura.usuario_nombre
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Facturas');
        XLSX.writeFile(workbook, 'facturas.xlsx');
    };

    // Función para exportar una factura a PDF
    const exportFacturaToPDF = (factura) => {
        const doc = new jsPDF();
        doc.text("Factura", 20, 10);
        doc.autoTable({
            head: [['Número de Factura', 'Estado', 'Fecha de Vencimiento', 'Monto', 'Descripción', 'Fecha', 'Cliente', 'Usuario']],
            body: [[
                factura.numero_factura,
                factura.estado,
                factura.fecha_vencimiento,
                factura.monto,
                factura.descripcion,
                factura.fecha,
                factura.cliente_nombre,
                factura.usuario_nombre
            ]]
        });
        doc.save(`factura_${factura.numero_factura}.pdf`);
    };

    // Función para exportar una factura a Excel
    const exportFacturaToExcel = (factura) => {
        const worksheet = XLSX.utils.json_to_sheet([{
            'Número de Factura': factura.numero_factura,
            'Estado': factura.estado,
            'Fecha de Vencimiento': factura.fecha_vencimiento,
            'Monto': factura.monto,
            'Descripción': factura.descripcion,
            'Fecha': factura.fecha,
            'Cliente': factura.cliente_nombre,
            'Usuario': factura.usuario_nombre
        }]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Factura');
        XLSX.writeFile(workbook, `factura_${factura.numero_factura}.xlsx`);
    };

    // Función para importar facturas desde un archivo Excel
    const importFromExcel = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const importedFacturas = XLSX.utils.sheet_to_json(worksheet);
            console.log("Facturas importadas:", importedFacturas);

            // Verificar y agregar campos faltantes
            const facturasConCampos = importedFacturas.map(factura => ({
                id: factura['ID'] || Math.random().toString(36).substr(2, 9), // Generar un ID único si no está presente
                numero_factura: factura['Número de Factura'] || '',
                estado: factura['Estado'] || '',
                fecha_vencimiento: factura['Fecha de Vencimiento'] || '',
                monto: factura['Monto'] || '',
                descripcion: factura['Descripción'] || '',
                fecha: factura['Fecha'] || '',
                cliente_nombre: factura['Cliente'] || '',
                usuario_nombre: factura['Usuario'] || ''
            }));

            setFacturas(prevFacturas => {
                const updatedFacturas = [...prevFacturas, ...facturasConCampos];
                localStorage.setItem('importedFacturas', JSON.stringify(updatedFacturas));
                return updatedFacturas;
            });
        };
        reader.readAsArrayBuffer(file);
    };

    // Función para importar facturas desde un archivo PDF
    const importFromPDF = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = async (e) => {
            const typedArray = new Uint8Array(e.target.result);
            const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
            const numPages = pdf.numPages;
            let textContent = '';

            // Extraer texto de cada página del PDF
            for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
                const page = await pdf.getPage(pageNumber);
                const content = await page.getTextContent();
                const pageText = content.items.map(item => item.str).join(' ');
                textContent += pageText;
            }

            console.log("Contenido extraído del PDF:", textContent);
            // Aquí puedes agregar lógica para procesar el contenido extraído y mapearlo a un formato adecuado
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div>
            <h1>Lista de Facturas</h1>
            {mensaje && <p>{mensaje}</p>}
            <ul>
                {facturas.map((factura, index) => (
                    <li key={index}>
                        {factura.numero_factura} - {factura.estado} - {factura.fecha_vencimiento} - {factura.monto} - {factura.descripcion} - {factura.fecha} - {factura.cliente_nombre} - {factura.usuario_nombre}
                        <button onClick={() => exportFacturaToPDF(factura)}>Exportar a PDF</button>
                        <button onClick={() => exportFacturaToExcel(factura)}>Exportar a Excel</button>
                    </li>
                ))}
            </ul>
            <button onClick={exportToPDF}>Exportar todas a PDF</button>
            <button onClick={exportToExcel}>Exportar todas a Excel</button>
            <div>
                <h2>Importar Facturas</h2>
                <label htmlFor="import-excel" className="import-button">Importar desde Excel</label>
                <input id="import-excel" type="file" accept=".xlsx" onChange={importFromExcel} style={{ display: 'none' }} />
                <label htmlFor="import-pdf" className="import-button">Importar desde PDF</label>
                <input id="import-pdf" type="file" accept=".pdf" onChange={importFromPDF} style={{ display: 'none' }} />
            </div>
        </div>
    );
};

export default FacturaList;