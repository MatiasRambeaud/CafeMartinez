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
        <p className="producto-precio">${producto.price.toFixed(2)}</p>
      </div>

      <style>{`
        .producto-card {
          background-color: #fff;
          border: 1px solid #f0e1c0;
          border-radius: 16px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: transform 0.3s ease;
          width: 100%;
          box-sizing: border-box;
        }
        .producto-card:hover {
          transform: translateY(-5px);
        }
        .producto-imagen {
          width: 100%;
          height: 220px;
          object-fit: cover;
        }
        .producto-info {
          padding: 20px;
          text-align: center;
        }
        .producto-titulo {
          font-size: 1.6rem;
          margin-bottom: 10px;
          color: #6e3708;
          font-family: 'Georgia', serif;
        }
        .producto-descripcion {
          font-size: 1rem;
          color: #555;
          margin-bottom: 14px;
          font-style: italic;
        }
        .producto-precio {
          font-size: 1.2rem;
          color: #152e16ff;
          font-weight: 600;
          font-family: 'Segoe UI', sans-serif;
        }
      `}</style>
    </div>
  );
}
