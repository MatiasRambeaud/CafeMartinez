export default class CategoriesRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getCategories() {
    return this.dao.get();
  }
  getCategoryById(id) {
    return this.dao.getById(id);
  }
  createCategory(data) {
    return this.dao.create(data);
  }
  updateCategory(id, data) {
    return this.dao.update(id, data);
  }
  deleteCategory(id) {
    return this.dao.delete(id);
  }
}
