import * as XLSX from "xlsx";

export default function FromExcel(file, onSuccess, onError) {
    if (!file) {
        if (onError) onError("No se proporcionó ningún archivo");
        return;
    }

    const reader = new FileReader();

    // Define required and optional fields
    const requiredFields = ['title', 'description', 'price', 'category', 'code'];
    const optionalFields = ['status', 'variations', 'image'];
    const allFields = [...requiredFields, ...optionalFields];

    const validateAndFilterData = (rawData) => {
        const validProducts = [];
        
        rawData.forEach((item, index) => {
            // Check if all required fields are present and not empty
            const hasAllRequired = requiredFields.every(field => {
                const value = item[field];
                return value !== undefined && value !== null && value !== '';
            });

            if (hasAllRequired) {
                // Create filtered object with only the specified fields
                const filteredProduct = {};
                
                allFields.forEach(field => {
                    if (item[field] !== undefined && item[field] !== null && item[field] !== '') {
                        filteredProduct[field] = item[field];
                    }
                });

                validProducts.push(filteredProduct);
            } else {
                console.warn(`Fila ${index + 1} omitida: faltan campos requeridos`, item);
            }
        });

        return validProducts;
    };

    reader.onload = (e) => {
        try {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const rawData = XLSX.utils.sheet_to_json(sheet);
            const filteredData = validateAndFilterData(rawData);
            
            console.log("Raw Excel data:", JSON.stringify(rawData, null, 2));
            console.log("Filtered and validated data:", JSON.stringify(filteredData, null, 2));
            console.log(`Procesados: ${filteredData.length} de ${rawData.length} productos`);
            
            if (onSuccess) {
                onSuccess(filteredData);
            }
            
            return filteredData;
        } catch (err) {
            console.error("Error parsing Excel:", err);
            if (onError) {
                onError("Error al procesar el archivo Excel");
            }
        }
    };

    reader.onerror = () => {
        const errorMsg = "Error al leer el archivo";
        console.error(errorMsg);
        if (onError) {
            onError(errorMsg);
        }
    };

    reader.readAsBinaryString(file);
}

