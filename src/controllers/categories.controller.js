import { CategoriesService, SubcategoriesService, ProductsService } from "../services/repositories.js";

const getCategories = async (req, res) => {
  const result = await CategoriesService.getCategories();
  return res.sendPayload(null, result);
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  const result = await CategoriesService.getCategoryById(id);
  if (!result) return res.sendBadRequest("Categoría no encontrada");
  return res.sendPayload(null, result);
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.sendBadRequest("Nombre requerido");
    const created = await CategoriesService.createCategory({ name, description });
    return res.sendPayload("Categoría creada", created);
  } catch (e) {
    return res.sendServerError("Error creando categoría");
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updated = await CategoriesService.updateCategory(id, { name, description });
    return res.sendPayload("Categoría actualizada", updated);
  } catch (e) {
    return res.sendServerError("Error actualizando categoría");
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // Check subcategories
    const subs = await SubcategoriesService.getSubcategoriesByCategoryId(id);
    if (subs && subs.length > 0) {
      return res.status(400).send({ status: "error", error: "This Category cannot be deleted because it still contains products or subcategories." });
    }
    // Check products directly in this category
    const prodsInCat = await ProductsService.find({ categoryId: id });
    if (prodsInCat && prodsInCat.length > 0) {
      return res.status(400).send({ status: "error", error: "This Category cannot be deleted because it still contains products or subcategories." });
    }
    await CategoriesService.deleteCategory(id);
    return res.sendPayload("Categoría eliminada");
  } catch (e) {
    return res.sendServerError("Error eliminando categoría");
  }
};

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
