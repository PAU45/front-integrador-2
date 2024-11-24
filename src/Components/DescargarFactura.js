import React from 'react';

const DescargarFactura = ({ facturaId }) => {
  const pdfUrl = `/descargar_pdf/${facturaId}`;
  const excelUrl = `/descargar_excel/${facturaId}`;

  return (
    <div>
      <h3>Descargar Factura</h3>
      <p>Elija el formato para descargar la factura:</p>
      <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Descargar PDF</a><br />
      <a href={excelUrl} target="_blank" rel="noopener noreferrer">Descargar Excel</a>
    </div>
  );
};

export default DescargarFactura;
