import React, { useEffect, useState } from "react";
import "./css/panelAdmin.css";

const API_BASE = `${process.env.REACT_APP_PROXY}/api/products`;
const API_CAT = `${process.env.REACT_APP_PROXY}/api/categories`;
const API_SUB = `${process.env.REACT_APP_PROXY}/api/subcategories`;

const AdminPanel = () => {
  useEffect(() => {
    document.title = "Neldo Martinez - Administración";
  }, []);

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [simpleView, setSimpleView] = useState(false);
  const [priceEdits, setPriceEdits] = useState({});
  const [variations, setVariations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newProdAssignType, setNewProdAssignType] = useState("category"); // "category" | "subcategory"
  const [newProdCategoryId, setNewProdCategoryId] = useState("");
  const [newProdSubcategoryId, setNewProdSubcategoryId] = useState("");
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newSubcategory, setNewSubcategory] = useState({ name: "", description: "", categoryId: "" });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({ show: false, type: '', id: '', name: '' });
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, type: '', item: null });
  const [editingItem, setEditingItem] = useState(null);
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [showSubcategorySelect, setShowSubcategorySelect] = useState(false);
  const [editingValue, setEditingValue] = useState({ name: '', description: '' });
  const [showConfirmDialog, setShowConfirmDialog] = useState({ show: false, type: '', id: '', name: '', onConfirm: null });
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: 0,
    code: "",
    status: true,
    categoryId: "",
    subcategoryId: "",
    categoryName: "",
    subcategoryName: "",
    assignType: "category"
  });
  const [newProductImageFile, setNewProductImageFile] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_BASE, { credentials: "include" });
      const data = await res.json();
      setProducts(data.payload || []);
    } catch {
      alert("Error al obtener productos");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(API_CAT);
      const data = await res.json();
      setCategories(data.payload || []);
    } catch {
      // ignore
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await fetch(API_SUB);
      const data = await res.json();
      setSubcategories(data.payload || []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
  }, []);

  const handleEditClick = (product) => {
    setEditingId(product._id);
    const assignType = product.subcategoryId ? "subcategory" : "category";
    setEditedProduct({
      ...product,
      variations: product.variations || [],
      assignType,
      categoryId: product.categoryId || "",
      subcategoryId: product.subcategoryId || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE", credentials: "include" });
      fetchProducts();
    } catch {
      alert("Error al eliminar producto");
    }
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
      formData.append("code", editedProduct.code);
      formData.append("status", editedProduct.status);

      // Hierarchical assignment on edit
      if (editedProduct.assignType === "subcategory" && editedProduct.subcategoryId) {
        formData.append("subcategoryId", editedProduct.subcategoryId);
      } else if (editedProduct.assignType === "category" && editedProduct.categoryId) {
        formData.append("categoryId", editedProduct.categoryId);
      } else if (editedProduct.category) {
        // fallback compatibility
        formData.append("category", editedProduct.category);
      }

      if (editedProduct.variations?.length > 0) {
        formData.append("variations", JSON.stringify(editedProduct.variations));
      }

      // ✅ Subida de imagen: solo si hay archivo
      if (editedProduct.newImageFile instanceof File) {
        formData.append("image", editedProduct.newImageFile);
      }
      if(editedProduct.removeImage){
        formData.append("removeImage", editedProduct.removeImage);
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
      alert("Error al actualizar producto. Revisar cambios");
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

  // Función para manejar la edición de un ítem en línea
  const handleInlineEdit = (item, type) => {
    setEditingItem({ ...item, type });
    setEditingValue({
      name: item.name,
      description: item.description || ''
    });
  };

  // Guardar cambios de la edición en línea
  const saveInlineEdit = async () => {
    if (!editingItem) return;

    try {
      const url = editingItem.type === 'category' 
        ? `${API_CAT}/${editingItem._id}`
        : `${API_SUB}/${editingItem._id}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingValue.name.trim(),
          description: editingValue.description.trim(),
          ...(editingItem.type === 'subcategory' && { categoryId: editingItem.categoryId })
        }),
        credentials: 'include'
      });

      if (response.ok) {
        if (editingItem.type === 'category') {
          await fetchCategories();
          // Actualizar la categoría seleccionada si se está editando
          if (newProduct.categoryId === editingItem._id) {
            setNewProduct({ ...newProduct, categoryName: editingValue.name });
          }
        } else {
          await fetchSubcategories();
          // Actualizar la subcategoría seleccionada si se está editando
          if (newProduct.subcategoryId === editingItem._id) {
            setNewProduct({ ...newProduct, subcategoryName: editingValue.name });
          }
        }
        showNotification(`${editingItem.type === 'category' ? 'Categoría' : 'Subcategoría'} actualizada exitosamente`);
        setEditingItem(null);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar');
      }
    } catch (error) {
      showNotification(error.message || 'Error al actualizar', 'error');
    }
  };

  // Eliminar un ítem con confirmación
  const confirmDelete = (id, name, type, onConfirm) => {
    setShowConfirmDialog({
      show: true,
      type,
      id,
      name,
      onConfirm
    });
  };

  // Función para mostrar notificaciones
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
  };

  // Iniciar edición de categoría
  const startEditingCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description || ''
    });
  };

  // Iniciar edición de subcategoría
  const startEditingSubcategory = (subcategory) => {
    setEditingSubcategory(subcategory);
    setNewSubcategory({
      name: subcategory.name,
      description: subcategory.description || '',
      categoryId: subcategory.categoryId._id || subcategory.categoryId
    });
  };

  // Manejar eliminación de categoría
  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`${API_CAT}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        await fetchCategories();
        showNotification('Categoría eliminada exitosamente');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar categoría');
      }
    } catch (error) {
      showNotification(error.message || 'Error al eliminar categoría', 'error');
    } finally {
      setShowDeleteConfirm({ show: false, type: '', id: '', name: '' });
    }
  };

  // Manejar eliminación de subcategoría
  const handleDeleteSubcategory = async (id) => {
    try {
      const response = await fetch(`${API_SUB}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        await fetchSubcategories();
        showNotification('Subcategoría eliminada exitosamente');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar subcategoría');
      }
    } catch (error) {
      showNotification(error.message || 'Error al eliminar subcategoría', 'error');
    } finally {
      setShowDeleteConfirm({ show: false, type: '', id: '', name: '' });
    }
  };

  // Manejar actualización de categoría
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    try {
      const response = await fetch(`${API_CAT}/${editingCategory._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategory.name.trim(),
          description: newCategory.description.trim()
        }),
        credentials: 'include'
      });
      
      if (response.ok) {
        setEditingCategory(null);
        setNewCategory({ name: '', description: '' });
        await fetchCategories();
        showNotification('Categoría actualizada exitosamente');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar categoría');
      }
    } catch (error) {
      showNotification(error.message || 'Error al actualizar categoría', 'error');
    }
  };

  // Manejar creación de categoría
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(API_CAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategory.name.trim(),
          description: newCategory.description.trim()
        }),
        credentials: 'include'
      });
      
      if (response.ok) {
        setNewCategory({ name: '', description: '' });
        await fetchCategories();
        showNotification('Categoría creada exitosamente');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear categoría');
      }
    } catch (error) {
      showNotification(error.message || 'Error al crear categoría', 'error');
    }
  };

  // Manejar actualización de subcategoría
  const handleUpdateSubcategory = async (e) => {
    e.preventDefault();
    if (!editingSubcategory || !newSubcategory.categoryId) return;
    
    try {
      const response = await fetch(`${API_SUB}/${editingSubcategory._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSubcategory.name.trim(),
          description: newSubcategory.description.trim(),
          categoryId: newSubcategory.categoryId
        }),
        credentials: 'include'
      });
      
      if (response.ok) {
        setEditingSubcategory(null);
        setNewSubcategory({ name: '', description: '', categoryId: '' });
        await fetchSubcategories();
        showNotification('Subcategoría actualizada exitosamente');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar subcategoría');
      }
    } catch (error) {
      showNotification(error.message || 'Error al actualizar subcategoría', 'error');
    }
  };

  // Manejar creación de subcategoría
  const handleCreateSubcategory = async (e) => {
    e.preventDefault();
    if (!newSubcategory.categoryId) {
      showNotification('Por favor seleccione una categoría', 'error');
      return;
    }
    
    try {
      const response = await fetch(API_SUB, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSubcategory.name.trim(),
          description: newSubcategory.description.trim(),
          categoryId: newSubcategory.categoryId
        }),
        credentials: 'include'
      });
      
      if (response.ok) {
        setNewSubcategory({ name: '', description: '', categoryId: '' });
        await fetchSubcategories();
        showNotification('Subcategoría creada exitosamente');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear subcategoría');
      }
    } catch (error) {
      showNotification(error.message || 'Error al crear subcategoría', 'error');
    }
  };

  // Manejar creación de producto
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('title', newProduct.title);
      formData.append('description', newProduct.description);
      formData.append('price', newProduct.price);
      formData.append('code', newProduct.code);
      formData.append('status', newProduct.status);
      
      if (newProduct.assignType === 'subcategory' && newProduct.subcategoryId) {
        formData.append('subcategoryId', newProduct.subcategoryId);
      } else if (newProduct.categoryId) {
        formData.append('categoryId', newProduct.categoryId);
      }
      
      if (variations.length > 0) {
        formData.append('variations', JSON.stringify(variations));
      }

      // Imagen al crear producto (opcional)
      if (newProductImageFile instanceof File) {
        formData.append('image', newProductImageFile);
      }
      
      const response = await fetch(API_BASE, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (response.ok) {
        setNewProduct({
          title: '',
          description: '',
          price: 0,
          code: '',
          status: true,
          categoryId: '',
          subcategoryId: '',
          categoryName: '',
          subcategoryName: '',
          assignType: 'category'
        });
        setVariations([]);
        setNewProductImageFile(null);
        await fetchProducts();
        showNotification('Producto creado exitosamente');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear producto');
      }
    } catch (error) {
      showNotification(error.message || 'Error al crear producto', 'error');
    }
  };

  // Cancelar edición
  const cancelEdit = () => {
    setEditingCategory(null);
    setEditingSubcategory(null);
    setEditingItem(null);
    setNewCategory({ name: '', description: '' });
    setNewSubcategory({ name: '', description: '', categoryId: '' });
  };

  // Manejar clic derecho para mostrar menú contextual
  const handleContextMenu = (e, type, item) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      type,
      item
    });
  };

  // Renderizar menú contextual
  const renderContextMenu = () => {
    if (!contextMenu.show) return null;
    
    const handleAction = (action) => {
      if (action === 'delete') {
        setShowDeleteConfirm({
          show: true,
          type: contextMenu.type,
          id: contextMenu.item._id,
          name: contextMenu.item.name
        });
      } else if (action === 'edit') {
        if (contextMenu.type === 'category') {
          startEditingCategory(contextMenu.item);
        } else if (contextMenu.type === 'subcategory') {
          startEditingSubcategory(contextMenu.item);
        }
      }
      setContextMenu({ ...contextMenu, show: false });
    };

    return (
      <div 
        className="context-menu" 
        style={{ left: contextMenu.x, top: contextMenu.y }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="context-menu-item" onClick={() => handleAction('edit')}>
          <span>✏️</span> Editar
        </div>
        <div className="context-menu-item delete" onClick={() => handleAction('delete')}>
          <span>🗑️</span> Eliminar
        </div>
      </div>
    );
  };

  // Renderizar formulario de edición en línea
  const renderInlineEditForm = () => {
    if (!editingItem) return null;
    
    return (
      <div className="inline-edit-form">
        <input
          type="text"
          value={editingValue.name}
          onChange={(e) => setEditingValue({...editingValue, name: e.target.value})}
          placeholder={`Nombre de ${editingItem.type === 'category' ? 'la categoría' : 'la subcategoría'}`}
          required
        />
        <textarea
          value={editingValue.description}
          onChange={(e) => setEditingValue({...editingValue, description: e.target.value})}
          placeholder={`Descripción (opcional)`}
          rows="2"
        />
        <div className="inline-edit-form-buttons">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setEditingItem(null)}
          >
            Cancelar
          </button>
          <button 
            type="button" 
            className="btn-primary"
            onClick={saveInlineEdit}
          >
            Guardar
          </button>
        </div>
      </div>
    );
  };

  // Renderizar diálogo de confirmación
  const renderConfirmDialog = () => {
    if (!showDeleteConfirm.show && !showConfirmDialog.show) return null;
    
    // Diálogo de confirmación para eliminación desde selectores
    if (showConfirmDialog.show) {
      return (
        <div className="overlay" onClick={() => setShowConfirmDialog({ ...showConfirmDialog, show: false })}>
          <div className="select-confirm-dialog" onClick={e => e.stopPropagation()}>
            <p>
              ¿Estás seguro de que deseas eliminar {showConfirmDialog.type === 'category' ? 'la categoría' : 'la subcategoría'}
              <strong> "{showConfirmDialog.name}"</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="select-confirm-dialog-buttons">
              <button 
                className="btn-secondary"
                onClick={() => setShowConfirmDialog({ ...showConfirmDialog, show: false })}
              >
                Cancelar
              </button>
              <button 
                className="btn-danger"
                onClick={async () => {
                  if (showConfirmDialog.onConfirm) {
                    await showConfirmDialog.onConfirm();
                  }
                  setShowConfirmDialog({ ...showConfirmDialog, show: false });
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Diálogo de confirmación original
    if (showDeleteConfirm.show) {

    const handleConfirm = async () => {
      if (showDeleteConfirm.type === 'category') {
        await handleDeleteCategory(showDeleteConfirm.id);
      } else if (showDeleteConfirm.type === 'subcategory') {
        await handleDeleteSubcategory(showDeleteConfirm.id);
      }
    };

    return (
      <div className="confirm-dialog" onClick={() => setShowDeleteConfirm({ ...showDeleteConfirm, show: false })}>
        <div className="confirm-dialog-content" onClick={(e) => e.stopPropagation()}>
          <p className="confirm-dialog-message">
            ¿Estás seguro de que deseas eliminar {showDeleteConfirm.type === 'category' ? 'la categoría' : 'la subcategoría'}
            <strong> "{showDeleteConfirm.name}"</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="confirm-dialog-buttons">
            <button 
              className="btn-secondary"
              onClick={() => setShowDeleteConfirm({ ...showDeleteConfirm, show: false })}
            >
              Cancelar
            </button>
            <button 
              className="btn-danger"
              onClick={handleConfirm}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Renderizar el componente
return (
  <div className="admin-panel" onClick={() => setContextMenu({ ...contextMenu, show: false })}>
    <h1>Panel de Administración</h1>
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button onClick={() => setNotification({ ...notification, show: false })}>×</button>
        </div>
      )}

      {/* Menú contextual */}
      {renderContextMenu()}

      {/* Diálogo de confirmación */}
      {renderConfirmDialog()}
      
      {/* Formulario de edición en línea */}
      {renderInlineEditForm()}

      <div className="taxonomies">
        <h2>Categorías y Subcategorías</h2>
        
        {/* Lista de categorías existentes */}
        <div className="categories-list" style={{ marginBottom: '30px' }}>
          <h3>Categorías existentes</h3>
          {categories.length === 0 ? (
            <p>No hay categorías creadas</p>
          ) : (
            <div className="items-grid">
              {categories.map((category) => (
                <div 
                  key={category._id}
                  className="category-item"
                  onContextMenu={(e) => handleContextMenu(e, 'category', category)}
                >
                  <div className="item-name">{category.name}</div>
                  <div className="item-description">{category.description || 'Sin descripción'}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lista de subcategorías existentes */}
        <div className="subcategories-list" style={{ marginBottom: '30px' }}>
          <h3>Subcategorías existentes</h3>
          {subcategories.length === 0 ? (
            <p>No hay subcategorías creadas</p>
          ) : (
            <div className="items-grid">
              {subcategories.map((subcategory) => {
                const category = categories.find((c) => c._id === subcategory.categoryId);
                return (
                  <div 
                    key={subcategory._id}
                    className="subcategory-item"
                    onContextMenu={(e) => handleContextMenu(e, 'subcategory', subcategory)}
                  >
                    <div className="item-name">{subcategory.name}</div>
                    <div className="item-description">{subcategory.description || 'Sin descripción'}</div>
                    <div className="item-category">Categoría: {category ? category.name : 'Sin categoría'}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="taxo-forms">
          <div className="form-container">
            <h3>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
            <form 
              onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} 
              className="admin-form"
            >
              <div className="form-group">
                <label>Nombre de la categoría</label>
                <input 
                  type="text" 
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="Ej: Cafés" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Descripción (opcional)</label>
                <textarea 
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="Describe brevemente esta categoría"
                  rows="3"
                />
              </div>
              <div className="form-actions">
                {editingCategory && (
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={cancelEdit}
                  >
                    Cancelar
                  </button>
                )}
                <button type="submit" className="btn-primary">
                  {editingCategory ? 'Actualizar categoría' : 'Crear categoría'}
                </button>
              </div>
            </form>
          </div>

          <div className="form-container">
            <h3>{editingSubcategory ? 'Editar Subcategoría' : 'Nueva Subcategoría'}</h3>
            <form 
              onSubmit={editingSubcategory ? handleUpdateSubcategory : handleCreateSubcategory} 
              className="admin-form"
            >
              <div className="form-group">
                <label>Categoría padre</label>
                <select 
                  value={newSubcategory.categoryId}
                  onChange={(e) => setNewSubcategory({...newSubcategory, categoryId: e.target.value})}
                  required
                >
                  <option value="" disabled>Seleccione una categoría</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Nombre de la subcategoría</label>
                <input 
                  type="text" 
                  value={newSubcategory.name}
                  onChange={(e) => setNewSubcategory({...newSubcategory, name: e.target.value})}
                  placeholder="Ej: Cafés Fríos" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Descripción (opcional)</label>
                <textarea 
                  value={newSubcategory.description}
                  onChange={(e) => setNewSubcategory({...newSubcategory, description: e.target.value})}
                  placeholder="Describe brevemente esta subcategoría"
                  rows="3"
                />
              </div>
              <div className="form-actions">
                {editingSubcategory && (
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={cancelEdit}
                  >
                    Cancelar
                  </button>
                )}
                <button type="submit" className="btn-primary">
                  {editingSubcategory ? 'Actualizar subcategoría' : 'Crear subcategoría'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="create-product-form">
        <h2>Crear nuevo producto</h2>
        <form onSubmit={handleCreateProduct} className="admin-form">
          <div className="form-group">
            <label>Nombre del producto</label>
            <input 
              name="title" 
              placeholder="Ej: Café Americano" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea 
              name="description" 
              placeholder="Describe el producto" 
              rows="3"
              required 
            />
          </div>
          <div className="form-group">
            <label>Precio</label>
            <input 
              name="price" 
              type="number" 
              placeholder="0.00" 
              step="0.01" 
              min="0"
              required 
            />
          </div>
          <div className="form-group">
            <label>Asignar a</label>
            <div className="radio-group">
              <label className={`radio-option ${newProdAssignType === 'category' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="assignType"
                  checked={newProdAssignType === "category"}
                  onChange={() => setNewProdAssignType("category")}
                />
                <span>Categoría</span>
              </label>
              <label className={`radio-option ${newProdAssignType === 'subcategory' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="assignType"
                  checked={newProdAssignType === "subcategory"}
                  onChange={() => setNewProdAssignType("subcategory")}
                />
                <span>Subcategoría</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            {newProdAssignType === "category" ? (
              <div>
                <label>Categoría</label>
                <select
                  value={newProdCategoryId}
                  onChange={(e) => setNewProdCategoryId(e.target.value)}
                  required
                >
                  <option value="" disabled>Seleccione categoría</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label>Subcategoría</label>
                <select
                  value={newProdSubcategoryId}
                  onChange={(e) => setNewProdSubcategoryId(e.target.value)}
                  required
                >
                  <option value="" disabled>Seleccione subcategoría</option>
                  {subcategories.map((s) => {
                    const category = categories.find((c) => c._id === s.categoryId);
                    return (
                      <option key={s._id} value={s._id}>
                        {category ? `${category.name} / ` : ''}{s.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Código del producto</label>
            <input 
              name="code" 
              placeholder="Ej: CAF-001" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Imagen del producto</label>
            <div className="file-upload">
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                id="product-image"
                className="file-input"
                onChange={(e) => setNewProductImageFile(e.target.files[0] || null)}
              />
              <label htmlFor="product-image" className="file-label">
                <i className="fas fa-upload"></i>
                <span>Seleccionar imagen</span>
              </label>
            </div>
          </div>

          <div className="form-group switch-container">
            <label>Estado del producto</label>
            <label className="switch">
              <input name="status" type="checkbox" defaultChecked />
              <span className="slider"></span>
              <span className="switch-label">Activo</span>
            </label>
          </div>

          <div className="form-group">
            <div className="variations-header">
              <h3>Variaciones</h3>
              <small>Agrega variaciones como tamaños o sabores</small>
            </div>
            
            {variations.length > 0 && (
              <div className="variations-list">
                {variations.map((v, i) => (
                  <div key={i} className="variation-item">
                    <input
                      type="text"
                      placeholder="Ej: Grande"
                      value={v.nombre}
                      onChange={(e) => updateVariation(i, "nombre", e.target.value)}
                      className="variation-input"
                    />
                    <div className="variation-price">
                      <span>$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={v.precio}
                        onChange={(e) => updateVariation(i, "precio", e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <button 
                      type="button" 
                      className="btn-remove"
                      onClick={() => removeVariation(i)}
                      title="Eliminar variación"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button 
              type="button" 
              className="btn-variation" 
              onClick={addVariation}
            >
              <i className="fas fa-plus"></i> Agregar variación
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              <i className="fas fa-save"></i> Crear producto
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={(e) => {
                if (e.target.form) {
                  e.target.form.reset();
                }
                setVariations([]);
              }}
            >
              <i className="fas fa-undo"></i> Limpiar
            </button>
          </div>
        </form>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

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
                    <div style={{ display: "grid", gap: 6 }}>
                      <strong>Categoría/Subcategoría: </strong>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <label>
                          <input
                            type="radio"
                            checked={editedProduct.assignType === "category"}
                            onChange={() => setEditedProduct((prev) => ({ ...prev, assignType: "category", subcategoryId: "" }))}
                          />
                          Categoría
                        </label>
                        <label>
                          <input
                            type="radio"
                            checked={editedProduct.assignType === "subcategory"}
                            onChange={() => setEditedProduct((prev) => ({ ...prev, assignType: "subcategory", categoryId: "" }))}
                          />
                          Subcategoría
                        </label>
                      </div>
                      {editedProduct.assignType === "category" && (
                        <select
                          value={editedProduct.categoryId || ""}
                          onChange={(e) => setEditedProduct((prev) => ({ ...prev, categoryId: e.target.value }))}
                        >
                          <option value="">Seleccione categoría</option>
                          {categories.map((c) => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                          ))}
                        </select>
                      )}
                      {editedProduct.assignType === "subcategory" && (
                        <select
                          value={editedProduct.subcategoryId || ""}
                          onChange={(e) => setEditedProduct((prev) => ({ ...prev, subcategoryId: e.target.value }))}
                        >
                          <option value="">Seleccione subcategoría</option>
                          {subcategories.map((s) => (
                            <option key={s._id} value={s._id}>
                              {categories.find((c) => c._id === s.categoryId)?.name || ""} / {s.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
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
                      {p.image && (
                        <>
                          {editedProduct.image}
                          <button
                            type="button"
                            className="btn-inline danger"
                            onClick={() =>
                              setEditedProduct((prev) => ({
                                ...prev,
                                image: null,
                                removeImage: true
                              }))
                            }
                          >
                            ❌
                          </button>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setEditedProduct((prev) => ({
                            ...prev,
                            newImageFile: e.target.files[0] || null,
                          }))
                        }
                        style={{ display: "block", marginTop: "6px" }}
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
