import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ExportExcel() {
  const data = [
    { nombre: "Matías", edad: 18 },
    { nombre: "Sofi", edad: 20 },
  ];

  const exportToExcel = () => {
    // Creamos la hoja
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Creamos el libro
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    // Convertimos a binario
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Guardamos
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "datos.xlsx");
  };

  return (
    <div>
      <h2>Exportar Excel</h2>
      <button onClick={exportToExcel}>Descargar Excel</button>
    </div>
  );
}
