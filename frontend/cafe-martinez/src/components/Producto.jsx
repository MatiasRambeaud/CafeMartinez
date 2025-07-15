export default function Producto({ producto }) {
  return (
    <div>
      <h3>Nombre: {producto.title}</h3>
      <p>Descripción: {producto.description}</p>
      <p>Precio: ${producto.price}</p>
      <p>Categoría: {producto.category}</p>
      <img src={`/images/${producto.image}`} alt={producto.title} />
    </div>
  );
}
