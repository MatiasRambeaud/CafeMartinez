import { useEffect, useState } from "react";
import Producto from "./Producto";

export default function MostrarProductos() {

  const API_BASE = `${process.env.REACT_APP_PROXY}/api/products`;

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((json) => setProductos(json.payload));
  });

  const productosPorCategoria = productos.reduce((acc, producto) => {
    if (!acc[producto.category]) acc[producto.category] = [];
    acc[producto.category].push(producto);
    return acc;
  }, {});

  const scrollToCategoria = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <>
      <div className="menu-container">
        <header className="header">
          <img src="/images/logo.png" alt="Café Martínez" className="logo" />
          <h1 className="titulo">Café Martínez</h1>
        </header>

        <nav className="categoria-nav">
          {Object.keys(productosPorCategoria).map((categoria) => (
            <button
              key={categoria}
              className="categoria-btn"
              onClick={() => scrollToCategoria(categoria)}
            >
              {categoria}
            </button>
          ))}
        </nav>

        {Object.entries(productosPorCategoria).map(([categoria, items]) => (
          <section key={categoria} id={categoria} className="categoria-section">
            <h2 className="categoria-titulo">{categoria}</h2>
            <div className="menu-grid">
              {items.map((producto) => (
                <Producto key={producto._id} producto={producto} />
              ))}
            </div>
          </section>
        ))}

        <a
          href={`https://wa.me/${process.env.REACT_APP_PHONE}`}
          className="whatsapp-float"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/images/whatsapp_logo.png"
            alt="WhatsApp"
            className="whatsapp-icon"
          />
        </a>


      </div>

      <style>{`
        .menu-container {
          max-width: 480px;
          margin: 0 auto;
          padding: 20px 16px;
          font-family: 'Georgia', serif;
          background-color: #1f1a17;
          color: #f7f7f7;
        }

        .header {
          text-align: center;
          margin-bottom: 16px;
        }

        .logo {
          width: 100%;
          max-width: 220px;
          margin-bottom: 8px;
        }

        .titulo {
          font-size: 2.2rem;
          color: #d4af37;
          margin-bottom: 12px;
        }

        .categoria-nav {
          display: flex;
          flex-wrap: wrap;           
          gap: 12px;
          padding: 16px 0;
          margin-bottom: 24px;
          justify-content: center;   
        }


        .categoria-btn {
          flex: 0 0 auto;
          padding: 10px 20px;
          font-size: 1rem;
          font-weight: 600;
          background: linear-gradient(135deg, #d4af37, #c49000);
          color: #1f1a17;
          border: none;
          border-radius: 30px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .categoria-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }

        .categoria-section {
          margin-bottom: 50px;
        }

        .categoria-titulo {
          font-size: 1.6rem;
          color: #d4af37;
          margin-bottom: 20px;
          text-align: center;
          text-transform: capitalize;
        }

        .menu-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        :root, html, body {
          margin: 0;
          padding: 0;
          background-color: #1f1a17;
          min-height: 100vh;
        }

        .whatsapp-float {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 999;
          width: 45px;
          height: 45px;
          background-color: rgba(37, 211, 102, 0.9);
          border-radius: 50%;
          border: solid rgba(37, 211, 102, 0.9) 2px;
          background: radial-gradient(circle at center, #25D366 40%, rgba(37,211,102,0.25) 100%);
          box-shadow: 0 4px 16px rgba(37, 211, 102, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .whatsapp-float:hover {
          transform: scale(1.1);
          background-color: rgba(37, 211, 102, 1);
        }

        .whatsapp-icon {
          width: 45px;
          height: 45px;
        }

      `}</style>
    </>
  );
}
