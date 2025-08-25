import { useEffect, useState } from "react";
import Producto from "./Producto";
import "./css/mostrarProductos.css";

export default function MostrarProductos() {
  const API_BASE = `${process.env.REACT_APP_PROXY}/api/products`;

  useEffect(() => {
    document.title = "Café Martines - Menú";
  }, []);

  const [productos, setProductos] = useState([]);
  const [mostrarFlecha, setMostrarFlecha] = useState(false);

  useEffect(() => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((json) => setProductos(json.payload));
  }, []);

  useEffect(() => {
  const manejarScroll = () => {
    setMostrarFlecha(window.scrollY > 300);
  };

  window.addEventListener("scroll", manejarScroll);
  return () => window.removeEventListener("scroll", manejarScroll);
}, []);


  const irArriba = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

        <button
          className={`scroll-to-top ${mostrarFlecha ? "visible" : "oculto"}`}
          onClick={irArriba}
        >
          ↑
        </button>

      </div>

    </>
  );
}
