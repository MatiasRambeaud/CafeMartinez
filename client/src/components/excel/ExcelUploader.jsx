import React, { useState } from "react";
import FromExcel from "./FromExcel";

export default function ExcelUploader() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        setData([]);

        FromExcel(
            file,
            (jsonData) => {
                setData(jsonData);
                setIsLoading(false);
            },
            (errorMsg) => {
                setError(errorMsg);
                setIsLoading(false);
            }
        );
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2>Importar Excel</h2>
            
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    style={{
                        padding: "10px",
                        border: "2px dashed #ccc",
                        borderRadius: "5px",
                        width: "100%"
                    }}
                />
            </div>

            {isLoading && <p>Procesando archivo...</p>}
            
            {error && (
                <div style={{ color: "red", marginBottom: "20px" }}>
                    {error}
                </div>
            )}

            {data.length > 0 && (
                <div>
                    <h3>Datos procesados ({data.length} filas):</h3>
                    <div style={{
                        backgroundColor: "#f5f5f5",
                        padding: "15px",
                        borderRadius: "5px",
                        maxHeight: "400px",
                        overflow: "auto"
                    }}>
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    </div>
                </div>
            )}
        </div>
    );
}
