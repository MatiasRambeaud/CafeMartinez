import subcategoriesModel from "../models/subcategory.model.js";

export default class SubcategoriesDao {
  get() {
    return subcategoriesModel.find();
  }
  getById(id) {
    return subcategoriesModel.findById(id);
  }
  getByCategoryId(categoryId) {
    return subcategoriesModel.find({ categoryId });
  }
  create(data) {
    return subcategoriesModel.create(data);
  }
  update(id, data) {
    return subcategoriesModel.findByIdAndUpdate(id, data, { new: true });
  }
  delete(id) {
    return subcategoriesModel.findByIdAndDelete(id);
  }
}
