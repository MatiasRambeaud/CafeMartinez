import { CategoriesService, SubcategoriesService, ProductsService } from "../services/repositories.js";

const getSubcategories = async (req, res) => {
  const result = await SubcategoriesService.getSubcategories();
  return res.sendPayload(null, result);
};

const getSubcategoryById = async (req, res) => {
  const { id } = req.params;
  const result = await SubcategoriesService.getSubcategoryById(id);
  if (!result) return res.sendBadRequest("Subcategoría no encontrada");
  return res.sendPayload(null, result);
};

const getByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  const result = await SubcategoriesService.getSubcategoriesByCategoryId(categoryId);
  return res.sendPayload(null, result);
};

const createSubcategory = async (req, res) => {
  try {
    const { name, description, categoryId } = req.body;
    if (!name || !categoryId) return res.sendBadRequest("Nombre y categoría requeridos");
    const cat = await CategoriesService.getCategoryById(categoryId);
    if (!cat) return res.sendBadRequest("Categoría inválida");
    const created = await SubcategoriesService.createSubcategory({ name, description, categoryId });
    return res.sendPayload("Subcategoría creada", created);
  } catch (e) {
    return res.sendServerError("Error creando subcategoría");
  }
};

const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId } = req.body;
    if (categoryId) {
      const cat = await CategoriesService.getCategoryById(categoryId);
      if (!cat) return res.sendBadRequest("Categoría inválida");
    }
    const updated = await SubcategoriesService.updateSubcategory(id, { name, description, categoryId });
    return res.sendPayload("Subcategoría actualizada", updated);
  } catch (e) {
    return res.sendServerError("Error actualizando subcategoría");
  }
};

const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    // Cascade delete products under this subcategory
    await ProductsService.deleteMany({ subcategoryId: id });
    await SubcategoriesService.deleteSubcategory(id);
    return res.sendPayload("Subcategoría eliminada");
  } catch (e) {
    return res.sendServerError("Error eliminando subcategoría");
  }
};

export default {
  getSubcategories,
  getSubcategoryById,
  getByCategoryId,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
