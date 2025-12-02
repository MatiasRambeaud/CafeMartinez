import categoriesModel from "../models/category.model.js";

export default class CategoriesDao {
  get() {
    return categoriesModel.find();
  }
  getById(id) {
    return categoriesModel.findById(id);
  }
  create(data) {
    return categoriesModel.create(data);
  }
  update(id, data) {
    return categoriesModel.findByIdAndUpdate(id, data, { new: true });
  }
  delete(id) {
    return categoriesModel.findByIdAndDelete(id);
  }
}
