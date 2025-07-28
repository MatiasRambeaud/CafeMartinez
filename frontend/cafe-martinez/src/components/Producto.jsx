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
        <p className="producto-precio">Precio: <strong>${producto.price}</strong></p>
      </div>

      <style>{`
        .producto-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 15px;
          max-width: 300px;
          background: #fffbea;
          transition: transform 0.2s ease;
          cursor: pointer;
        }
        .producto-card:hover {
          transform: scale(1.01);
        }
        .producto-imagen {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 12px;
        }
        .producto-info {
          text-align: center;
        }
        .producto-titulo {
          font-size: 1.3rem;
          margin: 0 0 8px;
          color: #d35400;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .producto-descripcion {
          font-size: 0.9rem;
          color: #555;
          margin-bottom: 10px;
          min-height: 48px;
        }
        .producto-precio {
          font-size: 1.1rem;
          color: #27ae60;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
