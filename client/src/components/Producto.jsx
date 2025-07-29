export default function Producto({ producto }) {
  return (
    <div className="producto-card">
      <img
        src={`/images/${producto.image}`}
        alt={producto.title}
        className="producto-imagen"
      />
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
          overflow: hidden;
          transition: transform 0.3s ease;
          width: 100%;
          display: flex;
          flex-direction: row;
          height: 120px;
        }
        .producto-card:hover {
          transform: scale(1.01);
        }
        .producto-imagen {
          width: 120px;
          height: 100%;
          object-fit: cover;
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
        }
        .producto-descripcion {
          font-size: 0.75rem;
          color: #c7c7c7;
          font-style: italic;
          margin: 2px 0 6px;
          line-height: 1.1;
          max-height: 2.4em;
          overflow: hidden;
        }
        .linea-precio {
          border: 0;
          border-top: 1px solid #d4af37;
          margin: 4px 0;
        }
        .producto-precio {
          font-size: 0.95rem;
          color: #d4af37;
          font-weight: bold;
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
        }
      `}</style>
    </div>
  );
}
