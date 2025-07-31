export default function Producto({ producto }) {
  const tieneImagen = producto.image && producto.image.trim() !== "";

  return (
    <div className={`producto-card ${tieneImagen ? "con-imagen" : "sin-imagen"}`}>
      {tieneImagen && (
        <img
          src={`/images/${producto.image}`}
          alt={producto.title}
          className="producto-imagen"
        />
      )}
      <div className="producto-info">
        <h3 className="producto-titulo">{producto.title}</h3>
        <p className="producto-descripcion">{producto.description}</p>
        <hr className="linea-precio" />
        <p className="producto-precio">${producto.price.toFixed(2)}</p>
      </div>

      <style>{`
        .producto-card {
          background-color: #2c241c;
          border: 1px solid #d4af37;
          border-radius: 14px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease;
          width: 100%;
          display: flex;
          overflow: hidden;
        }

        .producto-card:hover {
          transform: scale(1.01);
        }

        .con-imagen {
          flex-direction: row;
          height: 120px;
        }

        .sin-imagen {
          flex-direction: column;
          padding: 12px 16px;
          box-sizing: border-box;
        }

        .producto-imagen {
          width: 120px;
          height: 100%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .producto-info {
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
        }

        .producto-titulo {
          font-size: 1rem;
          margin: 0;
          color: #f8f8f8;
          word-break: break-word;
        }

        .producto-descripcion {
          font-size: 0.75rem;
          color: #c7c7c7;
          font-style: italic;
          line-height: 1.2;
          margin-top: 2px;
        }

        .linea-precio {
          border: 0;
          border-top: 1px solid #d4af37;
          margin: 6px 0;
        }

        .producto-precio {
          font-size: 0.95rem;
          color: #d4af37;
          font-weight: bold;
          font-family: 'Segoe UI', sans-serif;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
