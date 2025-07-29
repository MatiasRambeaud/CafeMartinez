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
      <div className="menu-container">
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
      </div>

      <style>{`
        .menu-container {
          max-width: 480px;
          margin: 0 auto;
          padding: 20px 16px;
          font-family: 'Georgia', serif;
          background-color: #fffaf2;
        }
        .categoria-section {
          margin-bottom: 50px;
        }
        .categoria-titulo {
          font-size: 2rem;
          color: #8e4b10;
          border-bottom: 2px dashed #c59d5f;
          padding-bottom: 10px;
          margin-bottom: 20px;
          text-align: center;
          text-transform: capitalize;
        }
        .menu-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
      `}</style>
    </>
  );
}
