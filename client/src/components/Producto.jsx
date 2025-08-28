import "./css/producto.css";

export default function Producto({ producto }) {
  const tieneImagen = producto.image && producto.image.trim() !== "";
  const tieneVariaciones = producto.variations && producto.variations.length > 0;

  return (
    <div className={`producto-card ${tieneImagen && !tieneVariaciones ? "con-imagen" : "sin-imagen"}`}>
      {tieneImagen && !tieneVariaciones &&(
        <img
          src={`/images/${producto.image}`}
          alt={producto.title}
          className="producto-imagen"
        />
      )}
      <div
        className="producto-info"
        style={tieneVariaciones ? { fontSize: "1.5rem", fontWeight: "600" } : {}}
      >
        <h3
          className="producto-titulo"
          style={tieneVariaciones ? { fontSize: "1.9rem", fontWeight: "700", textAlign: "center", marginBottom: "10px" } : {}}
        >
          {producto.title}
        </h3>
        <p
          className="producto-descripcion"
          style={tieneVariaciones ? { fontSize: "1.44rem", textAlign: "center" } : {}}
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

    </div>
  );
}
