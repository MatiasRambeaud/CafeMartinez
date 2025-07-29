import React, { useEffect, useState } from "react";

const API_BASE = "api/products";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [simpleView, setSimpleView] = useState(false);
  const [priceEdits, setPriceEdits] = useState({});

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setProducts(data.payload || []);
    } catch (err) {
      alert("Error al obtener productos");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este producto?")) {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      fetchProducts();
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setEditedProduct({ ...product });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedProduct(null);
  };

  const handleSave = async () => {
    try {
      await fetch(`${API_BASE}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProduct),
      });
      setEditingId(null);
      setEditedProduct(null);
      fetchProducts();
    } catch (err) {
      alert("Error al actualizar producto");
    }
  };

  const handleChange = (field) => (e) => {
    const value = field === "status" ? e.target.checked : e.target.value;
    setEditedProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (id, value) => {
    setPriceEdits((prev) => ({ ...prev, [id]: value }));
  };

  const handleSavePrice = async (id) => {
    const newPrice = priceEdits[id];
    if (newPrice === undefined) return;
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: Number(newPrice) }),
      });
      setPriceEdits((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      fetchProducts();
    } catch {
      alert("Error al actualizar precio");
    }
  };

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.code.toLowerCase().includes(term)
    );
  });

  const groupedProducts = filteredProducts.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div className="admin-panel">
      <h1>Panel de Administración</h1>

      <div className="create-product-form">
        <h2>Crear nuevo producto</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const nuevoProducto = {
                title: e.target.title.value,
                description: e.target.description.value,
                price: parseFloat(e.target.price.value),
                category: e.target.category.value,
                code: e.target.code.value,
                image: e.target.image.value,
                status: e.target.status.checked,
              };
              await fetch(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoProducto),
              });
              e.target.reset();
              fetchProducts();
            } catch (err) {
              alert("Error al crear producto");
            }
          }}
        >
          <input name="title" placeholder="Nombre" required />
          <textarea name="description" placeholder="Descripción" required />
          <input name="price" type="number" placeholder="Precio" step="0.01" required />
          <input name="category" placeholder="Categoría" required />
          <input name="code" placeholder="Código" required />
          <input name="image" placeholder="Nombre de imagen (ej. pizza.jpg)" />
          <label>
            Activo:
            <input name="status" type="checkbox" defaultChecked />
          </label>
          <button type="submit">Crear producto</button>
        </form>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre, categoría o código"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "12px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={() => setSimpleView(!simpleView)}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          cursor: "pointer",
          borderRadius: "4px",
          border: "none",
          backgroundColor: simpleView ? "#0074D9" : "#28a745",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {simpleView ? "Volver a vista completa" : "Mostrar solo nombre y precio"}
      </button>

      {Object.entries(groupedProducts).map(([category, items]) => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <div className="product-list">
            {items.map((p) =>
              simpleView ? (
                <div key={p._id} className="product-simple-card">
                  <span className="product-name">{p.title}</span>
                  <input
                    type="number"
                    value={priceEdits[p._id] ?? p.price}
                    onChange={(e) => handlePriceChange(p._id, e.target.value)}
                    style={{ width: "100px", marginRight: "10px", padding: "4px" }}
                  />
                  <button onClick={() => handleSavePrice(p._id)}>Guardar</button>
                </div>
              ) : editingId === p._id ? (
                <div className="product-edit" key={p._id}>
                  <input
                    type="text"
                    value={editedProduct.title}
                    onChange={handleChange("title")}
                  />
                  <textarea
                    value={editedProduct.description}
                    onChange={handleChange("description")}
                  />
                  <input
                    type="text"
                    value={editedProduct.code}
                    onChange={handleChange("code")}
                  />
                  <input
                    type="number"
                    value={editedProduct.price}
                    onChange={handleChange("price")}
                  />
                  <input
                    type="text"
                    value={editedProduct.image}
                    onChange={handleChange("image")}
                  />
                  <input
                    type="text"
                    value={editedProduct.category}
                    onChange={handleChange("category")}
                  />
                  <label>
                    Activo:
                    <input
                      type="checkbox"
                      checked={editedProduct.status}
                      onChange={handleChange("status")}
                    />
                  </label>
                  <button onClick={handleSave}>Guardar</button>
                  <button onClick={handleCancelEdit} className="cancel">
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="product-info" key={p._id}>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <p><strong>Código:</strong> {p.code}</p>
                  <p><strong>Precio:</strong> ${p.price}</p>
                  <p><strong>Estado:</strong> {p.status ? "Activo" : "Inactivo"}</p>
                  <div className="product-actions">
                    <button onClick={() => handleEditClick(p)}>Editar</button>
                    <button onClick={() => handleDelete(p._id)} className="delete">
                      Eliminar
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ))}

      <style>{`
        .admin-panel { max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial; }
        h1 { text-align: center; margin-bottom: 20px; }
        .category-section { margin-bottom: 40px; }
        .category-title { font-size: 1.5em; margin-bottom: 10px; color: #0074D9; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        .product-list { display: flex; flex-direction: column; gap: 15px; }
        .product-simple-card { border: 1px solid #ccc; padding: 15px; border-radius: 6px; display: flex; align-items: center; gap: 10px; }
        .product-name { flex-grow: 1; font-weight: bold; }
        .product-info { display: flex; flex-direction: column; gap: 8px; }
        .product-edit { display: flex; flex-direction: column; gap: 10px; }
        .product-edit input, .product-edit textarea, .create-product-form input, .create-product-form textarea {
          padding: 8px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px;
        }
        .product-actions { display: flex; gap: 10px; margin-top: 10px; }
        .product-actions button, .product-edit button {
          padding: 6px 12px; font-size: 14px; cursor: pointer; border: none; border-radius: 4px;
        }
        .product-actions button { background-color: #28a745; color: white; }
        .product-actions .delete { background-color: #dc3545; }
        .product-edit .cancel { background-color: gray; color: white; }
        .create-product-form { background-color: #f4f4f4; padding: 20px; margin-bottom: 30px; border-radius: 8px; }
        .create-product-form h2 { margin-bottom: 15px; color: #333; }
        .create-product-form form { display: flex; flex-direction: column; gap: 10px; }
        .create-product-form button {
          width: fit-content; background-color: #007bff; color: white; border: none; padding: 8px 14px; border-radius: 4px; cursor: pointer;
        }
        .create-product-form label { display: flex; align-items: center; gap: 8px; }
      `}</style>
    </div>
  );
};

export default AdminPanel;