export default class SubcategoriesRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getSubcategories() {
    return this.dao.get();
  }
  getSubcategoryById(id) {
    return this.dao.getById(id);
  }
  getSubcategoriesByCategoryId(categoryId) {
    return this.dao.getByCategoryId(categoryId);
  }
  createSubcategory(data) {
    return this.dao.create(data);
  }
  updateSubcategory(id, data) {
    return this.dao.update(id, data);
  }
  deleteSubcategory(id) {
    return this.dao.delete(id);
  }
}
