export default function Producto({ producto }) {
  const tieneImagen = producto.image && producto.image.trim() !== "";
  const tieneVariaciones = producto.variations && producto.variations.length > 0;

  return (
    <div className={`producto-card ${tieneImagen ? "con-imagen" : "sin-imagen"}`}>
      {tieneImagen && (
        <img
          src={`/images/${producto.image}`}
          alt={producto.title}
          className="producto-imagen"
        />
      )}
      <div
        className="producto-info"
        style={tieneVariaciones ? { fontSize: "1.1rem", fontWeight: "600" } : {}}
      >
        <h3
          className="producto-titulo"
          style={tieneVariaciones ? { fontSize: "1.4rem", fontWeight: "700", textAlign: "center", marginBottom: "10px" } : {}}
        >
          {producto.title}
        </h3>
        <p
          className="producto-descripcion"
          style={tieneVariaciones ? { fontSize: "1.05rem", textAlign: "center" } : {}}
        >
          {producto.description}
        </p>
        <hr className="linea-precio" />

        {!tieneVariaciones && (
          <p className="producto-precio">${producto.price.toFixed(2)}</p>
        )}

        {tieneVariaciones && (
          <ul className="producto-variaciones-horizontal">
            {producto.variations.map((v, i) => (
              <li key={i} className="variacion-item">
                <div className="nombre-variacion">{v.nombre}</div>
                <div className="precio-variacion">${Number(v.precio).toFixed(2)}</div>
              </li>
            ))}
          </ul>
        )}
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
          color: #f8f8f8;
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

        .producto-variaciones-horizontal {
          display: flex;
          gap: 20px;
          margin-top: 8px;
          padding-left: 0;
          list-style: none;
          color: #e3c46b;
          font-size: 1rem;
          font-weight: 600;
          overflow-x: auto;
          white-space: nowrap;
          justify-content: center; /* Centra horizontalmente */
          align-items: center; /* Centra verticalmente */
        }

        .producto-variaciones-horizontal::-webkit-scrollbar {
          height: 6px;
        }
        .producto-variaciones-horizontal::-webkit-scrollbar-thumb {
          background-color: #bfa742;
          border-radius: 3px;
        }

        .variacion-item {
          display: flex;
          flex-direction: column;
          min-width: 100px;
          padding: 6px 10px;
          text-align: center;
          box-sizing: border-box;
          /* Sin fondo */
          background: none;
        }

        .nombre-variacion {
          font-weight: 700;
          margin-bottom: 4px;
          color: #f8f8f8;
          font-size: 1.1rem;
        }

        .precio-variacion {
          font-weight: 600;
          color: #d4af37;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}
