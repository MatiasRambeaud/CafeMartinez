import { useEffect, useState } from "react";
import Producto from "./Producto"; // Componente en mayúscula

export default function MostrarProductos() {
  const [productos, setProductos] = useState([]);

  const getProducts = () => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((json) => setProductos(json.payload));
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      {productos.map((producto) => (
        <Producto key={producto.id} producto={producto} />
      ))}
    </div>
  );
}
