import { useEffect, useState } from "react";
import Producto from "./Producto";

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

  const productosPorCategoria = productos.reduce((acc, producto) => {
    if (!acc[producto.category]) acc[producto.category] = [];
    acc[producto.category].push(producto);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(productosPorCategoria).map(([categoria, items]) => (
        <section key={categoria} className="categoria-section">
          <h2 className="categoria-titulo">{categoria}</h2>
          <div className="menu-grid">
            {items.map((producto) => (
              <Producto key={producto._id} producto={producto} />
            ))}
          </div>
        </section>
      ))}

      <style>{`
        .categoria-section {
          margin-bottom: 40px;
          padding: 0 20px;
        }
        .categoria-titulo {
          font-size: 2rem;
          color: #d35400;
          margin-bottom: 20px;
          border-bottom: 2px solid #d35400;
          padding-bottom: 5px;
          text-transform: capitalize;
        }
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          background-color: #fff9e6;
          padding: 10px;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}
