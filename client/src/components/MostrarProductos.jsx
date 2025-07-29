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
      <header className="menu-header">
        <div className="logo-area">
          {/* Reemplazá esto por una <img src="logo.png" /> si tenés el logo */}
          <h1 className="titulo-cafe">Café Martínez</h1>
        </div>
      </header>

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
        body {
          margin: 0;
          background-color: #1e1e1e;
        }

        .menu-header {
          background-color: #141414;
          padding: 20px;
          text-align: center;
          border-bottom: 2px solid #c59d5f;
        }

        .logo-area {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .titulo-cafe {
          font-family: 'Georgia', serif;
          color: #f5f5f5;
          font-size: 2.4rem;
          margin: 0;
          letter-spacing: 1px;
        }

        .menu-container {
          max-width: 480px;
          margin: 0 auto;
          padding: 24px 16px;
          font-family: 'Georgia', serif;
          background-color: #1e1e1e;
          color: #f0f0f0;
        }

        .categoria-section {
          margin-bottom: 50px;
        }

        .categoria-titulo {
          font-size: 2rem;
          color: #f5f5f5;
          border-bottom: 2px solid #c59d5f;
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
