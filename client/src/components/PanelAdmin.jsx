import React, { useEffect, useState } from "react";
import "./css/panelAdmin.css";

const API_BASE = `${process.env.REACT_APP_PROXY}/api/products`;

const AdminPanel = () => {
  useEffect(() => {
    document.title = "Café Martines - Administración";
  }, []);

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [simpleView, setSimpleView] = useState(false);
  const [priceEdits, setPriceEdits] = useState({});
  const [variations, setVariations] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_BASE, { credentials: "include" });
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
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE", credentials: "include" });
      fetchProducts();
    } catch {
      alert("Error al eliminar producto");
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

  const handleChange = (field) => (e) => {
    const value = field === "status" ? e.target.checked : e.target.value;
    if (field === "price") {
      setEditedProduct((prev) => ({ ...prev, [field]: Number(value) }));
    } else {
      setEditedProduct((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
  if (!editedProduct || !editingId) return;

  try {
    const formData = new FormData();
    formData.append("title", editedProduct.title);
    formData.append("description", editedProduct.description);
    formData.append("price", editedProduct.price);
    formData.append("category", editedProduct.category);
    formData.append("code", editedProduct.code);
    formData.append("status", editedProduct.status);

    if (editedProduct.variations?.length > 0) {
      formData.append("variations", JSON.stringify(editedProduct.variations));
    }

    // ✅ Subida de imagen: solo si hay archivo
    if (editedProduct.newImageFile instanceof File) {
      formData.append("image", editedProduct.newImageFile);
    }

    const res = await fetch(`${API_BASE}/${editingId}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
      // ❌ NO pongas headers aquí, el browser pone multipart/form-data automáticamente
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error del servidor: ${res.status} - ${errorText}`);
    }

    setEditingId(null);
    setEditedProduct(null);
    fetchProducts();
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    alert("Error al actualizar producto. Revisa la consola del navegador y del backend.");
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
        credentials: "include",
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
      p.title?.toLowerCase().includes(term) ||
      p.category?.toLowerCase().includes(term) ||
      p.code?.toLowerCase().includes(term)
    );
  });

  const groupedProducts = filteredProducts.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  // Variaciones nuevas
  const addVariation = () => setVariations([...variations, { nombre: "", precio: 0 }]);
  const updateVariation = (i, field, value) => {
    const newVars = [...variations];
    newVars[i][field] = field === "precio" ? Number(value) : value;
    setVariations(newVars);
  };
  const removeVariation = (i) => {
    const newVars = [...variations];
    newVars.splice(i, 1);
    setVariations(newVars);
  };

  const handleCreate = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("title", e.target.title.value);
    formData.append("description", e.target.description.value);
    formData.append("price", e.target.price.value);
    formData.append("category", e.target.category.value);
    formData.append("code", e.target.code.value);
    formData.append("status", e.target.status.checked);

    if (variations.length > 0) {
      const cleanVariations = variations.filter(
        (v) => v?.nombre.trim() !== "" && v?.precio !== 0
      );
      if (cleanVariations.length > 0) {
        // OJO: si querés que llegue como JSON en el body, stringify
        formData.append("variations", JSON.stringify(cleanVariations));
      }
    }

    if (e.target.image.files.length > 0) {
      formData.append("image", e.target.image.files[0]);
    }

    await fetch(API_BASE, {
      method: "POST",
      body: formData, // 👈 acá va el FormData
      credentials: "include",
    });

    e.target.reset();
    setVariations([]);
    fetchProducts();
  } catch {
    alert("Error al crear producto");
  }
};


  return (
    <div className="admin-panel">
      <h1>Panel de Administración</h1>

      <div className="create-product-form">
        <h2>Crear nuevo producto</h2>
        <form onSubmit={handleCreate}>
          <input name="title" placeholder="Nombre" required />
          <textarea name="description" placeholder="Descripción" required />
          <input name="price" type="number" placeholder="Precio" step="0.01" required />
          <input name="category" placeholder="Categoría" required />
          <input name="code" placeholder="Código" required />
          <input type="file" name="image" accept="image/*" />

          <label className="switch-label">
            Activo
            <label className="switch">
              <input name="status" type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </label>

          <div>
            <h3>Variaciones</h3>
            {variations.map((v, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                <input
                  type="text"
                  placeholder="Nombre variación"
                  value={v.nombre}
                  onChange={(e) => updateVariation(i, "nombre", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={v.precio}
                  onChange={(e) => updateVariation(i, "precio", e.target.value)}
                />
                <button type="button" onClick={() => removeVariation(i)}>
                  ❌
                </button>
              </div>
            ))}
            <button type="button" className="btn-variation" onClick={addVariation}>
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
        className="search-input"
      />

      <button
        onClick={() => setSimpleView(!simpleView)}
        className={`toggle-view ${simpleView ? "is-simple" : ""}`}
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
                      className="price-inline-input"
                    />
                    <button onClick={() => handleSavePrice(p._id)} className="btn-inline">
                      Guardar
                    </button>
                  </div>
                );
              }

              if (isEditing) {
                return (
                  <div className="product-info" key={p._id}>
                    {/* Resto del JSX de edición intacto */}
                    <h3>
                      <input
                        type="text"
                        value={editedProduct.title}
                        onChange={(e) => handleChange("title")(e)}
                        className="edit-input"
                      />
                    </h3>
                    <p>
                      <textarea
                        value={editedProduct.description}
                        onChange={(e) => handleChange("description")(e)}
                        className="edit-textarea"
                      />
                    </p>
                    <p>
                      <strong>Precio: </strong>
                      <input
                        type="number"
                        value={editedProduct.price}
                        onChange={(e) => handleChange("price")(e)}
                        step="0.01"
                        className="edit-input narrow"
                      />
                    </p>
                    <p>
                      <strong>Categoría: </strong>
                      <input
                        type="text"
                        value={editedProduct.category}
                        onChange={(e) => handleChange("category")(e)}
                        className="edit-input medium"
                      />
                    </p>
                    <p>
                      <strong>Código: </strong>
                      <input
                        type="text"
                        value={editedProduct.code}
                        onChange={(e) => handleChange("code")(e)}
                        className="edit-input narrow"
                      />
                    </p>
                    <p>
                      <strong>Imagen:</strong>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setEditedProduct((prev) => ({
                            ...prev,
                            newImageFile: e.target.files[0], // 👈 guardamos el archivo
                          }))
                        }
                      />
                    </p>
                    
                    <label className="switch-label">
                      Activo
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={editedProduct.status}
                          onChange={(e) => handleChange("status")(e)}
                        />
                        <span className="slider"></span>
                      </label>
                    </label>
                    <div>
                      <strong>Variaciones:</strong>
                      {(editedProduct.variations?.length || 0) === 0 && <p>No tiene variaciones</p>}
                      {(editedProduct.variations || []).map((v, i) => (
                        <div
                          key={i}
                          style={{ display: "flex", gap: "8px", marginTop: "6px", alignItems: "center" }}
                        >
                          <input
                            type="text"
                            placeholder="Nombre variación"
                            value={v.nombre}
                            onChange={(e) => {
                              const nuevasVar = [...editedProduct.variations];
                              nuevasVar[i] = { ...nuevasVar[i], nombre: e.target.value };
                              setEditedProduct((prev) => ({ ...prev, variations: nuevasVar }));
                            }}
                            className="edit-input"
                            style={{ flex: "1" }}
                          />
                          <input
                            type="number"
                            placeholder="Precio"
                            value={v.precio}
                            onChange={(e) => {
                              const nuevasVar = [...editedProduct.variations];
                              nuevasVar[i] = { ...nuevasVar[i], precio: Number(e.target.value) };
                              setEditedProduct((prev) => ({ ...prev, variations: nuevasVar }));
                            }}
                            className="edit-input narrow"
                          />
                          <button
                            type="button"
                            className="btn-inline danger"
                            onClick={() => {
                              const nuevasVar = [...editedProduct.variations];
                              nuevasVar.splice(i, 1);
                              setEditedProduct((prev) => ({ ...prev, variations: nuevasVar }));
                            }}
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-variation"
                        onClick={() => {
                          const nuevasVar = [...(editedProduct.variations || []), { nombre: "", precio: 0 }];
                          setEditedProduct((prev) => ({ ...prev, variations: nuevasVar }));
                        }}
                        style={{ marginTop: "8px" }}
                      >
                        ➕ Agregar variación
                      </button>
                    </div>
                    <div className="product-actions" style={{ marginTop: "12px" }}>
                      <button onClick={handleSave}>Guardar</button>
                      <button onClick={handleCancelEdit} className="delete" style={{ marginLeft: "10px" }}>
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
                    <button onClick={() => handleDelete(p._id)} className="delete">
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
