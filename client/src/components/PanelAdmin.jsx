import React, { useEffect, useState } from "react";
import "./css/panelAdmin.css";

const API_BASE = `${process.env.REACT_APP_PROXY}/api/products`;

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [simpleView, setSimpleView] = useState(false);
  const [priceEdits, setPriceEdits] = useState({});
  const [variations, setVariaciones] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setProducts(data.payload || []);
    } catch {
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
    setEditedProduct({ ...product, variations: product.variations || [] });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedProduct(null);
  };

  const handleSave = async () => {
    try {
      await fetch(`${API_BASE}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedProduct),
      });
      setEditingId(null);
      setEditedProduct(null);
      fetchProducts();
    } catch {
      alert("Error al actualizar producto");
    }
  };

  const handleChange = (field) => (e) => {
    const value = field === "status" ? e.target.checked : e.target.value;
    if (field === "price") {
      setEditedProduct((prev) => ({ ...prev, [field]: Number(value) }));
    } else {
      setEditedProduct((prev) => ({ ...prev, [field]: value }));
    }
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
                variations: variations,
              };
              await fetch(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoProducto),
              });
              e.target.reset();
              setVariaciones([]);
              fetchProducts();
            } catch {
              alert("Error al crear producto");
            }
          }}
        >
          <input name="title" placeholder="Nombre" required />
          <textarea name="description" placeholder="Descripción" required />
          <input
            name="price"
            type="number"
            placeholder="Precio"
            step="0.01"
            required
          />
          <input name="category" placeholder="Categoría" required />
          <input name="code" placeholder="Código" required />
          <input name="image" placeholder="Imagen (ej. pizza.jpg)" />
          <label>
            Activo:
            <input name="status" type="checkbox" defaultChecked />
          </label>

          <div>
            <h3>Variaciones</h3>
            {variations.map((v, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: "10px", marginBottom: "8px" }}
              >
                <input
                  type="text"
                  placeholder="Nombre variación"
                  value={v.nombre}
                  onChange={(e) => {
                    const nuevas = [...variations];
                    nuevas[i].nombre = e.target.value;
                    setVariaciones(nuevas);
                  }}
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={v.precio}
                  onChange={(e) => {
                    const nuevas = [...variations];
                    nuevas[i].precio = Number(e.target.value);
                    setVariaciones(nuevas);
                  }}
                />
                <button type="button" onClick={() => {
                  const nuevas = [...variations];
                  nuevas.splice(i, 1);
                  setVariaciones(nuevas);
                }}>
                  ❌
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setVariaciones([...variations, { nombre: "", precio: 0 }])}>
              Agregar variación
            </button>
          </div>

          <button type="submit">Crear producto</button>
        </form>
      </div>

      <input
        type="text"
        placeholder="Buscar..."
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
            {items.map((p) => {
              const isEditing = editingId === p._id;

              if (simpleView) {
                return (
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
                );
              }

              if (isEditing) {
                return (
                  <div className="product-info" key={p._id}>
                    <h3>
                      <input
                        type="text"
                        value={editedProduct.title}
                        onChange={(e) => handleChange("title")(e)}
                        style={{
                          fontSize: "1.3em",
                          fontWeight: "bold",
                          width: "100%",
                          boxSizing: "border-box",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          padding: "6px",
                        }}
                      />
                    </h3>
                    <p>
                      <textarea
                        value={editedProduct.description}
                        onChange={(e) => handleChange("description")(e)}
                        style={{
                          width: "100%",
                          minHeight: "60px",
                          boxSizing: "border-box",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          padding: "6px",
                          resize: "vertical",
                        }}
                      />
                    </p>
                    <p>
                      <strong>Precio: </strong>
                      <input
                        type="number"
                        value={editedProduct.price}
                        onChange={(e) => handleChange("price")(e)}
                        step="0.01"
                        style={{
                          width: "100px",
                          boxSizing: "border-box",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          padding: "4px",
                        }}
                      />
                    </p>
                    <p>
                      <strong>Categoría: </strong>
                      <input
                        type="text"
                        value={editedProduct.category}
                        onChange={(e) => handleChange("category")(e)}
                        style={{
                          width: "200px",
                          boxSizing: "border-box",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          padding: "4px",
                        }}
                      />
                    </p>
                    <p>
                      <strong>Código: </strong>
                      <input
                        type="text"
                        value={editedProduct.code}
                        onChange={(e) => handleChange("code")(e)}
                        style={{
                          width: "150px",
                          boxSizing: "border-box",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          padding: "4px",
                        }}
                      />
                    </p>
                    <p>
                      <strong>Imagen: </strong>
                      <input
                        type="text"
                        value={editedProduct.image}
                        onChange={(e) => handleChange("image")(e)}
                        placeholder="ej. pizza.jpg"
                        style={{
                          width: "200px",
                          boxSizing: "border-box",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          padding: "4px",
                        }}
                      />
                    </p>
                    <p>
                      <label style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <input
                          type="checkbox"
                          checked={editedProduct.status}
                          onChange={(e) => handleChange("status")(e)}
                        />
                        Activo
                      </label>
                    </p>

                    <div>
                      <strong>Variaciones:</strong>
                      {(editedProduct.variations?.length || 0) === 0 && (
                        <p>No tiene variaciones</p>
                      )}
                      {(editedProduct.variations || []).map((v, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: "8px",
                            marginTop: "6px",
                            alignItems: "center",
                          }}
                        >
                          <input
                            type="text"
                            placeholder="Nombre variación"
                            value={v.nombre}
                            onChange={(e) => {
                              const nuevasVar = [...editedProduct.variations];
                              nuevasVar[i] = { ...nuevasVar[i], nombre: e.target.value };
                              setEditedProduct((prev) => ({
                                ...prev,
                                variations: nuevasVar,
                              }));
                            }}
                            style={{ flex: "1" }}
                          />
                          <input
                            type="number"
                            placeholder="Precio"
                            value={v.precio}
                            onChange={(e) => {
                              const nuevasVar = [...editedProduct.variations];
                              nuevasVar[i] = {
                                ...nuevasVar[i],
                                precio: Number(e.target.value),
                              };
                              setEditedProduct((prev) => ({
                                ...prev,
                                variations: nuevasVar,
                              }));
                            }}
                            style={{ width: "80px" }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const nuevasVar = [...editedProduct.variations];
                              nuevasVar.splice(i, 1);
                              setEditedProduct((prev) => ({
                                ...prev,
                                variations: nuevasVar,
                              }));
                            }}
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const nuevasVar = [
                            ...(editedProduct.variations || []),
                            { nombre: "", precio: 0 },
                          ];
                          setEditedProduct((prev) => ({
                            ...prev,
                            variations: nuevasVar,
                          }));
                        }}
                        style={{ marginTop: "8px" }}
                      >
                        Agregar variación
                      </button>
                    </div>

                    <div className="product-actions" style={{ marginTop: "12px" }}>
                      <button onClick={handleSave}>Guardar</button>
                      <button
                        onClick={handleCancelEdit}
                        className="delete"
                        style={{ marginLeft: "10px" }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div className="product-info" key={p._id}>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <p>
                    <strong>Precio:</strong> ${p.price}
                  </p>
                  {p.variations?.length > 0 && (
                    <div>
                      <strong>Variaciones:</strong>
                      <ul>
                        {p.variations.map((v, i) => (
                          <li key={i}>
                            {v.nombre} - ${v.precio}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="product-actions">
                    <button onClick={() => handleEditClick(p)}>Editar</button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="delete"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

    </div>
  );
};

export default AdminPanel;
